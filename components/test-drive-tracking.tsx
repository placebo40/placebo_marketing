"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  Clock,
  MapPin,
  Car,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  MessageCircle,
  Download,
  ExternalLink,
} from "lucide-react"
import { useTestDrive } from "@/contexts/test-drive-context"
import { useLanguage } from "@/contexts/language-context"
import { useToast } from "@/hooks/use-toast"
import { downloadICSFile, getGoogleCalendarUrl } from "@/lib/calendar-utils"
import type { TestDriveRequest, TestDriveStatus } from "@/types/test-drive"

export default function TestDriveTracking() {
  const { state, retryFailedRequest, syncOfflineRequests } = useTestDrive()
  const { language } = useLanguage()
  const { toast } = useToast()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("all")
  const [isRetrying, setIsRetrying] = useState<string | null>(null)

  // Filter requests by status
  const filterRequestsByStatus = (status?: TestDriveStatus) => {
    if (!status) return state.requests
    return state.requests.filter((req) => req.status === status)
  }

  const getStatusColor = (status: TestDriveStatus) => {
    switch (status) {
      case "sent":
        return "bg-green-100 text-green-800 border-green-200"
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "completed":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      case "failed":
        return "bg-red-100 text-red-800 border-red-200"
      case "sending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: TestDriveStatus) => {
    switch (status) {
      case "sent":
        return <CheckCircle className="h-4 w-4" />
      case "confirmed":
        return <Calendar className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "cancelled":
        return <XCircle className="h-4 w-4" />
      case "failed":
        return <AlertCircle className="h-4 w-4" />
      case "sending":
        return <RefreshCw className="h-4 w-4 animate-spin" />
      case "draft":
        return <Clock className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusText = (status: TestDriveStatus) => {
    const statusMap = {
      sent: language === "en" ? "Sent" : "送信済み",
      confirmed: language === "en" ? "Confirmed" : "確認済み",
      completed: language === "en" ? "Completed" : "完了",
      cancelled: language === "en" ? "Cancelled" : "キャンセル",
      failed: language === "en" ? "Failed" : "失敗",
      sending: language === "en" ? "Sending..." : "送信中...",
      draft: language === "en" ? "Draft" : "下書き",
    }
    return statusMap[status] || status
  }

  const handleRetry = async (requestId: string) => {
    setIsRetrying(requestId)
    try {
      await retryFailedRequest(requestId)
      toast({
        title: language === "en" ? "Request Resent" : "リクエスト再送信",
        description:
          language === "en"
            ? "Test drive request has been resent successfully."
            : "試乗リクエストが正常に再送信されました。",
      })
    } catch (error) {
      toast({
        title: language === "en" ? "Retry Failed" : "再送信失敗",
        description:
          language === "en"
            ? "Failed to resend the request. Please try again."
            : "リクエストの再送信に失敗しました。もう一度お試しください。",
        variant: "destructive",
      })
    } finally {
      setIsRetrying(null)
    }
  }

  const handleSyncOffline = async () => {
    try {
      await syncOfflineRequests()
      toast({
        title: language === "en" ? "Sync Complete" : "同期完了",
        description:
          language === "en" ? "Offline requests have been synchronized." : "オフラインリクエストが同期されました。",
      })
    } catch (error) {
      toast({
        title: language === "en" ? "Sync Failed" : "同期失敗",
        description:
          language === "en" ? "Failed to sync offline requests." : "オフラインリクエストの同期に失敗しました。",
        variant: "destructive",
      })
    }
  }

  const generateCalendarEvent = (request: TestDriveRequest) => {
    const startDate = new Date(`${request.buyerData.preferredDate}T${request.buyerData.preferredTime}:00`)
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000)

    return {
      title: `Test Drive - ${request.vehicleTitle}`,
      description: `Test drive appointment for ${request.vehicleTitle}

Meeting Location: ${request.buyerData.meetingLocation === "custom" ? request.buyerData.customLocation : request.buyerData.meetingLocation}

Seller: ${request.sellerName}
Vehicle: ${request.vehicleTitle}
Price: ¥${request.vehiclePrice?.toLocaleString()}

Notes: ${request.buyerData.additionalNotes || "None"}`,
      startDate,
      endDate,
      location:
        request.buyerData.meetingLocation === "custom"
          ? request.buyerData.customLocation
          : request.buyerData.meetingLocation,
      attendees: [request.buyerData.email],
    }
  }

  const handleDownloadCalendar = (request: TestDriveRequest) => {
    const event = generateCalendarEvent(request)
    downloadICSFile(event, `test-drive-${request.id}.ics`)
  }

  const handleAddToGoogleCalendar = (request: TestDriveRequest) => {
    const event = generateCalendarEvent(request)
    window.open(getGoogleCalendarUrl(event), "_blank")
  }

  const handleContactSeller = (request: TestDriveRequest) => {
    router.push(`/guest-dashboard?tab=messages&thread=${request.vehicleId}`)
  }

  const renderRequestCard = (request: TestDriveRequest) => (
    <Card key={request.id} className="mb-4">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold">{request.vehicleTitle}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Car className="h-4 w-4" />¥{request.vehiclePrice?.toLocaleString()}
            </CardDescription>
          </div>
          <Badge className={getStatusColor(request.status)}>
            {getStatusIcon(request.status)}
            <span className="ml-1">{getStatusText(request.status)}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Appointment Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="font-medium">{language === "en" ? "Date:" : "日付:"}</span>
              <span>
                {new Date(request.buyerData.preferredDate).toLocaleDateString(language === "en" ? "en-US" : "ja-JP", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="font-medium">{language === "en" ? "Time:" : "時間:"}</span>
              <span>
                {request.buyerData.preferredTime &&
                  new Date(`2000-01-01T${request.buyerData.preferredTime}:00`).toLocaleTimeString(
                    language === "en" ? "en-US" : "ja-JP",
                    {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    },
                  )}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="font-medium">{language === "en" ? "Location:" : "場所:"}</span>
              <span>
                {request.buyerData.meetingLocation === "custom"
                  ? request.buyerData.customLocation
                  : request.buyerData.meetingLocation}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-gray-500" />
              <span className="font-medium">{language === "en" ? "Seller:" : "売主:"}</span>
              <span>{request.sellerName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="font-medium">{language === "en" ? "Requested:" : "リクエスト日:"}</span>
              <span>{request.timestamp.toLocaleDateString()}</span>
            </div>
            {request.response && (
              <div className="flex items-center gap-2 text-sm">
                <AlertCircle className="h-4 w-4 text-gray-500" />
                <span className="font-medium">{language === "en" ? "Status:" : "ステータス:"}</span>
                <span className={request.response.success ? "text-green-600" : "text-red-600"}>
                  {request.response.message}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Additional Notes */}
        {request.buyerData.additionalNotes && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-1">
              {language === "en" ? "Additional Notes:" : "追加メモ:"}
            </p>
            <p className="text-sm text-gray-600">{request.buyerData.additionalNotes}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 pt-2">
          {request.status === "failed" && (
            <Button
              size="sm"
              onClick={() => handleRetry(request.id)}
              disabled={isRetrying === request.id}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isRetrying === request.id ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              {language === "en" ? "Retry" : "再試行"}
            </Button>
          )}

          {(request.status === "confirmed" || request.status === "sent") && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDownloadCalendar(request)}
                className="bg-transparent"
              >
                <Download className="h-4 w-4 mr-2" />
                {language === "en" ? "Download .ics" : ".icsダウンロード"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAddToGoogleCalendar(request)}
                className="bg-transparent"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                {language === "en" ? "Google Calendar" : "Googleカレンダー"}
              </Button>
            </>
          )}

          <Button size="sm" variant="outline" onClick={() => handleContactSeller(request)} className="bg-transparent">
            <MessageCircle className="h-4 w-4 mr-2" />
            {language === "en" ? "Contact Seller" : "売主に連絡"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  if (state.requests.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {language === "en" ? "Test Drive Requests" : "試乗リクエスト"}
          </CardTitle>
          <CardDescription>
            {language === "en" ? "Track your test drive appointments" : "試乗予約を追跡"}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {language === "en" ? "No Test Drive Requests" : "試乗リクエストなし"}
          </h3>
          <p className="text-gray-500 mb-4">
            {language === "en"
              ? "You haven't scheduled any test drives yet. Browse vehicles to get started."
              : "まだ試乗をスケジュールしていません。車両を閲覧して始めましょう。"}
          </p>
          <Button
            onClick={() => router.push("/cars")}
            className="bg-placebo-gold hover:bg-placebo-gold/90 text-placebo-black"
          >
            <Car className="h-4 w-4 mr-2" />
            {language === "en" ? "Browse Vehicles" : "車両を閲覧"}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {language === "en" ? "Test Drive Requests" : "試乗リクエスト"}
              </CardTitle>
              <CardDescription>
                {language === "en" ? "Track and manage your test drive appointments" : "試乗予約を追跡・管理"}
              </CardDescription>
            </div>
            {state.offlineQueue.length > 0 && (
              <Button size="sm" onClick={handleSyncOffline} className="bg-blue-600 hover:bg-blue-700 text-white">
                <RefreshCw className="h-4 w-4 mr-2" />
                {language === "en"
                  ? `Sync ${state.offlineQueue.length} Offline`
                  : `${state.offlineQueue.length}件をオフライン同期`}
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">
            {language === "en" ? "All" : "すべて"} ({state.requests.length})
          </TabsTrigger>
          <TabsTrigger value="sent">
            {language === "en" ? "Sent" : "送信済み"} ({filterRequestsByStatus("sent").length})
          </TabsTrigger>
          <TabsTrigger value="confirmed">
            {language === "en" ? "Confirmed" : "確認済み"} ({filterRequestsByStatus("confirmed").length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            {language === "en" ? "Completed" : "完了"} ({filterRequestsByStatus("completed").length})
          </TabsTrigger>
          <TabsTrigger value="failed">
            {language === "en" ? "Failed" : "失敗"} ({filterRequestsByStatus("failed").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {state.requests.map(renderRequestCard)}
        </TabsContent>

        <TabsContent value="sent" className="space-y-4">
          {filterRequestsByStatus("sent").length > 0 ? (
            filterRequestsByStatus("sent").map(renderRequestCard)
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">{language === "en" ? "No sent requests" : "送信済みリクエストなし"}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="confirmed" className="space-y-4">
          {filterRequestsByStatus("confirmed").length > 0 ? (
            filterRequestsByStatus("confirmed").map(renderRequestCard)
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">{language === "en" ? "No confirmed appointments" : "確認済み予約なし"}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {filterRequestsByStatus("completed").length > 0 ? (
            filterRequestsByStatus("completed").map(renderRequestCard)
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">{language === "en" ? "No completed test drives" : "完了した試乗なし"}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="failed" className="space-y-4">
          {filterRequestsByStatus("failed").length > 0 ? (
            filterRequestsByStatus("failed").map(renderRequestCard)
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">{language === "en" ? "No failed requests" : "失敗したリクエストなし"}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
