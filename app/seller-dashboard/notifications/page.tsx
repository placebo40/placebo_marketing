"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, MessageCircle, Car, AlertCircle, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"

interface Notification {
  id: string
  type: "message" | "listing" | "system" | "alert"
  title: string
  description: string
  time: string
  date: Date
  read: boolean
  link: string
  itemId: string | null
}

export default function NotificationsPage() {
  const { language } = useLanguage()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would fetch from an API
    const mockNotifications: Notification[] = [
      {
        id: "1",
        type: "message",
        title: language === "en" ? "New message about your Honda Civic" : "ホンダシビックについての新しいメッセージ",
        description:
          language === "en" ? "John Smith: Is the car still available?" : "ジョン・スミス：車はまだ利用可能ですか？",
        time: "5m ago",
        date: new Date(Date.now() - 5 * 60 * 1000),
        read: false,
        link: "/seller-dashboard/messages",
        itemId: "1", // conversation ID
      },
      {
        id: "2",
        type: "listing",
        title: language === "en" ? "Your listing is now live" : "あなたの出品が公開されました",
        description:
          language === "en"
            ? "2019 Honda Civic is now visible to buyers"
            : "2019年ホンダシビックが購入者に表示されるようになりました",
        time: "1h ago",
        date: new Date(Date.now() - 60 * 60 * 1000),
        read: false,
        link: "/seller-dashboard/listings",
        itemId: "listing1", // listing ID
      },
      {
        id: "3",
        type: "system",
        title: language === "en" ? "Profile verification complete" : "プロフィール認証完了",
        description:
          language === "en" ? "Your identity has been verified successfully" : "あなたの身元は正常に確認されました",
        time: "2d ago",
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        read: true,
        link: "/profile",
        itemId: null,
      },
      {
        id: "4",
        type: "alert",
        title: language === "en" ? "Price alert: Similar listings" : "価格アラート：類似のリスティング",
        description:
          language === "en"
            ? "3 similar Honda Civic listings have lower prices"
            : "3つの類似ホンダシビックリスティングの価格が低くなっています",
        time: "3d ago",
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        read: true,
        link: "/seller-dashboard/listings",
        itemId: "listing1",
      },
      {
        id: "5",
        type: "message",
        title:
          language === "en" ? "New message about your Toyota Camry" : "あなたのトヨタカムリについての新しいメッセージ",
        description:
          language === "en"
            ? "Sarah Johnson: Can I schedule a test drive?"
            : "サラ・ジョンソン：試乗の予約はできますか？",
        time: "4d ago",
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        read: true,
        link: "/seller-dashboard/messages",
        itemId: "2", // conversation ID
      },
    ]

    setNotifications(mockNotifications)
    setIsLoading(false)
  }, [language])

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "message":
        return <MessageCircle className="h-5 w-5 text-blue-500" />
      case "listing":
        return <Car className="h-5 w-5 text-green-500" />
      case "alert":
        return <AlertCircle className="h-5 w-5 text-amber-500" />
      case "system":
        return <CheckCircle className="h-5 w-5 text-purple-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const filterNotifications = (filter: string) => {
    if (filter === "all") return notifications
    if (filter === "unread") return notifications.filter((n) => !n.read)
    return notifications.filter((n) => n.type === filter)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(language === "en" ? "en-US" : "ja-JP", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-placebo-gold mx-auto mb-4"></div>
            <p className="text-gray-600">{language === "en" ? "Loading notifications..." : "通知を読み込み中..."}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-placebo-black">{language === "en" ? "Notifications" : "通知"}</h1>
          <p className="text-gray-600 mt-1">
            {language === "en"
              ? "Stay updated with messages, listing updates, and system alerts"
              : "メッセージ、リスティングの更新、システムアラートで最新情報を入手"}
          </p>
        </div>
        {notifications.some((n) => !n.read) && (
          <Button
            variant="outline"
            onClick={markAllAsRead}
            className="text-placebo-black border-placebo-gold hover:bg-placebo-gold/10"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            {language === "en" ? "Mark all as read" : "すべて既読にする"}
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card className="text-center py-12">
          <div className="flex flex-col items-center justify-center">
            <Bell className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {language === "en" ? "No notifications" : "通知はありません"}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md">
              {language === "en"
                ? "You're all caught up! We'll notify you when there's activity related to your listings or account."
                : "すべて確認済みです！リスティングやアカウントに関連するアクティビティがあれば通知します。"}
            </p>
          </div>
        </Card>
      ) : (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">
              {language === "en" ? "All" : "すべて"} ({notifications.length})
            </TabsTrigger>
            <TabsTrigger value="unread">
              {language === "en" ? "Unread" : "未読"} ({notifications.filter((n) => !n.read).length})
            </TabsTrigger>
            <TabsTrigger value="message">
              {language === "en" ? "Messages" : "メッセージ"} (
              {notifications.filter((n) => n.type === "message").length})
            </TabsTrigger>
            <TabsTrigger value="listing">
              {language === "en" ? "Listings" : "リスティング"} (
              {notifications.filter((n) => n.type === "listing").length})
            </TabsTrigger>
            <TabsTrigger value="system">
              {language === "en" ? "System" : "システム"} (
              {notifications.filter((n) => n.type === "system" || n.type === "alert").length})
            </TabsTrigger>
          </TabsList>

          {["all", "unread", "message", "listing", "system"].map((filter) => (
            <TabsContent key={filter} value={filter} className="mt-6">
              <div className="space-y-4">
                {filterNotifications(filter).map((notification) => (
                  <Card
                    key={notification.id}
                    className={`p-4 ${!notification.read ? "border-l-4 border-l-placebo-gold" : ""}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <Link
                            href={notification.link}
                            className="text-lg font-medium text-placebo-black hover:text-placebo-gold"
                            onClick={() => markAsRead(notification.id)}
                          >
                            {notification.title}
                          </Link>
                          <div className="flex items-center gap-2">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                className="h-8 text-placebo-gold hover:text-placebo-gold/80 hover:bg-transparent"
                              >
                                {language === "en" ? "Mark as read" : "既読にする"}
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                              className="h-8 text-red-500 hover:text-red-700 hover:bg-transparent"
                            >
                              {language === "en" ? "Delete" : "削除"}
                            </Button>
                          </div>
                        </div>
                        <p className="text-gray-600 mt-1">{notification.description}</p>
                        <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>{formatDate(notification.date)}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  )
}
