"use client"

import type { ReactNode } from "react"

interface RouteGuardProps {
  children: ReactNode
  fallback?: ReactNode
  requireAuth?: boolean
}

export function RouteGuard({ children, fallback, requireAuth = false }: RouteGuardProps) {
  // For now, just render children without any authentication checks
  // This prevents blocking public routes
  return <>{children}</>
}

// Also export as default for compatibility
export default RouteGuard
