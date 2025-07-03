"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Activity,
  MessageCircle,
  Calendar,
  Car,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Filter,
} from "lucide-react"
import { useMessaging } from "@/contexts/messaging-context"
import { useTestDrive } from "@/contexts/test-drive-context"
import { useLanguage } from "@/contexts/language-context"
import { getGuestListings } from "@/lib/guest-listings"
import { generateActivityFeed, getActivitySummary, type ActivityItem } from "@/lib/activity-service"

export default function ActivityOverview() {
  const { state: messagingState } = useMessaging()
  const { state: testDriveState } = useTestDrive()
  const { language } = useLanguage()
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [filteredActivities, setFilteredActivities] = useState<ActivityItem[]>([])
  const [selectedFilter, setSelectedFilter] = useState<string>("all")

  useEffect(() => {
    const listings = getGuestListings()
    const activityFeed = generateActivityFeed(messagingState.threads, testDriveState.requests, listings)
    setActivities(activityFeed)
    setFilteredActivities(activityFeed)
  }, [messagingState.threads, testDriveState.requests])

  useEffect(() => {
    if (selectedFilter === "all") {
      setFilteredActivities(activities)
    } else {
      setFilteredActivities(activities.filter((activity) => activity.type === selectedFilter))
    }
  }, [selectedFilter, activities])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "message":
        return <MessageCircle className="h-4 w-4" />
      case "test_drive":
        return <Calendar className="h-4 w-4" />
      case "listing":
        return <Car className="h-4 w-4" />
      case "system":
        return <Activity className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "info":
        return <AlertCircle className="h-4 w-4 text-blue-600" />
      default:
        return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            {language === "en" ? "Success" : "成功"}
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            {language === "en" ? "Pending" : "保留中"}
          </Badge>
        )
      case "failed":
        return <Badge className="bg-red-100 text-red-800 border-red-200">{language === "en" ? "Failed" : "失敗"}</Badge>
      case "info":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">{language === "en" ? "Info" : "情報"}</Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatRelativeTime = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) {
      return language === "en" ? "Just now" : "たった今"
    } else if (minutes < 60) {
      return language === "en" ? `${minutes}m ago` : `${minutes}分前`
    } else if (hours < 24) {
      return language === "en" ? `${hours}h ago` : `${hours}時間前`
    } else {
      return language === "en" ? `${days}d ago` : `${days}日前`
    }
  }

  const summary = getActivitySummary(activities)

  if (activities.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <Activity className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {language === "en" ? "No Activity Yet" : "まだアクティビティがありません"}
          </h3>
          <p className="text-gray-600 mb-6">
            {language === "en"
              ? "Your activity will appear here as you interact with the platform."
              : "プラットフォームとのやり取りに応じて、アクティビティがここに表示されます。"}
          </p>
          <Button className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90">
            <Car className="h-4 w-4 mr-2" />
            {language === "en" ? "Browse Vehicles" : "車両を閲覧"}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Activity Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{language === "en" ? "Today" : "今日"}</p>
                <p className="text-2xl font-bold text-placebo-gold">{summary.today}</p>
              </div>
              <Activity className="h-8 w-8 text-placebo-gold" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{language === "en" ? "This Week" : "今週"}</p>
                <p className="text-2xl font-bold text-blue-600">{summary.thisWeek}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{language === "en" ? "This Month" : "今月"}</p>
                <p className="text-2xl font-bold text-green-600">{summary.thisMonth}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Feed */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-placebo-gold" />
              {language === "en" ? "Activity Feed" : "アクティビティフィード"}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Tabs value={selectedFilter} onValueChange={setSelectedFilter}>
                <TabsList className="h-8">
                  <TabsTrigger value="all" className="text-xs">
                    {language === "en" ? "All" : "すべて"}
                  </TabsTrigger>
                  <TabsTrigger value="message" className="text-xs">
                    {language === "en" ? "Messages" : "メッセージ"}
                  </TabsTrigger>
                  <TabsTrigger value="test_drive" className="text-xs">
                    {language === "en" ? "Test Drives" : "試乗"}
                  </TabsTrigger>
                  <TabsTrigger value="listing" className="text-xs">
                    {language === "en" ? "Listings" : "リスティング"}
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredActivities.slice(0, 20).map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-white rounded-full flex items-center justify-center border">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-placebo-black">{activity.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                      {activity.vehicleTitle && (
                        <p className="text-xs text-gray-500 mt-1">
                          {language === "en" ? "Vehicle:" : "車両:"} {activity.vehicleTitle}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {getStatusIcon(activity.status)}
                      <span className="text-xs text-gray-500">{formatRelativeTime(activity.timestamp)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredActivities.length > 20 && (
            <div className="text-center mt-6">
              <Button variant="outline" className="bg-transparent">
                <Eye className="h-4 w-4 mr-2" />
                {language === "en" ? "Load More" : "さらに読み込む"}
              </Button>
            </div>
          )}

          {filteredActivities.length === 0 && selectedFilter !== "all" && (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                {language === "en"
                  ? `No ${selectedFilter} activities found.`
                  : `${selectedFilter}のアクティビティが見つかりません。`}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
