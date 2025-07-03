import type { User } from "@/types/auth"

// Storage keys
const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  REFRESH_TOKEN: "refresh_token",
  USER_DATA: "user_data",
  SESSION_EXPIRY: "session_expiry",
  REMEMBER_ME: "remember_me",
  LAST_ACTIVITY: "last_activity",
  DEVICE_ID: "device_id",
} as const

// Cookie keys (for server-side access)
const COOKIE_KEYS = {
  AUTH_TOKEN: "auth_token",
  USER_TYPE: "user_type",
  SESSION_EXPIRY: "session_expiry",
} as const

// Session configuration
export const SESSION_CONFIG = {
  // Token expiry times (in milliseconds)
  ACCESS_TOKEN_EXPIRY: 24 * 60 * 60 * 1000, // 24 hours
  REFRESH_TOKEN_EXPIRY: 7 * 24 * 60 * 60 * 1000, // 7 days
  REMEMBER_ME_EXPIRY: 30 * 24 * 60 * 60 * 1000, // 30 days

  // Activity timeout (15 minutes of inactivity)
  ACTIVITY_TIMEOUT: 15 * 60 * 1000,

  // Auto-refresh token when it expires in less than this time
  REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutes
} as const

// Device fingerprinting for security
const generateDeviceId = (): string => {
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")
  if (ctx) {
    ctx.textBaseline = "top"
    ctx.font = "14px Arial"
    ctx.fillText("Device fingerprint", 2, 2)
  }

  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + "x" + screen.height,
    new Date().getTimezoneOffset(),
    canvas.toDataURL(),
  ].join("|")

  // Simple hash function
  let hash = 0
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }

  return Math.abs(hash).toString(36)
}

// Cookie utilities
const setCookie = (name: string, value: string, expiresAt: number, rememberMe = false) => {
  if (typeof document === "undefined") return

  const expires = new Date(rememberMe ? Date.now() + SESSION_CONFIG.REMEMBER_ME_EXPIRY : expiresAt)
  const secure = window.location.protocol === "https:"

  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/; ${secure ? "secure; " : ""}samesite=lax`
}

const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null

  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(";").shift()
    return cookieValue ? decodeURIComponent(cookieValue) : null
  }
  return null
}

const deleteCookie = (name: string) => {
  if (typeof document === "undefined") return
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}

// Session data interface
export interface SessionData {
  user: User
  accessToken: string
  refreshToken: string
  expiresAt: number
  rememberMe: boolean
  deviceId: string
  lastActivity: number
}

// Storage utilities
export class SessionStorage {
  private static instance: SessionStorage
  private deviceId: string

  private constructor() {
    this.deviceId = this.getOrCreateDeviceId()
    this.setupActivityTracking()
  }

  static getInstance(): SessionStorage {
    if (!SessionStorage.instance) {
      SessionStorage.instance = new SessionStorage()
    }
    return SessionStorage.instance
  }

  // Get or create device ID for security
  private getOrCreateDeviceId(): string {
    if (typeof window === "undefined") return ""

    let deviceId = localStorage.getItem(STORAGE_KEYS.DEVICE_ID)
    if (!deviceId) {
      deviceId = generateDeviceId()
      localStorage.setItem(STORAGE_KEYS.DEVICE_ID, deviceId)
    }
    return deviceId
  }

  // Setup activity tracking
  private setupActivityTracking(): void {
    if (typeof window === "undefined") return

    const updateActivity = () => {
      this.updateLastActivity()
    }

    // Track user activity
    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart", "click"]
    events.forEach((event) => {
      document.addEventListener(event, updateActivity, { passive: true })
    })

    // Update activity every minute
    setInterval(updateActivity, 60 * 1000)
  }

  // Save session data (both localStorage and cookies)
  saveSession(sessionData: Omit<SessionData, "deviceId" | "lastActivity">): void {
    if (typeof window === "undefined") return

    try {
      const fullSessionData: SessionData = {
        ...sessionData,
        deviceId: this.deviceId,
        lastActivity: Date.now(),
      }

      // Store in localStorage
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, sessionData.accessToken)
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, sessionData.refreshToken)
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(sessionData.user))
      localStorage.setItem(STORAGE_KEYS.SESSION_EXPIRY, sessionData.expiresAt.toString())
      localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, sessionData.rememberMe.toString())
      localStorage.setItem(STORAGE_KEYS.LAST_ACTIVITY, Date.now().toString())

      // Store in cookies for server-side access
      setCookie(COOKIE_KEYS.AUTH_TOKEN, sessionData.accessToken, sessionData.expiresAt, sessionData.rememberMe)
      setCookie(COOKIE_KEYS.USER_TYPE, sessionData.user.userType, sessionData.expiresAt, sessionData.rememberMe)
      setCookie(
        COOKIE_KEYS.SESSION_EXPIRY,
        sessionData.expiresAt.toString(),
        sessionData.expiresAt,
        sessionData.rememberMe,
      )

      // Dispatch session saved event
      window.dispatchEvent(new CustomEvent("sessionSaved", { detail: fullSessionData }))
    } catch (error) {
      console.error("Failed to save session:", error)
      throw new Error("Failed to save session data")
    }
  }

  // Load session data
  loadSession(): SessionData | null {
    if (typeof window === "undefined") return null

    try {
      const accessToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
      const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA)
      const expiryStr = localStorage.getItem(STORAGE_KEYS.SESSION_EXPIRY)
      const rememberMeStr = localStorage.getItem(STORAGE_KEYS.REMEMBER_ME)
      const lastActivityStr = localStorage.getItem(STORAGE_KEYS.LAST_ACTIVITY)

      // Check if all required data exists
      if (!accessToken || !refreshToken || !userData || !expiryStr) {
        return null
      }

      const user = JSON.parse(userData) as User
      const expiresAt = Number.parseInt(expiryStr, 10)
      const rememberMe = rememberMeStr === "true"
      const lastActivity = lastActivityStr ? Number.parseInt(lastActivityStr, 10) : Date.now()

      return {
        user,
        accessToken,
        refreshToken,
        expiresAt,
        rememberMe,
        deviceId: this.deviceId,
        lastActivity,
      }
    } catch (error) {
      console.error("Failed to load session:", error)
      this.clearSession()
      return null
    }
  }

  // Update user data in session
  updateUser(user: User): void {
    if (typeof window === "undefined") return

    try {
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user))
      this.updateLastActivity()

      // Update user type cookie
      const expiryStr = localStorage.getItem(STORAGE_KEYS.SESSION_EXPIRY)
      const rememberMeStr = localStorage.getItem(STORAGE_KEYS.REMEMBER_ME)
      if (expiryStr) {
        const expiresAt = Number.parseInt(expiryStr, 10)
        const rememberMe = rememberMeStr === "true"
        setCookie(COOKIE_KEYS.USER_TYPE, user.userType, expiresAt, rememberMe)
      }

      // Dispatch user updated event
      window.dispatchEvent(new CustomEvent("userUpdated", { detail: user }))
    } catch (error) {
      console.error("Failed to update user data:", error)
    }
  }

  // Update tokens
  updateTokens(accessToken: string, refreshToken: string, expiresAt: number): void {
    if (typeof window === "undefined") return

    try {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, accessToken)
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
      localStorage.setItem(STORAGE_KEYS.SESSION_EXPIRY, expiresAt.toString())
      this.updateLastActivity()

      // Update auth token cookie
      const rememberMeStr = localStorage.getItem(STORAGE_KEYS.REMEMBER_ME)
      const rememberMe = rememberMeStr === "true"
      setCookie(COOKIE_KEYS.AUTH_TOKEN, accessToken, expiresAt, rememberMe)
      setCookie(COOKIE_KEYS.SESSION_EXPIRY, expiresAt.toString(), expiresAt, rememberMe)

      // Dispatch tokens updated event
      window.dispatchEvent(
        new CustomEvent("tokensUpdated", {
          detail: { accessToken, refreshToken, expiresAt },
        }),
      )
    } catch (error) {
      console.error("Failed to update tokens:", error)
    }
  }

  // Update last activity timestamp
  updateLastActivity(): void {
    if (typeof window === "undefined") return

    try {
      localStorage.setItem(STORAGE_KEYS.LAST_ACTIVITY, Date.now().toString())
    } catch (error) {
      console.error("Failed to update last activity:", error)
    }
  }

  // Clear session data (both localStorage and cookies)
  clearSession(): void {
    if (typeof window === "undefined") return

    try {
      // Remove localStorage items
      Object.values(STORAGE_KEYS).forEach((key) => {
        if (key !== STORAGE_KEYS.DEVICE_ID) {
          // Keep device ID
          localStorage.removeItem(key)
        }
      })

      // Remove cookies
      Object.values(COOKIE_KEYS).forEach((key) => {
        deleteCookie(key)
      })

      // Dispatch session cleared event
      window.dispatchEvent(new CustomEvent("sessionCleared"))
    } catch (error) {
      console.error("Failed to clear session:", error)
    }
  }

  // Check if session exists
  hasSession(): boolean {
    if (typeof window === "undefined") return false

    return !!(
      localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) &&
      localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN) &&
      localStorage.getItem(STORAGE_KEYS.USER_DATA)
    )
  }

  // Get current access token
  getAccessToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
  }

  // Get current refresh token
  getRefreshToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
  }

  // Get current user
  getCurrentUser(): User | null {
    if (typeof window === "undefined") return null

    try {
      const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA)
      return userData ? JSON.parse(userData) : null
    } catch (error) {
      console.error("Failed to get current user:", error)
      return null
    }
  }

  // Check if session is expired
  isSessionExpired(): boolean {
    if (typeof window === "undefined") return true

    const expiryStr = localStorage.getItem(STORAGE_KEYS.SESSION_EXPIRY)
    if (!expiryStr) return true

    const expiresAt = Number.parseInt(expiryStr, 10)
    return Date.now() >= expiresAt
  }

  // Check if session needs refresh
  needsRefresh(): boolean {
    if (typeof window === "undefined") return false

    const expiryStr = localStorage.getItem(STORAGE_KEYS.SESSION_EXPIRY)
    if (!expiryStr) return false

    const expiresAt = Number.parseInt(expiryStr, 10)
    return Date.now() >= expiresAt - SESSION_CONFIG.REFRESH_THRESHOLD
  }

  // Check if user has been inactive too long
  isInactive(): boolean {
    if (typeof window === "undefined") return false

    const lastActivityStr = localStorage.getItem(STORAGE_KEYS.LAST_ACTIVITY)
    if (!lastActivityStr) return false

    const lastActivity = Number.parseInt(lastActivityStr, 10)
    return Date.now() - lastActivity > SESSION_CONFIG.ACTIVITY_TIMEOUT
  }

  // Get session info for debugging
  getSessionInfo(): {
    hasSession: boolean
    isExpired: boolean
    needsRefresh: boolean
    isInactive: boolean
    expiresIn: number
    lastActivity: number
  } {
    const expiryStr = localStorage.getItem(STORAGE_KEYS.SESSION_EXPIRY)
    const lastActivityStr = localStorage.getItem(STORAGE_KEYS.LAST_ACTIVITY)

    const expiresAt = expiryStr ? Number.parseInt(expiryStr, 10) : 0
    const lastActivity = lastActivityStr ? Number.parseInt(lastActivityStr, 10) : 0

    return {
      hasSession: this.hasSession(),
      isExpired: this.isSessionExpired(),
      needsRefresh: this.needsRefresh(),
      isInactive: this.isInactive(),
      expiresIn: Math.max(0, expiresAt - Date.now()),
      lastActivity,
    }
  }
}

// Export singleton instance
export const sessionStorage = SessionStorage.getInstance()

// Utility functions
export const getStoredSession = (): SessionData | null => {
  return sessionStorage.loadSession()
}

export const saveSession = (sessionData: Omit<SessionData, "deviceId" | "lastActivity">): void => {
  sessionStorage.saveSession(sessionData)
}

export const clearStoredSession = (): void => {
  sessionStorage.clearSession()
}

export const isSessionValid = (): boolean => {
  return sessionStorage.hasSession() && !sessionStorage.isSessionExpired() && !sessionStorage.isInactive()
}

export const shouldRefreshToken = (): boolean => {
  return sessionStorage.hasSession() && sessionStorage.needsRefresh()
}

// Session validation with detailed results
export interface SessionValidationResult {
  isValid: boolean
  hasSession: boolean
  isExpired: boolean
  isInactive: boolean
  needsRefresh: boolean
  reason?: string
}

export const validateSession = (): SessionValidationResult => {
  const hasSession = sessionStorage.hasSession()
  const isExpired = sessionStorage.isSessionExpired()
  const isInactive = sessionStorage.isInactive()
  const needsRefresh = sessionStorage.needsRefresh()

  let reason: string | undefined
  let isValid = true

  if (!hasSession) {
    isValid = false
    reason = "No session found"
  } else if (isExpired) {
    isValid = false
    reason = "Session expired"
  } else if (isInactive) {
    isValid = false
    reason = "User inactive too long"
  }

  return {
    isValid,
    hasSession,
    isExpired,
    isInactive,
    needsRefresh,
    reason,
  }
}

// Event listeners for session management
export const addSessionEventListener = (
  event: "sessionSaved" | "sessionCleared" | "userUpdated" | "tokensUpdated",
  callback: (event: CustomEvent) => void,
): (() => void) => {
  if (typeof window === "undefined") return () => {}

  window.addEventListener(event, callback as EventListener)

  return () => {
    window.removeEventListener(event, callback as EventListener)
  }
}
