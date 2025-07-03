export interface GuestListing {
  listingID: string
  referenceNumber: string
  submittedAt: string
  status: "pending" | "active" | "rejected" | "under_review"

  // Vehicle Information
  make: string
  model: string
  year: number
  mileage: number
  transmission: string
  fuelType: string
  bodyType: string
  color: string
  description: string
  askingPrice: number
  photos: string[]

  // Guest Information
  guestName: string
  guestEmail: string
  guestPhone?: string

  // Seller Information (for consistency with SellerListing)
  sellerName: string
  sellerEmail: string
  sellerPhone?: string

  // Admin Review Fields
  adminApproved?: boolean
  adminNotes?: string
  reviewedAt?: string
  approvedAt?: string
  approvedBy?: string
  reviewChecklist?: {
    vehicleInfoComplete: boolean
    photosQuality: boolean
    pricingReasonable: boolean
    sellerVerified: boolean
    documentationValid: boolean
    complianceCheck: boolean
    marketAnalysis: boolean
  }

  // Financial Information
  serviceFee?: number
  netProceeds?: number
  marketAskingPrice?: number
  paymentStatus?: "pending" | "paid" | "refunded"
  paymentMethod?: string
  paymentDate?: string

  // Compliance & Legal
  agreedToTerms: boolean
  marketingConsent?: boolean
  dataProcessingConsent?: boolean

  // Tracking & Analytics
  views?: number
  inquiries?: number
  lastViewedAt?: string

  // Claim Status
  claimed?: boolean
  claimedAt?: string
  claimedBy?: string

  // Additional Metadata
  source?: string
  priority?: "low" | "medium" | "high"
  tags?: string[]
  internalNotes?: string
}

// Mock data storage
const guestListings: GuestListing[] = [
  {
    listingID: "GST-2024-0001",
    referenceNumber: "GST-2024-0001",
    submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: "pending",
    make: "Toyota",
    model: "Aqua",
    year: 2019,
    mileage: 45000,
    transmission: "CVT",
    fuelType: "Hybrid",
    bodyType: "Hatchback",
    color: "White",
    description: "Well-maintained hybrid vehicle with excellent fuel economy. Perfect for daily commuting.",
    askingPrice: 1200000,
    photos: ["/images/toyota-aqua-hybrid-okinawa.png"],
    guestName: "Tanaka Hiroshi",
    guestEmail: "tanaka.hiroshi@email.com",
    guestPhone: "090-1234-5678",
    sellerName: "Tanaka Hiroshi",
    sellerEmail: "tanaka.hiroshi@email.com",
    sellerPhone: "090-1234-5678",
    serviceFee: 60000,
    netProceeds: 1140000,
    marketAskingPrice: 1200000,
    agreedToTerms: true,
    marketingConsent: true,
    views: 0,
    inquiries: 0,
    claimed: false,
    priority: "medium",
  },
  {
    listingID: "GST-2024-0002",
    referenceNumber: "GST-2024-0002",
    submittedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    status: "pending",
    make: "Honda",
    model: "Fit",
    year: 2020,
    mileage: 32000,
    transmission: "CVT",
    fuelType: "Gasoline",
    bodyType: "Hatchback",
    color: "Blue",
    description: "Compact and reliable Honda Fit in excellent condition. Great for city driving.",
    askingPrice: 1350000,
    photos: ["/images/honda-fit-rs-okinawa.png"],
    guestName: "Sato Yuki",
    guestEmail: "sato.yuki@email.com",
    guestPhone: "080-9876-5432",
    sellerName: "Sato Yuki",
    sellerEmail: "sato.yuki@email.com",
    sellerPhone: "080-9876-5432",
    serviceFee: 67500,
    netProceeds: 1282500,
    marketAskingPrice: 1350000,
    agreedToTerms: true,
    marketingConsent: false,
    views: 0,
    inquiries: 0,
    claimed: false,
    priority: "high",
  },
  {
    listingID: "GST-2024-0003",
    referenceNumber: "GST-2024-0003",
    submittedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    status: "active",
    make: "Nissan",
    model: "Note e-POWER",
    year: 2021,
    mileage: 28000,
    transmission: "CVT",
    fuelType: "Hybrid",
    bodyType: "Hatchback",
    color: "Silver",
    description: "Latest e-POWER technology with exceptional fuel efficiency. Like new condition.",
    askingPrice: 1580000,
    photos: ["/images/nissan-note-epower-okinawa.png"],
    guestName: "Yamamoto Kenji",
    guestEmail: "yamamoto.kenji@email.com",
    guestPhone: "070-5555-1234",
    sellerName: "Yamamoto Kenji",
    sellerEmail: "yamamoto.kenji@email.com",
    sellerPhone: "070-5555-1234",
    adminApproved: true,
    adminNotes: "Excellent condition vehicle, approved for listing",
    reviewedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    approvedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    approvedBy: "Admin User",
    serviceFee: 79000,
    netProceeds: 1501000,
    marketAskingPrice: 1580000,
    paymentStatus: "paid",
    agreedToTerms: true,
    marketingConsent: true,
    views: 15,
    inquiries: 3,
    claimed: true,
    claimedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    claimedBy: "Admin User",
    priority: "low",
  },
]

// Core CRUD Operations
export function getGuestListings(): GuestListing[] {
  return [...guestListings]
}

export function saveGuestListing(
  listing: Omit<GuestListing, "listingID" | "referenceNumber" | "submittedAt">,
): GuestListing {
  const newListing: GuestListing = {
    ...listing,
    listingID: `GST-${new Date().getFullYear()}-${String(guestListings.length + 1).padStart(4, "0")}`,
    referenceNumber: `GST-${new Date().getFullYear()}-${String(guestListings.length + 1).padStart(4, "0")}`,
    submittedAt: new Date().toISOString(),
    status: listing.status || "pending",
    adminApproved: false,
    views: 0,
    inquiries: 0,
    claimed: false,
    priority: "medium",
  }

  guestListings.push(newListing)
  return newListing
}

export function updateGuestListing(listingID: string, updates: Partial<GuestListing>): GuestListing | null {
  const index = guestListings.findIndex((listing) => listing.listingID === listingID)
  if (index === -1) return null

  guestListings[index] = { ...guestListings[index], ...updates }
  return guestListings[index]
}

export function deleteGuestListing(listingID: string): boolean {
  const index = guestListings.findIndex((listing) => listing.listingID === listingID)
  if (index === -1) return false

  guestListings.splice(index, 1)
  return true
}

export function getGuestListingById(listingID: string): GuestListing | null {
  return guestListings.find((listing) => listing.listingID === listingID) || null
}

export function getGuestListingByReference(referenceNumber: string): GuestListing | null {
  return guestListings.find((listing) => listing.referenceNumber === referenceNumber) || null
}

// Claim Management
export function claimGuestListing(listingID: string, claimedBy = "Admin User"): GuestListing | null {
  const listing = getGuestListingById(listingID)
  if (!listing) return null

  return updateGuestListing(listingID, {
    claimed: true,
    claimedAt: new Date().toISOString(),
    claimedBy: claimedBy,
  })
}

export function claimAllGuestListings(claimedBy = "Admin User"): GuestListing[] {
  const unclaimedListings = getUnclaimedListings()
  const claimedListings: GuestListing[] = []

  unclaimedListings.forEach((listing) => {
    const claimed = claimGuestListing(listing.listingID, claimedBy)
    if (claimed) {
      claimedListings.push(claimed)
    }
  })

  return claimedListings
}

export function getClaimedListings(): GuestListing[] {
  return guestListings.filter((listing) => listing.claimed === true)
}

export function getUnclaimedListings(): GuestListing[] {
  return guestListings.filter((listing) => listing.claimed !== true)
}

// Status Filtering
export function getActiveGuestListings(): GuestListing[] {
  return guestListings.filter((listing) => listing.status === "active" && listing.adminApproved === true)
}

export function getAdminApprovedGuestListings(): GuestListing[] {
  return guestListings.filter((listing) => listing.adminApproved === true)
}

export function getPendingGuestListings(): GuestListing[] {
  return guestListings.filter((listing) => listing.status === "pending")
}

export function getVerifiedGuestListings(): GuestListing[] {
  return guestListings.filter((listing) => listing.adminApproved === true)
}

export function getInspectedGuestListings(): GuestListing[] {
  return guestListings.filter((listing) => listing.reviewChecklist?.vehicleInfoComplete === true)
}

export function getAppraisedGuestListings(): GuestListing[] {
  return guestListings.filter((listing) => listing.reviewChecklist?.marketAnalysis === true)
}

// Analytics & Tracking
export function incrementGuestListingViews(listingID: string): GuestListing | null {
  const listing = getGuestListingById(listingID)
  if (!listing) return null

  return updateGuestListing(listingID, {
    views: (listing.views || 0) + 1,
    lastViewedAt: new Date().toISOString(),
  })
}

export function incrementGuestListingInquiries(listingID: string): GuestListing | null {
  const listing = getGuestListingById(listingID)
  if (!listing) return null

  return updateGuestListing(listingID, {
    inquiries: (listing.inquiries || 0) + 1,
  })
}

// Search & Filter Functions
export function searchGuestListings(query: string): GuestListing[] {
  const searchTerm = query.toLowerCase()
  return guestListings.filter(
    (listing) =>
      listing.make.toLowerCase().includes(searchTerm) ||
      listing.model.toLowerCase().includes(searchTerm) ||
      listing.guestName.toLowerCase().includes(searchTerm) ||
      listing.guestEmail.toLowerCase().includes(searchTerm) ||
      listing.referenceNumber.toLowerCase().includes(searchTerm) ||
      listing.description.toLowerCase().includes(searchTerm),
  )
}

export function filterGuestListings(filters: {
  status?: string[]
  make?: string[]
  priceRange?: { min?: number; max?: number }
  yearRange?: { min?: number; max?: number }
  mileageRange?: { min?: number; max?: number }
  fuelType?: string[]
  transmission?: string[]
  claimed?: boolean
}): GuestListing[] {
  return guestListings.filter((listing) => {
    if (filters.status && !filters.status.includes(listing.status)) return false
    if (filters.make && !filters.make.includes(listing.make)) return false
    if (filters.priceRange?.min && listing.askingPrice < filters.priceRange.min) return false
    if (filters.priceRange?.max && listing.askingPrice > filters.priceRange.max) return false
    if (filters.yearRange?.min && listing.year < filters.yearRange.min) return false
    if (filters.yearRange?.max && listing.year > filters.yearRange.max) return false
    if (filters.mileageRange?.min && listing.mileage < filters.mileageRange.min) return false
    if (filters.mileageRange?.max && listing.mileage > filters.mileageRange.max) return false
    if (filters.fuelType && !filters.fuelType.includes(listing.fuelType)) return false
    if (filters.transmission && !filters.transmission.includes(listing.transmission)) return false
    if (filters.claimed !== undefined && listing.claimed !== filters.claimed) return false

    return true
  })
}

// Utility Functions
export function getGuestListingStats() {
  const total = guestListings.length
  const pending = guestListings.filter((l) => l.status === "pending").length
  const active = guestListings.filter((l) => l.status === "active" && l.adminApproved).length
  const rejected = guestListings.filter((l) => l.status === "rejected").length
  const claimed = guestListings.filter((l) => l.claimed).length

  return {
    total,
    pending,
    active,
    rejected,
    claimed,
    unclaimed: total - claimed,
    approvalRate: total > 0 ? Math.round((active / total) * 100) : 0,
  }
}

export function calculateServiceFee(askingPrice: number, feePercentage = 5): number {
  return Math.round(askingPrice * (feePercentage / 100))
}

export function calculateNetProceeds(askingPrice: number, serviceFee: number): number {
  return askingPrice - serviceFee
}
