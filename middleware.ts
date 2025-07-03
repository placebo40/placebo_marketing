import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define public routes that don't require authentication
const PUBLIC_ROUTES = [
  "/",
  "/about",
  "/services",
  "/services/sellers",
  "/services/buyers",
  "/services/businesses",
  "/contact",
  "/cars",
  "/pricing",
  "/terms",
  "/privacy",
  "/buyer-faqs",
  "/vehicle-inspections-okinawa",
  "/verification-info",
  "/appraisal-info",
  "/compliance-info",
  "/financing",
  "/inspection",
  "/login",
  "/signup",
  "/forgot-password",
  "/unauthorized",
  "/request-listing",
]

// Define API routes and static files that should be excluded from middleware
const EXCLUDED_PATHS = ["/api", "/_next", "/favicon.ico", "/images", "/placeholder.svg", "/public"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for API routes, static files, and Next.js internals
  if (EXCLUDED_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Allow access to all public routes without authentication
  if (PUBLIC_ROUTES.includes(pathname) || pathname.startsWith("/cars/")) {
    return NextResponse.next()
  }

  // Get session data from cookies
  const sessionToken = request.cookies.get("auth_token")?.value
  const userType = request.cookies.get("user_type")?.value

  // Check if user is authenticated for protected routes
  const isAuthenticated = !!sessionToken

  // Handle protected routes that require authentication
  if (!isAuthenticated) {
    // Redirect to login for protected routes
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Handle role-based access for authenticated users
  if (userType) {
    // Admin routes
    if (pathname.startsWith("/admin")) {
      if (userType !== "admin") {
        return NextResponse.redirect(new URL("/unauthorized", request.url))
      }
    }

    // Seller routes
    if (
      pathname.startsWith("/seller-dashboard") ||
      pathname.startsWith("/seller-registration") ||
      pathname.startsWith("/list-car")
    ) {
      if (!["seller", "dealer", "admin"].includes(userType)) {
        return NextResponse.redirect(new URL("/unauthorized", request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images)
     * - placeholder.svg (placeholder images)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|images|placeholder.svg|public).*)",
  ],
}
