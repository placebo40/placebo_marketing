"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MessageCircle, CheckCircle, Send, Search, Archive, Star } from "lucide-react"
import { useEnhancedMessaging } from "@/contexts/enhanced-messaging-context"
import { formatDistanceToNow } from "date-fns"

export default function MessageThreadViewer() {
  const { threads, selectedThread, selectThread, sendMessage, markThreadAsRead } = useEnhancedMessaging()
  const [searchQuery, setSearchQuery] = useState("")
  const [replyMessage, setReplyMessage] = useState("")

  const filteredThreads = threads.filter((thread) => {
    if (!searchQuery.trim()) return true

    const searchLower = searchQuery.toLowerCase()
    return (
      (thread.vehicleTitle?.toLowerCase() || "").includes(searchLower) ||
      (thread.subject?.toLowerCase() || "").includes(searchLower) ||
      thread.participants.some(
        (p) =>
          (p.name?.toLowerCase() || "").includes(searchLower) || (p.email?.toLowerCase() || "").includes(searchLower),
      )
    )
  })

  const handleThreadSelect = (threadId: string) => {
    selectThread(threadId)
    markThreadAsRead(threadId)
  }

  const handleSendReply = async () => {
    if (!selectedThread || !replyMessage.trim()) return

    await sendMessage(selectedThread.id, replyMessage)
    setReplyMessage("")
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      {/* Thread List */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Message Threads
          </CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search threads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-96 overflow-y-auto">
            {filteredThreads.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <MessageCircle className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No message threads</p>
              </div>
            ) : (
              filteredThreads.map((thread) => {
                const buyerParticipant = thread.participants.find((p) => p.role === "buyer")
                const lastMessage = thread.messages[thread.messages.length - 1]

                return (
                  <div
                    key={thread.id}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedThread?.id === thread.id ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
                    }`}
                    onClick={() => handleThreadSelect(thread.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {buyerParticipant?.name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("") || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{buyerParticipant?.name || "Unknown User"}</p>
                          <p className="text-xs text-gray-600">{thread.vehicleTitle || "Unknown Vehicle"}</p>
                        </div>
                      </div>
                      {thread.unreadCount > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {thread.unreadCount}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate mb-1">{lastMessage?.content || "No messages"}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>
                        {thread.lastActivity ? formatDistanceToNow(thread.lastActivity, { addSuffix: true }) : ""}
                      </span>
                      <div className="flex items-center gap-1">
                        {thread.status === "active" && <div className="w-2 h-2 bg-green-500 rounded-full" />}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Chat Area */}
      <Card className="lg:col-span-2">
        {selectedThread ? (
          <>
            {/* Chat Header */}
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{selectedThread.vehicleTitle || "Unknown Vehicle"}</CardTitle>
                  <p className="text-sm text-gray-600">
                    Conversation with{" "}
                    {selectedThread.participants.find((p) => p.role === "buyer")?.name || "Unknown User"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Archive className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Star className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="p-0 flex flex-col h-96">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedThread.messages.map((message) => {
                  const isFromSeller = message.senderId !== "buyer_1"

                  return (
                    <div key={message.id} className={`flex gap-3 ${isFromSeller ? "justify-end" : "justify-start"}`}>
                      {!isFromSeller && (
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarFallback className="text-xs">
                            {selectedThread.participants
                              .find((p) => p.role === "buyer")
                              ?.name?.split(" ")
                              .map((n) => n[0])
                              .join("") || "?"}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className="max-w-xs lg:max-w-md">
                        <div
                          className={`px-4 py-3 rounded-2xl shadow-sm ${
                            isFromSeller
                              ? "bg-placebo-gold text-placebo-black rounded-br-md"
                              : "bg-white border border-gray-200 text-gray-900 rounded-bl-md"
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{message.content}</p>
                          <div className="flex items-center justify-between mt-2 text-xs opacity-70">
                            <span>{message.timestamp.toLocaleTimeString()}</span>
                            {message.status === "sent" && <CheckCircle className="h-3 w-3" />}
                          </div>
                        </div>
                      </div>
                      {isFromSeller && (
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarFallback className="bg-placebo-gold text-placebo-black text-xs">You</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Reply Input */}
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Type your reply..."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    className="flex-1 min-h-[60px] resize-none"
                    rows={2}
                  />
                  <Button
                    onClick={handleSendReply}
                    disabled={!replyMessage.trim()}
                    className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </>
        ) : (
          <CardContent className="flex items-center justify-center h-96">
            <div className="text-center text-gray-500">
              <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">Select a thread to view messages</p>
              <p className="text-sm">Choose a conversation from the list to start messaging</p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
