import type { VerificationType, VerificationStatus } from "@/components/verification-badge"

export interface VerificationBadgeProps {
  type: VerificationType
  status: VerificationStatus
  language: "en" | "ja"
  size?: "sm" | "md" | "lg"
  showTooltip?: boolean
  iconOnly?: boolean
  className?: string
}

export function createVerificationProps(
  type: VerificationType,
  status: VerificationStatus,
): Pick<VerificationBadgeProps, "type" | "status"> {
  return {
    type,
    status,
  }
}

// Helper for mock data during development
export function createMockVerificationProps(
  type: VerificationType = "user",
  status: VerificationStatus = "verified",
): {
  type: VerificationType
  status: VerificationStatus
} {
  return { type, status }
}

// Helper to safely get verification status from user data
export function getUserVerificationStatus(isVerified?: boolean): VerificationStatus {
  if (isVerified === true) return "verified"
  if (isVerified === false) return "unverified"
  return "unverified"
}

// Helper to map vehicle verification to new system
export function getVehicleVerificationStatus(isVehicleVerified?: boolean): VerificationStatus {
  return isVehicleVerified ? "verified" : "unverified"
}

// Helper for user profile verification
export interface UserProfile {
  id: string
  userType?: "user" | "private_seller" | "dealership"
  verificationStatus?: "verified" | "unverified" | "pending" | "rejected"
}

export function getVerificationBadgeProps(
  profile: UserProfile | null,
  fallbackType: VerificationType = "user",
): {
  type: VerificationType
  status: VerificationStatus
} {
  if (!profile) {
    return {
      type: fallbackType,
      status: "unverified",
    }
  }

  // Map user types to verification types
  const typeMapping: Record<string, VerificationType> = {
    user: "user",
    private_seller: "private_seller",
    dealership: "dealership",
  }

  const type = profile.userType ? typeMapping[profile.userType] || fallbackType : fallbackType
  const status = profile.verificationStatus || "unverified"

  return { type, status }
}
