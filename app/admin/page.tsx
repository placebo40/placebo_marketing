"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import {
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  User,
  Phone,
  Mail,
  FileText,
  Camera,
  Loader2,
  Search,
  Filter,
  RefreshCw,
  Download,
  BarChart3,
  Settings,
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  Activity,
  Zap,
  Target,
  Award,
  Bell,
  CheckSquare,
  Square,
  History,
  PieChart,
  LineChart,
} from "lucide-react"
import { getGuestListings, updateGuestListing, type GuestListing } from "@/lib/guest-listings"
import { getSellerListings, updateSellerListing, type SellerListing } from "@/lib/seller-listings"
import Image from "next/image"

type ListingType = GuestListing | SellerListing
type ListingStatus = "pending" | "active" | "rejected" | "under_review"

interface ReviewChecklist {
  vehicleInfoComplete: boolean
  photosQuality: boolean
  pricingReasonable: boolean
  sellerVerified: boolean
  documentationValid: boolean
  complianceCheck: boolean
  marketAnalysis: boolean
}

interface AdminStats {
  totalListings: number
  pendingReview: number
  activeListings: number
  rejectedListings: number
  todaySubmissions: number
  avgProcessingTime: string
  approvalRate: number
  totalRevenue: number
  avgListingValue: number
  topPerformingCategory: string
}

interface BulkAction {
  action: "approve" | "reject" | "under_review"
  notes: string
  selectedIds: string[]
}

interface AutoApprovalRule {
  id: string
  name: string
  enabled: boolean
  conditions: {
    minPrice?: number
    maxPrice?: number
    requiredPhotos?: number
    sellerType?: string
    vehicleAge?: number
  }
  actions: {
    autoApprove: boolean
    requireManualReview: boolean
    notifyAdmin: boolean
  }
}

interface AuditLogEntry {
  id: string
  timestamp: string
  adminUser: string
  action: string
  listingId: string
  details: string
  previousStatus?: string
  newStatus?: string
}

export default function AdminDashboard() {
  const [guestListings, setGuestListings] = useState<GuestListing[]>([])
  const [sellerListings, setSellerListings] = useState<SellerListing[]>([])
  const [selectedListing, setSelectedListing] = useState<ListingType | null>(null)
  const [listingActionNotes, setListingActionNotes] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [priceFilter, setPriceFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("all")
  const [selectedListings, setSelectedListings] = useState<string[]>([])
  const [bulkActionType, setBulkActionType] = useState<"approve" | "reject" | "under_review">("approve")
  const [bulkActionNotes, setBulkActionNotes] = useState("")
  const [showBulkDialog, setShowBulkDialog] = useState(false)
  const [reviewChecklist, setReviewChecklist] = useState<ReviewChecklist>({
    vehicleInfoComplete: false,
    photosQuality: false,
    pricingReasonable: false,
    sellerVerified: false,
    documentationValid: false,
    complianceCheck: false,
    marketAnalysis: false,
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [pendingAction, setPendingAction] = useState<{ action: "approve" | "reject"; listing: ListingType } | null>(
    null,
  )
  const [adminStats, setAdminStats] = useState<AdminStats>({
    totalListings: 0,
    pendingReview: 0,
    activeListings: 0,
    rejectedListings: 0,
    todaySubmissions: 0,
    avgProcessingTime: "2.5 hours",
    approvalRate: 85,
    totalRevenue: 0,
    avgListingValue: 0,
    topPerformingCategory: "Compact Cars",
  })
  const [autoApprovalRules, setAutoApprovalRules] = useState<AutoApprovalRule[]>([
    {
      id: "rule_1",
      name: "High-Value Verified Sellers",
      enabled: true,
      conditions: {
        minPrice: 1000000,
        requiredPhotos: 5,
        sellerType: "verified_dealer",
      },
      actions: {
        autoApprove: false,
        requireManualReview: true,
        notifyAdmin: true,
      },
    },
    {
      id: "rule_2",
      name: "Standard Guest Listings",
      enabled: true,
      conditions: {
        maxPrice: 2000000,
        requiredPhotos: 3,
        vehicleAge: 15,
      },
      actions: {
        autoApprove: false,
        requireManualReview: true,
        notifyAdmin: false,
      },
    },
  ])
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([
    {
      id: "audit_1",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      adminUser: "Admin User",
      action: "APPROVED",
      listingId: "GST-2024-0001",
      details: "Listing approved after manual review",
      previousStatus: "pending",
      newStatus: "active",
    },
    {
      id: "audit_2",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      adminUser: "Admin User",
      action: "REJECTED",
      listingId: "SEL-2024-0002",
      details: "Insufficient vehicle photos provided",
      previousStatus: "pending",
      newStatus: "rejected",
    },
  ])
  const [activeTab, setActiveTab] = useState("overview")
  const { toast } = useToast()

  useEffect(() => {
    const loadListings = () => {
      try {
        const guestData = getGuestListings()
        const sellerData = getSellerListings()
        setGuestListings(guestData)
        setSellerListings(sellerData)

        // Calculate enhanced stats
        const allListings = [...guestData, ...sellerData]
        const today = new Date().toDateString()
        const todaySubmissions = allListings.filter(
          (listing) => new Date(listing.submittedAt).toDateString() === today,
        ).length

        const totalRevenue = guestData.reduce((sum, listing) => sum + (listing.serviceFee || 0), 0)
        const avgListingValue =
          allListings.length > 0
            ? allListings.reduce((sum, listing) => sum + listing.askingPrice, 0) / allListings.length
            : 0

        const stats: AdminStats = {
          totalListings: allListings.length,
          pendingReview: allListings.filter((l) => l.status === "pending").length,
          activeListings: allListings.filter((l) => l.status === "active" && l.adminApproved).length,
          rejectedListings: allListings.filter((l) => l.status === "rejected").length,
          todaySubmissions,
          avgProcessingTime: "2.5 hours",
          approvalRate:
            allListings.length > 0
              ? Math.round(
                  (allListings.filter((l) => l.status === "active" && l.adminApproved).length / allListings.length) *
                    100,
                )
              : 0,
          totalRevenue,
          avgListingValue,
          topPerformingCategory: "Compact Cars",
        }
        setAdminStats(stats)
      } catch (error) {
        console.error("Error loading listings:", error)
        toast({
          title: "Error Loading Data",
          description: "Failed to load listings. Please refresh the page.",
          variant: "destructive",
        })
      }
    }

    loadListings()
  }, [refreshTrigger, toast])

  const resetForm = () => {
    setSelectedListing(null)
    setListingActionNotes("")
    setReviewChecklist({
      vehicleInfoComplete: false,
      photosQuality: false,
      pricingReasonable: false,
      sellerVerified: false,
      documentationValid: false,
      complianceCheck: false,
      marketAnalysis: false,
    })
    setPendingAction(null)
  }

  const validateForm = (action: "approve" | "reject"): boolean => {
    if (action === "reject" && !listingActionNotes.trim()) {
      toast({
        title: "Validation Error",
        description: "Rejection notes are required when rejecting a listing.",
        variant: "destructive",
      })
      return false
    }

    if (action === "approve") {
      const checkedItems = Object.values(reviewChecklist).filter(Boolean).length
      if (checkedItems < 5) {
        toast({
          title: "Validation Error",
          description: "Please complete at least 5 checklist items before approving.",
          variant: "destructive",
        })
        return false
      }
    }

    return true
  }

  const getVehicleInfo = (listing: ListingType) => {
    return {
      make: listing.make || "Unknown",
      model: listing.model || "Unknown",
      year: listing.year || 0,
      mileage: listing.mileage || 0,
      transmission: listing.transmission || "Unknown",
      fuelType: listing.fuelType || "Unknown",
      bodyType: listing.bodyType || "Unknown",
      description: listing.description || "",
    }
  }

  const addAuditLogEntry = (
    action: string,
    listingId: string,
    details: string,
    previousStatus?: string,
    newStatus?: string,
  ) => {
    const newEntry: AuditLogEntry = {
      id: `audit_${Date.now()}`,
      timestamp: new Date().toISOString(),
      adminUser: "Admin User",
      action,
      listingId,
      details,
      previousStatus,
      newStatus,
    }
    setAuditLog((prev) => [newEntry, ...prev])
  }

  const handleListingAction = async (action: "approve" | "reject", listing: ListingType) => {
    if (!validateForm(action)) return

    setIsProcessing(true)

    try {
      if (!listing) {
        throw new Error("No listing selected")
      }

      const vehicleInfo = getVehicleInfo(listing)
      const previousStatus = listing.status

      const updatedListing = {
        ...listing,
        status: action === "approve" ? ("active" as ListingStatus) : ("rejected" as ListingStatus),
        adminApproved: action === "approve" ? true : false,
        adminNotes: listingActionNotes,
        reviewedAt: new Date().toISOString(),
        approvedAt: action === "approve" ? new Date().toISOString() : undefined,
        approvedBy: action === "approve" ? "Admin User" : undefined,
        reviewChecklist: action === "approve" ? reviewChecklist : undefined,
      }

      // Determine if it's a guest or seller listing and update accordingly
      if ("serviceFee" in listing) {
        // Guest listing
        updateGuestListing(listing.listingID, updatedListing as GuestListing)
      } else {
        // Seller listing
        updateSellerListing(listing.listingID, updatedListing as SellerListing)
      }

      // Add audit log entry
      addAuditLogEntry(
        action.toUpperCase(),
        listing.listingID,
        `Listing ${action}d: ${listingActionNotes || `${vehicleInfo.make} ${vehicleInfo.model}`}`,
        previousStatus,
        updatedListing.status,
      )

      // Simulate email notification
      simulateEmailNotification(action, listing, vehicleInfo)

      // Show success notification
      toast({
        title: `Listing ${action === "approve" ? "Approved" : "Rejected"}`,
        description: `${vehicleInfo.make} ${vehicleInfo.model} has been ${action}d successfully and is now ${action === "approve" ? "live on the marketplace" : "removed from public view"}.`,
        variant: "default",
      })

      // Refresh data and reset form
      setRefreshTrigger((prev) => prev + 1)
      resetForm()
    } catch (error) {
      console.error(`Error ${action}ing listing:`, error)
      toast({
        title: `Error ${action === "approve" ? "Approving" : "Rejecting"} Listing`,
        description: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const simulateEmailNotification = (action: "approve" | "reject", listing: ListingType, vehicleInfo: any) => {
    // Simulate email notification (in real app, this would call an API)
    console.log(`📧 Email sent to ${listing.sellerEmail}:`)
    console.log(`Subject: Your ${vehicleInfo.make} ${vehicleInfo.model} listing has been ${action}d`)
    console.log(`Body: Your vehicle listing (${listing.referenceNumber}) has been ${action}d by our admin team.`)
  }

  const handleBulkAction = async () => {
    if (selectedListings.length === 0) {
      toast({
        title: "No Listings Selected",
        description: "Please select at least one listing to perform bulk actions.",
        variant: "destructive",
      })
      return
    }

    if (bulkActionType === "reject" && !bulkActionNotes.trim()) {
      toast({
        title: "Validation Error",
        description: "Notes are required when rejecting listings.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      const allListings = [
        ...guestListings.map((l) => ({ ...l, type: "guest" as const })),
        ...sellerListings.map((l) => ({ ...l, type: "seller" as const })),
      ]

      const listingsToUpdate = allListings.filter((listing) => selectedListings.includes(listing.listingID))

      for (const listing of listingsToUpdate) {
        const updatedListing = {
          ...listing,
          status:
            bulkActionType === "approve"
              ? ("active" as ListingStatus)
              : bulkActionType === "reject"
                ? ("rejected" as ListingStatus)
                : ("under_review" as ListingStatus),
          adminApproved: bulkActionType === "approve" ? true : false,
          adminNotes: bulkActionNotes,
          reviewedAt: new Date().toISOString(),
          approvedAt: bulkActionType === "approve" ? new Date().toISOString() : undefined,
          approvedBy: bulkActionType === "approve" ? "Admin User" : undefined,
        }

        if ("serviceFee" in listing) {
          updateGuestListing(listing.listingID, updatedListing as GuestListing)
        } else {
          updateSellerListing(listing.listingID, updatedListing as SellerListing)
        }

        // Add audit log entry
        addAuditLogEntry(
          `BULK_${bulkActionType.toUpperCase()}`,
          listing.listingID,
          `Bulk action: ${bulkActionNotes || `${listing.make} ${listing.model}`}`,
          listing.status,
          updatedListing.status,
        )
      }

      toast({
        title: "Bulk Action Completed",
        description: `Successfully ${bulkActionType}d ${selectedListings.length} listings.`,
        variant: "default",
      })

      setSelectedListings([])
      setBulkActionNotes("")
      setShowBulkDialog(false)
      setRefreshTrigger((prev) => prev + 1)
    } catch (error) {
      console.error("Error performing bulk action:", error)
      toast({
        title: "Bulk Action Failed",
        description: "An error occurred while performing the bulk action. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const confirmAction = (action: "approve" | "reject", listing: ListingType) => {
    setPendingAction({ action, listing })
  }

  const executeConfirmedAction = () => {
    if (pendingAction) {
      handleListingAction(pendingAction.action, pendingAction.listing)
    }
  }

  const getStatusBadge = (status: string, adminApproved?: boolean) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        )
      case "under_review":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            <Eye className="w-3 h-3 mr-1" />
            Under Review
          </Badge>
        )
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Pending Review
          </Badge>
        )
    }
  }

  const getPriorityBadge = (listing: ListingType) => {
    const submittedDate = new Date(listing.submittedAt)
    const hoursSinceSubmission = (Date.now() - submittedDate.getTime()) / (1000 * 60 * 60)

    if (hoursSinceSubmission > 48) {
      return (
        <Badge variant="destructive" className="text-xs">
          High Priority
        </Badge>
      )
    } else if (hoursSinceSubmission > 24) {
      return <Badge className="bg-orange-100 text-orange-800 text-xs">Medium Priority</Badge>
    }
    return null
  }

  const getAutoApprovalSuggestion = (listing: ListingType) => {
    for (const rule of autoApprovalRules) {
      if (!rule.enabled) continue

      let matches = true
      const conditions = rule.conditions

      if (conditions.minPrice && listing.askingPrice < conditions.minPrice) matches = false
      if (conditions.maxPrice && listing.askingPrice > conditions.maxPrice) matches = false
      if (conditions.requiredPhotos && listing.photos.length < conditions.requiredPhotos) matches = false
      if (conditions.vehicleAge && new Date().getFullYear() - listing.year > conditions.vehicleAge) matches = false

      if (matches) {
        return rule
      }
    }
    return null
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getChecklistProgress = () => {
    const checkedItems = Object.values(reviewChecklist).filter(Boolean).length
    const totalItems = Object.keys(reviewChecklist).length
    return { checked: checkedItems, total: totalItems }
  }

  const isApprovalReady = () => {
    const { checked } = getChecklistProgress()
    return checked >= 5
  }

  const allListings = [
    ...guestListings.map((listing) => ({ ...listing, type: "guest" as const })),
    ...sellerListings.map((listing) => ({ ...listing, type: "seller" as const })),
  ].sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())

  // Apply filters
  const filteredListings = allListings.filter((listing) => {
    const matchesSearch =
      !searchQuery ||
      listing.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.sellerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || listing.status === statusFilter
    const matchesType = typeFilter === "all" || listing.type === typeFilter

    let matchesPrice = true
    if (priceFilter !== "all") {
      switch (priceFilter) {
        case "under_1m":
          matchesPrice = listing.askingPrice < 1000000
          break
        case "1m_to_2m":
          matchesPrice = listing.askingPrice >= 1000000 && listing.askingPrice < 2000000
          break
        case "over_2m":
          matchesPrice = listing.askingPrice >= 2000000
          break
      }
    }

    let matchesDate = true
    if (dateFilter !== "all") {
      const submittedDate = new Date(listing.submittedAt)
      const now = new Date()
      switch (dateFilter) {
        case "today":
          matchesDate = submittedDate.toDateString() === now.toDateString()
          break
        case "week":
          matchesDate = (now.getTime() - submittedDate.getTime()) / (1000 * 60 * 60 * 24) <= 7
          break
        case "month":
          matchesDate = (now.getTime() - submittedDate.getTime()) / (1000 * 60 * 60 * 24) <= 30
          break
      }
    }

    return matchesSearch && matchesStatus && matchesType && matchesPrice && matchesDate
  })

  const pendingListings = filteredListings.filter((listing) => listing.status === "pending")
  const approvedListings = filteredListings.filter(
    (listing) => listing.status === "active" && listing.adminApproved === true,
  )
  const rejectedListings = filteredListings.filter((listing) => listing.status === "rejected")

  const refreshData = () => {
    setRefreshTrigger((prev) => prev + 1)
    toast({
      title: "Data Refreshed",
      description: "Listings data has been refreshed successfully.",
    })
  }

  const exportData = () => {
    const dataStr = JSON.stringify(allListings, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
    const exportFileDefaultName = `admin-listings-${new Date().toISOString().split("T")[0]}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()

    toast({
      title: "Data Exported",
      description: "Listings data has been exported successfully.",
    })
  }

  const toggleListingSelection = (listingId: string) => {
    setSelectedListings((prev) =>
      prev.includes(listingId) ? prev.filter((id) => id !== listingId) : [...prev, listingId],
    )
  }

  const selectAllListings = () => {
    const allIds = pendingListings.map((listing) => listing.listingID)
    setSelectedListings(allIds)
  }

  const clearSelection = () => {
    setSelectedListings([])
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-placebo-black mb-2">Advanced Admin Dashboard</h1>
              <p className="text-placebo-dark-gray">
                Comprehensive listing management with advanced features • Last updated:{" "}
                {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={refreshData} size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" onClick={exportData} size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Admin Dashboard Settings</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Auto-refresh interval</Label>
                      <Select defaultValue="manual">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manual">Manual refresh only</SelectItem>
                          <SelectItem value="30s">Every 30 seconds</SelectItem>
                          <SelectItem value="1m">Every minute</SelectItem>
                          <SelectItem value="5m">Every 5 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Email notifications</Label>
                      <div className="space-y-2 mt-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="notify-new" defaultChecked />
                          <Label htmlFor="notify-new" className="text-sm">
                            New listing submissions
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="notify-high-value" defaultChecked />
                          <Label htmlFor="notify-high-value" className="text-sm">
                            High-value listings (&gt;¥2M)
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="notify-overdue" defaultChecked />
                          <Label htmlFor="notify-overdue" className="text-sm">
                            Overdue reviews (&gt;48 hours)
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Advanced Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="listings">Listings</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="automation">Automation</TabsTrigger>
            <TabsTrigger value="audit">Audit Log</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-l-4 border-l-yellow-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                  <Clock className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{adminStats.pendingReview}</div>
                  <p className="text-xs text-muted-foreground">{adminStats.todaySubmissions} submitted today</p>
                  <div className="mt-2">
                    <div className="text-xs text-yellow-700">Avg processing: {adminStats.avgProcessingTime}</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{adminStats.activeListings}</div>
                  <p className="text-xs text-muted-foreground">{adminStats.approvalRate}% approval rate</p>
                  <div className="mt-2">
                    <div className="text-xs text-green-700">Top category: {adminStats.topPerformingCategory}</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-placebo-gold">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-placebo-gold" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-placebo-gold">{formatPrice(adminStats.totalRevenue)}</div>
                  <p className="text-xs text-muted-foreground">From service fees</p>
                  <div className="mt-2">
                    <div className="text-xs text-yellow-700">
                      Avg listing: {formatPrice(adminStats.avgListingValue)}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Performance</CardTitle>
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{adminStats.approvalRate}%</div>
                  <p className="text-xs text-muted-foreground">Approval efficiency</p>
                  <div className="mt-2">
                    <div className="text-xs text-blue-700">{adminStats.rejectedListings} rejected total</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                    onClick={() => setActiveTab("listings")}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Review Pending ({adminStats.pendingReview})
                  </Button>
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                    onClick={() => setActiveTab("automation")}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Manage Auto-Rules
                  </Button>
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                    onClick={() => setActiveTab("reports")}
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-green-500" />
                    Today's Goals
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Reviews completed</span>
                    <span className="font-medium">8/12</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "67%" }}></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Response time</span>
                    <span className="font-medium text-green-600">2.1h avg</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-blue-500" />
                    Recent Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm">
                    <div className="flex items-center gap-2 text-orange-600">
                      <AlertTriangle className="h-3 w-3" />
                      <span>3 high-priority reviews</span>
                    </div>
                  </div>
                  <div className="text-sm">
                    <div className="flex items-center gap-2 text-blue-600">
                      <Activity className="h-3 w-3" />
                      <span>New auto-rule triggered</span>
                    </div>
                  </div>
                  <div className="text-sm">
                    <div className="flex items-center gap-2 text-green-600">
                      <Award className="h-3 w-3" />
                      <span>Daily goal 67% complete</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Listings Tab */}
          <TabsContent value="listings" className="space-y-6">
            {/* Enhanced Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Advanced Filters & Search
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                  <div>
                    <Label htmlFor="search" className="text-sm font-medium">
                      Search
                    </Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="search"
                        placeholder="Search listings..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="status-filter" className="text-sm font-medium">
                      Status
                    </Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="under_review">Under Review</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="type-filter" className="text-sm font-medium">
                      Type
                    </Label>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="guest">Guest Listings</SelectItem>
                        <SelectItem value="seller">Seller Listings</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="price-filter" className="text-sm font-medium">
                      Price Range
                    </Label>
                    <Select value={priceFilter} onValueChange={setPriceFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Prices</SelectItem>
                        <SelectItem value="under_1m">Under ¥1M</SelectItem>
                        <SelectItem value="1m_to_2m">¥1M - ¥2M</SelectItem>
                        <SelectItem value="over_2m">Over ¥2M</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="date-filter" className="text-sm font-medium">
                      Submitted
                    </Label>
                    <Select value={dateFilter} onValueChange={setDateFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="week">This Week</SelectItem>
                        <SelectItem value="month">This Month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery("")
                        setStatusFilter("all")
                        setTypeFilter("all")
                        setPriceFilter("all")
                        setDateFilter("all")
                      }}
                      className="w-full"
                    >
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bulk Actions */}
            {selectedListings.length > 0 && (
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="font-medium text-blue-900">
                        {selectedListings.length} listing{selectedListings.length > 1 ? "s" : ""} selected
                      </span>
                      <Button variant="outline" size="sm" onClick={clearSelection}>
                        Clear Selection
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Dialog open={showBulkDialog} onOpenChange={setShowBulkDialog}>
                        <DialogTrigger asChild>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Bulk Approve
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Bulk Action Confirmation</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>Action Type</Label>
                              <Select value={bulkActionType} onValueChange={(value: any) => setBulkActionType(value)}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="approve">Approve</SelectItem>
                                  <SelectItem value="reject">Reject</SelectItem>
                                  <SelectItem value="under_review">Mark Under Review</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>Notes</Label>
                              <Textarea
                                placeholder="Add notes for this bulk action..."
                                value={bulkActionNotes}
                                onChange={(e) => setBulkActionNotes(e.target.value)}
                                rows={3}
                              />
                            </div>
                            <div className="flex gap-3">
                              <Button variant="outline" onClick={() => setShowBulkDialog(false)} className="flex-1">
                                Cancel
                              </Button>
                              <Button onClick={handleBulkAction} disabled={isProcessing} className="flex-1">
                                {isProcessing ? (
                                  <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Processing...
                                  </>
                                ) : (
                                  `${bulkActionType} ${selectedListings.length} Listings`
                                )}
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setBulkActionType("reject")
                          setShowBulkDialog(true)
                        }}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Bulk Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Listings Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Listings Management ({filteredListings.length} total)
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={selectAllListings}>
                    <CheckSquare className="h-4 w-4 mr-2" />
                    Select All Pending
                  </Button>
                  <Button variant="outline" size="sm" onClick={clearSelection}>
                    <Square className="h-4 w-4 mr-2" />
                    Clear Selection
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox
                            checked={
                              pendingListings.length > 0 &&
                              pendingListings.every((listing) => selectedListings.includes(listing.listingID))
                            }
                            onCheckedChange={(checked) => {
                              if (checked) {
                                selectAllListings()
                              } else {
                                clearSelection()
                              }
                            }}
                          />
                        </TableHead>
                        <TableHead>Vehicle</TableHead>
                        <TableHead>Seller</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredListings.map((listing) => {
                        const vehicleInfo = getVehicleInfo(listing)
                        const autoRule = getAutoApprovalSuggestion(listing)
                        return (
                          <TableRow key={listing.listingID} className="hover:bg-gray-50">
                            <TableCell>
                              <Checkbox
                                checked={selectedListings.includes(listing.listingID)}
                                onCheckedChange={() => toggleListingSelection(listing.listingID)}
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                {listing.photos && listing.photos.length > 0 ? (
                                  <Image
                                    src={listing.photos[0] || "/placeholder.svg"}
                                    alt={`${vehicleInfo.make} ${vehicleInfo.model}`}
                                    width={48}
                                    height={48}
                                    className="rounded-lg object-cover"
                                  />
                                ) : (
                                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                    <Camera className="h-5 w-5 text-gray-400" />
                                  </div>
                                )}
                                <div>
                                  <div className="font-medium">
                                    {vehicleInfo.make} {vehicleInfo.model}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {vehicleInfo.year} • {vehicleInfo.mileage?.toLocaleString()} km
                                  </div>
                                  <div className="text-xs text-gray-400">{listing.referenceNumber}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-gray-400" />
                                <div>
                                  <div className="font-medium">{listing.sellerName}</div>
                                  <div className="text-sm text-gray-500">{listing.sellerEmail}</div>
                                  {listing.sellerPhone && (
                                    <div className="text-xs text-gray-400 flex items-center gap-1">
                                      <Phone className="h-3 w-3" />
                                      {listing.sellerPhone}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">{formatPrice(listing.askingPrice)}</div>
                              {"serviceFee" in listing && listing.serviceFee && (
                                <div className="text-sm text-green-600">Fee: {formatPrice(listing.serviceFee)}</div>
                              )}
                            </TableCell>
                            <TableCell>{getStatusBadge(listing.status, listing.adminApproved)}</TableCell>
                            <TableCell>{getPriorityBadge(listing)}</TableCell>
                            <TableCell>
                              <div className="text-sm">{new Date(listing.submittedAt).toLocaleDateString()}</div>
                              <div className="text-xs text-gray-500">
                                {new Date(listing.submittedAt).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs">
                                {listing.type === "guest" ? "Guest" : "Seller"}
                              </Badge>
                              {autoRule && (
                                <div className="mt-1">
                                  <Badge className="bg-blue-100 text-blue-800 text-xs">
                                    <Zap className="h-3 w-3 mr-1" />
                                    Auto-rule
                                  </Badge>
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="outline" size="sm" onClick={() => setSelectedListing(listing)}>
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                      <DialogTitle>
                                        Review Listing: {vehicleInfo.make} {vehicleInfo.model}
                                      </DialogTitle>
                                    </DialogHeader>
                                    {selectedListing && (
                                      <div className="space-y-6">
                                        <Tabs defaultValue="details" className="w-full">
                                          <TabsList className="grid w-full grid-cols-4">
                                            <TabsTrigger value="details">Details</TabsTrigger>
                                            <TabsTrigger value="photos">Photos</TabsTrigger>
                                            <TabsTrigger value="seller">Seller Info</TabsTrigger>
                                            <TabsTrigger value="review">Review</TabsTrigger>
                                          </TabsList>

                                          <TabsContent value="details" className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                              <div>
                                                <Label className="font-medium">Vehicle Information</Label>
                                                <div className="space-y-2 mt-2">
                                                  <div className="flex justify-between">
                                                    <span className="text-sm text-gray-600">Make:</span>
                                                    <span className="text-sm font-medium">{vehicleInfo.make}</span>
                                                  </div>
                                                  <div className="flex justify-between">
                                                    <span className="text-sm text-gray-600">Model:</span>
                                                    <span className="text-sm font-medium">{vehicleInfo.model}</span>
                                                  </div>
                                                  <div className="flex justify-between">
                                                    <span className="text-sm text-gray-600">Year:</span>
                                                    <span className="text-sm font-medium">{vehicleInfo.year}</span>
                                                  </div>
                                                  <div className="flex justify-between">
                                                    <span className="text-sm text-gray-600">Mileage:</span>
                                                    <span className="text-sm font-medium">
                                                      {vehicleInfo.mileage?.toLocaleString()} km
                                                    </span>
                                                  </div>
                                                  <div className="flex justify-between">
                                                    <span className="text-sm text-gray-600">Transmission:</span>
                                                    <span className="text-sm font-medium">
                                                      {vehicleInfo.transmission}
                                                    </span>
                                                  </div>
                                                  <div className="flex justify-between">
                                                    <span className="text-sm text-gray-600">Fuel Type:</span>
                                                    <span className="text-sm font-medium">{vehicleInfo.fuelType}</span>
                                                  </div>
                                                </div>
                                              </div>
                                              <div>
                                                <Label className="font-medium">Pricing & Fees</Label>
                                                <div className="space-y-2 mt-2">
                                                  <div className="flex justify-between">
                                                    <span className="text-sm text-gray-600">Asking Price:</span>
                                                    <span className="text-sm font-medium">
                                                      {formatPrice(selectedListing.askingPrice)}
                                                    </span>
                                                  </div>
                                                  {"serviceFee" in selectedListing && selectedListing.serviceFee && (
                                                    <>
                                                      <div className="flex justify-between">
                                                        <span className="text-sm text-gray-600">Service Fee:</span>
                                                        <span className="text-sm font-medium text-green-600">
                                                          {formatPrice(selectedListing.serviceFee)}
                                                        </span>
                                                      </div>
                                                      <div className="flex justify-between">
                                                        <span className="text-sm text-gray-600">Net Proceeds:</span>
                                                        <span className="text-sm font-medium">
                                                          {formatPrice(
                                                            selectedListing.askingPrice - selectedListing.serviceFee,
                                                          )}
                                                        </span>
                                                      </div>
                                                    </>
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                            {vehicleInfo.description && (
                                              <div>
                                                <Label className="font-medium">Description</Label>
                                                <p className="text-sm text-gray-700 mt-2 p-3 bg-gray-50 rounded-lg">
                                                  {vehicleInfo.description}
                                                </p>
                                              </div>
                                            )}
                                          </TabsContent>

                                          <TabsContent value="photos" className="space-y-4">
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                              {selectedListing.photos && selectedListing.photos.length > 0 ? (
                                                selectedListing.photos.map((photo, index) => (
                                                  <div key={index} className="relative">
                                                    <Image
                                                      src={photo || "/placeholder.svg"}
                                                      alt={`Vehicle photo ${index + 1}`}
                                                      width={200}
                                                      height={150}
                                                      className="rounded-lg object-cover w-full h-32"
                                                    />
                                                  </div>
                                                ))
                                              ) : (
                                                <div className="col-span-full text-center py-8">
                                                  <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                                                  <p className="text-gray-500">No photos uploaded</p>
                                                </div>
                                              )}
                                            </div>
                                          </TabsContent>

                                          <TabsContent value="seller" className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                              <div>
                                                <Label className="font-medium">Contact Information</Label>
                                                <div className="space-y-3 mt-2">
                                                  <div className="flex items-center gap-2">
                                                    <User className="h-4 w-4 text-gray-400" />
                                                    <span className="text-sm">{selectedListing.sellerName}</span>
                                                  </div>
                                                  <div className="flex items-center gap-2">
                                                    <Mail className="h-4 w-4 text-gray-400" />
                                                    <span className="text-sm">{selectedListing.sellerEmail}</span>
                                                  </div>
                                                  {selectedListing.sellerPhone && (
                                                    <div className="flex items-center gap-2">
                                                      <Phone className="h-4 w-4 text-gray-400" />
                                                      <span className="text-sm">{selectedListing.sellerPhone}</span>
                                                    </div>
                                                  )}
                                                </div>
                                              </div>
                                              <div>
                                                <Label className="font-medium">Listing Details</Label>
                                                <div className="space-y-2 mt-2">
                                                  <div className="flex justify-between">
                                                    <span className="text-sm text-gray-600">Reference:</span>
                                                    <span className="text-sm font-medium">
                                                      {selectedListing.referenceNumber}
                                                    </span>
                                                  </div>
                                                  <div className="flex justify-between">
                                                    <span className="text-sm text-gray-600">Type:</span>
                                                    <span className="text-sm font-medium">
                                                      {selectedListing.type === "guest"
                                                        ? "Guest Listing"
                                                        : "Seller Listing"}
                                                    </span>
                                                  </div>
                                                  <div className="flex justify-between">
                                                    <span className="text-sm text-gray-600">Submitted:</span>
                                                    <span className="text-sm font-medium">
                                                      {new Date(selectedListing.submittedAt).toLocaleString()}
                                                    </span>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </TabsContent>

                                          <TabsContent value="review" className="space-y-4">
                                            <div className="space-y-4">
                                              <div>
                                                <Label className="font-medium mb-3 block">Review Checklist</Label>
                                                <div className="space-y-3">
                                                  {Object.entries(reviewChecklist).map(([key, checked]) => (
                                                    <div key={key} className="flex items-center space-x-2">
                                                      <Checkbox
                                                        id={key}
                                                        checked={checked}
                                                        onCheckedChange={(checked) =>
                                                          setReviewChecklist((prev) => ({
                                                            ...prev,
                                                            [key]: checked as boolean,
                                                          }))
                                                        }
                                                      />
                                                      <Label htmlFor={key} className="text-sm">
                                                        {key
                                                          .replace(/([A-Z])/g, " $1")
                                                          .replace(/^./, (str) => str.toUpperCase())}
                                                      </Label>
                                                    </div>
                                                  ))}
                                                </div>
                                                <div className="mt-3 text-sm text-gray-600">
                                                  Progress: {getChecklistProgress().checked} of{" "}
                                                  {getChecklistProgress().total} items completed
                                                </div>
                                              </div>

                                              <div>
                                                <Label htmlFor="admin-notes" className="font-medium">
                                                  Admin Notes
                                                </Label>
                                                <Textarea
                                                  id="admin-notes"
                                                  placeholder="Add your review notes here..."
                                                  value={listingActionNotes}
                                                  onChange={(e) => setListingActionNotes(e.target.value)}
                                                  rows={4}
                                                  className="mt-2"
                                                />
                                              </div>

                                              {autoRule && (
                                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                                                  <div className="flex items-center gap-2 mb-2">
                                                    <Zap className="h-4 w-4 text-blue-600" />
                                                    <span className="font-medium text-blue-900">
                                                      Auto-Approval Rule Match
                                                    </span>
                                                  </div>
                                                  <p className="text-sm text-blue-800">
                                                    This listing matches the "{autoRule.name}" rule.
                                                  </p>
                                                  <div className="mt-2 text-xs text-blue-700">
                                                    Suggested action:{" "}
                                                    {autoRule.actions.autoApprove
                                                      ? "Auto-approve"
                                                      : "Manual review required"}
                                                  </div>
                                                </div>
                                              )}

                                              <div className="flex gap-3 pt-4">
                                                <AlertDialog>
                                                  <AlertDialogTrigger asChild>
                                                    <Button
                                                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                                      disabled={!isApprovalReady() || isProcessing}
                                                      onClick={() => confirmAction("approve", selectedListing)}
                                                    >
                                                      <CheckCircle className="h-4 w-4 mr-2" />
                                                      Approve Listing
                                                    </Button>
                                                  </AlertDialogTrigger>
                                                  <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                      <AlertDialogTitle>Confirm Approval</AlertDialogTitle>
                                                      <AlertDialogDescription>
                                                        Are you sure you want to approve this listing? It will become
                                                        live on the marketplace immediately.
                                                      </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                      <AlertDialogAction onClick={executeConfirmedAction}>
                                                        Approve
                                                      </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                  </AlertDialogContent>
                                                </AlertDialog>

                                                <AlertDialog>
                                                  <AlertDialogTrigger asChild>
                                                    <Button
                                                      variant="destructive"
                                                      className="flex-1"
                                                      disabled={isProcessing}
                                                      onClick={() => confirmAction("reject", selectedListing)}
                                                    >
                                                      <XCircle className="h-4 w-4 mr-2" />
                                                      Reject Listing
                                                    </Button>
                                                  </AlertDialogTrigger>
                                                  <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                      <AlertDialogTitle>Confirm Rejection</AlertDialogTitle>
                                                      <AlertDialogDescription>
                                                        Are you sure you want to reject this listing? The seller will be
                                                        notified with your feedback.
                                                      </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                      <AlertDialogAction onClick={executeConfirmedAction}>
                                                        Reject
                                                      </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                  </AlertDialogContent>
                                                </AlertDialog>
                                              </div>
                                            </div>
                                          </TabsContent>
                                        </Tabs>
                                      </div>
                                    )}
                                  </DialogContent>
                                </Dialog>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    // Quick approve for high-confidence listings
                                    setSelectedListing(listing)
                                    setListingActionNotes("Quick approval - meets all criteria")
                                    setReviewChecklist({
                                      vehicleInfoComplete: true,
                                      photosQuality: true,
                                      pricingReasonable: true,
                                      sellerVerified: true,
                                      documentationValid: true,
                                      complianceCheck: true,
                                      marketAnalysis: true,
                                    })
                                    handleListingAction("approve", listing)
                                  }}
                                  className="text-green-600 hover:text-green-700"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Status Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Pending</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full">
                          <div
                            className="h-2 bg-yellow-500 rounded-full"
                            style={{ width: `${(adminStats.pendingReview / adminStats.totalListings) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{adminStats.pendingReview}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Active</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full">
                          <div
                            className="h-2 bg-green-500 rounded-full"
                            style={{ width: `${(adminStats.activeListings / adminStats.totalListings) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{adminStats.activeListings}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Rejected</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full">
                          <div
                            className="h-2 bg-red-500 rounded-full"
                            style={{ width: `${(adminStats.rejectedListings / adminStats.totalListings) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{adminStats.rejectedListings}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="h-5 w-5" />
                    Processing Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Avg Response Time</span>
                        <span className="text-sm font-medium">{adminStats.avgProcessingTime}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: "75%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Approval Rate</span>
                        <span className="text-sm font-medium">{adminStats.approvalRate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${adminStats.approvalRate}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Today's Progress</span>
                        <span className="text-sm font-medium">67%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-placebo-gold h-2 rounded-full" style={{ width: "67%" }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Revenue Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-placebo-gold">{formatPrice(adminStats.totalRevenue)}</div>
                      <div className="text-sm text-gray-500">Total Revenue</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-medium">{formatPrice(adminStats.avgListingValue)}</div>
                      <div className="text-sm text-gray-500">Avg Listing Value</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-medium">{adminStats.todaySubmissions}</div>
                      <div className="text-sm text-gray-500">Today's Submissions</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">2.1h</div>
                    <div className="text-sm text-blue-800">Avg Response</div>
                    <div className="text-xs text-green-600">↓ 15% vs last week</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">94%</div>
                    <div className="text-sm text-green-800">Quality Score</div>
                    <div className="text-xs text-green-600">↑ 3% vs last week</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">12</div>
                    <div className="text-sm text-yellow-800">Daily Reviews</div>
                    <div className="text-xs text-green-600">↑ 20% vs last week</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">87%</div>
                    <div className="text-sm text-purple-800">User Satisfaction</div>
                    <div className="text-xs text-green-600">↑ 5% vs last week</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Automation Tab */}
          <TabsContent value="automation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Auto-Approval Rules
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {autoApprovalRules.map((rule) => (
                    <div key={rule.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={rule.enabled}
                            onCheckedChange={(checked) =>
                              setAutoApprovalRules((prev) =>
                                prev.map((r) => (r.id === rule.id ? { ...r, enabled: checked as boolean } : r)),
                              )
                            }
                          />
                          <div>
                            <div className="font-medium">{rule.name}</div>
                            <div className="text-sm text-gray-500">{rule.enabled ? "Active" : "Inactive"}</div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <Label className="font-medium">Conditions</Label>
                          <ul className="mt-1 space-y-1 text-gray-600">
                            {rule.conditions.minPrice && <li>• Min price: {formatPrice(rule.conditions.minPrice)}</li>}
                            {rule.conditions.maxPrice && <li>• Max price: {formatPrice(rule.conditions.maxPrice)}</li>}
                            {rule.conditions.requiredPhotos && <li>• Min photos: {rule.conditions.requiredPhotos}</li>}
                            {rule.conditions.sellerType && <li>• Seller type: {rule.conditions.sellerType}</li>}
                            {rule.conditions.vehicleAge && (
                              <li>• Max vehicle age: {rule.conditions.vehicleAge} years</li>
                            )}
                          </ul>
                        </div>
                        <div>
                          <Label className="font-medium">Actions</Label>
                          <ul className="mt-1 space-y-1 text-gray-600">
                            {rule.actions.autoApprove && <li>• Auto-approve listing</li>}
                            {rule.actions.requireManualReview && <li>• Require manual review</li>}
                            {rule.actions.notifyAdmin && <li>• Notify admin</li>}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <Button>
                    <Zap className="h-4 w-4 mr-2" />
                    Add New Rule
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Automation Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Automation Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">23%</div>
                    <div className="text-sm text-blue-800">Auto-processed</div>
                    <div className="text-xs text-gray-500">This month</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">1.2h</div>
                    <div className="text-sm text-green-800">Time Saved</div>
                    <div className="text-xs text-gray-500">Per auto-approval</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">97%</div>
                    <div className="text-sm text-purple-800">Accuracy Rate</div>
                    <div className="text-xs text-gray-500">Auto-approvals</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audit Log Tab */}
          <TabsContent value="audit" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Audit Trail
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {auditLog.map((entry) => (
                    <div key={entry.id} className="border-l-4 border-l-blue-500 pl-4 py-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge
                            className={
                              entry.action.includes("APPROVED")
                                ? "bg-green-100 text-green-800"
                                : entry.action.includes("REJECTED")
                                  ? "bg-red-100 text-red-800"
                                  : "bg-blue-100 text-blue-800"
                            }
                          >
                            {entry.action}
                          </Badge>
                          <span className="font-medium">{entry.listingId}</span>
                        </div>
                        <span className="text-sm text-gray-500">{new Date(entry.timestamp).toLocaleString()}</span>
                      </div>
                      <div className="mt-1">
                        <p className="text-sm text-gray-700">{entry.details}</p>
                        <div className="text-xs text-gray-500 mt-1">
                          By: {entry.adminUser}
                          {entry.previousStatus && entry.newStatus && (
                            <span className="ml-2">
                              Status: {entry.previousStatus} → {entry.newStatus}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Generate Reports
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Daily Activity Report
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Weekly Performance Summary
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Monthly Revenue Report
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    Seller Analytics Report
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Scheduled Reports
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">Weekly Summary</div>
                      <div className="text-sm text-gray-500">Every Monday at 9:00 AM</div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">Monthly Analytics</div>
                      <div className="text-sm text-gray-500">1st of each month</div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <Button className="w-full mt-4">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule New Report
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Export Options */}
            <Card>
              <CardHeader>
                <CardTitle>Export Data</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Button variant="outline" onClick={exportData}>
                    <Download className="h-4 w-4 mr-2" />
                    All Listings (JSON)
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Pending Only (CSV)
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Audit Log (PDF)
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Analytics (Excel)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Confirmation Dialog */}
        <AlertDialog open={!!pendingAction} onOpenChange={() => setPendingAction(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Confirm {pendingAction?.action === "approve" ? "Approval" : "Rejection"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {pendingAction?.action === "approve"
                  ? "Are you sure you want to approve this listing? It will become live on the marketplace immediately."
                  : "Are you sure you want to reject this listing? The seller will be notified with your feedback."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setPendingAction(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={executeConfirmedAction} disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : pendingAction?.action === "approve" ? (
                  "Approve"
                ) : (
                  "Reject"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
