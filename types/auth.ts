export type UserRole = "guest" | "seller" | "admin"
export type UserStatus = "active" | "pending" | "suspended" | "banned"
export type VerificationLevel = "none" | "basic" | "premium" | "dealership"

export interface User {
  id: string
  email: string
  name: string
  userType: "admin" | "seller" | "guest"
  isVerified: boolean
  createdAt: string
  phone?: string
  avatar?: string
  preferences?: {
    language: string
    notifications: boolean
    theme: "light" | "dark"
  }
}

export interface UserProfile {
  bio?: string
  location?: string
  website?: string
  avatar?: string
  socialLinks?: {
    facebook?: string
    twitter?: string
    instagram?: string
    linkedin?: string
  }
  preferences: UserPreferences
}

export interface UserPreferences {
  language: "en" | "ja"
  notifications: {
    email: boolean
    sms: boolean
    push: boolean
  }
  privacy: {
    showEmail: boolean
    showPhone: boolean
  }
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  userType: UserRole
  acceptTerms: boolean
}

export interface AuthContextType {
  user: User | null
  isLoading: boolean
  error: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  clearError: () => void
  hasPermission: (permission: string) => boolean
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  phone?: string
  userType: UserRole
  acceptTerms: boolean
}

export interface UpdateProfileRequest {
  firstName?: string
  lastName?: string
  phone?: string
  bio?: string
  location?: string
  website?: string
  socialLinks?: Partial<UserProfile["socialLinks"]>
  preferences?: Partial<UserPreferences>
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface PasswordResetRequest {
  email: string
}

export interface PasswordResetConfirm {
  token: string
  newPassword: string
  confirmPassword: string
}

export interface AuthResponse {
  success: boolean
  user?: User
  token?: string
  refreshToken?: string
  message?: string
  errors?: Record<string, string[]>
}

export interface TokenResponse {
  token: string
  refreshToken: string
  expiresIn: number
}

export interface SessionInfo {
  user: User
  accessToken: string
  refreshToken: string
  expiresAt: number
  issuedAt: number
  deviceId: string
  ipAddress?: string
  userAgent?: string
}

export interface Permission {
  resource: string
  action: string
  conditions?: Record<string, any>
}

export interface Role {
  name: UserRole
  permissions: Permission[]
  hierarchy: number
}

export interface VerificationDocument {
  id: string
  type: "id_card" | "passport" | "driver_license" | "business_license"
  status: "pending" | "approved" | "rejected"
  uploadedAt: string
  reviewedAt?: string
  reviewedBy?: string
  rejectionReason?: string
}

export interface VerificationRequest {
  userId: string
  documents: VerificationDocument[]
  requestedLevel: VerificationLevel
  status: "pending" | "approved" | "rejected"
  submittedAt: string
  reviewedAt?: string
  reviewedBy?: string
  notes?: string
}

export interface AuthError {
  code: string
  message: string
  field?: string
  details?: Record<string, any>
}

export interface ValidationError {
  field: string
  message: string
  code: string
}

export interface AuthEvent {
  type: "login" | "logout" | "register" | "password_change" | "profile_update" | "verification_request"
  userId: string
  timestamp: string
  metadata?: Record<string, any>
  ipAddress?: string
  userAgent?: string
}

export interface SecuritySettings {
  twoFactorEnabled: boolean
  loginNotifications: boolean
  sessionTimeout: number
  allowedDevices: string[]
  trustedIPs: string[]
}

export interface LoginAttempt {
  email: string
  success: boolean
  timestamp: string
  ipAddress: string
  userAgent: string
  failureReason?: string
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
  isAuthenticated: boolean
}

export type SessionState = "valid" | "expired" | "invalid" | "refreshing"

export interface SignupData {
  email: string
  password: string
  name: string
  userType: "seller" | "guest"
  phone?: string
}
