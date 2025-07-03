"use client"

import type { ReactNode } from "react"
import { useAuth } from "@/contexts/auth-context"
import { usePermission } from "@/hooks/use-permission"
import type { User } from "@/types/auth"
import type { Permission } from "@/hooks/use-permission"

// Loading component
function AuthGuardLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-placebo-gold mx-auto mb-4"></div>
        <p className="text-gray-600">Checking authentication...</p>
      </div>
    </div>
  )
}

// Unauthorized component
function UnauthorizedAccess({
  message = "You don't have permission to access this page.",
  showLogin = false,
}: {
  message?: string
  showLogin?: boolean
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="space-y-3">
          <button
            onClick={() => window.history.back()}
            className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            Go Back
          </button>
          {showLogin && (
            <a
              href="/login"
              className="block w-full bg-placebo-gold text-placebo-black px-4 py-2 rounded-md hover:bg-placebo-gold/90 transition-colors font-medium"
            >
              Sign In
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

// Auth guard props
interface AuthGuardProps {
  children: ReactNode
  requireAuth?: boolean
  requiredRole?: User["userType"]
  requiredPermission?: Permission
  requiredPermissions?: Permission[]
  requireAllPermissions?: boolean
  fallback?: ReactNode
  loadingComponent?: ReactNode
  unauthorizedComponent?: ReactNode
}

// Main auth guard component
export function AuthGuard({
  children,
  requireAuth = true,
  requiredRole,
  requiredPermission,
  requiredPermissions,
  requireAllPermissions = false,
  fallback,
  loadingComponent,
  unauthorizedComponent,
}: AuthGuardProps) {
  const { user, isAuthenticated, isInitialized } = useAuth()
  const { hasPermission, hasRole, hasAllPermissions, hasAnyPermission } = usePermission()

  // Show loading while initializing
  if (!isInitialized) {
    return loadingComponent || <AuthGuardLoading />
  }

  // Check authentication requirement
  if (requireAuth && !isAuthenticated) {
    if (fallback) return <>{fallback}</>
    return unauthorizedComponent || <UnauthorizedAccess showLogin />
  }

  // Check role requirement
  if (requiredRole && !hasRole(requiredRole)) {
    if (fallback) return <>{fallback}</>
    return unauthorizedComponent || <UnauthorizedAccess message={`This page requires ${requiredRole} access.`} />
  }

  // Check single permission requirement
  if (requiredPermission && !hasPermission(requiredPermission)) {
    if (fallback) return <>{fallback}</>
    return (
      unauthorizedComponent || (
        <UnauthorizedAccess message="You don't have the required permissions to access this page." />
      )
    )
  }

  // Check multiple permissions requirement
  if (requiredPermissions && requiredPermissions.length > 0) {
    const hasRequiredPermissions = requireAllPermissions
      ? hasAllPermissions(requiredPermissions)
      : hasAnyPermission(requiredPermissions)

    if (!hasRequiredPermissions) {
      if (fallback) return <>{fallback}</>
      return (
        unauthorizedComponent || (
          <UnauthorizedAccess message="You don't have the required permissions to access this page." />
        )
      )
    }
  }

  // All checks passed, render children
  return <>{children}</>
}

// Convenience components for common use cases
export function AdminGuard({ children, ...props }: Omit<AuthGuardProps, "requiredRole">) {
  return (
    <AuthGuard requiredRole="admin" {...props}>
      {children}
    </AuthGuard>
  )
}

export function SellerGuard({ children, ...props }: Omit<AuthGuardProps, "requiredRole">) {
  return (
    <AuthGuard requiredRole="seller" {...props}>
      {children}
    </AuthGuard>
  )
}

export function DealerGuard({ children, ...props }: Omit<AuthGuardProps, "requiredRole">) {
  return (
    <AuthGuard requiredRole="dealer" {...props}>
      {children}
    </AuthGuard>
  )
}

export function GuestGuard({ children, ...props }: Omit<AuthGuardProps, "requiredRole">) {
  return (
    <AuthGuard requiredRole="guest" {...props}>
      {children}
    </AuthGuard>
  )
}

// Hook for programmatic auth checking
export function useAuthGuard() {
  const { user, isAuthenticated, isInitialized } = useAuth()
  const { hasPermission, hasRole } = usePermission()

  const checkAccess = (requirements: {
    requireAuth?: boolean
    requiredRole?: User["userType"]
    requiredPermission?: Permission
  }) => {
    if (!isInitialized) return { canAccess: false, reason: "loading" }

    if (requirements.requireAuth && !isAuthenticated) {
      return { canAccess: false, reason: "not_authenticated" }
    }

    if (requirements.requiredRole && !hasRole(requirements.requiredRole)) {
      return { canAccess: false, reason: "insufficient_role" }
    }

    if (requirements.requiredPermission && !hasPermission(requirements.requiredPermission)) {
      return { canAccess: false, reason: "insufficient_permission" }
    }

    return { canAccess: true, reason: "authorized" }
  }

  return { checkAccess, isInitialized }
}
