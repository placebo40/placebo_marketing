"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  MessageCircle,
  Send,
  Search,
  Filter,
  CheckCircle2,
  Circle,
  MoreVertical,
  Phone,
  Video,
  Paperclip,
  Smile,
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { messageThreadingService, type MessageThread, type ThreadMessage } from "@/lib/message-threading"
import { realtimeMessagingService, type RealtimeEvent } from "@/lib/realtime-messaging"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

interface EnhancedMessagingProps {
  userId: string
  userRole: "buyer" | "seller" | "admin"
  vehicleId?: string
}

export default function EnhancedMessaging({ userId, userRole, vehicleId }: EnhancedMessagingProps) {
  const { language } = useLanguage()
  const [threads, setThreads] = useState<MessageThread[]>([])
  const [selectedThread, setSelectedThread] = useState<MessageThread | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [typingUsers, setTypingUsers] = useState<string[]>([])
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])
  const [connectionId, setConnectionId] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize real-time connection
  useEffect(() => {
    const connId = realtimeMessagingService.connect(userId, selectedThread?.id)
    setConnectionId(connId)

    const unsubscribe = realtimeMessagingService.subscribe(connId, handleRealtimeEvent)

    return () => {
      unsubscribe()
      if (connId) {
        realtimeMessagingService.disconnect(connId)
      }
    }
  }, [userId, selectedThread?.id])

  // Load threads
  useEffect(() => {
    const userThreads = messageThreadingService.getThreadsByParticipant(userId)
    setThreads(userThreads)
  }, [userId])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom()
  }, [selectedThread?.messages])

  const handleRealtimeEvent = (event: RealtimeEvent) => {
    switch (event.type) {
      case "message_sent":
        if (event.threadId === selectedThread?.id) {
          // Refresh thread data
          const updatedThread = messageThreadingService.getThread(event.threadId)
          if (updatedThread) {
            setSelectedThread(updatedThread)
            setThreads((prev) => prev.map((t) => (t.id === event.threadId ? updatedThread : t)))
          }
        }
        break

      case "user_typing":
        if (event.threadId === selectedThread?.id) {
          setTypingUsers((prev) => {
            if (event.data.isTyping) {
              return prev.includes(event.userId) ? prev : [...prev, event.userId]
            } else {
              return prev.filter((id) => id !== event.userId)
            }
          })
        }
        break

      case "user_online":
      case "user_offline":
        setOnlineUsers(realtimeMessagingService.getOnlineUsers())
        break

      case "message_read":
        if (event.threadId === selectedThread?.id) {
          const updatedThread = messageThreadingService.getThread(event.threadId)
          if (updatedThread) {
            setSelectedThread(updatedThread)
          }
        }
        break
    }
  }

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedThread) return

    const message = messageThreadingService.addMessage(selectedThread.id, {
      threadId: selectedThread.id,
      senderId: userId,
      senderName: "Current User", // In real app, get from user context
      senderRole: userRole,
      content: newMessage,
      messageType: "text",
      attachments: [],
      metadata: {},
    })

    realtimeMessagingService.sendMessage(selectedThread.id, userId, message)
    setNewMessage("")
  }

  const handleTyping = (value: string) => {
    setNewMessage(value)

    if (!selectedThread) return

    if (value.trim() && !isTyping) {
      setIsTyping(true)
      realtimeMessagingService.startTyping(selectedThread.id, userId)
    }

    // Reset typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (selectedThread) {
        realtimeMessagingService.stopTyping(selectedThread.id, userId)
        setIsTyping(false)
      }
    }, 1000)
  }

  const handleThreadSelect = (thread: MessageThread) => {
    setSelectedThread(thread)
    messageThreadingService.markThreadAsRead(thread.id, userId)

    // Update connection to new thread
    if (connectionId) {
      realtimeMessagingService.disconnect(connectionId)
      const newConnId = realtimeMessagingService.connect(userId, thread.id)
      setConnectionId(newConnId)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const getMessageStatus = (message: ThreadMessage) => {
    const isRead = message.readBy.length > 1 // More than just sender
    const isDelivered = message.status === "delivered" || message.status === "read"

    if (isRead) return <CheckCircle2 className="h-3 w-3 text-blue-500" />
    if (isDelivered) return <CheckCircle2 className="h-3 w-3 text-gray-400" />
    return <Circle className="h-3 w-3 text-gray-300" />
  }

  const getThreadPreview = (thread: MessageThread) => {
    const lastMessage = thread.messages[thread.messages.length - 1]
    if (!lastMessage) return language === "en" ? "No messages yet" : "まだメッセージがありません"

    return lastMessage.content.length > 50 ? lastMessage.content.substring(0, 50) + "..." : lastMessage.content
  }

  const filteredThreads = threads.filter(
    (thread) =>
      thread.vehicleTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.participants.some((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="h-[600px] flex bg-white border rounded-lg overflow-hidden">
      {/* Thread List */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">{language === "en" ? "Messages" : "メッセージ"}</h2>
            <Button size="sm" variant="ghost">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder={language === "en" ? "Search conversations..." : "会話を検索..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            {filteredThreads.map((thread) => (
              <div
                key={thread.id}
                onClick={() => handleThreadSelect(thread)}
                className={cn(
                  "p-3 rounded-lg cursor-pointer transition-colors mb-2",
                  selectedThread?.id === thread.id
                    ? "bg-placebo-gold/10 border border-placebo-gold/20"
                    : "hover:bg-gray-50",
                )}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>{thread.participants.find((p) => p.id !== userId)?.name[0] || "U"}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-sm truncate">{thread.vehicleTitle}</h4>
                      {thread.unreadCount > 0 && (
                        <Badge className="bg-placebo-gold text-placebo-black text-xs">{thread.unreadCount}</Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 truncate mb-1">{getThreadPreview(thread)}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        {formatDistanceToNow(thread.lastActivity, { addSuffix: true })}
                      </span>
                      <div className="flex items-center gap-1">
                        {thread.priority === "high" && (
                          <Badge variant="destructive" className="text-xs">
                            !
                          </Badge>
                        )}
                        {thread.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
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
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedThread ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>
                      {selectedThread.participants.find((p) => p.id !== userId)?.name[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{selectedThread.vehicleTitle}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>{selectedThread.participants.find((p) => p.id !== userId)?.name}</span>
                      {onlineUsers.includes(selectedThread.participants.find((p) => p.id !== userId)?.id || "") && (
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          {language === "en" ? "Online" : "オンライン"}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {selectedThread.messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn("flex gap-3", message.senderId === userId ? "justify-end" : "justify-start")}
                  >
                    {message.senderId !== userId && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback>{message.senderName[0]}</AvatarFallback>
                      </Avatar>
                    )}
                    <div className="max-w-xs lg:max-w-md">
                      <div
                        className={cn(
                          "px-4 py-2 rounded-2xl",
                          message.senderId === userId
                            ? "bg-placebo-gold text-placebo-black rounded-br-md"
                            : "bg-gray-100 text-gray-900 rounded-bl-md",
                        )}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-1 px-2">
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                        </span>
                        {message.senderId === userId && getMessageStatus(message)}
                      </div>
                    </div>
                    {message.senderId === userId && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-placebo-gold text-placebo-black">
                          {message.senderName[0]}
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
                        {selectedThread.participants.find((p) => typingUsers.includes(p.id))?.name[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-gray-100 px-4 py-2 rounded-2xl rounded-bl-md">
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
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-end gap-2">
                <Button size="sm" variant="ghost">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <div className="flex-1">
                  <Textarea
                    placeholder={language === "en" ? "Type your message..." : "メッセージを入力..."}
                    value={newMessage}
                    onChange={(e) => handleTyping(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                    className="min-h-[40px] max-h-32 resize-none"
                    rows={1}
                  />
                </div>
                <Button size="sm" variant="ghost">
                  <Smile className="h-4 w-4" />
                </Button>
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
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
          </div>
        )}
      </div>
    </div>
  )
}
