"use client"

import type { ReactNode } from "react"
import { useRequireAuth } from "@/contexts/auth-context"
import type { User } from "@/types/auth"
import { RouteGuard } from "./route-guard"
import { Shield, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: User["userType"]
  fallback?: ReactNode
  requireVerification?: boolean
  requirePayment?: boolean
}

export function ProtectedRoute({
  children,
  requiredRole,
  fallback,
  requireVerification = false,
  requirePayment = false,
}: ProtectedRouteProps) {
  const auth = useRequireAuth(requiredRole)

  // Additional checks for verification and payment
  if (auth.isAuthenticated && auth.user) {
    // Check verification requirement
    if (requireVerification && auth.user.userType === "seller") {
      const sellerProfile = auth.user.sellerProfile
      if (!sellerProfile || sellerProfile.verificationStatus !== "verified") {
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="text-center max-w-md">
              <Shield className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Verification Required</h2>
              <p className="text-gray-600 mb-6">You need to verify your identity before accessing this feature.</p>
              <Button asChild>
                <Link href="/seller-dashboard/verify-identity">Verify Identity</Link>
              </Button>
            </div>
          </div>
        )
      }
    }

    // Check payment requirement
    if (requirePayment && auth.user.userType === "seller") {
      const sellerProfile = auth.user.sellerProfile
      if (!sellerProfile || !sellerProfile.paymentStatus || sellerProfile.paymentStatus !== "active") {
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="text-center max-w-md">
              <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Payment Required</h2>
              <p className="text-gray-600 mb-6">Please complete your payment to access this feature.</p>
              <Button asChild>
                <Link href="/seller-registration/payment">Complete Payment</Link>
              </Button>
            </div>
          </div>
        )
      }
    }
  }

  return <RouteGuard fallback={fallback}>{children}</RouteGuard>
}
