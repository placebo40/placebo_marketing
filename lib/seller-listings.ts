export interface SellerListing {
  id: string
  listingID: string
  referenceNumber: string
  make: string
  model: string
  year: number
  mileage: number
  askingPrice: number
  description: string
  photos: string[]
  // Vehicle detail fields
  vin?: string
  plateNumber?: string
  exteriorColor?: string
  interiorColor?: string
  engineSize: string
  cylinders: string
  fuelType?: string
  transmission?: string
  driveType?: string
  doors?: number
  seats?: number
  bodyType?: string
  condition?: string
  keyFeatures?: string[]
  knownIssues?: string
  accidentFree?: boolean
  nonSmoker?: boolean
  singleOwner?: boolean
  serviceRecords?: boolean
  // Fields from allVehicles array
  title?: string
  location?: string
  imageUrl?: string
  additionalImages?: Array<{
    url: string
    type: "Interior" | "Exterior" | "Engine" | "Features"
    caption: string
  }>
  isVerified?: boolean
  isVehicleVerified?: boolean
  verificationLevel?: "user" | "verified_private_seller" | "verified_dealer"
  color?: string
  engine?: string
  servicesOffered?: string[]
  sellerType?: string
  inspectionLevel?: "basic" | "premium" | "comprehensive"
  inspectionDate?: string
  expiryDate?: string
  hasAppraisal?: boolean
  appraisalDate?: string
  appraisedValue?: number
  appraisalReportType?: "basic" | "comprehensive" | "premium"
  // Nested appraisal object for detailed information
  appraisal?: {
    hasAppraisal: boolean
    appraisalDate?: string
    appraisedValue?: number
    appraiserName?: string
    appraiserLicense?: string
    reportUrl?: string
    reportType?: "basic" | "comprehensive" | "premium"
    validUntil?: string
    notes?: string
  }
  // Seller contact fields to match allVehicles structure
  sellerName: string
  sellerEmail: string
  sellerPhone: string
  preferredContact: string
  status: "pending" | "under_review" | "active" | "sold" | "rejected"
  submittedAt: string
  createdAt: string
  // Admin approval fields
  adminApproved?: boolean
  approvedBy?: string
  approvedAt?: string
  adminNotes?: string
  reviewedAt?: string
  reviewChecklist?: {
    vehicleInfoComplete: boolean
    photosQuality: boolean
    pricingReasonable: boolean
    sellerVerified: boolean
    documentationValid: boolean
    complianceCheck: boolean
    marketAnalysis: boolean
  }
  // Additional metadata
  viewCount?: number
  inquiryCount?: number
  lastViewed?: string
  // Features and other fields to match guest listings
  features?: string[]
  verified?: boolean
  negotiable?: boolean
}

const SELLER_LISTINGS_KEY = "seller_listings"

export function getSellerListings(): SellerListing[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(SELLER_LISTINGS_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("Error loading seller listings:", error)
    return []
  }
}

export function saveSellerListing(
  listingData: Omit<
    SellerListing,
    "id" | "listingID" | "referenceNumber" | "submittedAt" | "status" | "createdAt" | "adminApproved"
  >,
): SellerListing {
  const listings = getSellerListings()

  const referenceNumber = `SEL-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`

  const newListing: SellerListing = {
    ...listingData,
    id: `seller_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    listingID: referenceNumber,
    referenceNumber,
    submittedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    status: "pending",
    adminApproved: false,
    // Set defaults for required fields
    title: listingData.title || `${listingData.make} ${listingData.model}`,
    location: listingData.location || "Okinawa, Japan",
    imageUrl:
      listingData.imageUrl ||
      (listingData.photos && listingData.photos[0]) ||
      "/placeholder.svg?height=300&width=400&text=Vehicle+Image",
    additionalImages: listingData.additionalImages || [],
    isVerified: false,
    isVehicleVerified: false,
    verificationLevel: "user",
    color: listingData.color || listingData.exteriorColor || "Unknown",
    engine: listingData.engine || (listingData.engineSize ? `${listingData.engineSize} Engine` : "Unknown"),
    servicesOffered: listingData.servicesOffered || ["Negotiable Price", "Test Drive Available"],
    sellerType: "Private Seller",
    inspectionLevel: undefined,
    inspectionDate: undefined,
    expiryDate: undefined,
    hasAppraisal: false,
    appraisalDate: undefined,
    appraisedValue: undefined,
    appraisalReportType: undefined,
    appraisal: {
      hasAppraisal: false,
    },
    viewCount: 0,
    inquiryCount: 0,
    features: listingData.features || [],
    verified: false,
    negotiable: listingData.negotiable || false,
  }

  listings.push(newListing)

  try {
    localStorage.setItem(SELLER_LISTINGS_KEY, JSON.stringify(listings))
    return newListing
  } catch (error) {
    console.error("Error saving seller listing:", error)
    throw new Error("Failed to save listing")
  }
}

export function updateSellerListing(listingID: string, updates: Partial<SellerListing>): void {
  const listings = getSellerListings()
  const index = listings.findIndex((listing) => listing.listingID === listingID)

  if (index === -1) {
    throw new Error("Listing not found")
  }

  listings[index] = { ...listings[index], ...updates }

  try {
    localStorage.setItem(SELLER_LISTINGS_KEY, JSON.stringify(listings))
  } catch (error) {
    console.error("Error updating seller listing:", error)
    throw new Error("Failed to update listing")
  }
}

export function getSellerListingByReference(referenceNumber: string): SellerListing | null {
  const listings = getSellerListings()
  return listings.find((listing) => listing.referenceNumber === referenceNumber) || null
}

function deleteSellerListing(id: string): void {
  const listings = getSellerListings()
  const updatedListings = listings.filter((listing) => listing.listingID !== id)

  try {
    localStorage.setItem(SELLER_LISTINGS_KEY, JSON.stringify(updatedListings))
  } catch (error) {
    console.error("Error deleting seller listing:", error)
    throw new Error("Failed to delete listing")
  }
}

export const removeSellerListing = (id: string) => {
  return deleteSellerListing(id)
}
