export interface RealtimeConnection {
  id: string
  userId: string
  threadId?: string
  status: "connecting" | "connected" | "disconnected" | "error"
  lastPing: Date
  metadata: ConnectionMetadata
}

export interface ConnectionMetadata {
  userAgent: string
  ipAddress?: string
  deviceType: "desktop" | "mobile" | "tablet"
  location?: string
}

export interface RealtimeEvent {
  type: RealtimeEventType
  threadId: string
  userId: string
  data: any
  timestamp: Date
}

export type RealtimeEventType =
  | "message_sent"
  | "message_read"
  | "user_typing"
  | "user_online"
  | "user_offline"
  | "thread_updated"
  | "participant_joined"
  | "participant_left"

class RealtimeMessagingService {
  private connections: Map<string, RealtimeConnection> = new Map()
  private eventListeners: Map<string, (event: RealtimeEvent) => void> = new Map()
  private typingIndicators: Map<string, Set<string>> = new Map() // threadId -> Set of userIds
  private onlineUsers: Set<string> = new Set()
  private heartbeatInterval: NodeJS.Timeout | null = null

  constructor() {
    this.startHeartbeat()
  }

  // Connection Management
  connect(userId: string, threadId?: string): string {
    const connectionId = `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const connection: RealtimeConnection = {
      id: connectionId,
      userId,
      threadId,
      status: "connecting",
      lastPing: new Date(),
      metadata: {
        userAgent: typeof window !== "undefined" ? window.navigator.userAgent : "server",
        deviceType: this.detectDeviceType(),
      },
    }

    this.connections.set(connectionId, connection)
    this.onlineUsers.add(userId)

    // Simulate connection establishment
    setTimeout(() => {
      connection.status = "connected"
      this.connections.set(connectionId, connection)
      this.broadcastEvent({
        type: "user_online",
        threadId: threadId || "",
        userId,
        data: { connectionId },
        timestamp: new Date(),
      })
    }, 100)

    return connectionId
  }

  disconnect(connectionId: string): void {
    const connection = this.connections.get(connectionId)
    if (!connection) return

    connection.status = "disconnected"
    this.connections.set(connectionId, connection)
    this.onlineUsers.delete(connection.userId)

    this.broadcastEvent({
      type: "user_offline",
      threadId: connection.threadId || "",
      userId: connection.userId,
      data: { connectionId },
      timestamp: new Date(),
    })

    // Clean up after a delay
    setTimeout(() => {
      this.connections.delete(connectionId)
    }, 5000)
  }

  // Real-time Events
  sendMessage(threadId: string, userId: string, message: any): void {
    this.broadcastEvent({
      type: "message_sent",
      threadId,
      userId,
      data: message,
      timestamp: new Date(),
    })

    // Clear typing indicator
    this.stopTyping(threadId, userId)
  }

  markMessageAsRead(threadId: string, userId: string, messageId: string): void {
    this.broadcastEvent({
      type: "message_read",
      threadId,
      userId,
      data: { messageId },
      timestamp: new Date(),
    })
  }

  // Typing Indicators
  startTyping(threadId: string, userId: string): void {
    if (!this.typingIndicators.has(threadId)) {
      this.typingIndicators.set(threadId, new Set())
    }

    const typingUsers = this.typingIndicators.get(threadId)!
    if (!typingUsers.has(userId)) {
      typingUsers.add(userId)

      this.broadcastEvent({
        type: "user_typing",
        threadId,
        userId,
        data: { isTyping: true },
        timestamp: new Date(),
      })

      // Auto-stop typing after 3 seconds
      setTimeout(() => {
        this.stopTyping(threadId, userId)
      }, 3000)
    }
  }

  stopTyping(threadId: string, userId: string): void {
    const typingUsers = this.typingIndicators.get(threadId)
    if (typingUsers && typingUsers.has(userId)) {
      typingUsers.delete(userId)

      this.broadcastEvent({
        type: "user_typing",
        threadId,
        userId,
        data: { isTyping: false },
        timestamp: new Date(),
      })
    }
  }

  getTypingUsers(threadId: string): string[] {
    const typingUsers = this.typingIndicators.get(threadId)
    return typingUsers ? Array.from(typingUsers) : []
  }

  // Presence Management
  isUserOnline(userId: string): boolean {
    return this.onlineUsers.has(userId)
  }

  getOnlineUsers(): string[] {
    return Array.from(this.onlineUsers)
  }

  updatePresence(userId: string, status: "online" | "away" | "busy" | "offline"): void {
    if (status === "offline") {
      this.onlineUsers.delete(userId)
    } else {
      this.onlineUsers.add(userId)
    }

    // Find user's connections and broadcast presence update
    const userConnections = Array.from(this.connections.values()).filter((conn) => conn.userId === userId)

    userConnections.forEach((conn) => {
      if (conn.threadId) {
        this.broadcastEvent({
          type: "user_online",
          threadId: conn.threadId,
          userId,
          data: { status },
          timestamp: new Date(),
        })
      }
    })
  }

  // Event Broadcasting
  private broadcastEvent(event: RealtimeEvent): void {
    // Broadcast to all connections in the thread
    const threadConnections = Array.from(this.connections.values()).filter(
      (conn) => conn.threadId === event.threadId && conn.status === "connected",
    )

    threadConnections.forEach((conn) => {
      const listener = this.eventListeners.get(conn.id)
      if (listener) {
        listener(event)
      }
    })
  }

  // Event Subscription
  subscribe(connectionId: string, callback: (event: RealtimeEvent) => void): () => void {
    this.eventListeners.set(connectionId, callback)

    return () => {
      this.eventListeners.delete(connectionId)
    }
  }

  // Heartbeat System
  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      const now = new Date()
      const staleConnections: string[] = []

      this.connections.forEach((connection, id) => {
        const timeSinceLastPing = now.getTime() - connection.lastPing.getTime()

        if (timeSinceLastPing > 30000) {
          // 30 seconds
          staleConnections.push(id)
        }
      })

      // Clean up stale connections
      staleConnections.forEach((id) => {
        this.disconnect(id)
      })
    }, 10000) // Check every 10 seconds
  }

  ping(connectionId: string): void {
    const connection = this.connections.get(connectionId)
    if (connection) {
      connection.lastPing = new Date()
      this.connections.set(connectionId, connection)
    }
  }

  // Utility Methods
  private detectDeviceType(): "desktop" | "mobile" | "tablet" {
    if (typeof window === "undefined") return "desktop"

    const userAgent = window.navigator.userAgent
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
      return "tablet"
    }
    if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) {
      return "mobile"
    }
    return "desktop"
  }

  getConnectionStats(): {
    totalConnections: number
    activeConnections: number
    onlineUsers: number
    typingUsers: number
  } {
    const activeConnections = Array.from(this.connections.values()).filter((conn) => conn.status === "connected").length

    const totalTypingUsers = Array.from(this.typingIndicators.values()).reduce((sum, users) => sum + users.size, 0)

    return {
      totalConnections: this.connections.size,
      activeConnections,
      onlineUsers: this.onlineUsers.size,
      typingUsers: totalTypingUsers,
    }
  }

  // Cleanup
  destroy(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
    }
    this.connections.clear()
    this.eventListeners.clear()
    this.typingIndicators.clear()
    this.onlineUsers.clear()
  }
}

export const realtimeMessagingService = new RealtimeMessagingService()
