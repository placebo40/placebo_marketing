export type UserType = "user" | "private_seller" | "dealership"
export type KYCStatus = "unverified" | "pending" | "verified" | "rejected"

export interface KYCProfile {
  userId: string
  userType: UserType
  status: KYCStatus
  submittedAt?: Date
  verifiedAt?: Date
  rejectedAt?: Date
  rejectionReason?: string

  // Personal Information (required for all)
  personalInfo: {
    firstName: string
    lastName: string
    dateOfBirth: string
    nationality: string
    address: {
      street: string
      city: string
      prefecture: string
      postalCode: string
      country: string
    }
    contact: {
      email: string
      phone: string
    }
  }

  // Identity Documents (required for all)
  identityDocuments: {
    primaryId: {
      type: "drivers_license" | "passport" | "residence_card" | "mynumber_card"
      number: string
      expiryDate: string
      frontImageUrl: string
      backImageUrl?: string
    }
    livenessCheck: {
      completed: boolean
      imageUrl?: string
      timestamp?: Date
    }
    addressProof: {
      type: "utility_bill" | "bank_statement" | "residence_certificate"
      imageUrl: string
      issueDate: string
    }
  }

  // Business Information (required for dealerships only)
  businessInfo?: {
    companyName: string
    businessType: string
    registrationNumber: string
    taxId: string
    establishedDate: string
    numberOfEmployees: number
    businessAddress: {
      street: string
      city: string
      prefecture: string
      postalCode: string
      country: string
    }
    representativeInfo: {
      name: string
      position: string
      idNumber: string
    }
    licenses: {
      dealerPermit: {
        number: string
        expiryDate: string
        imageUrl: string
      }
      businessRegistration: {
        imageUrl: string
      }
      companySeal?: {
        imageUrl: string
      }
    }
  }

  // Compliance Acknowledgments
  compliance: {
    termsAccepted: boolean
    privacyPolicyAccepted: boolean
    antiMoneyLaunderingAccepted: boolean
    dataProcessingConsent: boolean

    // Specific to sellers
    kobutsuEigyoAcknowledged?: boolean // 古物営業法
    vehicleOwnershipProofRequired?: boolean

    // Specific to dealerships
    juchoKaiMembership?: boolean // 中古車査定協会
    employeeRegistrationFiled?: boolean // 従業者届出
  }
}

export interface KYCRequirements {
  userType: UserType
  requiredDocuments: string[]
  requiredInfo: string[]
  estimatedProcessingTime: string
  additionalRequirements?: string[]
}

export const KYC_REQUIREMENTS: Record<UserType, KYCRequirements> = {
  user: {
    userType: "user",
    requiredDocuments: ["Government-issued photo ID", "Address proof document", "Liveness verification photo"],
    requiredInfo: ["Full legal name", "Date of birth", "Current address", "Contact information"],
    estimatedProcessingTime: "1-2 business days",
  },

  private_seller: {
    userType: "private_seller",
    requiredDocuments: [
      "Government-issued photo ID",
      "Address proof document",
      "Liveness verification photo",
      "Vehicle ownership documents",
    ],
    requiredInfo: [
      "Full legal name",
      "Date of birth",
      "Current address",
      "Contact information",
      "Vehicle ownership details",
    ],
    estimatedProcessingTime: "2-3 business days",
    additionalRequirements: [
      "Acknowledgment of 古物営業法 (Used Goods Business Law) compliance",
      "Understanding of private seller limitations (max 2 vehicles/year)",
    ],
  },

  dealership: {
    userType: "dealership",
    requiredDocuments: [
      "Business registration certificate",
      "Vehicle dealer permit",
      "Representative ID documents",
      "Company seal (印鑑)",
      "Tax registration documents",
      "Business address proof",
    ],
    requiredInfo: [
      "Company legal name",
      "Business registration number",
      "Tax ID/Corporate number",
      "Representative information",
      "Business address",
      "Number of employees",
    ],
    estimatedProcessingTime: "3-5 business days",
    additionalRequirements: [
      "Valid vehicle dealer license",
      "Employee registration filing (従業者届出)",
      "Compliance with automotive business regulations",
      "Professional liability insurance",
    ],
  },
}

export function getKYCRequirements(userType: UserType): KYCRequirements {
  return KYC_REQUIREMENTS[userType]
}

export function canPerformAction(
  profile: KYCProfile | null,
  action: "browse" | "message" | "list_vehicle" | "buy_vehicle" | "manage_listings",
): boolean {
  // Anyone can browse
  if (action === "browse") return true

  // All other actions require verified status
  if (!profile || profile.status !== "verified") return false

  switch (action) {
    case "message":
    case "buy_vehicle":
      return profile.userType === "user" || profile.userType === "private_seller" || profile.userType === "dealership"

    case "list_vehicle":
    case "manage_listings":
      return profile.userType === "private_seller" || profile.userType === "dealership"

    default:
      return false
  }
}

export function getVerificationBadgeProps(profile: KYCProfile | null) {
  if (!profile) {
    return { type: "user" as const, status: "unverified" as const }
  }

  const type =
    profile.userType === "user" ? "user" : profile.userType === "private_seller" ? "private_seller" : "dealership"

  return { type, status: profile.status }
}

export function getNextKYCStep(profile: KYCProfile): string {
  if (profile.status === "verified") return "completed"
  if (profile.status === "pending") return "under_review"
  if (profile.status === "rejected") return "resubmit_documents"

  // Check what's missing for unverified users
  const requirements = getKYCRequirements(profile.userType)

  if (!profile.personalInfo.firstName) return "personal_information"
  if (!profile.identityDocuments.primaryId.frontImageUrl) return "identity_documents"
  if (!profile.identityDocuments.livenessCheck.completed) return "liveness_verification"
  if (!profile.identityDocuments.addressProof.imageUrl) return "address_verification"

  if (profile.userType === "dealership" && !profile.businessInfo?.companyName) {
    return "business_information"
  }

  if (!profile.compliance.termsAccepted) return "compliance_agreements"

  return "submit_for_review"
}
