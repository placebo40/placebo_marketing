import type { User } from "@/types/auth"

export interface RouteConfig {
  path: string
  protection: "public" | "auth_required" | "guest_only" | "role_based"
  allowedRoles?: User["userType"][]
  requireVerification?: boolean
  requirePayment?: boolean
}

export const routeConfigs: RouteConfig[] = [
  // Public routes
  { path: "/", protection: "public" },
  { path: "/cars", protection: "public" },
  { path: "/cars/[id]", protection: "public" },
  { path: "/services", protection: "public" },
  { path: "/about", protection: "public" },
  { path: "/contact", protection: "public" },
  { path: "/pricing", protection: "public" },
  { path: "/terms", protection: "public" },
  { path: "/privacy", protection: "public" },
  { path: "/buyer-faqs", protection: "public" },
  { path: "/vehicle-inspections-okinawa", protection: "public" },
  { path: "/verification-info", protection: "public" },
  { path: "/appraisal-info", protection: "public" },
  { path: "/compliance-info", protection: "public" },
  { path: "/financing", protection: "public" },
  { path: "/inspection", protection: "public" },

  // Guest only routes (redirect authenticated users)
  { path: "/login", protection: "guest_only" },
  { path: "/signup", protection: "guest_only" },
  { path: "/request-listing", protection: "guest_only" },

  // Authentication required routes
  { path: "/profile", protection: "auth_required" },
  { path: "/guest-dashboard", protection: "auth_required" },
  { path: "/verification", protection: "auth_required" },

  // Role-based routes
  { path: "/seller-dashboard", protection: "role_based", allowedRoles: ["seller", "dealer", "admin"] },
  { path: "/seller-dashboard/[...slug]", protection: "role_based", allowedRoles: ["seller", "dealer", "admin"] },
  { path: "/seller-registration", protection: "role_based", allowedRoles: ["guest"] },
  { path: "/seller-registration/[...slug]", protection: "role_based", allowedRoles: ["guest"] },
  {
    path: "/list-car",
    protection: "role_based",
    allowedRoles: ["seller", "dealer", "admin"],
    requireVerification: true,
  },
  { path: "/admin", protection: "role_based", allowedRoles: ["admin"] },
  { path: "/admin/[...slug]", protection: "role_based", allowedRoles: ["admin"] },

  // Verification required routes
  { path: "/verification/seller", protection: "role_based", allowedRoles: ["seller", "dealer"] },
  { path: "/verification/dealer", protection: "role_based", allowedRoles: ["dealer"] },
]

export class RouteProtector {
  private static instance: RouteProtector
  private configs: RouteConfig[]

  private constructor() {
    this.configs = routeConfigs
  }

  public static getInstance(): RouteProtector {
    if (!RouteProtector.instance) {
      RouteProtector.instance = new RouteProtector()
    }
    return RouteProtector.instance
  }

  public getRouteConfig(pathname: string): RouteConfig | null {
    // First try exact match
    const exactMatch = this.configs.find((config) => config.path === pathname)
    if (exactMatch) return exactMatch

    // Then try dynamic route matching
    const dynamicMatch = this.configs.find((config) => {
      if (!config.path.includes("[")) return false

      const configParts = config.path.split("/")
      const pathParts = pathname.split("/")

      if (configParts.length !== pathParts.length && !config.path.includes("[...")) {
        return false
      }

      return configParts.every((part, index) => {
        if (part.startsWith("[") && part.endsWith("]")) return true
        if (part.startsWith("[...")) return true
        return part === pathParts[index]
      })
    })

    return dynamicMatch || null
  }

  public canAccess(
    pathname: string,
    user: User | null,
    isAuthenticated: boolean,
  ): { allowed: boolean; redirectTo?: string; reason?: string } {
    const config = this.getRouteConfig(pathname)

    if (!config) {
      return { allowed: true } // Allow access to unconfigured routes
    }

    switch (config.protection) {
      case "public":
        return { allowed: true }

      case "guest_only":
        if (isAuthenticated) {
          const redirectTo = this.getDefaultRedirectForUser(user)
          return {
            allowed: false,
            redirectTo,
            reason: "Already authenticated",
          }
        }
        return { allowed: true }

      case "auth_required":
        if (!isAuthenticated) {
          return {
            allowed: false,
            redirectTo: `/login?redirect=${encodeURIComponent(pathname)}`,
            reason: "Authentication required",
          }
        }
        return { allowed: true }

      case "role_based":
        if (!isAuthenticated) {
          return {
            allowed: false,
            redirectTo: `/login?redirect=${encodeURIComponent(pathname)}`,
            reason: "Authentication required",
          }
        }

        if (!user) {
          return {
            allowed: false,
            redirectTo: "/unauthorized",
            reason: "User data not available",
          }
        }

        if (config.allowedRoles && !config.allowedRoles.includes(user.userType)) {
          return {
            allowed: false,
            redirectTo: "/unauthorized",
            reason: "Insufficient role permissions",
          }
        }

        // Check verification requirement
        if (config.requireVerification && user.userType === "seller") {
          const sellerProfile = user.sellerProfile
          if (!sellerProfile || sellerProfile.verificationStatus !== "verified") {
            return {
              allowed: false,
              redirectTo: "/seller-dashboard/verify-identity",
              reason: "Verification required",
            }
          }
        }

        // Check payment requirement
        if (config.requirePayment && user.userType === "seller") {
          const sellerProfile = user.sellerProfile
          if (!sellerProfile || !sellerProfile.paymentStatus || sellerProfile.paymentStatus !== "active") {
            return {
              allowed: false,
              redirectTo: "/seller-registration/payment",
              reason: "Payment required",
            }
          }
        }

        return { allowed: true }

      default:
        return { allowed: true }
    }
  }

  private getDefaultRedirectForUser(user: User | null): string {
    if (!user) return "/"

    switch (user.userType) {
      case "admin":
        return "/admin"
      case "seller":
      case "dealer":
        return "/seller-dashboard"
      case "guest":
      default:
        return "/guest-dashboard"
    }
  }
}
