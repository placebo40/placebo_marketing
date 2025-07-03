import type { TestDriveRequest, TestDriveStatus } from "@/types/test-drive"

export function getRequestsForSeller(requests: TestDriveRequest[], sellerEmail: string): TestDriveRequest[] {
  if (!Array.isArray(requests)) {
    console.warn("getRequestsForSeller: requests is not an array:", requests)
    return []
  }
  return requests.filter((request) => request.sellerEmail === sellerEmail)
}

export function getRequestsByStatus(
  requests: TestDriveRequest[],
  sellerEmail: string,
  status: TestDriveStatus,
): TestDriveRequest[] {
  if (!Array.isArray(requests)) {
    console.warn("getRequestsByStatus: requests is not an array:", requests)
    return []
  }
  return requests.filter((request) => request.sellerEmail === sellerEmail && request.status === status)
}

export function getRequestsForBuyer(requests: TestDriveRequest[], buyerEmail: string): TestDriveRequest[] {
  if (!Array.isArray(requests)) {
    console.warn("getRequestsForBuyer: requests is not an array:", requests)
    return []
  }
  return requests.filter((request) => request.buyerData?.email === buyerEmail)
}

export function getRequestsByVehicle(requests: TestDriveRequest[], vehicleId: string): TestDriveRequest[] {
  if (!Array.isArray(requests)) {
    console.warn("getRequestsByVehicle: requests is not an array:", requests)
    return []
  }
  return requests.filter((request) => request.vehicleId === vehicleId)
}

export function getPendingRequests(requests: TestDriveRequest[]): TestDriveRequest[] {
  if (!Array.isArray(requests)) {
    console.warn("getPendingRequests: requests is not an array:", requests)
    return []
  }
  return requests.filter((request) => request.status === "sent")
}

export function getConfirmedRequests(requests: TestDriveRequest[]): TestDriveRequest[] {
  if (!Array.isArray(requests)) {
    console.warn("getConfirmedRequests: requests is not an array:", requests)
    return []
  }
  return requests.filter((request) => request.status === "confirmed")
}

export function getFailedRequests(requests: TestDriveRequest[]): TestDriveRequest[] {
  if (!Array.isArray(requests)) {
    console.warn("getFailedRequests: requests is not an array:", requests)
    return []
  }
  return requests.filter((request) => request.status === "failed")
}

export function sortRequestsByDate(requests: TestDriveRequest[], ascending = false): TestDriveRequest[] {
  if (!Array.isArray(requests)) {
    console.warn("sortRequestsByDate: requests is not an array:", requests)
    return []
  }
  return [...requests].sort((a, b) => {
    const dateA = new Date(a.timestamp).getTime()
    const dateB = new Date(b.timestamp).getTime()
    return ascending ? dateA - dateB : dateB - dateA
  })
}

export function formatRequestDate(request: TestDriveRequest): string {
  return new Date(request.timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function getRequestStatusColor(status: TestDriveStatus): string {
  switch (status) {
    case "draft":
      return "gray"
    case "sending":
      return "blue"
    case "sent":
      return "yellow"
    case "confirmed":
      return "green"
    case "cancelled":
      return "red"
    case "completed":
      return "purple"
    case "failed":
      return "red"
    default:
      return "gray"
  }
}

export function canRetryRequest(request: TestDriveRequest): boolean {
  return request.status === "failed"
}

export function canCancelRequest(request: TestDriveRequest): boolean {
  return ["sent", "confirmed"].includes(request.status)
}

export function isRequestExpired(request: TestDriveRequest): boolean {
  const requestDate = new Date(request.buyerData.preferredDate)
  const now = new Date()
  return requestDate < now && request.status !== "completed"
}

export function getUpcomingTestDrives(requests: TestDriveRequest[]): TestDriveRequest[] {
  if (!Array.isArray(requests)) {
    console.warn("getUpcomingTestDrives: requests is not an array:", requests)
    return []
  }

  const now = new Date()
  return requests
    .filter((request) => {
      if (request.status !== "confirmed") return false
      const testDriveDate = new Date(`${request.buyerData.preferredDate}T${request.buyerData.preferredTime}:00`)
      return testDriveDate > now
    })
    .sort((a, b) => {
      const dateA = new Date(`${a.buyerData.preferredDate}T${a.buyerData.preferredTime}:00`)
      const dateB = new Date(`${b.buyerData.preferredDate}T${b.buyerData.preferredTime}:00`)
      return dateA.getTime() - dateB.getTime()
    })
}

export function getPastTestDrives(requests: TestDriveRequest[]): TestDriveRequest[] {
  if (!Array.isArray(requests)) {
    console.warn("getPastTestDrives: requests is not an array:", requests)
    return []
  }

  const now = new Date()
  return requests
    .filter((request) => {
      const testDriveDate = new Date(`${request.buyerData.preferredDate}T${request.buyerData.preferredTime}:00`)
      return testDriveDate <= now
    })
    .sort((a, b) => {
      const dateA = new Date(`${a.buyerData.preferredDate}T${a.buyerData.preferredTime}:00`)
      const dateB = new Date(`${b.buyerData.preferredDate}T${b.buyerData.preferredTime}:00`)
      return dateB.getTime() - dateA.getTime()
    })
}

export function formatTestDriveDateTime(request: TestDriveRequest): string {
  const date = new Date(request.buyerData.preferredDate)
  const time = request.buyerData.preferredTime
    ? new Date(`2000-01-01T${request.buyerData.preferredTime}:00`).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : ""

  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return `${formattedDate} at ${time}`
}
