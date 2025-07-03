"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { useTestDrive } from "@/contexts/test-drive-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Car,
  Eye,
  MessageCircle,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  Activity,
  BarChart3,
} from "lucide-react"
import Link from "next/link"
import { ProtectedRoute } from "@/components/protected-route"
import TestDriveTracking from "@/components/test-drive-tracking"
import MessageHistory from "@/components/message-history"
import ActivityOverview from "@/components/activity-overview"
import NotificationCenter from "@/components/notification-center"

// Helper function to ensure array
const ensureArray = (value: any) => {
  return Array.isArray(value) ? value : []
}

export default function GuestDashboard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { language } = useLanguage()
  const { auth, user } = useAuth()
  const { state: testDriveState, getRequestsForBuyer } = useTestDrive()

  // Initialize activeTab from URL parameter
  const [activeTab, setActiveTab] = useState(() => {
    const tabParam = searchParams.get("tab")
    return tabParam && ["overview", "listings", "messages", "test-drives", "activity"].includes(tabParam)
      ? tabParam
      : "overview"
  })

  // Handle tab changes with URL synchronization
  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab)
    router.replace(`/guest-dashboard?tab=${newTab}`, { scroll: false })
  }

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Calculate stats from real test drive data with defensive programming
  const safeRequests = ensureArray(testDriveState?.requests)
  const testDriveStats = {
    totalRequests: safeRequests.length,
    pendingRequests: safeRequests.filter((req) => req.status === "sent" || req.status === "sending").length,
    confirmedRequests: safeRequests.filter((req) => req.status === "confirmed").length,
    completedRequests: safeRequests.filter((req) => req.status === "completed").length,
  }

  // Mock data for other dashboard elements (these would come from other contexts/APIs)
  const stats = {
    totalListings: 2,
    activeListings: 1,
    totalViews: 156,
    totalInquiries: 5,
    testDriveRequests: testDriveStats.totalRequests,
    completedTestDrives: testDriveStats.completedRequests,
  }

  const recentListings = [
    {
      id: "1",
      title: "2019 Toyota Aqua Hybrid",
      price: 1200000,
      status: "active",
      views: 89,
      inquiries: 3,
      image: "/images/toyota-aqua-hybrid-okinawa.png",
      listedDate: "2024-01-15",
      expiresDate: "2024-02-15",
    },
    {
      id: "2",
      title: "2020 Honda Fit RS",
      price: 1450000,
      status: "pending",
      views: 67,
      inquiries: 2,
      image: "/images/honda-fit-rs-okinawa.png",
      listedDate: "2024-01-10",
      expiresDate: "2024-02-10",
    },
  ]

  const recentInquiries = [
    {
      id: "1",
      vehicleTitle: "2019 Toyota Aqua Hybrid",
      buyerName: "Taro Tanaka",
      message: "I'm interested in this vehicle. Is it still available?",
      date: "2024-01-20",
      status: "unread",
      type: "general",
    },
    {
      id: "2",
      vehicleTitle: "2020 Honda Fit RS",
      buyerName: "Sarah Johnson",
      message: "Can I schedule a test drive for this weekend?",
      date: "2024-01-19",
      status: "replied",
      type: "test_drive",
    },
    {
      id: "3",
      vehicleTitle: "2019 Toyota Aqua Hybrid",
      buyerName: "Mike Wilson",
      message: "What's the maintenance history of this car?",
      date: "2024-01-18",
      status: "unread",
      type: "condition",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "sold":
        return "bg-blue-100 text-blue-800"
      case "expired":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      case "sold":
        return <CheckCircle className="h-4 w-4" />
      case "expired":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  // Get test drive requests for the current buyer with defensive programming
  const buyerTestDriveRequests = user?.email
    ? ensureArray(safeRequests).filter((req) => req.buyerData?.email === user.email)
    : []

  return (
    <ProtectedRoute requiredRole="guest">
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {language === "en" ? "Guest Dashboard" : "ゲストダッシュボード"}
              </h1>
              <p className="text-gray-600">
                {language === "en"
                  ? "Manage your vehicle listings and track activity"
                  : "車両リスティングを管理し、アクティビティを追跡"}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <NotificationCenter />
              <Link href="/request-listing">
                <Button className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90">
                  <Plus className="h-4 w-4 mr-2" />
                  {language === "en" ? "List Vehicle" : "車両を出品"}
                </Button>
              </Link>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">
                <BarChart3 className="h-4 w-4 mr-2" />
                {language === "en" ? "Overview" : "概要"}
              </TabsTrigger>
              <TabsTrigger value="listings">
                <Car className="h-4 w-4 mr-2" />
                {language === "en" ? "My Listings" : "出品一覧"}
              </TabsTrigger>
              <TabsTrigger value="messages">
                <MessageCircle className="h-4 w-4 mr-2" />
                {language === "en" ? "Messages" : "メッセージ"}
              </TabsTrigger>
              <TabsTrigger value="test-drives">
                <Calendar className="h-4 w-4 mr-2" />
                {language === "en" ? "Test Drives" : "試乗"}
                {testDriveStats.totalRequests > 0 && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {testDriveStats.totalRequests}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="activity">
                <Activity className="h-4 w-4 mr-2" />
                {language === "en" ? "Activity" : "アクティビティ"}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {language === "en" ? "Total Listings" : "総出品数"}
                    </CardTitle>
                    <Car className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalListings}</div>
                    <p className="text-xs text-muted-foreground">
                      {stats.activeListings} {language === "en" ? "active" : "アクティブ"}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {language === "en" ? "Total Views" : "総閲覧数"}
                    </CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      {language === "en" ? "+12% from last month" : "先月比+12%"}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {language === "en" ? "Inquiries" : "お問い合わせ"}
                    </CardTitle>
                    <MessageCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalInquiries}</div>
                    <p className="text-xs text-muted-foreground">
                      {language === "en" ? "2 unread messages" : "2件の未読メッセージ"}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{language === "en" ? "Test Drives" : "試乗"}</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{testDriveStats.totalRequests}</div>
                    <p className="text-xs text-muted-foreground">
                      {testDriveStats.pendingRequests > 0
                        ? `${testDriveStats.pendingRequests} ${language === "en" ? "pending request" : "件の保留中リクエスト"}`
                        : language === "en"
                          ? "No pending requests"
                          : "保留中リクエストなし"}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>{language === "en" ? "Quick Actions" : "クイックアクション"}</CardTitle>
                  <CardDescription>
                    {language === "en" ? "Common tasks to manage your listings" : "リスティング管理の一般的なタスク"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link href="/request-listing">
                      <Button className="w-full h-20 flex flex-col gap-2 bg-black text-white hover:bg-gray-800">
                        <Plus className="h-6 w-6" />
                        {language === "en" ? "List New Vehicle" : "新しい車両を出品"}
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="w-full h-20 flex flex-col gap-2 bg-transparent"
                      onClick={() => handleTabChange("messages")}
                    >
                      <MessageCircle className="h-6 w-6" />
                      {language === "en" ? "Check Messages" : "メッセージを確認"}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full h-20 flex flex-col gap-2 bg-transparent"
                      onClick={() => handleTabChange("test-drives")}
                    >
                      <Calendar className="h-6 w-6" />
                      {language === "en" ? "View Test Drives" : "試乗を確認"}
                      {testDriveStats.totalRequests > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {testDriveStats.totalRequests}
                        </Badge>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Listings */}
              <Card>
                <CardHeader>
                  <CardTitle>{language === "en" ? "Recent Listings" : "最近のリスティング"}</CardTitle>
                  <CardDescription>
                    {language === "en" ? "Your latest vehicle listings" : "最新の車両リスティング"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentListings.map((listing) => (
                      <div key={listing.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <img
                          src={listing.image || "/placeholder.svg"}
                          alt={listing.title}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{listing.title}</p>
                          <p className="text-sm text-gray-500">¥{listing.price.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(listing.status)}>
                            {getStatusIcon(listing.status)}
                            <span className="ml-1 capitalize">{listing.status}</span>
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-900">{listing.views} views</p>
                          <p className="text-sm text-gray-500">{listing.inquiries} inquiries</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Inquiries */}
              <Card>
                <CardHeader>
                  <CardTitle>{language === "en" ? "Recent Inquiries" : "最近のお問い合わせ"}</CardTitle>
                  <CardDescription>
                    {language === "en" ? "Latest messages from potential buyers" : "潜在的な購入者からの最新メッセージ"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentInquiries.map((inquiry) => (
                      <div key={inquiry.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900">{inquiry.buyerName}</p>
                            <Badge variant={inquiry.status === "unread" ? "destructive" : "secondary"}>
                              {inquiry.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">Re: {inquiry.vehicleTitle}</p>
                          <p className="text-sm text-gray-500 mt-2 line-clamp-2">{inquiry.message}</p>
                          <p className="text-xs text-gray-400 mt-2">{inquiry.date}</p>
                        </div>
                        <Button size="sm" variant="outline">
                          {language === "en" ? "Reply" : "返信"}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="listings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {language === "en" ? "My Listings" : "マイリスティング"}
                    <Link href="/request-listing">
                      <Button className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90">
                        <Plus className="h-4 w-4 mr-2" />
                        {language === "en" ? "Add New Listing" : "新しいリスティングを追加"}
                      </Button>
                    </Link>
                  </CardTitle>
                  <CardDescription>
                    {language === "en" ? "Manage all your vehicle listings" : "すべての車両リスティングを管理"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentListings.map((listing) => (
                      <div key={listing.id} className="flex items-center space-x-4 p-6 border rounded-lg">
                        <img
                          src={listing.image || "/placeholder.svg"}
                          alt={listing.title}
                          className="w-24 h-24 object-cover rounded-md"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-medium text-gray-900">{listing.title}</h3>
                          <p className="text-xl font-bold text-green-600">¥{listing.price.toLocaleString()}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span>
                              {language === "en" ? "Listed:" : "出品日:"} {listing.listedDate}
                            </span>
                            <span>{listing.views} views</span>
                            <span>{listing.inquiries} inquiries</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(listing.status)}>
                            {getStatusIcon(listing.status)}
                            <span className="ml-1 capitalize">{listing.status}</span>
                          </Badge>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="messages" className="space-y-6">
              <MessageHistory />
            </TabsContent>

            <TabsContent value="test-drives" className="space-y-6">
              <TestDriveTracking />
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <ActivityOverview />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  )
}
