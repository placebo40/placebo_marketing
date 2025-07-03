import type { MessageThread } from "@/contexts/messaging-context"
import type { TestDriveRequest } from "@/contexts/test-drive-context"
import type { GuestListing } from "@/lib/guest-listings"

export interface ActivityStats {
  totalListings: number
  activeListings: number
  pendingListings: number
  totalMessages: number
  totalTestDrives: number
  activeConversations: number
  recentActivity: number
  completionRate: number
  averageResponseTime: number
}

export interface ActivityItem {
  id: string
  type: "message" | "test_drive" | "listing" | "system"
  title: string
  description: string
  timestamp: Date
  status: "success" | "pending" | "failed" | "info"
  vehicleId?: string
  vehicleTitle?: string
}

export function calculateActivityStats(
  threads: MessageThread[],
  testDriveRequests: TestDriveRequest[],
  listings: GuestListing[],
): ActivityStats {
  const totalListings = listings.length
  const activeListings = listings.filter((l) => l.status === "active").length
  const pendingListings = listings.filter((l) => l.status === "pending").length

  const totalMessages = threads.reduce((sum, thread) => sum + thread.messages.length, 0)
  const totalTestDrives = testDriveRequests.length
  const activeConversations = threads.filter((thread) => thread.status === "active").length

  // Calculate recent activity (last 7 days)
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const recentMessages = threads.reduce((sum, thread) => {
    return sum + thread.messages.filter((msg) => msg.timestamp > sevenDaysAgo).length
  }, 0)
  const recentTestDrives = testDriveRequests.filter((req) => req.timestamp > sevenDaysAgo).length
  const recentListings = listings.filter((listing) => new Date(listing.submittedAt) > sevenDaysAgo).length
  const recentActivity = recentMessages + recentTestDrives + recentListings

  // Calculate completion rate
  const completedTestDrives = testDriveRequests.filter((req) => req.status === "confirmed").length
  const completionRate = totalTestDrives > 0 ? Math.round((completedTestDrives / totalTestDrives) * 100) : 0

  // Calculate average response time (mock data for now)
  const averageResponseTime = 2.5 // hours

  return {
    totalListings,
    activeListings,
    pendingListings,
    totalMessages,
    totalTestDrives,
    activeConversations,
    recentActivity,
    completionRate,
    averageResponseTime,
  }
}

export function generateActivityFeed(
  threads: MessageThread[],
  testDriveRequests: TestDriveRequest[],
  listings: GuestListing[],
): ActivityItem[] {
  const activities: ActivityItem[] = []

  // Add message activities
  threads.forEach((thread) => {
    thread.messages.forEach((message) => {
      activities.push({
        id: `msg_${message.id}`,
        type: "message",
        title: "Message Sent",
        description: `Sent message about ${message.vehicleTitle}`,
        timestamp: message.timestamp,
        status: message.status === "sent" ? "success" : message.status === "failed" ? "failed" : "pending",
        vehicleId: message.vehicleId,
        vehicleTitle: message.vehicleTitle,
      })
    })
  })

  // Add test drive activities
  testDriveRequests.forEach((request) => {
    activities.push({
      id: `td_${request.id}`,
      type: "test_drive",
      title: "Test Drive Requested",
      description: `Test drive scheduled for ${request.vehicleTitle}`,
      timestamp: request.timestamp,
      status: request.status === "confirmed" ? "success" : request.status === "failed" ? "failed" : "pending",
      vehicleId: request.vehicleId,
      vehicleTitle: request.vehicleTitle,
    })
  })

  // Add listing activities
  listings.forEach((listing) => {
    activities.push({
      id: `listing_${listing.listingID}`,
      type: "listing",
      title: "Listing Created",
      description: `Listed ${listing.year} ${listing.make} ${listing.model}`,
      timestamp: new Date(listing.submittedAt),
      status: listing.status === "active" ? "success" : listing.status === "rejected" ? "failed" : "pending",
      vehicleId: listing.listingID,
      vehicleTitle: `${listing.year} ${listing.make} ${listing.model}`,
    })
  })

  // Sort by timestamp (most recent first)
  return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

export function getActivitySummary(activities: ActivityItem[]): {
  today: number
  thisWeek: number
  thisMonth: number
} {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  return {
    today: activities.filter((a) => a.timestamp >= today).length,
    thisWeek: activities.filter((a) => a.timestamp >= thisWeek).length,
    thisMonth: activities.filter((a) => a.timestamp >= thisMonth).length,
  }
}
