"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import {
  Search,
  X,
  Heart,
  Share2,
  MapPin,
  Calendar,
  Gauge,
  Fuel,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  CheckCircle,
  User,
} from "lucide-react"
import { getGuestListings, type GuestListing } from "@/lib/guest-listings"
import { getSellerListings, type SellerListing } from "@/lib/seller-listings"
import Link from "next/link"
import Image from "next/image"

// Combined vehicle type for display
type Vehicle = (GuestListing | SellerListing) & {
  listingType: "guest" | "seller"
  id: string // Ensure consistent ID field
  imageUrl?: string
  images?: string[]
}

export default function CarsPage() {
  const { language } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(true)
  const [filters, setFilters] = useState({
    make: "",
    model: "",
    priceRange: [0, 5000000],
    yearRange: [2015, 2025],
    mileageRange: [0, 200000],
    color: "",
    fuelType: "",
    location: "",
    verificationLevel: "",
    inspectionStatus: "",
    appraisalStatus: "",
  })

  const vehiclesPerPage = 6

  // Sample data for dropdowns
  const makes = ["Toyota", "Honda", "Nissan", "Mazda", "Suzuki", "Daihatsu", "Mercedes-Benz", "BMW"]
  const colors = ["White", "Black", "Silver", "Red", "Blue", "Gray", "Yellow", "Green"]
  const fuelTypes = ["Gasoline", "Hybrid", "Electric", "Diesel"]
  const locations = ["Naha", "Okinawa City", "Urasoe", "Ginowan", "Uruma", "Nago", "Itoman", "Nanjo"]

  // Load vehicles from both guest and seller listings
  useEffect(() => {
    const guestListings = getGuestListings()
    const sellerListings = getSellerListings()

    console.log("Guest listings:", guestListings)
    console.log("Seller listings:", sellerListings)

    const combinedVehicles: Vehicle[] = [
      ...guestListings.map((listing) => ({
        ...listing,
        listingType: "guest" as const,
        id: listing.listingID, // Use listingID for guest listings
        imageUrl: listing.photos?.[0] || listing.imageUrl || "/placeholder.svg?height=400&width=600&text=Vehicle+Image",
        images: listing.photos || (listing.imageUrl ? [listing.imageUrl] : []),
      })),
      ...sellerListings.map((listing) => ({
        ...listing,
        listingType: "seller" as const,
        id: listing.id || listing.listingID, // Use id for seller listings, fallback to listingID
        imageUrl: listing.photos?.[0] || "/placeholder.svg?height=400&width=600&text=Vehicle+Image",
        images: listing.photos || [],
      })),
    ]

    console.log("Combined vehicles:", combinedVehicles)

    // Filter only admin-approved active listings
    const activeVehicles = combinedVehicles.filter((vehicle) => {
      const isActive = vehicle.status === "active" || vehicle.status === "live"
      const isApproved = vehicle.adminApproved === true
      const hasValidId = vehicle.id && vehicle.id !== "undefined"

      console.log(`Vehicle ${vehicle.make} ${vehicle.model}:`, {
        id: vehicle.id,
        status: vehicle.status,
        adminApproved: vehicle.adminApproved,
        isActive,
        isApproved,
        hasValidId,
      })

      return isActive && isApproved && hasValidId
    })

    console.log("Active vehicles:", activeVehicles)

    setVehicles(activeVehicles)
    setFilteredVehicles(activeVehicles)
  }, [])

  // Apply filters function
  const applyFilters = () => {
    let filtered = vehicles

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (vehicle) =>
          vehicle.make.toLowerCase().includes(query) ||
          vehicle.model.toLowerCase().includes(query) ||
          vehicle.description.toLowerCase().includes(query) ||
          vehicle.location.toLowerCase().includes(query),
      )
    }

    // Apply other filters
    if (filters.make && filters.make !== "all") {
      filtered = filtered.filter((vehicle) => vehicle.make === filters.make)
    }

    if (filters.model.trim()) {
      filtered = filtered.filter((vehicle) => vehicle.model.toLowerCase().includes(filters.model.toLowerCase()))
    }

    // Price range filter
    filtered = filtered.filter(
      (vehicle) => vehicle.askingPrice >= filters.priceRange[0] && vehicle.askingPrice <= filters.priceRange[1],
    )

    // Year range filter
    filtered = filtered.filter(
      (vehicle) => vehicle.year >= filters.yearRange[0] && vehicle.year <= filters.yearRange[1],
    )

    // Mileage range filter
    filtered = filtered.filter(
      (vehicle) => vehicle.mileage >= filters.mileageRange[0] && vehicle.mileage <= filters.mileageRange[1],
    )

    if (filters.color && filters.color !== "all") {
      filtered = filtered.filter((vehicle) => vehicle.color === filters.color)
    }

    if (filters.fuelType && filters.fuelType !== "all") {
      filtered = filtered.filter((vehicle) => vehicle.fuelType === filters.fuelType)
    }

    if (filters.location && filters.location !== "all") {
      filtered = filtered.filter((vehicle) => vehicle.location === filters.location)
    }

    if (filters.verificationLevel) {
      if (filters.verificationLevel === "verified") {
        filtered = filtered.filter((vehicle) => vehicle.isVerified)
      } else if (filters.verificationLevel === "unverified") {
        filtered = filtered.filter((vehicle) => !vehicle.isVerified)
      }
    }

    if (filters.inspectionStatus) {
      if (filters.inspectionStatus === "inspected") {
        filtered = filtered.filter((vehicle) => vehicle.isVehicleVerified)
      } else if (filters.inspectionStatus === "not_inspected") {
        filtered = filtered.filter((vehicle) => !vehicle.isVehicleVerified)
      }
    }

    if (filters.appraisalStatus) {
      if (filters.appraisalStatus === "appraised") {
        filtered = filtered.filter((vehicle) => vehicle.hasAppraisal)
      } else if (filters.appraisalStatus === "not_appraised") {
        filtered = filtered.filter((vehicle) => !vehicle.hasAppraisal)
      }
    }

    // Sort vehicles
    switch (sortBy) {
      case "price_low":
        filtered.sort((a, b) => a.askingPrice - b.askingPrice)
        break
      case "price_high":
        filtered.sort((a, b) => b.askingPrice - a.askingPrice)
        break
      case "year_new":
        filtered.sort((a, b) => b.year - a.year)
        break
      case "year_old":
        filtered.sort((a, b) => a.year - b.year)
        break
      case "mileage_low":
        filtered.sort((a, b) => a.mileage - b.mileage)
        break
      case "mileage_high":
        filtered.sort((a, b) => b.mileage - a.mileage)
        break
      case "newest":
      default:
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
    }

    setFilteredVehicles(filtered)
    setCurrentPage(1)
  }

  // Auto-apply filters when dependencies change
  useEffect(() => {
    applyFilters()
  }, [vehicles, searchQuery, sortBy])

  const clearFilters = () => {
    setFilters({
      make: "",
      model: "",
      priceRange: [0, 5000000],
      yearRange: [2015, 2025],
      mileageRange: [0, 200000],
      color: "",
      fuelType: "",
      location: "",
      verificationLevel: "",
      inspectionStatus: "",
      appraisalStatus: "",
    })
    setSearchQuery("")
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(language === "en" ? "en-US" : "ja-JP", {
      style: "currency",
      currency: "JPY",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat(language === "en" ? "en-US" : "ja-JP").format(mileage)
  }

  // Pagination
  const totalPages = Math.ceil(filteredVehicles.length / vehiclesPerPage)
  const startIndex = (currentPage - 1) * vehiclesPerPage
  const endIndex = startIndex + vehiclesPerPage
  const currentVehicles = filteredVehicles.slice(startIndex, endIndex)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Compact Hero Section */}
      <div className="bg-placebo-black text-white py-6 md:py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-2xl md:text-3xl font-bold mb-2 leading-tight">
              {language === "en" ? "Browse Vehicles" : "車両を検索"}
            </h1>
            <p className="text-sm md:text-base text-gray-300 leading-relaxed">
              {language === "en"
                ? "Find your perfect vehicle in Okinawa's premier marketplace"
                : "沖縄のプレミアムマーケットプレイスで理想の車両を見つけよう"}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Left Sidebar - Enhanced Filters */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-lg border shadow-sm sticky top-4">
              {/* Filters Header */}
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg text-gray-900">
                      {language === "en" ? "Filters" : "フィルター"}
                    </h3>
                    <Button variant="ghost" size="sm" onClick={() => setShowFilters(!showFilters)} className="p-1">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="text-sm text-gray-600">
                    {language === "en" ? "Reset" : "リセット"}
                  </Button>
                </div>
              </div>

              {showFilters && (
                <div className="p-4 space-y-6">
                  {/* Make & Model */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">
                      {language === "en" ? "Make & Model" : "メーカー & モデル"}
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {language === "en" ? "Make" : "メーカー"}
                        </label>
                        <Select value={filters.make} onValueChange={(value) => setFilters({ ...filters, make: value })}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={language === "en" ? "Select make" : "メーカーを選択"} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">{language === "en" ? "All Makes" : "すべてのメーカー"}</SelectItem>
                            {makes.map((make) => (
                              <SelectItem key={make} value={make}>
                                {make}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {language === "en" ? "Model" : "モデル"}
                        </label>
                        <Input
                          placeholder={language === "en" ? "Enter model" : "モデルを入力"}
                          value={filters.model}
                          onChange={(e) => setFilters({ ...filters, model: e.target.value })}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">{language === "en" ? "Price Range" : "価格帯"}</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>¥{filters.priceRange[0].toLocaleString()}</span>
                        <span>¥{filters.priceRange[1].toLocaleString()}</span>
                      </div>
                      <Slider
                        value={filters.priceRange}
                        onValueChange={(value) => setFilters({ ...filters, priceRange: value })}
                        max={5000000}
                        step={50000}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Year Range */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">{language === "en" ? "Year" : "年式"}</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{filters.yearRange[0]}</span>
                        <span>{filters.yearRange[1]}</span>
                      </div>
                      <Slider
                        value={filters.yearRange}
                        onValueChange={(value) => setFilters({ ...filters, yearRange: value })}
                        min={2010}
                        max={2025}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Mileage Range */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">{language === "en" ? "Mileage" : "走行距離"}</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{filters.mileageRange[0].toLocaleString()} km</span>
                        <span>{filters.mileageRange[1].toLocaleString()} km</span>
                      </div>
                      <Slider
                        value={filters.mileageRange}
                        onValueChange={(value) => setFilters({ ...filters, mileageRange: value })}
                        max={200000}
                        step={5000}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Other Filters */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">
                      {language === "en" ? "Other Filters" : "その他のフィルター"}
                    </h4>
                    <div className="space-y-3">
                      {/* Color */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {language === "en" ? "Color" : "色"}
                        </label>
                        <Select
                          value={filters.color}
                          onValueChange={(value) => setFilters({ ...filters, color: value })}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={language === "en" ? "Select color" : "色を選択"} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">{language === "en" ? "All Colors" : "すべての色"}</SelectItem>
                            {colors.map((color) => (
                              <SelectItem key={color} value={color}>
                                {language === "en" ? color : color}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Fuel Type */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {language === "en" ? "Fuel Type" : "燃料タイプ"}
                        </label>
                        <Select
                          value={filters.fuelType}
                          onValueChange={(value) => setFilters({ ...filters, fuelType: value })}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={language === "en" ? "Select fuel type" : "燃料タイプを選択"} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">
                              {language === "en" ? "All Fuel Types" : "すべての燃料タイプ"}
                            </SelectItem>
                            {fuelTypes.map((fuel) => (
                              <SelectItem key={fuel} value={fuel}>
                                {language === "en" ? fuel : fuel}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Location */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {language === "en" ? "Location" : "場所"}
                        </label>
                        <Select
                          value={filters.location}
                          onValueChange={(value) => setFilters({ ...filters, location: value })}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={language === "en" ? "Select location" : "場所を選択"} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">{language === "en" ? "All Locations" : "すべての場所"}</SelectItem>
                            {locations.map((location) => (
                              <SelectItem key={location} value={location}>
                                {location}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Apply Filters Button */}
              <div className="p-4 border-t bg-gray-50 rounded-b-lg">
                <Button
                  onClick={applyFilters}
                  className="w-full bg-placebo-black hover:bg-placebo-black/90 text-white font-medium py-2.5"
                >
                  {language === "en" ? "Apply Filters" : "フィルターを適用"}
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Content Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {language === "en" ? "Available Vehicles" : "利用可能な車両"}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {language === "en"
                    ? `${filteredVehicles.length} vehicles found`
                    : `${filteredVehicles.length}台の車両が見つかりました`}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 font-medium">{language === "en" ? "Sort by:" : "並び順:"}</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-44">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">{language === "en" ? "Newest First" : "新着順"}</SelectItem>
                    <SelectItem value="price_low">
                      {language === "en" ? "Price: Low to High" : "価格: 安い順"}
                    </SelectItem>
                    <SelectItem value="price_high">
                      {language === "en" ? "Price: High to Low" : "価格: 高い順"}
                    </SelectItem>
                    <SelectItem value="year_new">
                      {language === "en" ? "Year: Newest First" : "年式: 新しい順"}
                    </SelectItem>
                    <SelectItem value="mileage_low">
                      {language === "en" ? "Mileage: Low to High" : "走行距離: 少ない順"}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Vehicle Cards */}
            {currentVehicles.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-4">
                  <Search className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {language === "en" ? "No vehicles found" : "車両が見つかりません"}
                </h3>
                <p className="text-gray-600 mb-6">
                  {language === "en"
                    ? "Try adjusting your search criteria or filters"
                    : "検索条件やフィルターを調整してみてください"}
                </p>
                <Button onClick={clearFilters} variant="outline">
                  {language === "en" ? "Clear Filters" : "フィルターをクリア"}
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {currentVehicles.map((vehicle) => (
                  <VehicleCardLarge key={vehicle.id} vehicle={vehicle} language={language} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-10">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  {language === "en" ? "Previous" : "前へ"}
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum =
                      currentPage <= 3
                        ? i + 1
                        : currentPage >= totalPages - 2
                          ? totalPages - 4 + i
                          : currentPage - 2 + i

                    if (pageNum < 1 || pageNum > totalPages) return null

                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className="w-10"
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>

                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  {language === "en" ? "Next" : "次へ"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Enhanced Large Vehicle Card Component
function VehicleCardLarge({ vehicle, language }: { vehicle: Vehicle; language: string }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)

  // Use the properly mapped images array
  const allImages =
    vehicle.images && vehicle.images.length > 0
      ? vehicle.images
      : [vehicle.imageUrl || "/placeholder.svg?height=400&width=600&text=Vehicle+Image"]

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(language === "en" ? "en-US" : "ja-JP", {
      style: "currency",
      currency: "JPY",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat(language === "en" ? "en-US" : "ja-JP").format(mileage)
  }

  const getVerificationBadge = () => {
    if (vehicle.listingType === "seller") {
      const sellerVehicle = vehicle as SellerListing
      if (sellerVehicle.verificationLevel === "verified_dealer") {
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200 text-xs font-medium">
            <Shield className="h-3 w-3 mr-1" />
            {language === "en" ? "Verified Dealer" : "認証ディーラー"}
          </Badge>
        )
      } else if (sellerVehicle.verificationLevel === "verified_private_seller") {
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs font-medium">
            <CheckCircle className="h-3 w-3 mr-1" />
            {language === "en" ? "Verified Private Seller" : "認証個人販売者"}
          </Badge>
        )
      }
    }

    if (vehicle.isVerified) {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200 text-xs font-medium">
          <User className="h-3 w-3 mr-1" />
          {language === "en" ? "Verified User" : "認証ユーザー"}
        </Badge>
      )
    }

    return null
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 bg-white border border-gray-200">
      <div className="flex">
        {/* Left Side - Images */}
        <div className="w-1/2">
          {/* Main Image */}
          <div className="relative h-80 bg-gray-100 group">
            <Image
              src={allImages[currentImageIndex] || "/placeholder.svg?height=400&width=600&text=Vehicle+Image"}
              alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />

            {/* Verification Badges */}
            <div className="absolute top-3 left-3 flex gap-2">
              {vehicle.isVehicleVerified && (
                <div className="bg-green-500 text-white rounded-full p-2 shadow-sm">
                  <CheckCircle className="h-4 w-4" />
                </div>
              )}
              {vehicle.hasAppraisal && (
                <div className="bg-blue-500 text-white rounded-full p-2 text-xs font-bold shadow-sm">3</div>
              )}
              <div className="bg-blue-500 text-white rounded-full p-2 shadow-sm">
                <Shield className="h-4 w-4" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="absolute top-3 right-3 flex gap-2">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`p-2 rounded-full transition-colors shadow-sm ${
                  isLiked ? "bg-red-500 text-white" : "bg-white/95 hover:bg-white text-gray-700"
                }`}
              >
                <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
              </button>
              <button className="p-2 rounded-full bg-white/95 hover:bg-white text-gray-700 transition-colors shadow-sm">
                <Share2 className="h-4 w-4" />
              </button>
            </div>

            {/* Image Navigation */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {allImages.length > 1 && (
            <div className="p-3 bg-gray-50 border-t">
              <div className="flex gap-2 overflow-x-auto">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative flex-shrink-0 w-16 h-12 rounded overflow-hidden border-2 transition-colors ${
                      index === currentImageIndex ? "border-placebo-gold" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src={image || "/placeholder.svg?height=48&width=64&text=Thumb"}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side - Content */}
        <div className="w-1/2">
          <CardContent className="p-6 h-full flex flex-col">
            {/* Title and Price */}
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {vehicle.make} {vehicle.model} {vehicle.bodyType}
              </h3>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-2xl font-bold text-placebo-gold">{formatPrice(vehicle.askingPrice)}</span>
                {vehicle.hasAppraisal && vehicle.appraisedValue && (
                  <span className="text-sm text-gray-600">
                    {language === "en" ? "Appraised at:" : "査定額:"} {formatPrice(vehicle.appraisedValue)}
                  </span>
                )}
              </div>
              {getVerificationBadge()}
            </div>

            {/* Vehicle Specs Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="font-medium">{vehicle.year}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Gauge className="h-4 w-4 text-gray-400" />
                <span className="font-medium">{formatMileage(vehicle.mileage)} km</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Fuel className="h-4 w-4 text-gray-400" />
                <span className="font-medium">{vehicle.fuelType}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Settings className="h-4 w-4 text-gray-400" />
                <span className="font-medium">{vehicle.transmission}</span>
              </div>
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-3 gap-3 mb-4 text-xs">
              <div>
                <span className="font-medium text-gray-700">{language === "en" ? "Color:" : "色:"}</span>
                <div className="text-gray-600 font-medium">{vehicle.color}</div>
              </div>
              <div>
                <span className="font-medium text-gray-700">{language === "en" ? "Body:" : "ボディ:"}</span>
                <div className="text-gray-600 font-medium">{vehicle.bodyType}</div>
              </div>
              <div>
                <span className="font-medium text-gray-700">{language === "en" ? "Condition:" : "状態:"}</span>
                <div className="text-gray-600 font-medium">{language === "en" ? "Excellent" : "優良"}</div>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-gray-600 mb-4 text-sm">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="font-medium">{vehicle.location}</span>
            </div>

            {/* Key Features */}
            {vehicle.features && vehicle.features.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2 text-sm">
                  {language === "en" ? "Key Features" : "主な機能"}
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {vehicle.features.slice(0, 3).map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-xs px-2 py-1">
                      {feature}
                    </Badge>
                  ))}
                  {vehicle.features.length > 3 && (
                    <Badge variant="secondary" className="text-xs px-2 py-1">
                      +{vehicle.features.length - 3} {language === "en" ? "more" : "その他"}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Services */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-2 text-sm">{language === "en" ? "Services" : "サービス"}</h4>
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="outline" className="text-xs px-2 py-1">
                  {language === "en" ? "Financing Available" : "融資利用可能"}
                </Badge>
                <Badge variant="outline" className="text-xs px-2 py-1">
                  {language === "en" ? "Trade-in Accepted" : "下取り可能"}
                </Badge>
                <Badge variant="outline" className="text-xs px-2 py-1">
                  +2 {language === "en" ? "more" : "その他"}
                </Badge>
              </div>
            </div>

            {/* View Details Button */}
            <div className="mt-auto">
              <Link href={`/cars/${vehicle.id}`}>
                <Button className="w-full bg-placebo-gold hover:bg-placebo-gold/90 text-placebo-black font-medium py-2.5 text-sm">
                  {language === "en" ? "View Details" : "詳細を見る"}
                </Button>
              </Link>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  )
}
