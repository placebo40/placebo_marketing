"use client"

import type { ReactNode } from "react"
import { useGuestOnly } from "@/contexts/auth-context"
import { RouteGuard } from "./route-guard"

interface GuestOnlyRouteProps {
  children: ReactNode
  fallback?: ReactNode
}

export function GuestOnlyRoute({ children, fallback }: GuestOnlyRouteProps) {
  useGuestOnly()

  return <RouteGuard fallback={fallback}>{children}</RouteGuard>
}
