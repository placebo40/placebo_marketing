"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, ArrowLeft, Home, LogIn } from "lucide-react"
import Link from "next/link"

export default function UnauthorizedPage() {
  const router = useRouter()
  const auth = useAuth()

  useEffect(() => {
    // Scroll to top
    window.scrollTo(0, 0)
  }, [])

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push("/")
    }
  }

  const getRecommendedAction = () => {
    if (!auth.isAuthenticated) {
      return {
        text: "Sign In",
        href: "/login",
        icon: LogIn,
        description: "Sign in to access more features",
      }
    }

    switch (auth.user?.userType) {
      case "guest":
        return {
          text: "Go to Guest Dashboard",
          href: "/guest-dashboard",
          icon: Home,
          description: "Access your guest dashboard",
        }
      case "seller":
      case "dealer":
        return {
          text: "Go to Seller Dashboard",
          href: "/seller-dashboard",
          icon: Home,
          description: "Access your seller dashboard",
        }
      case "admin":
        return {
          text: "Go to Admin Dashboard",
          href: "/admin",
          icon: Home,
          description: "Access your admin dashboard",
        }
      default:
        return {
          text: "Go to Homepage",
          href: "/",
          icon: Home,
          description: "Return to the homepage",
        }
    }
  }

  const recommendedAction = getRecommendedAction()
  const RecommendedIcon = recommendedAction.icon

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <Shield className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Access Denied</CardTitle>
          <CardDescription className="text-base">
            You don't have permission to access this page. This could be because:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">•</span>
              <span>You need a different account type to access this feature</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">•</span>
              <span>Your account needs additional verification</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">•</span>
              <span>This page is restricted to certain user roles</span>
            </li>
          </ul>

          <div className="space-y-3">
            <Button asChild className="w-full bg-placebo-gold hover:bg-placebo-gold/90 text-placebo-black">
              <Link href={recommendedAction.href}>
                <RecommendedIcon className="h-4 w-4 mr-2" />
                {recommendedAction.text}
              </Link>
            </Button>

            <Button variant="outline" onClick={handleGoBack} className="w-full bg-transparent">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>

            <Button asChild variant="ghost" className="w-full">
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Homepage
              </Link>
            </Button>
          </div>

          {auth.isAuthenticated && auth.user && (
            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                Signed in as: {auth.user.firstName} {auth.user.lastName} ({auth.user.userType})
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
