"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar, MapPin, Car, CheckCircle, Clock, AlertTriangle, Eye, Search, FileText } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function SellerInspectionsPage() {
  const { language } = useLanguage()
  const [isLoading, setIsLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  // Mock inspection data - in real app, this would come from API
  const [inspections, setInspections] = useState([
    {
      id: "1",
      vehicleId: "listing1",
      vehicleTitle: "2019 Toyota Aqua Hybrid",
      listingId: "L001",
      inspectionType: "comprehensive",
      status: "scheduled",
      scheduledDate: "2024-01-20",
      scheduledTime: "10:00",
      location: "Our Inspection Facility",
      inspector: "Certified Inspector A",
      requestedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      estimatedDuration: "2-3 hours",
      cost: "¥25,000",
      photos: ["/images/compact-car-daylight.jpg"],
    },
    {
      id: "2",
      vehicleId: "listing2",
      vehicleTitle: "2018 Honda Fit RS",
      listingId: "L002",
      inspectionType: "basic",
      status: "completed",
      scheduledDate: "2024-01-15",
      scheduledTime: "14:00",
      completedDate: "2024-01-15",
      location: "Vehicle's Current Location",
      inspector: "Certified Inspector B",
      requestedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      estimatedDuration: "1-2 hours",
      cost: "¥15,000",
      reportUrl: "/inspection-reports/report-2.pdf",
      verificationStatus: "verified",
      photos: ["/images/honda-fit-clean.jpg"],
    },
    {
      id: "3",
      vehicleId: "listing3",
      vehicleTitle: "2020 Nissan Note e-POWER",
      listingId: "L003",
      inspectionType: "pre-purchase",
      status: "pending",
      location: "Mobile Inspection Service",
      requestedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      estimatedDuration: "3-4 hours",
      cost: "¥35,000",
      photos: ["/images/compact-car-side.jpg"],
    },
  ])

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: {
        color: "bg-yellow-100 text-yellow-800",
        text: language === "en" ? "Pending" : "保留中",
        icon: Clock,
      },
      scheduled: {
        color: "bg-blue-100 text-blue-800",
        text: language === "en" ? "Scheduled" : "予定済み",
        icon: Calendar,
      },
      in_progress: {
        color: "bg-orange-100 text-orange-800",
        text: language === "en" ? "In Progress" : "進行中",
        icon: AlertTriangle,
      },
      completed: {
        color: "bg-green-100 text-green-800",
        text: language === "en" ? "Completed" : "完了",
        icon: CheckCircle,
      },
      cancelled: {
        color: "bg-red-100 text-red-800",
        text: language === "en" ? "Cancelled" : "キャンセル済み",
        icon: AlertTriangle,
      },
    }

    const config = statusConfig[status] || statusConfig.pending
    const IconComponent = config.icon

    return (
      <Badge className={`${config.color} hover:${config.color} flex items-center gap-1`}>
        <IconComponent className="h-3 w-3" />
        {config.text}
      </Badge>
    )
  }

  const getInspectionTypeLabel = (type: string) => {
    const types = {
      basic: language === "en" ? "Basic Inspection" : "基本検査",
      comprehensive: language === "en" ? "Comprehensive Inspection" : "包括的検査",
      "pre-purchase": language === "en" ? "Pre-Purchase Inspection" : "購入前検査",
    }
    return types[type] || type
  }

  const filteredInspections = inspections.filter((inspection) => {
    const matchesStatus = filterStatus === "all" || inspection.status === filterStatus
    const matchesSearch =
      searchTerm === "" ||
      inspection.vehicleTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspection.listingId.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesStatus && matchesSearch
  })

  const filterInspectionsByStatus = (status?: string) => {
    if (!status) return inspections
    return inspections.filter((inspection) => inspection.status === status)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-placebo-gold mx-auto mb-4"></div>
          <p className="text-placebo-dark-gray">{language === "en" ? "Loading..." : "読み込み中..."}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-placebo-black mb-2">
            {language === "en" ? "Vehicle Inspections" : "車両検査"}
          </h1>
          <p className="text-gray-600">
            {language === "en"
              ? "Track your vehicle inspection requests and get verified badges"
              : "車両検査リクエストを追跡し、認証バッジを取得"}
          </p>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search">{language === "en" ? "Search" : "検索"}</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder={
                      language === "en" ? "Search by vehicle or listing ID..." : "車両またはリスティングIDで検索..."
                    }
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <Label>{language === "en" ? "Filter by Status" : "ステータスでフィルター"}</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{language === "en" ? "All Status" : "すべてのステータス"}</SelectItem>
                    <SelectItem value="pending">{language === "en" ? "Pending" : "保留中"}</SelectItem>
                    <SelectItem value="scheduled">{language === "en" ? "Scheduled" : "予定済み"}</SelectItem>
                    <SelectItem value="in_progress">{language === "en" ? "In Progress" : "進行中"}</SelectItem>
                    <SelectItem value="completed">{language === "en" ? "Completed" : "完了"}</SelectItem>
                    <SelectItem value="cancelled">{language === "en" ? "Cancelled" : "キャンセル済み"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inspections Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">
              {language === "en" ? "All" : "すべて"} ({inspections.length})
            </TabsTrigger>
            <TabsTrigger value="pending">
              {language === "en" ? "Pending" : "保留中"} ({filterInspectionsByStatus("pending").length})
            </TabsTrigger>
            <TabsTrigger value="scheduled">
              {language === "en" ? "Scheduled" : "予定済み"} ({filterInspectionsByStatus("scheduled").length})
            </TabsTrigger>
            <TabsTrigger value="in_progress">
              {language === "en" ? "In Progress" : "進行中"} ({filterInspectionsByStatus("in_progress").length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              {language === "en" ? "Completed" : "完了"} ({filterInspectionsByStatus("completed").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="space-y-4">
              {filteredInspections.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-placebo-black mb-2">
                      {language === "en" ? "No Inspections Found" : "検査が見つかりません"}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {language === "en"
                        ? "Request inspections for your vehicles to get verified badges and increase buyer confidence."
                        : "車両の検査をリクエストして認証バッジを取得し、購入者の信頼を高めましょう。"}
                    </p>
                    <Button asChild className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90">
                      <Link href="/seller-dashboard/listings">
                        {language === "en" ? "Go to My Listings" : "マイリスティングへ"}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                filteredInspections.map((inspection) => (
                  <Card key={inspection.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-4">
                          {/* Vehicle Image */}
                          <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            {inspection.photos && inspection.photos.length > 0 ? (
                              <Image
                                src={inspection.photos[0] || "/placeholder.svg"}
                                alt={inspection.vehicleTitle}
                                width={96}
                                height={96}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Car className="h-8 w-8 text-gray-400" />
                              </div>
                            )}
                          </div>

                          {/* Vehicle Info */}
                          <div>
                            <h3 className="text-lg font-semibold text-placebo-black mb-1">{inspection.vehicleTitle}</h3>
                            <p className="text-sm text-gray-600 mb-2">
                              {language === "en" ? "Listing ID:" : "リスティングID:"} {inspection.listingId}
                            </p>
                            <p className="text-sm text-gray-600">
                              {getInspectionTypeLabel(inspection.inspectionType)} • {inspection.cost}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {inspection.verificationStatus === "verified" && (
                            <Badge className="bg-placebo-gold text-placebo-black">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {language === "en" ? "Verified" : "認証済み"}
                            </Badge>
                          )}
                          {getStatusBadge(inspection.status)}
                        </div>
                      </div>

                      {/* Inspection Details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {inspection.scheduledDate && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="font-medium">
                                {new Date(inspection.scheduledDate).toLocaleDateString(
                                  language === "en" ? "en-US" : "ja-JP",
                                )}
                              </p>
                              <p className="text-sm text-gray-600">{inspection.scheduledTime}</p>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="font-medium">{inspection.location}</p>
                            <p className="text-sm text-gray-600">{inspection.estimatedDuration}</p>
                          </div>
                        </div>
                        {inspection.inspector && (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="font-medium">{inspection.inspector}</p>
                              <p className="text-sm text-gray-600">
                                {language === "en" ? "Assigned Inspector" : "担当検査員"}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-2" />
                              {language === "en" ? "View Details" : "詳細を見る"}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>{language === "en" ? "Inspection Details" : "検査詳細"}</DialogTitle>
                              <DialogDescription>
                                {language === "en"
                                  ? "Complete information about this inspection"
                                  : "この検査の完全な情報"}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>{language === "en" ? "Vehicle" : "車両"}</Label>
                                  <p className="font-medium">{inspection.vehicleTitle}</p>
                                </div>
                                <div>
                                  <Label>{language === "en" ? "Inspection Type" : "検査タイプ"}</Label>
                                  <p className="font-medium">{getInspectionTypeLabel(inspection.inspectionType)}</p>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>{language === "en" ? "Status" : "ステータス"}</Label>
                                  <div className="mt-1">{getStatusBadge(inspection.status)}</div>
                                </div>
                                <div>
                                  <Label>{language === "en" ? "Cost" : "費用"}</Label>
                                  <p className="font-medium">{inspection.cost}</p>
                                </div>
                              </div>
                              {inspection.scheduledDate && (
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>{language === "en" ? "Scheduled Date" : "予定日"}</Label>
                                    <p className="font-medium">
                                      {new Date(inspection.scheduledDate).toLocaleDateString(
                                        language === "en" ? "en-US" : "ja-JP",
                                      )}
                                    </p>
                                  </div>
                                  <div>
                                    <Label>{language === "en" ? "Time" : "時間"}</Label>
                                    <p className="font-medium">{inspection.scheduledTime}</p>
                                  </div>
                                </div>
                              )}
                              <div>
                                <Label>{language === "en" ? "Location" : "場所"}</Label>
                                <p className="font-medium">{inspection.location}</p>
                              </div>
                              {inspection.inspector && (
                                <div>
                                  <Label>{language === "en" ? "Inspector" : "検査員"}</Label>
                                  <p className="font-medium">{inspection.inspector}</p>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>

                        {inspection.reportUrl && (
                          <Button size="sm" variant="outline" asChild>
                            <Link href={inspection.reportUrl} target="_blank">
                              <FileText className="h-4 w-4 mr-2" />
                              {language === "en" ? "View Report" : "レポートを見る"}
                            </Link>
                          </Button>
                        )}

                        {inspection.status === "pending" && (
                          <Button
                            size="sm"
                            className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90"
                            asChild
                          >
                            <Link href={`/cars/${inspection.vehicleId}/inspection`}>
                              {language === "en" ? "Update Request" : "リクエスト更新"}
                            </Link>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Other tab contents */}
          {["pending", "scheduled", "in_progress", "completed"].map((status) => (
            <TabsContent key={status} value={status} className="mt-6">
              <div className="space-y-4">
                {filterInspectionsByStatus(status).map((inspection) => (
                  <Card key={inspection.id}>
                    <CardContent className="p-6">
                      {/* Same card content as above - could be extracted to a component */}
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-4">
                          <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            {inspection.photos && inspection.photos.length > 0 ? (
                              <Image
                                src={inspection.photos[0] || "/placeholder.svg"}
                                alt={inspection.vehicleTitle}
                                width={96}
                                height={96}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Car className="h-8 w-8 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-placebo-black mb-1">{inspection.vehicleTitle}</h3>
                            <p className="text-sm text-gray-600 mb-2">
                              {language === "en" ? "Listing ID:" : "リスティングID:"} {inspection.listingId}
                            </p>
                            <p className="text-sm text-gray-600">
                              {getInspectionTypeLabel(inspection.inspectionType)} • {inspection.cost}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {inspection.verificationStatus === "verified" && (
                            <Badge className="bg-placebo-gold text-placebo-black">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {language === "en" ? "Verified" : "認証済み"}
                            </Badge>
                          )}
                          {getStatusBadge(inspection.status)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
