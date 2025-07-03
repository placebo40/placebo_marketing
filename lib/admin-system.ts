export interface PendingVerification {
  id: string
  type: "verification" | "inspection" | "appraisal"
  status: "pending" | "approved" | "rejected" | "completed"
  userName: string
  userEmail: string
  submittedAt: string
  data?: any
  notes?: string
  reviewedBy?: string
  reviewedAt?: string
}

// Mock data for pending verifications
const mockPendingVerifications: PendingVerification[] = [
  {
    id: "ver_001",
    type: "verification",
    status: "pending",
    userName: "John Doe",
    userEmail: "john.doe@email.com",
    submittedAt: "2024-01-15T10:30:00Z",
    data: {
      verificationType: "private_seller",
      documents: ["id_front.jpg", "id_back.jpg", "proof_of_address.pdf"],
      businessInfo: null,
    },
  },
  {
    id: "ver_002",
    type: "verification",
    status: "pending",
    userName: "Okinawa Auto Sales",
    userEmail: "info@okinawaauto.jp",
    submittedAt: "2024-01-14T14:20:00Z",
    data: {
      verificationType: "dealer",
      documents: ["business_license.pdf", "tax_certificate.pdf"],
      businessInfo: {
        name: "Okinawa Auto Sales",
        registrationNumber: "OAS-2024-001",
        address: "123 Main St, Naha, Okinawa",
      },
    },
  },
  {
    id: "ins_001",
    type: "inspection",
    status: "pending",
    userName: "Tanaka Hiroshi",
    userEmail: "tanaka.h@email.com",
    submittedAt: "2024-01-13T09:15:00Z",
    data: {
      vehicleId: "LST-2024-0002",
      inspectionType: "basic",
      scheduledDate: "2024-01-20T10:00:00Z",
      location: "Ginowan Inspection Center",
    },
  },
  {
    id: "app_001",
    type: "appraisal",
    status: "pending",
    userName: "Kobayashi Akira",
    userEmail: "kobayashi.a@email.com",
    submittedAt: "2024-01-12T16:45:00Z",
    data: {
      vehicleId: "LST-2024-0005",
      appraisalType: "basic",
      requestedDate: "2024-01-18T14:00:00Z",
      notes: "Need appraisal for insurance purposes",
    },
  },
]

export function getPendingVerifications(): PendingVerification[] {
  // In a real app, this would fetch from a database
  return mockPendingVerifications
}

export function updateVerificationStatus(
  id: string,
  status: "approved" | "rejected" | "completed",
  notes?: string,
): boolean {
  // In a real app, this would update the database
  const verification = mockPendingVerifications.find((v) => v.id === id)
  if (verification) {
    verification.status = status
    verification.notes = notes
    verification.reviewedAt = new Date().toISOString()
    verification.reviewedBy = "admin" // In real app, would be current admin user
    return true
  }
  return false
}

export function getVerificationById(id: string): PendingVerification | null {
  return mockPendingVerifications.find((v) => v.id === id) || null
}

export function createPendingVerification(verification: Omit<PendingVerification, "id" | "submittedAt">): string {
  const id = `${verification.type}_${Date.now()}`
  const newVerification: PendingVerification = {
    ...verification,
    id,
    submittedAt: new Date().toISOString(),
  }
  mockPendingVerifications.push(newVerification)
  return id
}
