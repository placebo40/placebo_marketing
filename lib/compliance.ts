export interface ComplianceStatus {
  accountType: "guest" | "private" | "dealer"
  vehiclesSoldThisYear: number
  activeListings: number
  warningLevel: "none" | "warning" | "critical"
  requiresLicense: boolean
  daysUntilYearReset: number
  lastSaleDate?: Date
  businessPatterns: {
    frequentSales: boolean
    commercialAdvertising: boolean
    multipleSimultaneousListings: boolean
  }
  canCreateNewListing: boolean
}

export interface ComplianceMessage {
  type: "success" | "warning" | "error" | "info"
  title: string
  message: string
}

export const COMPLIANCE_THRESHOLDS = {
  guest: {
    maxVehiclesPerYear: 2,
    maxSimultaneousListings: 1,
  },
  private: {
    maxVehiclesPerYear: 1,
    maxSimultaneousListings: 2,
  },
  dealer: {
    maxVehiclesPerYear: Number.POSITIVE_INFINITY,
    maxSimultaneousListings: Number.POSITIVE_INFINITY,
  },
  warningThreshold: 1,
  businessPatternThreshold: 3,
}

export function checkComplianceStatus(
  accountType: "guest" | "private" | "dealer",
  vehiclesSoldThisYear: number,
  activeListings: number,
  lastSaleDate?: Date,
): ComplianceStatus {
  const now = new Date()
  const yearEnd = new Date(now.getFullYear(), 11, 31)
  const daysUntilYearReset = Math.ceil((yearEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  // Check for business patterns
  const businessPatterns = {
    frequentSales: vehiclesSoldThisYear >= COMPLIANCE_THRESHOLDS.businessPatternThreshold,
    commercialAdvertising: false, // Would be determined by listing content analysis
    multipleSimultaneousListings: activeListings > COMPLIANCE_THRESHOLDS[accountType].maxSimultaneousListings,
  }

  // Determine warning level and license requirement
  let warningLevel: "none" | "warning" | "critical" = "none"
  let requiresLicense = false
  let canCreateNewListing = true

  if (accountType !== "dealer") {
    // Check if approaching limits
    if (
      vehiclesSoldThisYear >= COMPLIANCE_THRESHOLDS.warningThreshold ||
      activeListings >= COMPLIANCE_THRESHOLDS.warningThreshold
    ) {
      warningLevel = "warning"
    }

    // Check if exceeding limits
    if (
      vehiclesSoldThisYear >= COMPLIANCE_THRESHOLDS[accountType].maxVehiclesPerYear ||
      activeListings > COMPLIANCE_THRESHOLDS[accountType].maxSimultaneousListings ||
      businessPatterns.frequentSales ||
      businessPatterns.multipleSimultaneousListings
    ) {
      warningLevel = "critical"
      requiresLicense = true
      canCreateNewListing = false
    }

    if (activeListings >= COMPLIANCE_THRESHOLDS[accountType].maxSimultaneousListings) {
      canCreateNewListing = false
    }
  }

  return {
    accountType,
    vehiclesSoldThisYear,
    activeListings,
    warningLevel,
    requiresLicense,
    daysUntilYearReset,
    lastSaleDate,
    businessPatterns,
    canCreateNewListing,
  }
}

export function getComplianceMessage(status: ComplianceStatus, language: "en" | "jp"): ComplianceMessage {
  if (status.requiresLicense) {
    return {
      type: "error",
      title: language === "en" ? "License Required" : "ライセンス必要",
      message:
        language === "en"
          ? "Your account has exceeded the legal limits for private vehicle sales in Japan. You must register as a licensed dealer to continue selling vehicles."
          : "あなたのアカウントは日本の個人車両販売の法的制限を超えています。車両の販売を続けるには認可ディーラーとして登録する必要があります。",
    }
  }

  if (status.warningLevel === "warning") {
    return {
      type: "warning",
      title: language === "en" ? "Approaching Sales Limit" : "販売制限に近づいています",
      message:
        language === "en"
          ? "You're approaching the legal limit for private vehicle sales. Consider registering as a dealer if you plan to sell more vehicles."
          : "個人車両販売の法的制限に近づいています。より多くの車両を販売する予定がある場合は、ディーラーとして登録することを検討してください。",
    }
  }

  if (status.accountType === "dealer") {
    return {
      type: "success",
      title: language === "en" ? "Licensed Dealer" : "認可ディーラー",
      message:
        language === "en"
          ? "Your account is properly licensed for commercial vehicle sales in Japan."
          : "あなたのアカウントは日本での商業車両販売に適切にライセンスされています。",
    }
  }

  return {
    type: "info",
    title: language === "en" ? "Compliant Account" : "コンプライアントアカウント",
    message:
      language === "en"
        ? "Your account is currently compliant with Japanese automotive sales regulations."
        : "あなたのアカウントは現在、日本の自動車販売規制に準拠しています。",
  }
}

export function canCreateNewListing(status: ComplianceStatus): boolean {
  return status.canCreateNewListing
}

export function getRemainingListings(status: ComplianceStatus): number {
  let maxListings
  switch (status.accountType) {
    case "guest":
      maxListings = COMPLIANCE_THRESHOLDS.guest.maxSimultaneousListings
      break
    case "private":
      maxListings = COMPLIANCE_THRESHOLDS.private.maxSimultaneousListings
      break
    case "dealer":
      return Number.POSITIVE_INFINITY
    default:
      maxListings = 0
  }
  return Math.max(0, maxListings - status.activeListings)
}

export function getRemainingAnnualSales(status: ComplianceStatus): number {
  let maxSales
  switch (status.accountType) {
    case "guest":
      maxSales = COMPLIANCE_THRESHOLDS.guest.maxVehiclesPerYear
      break
    case "private":
      maxSales = COMPLIANCE_THRESHOLDS.private.maxVehiclesPerYear
      break
    case "dealer":
      return Number.POSITIVE_INFINITY
    default:
      maxSales = 0
  }
  return Math.max(0, maxSales - status.vehiclesSoldThisYear)
}
