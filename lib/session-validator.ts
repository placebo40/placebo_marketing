import type { User } from "@/types/auth"
import { sessionStorage, type SessionData, SESSION_CONFIG } from "./session-storage"
import { authAPI } from "./auth-api"

// Session validation states
export type SessionState =
  | "valid"
  | "expired"
  | "inactive"
  | "invalid"
  | "refresh_needed"
  | "refresh_failed"
  | "no_session"

// Session validation result
export interface SessionValidationResult {
  state: SessionState
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  expiresAt: number | null
  message: string
  shouldRedirect: boolean
  redirectTo?: string
}

// Session validator class
export class SessionValidator {
  private static instance: SessionValidator
  private isValidating = false
  private validationPromise: Promise<SessionValidationResult> | null = null

  private constructor() {}

  static getInstance(): SessionValidator {
    if (!SessionValidator.instance) {
      SessionValidator.instance = new SessionValidator()
    }
    return SessionValidator.instance
  }

  // Main session validation method
  async validateSession(forceRefresh = false): Promise<SessionValidationResult> {
    // Prevent concurrent validations
    if (this.isValidating && this.validationPromise && !forceRefresh) {
      return this.validationPromise
    }

    this.isValidating = true
    this.validationPromise = this.performValidation(forceRefresh)

    try {
      const result = await this.validationPromise
      this.isValidating = false
      this.validationPromise = null
      return result
    } catch (error) {
      this.isValidating = false
      this.validationPromise = null
      throw error
    }
  }

  private async performValidation(forceRefresh: boolean): Promise<SessionValidationResult> {
    try {
      // Check if session exists in storage
      const sessionData = sessionStorage.loadSession()

      if (!sessionData) {
        return {
          state: "no_session",
          user: null,
          accessToken: null,
          refreshToken: null,
          expiresAt: null,
          message: "No session found",
          shouldRedirect: true,
          redirectTo: "/login",
        }
      }

      const now = Date.now()
      const { user, accessToken, refreshToken, expiresAt, lastActivity } = sessionData

      // Check if session is expired
      if (now >= expiresAt) {
        return await this.handleExpiredSession(sessionData)
      }

      // Check for inactivity timeout
      if (now - lastActivity > SESSION_CONFIG.ACTIVITY_TIMEOUT) {
        sessionStorage.clearSession()
        return {
          state: "inactive",
          user: null,
          accessToken: null,
          refreshToken: null,
          expiresAt: null,
          message: "Session expired due to inactivity",
          shouldRedirect: true,
          redirectTo: "/login",
        }
      }

      // Check if token needs refresh or force refresh
      const needsRefresh = now >= expiresAt - SESSION_CONFIG.REFRESH_THRESHOLD
      if (needsRefresh || forceRefresh) {
        return await this.handleTokenRefresh(sessionData)
      }

      // Validate token with server (optional - can be expensive)
      if (forceRefresh) {
        const serverUser = await authAPI.getCurrentUser(accessToken)
        if (!serverUser) {
          sessionStorage.clearSession()
          return {
            state: "invalid",
            user: null,
            accessToken: null,
            refreshToken: null,
            expiresAt: null,
            message: "Session invalid on server",
            shouldRedirect: true,
            redirectTo: "/login",
          }
        }

        // Update user data if it changed on server
        if (JSON.stringify(serverUser) !== JSON.stringify(user)) {
          sessionStorage.updateUser(serverUser)
        }
      }

      // Session is valid
      sessionStorage.updateLastActivity()

      return {
        state: "valid",
        user,
        accessToken,
        refreshToken,
        expiresAt,
        message: "Session is valid",
        shouldRedirect: false,
      }
    } catch (error) {
      console.error("Session validation error:", error)
      sessionStorage.clearSession()

      return {
        state: "invalid",
        user: null,
        accessToken: null,
        refreshToken: null,
        expiresAt: null,
        message: "Session validation failed",
        shouldRedirect: true,
        redirectTo: "/login",
      }
    }
  }

  private async handleExpiredSession(sessionData: SessionData): Promise<SessionValidationResult> {
    // Try to refresh the token
    try {
      const refreshResult = await authAPI.refreshToken(sessionData.refreshToken)

      if (refreshResult) {
        const newExpiresAt = Date.now() + SESSION_CONFIG.ACCESS_TOKEN_EXPIRY

        // Update session with new tokens
        sessionStorage.updateTokens(refreshResult.token, refreshResult.refreshToken, newExpiresAt)

        return {
          state: "refresh_needed",
          user: sessionData.user,
          accessToken: refreshResult.token,
          refreshToken: refreshResult.refreshToken,
          expiresAt: newExpiresAt,
          message: "Session refreshed successfully",
          shouldRedirect: false,
        }
      }
    } catch (error) {
      console.error("Token refresh failed:", error)
    }

    // Refresh failed, clear session
    sessionStorage.clearSession()

    return {
      state: "refresh_failed",
      user: null,
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
      message: "Session expired and refresh failed",
      shouldRedirect: true,
      redirectTo: "/login",
    }
  }

  private async handleTokenRefresh(sessionData: SessionData): Promise<SessionValidationResult> {
    try {
      const refreshResult = await authAPI.refreshToken(sessionData.refreshToken)

      if (refreshResult) {
        const newExpiresAt = Date.now() + SESSION_CONFIG.ACCESS_TOKEN_EXPIRY

        // Update session with new tokens
        sessionStorage.updateTokens(refreshResult.token, refreshResult.refreshToken, newExpiresAt)

        return {
          state: "valid",
          user: sessionData.user,
          accessToken: refreshResult.token,
          refreshToken: refreshResult.refreshToken,
          expiresAt: newExpiresAt,
          message: "Token refreshed successfully",
          shouldRedirect: false,
        }
      }
    } catch (error) {
      console.error("Token refresh failed:", error)
    }

    // If refresh fails but session isn't expired yet, continue with current token
    if (Date.now() < sessionData.expiresAt) {
      return {
        state: "valid",
        user: sessionData.user,
        accessToken: sessionData.accessToken,
        refreshToken: sessionData.refreshToken,
        expiresAt: sessionData.expiresAt,
        message: "Token refresh failed but session still valid",
        shouldRedirect: false,
      }
    }

    // Session expired and refresh failed
    sessionStorage.clearSession()

    return {
      state: "refresh_failed",
      user: null,
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
      message: "Token refresh failed and session expired",
      shouldRedirect: true,
      redirectTo: "/login",
    }
  }

  // Quick session check without server validation
  quickValidate(): SessionValidationResult {
    const sessionData = sessionStorage.loadSession()

    if (!sessionData) {
      return {
        state: "no_session",
        user: null,
        accessToken: null,
        refreshToken: null,
        expiresAt: null,
        message: "No session found",
        shouldRedirect: true,
        redirectTo: "/login",
      }
    }

    const now = Date.now()
    const { user, accessToken, refreshToken, expiresAt, lastActivity } = sessionData

    // Check expiration
    if (now >= expiresAt) {
      return {
        state: "expired",
        user,
        accessToken,
        refreshToken,
        expiresAt,
        message: "Session expired",
        shouldRedirect: false, // Let full validation handle refresh
      }
    }

    // Check inactivity
    if (now - lastActivity > SESSION_CONFIG.ACTIVITY_TIMEOUT) {
      return {
        state: "inactive",
        user,
        accessToken,
        refreshToken,
        expiresAt,
        message: "Session inactive",
        shouldRedirect: true,
        redirectTo: "/login",
      }
    }

    // Check if refresh needed
    if (now >= expiresAt - SESSION_CONFIG.REFRESH_THRESHOLD) {
      return {
        state: "refresh_needed",
        user,
        accessToken,
        refreshToken,
        expiresAt,
        message: "Token refresh needed",
        shouldRedirect: false,
      }
    }

    return {
      state: "valid",
      user,
      accessToken,
      refreshToken,
      expiresAt,
      message: "Session valid",
      shouldRedirect: false,
    }
  }

  // Check if user has required permissions
  hasPermission(user: User | null, requiredRole: User["userType"]): boolean {
    if (!user) return false

    const roleHierarchy: Record<User["userType"], number> = {
      guest: 1,
      seller: 2,
      dealer: 3,
      admin: 4,
    }

    return roleHierarchy[user.userType] >= roleHierarchy[requiredRole]
  }

  // Check if user can access a specific route
  canAccessRoute(user: User | null, route: string): boolean {
    if (!user) return false

    // Define route permissions
    const routePermissions: Record<string, User["userType"][]> = {
      "/guest-dashboard": ["guest", "seller", "dealer", "admin"],
      "/seller-dashboard": ["seller", "dealer", "admin"],
      "/admin": ["admin"],
      "/dealer": ["dealer", "admin"],
    }

    const allowedRoles = routePermissions[route]
    if (!allowedRoles) return true // Public route

    return allowedRoles.includes(user.userType)
  }
}

// Export singleton instance
export const sessionValidator = SessionValidator.getInstance()

// Utility functions
export const validateCurrentSession = async (forceRefresh = false): Promise<SessionValidationResult> => {
  return sessionValidator.validateSession(forceRefresh)
}

export const quickSessionCheck = (): SessionValidationResult => {
  return sessionValidator.quickValidate()
}

export const hasPermission = (user: User | null, requiredRole: User["userType"]): boolean => {
  return sessionValidator.hasPermission(user, requiredRole)
}

export const canAccessRoute = (user: User | null, route: string): boolean => {
  return sessionValidator.canAccessRoute(user, route)
}

// Session monitoring hook for React components
export const useSessionMonitor = () => {
  if (typeof window === "undefined") return null

  // Set up automatic session validation
  const startMonitoring = () => {
    // Check session every 5 minutes
    const interval = setInterval(
      async () => {
        try {
          const result = await validateCurrentSession()
          if (result.shouldRedirect && result.redirectTo) {
            window.location.href = result.redirectTo
          }
        } catch (error) {
          console.error("Session monitoring error:", error)
        }
      },
      5 * 60 * 1000,
    )

    return () => clearInterval(interval)
  }

  return { startMonitoring }
}
