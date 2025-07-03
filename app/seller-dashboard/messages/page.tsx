"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Send, MessageCircle, Clock, User, Car, Languages, Filter, Archive, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/hooks/use-translation"
import { detectLanguage, getLanguageName } from "@/lib/translation-service"

interface Message {
  id: string
  senderId: string
  senderName: string
  senderAvatar?: string
  content: string
  timestamp: Date
  isRead: boolean
}

interface Conversation {
  id: string
  buyerId: string
  buyerName: string
  buyerAvatar?: string
  listingId: string
  listingTitle: string
  lastMessage: Message
  unreadCount: number
  messages: Message[]
}

export default function MessagesPage() {
  const { language } = useLanguage()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const { translate, isTranslating } = useTranslation()
  const [translatedMessages, setTranslatedMessages] = useState<{
    [key: string]: { text: string; originalLang: string; targetLang: string }
  }>({})
  const [expandedTranslations, setExpandedTranslations] = useState<{ [key: string]: boolean }>({})
  const [userPreferredLanguage, setUserPreferredLanguage] = useState<string>(language === "en" ? "en" : "ja")
  const [showingTranslations, setShowingTranslations] = useState<{ [key: string]: boolean }>({})
  const [originalMessages, setOriginalMessages] = useState<{ [key: string]: string }>({})

  // Mock data - in real app, this would come from an API
  useEffect(() => {
    const mockConversations: Conversation[] = [
      {
        id: "1",
        buyerId: "buyer1",
        buyerName: "John Smith",
        buyerAvatar: "/placeholder.svg?height=40&width=40",
        listingId: "listing1",
        listingTitle: "2019 Honda Civic",
        unreadCount: 2,
        lastMessage: {
          id: "msg3",
          senderId: "buyer1",
          senderName: "John Smith",
          content: "Is the car still available? I'm very interested.",
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          isRead: false,
        },
        messages: [
          {
            id: "msg1",
            senderId: "seller",
            senderName: "You",
            content: "Hello! Thanks for your interest in my Honda Civic.",
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            isRead: true,
          },
          {
            id: "msg2",
            senderId: "buyer1",
            senderName: "John Smith",
            content: "Hi! Could you tell me more about the maintenance history?",
            timestamp: new Date(Date.now() - 60 * 60 * 1000),
            isRead: true,
          },
          {
            id: "msg3",
            senderId: "buyer1",
            senderName: "John Smith",
            content: "Is the car still available? I'm very interested.",
            timestamp: new Date(Date.now() - 30 * 60 * 1000),
            isRead: false,
          },
        ],
      },
      {
        id: "2",
        buyerId: "buyer2",
        buyerName: "Sarah Johnson",
        buyerAvatar: "/placeholder.svg?height=40&width=40",
        listingId: "listing2",
        listingTitle: "2020 Toyota Camry",
        unreadCount: 0,
        lastMessage: {
          id: "msg4",
          senderId: "seller",
          senderName: "You",
          content: "The car is in excellent condition. Would you like to schedule a test drive?",
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
          isRead: true,
        },
        messages: [
          {
            id: "msg4",
            senderId: "seller",
            senderName: "You",
            content: "The car is in excellent condition. Would you like to schedule a test drive?",
            timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
            isRead: true,
          },
        ],
      },
    ]
    setConversations(mockConversations)
    setSelectedConversation(mockConversations[0])
  }, [])

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return

    const message: Message = {
      id: `msg_${Date.now()}`,
      senderId: "seller",
      senderName: "You",
      content: newMessage,
      timestamp: new Date(),
      isRead: true,
    }

    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === selectedConversation.id
          ? {
              ...conv,
              messages: [...conv.messages, message],
              lastMessage: message,
            }
          : conv,
      ),
    )

    setSelectedConversation((prev) =>
      prev
        ? {
            ...prev,
            messages: [...prev.messages, message],
            lastMessage: message,
          }
        : null,
    )

    setNewMessage("")
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  const handleTranslateMessage = async (messageId: string, messageText: string) => {
    try {
      // Store original message if not already stored
      if (!originalMessages[messageId]) {
        setOriginalMessages((prev) => ({
          ...prev,
          [messageId]: messageText,
        }))
      }

      const detectedLang = detectLanguage(messageText)
      const targetLang = detectedLang === "en" ? "ja" : "en" // Toggle between EN/JA

      const result = await translate(messageText, targetLang)

      setTranslatedMessages((prev) => ({
        ...prev,
        [messageId]: {
          text: result.translatedText,
          originalLang: result.detectedLanguage,
          targetLang: targetLang,
        },
      }))

      setShowingTranslations((prev) => ({
        ...prev,
        [messageId]: true,
      }))
    } catch (error) {
      console.error("Translation failed:", error)
    }
  }

  const toggleToOriginal = (messageId: string) => {
    setShowingTranslations((prev) => ({
      ...prev,
      [messageId]: false,
    }))
  }

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.listingTitle.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-placebo-black">{language === "en" ? "Messages" : "メッセージ"}</h1>
          <p className="text-placebo-dark-gray mt-2">
            {language === "en" ? "Manage conversations with potential buyers" : "潜在的な購入者との会話を管理"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            {language === "en" ? "Filter" : "フィルター"}
          </Button>
          <Button variant="outline" size="sm">
            <Archive className="h-4 w-4 mr-2" />
            {language === "en" ? "Archive" : "アーカイブ"}
          </Button>
        </div>
      </div>

      {/* Messages Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              {language === "en" ? "Conversations" : "会話"}
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={language === "en" ? "Search conversations..." : "会話を検索..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="max-h-[580px] overflow-y-auto">
              {filteredConversations.length === 0 ? (
                <div className="p-8 text-center">
                  <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">{language === "en" ? "No conversations yet" : "まだ会話がありません"}</p>
                </div>
              ) : (
                filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation)}
                    className={cn(
                      "p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors",
                      selectedConversation?.id === conversation.id &&
                        "bg-placebo-gold/10 border-l-4 border-l-placebo-gold",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10 flex-shrink-0">
                        <AvatarImage src={conversation.buyerAvatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          <User className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium text-gray-900 truncate">{conversation.buyerName}</h3>
                          <div className="flex items-center gap-2">
                            {conversation.unreadCount > 0 && (
                              <Badge className="bg-placebo-gold text-placebo-black text-xs">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                            <span className="text-xs text-gray-500">
                              {formatTime(conversation.lastMessage.timestamp)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 mb-1">
                          <Car className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500 truncate">{conversation.listingTitle}</span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{conversation.lastMessage.content}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedConversation.buyerAvatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="font-semibold text-gray-900">{selectedConversation.buyerName}</h2>
                      <div className="flex items-center gap-1">
                        <Car className="h-3 w-3 text-gray-500" />
                        <span className="text-sm text-gray-500">{selectedConversation.listingTitle}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Star className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Archive className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="p-0">
                <div className="h-[480px] overflow-y-auto p-4 space-y-4">
                  {selectedConversation.messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn("flex gap-3", message.senderId === "seller" ? "justify-end" : "justify-start")}
                    >
                      {message.senderId !== "seller" && (
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarImage src={selectedConversation.buyerAvatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className="max-w-xs lg:max-w-md space-y-2">
                        <div
                          className={cn(
                            "px-4 py-3 rounded-2xl shadow-sm relative group",
                            message.senderId === "seller"
                              ? "bg-placebo-gold text-placebo-black rounded-br-md"
                              : "bg-white border border-gray-200 text-gray-900 rounded-bl-md",
                            showingTranslations[message.id] && "border-2 border-dashed border-blue-300",
                          )}
                        >
                          <p className="text-sm leading-relaxed">
                            {showingTranslations[message.id] && translatedMessages[message.id]
                              ? translatedMessages[message.id].text
                              : message.content}
                          </p>

                          {/* Translation indicator */}
                          {showingTranslations[message.id] && (
                            <div className="flex items-center gap-1 mt-1 text-xs text-blue-600">
                              <Languages className="h-3 w-3" />
                              <span>
                                {getLanguageName(translatedMessages[message.id].originalLang)} →{" "}
                                {getLanguageName(translatedMessages[message.id].targetLang)}
                              </span>
                            </div>
                          )}

                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 opacity-50" />
                              <span className="text-xs opacity-60">{formatTime(message.timestamp)}</span>
                            </div>

                            {/* Translation Controls */}
                            <div className="flex items-center gap-1">
                              {showingTranslations[message.id] ? (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => toggleToOriginal(message.id)}
                                  className={cn(
                                    "h-6 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                                    message.senderId === "seller"
                                      ? "text-placebo-black/70 hover:text-placebo-black hover:bg-placebo-black/10"
                                      : "text-gray-500 hover:text-placebo-gold hover:bg-placebo-gold/10",
                                  )}
                                >
                                  <span className="text-xs">{language === "en" ? "Original" : "元の文"}</span>
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleTranslateMessage(message.id, message.content)}
                                  disabled={isTranslating}
                                  className={cn(
                                    "h-6 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                                    message.senderId === "seller"
                                      ? "text-placebo-black/70 hover:text-placebo-black hover:bg-placebo-black/10"
                                      : "text-gray-500 hover:text-placebo-gold hover:bg-placebo-gold/10",
                                  )}
                                >
                                  {isTranslating ? (
                                    <div className="animate-spin rounded-full h-3 w-3 border-b border-current"></div>
                                  ) : (
                                    <Languages className="h-3 w-3" />
                                  )}
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {message.senderId === "seller" && (
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarFallback className="bg-placebo-gold text-placebo-black">
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex gap-2">
                    <Textarea
                      placeholder={language === "en" ? "Type your message..." : "メッセージを入力..."}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                      className="flex-1 min-h-[60px] max-h-32 resize-none"
                      rows={2}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90 self-end"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-[640px]">
              <div className="text-center">
                <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {language === "en" ? "Select a conversation" : "会話を選択してください"}
                </h3>
                <p className="text-gray-500">
                  {language === "en"
                    ? "Choose a conversation from the list to start messaging"
                    : "リストから会話を選択してメッセージを開始してください"}
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}
