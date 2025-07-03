"use client"

import type React from "react"

import { useMemo } from "react"
import { useAuth } from "@/contexts/auth-context"
import type { User } from "@/types/auth"

// Permission types
export type Permission =
  | "view_dashboard"
  | "manage_listings"
  | "view_messages"
  | "send_messages"
  | "manage_profile"
  | "view_analytics"
  | "manage_users"
  | "manage_system"
  | "verify_users"
  | "manage_payments"
  | "view_reports"
  | "manage_inspections"
  | "manage_appraisals"

// Role-based permissions
const ROLE_PERMISSIONS: Record<User["userType"], Permission[]> = {
  guest: ["view_dashboard", "view_messages", "send_messages", "manage_profile"],
  seller: [
    "view_dashboard",
    "manage_listings",
    "view_messages",
    "send_messages",
    "manage_profile",
    "view_analytics",
    "manage_inspections",
    "manage_appraisals",
  ],
  dealer: [
    "view_dashboard",
    "manage_listings",
    "view_messages",
    "send_messages",
    "manage_profile",
    "view_analytics",
    "manage_inspections",
    "manage_appraisals",
    "manage_payments",
    "view_reports",
  ],
  admin: [
    "view_dashboard",
    "manage_listings",
    "view_messages",
    "send_messages",
    "manage_profile",
    "view_analytics",
    "manage_users",
    "manage_system",
    "verify_users",
    "manage_payments",
    "view_reports",
    "manage_inspections",
    "manage_appraisals",
  ],
}

// Feature flags based on user status
export interface FeatureFlags {
  canListCars: boolean
  canViewAnalytics: boolean
  canManageUsers: boolean
  canAccessPremiumFeatures: boolean
  canVerifyOthers: boolean
  requiresVerification: boolean
  requiresPayment: boolean
}

// Hook for checking permissions
export function usePermission() {
  const { user, isAuthenticated } = useAuth()

  const hasPermission = (permission: Permission): boolean => {
    if (!isAuthenticated || !user) return false

    const userPermissions = ROLE_PERMISSIONS[user.userType] || []
    return userPermissions.includes(permission)
  }

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return permissions.some((permission) => hasPermission(permission))
  }

  const hasAllPermissions = (permissions: Permission[]): boolean => {
    return permissions.every((permission) => hasPermission(permission))
  }

  const hasRole = (role: User["userType"]): boolean => {
    if (!isAuthenticated || !user) return false
    return user.userType === role
  }

  const hasAnyRole = (roles: User["userType"][]): boolean => {
    if (!isAuthenticated || !user) return false
    return roles.includes(user.userType)
  }

  const isMinimumRole = (minimumRole: User["userType"]): boolean => {
    if (!isAuthenticated || !user) return false

    const roleHierarchy: Record<User["userType"], number> = {
      guest: 1,
      seller: 2,
      dealer: 3,
      admin: 4,
    }

    return roleHierarchy[user.userType] >= roleHierarchy[minimumRole]
  }

  const featureFlags = useMemo((): FeatureFlags => {
    if (!isAuthenticated || !user) {
      return {
        canListCars: false,
        canViewAnalytics: false,
        canManageUsers: false,
        canAccessPremiumFeatures: false,
        canVerifyOthers: false,
        requiresVerification: false,
        requiresPayment: false,
      }
    }

    return {
      canListCars: hasPermission("manage_listings"),
      canViewAnalytics: hasPermission("view_analytics"),
      canManageUsers: hasPermission("manage_users"),
      canAccessPremiumFeatures: user.verificationLevel === "premium" || user.verificationLevel === "dealership",
      canVerifyOthers: hasPermission("verify_users"),
      requiresVerification: user.userType === "seller" && !user.isVerified,
      requiresPayment: user.userType === "dealer" && user.status === "pending",
    }
  }, [user, isAuthenticated])

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    isMinimumRole,
    featureFlags,
    userPermissions: user ? ROLE_PERMISSIONS[user.userType] : [],
  }
}

// Hook for conditional rendering based on permissions
export function useConditionalRender() {
  const { hasPermission, hasRole, isMinimumRole } = usePermission()

  const renderIfPermission = (permission: Permission, component: React.ReactNode) => {
    return hasPermission(permission) ? component : null
  }

  const renderIfRole = (role: User["userType"], component: React.ReactNode) => {
    return hasRole(role) ? component : null
  }

  const renderIfMinimumRole = (minimumRole: User["userType"], component: React.ReactNode) => {
    return isMinimumRole(minimumRole) ? component : null
  }

  const renderIfAnyRole = (roles: User["userType"][], component: React.ReactNode) => {
    const { hasAnyRole } = usePermission()
    return hasAnyRole(roles) ? component : null
  }

  return {
    renderIfPermission,
    renderIfRole,
    renderIfMinimumRole,
    renderIfAnyRole,
  }
}
