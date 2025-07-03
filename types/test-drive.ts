export interface TestDriveFormData {
  name: string
  email: string
  phone: string
  preferredDate: string
  preferredTime: string
  meetingLocation: "seller_location" | "buyer_location" | "neutral_location" | "custom"
  customLocation: string
  licenseType: string
  drivingExperience: string
  emergencyContactName: string
  emergencyContactPhone: string
  additionalNotes: string
}

export interface TestDriveValidationErrors {
  [key: string]: string
}

export interface TestDriveFormState {
  data: TestDriveFormData
  errors: TestDriveValidationErrors
  isValid: boolean
  isDirty: boolean
  lastSaved: Date | null
  autoSaveEnabled: boolean
}

export type TestDriveStatus = "draft" | "sending" | "sent" | "confirmed" | "cancelled" | "completed" | "failed"

export interface TestDriveRequest {
  id: string
  vehicleId: string
  vehicleTitle: string
  vehiclePrice: string
  sellerEmail: string
  sellerName: string
  buyerData: TestDriveFormData
  timestamp: Date
  status: TestDriveStatus
  lastUpdated: Date
  version: number
  response?: {
    success: boolean
    message?: string
  }
}

export interface VehicleData {
  id: string
  title: string
  price: string
  sellerEmail: string
  sellerName: string
}

export interface TestDriveState {
  requests: TestDriveRequest[]
  drafts: { [vehicleId: string]: Partial<TestDriveFormData> }
  isLoading: boolean
  error: string | null
  lastSync: Date | null
  offlineQueue: TestDriveRequest[]
  connectionStatus: "connected" | "disconnected" | "connecting"
  realtimeConnectionId: string | null
}

export interface TestDriveContextType {
  state: TestDriveState
  formState: TestDriveFormState
  scheduleTestDrive: (data: TestDriveFormData, vehicleData: VehicleData) => Promise<void>
  updateFormData: (field: keyof TestDriveFormData, value: string) => void
  validateForm: () => boolean
  saveDraft: (vehicleId: string) => Promise<void>
  loadDraft: (vehicleId: string) => Promise<void>
  clearDraft: (vehicleId: string) => Promise<void>
  getRequestsByVehicleId: (vehicleId: string) => TestDriveRequest[]
  getRequestsForBuyer: (buyerEmail: string) => TestDriveRequest[]
  updateRequestStatus: (requestId: string, status: TestDriveStatus) => Promise<void>
  retryFailedRequest: (requestId: string) => Promise<void>
  clearError: () => void
  syncOfflineRequests: () => Promise<void>
  getRequestsForSeller: (sellerEmail: string) => TestDriveRequest[]
  getRequestsByStatus: (sellerEmail: string, status: TestDriveStatus) => TestDriveRequest[]
  respondToTestDrive: (
    requestId: string,
    responseType: "confirm" | "reschedule" | "decline",
    message: string,
    rescheduleData?: { date: string; time: string },
  ) => Promise<void>
  syncWithRemote: () => Promise<void>
}
