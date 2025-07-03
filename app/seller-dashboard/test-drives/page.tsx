"use client"

import { useEffect } from "react"
import { Clock, CheckCircle, XCircle, AlertCircle, Calendar } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { useTestDrive } from "@/contexts/test-drive-context"
import SellerTestDriveManager from "@/components/seller-test-drive-manager"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SellerTestDrivesPage() {
  const { language } = useLanguage()
  const { user } = useAuth()
  const { state, getRequestsForSeller, getRequestsByStatus } = useTestDrive()

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Get seller's email from auth context
  const sellerEmail = user?.email || "seller@example.com" // Fallback for demo

  // Get statistics for this seller
  const sellerRequests = getRequestsForSeller(sellerEmail)
  const stats = {
    total: sellerRequests.length,
    pending: getRequestsByStatus(sellerEmail, "sent").length,
    confirmed: getRequestsByStatus(sellerEmail, "confirmed").length,
    completed: getRequestsByStatus(sellerEmail, "completed").length,
    cancelled: getRequestsByStatus(sellerEmail, "cancelled").length,
  }

  const getStatColor = (type: string) => {
    switch (type) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatIcon = (type: string) => {
    switch (type) {
      case "pending":
        return <Clock className="h-5 w-5" />
      case "confirmed":
        return <CheckCircle className="h-5 w-5" />
      case "completed":
        return <CheckCircle className="h-5 w-5" />
      case "cancelled":
        return <XCircle className="h-5 w-5" />
      default:
        return <AlertCircle className="h-5 w-5" />
    }
  }

  return (
    <ProtectedRoute requiredRole="seller">
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {language === "en" ? "Test Drive Management" : "試乗管理"}
            </h1>
            <p className="text-gray-600">
              {language === "en"
                ? "Manage and respond to test drive requests from potential buyers"
                : "潜在的な購入者からの試乗リクエストを管理・対応"}
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {language === "en" ? "Total Requests" : "総リクエスト数"}
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">
                  {language === "en" ? "All time requests" : "全期間のリクエスト"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{language === "en" ? "Pending" : "保留中"}</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                <p className="text-xs text-muted-foreground">{language === "en" ? "Awaiting response" : "返答待ち"}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{language === "en" ? "Confirmed" : "確認済み"}</CardTitle>
                <CheckCircle className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.confirmed}</div>
                <p className="text-xs text-muted-foreground">
                  {language === "en" ? "Scheduled appointments" : "予約済み"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{language === "en" ? "Completed" : "完了"}</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                <p className="text-xs text-muted-foreground">
                  {language === "en" ? "Finished test drives" : "完了した試乗"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Show loading state */}
          {state.isLoading && (
            <Card className="mb-8">
              <CardContent className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500">
                  {language === "en" ? "Loading test drive requests..." : "試乗リクエストを読み込み中..."}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Show error state */}
          {state.error && (
            <Card className="mb-8">
              <CardContent className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <p className="text-red-600">{state.error}</p>
              </CardContent>
            </Card>
          )}

          {/* Main Test Drive Manager */}
          <SellerTestDriveManager />
        </div>
      </div>
    </ProtectedRoute>
  )
}
