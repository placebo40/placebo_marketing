"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useEnhancedMessaging } from "@/contexts/enhanced-messaging-context"
import { useLanguage } from "@/contexts/language-context"
import { Send, MessageCircle, Clock, CheckCheck, User, Loader2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface SendMessageModalProps {
  isOpen: boolean
  onClose: () => void
  vehicleId: string
  vehicleTitle: string
  sellerId?: string
  sellerName?: string
}

export default function SendMessageModal({
  isOpen,
  onClose,
  vehicleId,
  vehicleTitle,
  sellerId = "seller",
  sellerName = "Vehicle Seller",
}: SendMessageModalProps) {
  const { language } = useLanguage()
  const {
    threads,
    activeThread,
    setActiveThread,
    createThread,
    sendMessage,
    markAsRead,
    typingUsers,
    startTyping,
    stopTyping,
    isConnected,
  } = useEnhancedMessaging()

  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  // Find existing thread for this vehicle
  const existingThread = threads.find((thread) => thread.vehicleId === vehicleId)

  useEffect(() => {
    if (existingThread) {
      setActiveThread(existingThread)
      setShowHistory(true)
      markAsRead(existingThread.id)
    }
  }, [existingThread, setActiveThread, markAsRead])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [activeThread?.messages])

  const handleSendMessage = async () => {
    if (!message.trim()) return

    setIsLoading(true)
    try {
      if (existingThread) {
        await sendMessage(existingThread.id, message)
      } else {
        const subject = language === "en" ? `Inquiry about ${vehicleTitle}` : `${vehicleTitle}についてのお問い合わせ`
        const newThread = await createThread(vehicleId, subject, message)
        setActiveThread(newThread)
        setShowHistory(true)
      }
      setMessage("")
      stopTyping(existingThread?.id || "")
    } catch (error) {
      console.error("Failed to send message:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTyping = (value: string) => {
    setMessage(value)

    if (existingThread && value.trim()) {
      startTyping(existingThread.id)

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }

      // Set new timeout to stop typing
      typingTimeoutRef.current = setTimeout(() => {
        stopTyping(existingThread.id)
      }, 3000)
    }
  }

  const formatMessageTime = (timestamp: string) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
  }

  const getTypingIndicator = () => {
    if (!existingThread) return null

    const threadTyping = typingUsers.filter((t) => t.threadId === existingThread.id && t.userId !== "current-user")

    if (threadTyping.length === 0) return null

    return (
      <div className="flex items-center gap-2 text-sm text-gray-500 px-4 py-2">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
        <span>
          {threadTyping.length === 1
            ? `${threadTyping[0].userName} is typing...`
            : `${threadTyping.length} people are typing...`}
        </span>
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            {language === "en" ? "Send Message" : "メッセージを送信"}
            {!isConnected && (
              <Badge variant="outline" className="text-orange-600 border-orange-200">
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                Connecting...
              </Badge>
            )}
          </DialogTitle>
          <div className="text-sm text-gray-600">
            {language === "en" ? "About:" : "件名:"} {vehicleTitle}
          </div>
        </DialogHeader>

        <div className="flex-1 flex flex-col min-h-0">
          {showHistory && activeThread ? (
            <>
              {/* Thread Header */}
              <div className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-lg">
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="/professional-headshot.png" />
                    <AvatarFallback>
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-sm">{sellerName}</div>
                    <div className="text-xs text-gray-500">
                      {language === "en" ? "Usually responds within 1 hour" : "通常1時間以内に返信"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={activeThread.status === "active" ? "default" : "secondary"}>
                    {activeThread.status}
                  </Badge>
                  {activeThread.unreadCount > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {activeThread.unreadCount}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {activeThread.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${msg.senderId === "current-user" ? "flex-row-reverse" : "flex-row"}`}
                    >
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarImage src={msg.senderAvatar || "/placeholder.svg"} />
                        <AvatarFallback>{msg.senderName.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className={`max-w-[70%] ${msg.senderId === "current-user" ? "text-right" : "text-left"}`}>
                        <div
                          className={`inline-block p-3 rounded-lg ${
                            msg.senderId === "current-user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{formatMessageTime(msg.timestamp)}</span>
                          {msg.senderId === "current-user" && msg.readBy.length > 1 && (
                            <CheckCheck className="w-3 h-3 text-blue-600" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div ref={messagesEndRef} />
              </ScrollArea>

              {/* Typing Indicator */}
              {getTypingIndicator()}
            </>
          ) : (
            /* Initial Message Form */
            <div className="flex-1 p-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {language === "en" ? "Your Message" : "メッセージ"}
                  </label>
                  <Textarea
                    value={message}
                    onChange={(e) => handleTyping(e.target.value)}
                    placeholder={
                      language === "en"
                        ? "Hi, I'm interested in this vehicle. Could you provide more details?"
                        : "こんにちは、この車両に興味があります。詳細を教えていただけますか？"
                    }
                    className="min-h-[120px] resize-none"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Message Input */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => handleTyping(e.target.value)}
                placeholder={language === "en" ? "Type your message..." : "メッセージを入力..."}
                className="flex-1"
                disabled={isLoading || !isConnected}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim() || isLoading || !isConnected}
                className="px-4"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              {language === "en" ? "Press Enter to send, Shift+Enter for new line" : "Enterで送信、Shift+Enterで改行"}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
