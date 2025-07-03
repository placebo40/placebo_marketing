"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import type { User } from "@/types/auth"

// Redirect configuration
interface RedirectConfig {
  authenticated: string
  unauthenticated: string
  byRole?: Partial<Record<User["userType"], string>>
}

// Default redirects by user type
const DEFAULT_REDIRECTS: Record<User["userType"], string> = {
  admin: "/admin",
  dealer: "/seller-dashboard",
  seller: "/seller-dashboard",
  guest: "/guest-dashboard",
}

// Hook for handling authentication redirects
export function useAuthRedirect(config?: Partial<RedirectConfig>) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isAuthenticated, isInitialized } = useAuth()

  useEffect(() => {
    if (!isInitialized) return

    const redirectParam = searchParams.get("redirect")

    if (isAuthenticated && user) {
      // User is authenticated, redirect to appropriate page
      let redirectTo: string

      if (redirectParam && isValidRedirectUrl(redirectParam)) {
        // Use redirect parameter if valid
        redirectTo = redirectParam
      } else if (config?.byRole?.[user.userType]) {
        // Use role-specific redirect from config
        redirectTo = config.byRole[user.userType]
      } else if (config?.authenticated) {
        // Use general authenticated redirect from config
        redirectTo = config.authenticated
      } else {
        // Use default redirect for user type
        redirectTo = DEFAULT_REDIRECTS[user.userType]
      }

      router.replace(redirectTo)
    } else if (!isAuthenticated) {
      // User is not authenticated
      const redirectTo = config?.unauthenticated || "/login"

      // Add current path as redirect parameter if not already on auth pages
      const currentPath = window.location.pathname
      if (!isAuthPage(currentPath) && currentPath !== "/") {
        const url = new URL(redirectTo, window.location.origin)
        url.searchParams.set("redirect", currentPath)
        router.replace(url.pathname + url.search)
      } else {
        router.replace(redirectTo)
      }
    }
  }, [isAuthenticated, user, isInitialized, router, searchParams, config])

  return { isRedirecting: !isInitialized }
}

// Hook for guest-only pages (redirect if authenticated)
export function useGuestOnlyRedirect() {
  const router = useRouter()
  const { user, isAuthenticated, isInitialized } = useAuth()

  useEffect(() => {
    if (!isInitialized) return

    if (isAuthenticated && user) {
      const redirectTo = DEFAULT_REDIRECTS[user.userType]
      router.replace(redirectTo)
    }
  }, [isAuthenticated, user, isInitialized, router])

  return { isRedirecting: isAuthenticated && isInitialized }
}

// Hook for protected pages (redirect if not authenticated)
export function useProtectedRedirect(requiredRole?: User["userType"]) {
  const router = useRouter()
  const { user, isAuthenticated, isInitialized, hasPermission } = useAuth()

  useEffect(() => {
    if (!isInitialized) return

    if (!isAuthenticated) {
      // Not authenticated, redirect to login
      const currentPath = window.location.pathname
      const loginUrl = new URL("/login", window.location.origin)
      loginUrl.searchParams.set("redirect", currentPath)
      router.replace(loginUrl.pathname + loginUrl.search)
    } else if (requiredRole && !hasPermission(requiredRole)) {
      // Authenticated but insufficient permissions
      router.replace("/unauthorized")
    }
  }, [isAuthenticated, user, isInitialized, router, requiredRole, hasPermission])

  return {
    isRedirecting: !isInitialized || !isAuthenticated || (requiredRole && !hasPermission(requiredRole)),
  }
}

// Utility functions
function isValidRedirectUrl(url: string): boolean {
  try {
    // Only allow relative URLs or same-origin URLs
    if (url.startsWith("/")) return true

    const parsedUrl = new URL(url)
    return parsedUrl.origin === window.location.origin
  } catch {
    return false
  }
}

function isAuthPage(path: string): boolean {
  const authPages = ["/login", "/signup", "/forgot-password", "/reset-password"]
  return authPages.some((page) => path.startsWith(page))
}

// Hook for handling post-login redirects
export function usePostLoginRedirect() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleRedirect = (user: User) => {
    const redirectParam = searchParams.get("redirect")

    let redirectTo: string

    if (redirectParam && isValidRedirectUrl(redirectParam)) {
      redirectTo = redirectParam
    } else {
      redirectTo = DEFAULT_REDIRECTS[user.userType]
    }

    router.replace(redirectTo)
  }

  return { handleRedirect }
}
