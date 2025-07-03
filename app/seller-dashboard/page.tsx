"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Car,
  Eye,
  MessageCircle,
  TrendingUp,
  Users,
  Star,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/contexts/auth-context"

export default function SellerDashboard() {
  const auth = useAuth()
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)

    // Load user-specific data when auth is ready
    if (auth.isAuthenticated && auth.user) {
      // Here you would typically load seller-specific data
      // For now, we'll use the mock data
    }
  }, [auth.isAuthenticated, auth.user])

  const [activeTab, setActiveTab] = useState("overview")

  // Mock data for seller dashboard
  const stats = {
    totalListings: 5,
    activeListings: 3,
    totalViews: 1247,
    totalInquiries: 23,
    averageRating: 4.8,
    completedSales: 12,
  }

  const recentListings = [
    {
      id: "1",
      title: "2019 Toyota Aqua Hybrid",
      price: 1200000,
      status: "active",
      views: 156,
      inquiries: 8,
      image: "/images/toyota-aqua-hybrid-okinawa.png",
      listedDate: "2024-01-15",
    },
    {
      id: "2",
      title: "2020 Honda Fit RS",
      price: 1450000,
      status: "pending",
      views: 89,
      inquiries: 3,
      image: "/images/honda-fit-rs-okinawa.png",
      listedDate: "2024-01-10",
    },
    {
      id: "3",
      title: "2018 Nissan Note e-POWER",
      price: 980000,
      status: "sold",
      views: 234,
      inquiries: 15,
      image: "/images/nissan-note-epower-okinawa.png",
      listedDate: "2024-01-05",
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
    },
    {
      id: "2",
      vehicleTitle: "2020 Honda Fit RS",
      buyerName: "Sarah Johnson",
      message: "Can I schedule a test drive for this weekend?",
      date: "2024-01-19",
      status: "replied",
    },
    {
      id: "3",
      vehicleTitle: "2019 Toyota Aqua Hybrid",
      buyerName: "Mike Wilson",
      message: "What's the maintenance history of this car?",
      date: "2024-01-18",
      status: "unread",
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

  return (
    <ProtectedRoute requiredRole="seller">
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {auth.user?.firstName ? `Welcome back, ${auth.user.firstName}` : "Seller Dashboard"}
            </h1>
            <p className="text-gray-600">Manage your vehicle listings and track performance</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="listings">My Listings</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
                    <Car className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalListings}</div>
                    <p className="text-xs text-muted-foreground">{stats.activeListings} active</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">+12% from last month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Inquiries</CardTitle>
                    <MessageCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalInquiries}</div>
                    <p className="text-xs text-muted-foreground">5 unread messages</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Rating</CardTitle>
                    <Star className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.averageRating}</div>
                    <p className="text-xs text-muted-foreground">Based on {stats.completedSales} sales</p>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks to manage your listings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link href="/list-car">
                      <Button className="w-full h-20 flex flex-col gap-2">
                        <Plus className="h-6 w-6" />
                        List New Vehicle
                      </Button>
                    </Link>
                    <Link href="/seller-dashboard/messages">
                      <Button variant="outline" className="w-full h-20 flex flex-col gap-2 bg-transparent">
                        <MessageCircle className="h-6 w-6" />
                        Check Messages
                      </Button>
                    </Link>
                    <Link href="/seller-dashboard/analytics">
                      <Button variant="outline" className="w-full h-20 flex flex-col gap-2 bg-transparent">
                        <TrendingUp className="h-6 w-6" />
                        View Analytics
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Listings */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Listings</CardTitle>
                  <CardDescription>Your latest vehicle listings</CardDescription>
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
                  <CardTitle>Recent Inquiries</CardTitle>
                  <CardDescription>Latest messages from potential buyers</CardDescription>
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
                          Reply
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
                    My Listings
                    <Link href="/list-car">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Listing
                      </Button>
                    </Link>
                  </CardTitle>
                  <CardDescription>Manage all your vehicle listings</CardDescription>
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
                            <span>Listed: {listing.listedDate}</span>
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
              <Card>
                <CardHeader>
                  <CardTitle>Messages</CardTitle>
                  <CardDescription>Communicate with potential buyers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentInquiries.map((inquiry) => (
                      <div key={inquiry.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{inquiry.buyerName}</h4>
                          <Badge variant={inquiry.status === "unread" ? "destructive" : "secondary"}>
                            {inquiry.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Re: {inquiry.vehicleTitle}</p>
                        <p className="text-sm text-gray-800 mb-3">{inquiry.message}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">{inquiry.date}</span>
                          <Button size="sm">Reply</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Analytics</CardTitle>
                  <CardDescription>Track your listing performance and engagement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Listing Views</span>
                        <span className="text-sm text-gray-500">1,247 total</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Inquiry Rate</span>
                        <span className="text-sm text-gray-500">1.8%</span>
                      </div>
                      <Progress value={18} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Response Rate</span>
                        <span className="text-sm text-gray-500">95%</span>
                      </div>
                      <Progress value={95} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Seller Profile</CardTitle>
                  <CardDescription>Manage your seller information and preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                        <Users className="h-8 w-8 text-gray-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">John Doe</h3>
                        <p className="text-sm text-gray-500">Verified Seller</p>
                        <div className="flex items-center mt-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm ml-1">
                            {stats.averageRating} ({stats.completedSales} reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="pt-4">
                      <Button>Edit Profile</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  )
}
