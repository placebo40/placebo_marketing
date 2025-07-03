import type { User } from "@/types/auth"

// User display utilities
export function getUserDisplayName(user: User | null): string {
  if (!user) return "Guest"

  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`
  }

  if (user.firstName) {
    return user.firstName
  }

  return user.email || "User"
}

export function getUserInitials(user: User | null): string {
  if (!user) return "G"

  if (user.firstName && user.lastName) {
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
  }

  if (user.firstName) {
    return user.firstName[0].toUpperCase()
  }

  if (user.email) {
    return user.email[0].toUpperCase()
  }

  return "U"
}

// User status utilities
export function getUserStatusColor(status: User["status"]): string {
  switch (status) {
    case "active":
      return "green"
    case "pending":
      return "yellow"
    case "suspended":
      return "orange"
    case "banned":
      return "red"
    default:
      return "gray"
  }
}

export function getUserStatusLabel(status: User["status"]): string {
  switch (status) {
    case "active":
      return "Active"
    case "pending":
      return "Pending Approval"
    case "suspended":
      return "Suspended"
    case "banned":
      return "Banned"
    default:
      return "Unknown"
  }
}

// Verification utilities
export function getVerificationLevelColor(level?: User["verificationLevel"]): string {
  switch (level) {
    case "basic":
      return "blue"
    case "premium":
      return "purple"
    case "dealership":
      return "gold"
    case "none":
    default:
      return "gray"
  }
}

export function getVerificationLevelLabel(level?: User["verificationLevel"]): string {
  switch (level) {
    case "basic":
      return "Basic Verified"
    case "premium":
      return "Premium Verified"
    case "dealership":
      return "Dealership Verified"
    case "none":
    default:
      return "Not Verified"
  }
}

// Role utilities
export function getRoleColor(role: User["userType"]): string {
  switch (role) {
    case "admin":
      return "red"
    case "dealer":
      return "purple"
    case "seller":
      return "blue"
    case "guest":
      return "green"
    default:
      return "gray"
  }
}

export function getRoleLabel(role: User["userType"]): string {
  switch (role) {
    case "admin":
      return "Administrator"
    case "dealer":
      return "Dealer"
    case "seller":
      return "Seller"
    case "guest":
      return "Guest"
    default:
      return "Unknown"
  }
}

// Permission checking utilities
export function canUserAccessRoute(user: User | null, route: string): boolean {
  if (!user) return false

  // Define route access rules
  const routeAccess: Record<string, User["userType"][]> = {
    "/admin": ["admin"],
    "/seller-dashboard": ["seller", "dealer", "admin"],
    "/guest-dashboard": ["guest", "seller", "dealer", "admin"],
    "/dealer": ["dealer", "admin"],
  }

  const allowedRoles = routeAccess[route]
  if (!allowedRoles) return true // Public route

  return allowedRoles.includes(user.userType)
}

export function getUserDashboardRoute(user: User | null): string {
  if (!user) return "/login"

  switch (user.userType) {
    case "admin":
      return "/admin"
    case "dealer":
    case "seller":
      return "/seller-dashboard"
    case "guest":
    default:
      return "/guest-dashboard"
  }
}

// Validation utilities
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password: string): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long")
  }

  if (!/(?=.*[a-z])/.test(password)) {
    errors.push("Password must contain at least one lowercase letter")
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push("Password must contain at least one uppercase letter")
  }

  if (!/(?=.*\d)/.test(password)) {
    errors.push("Password must contain at least one number")
  }

  if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(password)) {
    errors.push("Password must contain at least one special character")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function validatePhone(phone: string): boolean {
  if (!phone) return true // Phone is optional

  // Basic phone validation - allows various formats
  const phoneRegex = /^\+?[\d\s\-()]+$/
  return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 10
}

// Date utilities
export function formatUserDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  } catch {
    return "Unknown"
  }
}

export function formatUserDateTime(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch {
    return "Unknown"
  }
}

export function getRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) {
      return "Just now"
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours} hour${hours > 1 ? "s" : ""} ago`
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400)
      return `${days} day${days > 1 ? "s" : ""} ago`
    } else {
      return formatUserDate(dateString)
    }
  } catch {
    return "Unknown"
  }
}

// Error handling utilities
export function getAuthErrorMessage(error: any): string {
  if (typeof error === "string") {
    return error
  }

  if (error?.message) {
    return error.message
  }

  if (error?.errors) {
    // Handle validation errors
    const firstError = Object.values(error.errors)[0]
    if (Array.isArray(firstError) && firstError.length > 0) {
      return firstError[0]
    }
  }

  return "An unexpected error occurred"
}

// Local storage utilities for auth
export function clearAuthStorage(): void {
  if (typeof window === "undefined") return

  const authKeys = ["auth_token", "refresh_token", "user_data", "session_expiry", "remember_me", "last_activity"]

  authKeys.forEach((key) => {
    localStorage.removeItem(key)
    sessionStorage.removeItem(key)
  })
}

// URL utilities
export function getRedirectUrl(fallback = "/"): string {
  if (typeof window === "undefined") return fallback

  const urlParams = new URLSearchParams(window.location.search)
  const redirect = urlParams.get("redirect")

  if (redirect && isValidRedirectUrl(redirect)) {
    return redirect
  }

  return fallback
}

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
