export interface MessageThread {
  id: string
  vehicleId: string
  vehicleTitle: string
  participants: ThreadParticipant[]
  messages: ThreadMessage[]
  status: ThreadStatus
  priority: ThreadPriority
  tags: string[]
  createdAt: Date
  lastActivity: Date
  unreadCount: number
  isArchived: boolean
  metadata: ThreadMetadata
}

export interface ThreadParticipant {
  id: string
  name: string
  email: string
  role: "buyer" | "seller" | "admin"
  avatar?: string
  isOnline: boolean
  lastSeen: Date
  notificationPreferences: NotificationPreferences
}

export interface ThreadMessage {
  id: string
  threadId: string
  senderId: string
  senderName: string
  senderRole: "buyer" | "seller" | "admin"
  content: string
  messageType: MessageType
  timestamp: Date
  status: MessageStatus
  readBy: MessageReadStatus[]
  attachments: MessageAttachment[]
  replyToId?: string
  reactions: MessageReaction[]
  metadata: MessageMetadata
}

export type ThreadStatus = "active" | "resolved" | "archived" | "escalated" | "blocked"
export type ThreadPriority = "low" | "medium" | "high" | "urgent"
export type MessageType =
  | "text"
  | "system"
  | "test_drive_request"
  | "test_drive_response"
  | "price_inquiry"
  | "availability_check"
export type MessageStatus = "sending" | "sent" | "delivered" | "read" | "failed"

export interface MessageReadStatus {
  userId: string
  readAt: Date
}

export interface MessageAttachment {
  id: string
  name: string
  url: string
  type: "image" | "document" | "video"
  size: number
  mimeType: string
}

export interface MessageReaction {
  emoji: string
  userId: string
  timestamp: Date
}

export interface ThreadMetadata {
  source: "web" | "mobile" | "email" | "system"
  category: "inquiry" | "test_drive" | "negotiation" | "support"
  autoResponses: boolean
  escalationRules: EscalationRule[]
}

export interface MessageMetadata {
  deviceInfo?: string
  location?: string
  translated?: boolean
  originalLanguage?: string
  sentiment?: "positive" | "neutral" | "negative"
}

export interface NotificationPreferences {
  email: boolean
  push: boolean
  sms: boolean
  inApp: boolean
  frequency: "immediate" | "hourly" | "daily"
}

export interface EscalationRule {
  condition: "no_response" | "negative_sentiment" | "keyword_match"
  threshold: number
  action: "notify_admin" | "auto_respond" | "priority_boost"
}

class MessageThreadingService {
  private threads: Map<string, MessageThread> = new Map()
  private listeners: Map<string, (thread: MessageThread) => void> = new Map()

  // Thread Management
  createThread(vehicleId: string, vehicleTitle: string, participants: ThreadParticipant[]): MessageThread {
    const thread: MessageThread = {
      id: `thread_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      vehicleId,
      vehicleTitle,
      participants,
      messages: [],
      status: "active",
      priority: "medium",
      tags: [],
      createdAt: new Date(),
      lastActivity: new Date(),
      unreadCount: 0,
      isArchived: false,
      metadata: {
        source: "web",
        category: "inquiry",
        autoResponses: true,
        escalationRules: [],
      },
    }

    this.threads.set(thread.id, thread)
    return thread
  }

  getThread(threadId: string): MessageThread | undefined {
    return this.threads.get(threadId)
  }

  getThreadsByVehicle(vehicleId: string): MessageThread[] {
    return Array.from(this.threads.values()).filter((thread) => thread.vehicleId === vehicleId)
  }

  getThreadsByParticipant(userId: string): MessageThread[] {
    return Array.from(this.threads.values()).filter((thread) => thread.participants.some((p) => p.id === userId))
  }

  // Message Management
  addMessage(
    threadId: string,
    message: Omit<ThreadMessage, "id" | "timestamp" | "status" | "readBy" | "reactions">,
  ): ThreadMessage {
    const thread = this.threads.get(threadId)
    if (!thread) throw new Error("Thread not found")

    const newMessage: ThreadMessage = {
      ...message,
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      status: "sent",
      readBy: [{ userId: message.senderId, readAt: new Date() }],
      reactions: [],
    }

    thread.messages.push(newMessage)
    thread.lastActivity = new Date()
    thread.unreadCount = this.calculateUnreadCount(thread, message.senderId)

    this.threads.set(threadId, thread)
    this.notifyListeners(threadId, thread)

    return newMessage
  }

  markMessageAsRead(threadId: string, messageId: string, userId: string): void {
    const thread = this.threads.get(threadId)
    if (!thread) return

    const message = thread.messages.find((m) => m.id === messageId)
    if (!message) return

    const existingRead = message.readBy.find((r) => r.userId === userId)
    if (!existingRead) {
      message.readBy.push({ userId, readAt: new Date() })
      thread.unreadCount = this.calculateUnreadCount(thread, userId)
      this.threads.set(threadId, thread)
      this.notifyListeners(threadId, thread)
    }
  }

  markThreadAsRead(threadId: string, userId: string): void {
    const thread = this.threads.get(threadId)
    if (!thread) return

    thread.messages.forEach((message) => {
      const existingRead = message.readBy.find((r) => r.userId === userId)
      if (!existingRead) {
        message.readBy.push({ userId, readAt: new Date() })
      }
    })

    thread.unreadCount = 0
    this.threads.set(threadId, thread)
    this.notifyListeners(threadId, thread)
  }

  // Thread Operations
  updateThreadStatus(threadId: string, status: ThreadStatus): void {
    const thread = this.threads.get(threadId)
    if (!thread) return

    thread.status = status
    thread.lastActivity = new Date()
    this.threads.set(threadId, thread)
    this.notifyListeners(threadId, thread)
  }

  updateThreadPriority(threadId: string, priority: ThreadPriority): void {
    const thread = this.threads.get(threadId)
    if (!thread) return

    thread.priority = priority
    this.threads.set(threadId, thread)
    this.notifyListeners(threadId, thread)
  }

  addThreadTag(threadId: string, tag: string): void {
    const thread = this.threads.get(threadId)
    if (!thread) return

    if (!thread.tags.includes(tag)) {
      thread.tags.push(tag)
      this.threads.set(threadId, thread)
      this.notifyListeners(threadId, thread)
    }
  }

  removeThreadTag(threadId: string, tag: string): void {
    const thread = this.threads.get(threadId)
    if (!thread) return

    thread.tags = thread.tags.filter((t) => t !== tag)
    this.threads.set(threadId, thread)
    this.notifyListeners(threadId, thread)
  }

  archiveThread(threadId: string): void {
    const thread = this.threads.get(threadId)
    if (!thread) return

    thread.isArchived = true
    thread.status = "archived"
    this.threads.set(threadId, thread)
    this.notifyListeners(threadId, thread)
  }

  // Utility Methods
  private calculateUnreadCount(thread: MessageThread, excludeUserId: string): number {
    return thread.messages.filter((message) => !message.readBy.some((read) => read.userId === excludeUserId)).length
  }

  private notifyListeners(threadId: string, thread: MessageThread): void {
    const listener = this.listeners.get(threadId)
    if (listener) {
      listener(thread)
    }
  }

  // Subscription Management
  subscribe(threadId: string, callback: (thread: MessageThread) => void): () => void {
    this.listeners.set(threadId, callback)

    return () => {
      this.listeners.delete(threadId)
    }
  }

  // Search and Filter
  searchThreads(
    query: string,
    filters?: {
      status?: ThreadStatus[]
      priority?: ThreadPriority[]
      tags?: string[]
      dateRange?: { start: Date; end: Date }
    },
  ): MessageThread[] {
    let results = Array.from(this.threads.values())

    // Text search
    if (query) {
      const lowerQuery = query.toLowerCase()
      results = results.filter(
        (thread) =>
          thread.vehicleTitle.toLowerCase().includes(lowerQuery) ||
          thread.participants.some((p) => p.name.toLowerCase().includes(lowerQuery)) ||
          thread.messages.some((m) => m.content.toLowerCase().includes(lowerQuery)),
      )
    }

    // Apply filters
    if (filters) {
      if (filters.status) {
        results = results.filter((thread) => filters.status!.includes(thread.status))
      }
      if (filters.priority) {
        results = results.filter((thread) => filters.priority!.includes(thread.priority))
      }
      if (filters.tags) {
        results = results.filter((thread) => filters.tags!.some((tag) => thread.tags.includes(tag)))
      }
      if (filters.dateRange) {
        results = results.filter(
          (thread) => thread.createdAt >= filters.dateRange!.start && thread.createdAt <= filters.dateRange!.end,
        )
      }
    }

    return results.sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime())
  }
}

export { MessageThreadingService }
export const messageThreadingService = new MessageThreadingService()
