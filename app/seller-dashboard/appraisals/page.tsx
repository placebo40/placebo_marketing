"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Award,
  FileText,
  Clock,
  TrendingUp,
  Download,
  Eye,
  Plus,
  CheckCircle,
  BarChart3,
  Users,
  DollarSign,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getSellerListings } from "@/lib/seller-listings"

interface AppraisalRequest {
  id: string
  vehicleId: string
  vehicleTitle: string
  vehicleImage: string
  vehiclePrice: number
  status: "requested" | "scheduled" | "in_progress" | "completed" | "cancelled"
  reportType: "basic" | "comprehensive" | "premium"
  requestDate: string
  scheduledDate?: string
  completedDate?: string
  appraisedValue?: number
  appraiserName?: string
  appraiserLicense?: string
  reportUrl?: string
  notes?: string
  estimatedCompletion?: string
}

interface AppraisalAnalytics {
  totalAppraisals: number
  completedAppraisals: number
  averageAppraisalValue: number
  listingsWithAppraisals: number
  averageViewIncrease: number
  averageInquiryIncrease: number
  averageTimeToSale: number
}

export default function SellerAppraisalsPage() {
  const { language } = useLanguage()
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true)
  const [sellerListings, setSellerListings] = useState([])
  const [selectedVehicle, setSelectedVehicle] = useState("")
  const [selectedReportType, setSelectedReportType] = useState("")
  const [requestNotes, setRequestNotes] = useState("")
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false)

  // Mock appraisal data - in real app this would come from API
  const [appraisalRequests, setAppraisalRequests] = useState<AppraisalRequest[]>([
    {
      id: "1",
      vehicleId: "seller_1",
      vehicleTitle: "2020 Toyota Prius Hybrid",
      vehicleImage: "/images/compact-car-daylight.jpg",
      vehiclePrice: 1850000,
      status: "completed",
      reportType: "comprehensive",
      requestDate: "2024-11-10",
      scheduledDate: "2024-11-15",
      completedDate: "2024-11-20",
      appraisedValue: 1920000,
      appraiserName: "Hiroshi Tanaka",
      appraiserLicense: "AP-2024-OKI-001",
      reportUrl: "#",
      notes: "Vehicle shows excellent maintenance history and above-average condition for its age.",
    },
    {
      id: "2",
      vehicleId: "seller_2",
      vehicleTitle: "2019 Honda Fit RS",
      vehicleImage: "/images/honda-fit-clean.jpg",
      vehiclePrice: 1450000,
      status: "in_progress",
      reportType: "premium",
      requestDate: "2024-11-25",
      scheduledDate: "2024-12-02",
      appraiserName: "Yuki Sato",
      estimatedCompletion: "2024-12-05",
    },
    {
      id: "3",
      vehicleId: "seller_3",
      vehicleTitle: "2021 Nissan Note e-POWER",
      vehicleImage: "/images/compact-car-side.jpg",
      vehiclePrice: 1680000,
      status: "scheduled",
      reportType: "basic",
      requestDate: "2024-11-28",
      scheduledDate: "2024-12-08",
      appraiserName: "Kenji Yamamoto",
    },
  ])

  const analytics: AppraisalAnalytics = {
    totalAppraisals: 3,
    completedAppraisals: 1,
    averageAppraisalValue: 1920000,
    listingsWithAppraisals: 1,
    averageViewIncrease: 45,
    averageInquiryIncrease: 78,
    averageTimeToSale: 12,
  }

  useEffect(() => {
    const listings = getSellerListings()
    setSellerListings(listings)
    setIsLoading(false)
  }, [])

  const handleRequestAppraisal = () => {
    // In real app, this would submit to API
    const newRequest: AppraisalRequest = {
      id: `req_${Date.now()}`,
      vehicleId: selectedVehicle,
      vehicleTitle: sellerListings.find((l: any) => l.id === selectedVehicle)?.title || "Unknown Vehicle",
      vehicleImage: "/images/compact-car-daylight.jpg",
      vehiclePrice: 1500000,
      status: "requested",
      reportType: selectedReportType as "basic" | "comprehensive" | "premium",
      requestDate: new Date().toISOString().split("T")[0],
      notes: requestNotes,
    }

    setAppraisalRequests([...appraisalRequests, newRequest])
    setIsRequestModalOpen(false)
    setSelectedVehicle("")
    setSelectedReportType("")
    setRequestNotes("")
  }

  const getStatusBadge = (status: AppraisalRequest["status"]) => {
    const statusConfig = {
      requested: { color: "bg-yellow-100 text-yellow-800", text: language === "en" ? "Requested" : "依頼済み" },
      scheduled: { color: "bg-blue-100 text-blue-800", text: language === "en" ? "Scheduled" : "予定済み" },
      in_progress: { color: "bg-purple-100 text-purple-800", text: language === "en" ? "In Progress" : "進行中" },
      completed: { color: "bg-green-100 text-green-800", text: language === "en" ? "Completed" : "完了" },
      cancelled: { color: "bg-red-100 text-red-800", text: language === "en" ? "Cancelled" : "キャンセル" },
    }

    const config = statusConfig[status]
    return <Badge className={`${config.color} hover:${config.color}`}>{config.text}</Badge>
  }

  const getReportTypeBadge = (type: "basic" | "comprehensive" | "premium") => {
    const typeConfig = {
      basic: { color: "bg-green-100 text-green-800", text: language === "en" ? "Basic" : "基本" },
      comprehensive: { color: "bg-blue-100 text-blue-800", text: language === "en" ? "Comprehensive" : "総合" },
      premium: { color: "bg-purple-100 text-purple-800", text: language === "en" ? "Premium" : "プレミアム" },
    }

    const config = typeConfig[type]
    return <Badge className={`${config.color} hover:${config.color}`}>{config.text}</Badge>
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-placebo-gold mx-auto mb-4"></div>
          <p className="text-placebo-dark-gray">{language === "en" ? "Loading..." : "読み込み中..."}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-placebo-black mb-2">
          {language === "en" ? "Appraisal Management" : "鑑定管理"}
        </h1>
        <p className="text-placebo-dark-gray">
          {language === "en"
            ? "Manage your vehicle appraisals and track their impact on your listings."
            : "車両鑑定を管理し、リスティングへの影響を追跡します。"}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">{language === "en" ? "Overview" : "概要"}</TabsTrigger>
          <TabsTrigger value="requests">{language === "en" ? "Requests" : "依頼"}</TabsTrigger>
          <TabsTrigger value="reports">{language === "en" ? "Reports" : "レポート"}</TabsTrigger>
          <TabsTrigger value="analytics">{language === "en" ? "Analytics" : "分析"}</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-placebo-dark-gray">
                      {language === "en" ? "Total Appraisals" : "総鑑定数"}
                    </p>
                    <p className="text-2xl font-bold text-placebo-black">{analytics.totalAppraisals}</p>
                  </div>
                  <Award className="h-8 w-8 text-placebo-gold" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-placebo-dark-gray">
                      {language === "en" ? "Completed" : "完了済み"}
                    </p>
                    <p className="text-2xl font-bold text-placebo-black">{analytics.completedAppraisals}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-placebo-dark-gray">
                      {language === "en" ? "Avg. Value" : "平均価格"}
                    </p>
                    <p className="text-2xl font-bold text-placebo-black">
                      ¥{(analytics.averageAppraisalValue / 10000).toFixed(0)}万
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-placebo-gold" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-placebo-dark-gray">
                      {language === "en" ? "View Increase" : "閲覧増加"}
                    </p>
                    <p className="text-2xl font-bold text-placebo-black">+{analytics.averageViewIncrease}%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>{language === "en" ? "Recent Appraisal Activity" : "最近の鑑定活動"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {appraisalRequests.slice(0, 3).map((request) => (
                  <div key={request.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={request.vehicleImage || "/placeholder.svg"}
                        alt={request.vehicleTitle}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-placebo-black">{request.vehicleTitle}</h4>
                      <p className="text-sm text-placebo-dark-gray">
                        {language === "en" ? "Requested:" : "依頼日:"}{" "}
                        {new Date(request.requestDate).toLocaleDateString(language === "en" ? "en-US" : "ja-JP")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getReportTypeBadge(request.reportType)}
                      {getStatusBadge(request.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  {language === "en" ? "Request New Appraisal" : "新しい鑑定を依頼"}
                </CardTitle>
                <CardDescription>
                  {language === "en"
                    ? "Get professional appraisals for your vehicles to increase buyer confidence."
                    : "車両のプロ鑑定を受けて、購入者の信頼を高めましょう。"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Dialog open={isRequestModalOpen} onOpenChange={setIsRequestModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90">
                      <Plus className="h-4 w-4 mr-2" />
                      {language === "en" ? "Request Appraisal" : "鑑定を依頼"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>{language === "en" ? "Request Vehicle Appraisal" : "車両鑑定を依頼"}</DialogTitle>
                      <DialogDescription>
                        {language === "en"
                          ? "Select a vehicle and appraisal type to get started."
                          : "車両と鑑定タイプを選択して開始してください。"}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="vehicle">{language === "en" ? "Select Vehicle" : "車両を選択"}</Label>
                        <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                          <SelectTrigger>
                            <SelectValue placeholder={language === "en" ? "Choose a vehicle..." : "車両を選択..."} />
                          </SelectTrigger>
                          <SelectContent>
                            {sellerListings.map((listing: any) => (
                              <SelectItem key={listing.id} value={listing.id}>
                                {listing.year} {listing.make} {listing.model}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="reportType">{language === "en" ? "Appraisal Type" : "鑑定タイプ"}</Label>
                        <Select value={selectedReportType} onValueChange={setSelectedReportType}>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={language === "en" ? "Choose appraisal type..." : "鑑定タイプを選択..."}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="basic">
                              {language === "en" ? "Basic (¥15,000)" : "基本 (¥15,000)"}
                            </SelectItem>
                            <SelectItem value="comprehensive">
                              {language === "en" ? "Comprehensive (¥25,000)" : "総合 (¥25,000)"}
                            </SelectItem>
                            <SelectItem value="premium">
                              {language === "en" ? "Premium (¥40,000)" : "プレミアム (¥40,000)"}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="notes">{language === "en" ? "Additional Notes" : "追加メモ"}</Label>
                        <Textarea
                          id="notes"
                          value={requestNotes}
                          onChange={(e) => setRequestNotes(e.target.value)}
                          placeholder={
                            language === "en"
                              ? "Any specific areas of focus or concerns..."
                              : "特に注目すべき点や懸念事項..."
                          }
                          rows={3}
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setIsRequestModalOpen(false)} className="flex-1">
                          {language === "en" ? "Cancel" : "キャンセル"}
                        </Button>
                        <Button
                          onClick={handleRequestAppraisal}
                          disabled={!selectedVehicle || !selectedReportType}
                          className="flex-1 bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90"
                        >
                          {language === "en" ? "Submit Request" : "依頼を送信"}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  {language === "en" ? "Performance Impact" : "パフォーマンス影響"}
                </CardTitle>
                <CardDescription>
                  {language === "en"
                    ? "See how appraisals improve your listing performance."
                    : "鑑定がリスティングのパフォーマンスをどう改善するかを確認。"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-placebo-dark-gray">
                      {language === "en" ? "Average view increase:" : "平均閲覧増加:"}
                    </span>
                    <span className="font-semibold text-green-600">+{analytics.averageViewIncrease}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-placebo-dark-gray">
                      {language === "en" ? "Inquiry rate boost:" : "問い合わせ率向上:"}
                    </span>
                    <span className="font-semibold text-green-600">+{analytics.averageInquiryIncrease}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-placebo-dark-gray">
                      {language === "en" ? "Faster sales:" : "販売期間短縮:"}
                    </span>
                    <span className="font-semibold text-blue-600">-{analytics.averageTimeToSale} days</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Requests Tab */}
        <TabsContent value="requests" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-placebo-black">
              {language === "en" ? "Appraisal Requests" : "鑑定依頼"}
            </h2>
            <Dialog open={isRequestModalOpen} onOpenChange={setIsRequestModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90">
                  <Plus className="h-4 w-4 mr-2" />
                  {language === "en" ? "New Request" : "新規依頼"}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>{language === "en" ? "Request Vehicle Appraisal" : "車両鑑定を依頼"}</DialogTitle>
                  <DialogDescription>
                    {language === "en"
                      ? "Select a vehicle and appraisal type to get started."
                      : "車両と鑑定タイプを選択して開始してください。"}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="vehicle">{language === "en" ? "Select Vehicle" : "車両を選択"}</Label>
                    <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                      <SelectTrigger>
                        <SelectValue placeholder={language === "en" ? "Choose a vehicle..." : "車両を選択..."} />
                      </SelectTrigger>
                      <SelectContent>
                        {sellerListings.map((listing: any) => (
                          <SelectItem key={listing.id} value={listing.id}>
                            {listing.year} {listing.make} {listing.model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="reportType">{language === "en" ? "Appraisal Type" : "鑑定タイプ"}</Label>
                    <Select value={selectedReportType} onValueChange={setSelectedReportType}>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={language === "en" ? "Choose appraisal type..." : "鑑定タイプを選択..."}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">
                          {language === "en" ? "Basic (¥15,000)" : "基本 (¥15,000)"}
                        </SelectItem>
                        <SelectItem value="comprehensive">
                          {language === "en" ? "Comprehensive (¥25,000)" : "総合 (¥25,000)"}
                        </SelectItem>
                        <SelectItem value="premium">
                          {language === "en" ? "Premium (¥40,000)" : "プレミアム (¥40,000)"}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="notes">{language === "en" ? "Additional Notes" : "追加メモ"}</Label>
                    <Textarea
                      id="notes"
                      value={requestNotes}
                      onChange={(e) => setRequestNotes(e.target.value)}
                      placeholder={
                        language === "en"
                          ? "Any specific areas of focus or concerns..."
                          : "特に注目すべき点や懸念事項..."
                      }
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsRequestModalOpen(false)} className="flex-1">
                      {language === "en" ? "Cancel" : "キャンセル"}
                    </Button>
                    <Button
                      onClick={handleRequestAppraisal}
                      disabled={!selectedVehicle || !selectedReportType}
                      className="flex-1 bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90"
                    >
                      {language === "en" ? "Submit Request" : "依頼を送信"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {appraisalRequests.map((request) => (
              <Card key={request.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={request.vehicleImage || "/placeholder.svg"}
                        alt={request.vehicleTitle}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-placebo-black text-lg">{request.vehicleTitle}</h3>
                          <p className="text-placebo-gold font-medium">
                            ¥{Number(request.vehiclePrice).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getReportTypeBadge(request.reportType)}
                          {getStatusBadge(request.status)}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                        <div>
                          <span className="text-gray-500">{language === "en" ? "Requested:" : "依頼日:"}</span>
                          <p className="font-medium">
                            {new Date(request.requestDate).toLocaleDateString(language === "en" ? "en-US" : "ja-JP")}
                          </p>
                        </div>
                        {request.scheduledDate && (
                          <div>
                            <span className="text-gray-500">{language === "en" ? "Scheduled:" : "予定日:"}</span>
                            <p className="font-medium">
                              {new Date(request.scheduledDate).toLocaleDateString(
                                language === "en" ? "en-US" : "ja-JP",
                              )}
                            </p>
                          </div>
                        )}
                        {request.appraiserName && (
                          <div>
                            <span className="text-gray-500">{language === "en" ? "Appraiser:" : "鑑定士:"}</span>
                            <p className="font-medium">{request.appraiserName}</p>
                          </div>
                        )}
                        {request.appraisedValue && (
                          <div>
                            <span className="text-gray-500">
                              {language === "en" ? "Appraised Value:" : "鑑定価格:"}
                            </span>
                            <p className="font-medium text-green-600">
                              ¥{Number(request.appraisedValue).toLocaleString()}
                            </p>
                          </div>
                        )}
                      </div>

                      {request.notes && <p className="text-sm text-gray-600 mb-4 italic">"{request.notes}"</p>}

                      <div className="flex gap-2">
                        {request.status === "completed" && (
                          <Button size="sm" className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90">
                            <FileText className="h-4 w-4 mr-2" />
                            {language === "en" ? "View Report" : "レポートを見る"}
                          </Button>
                        )}
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/seller-dashboard/listings/${request.vehicleId}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            {language === "en" ? "View Listing" : "リスティングを見る"}
                          </Link>
                        </Button>
                        {request.status === "completed" && (
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            {language === "en" ? "Download" : "ダウンロード"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <h2 className="text-xl font-semibold text-placebo-black">
            {language === "en" ? "Completed Appraisal Reports" : "完了した鑑定レポート"}
          </h2>

          {appraisalRequests.filter((req) => req.status === "completed").length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-placebo-black mb-2">
                  {language === "en" ? "No Completed Reports" : "完了したレポートはありません"}
                </h3>
                <p className="text-gray-600 mb-6">
                  {language === "en"
                    ? "Your completed appraisal reports will appear here."
                    : "完了した鑑定レポートがここに表示されます。"}
                </p>
                <Button asChild className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90">
                  <Link href="/appraisal-info">
                    {language === "en" ? "Learn About Appraisals" : "鑑定について学ぶ"}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {appraisalRequests
                .filter((req) => req.status === "completed")
                .map((request) => (
                  <Card key={request.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-placebo-gold" />
                        {request.vehicleTitle}
                      </CardTitle>
                      <CardDescription>
                        {language === "en" ? "Completed on" : "完了日:"}{" "}
                        {request.completedDate &&
                          new Date(request.completedDate).toLocaleDateString(language === "en" ? "en-US" : "ja-JP")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">
                            {language === "en" ? "Appraised Value:" : "鑑定価格:"}
                          </span>
                          <span className="text-lg font-bold text-green-600">
                            ¥{request.appraisedValue && Number(request.appraisedValue).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">
                            {language === "en" ? "Report Type:" : "レポートタイプ:"}
                          </span>
                          {getReportTypeBadge(request.reportType)}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">{language === "en" ? "Appraiser:" : "鑑定士:"}</span>
                          <span className="font-medium">{request.appraiserName}</span>
                        </div>

                        <div className="flex gap-2 pt-4">
                          <Button
                            size="sm"
                            className="flex-1 bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90"
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            {language === "en" ? "View Report" : "レポートを見る"}
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            {language === "en" ? "Download" : "ダウンロード"}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <h2 className="text-xl font-semibold text-placebo-black">
            {language === "en" ? "Appraisal Performance Analytics" : "鑑定パフォーマンス分析"}
          </h2>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  {language === "en" ? "Listing Views" : "リスティング閲覧"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">{language === "en" ? "Before Appraisal:" : "鑑定前:"}</span>
                    <span className="font-medium">245 views</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">{language === "en" ? "After Appraisal:" : "鑑定後:"}</span>
                    <span className="font-medium">355 views</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span className="text-sm font-medium">{language === "en" ? "Improvement:" : "改善:"}</span>
                    <span className="font-bold">+{analytics.averageViewIncrease}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  {language === "en" ? "Buyer Inquiries" : "購入者問い合わせ"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">{language === "en" ? "Before Appraisal:" : "鑑定前:"}</span>
                    <span className="font-medium">18 inquiries</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">{language === "en" ? "After Appraisal:" : "鑑定後:"}</span>
                    <span className="font-medium">32 inquiries</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span className="text-sm font-medium">{language === "en" ? "Improvement:" : "改善:"}</span>
                    <span className="font-bold">+{analytics.averageInquiryIncrease}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-purple-500" />
                  {language === "en" ? "Time to Sale" : "販売期間"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">
                      {language === "en" ? "Without Appraisal:" : "鑑定なし:"}
                    </span>
                    <span className="font-medium">45 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">{language === "en" ? "With Appraisal:" : "鑑定あり:"}</span>
                    <span className="font-medium">33 days</span>
                  </div>
                  <div className="flex justify-between text-blue-600">
                    <span className="text-sm font-medium">{language === "en" ? "Faster by:" : "短縮:"}</span>
                    <span className="font-bold">-{analytics.averageTimeToSale} days</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ROI Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>{language === "en" ? "Return on Investment (ROI)" : "投資収益率 (ROI)"}</CardTitle>
              <CardDescription>
                {language === "en"
                  ? "How appraisal costs compare to the benefits gained."
                  : "鑑定費用と得られる利益の比較。"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">{language === "en" ? "Investment" : "投資"}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">
                        {language === "en" ? "Appraisal Cost:" : "鑑定費用:"}
                      </span>
                      <span className="font-medium">¥25,000</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">{language === "en" ? "Returns" : "リターン"}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">
                        {language === "en" ? "Faster Sale Value:" : "早期売却価値:"}
                      </span>
                      <span className="font-medium">¥45,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">
                        {language === "en" ? "Price Premium:" : "価格プレミアム:"}
                      </span>
                      <span className="font-medium">¥70,000</span>
                    </div>
                    <div className="flex justify-between text-green-600 font-semibold border-t pt-2">
                      <span>{language === "en" ? "Total ROI:" : "総ROI:"}</span>
                      <span>+360%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
