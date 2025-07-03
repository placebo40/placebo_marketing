"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MessageCircle,
  Search,
  Send,
  MoreVertical,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Car,
  Tag,
  Calendar,
  Users,
  Wifi,
  WifiOff,
} from "lucide-react"
import { useEnhancedMessaging } from "@/contexts/enhanced-messaging-context"
import { useLanguage } from "@/contexts/language-context"
import { formatDistanceToNow } from "date-fns"

export default function MessageHistory() {
  const {
    threads,
    selectedThread,
    selectThread,
    sendMessage,
    setTyping,
    getTypingUsers,
    searchThreads,
    filterThreads,
    state,
  } = useEnhancedMessaging()
  const { language } = useLanguage()

  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [selectedThread?.messages])

  // Handle typing indicators
  useEffect(() => {
    if (selectedThread && isTyping) {
      setTyping(selectedThread.id, true)

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }

      typingTimeoutRef.current = setTimeout(() => {
        setTyping(selectedThread.id, false)
        setIsTyping(false)
      }, 3000)
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [isTyping, selectedThread, setTyping])

  const handleSendMessage = async () => {
    if (!selectedThread || !newMessage.trim()) return

    await sendMessage(selectedThread.id, newMessage.trim())
    setNewMessage("")
    setIsTyping(false)
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
  }

  const handleTyping = (value: string) => {
    setNewMessage(value)
    if (!isTyping && value.trim()) {
      setIsTyping(true)
    }
  }

  const getFilteredThreads = () => {
    let filtered = threads

    if (searchQuery.trim()) {
      filtered = searchThreads(searchQuery)
    }

    switch (activeFilter) {
      case "unread":
        filtered = filtered.filter((thread) => thread.unreadCount > 0)
        break
      case "active":
        filtered = filterThreads({ status: "active" })
        break
      case "archived":
        filtered = filterThreads({ status: "archived" })
        break
      case "high-priority":
        filtered = filterThreads({ priority: "high" })
        break
    }

    return filtered.sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime())
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sending":
        return <Clock className="h-3 w-3 text-yellow-500" />
      case "sent":
        return <CheckCircle className="h-3 w-3 text-blue-500" />
      case "delivered":
        return <CheckCircle className="h-3 w-3 text-green-500" />
      case "read":
        return <CheckCircle className="h-3 w-3 text-green-600" />
      case "failed":
        return <AlertCircle className="h-3 w-3 text-red-500" />
      default:
        return <Clock className="h-3 w-3 text-gray-400" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "normal":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "low":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const typingUsers = selectedThread ? getTypingUsers(selectedThread.id) : []

  if (threads.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {language === "en" ? "No Messages Yet" : "まだメッセージがありません"}
          </h3>
          <p className="text-gray-600 mb-6">
            {language === "en"
              ? "Your conversations with potential buyers will appear here."
              : "潜在的な購入者との会話がここに表示されます。"}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[800px]">
      {/* Thread List */}
      <div className="lg:col-span-1">
        <Card className="h-full flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-placebo-gold" />
                {language === "en" ? "Conversations" : "会話"}
              </CardTitle>
              <div className="flex items-center gap-1">
                {state.isConnected ? (
                  <Wifi className="h-4 w-4 text-green-500" />
                ) : (
                  <WifiOff className="h-4 w-4 text-red-500" />
                )}
                <span className="text-xs text-gray-500">{state.connectionStatus}</span>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={language === "en" ? "Search conversations..." : "会話を検索..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <Tabs value={activeFilter} onValueChange={setActiveFilter}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="all" className="text-xs">
                  {language === "en" ? "All" : "すべて"}
                </TabsTrigger>
                <TabsTrigger value="unread" className="text-xs">
                  {language === "en" ? "Unread" : "未読"}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-0">
            <div className="space-y-1">
              {getFilteredThreads().map((thread) => (
                <div
                  key={thread.id}
                  onClick={() => selectThread(thread.id)}
                  className={`p-4 cursor-pointer border-b hover:bg-gray-50 transition-colors ${
                    selectedThread?.id === thread.id ? "bg-blue-50 border-l-4 border-l-placebo-gold" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={thread.participants[0]?.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm truncate">
                          {thread.participants.find((p) => p.role === "seller")?.name || "Unknown"}
                        </h4>
                        <div className="flex items-center gap-1">
                          {thread.unreadCount > 0 && (
                            <Badge className="bg-placebo-gold text-placebo-black text-xs">{thread.unreadCount}</Badge>
                          )}
                          <Badge className={`text-xs ${getPriorityColor(thread.priority)}`}>{thread.priority}</Badge>
                        </div>
                      </div>

                      <p className="text-xs text-gray-600 truncate mt-1">
                        <Car className="h-3 w-3 inline mr-1" />
                        {thread.vehicleTitle}
                      </p>

                      <p className="text-xs text-gray-500 truncate mt-1">
                        {thread.messages[thread.messages.length - 1]?.content || "No messages"}
                      </p>

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-400">
                          {formatDistanceToNow(thread.lastActivity, { addSuffix: true })}
                        </span>
                        <div className="flex items-center gap-1">
                          {thread.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              <Tag className="h-2 w-2 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Message View */}
      <div className="lg:col-span-2">
        {selectedThread ? (
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedThread.participants[0]?.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">
                      {selectedThread.participants.find((p) => p.role === "seller")?.name || "Unknown"}
                    </h3>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Car className="h-3 w-3" />
                      {selectedThread.vehicleTitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge className={getPriorityColor(selectedThread.priority)}>{selectedThread.priority}</Badge>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {selectedThread.participants.length} participants
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Created {formatDistanceToNow(selectedThread.createdAt, { addSuffix: true })}
                </span>
              </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {selectedThread.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.senderId === "buyer_1" ? "justify-end" : "justify-start"}`}
                  >
                    {message.senderId !== "buyer_1" && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.senderId === "buyer_1"
                          ? "bg-placebo-gold text-placebo-black"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs opacity-70">
                          {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                        </span>
                        {message.senderId === "buyer_1" && getStatusIcon(message.status)}
                      </div>
                    </div>

                    {message.senderId === "buyer_1" && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}

                {/* Typing Indicator */}
                {typingUsers.length > 0 && (
                  <div className="flex gap-3 justify-start">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-gray-100 rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </CardContent>

            {/* Message Input */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  placeholder={language === "en" ? "Type your message..." : "メッセージを入力..."}
                  value={newMessage}
                  onChange={(e) => handleTyping(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="h-full flex items-center justify-center">
            <CardContent className="text-center">
              <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {language === "en" ? "Select a Conversation" : "会話を選択"}
              </h3>
              <p className="text-gray-600">
                {language === "en"
                  ? "Choose a conversation from the list to view messages."
                  : "リストから会話を選択してメッセージを表示します。"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
