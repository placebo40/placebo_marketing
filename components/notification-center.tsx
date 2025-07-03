"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Bell,
  BellRing,
  Check,
  CheckCheck,
  Trash2,
  Settings,
  MessageCircle,
  Calendar,
  Car,
  CreditCard,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  ExternalLink,
} from "lucide-react"
import { notificationService, type Notification } from "@/lib/notification-service"
import { useLanguage } from "@/contexts/language-context"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const { language } = useLanguage()
  const { toast } = useToast()

  useEffect(() => {
    const unsubscribe = notificationService.subscribe(setNotifications)
    return unsubscribe
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  const getNotificationIcon = (notification: Notification) => {
    switch (notification.category) {
      case "message":
        return <MessageCircle className="h-4 w-4" />
      case "test_drive":
        return <Calendar className="h-4 w-4" />
      case "listing":
        return <Car className="h-4 w-4" />
      case "payment":
        return <CreditCard className="h-4 w-4" />
      case "system":
        return <Settings className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getTypeIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "info":
        return <Info className="h-4 w-4 text-blue-600" />
      default:
        return <Info className="h-4 w-4 text-gray-600" />
    }
  }

  const getTypeBadge = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Success</Badge>
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Warning</Badge>
      case "error":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Error</Badge>
      case "info":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Info</Badge>
      default:
        return <Badge variant="secondary">{type}</Badge>
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

  const handleMarkAsRead = (id: string) => {
    notificationService.markAsRead(id)
  }

  const handleMarkAllAsRead = () => {
    notificationService.markAllAsRead()
    toast({
      title: language === "en" ? "All notifications marked as read" : "すべての通知を既読にしました",
      variant: "default",
    })
  }

  const handleRemove = (id: string) => {
    notificationService.remove(id)
    toast({
      title: language === "en" ? "Notification removed" : "通知を削除しました",
      variant: "default",
    })
  }

  const handleClearAll = () => {
    notificationService.clear()
    toast({
      title: language === "en" ? "All notifications cleared" : "すべての通知をクリアしました",
      variant: "default",
    })
  }

  const handleRequestPermission = async () => {
    const granted = await notificationService.requestPermission()
    if (granted) {
      toast({
        title: language === "en" ? "Notifications enabled" : "通知が有効になりました",
        description: language === "en" ? "You'll now receive browser notifications" : "ブラウザ通知を受信します",
        variant: "default",
      })
    } else {
      toast({
        title: language === "en" ? "Notifications blocked" : "通知がブロックされました",
        description:
          language === "en"
            ? "Enable notifications in your browser settings"
            : "ブラウザ設定で通知を有効にしてください",
        variant: "destructive",
      })
    }
  }

  const filterNotifications = (category?: string) => {
    if (!category || category === "all") return notifications
    return notifications.filter((n) => n.category === category)
  }

  const filteredNotifications = filterNotifications(activeTab)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          {unreadCount > 0 ? <BellRing className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-placebo-gold" />
              {language === "en" ? "Notifications" : "通知"}
              {unreadCount > 0 && (
                <Badge className="bg-red-100 text-red-800 border-red-200">
                  {unreadCount} {language === "en" ? "unread" : "未読"}
                </Badge>
              )}
            </DialogTitle>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button variant="outline" size="sm" onClick={handleMarkAllAsRead} className="bg-transparent">
                  <CheckCheck className="h-4 w-4 mr-1" />
                  {language === "en" ? "Mark all read" : "すべて既読"}
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={handleRequestPermission} className="bg-transparent">
                <Settings className="h-4 w-4 mr-1" />
                {language === "en" ? "Enable alerts" : "アラート有効"}
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="all" className="text-xs">
                {language === "en" ? "All" : "すべて"} ({notifications.length})
              </TabsTrigger>
              <TabsTrigger value="message" className="text-xs">
                <MessageCircle className="h-3 w-3 mr-1" />
                {filterNotifications("message").length}
              </TabsTrigger>
              <TabsTrigger value="test_drive" className="text-xs">
                <Calendar className="h-3 w-3 mr-1" />
                {filterNotifications("test_drive").length}
              </TabsTrigger>
              <TabsTrigger value="listing" className="text-xs">
                <Car className="h-3 w-3 mr-1" />
                {filterNotifications("listing").length}
              </TabsTrigger>
              <TabsTrigger value="payment" className="text-xs">
                <CreditCard className="h-3 w-3 mr-1" />
                {filterNotifications("payment").length}
              </TabsTrigger>
              <TabsTrigger value="system" className="text-xs">
                <Settings className="h-3 w-3 mr-1" />
                {filterNotifications("system").length}
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto mt-4">
              <TabsContent value={activeTab} className="mt-0 h-full">
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">{language === "en" ? "No notifications" : "通知がありません"}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredNotifications.map((notification) => (
                      <Card
                        key={notification.id}
                        className={`transition-all ${
                          !notification.read ? "border-l-4 border-l-placebo-gold bg-yellow-50" : "bg-white"
                        }`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                              {getNotificationIcon(notification)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-medium text-placebo-black">{notification.title}</h4>
                                    {!notification.read && <div className="w-2 h-2 bg-placebo-gold rounded-full"></div>}
                                  </div>
                                  <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                                  {notification.vehicleTitle && (
                                    <p className="text-xs text-gray-500 mb-2">
                                      {language === "en" ? "Vehicle:" : "車両:"} {notification.vehicleTitle}
                                    </p>
                                  )}
                                  <div className="flex items-center gap-2">
                                    {getTypeIcon(notification.type)}
                                    <span className="text-xs text-gray-500">
                                      {formatRelativeTime(notification.timestamp)}
                                    </span>
                                    {notification.priority === "high" && (
                                      <Badge className="bg-red-100 text-red-800 border-red-200 text-xs">
                                        {language === "en" ? "High Priority" : "高優先度"}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-1 ml-4">
                                  {!notification.read && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleMarkAsRead(notification.id)}
                                      className="h-8 w-8 p-0"
                                    >
                                      <Check className="h-4 w-4" />
                                    </Button>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemove(notification.id)}
                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              {notification.actionUrl && notification.actionText && (
                                <div className="mt-3">
                                  <Link href={notification.actionUrl}>
                                    <Button
                                      size="sm"
                                      className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90"
                                      onClick={() => {
                                        handleMarkAsRead(notification.id)
                                        setIsOpen(false)
                                      }}
                                    >
                                      {notification.actionText}
                                      <ExternalLink className="h-3 w-3 ml-1" />
                                    </Button>
                                  </Link>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {notifications.length > 0 && (
          <div className="border-t pt-4 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAll}
              className="w-full bg-transparent text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {language === "en" ? "Clear All Notifications" : "すべての通知をクリア"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
