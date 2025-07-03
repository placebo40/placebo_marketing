export interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  timestamp: Date
  read: boolean
  actionUrl?: string
  actionText?: string
  vehicleId?: string
  vehicleTitle?: string
  priority: "low" | "medium" | "high"
  category: "message" | "test_drive" | "listing" | "system" | "payment"
}

class NotificationService {
  private notifications: Notification[] = []
  private listeners: ((notifications: Notification[]) => void)[] = []
  private storageKey = "placebo-notifications"

  constructor() {
    this.loadFromStorage()
  }

  private loadFromStorage() {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(this.storageKey)
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          this.notifications = parsed.map((n: any) => ({
            ...n,
            timestamp: new Date(n.timestamp),
          }))
        } catch (error) {
          console.error("Failed to load notifications from storage:", error)
        }
      }
    }
  }

  private saveToStorage() {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.storageKey, JSON.stringify(this.notifications))
    }
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener([...this.notifications]))
  }

  subscribe(listener: (notifications: Notification[]) => void) {
    this.listeners.push(listener)
    listener([...this.notifications])

    return () => {
      const index = this.listeners.indexOf(listener)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  create(notification: Omit<Notification, "id" | "timestamp" | "read">) {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false,
    }

    this.notifications.unshift(newNotification)
    this.saveToStorage()
    this.notifyListeners()

    // Show browser notification if permission granted
    this.showBrowserNotification(newNotification)

    return newNotification
  }

  markAsRead(id: string) {
    const notification = this.notifications.find((n) => n.id === id)
    if (notification) {
      notification.read = true
      this.saveToStorage()
      this.notifyListeners()
    }
  }

  markAllAsRead() {
    this.notifications.forEach((n) => (n.read = true))
    this.saveToStorage()
    this.notifyListeners()
  }

  remove(id: string) {
    this.notifications = this.notifications.filter((n) => n.id !== id)
    this.saveToStorage()
    this.notifyListeners()
  }

  clear() {
    this.notifications = []
    this.saveToStorage()
    this.notifyListeners()
  }

  getAll() {
    return [...this.notifications]
  }

  getUnread() {
    return this.notifications.filter((n) => !n.read)
  }

  getUnreadCount() {
    return this.notifications.filter((n) => !n.read).length
  }

  getByCategory(category: Notification["category"]) {
    return this.notifications.filter((n) => n.category === category)
  }

  getByVehicle(vehicleId: string) {
    return this.notifications.filter((n) => n.vehicleId === vehicleId)
  }

  private async showBrowserNotification(notification: Notification) {
    if (typeof window === "undefined") return

    // Check if browser notifications are supported
    if (!("Notification" in window)) return

    // Check permission
    if (Notification.permission === "granted") {
      try {
        const browserNotification = new Notification(notification.title, {
          body: notification.message,
          icon: "/images/logo-black.png",
          badge: "/images/logo-black.png",
          tag: notification.id,
          requireInteraction: notification.priority === "high",
        })

        browserNotification.onclick = () => {
          if (notification.actionUrl) {
            window.open(notification.actionUrl, "_blank")
          }
          browserNotification.close()
        }

        // Auto close after 5 seconds for non-high priority
        if (notification.priority !== "high") {
          setTimeout(() => {
            browserNotification.close()
          }, 5000)
        }
      } catch (error) {
        console.error("Failed to show browser notification:", error)
      }
    }
  }

  async requestPermission() {
    if (typeof window === "undefined") return false
    if (!("Notification" in window)) return false

    if (Notification.permission === "default") {
      const permission = await Notification.requestPermission()
      return permission === "granted"
    }

    return Notification.permission === "granted"
  }

  // Helper methods for creating specific types of notifications
  createMessageNotification(vehicleTitle: string, vehicleId: string, senderName: string) {
    return this.create({
      title: "New Message Received",
      message: `You have a new message about ${vehicleTitle} from ${senderName}`,
      type: "info",
      priority: "medium",
      category: "message",
      vehicleId,
      vehicleTitle,
      actionUrl: `/guest-dashboard?tab=messages`,
      actionText: "View Message",
    })
  }

  createTestDriveConfirmation(vehicleTitle: string, vehicleId: string, date: string) {
    return this.create({
      title: "Test Drive Confirmed",
      message: `Your test drive for ${vehicleTitle} has been confirmed for ${date}`,
      type: "success",
      priority: "high",
      category: "test_drive",
      vehicleId,
      vehicleTitle,
      actionUrl: `/guest-dashboard?tab=test-drives`,
      actionText: "View Details",
    })
  }

  createListingApproved(vehicleTitle: string, vehicleId: string) {
    return this.create({
      title: "Listing Approved",
      message: `Your listing for ${vehicleTitle} has been approved and is now live`,
      type: "success",
      priority: "high",
      category: "listing",
      vehicleId,
      vehicleTitle,
      actionUrl: `/guest-dashboard?tab=listings`,
      actionText: "View Listing",
    })
  }

  createListingRejected(vehicleTitle: string, vehicleId: string, reason?: string) {
    return this.create({
      title: "Listing Needs Attention",
      message: `Your listing for ${vehicleTitle} needs some updates${reason ? `: ${reason}` : ""}`,
      type: "warning",
      priority: "high",
      category: "listing",
      vehicleId,
      vehicleTitle,
      actionUrl: `/guest-dashboard?tab=listings`,
      actionText: "Update Listing",
    })
  }

  createPaymentReminder(vehicleTitle: string, vehicleId: string, amount: number) {
    return this.create({
      title: "Payment Required",
      message: `Payment of ¥${amount.toLocaleString()} is required for your ${vehicleTitle} listing`,
      type: "warning",
      priority: "high",
      category: "payment",
      vehicleId,
      vehicleTitle,
      actionUrl: `/payment?listing=${vehicleId}`,
      actionText: "Make Payment",
    })
  }

  createSystemNotification(title: string, message: string, type: Notification["type"] = "info") {
    return this.create({
      title,
      message,
      type,
      priority: "medium",
      category: "system",
    })
  }
}

// Export singleton instance
export const notificationService = new NotificationService()

// Export types
export type { Notification }
