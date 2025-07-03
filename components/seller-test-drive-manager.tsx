"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageCircle,
  Edit,
  Eye,
  Filter,
  Search,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { useTestDrive } from "@/contexts/test-drive-context"
import type { TestDriveRequest, TestDriveStatus } from "@/types/test-drive"

export default function SellerTestDriveManager() {
  const [activeTab, setActiveTab] = useState("pending")
  const [selectedRequest, setSelectedRequest] = useState<TestDriveRequest | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false)
  const [responseType, setResponseType] = useState<"confirm" | "reschedule" | "decline">("confirm")
  const [responseMessage, setResponseMessage] = useState("")
  const [rescheduleDate, setRescheduleDate] = useState("")
  const [rescheduleTime, setRescheduleTime] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<TestDriveStatus | "all">("all")

  const { toast } = useToast()
  const { language } = useLanguage()
  const { user } = useAuth()
  const { state, getRequestsForSeller, getRequestsByStatus, respondToTestDrive, clearError } = useTestDrive()

  // Get seller's email from auth context
  const sellerEmail = user?.email || "seller@example.com" // Fallback for demo

  // Get requests for this seller
  const sellerRequests = getRequestsForSeller(sellerEmail)

  // Filter requests based on tab, search, and status
  const filteredRequests = sellerRequests.filter((request) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "pending" && ["sent"].includes(request.status)) ||
      (activeTab === "confirmed" && request.status === "confirmed") ||
      (activeTab === "completed" && request.status === "completed") ||
      (activeTab === "cancelled" && request.status === "cancelled")

    const matchesSearch =
      request.buyerData.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.vehicleTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.buyerData.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || request.status === statusFilter

    return matchesTab && matchesSearch && matchesStatus
  })

  // Clear any errors when component mounts
  useEffect(() => {
    clearError()
  }, [clearError])

  const getStatusColor = (status: TestDriveStatus) => {
    switch (status) {
      case "sent":
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

  const getStatusIcon = (status: TestDriveStatus) => {
    switch (status) {
      case "sent":
        return <Clock className="h-4 w-4" />
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "cancelled":
        return <XCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getStatusText = (status: TestDriveStatus) => {
    const statusMap = {
      sent: language === "en" ? "Pending Response" : "返答待ち",
      confirmed: language === "en" ? "Confirmed" : "確認済み",
      completed: language === "en" ? "Completed" : "完了",
      cancelled: language === "en" ? "Cancelled" : "キャンセル",
      failed: language === "en" ? "Failed" : "失敗",
      sending: language === "en" ? "Sending..." : "送信中...",
      draft: language === "en" ? "Draft" : "下書き",
      rescheduled: language === "en" ? "Rescheduled" : "再スケジュール",
    }
    return statusMap[status] || status
  }

  const handleViewDetails = (request: TestDriveRequest) => {
    setSelectedRequest(request)
    setIsDetailModalOpen(true)
  }

  const handleRespond = (request: TestDriveRequest, type: "confirm" | "reschedule" | "decline") => {
    setSelectedRequest(request)
    setResponseType(type)
    setResponseMessage("")
    setRescheduleDate("")
    setRescheduleTime("")
    setIsResponseModalOpen(true)
  }

  const handleSubmitResponse = async () => {
    if (!selectedRequest) return

    try {
      let message = responseMessage

      if (responseType === "confirm") {
        message =
          message ||
          (language === "en"
            ? "Test drive confirmed! Looking forward to meeting you."
            : "試乗が確認されました！お会いできるのを楽しみにしています。")
      } else if (responseType === "decline") {
        message =
          message ||
          (language === "en"
            ? "Unfortunately, I cannot accommodate this test drive request."
            : "申し訳ございませんが、この試乗リクエストにお応えできません。")
      }

      const rescheduleData =
        responseType === "reschedule" && rescheduleDate && rescheduleTime
          ? { date: rescheduleDate, time: rescheduleTime }
          : undefined

      await respondToTestDrive(selectedRequest.id, responseType, message, rescheduleData)

      toast({
        title: language === "en" ? "Response Sent" : "返答送信完了",
        description: language === "en" ? "Your response has been sent to the buyer." : "購入者に返答が送信されました。",
      })

      setIsResponseModalOpen(false)
      setSelectedRequest(null)
    } catch (error) {
      toast({
        title: language === "en" ? "Error" : "エラー",
        description:
          language === "en"
            ? "Failed to send response. Please try again."
            : "返答の送信に失敗しました。もう一度お試しください。",
        variant: "destructive",
      })
    }
  }

  const getTabCounts = () => {
    return {
      all: sellerRequests.length,
      pending: getRequestsByStatus(sellerEmail, "sent").length,
      confirmed: getRequestsByStatus(sellerEmail, "confirmed").length,
      completed: getRequestsByStatus(sellerEmail, "completed").length,
      cancelled: getRequestsByStatus(sellerEmail, "cancelled").length,
    }
  }

  const tabCounts = getTabCounts()

  const renderRequestCard = (request: TestDriveRequest) => (
    <Card key={request.id} className="mb-4">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold">{request.vehicleTitle}</CardTitle>
            <CardDescription className="flex items-center gap-4 mt-1">
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {request.buyerData.name}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(request.buyerData.preferredDate).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {request.buyerData.preferredTime}
              </span>
            </CardDescription>
          </div>
          <Badge className={getStatusColor(request.status)}>
            {getStatusIcon(request.status)}
            <span className="ml-1">{getStatusText(request.status)}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-gray-500" />
              <span>{request.buyerData.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-gray-500" />
              <span>{request.buyerData.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span>
                {request.buyerData.meetingLocation === "custom"
                  ? request.buyerData.customLocation
                  : request.buyerData.meetingLocation}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm">
              <span className="font-medium">{language === "en" ? "License:" : "免許:"}</span>
              <span className="ml-2">{request.buyerData.licenseType}</span>
            </div>
            <div className="text-sm">
              <span className="font-medium">{language === "en" ? "Experience:" : "経験:"}</span>
              <span className="ml-2">{request.buyerData.drivingExperience}</span>
            </div>
            <div className="text-sm">
              <span className="font-medium">{language === "en" ? "Requested:" : "リクエスト日:"}</span>
              <span className="ml-2">{request.timestamp.toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {request.buyerData.additionalNotes && (
          <div className="p-3 bg-gray-50 rounded-lg mb-4">
            <p className="text-sm font-medium text-gray-700 mb-1">
              {language === "en" ? "Buyer's Notes:" : "購入者のメモ:"}
            </p>
            <p className="text-sm text-gray-600">{request.buyerData.additionalNotes}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => handleViewDetails(request)} className="bg-transparent">
            <Eye className="h-4 w-4 mr-2" />
            {language === "en" ? "View Details" : "詳細表示"}
          </Button>

          {request.status === "sent" && (
            <>
              <Button
                size="sm"
                onClick={() => handleRespond(request, "confirm")}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {language === "en" ? "Confirm" : "確認"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleRespond(request, "reschedule")}
                className="bg-transparent"
              >
                <Edit className="h-4 w-4 mr-2" />
                {language === "en" ? "Reschedule" : "再スケジュール"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleRespond(request, "decline")}
                className="bg-transparent text-red-600 hover:text-red-700"
              >
                <XCircle className="h-4 w-4 mr-2" />
                {language === "en" ? "Decline" : "辞退"}
              </Button>
            </>
          )}

          <Button size="sm" variant="outline" className="bg-transparent">
            <MessageCircle className="h-4 w-4 mr-2" />
            {language === "en" ? "Message" : "メッセージ"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  // Show loading state
  if (state.isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">
              {language === "en" ? "Loading test drive requests..." : "試乗リクエストを読み込み中..."}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show error state
  if (state.error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{state.error}</p>
            <Button onClick={clearError} variant="outline">
              {language === "en" ? "Try Again" : "再試行"}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {language === "en" ? "Test Drive Requests" : "試乗リクエスト"}
          </CardTitle>
          <CardDescription>
            {language === "en"
              ? "Manage incoming test drive requests from potential buyers"
              : "潜在的な購入者からの試乗リクエストを管理"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={
                    language === "en" ? "Search by buyer name, vehicle, or email..." : "購入者名、車両、メールで検索..."
                  }
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as TestDriveStatus | "all")}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder={language === "en" ? "Filter by status" : "ステータスでフィルター"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === "en" ? "All Status" : "すべてのステータス"}</SelectItem>
                <SelectItem value="sent">{language === "en" ? "Pending" : "保留中"}</SelectItem>
                <SelectItem value="confirmed">{language === "en" ? "Confirmed" : "確認済み"}</SelectItem>
                <SelectItem value="completed">{language === "en" ? "Completed" : "完了"}</SelectItem>
                <SelectItem value="cancelled">{language === "en" ? "Cancelled" : "キャンセル"}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">
            {language === "en" ? "All" : "すべて"} ({tabCounts.all})
          </TabsTrigger>
          <TabsTrigger value="pending">
            {language === "en" ? "Pending" : "保留中"} ({tabCounts.pending})
          </TabsTrigger>
          <TabsTrigger value="confirmed">
            {language === "en" ? "Confirmed" : "確認済み"} ({tabCounts.confirmed})
          </TabsTrigger>
          <TabsTrigger value="completed">
            {language === "en" ? "Completed" : "完了"} ({tabCounts.completed})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            {language === "en" ? "Cancelled" : "キャンセル"} ({tabCounts.cancelled})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredRequests.length > 0 ? (
            filteredRequests.map(renderRequestCard)
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  {language === "en" ? "No test drive requests found" : "試乗リクエストが見つかりません"}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {filteredRequests.length > 0 ? (
            filteredRequests.map(renderRequestCard)
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">{language === "en" ? "No pending requests" : "保留中のリクエストなし"}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="confirmed" className="space-y-4">
          {filteredRequests.length > 0 ? (
            filteredRequests.map(renderRequestCard)
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">{language === "en" ? "No confirmed appointments" : "確認済み予約なし"}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {filteredRequests.length > 0 ? (
            filteredRequests.map(renderRequestCard)
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">{language === "en" ? "No completed test drives" : "完了した試乗なし"}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          {filteredRequests.length > 0 ? (
            filteredRequests.map(renderRequestCard)
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <XCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  {language === "en" ? "No cancelled requests" : "キャンセルされたリクエストなし"}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{language === "en" ? "Test Drive Request Details" : "試乗リクエスト詳細"}</DialogTitle>
            <DialogDescription>{selectedRequest?.vehicleTitle}</DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">{language === "en" ? "Buyer Information" : "購入者情報"}</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>{language === "en" ? "Name:" : "名前:"}</strong> {selectedRequest.buyerData.name}
                    </div>
                    <div>
                      <strong>{language === "en" ? "Email:" : "メール:"}</strong> {selectedRequest.buyerData.email}
                    </div>
                    <div>
                      <strong>{language === "en" ? "Phone:" : "電話:"}</strong> {selectedRequest.buyerData.phone}
                    </div>
                    <div>
                      <strong>{language === "en" ? "License:" : "免許:"}</strong>{" "}
                      {selectedRequest.buyerData.licenseType}
                    </div>
                    <div>
                      <strong>{language === "en" ? "Experience:" : "経験:"}</strong>{" "}
                      {selectedRequest.buyerData.drivingExperience}
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold">{language === "en" ? "Appointment Details" : "予約詳細"}</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>{language === "en" ? "Date:" : "日付:"}</strong>{" "}
                      {new Date(selectedRequest.buyerData.preferredDate).toLocaleDateString()}
                    </div>
                    <div>
                      <strong>{language === "en" ? "Time:" : "時間:"}</strong> {selectedRequest.buyerData.preferredTime}
                    </div>
                    <div>
                      <strong>{language === "en" ? "Location:" : "場所:"}</strong>{" "}
                      {selectedRequest.buyerData.meetingLocation === "custom"
                        ? selectedRequest.buyerData.customLocation
                        : selectedRequest.buyerData.meetingLocation}
                    </div>
                    <div>
                      <strong>{language === "en" ? "Status:" : "ステータス:"}</strong>{" "}
                      {getStatusText(selectedRequest.status)}
                    </div>
                  </div>
                </div>
              </div>
              {selectedRequest.buyerData.emergencyContactName && (
                <div className="space-y-2">
                  <h4 className="font-semibold">{language === "en" ? "Emergency Contact" : "緊急連絡先"}</h4>
                  <div className="text-sm">
                    <div>
                      <strong>{language === "en" ? "Name:" : "名前:"}</strong>{" "}
                      {selectedRequest.buyerData.emergencyContactName}
                    </div>
                    <div>
                      <strong>{language === "en" ? "Phone:" : "電話:"}</strong>{" "}
                      {selectedRequest.buyerData.emergencyContactPhone}
                    </div>
                  </div>
                </div>
              )}
              {selectedRequest.buyerData.additionalNotes && (
                <div className="space-y-2">
                  <h4 className="font-semibold">{language === "en" ? "Additional Notes" : "追加メモ"}</h4>
                  <p className="text-sm bg-gray-50 p-3 rounded-lg">{selectedRequest.buyerData.additionalNotes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Response Modal */}
      <Dialog open={isResponseModalOpen} onOpenChange={setIsResponseModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {responseType === "confirm" && (language === "en" ? "Confirm Test Drive" : "試乗を確認")}
              {responseType === "reschedule" && (language === "en" ? "Reschedule Test Drive" : "試乗を再スケジュール")}
              {responseType === "decline" && (language === "en" ? "Decline Test Drive" : "試乗を辞退")}
            </DialogTitle>
            <DialogDescription>
              {selectedRequest?.buyerData.name} - {selectedRequest?.vehicleTitle}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {responseType === "reschedule" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rescheduleDate">{language === "en" ? "New Date" : "新しい日付"}</Label>
                  <Input
                    id="rescheduleDate"
                    type="date"
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rescheduleTime">{language === "en" ? "New Time" : "新しい時間"}</Label>
                  <Input
                    id="rescheduleTime"
                    type="time"
                    value={rescheduleTime}
                    onChange={(e) => setRescheduleTime(e.target.value)}
                  />
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="responseMessage">
                {language === "en" ? "Message to Buyer" : "購入者へのメッセージ"}
                {responseType === "decline" && " *"}
              </Label>
              <Textarea
                id="responseMessage"
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                placeholder={
                  responseType === "confirm"
                    ? language === "en"
                      ? "Optional confirmation message..."
                      : "確認メッセージ（任意）..."
                    : responseType === "reschedule"
                      ? language === "en"
                        ? "Reason for rescheduling..."
                        : "再スケジュールの理由..."
                      : language === "en"
                        ? "Reason for declining..."
                        : "辞退の理由..."
                }
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResponseModalOpen(false)}>
              {language === "en" ? "Cancel" : "キャンセル"}
            </Button>
            <Button
              onClick={handleSubmitResponse}
              className={
                responseType === "confirm"
                  ? "bg-green-600 hover:bg-green-700"
                  : responseType === "decline"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-blue-600 hover:bg-blue-700"
              }
            >
              {responseType === "confirm" && (language === "en" ? "Confirm" : "確認")}
              {responseType === "reschedule" && (language === "en" ? "Reschedule" : "再スケジュール")}
              {responseType === "decline" && (language === "en" ? "Decline" : "辞退")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
