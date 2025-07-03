"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  MapPin,
  Calendar,
  Gauge,
  Fuel,
  Settings,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Heart,
  Share2,
  Shield,
  CheckCircle,
  User,
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import InspectionBadge from "./inspection-badge"
import AppraisalBadge from "./appraisal-badge"
import VerificationBadge from "./verification-badge"

interface VehicleImage {
  url: string
  type: "Interior" | "Exterior" | "Engine" | "Features"
  caption: string
}

interface VehicleCardProps {
  id: string
  title: string
  price: number
  year: number
  mileage: number
  location: string
  imageUrl: string
  additionalImages?: VehicleImage[]
  isVerified: boolean
  isVehicleVerified: boolean
  verificationLevel?: "dealership" | "private_seller" | "user"
  make: string
  model: string
  color: string
  fuelType: string
  transmission: string
  engine: string
  bodyType: string
  doors: number
  seats: number
  condition: string
  features: string[]
  sellerType: string
  servicesOffered: string[]
  inspectionLevel?: "basic" | "premium" | "comprehensive"
  inspectionDate?: string
  expiryDate?: string
  hasAppraisal?: boolean
  appraisalDate?: string
  appraisedValue?: number
  appraisalReportType?: "basic" | "premium" | "comprehensive"
  description?: string
  showVehicleVerificationBadge?: boolean
  vehicleVerificationStatus?: "verified" | "unverified"
}

export default function VehicleCard({
  id,
  title,
  price,
  year,
  mileage,
  location,
  imageUrl,
  additionalImages = [],
  isVerified,
  isVehicleVerified,
  verificationLevel,
  make,
  model,
  color,
  fuelType,
  transmission,
  engine,
  bodyType,
  doors,
  seats,
  condition,
  features,
  sellerType,
  servicesOffered,
  inspectionLevel,
  inspectionDate,
  expiryDate,
  hasAppraisal,
  appraisalDate,
  appraisedValue,
  appraisalReportType,
  description,
  showVehicleVerificationBadge,
  vehicleVerificationStatus,
}: VehicleCardProps) {
  const { language } = useLanguage()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)

  // Combine main image with additional images for carousel
  const allImages = [{ url: imageUrl, type: "Exterior" as const, caption: "Main view" }, ...additionalImages]

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

  const getSellerTypeDisplay = (type: string) => {
    switch (type) {
      case "Verified Dealer":
        return language === "en" ? "Verified Dealer" : "認証ディーラー"
      case "Private Seller":
        return language === "en" ? "Private Seller" : "個人売主"
      case "Unverified Private Seller":
        return language === "en" ? "Unverified Private Seller" : "未認証個人売主"
      case "Guest Listing":
        return language === "en" ? "Guest Listing" : "ゲスト出品"
      default:
        return type
    }
  }

  const getSellerTypeColor = (type: string) => {
    switch (type) {
      case "Verified Dealer":
        return "bg-green-100 text-green-800 border-green-200"
      case "Private Seller":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Unverified Private Seller":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "Guest Listing":
        return "bg-placebo-gold/20 text-placebo-black border-placebo-gold/30"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-white border border-gray-200">
      <div className="flex">
        {/* Left Side - Images */}
        <div className="w-1/2">
          {/* Main Image */}
          <div className="relative h-48 bg-gray-100">
            <Image
              src={allImages[currentImageIndex]?.url || imageUrl}
              alt={`${title} - ${allImages[currentImageIndex]?.caption || "Vehicle image"}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Image Navigation */}
            {allImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </>
            )}

            {/* Action Buttons */}
            <div className="absolute top-3 right-3 flex gap-2">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`p-2 rounded-full transition-colors ${
                  isLiked ? "bg-red-500 text-white" : "bg-white/90 hover:bg-white text-gray-700"
                }`}
                aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
              >
                <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
              </button>
              <button
                className="p-2 rounded-full bg-white/90 hover:bg-white text-gray-700 transition-colors"
                aria-label="Share vehicle"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>

            {/* Verification Badges */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-2">
              {showVehicleVerificationBadge && vehicleVerificationStatus === "verified" && (
                <VerificationBadge
                  type="vehicle"
                  status="verified"
                  language={language}
                  size="sm"
                  iconOnly={true}
                  className="bg-green-500/90 text-white border-green-600"
                />
              )}
              {isVehicleVerified && inspectionLevel && (
                <InspectionBadge
                  level={inspectionLevel}
                  language={language}
                  inspectionDate={inspectionDate}
                  expiryDate={expiryDate}
                  size="sm"
                  iconOnly={true}
                />
              )}
              {hasAppraisal && appraisalReportType && (
                <AppraisalBadge
                  hasAppraisal={hasAppraisal}
                  reportType={appraisalReportType}
                  language={language}
                  appraisalDate={appraisalDate}
                  appraisedValue={appraisedValue}
                  size="sm"
                  iconOnly={true}
                />
              )}
            </div>
          </div>

          {/* Image Gallery */}
          {allImages.length > 1 && (
            <div className="p-2 bg-gray-50">
              <div className="flex gap-1 overflow-x-auto">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative flex-shrink-0 w-16 h-12 rounded overflow-hidden border-2 transition-colors ${
                      index === currentImageIndex ? "border-placebo-gold" : "border-gray-200"
                    }`}
                  >
                    <Image
                      src={image.url || "/placeholder.svg"}
                      alt={image.caption}
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
          <CardContent className="p-4 h-full flex flex-col">
            {/* Title and Price */}
            <div className="mb-3">
              <h3 className="text-xl font-bold text-placebo-black mb-1">{title}</h3>
              <p className="text-2xl font-bold text-placebo-gold">{formatPrice(price)}</p>
              {hasAppraisal && appraisedValue && appraisedValue !== price && (
                <p className="text-sm text-gray-600">
                  {language === "en" ? "Appraised at" : "査定額"}: {formatPrice(appraisedValue)}
                </p>
              )}
            </div>

            {/* Seller Verification Badge */}
            <div className="flex items-center gap-2 mb-3">
              {verificationLevel === "dealership" && (
                <Badge className="bg-green-100 text-green-800 border-green-200 font-medium">
                  <Shield className="h-3 w-3 mr-1" />
                  {language === "en" ? "Verified Dealer" : "認証ディーラー"}
                </Badge>
              )}
              {verificationLevel === "private_seller" && (
                <Badge className="bg-blue-100 text-blue-800 border-blue-200 font-medium">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {language === "en" ? "Verified Private Seller" : "認証個人売主"}
                </Badge>
              )}
              {verificationLevel === "user" && (
                <Badge className="bg-placebo-gold/20 text-placebo-black border-placebo-gold/30 font-medium">
                  <User className="h-3 w-3 mr-1" />
                  {language === "en" ? "Guest Listing" : "ゲスト出品"}
                </Badge>
              )}
              {!verificationLevel && sellerType === "Unverified Private Seller" && (
                <Badge className="bg-orange-100 text-orange-800 border-orange-200 font-medium">
                  <User className="h-3 w-3 mr-1" />
                  {language === "en" ? "Unverified Private Seller" : "未認証個人売主"}
                </Badge>
              )}
            </div>

            {/* Vehicle Details */}
            <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>{year}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Gauge className="h-4 w-4" />
                <span>{formatMileage(mileage)} km</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Fuel className="h-4 w-4" />
                <span>{fuelType}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Settings className="h-4 w-4" />
                <span>{transmission}</span>
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-3 gap-4 mb-3 text-sm text-gray-600">
              <div>
                <span className="font-medium">{language === "en" ? "Color" : "色"}:</span>
                <br />
                {color}
              </div>
              <div>
                <span className="font-medium">{language === "en" ? "Body" : "ボディ"}:</span>
                <br />
                {bodyType}
              </div>
              <div>
                <span className="font-medium">{language === "en" ? "Condition" : "状態"}:</span>
                <br />
                {condition}
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-gray-600 mb-3">
              <MapPin className="h-4 w-4" />
              <span>{location}</span>
            </div>

            {/* Features */}
            {features.length > 0 && (
              <div className="mb-3">
                <h4 className="font-medium text-placebo-black mb-2">
                  {language === "en" ? "Key Features" : "主な機能"}
                </h4>
                <div className="flex flex-wrap gap-1">
                  {features.slice(0, 3).map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                  {features.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{features.length - 3} {language === "en" ? "more" : "その他"}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Services Offered */}
            {servicesOffered.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium text-placebo-black mb-2">{language === "en" ? "Services" : "サービス"}</h4>
                <div className="flex flex-wrap gap-1">
                  {servicesOffered.slice(0, 2).map((service, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {service}
                    </Badge>
                  ))}
                  {servicesOffered.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{servicesOffered.length - 2} {language === "en" ? "more" : "その他"}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mt-auto">
              <Link href={`/cars/${id}`} className="flex-1">
                <Button className="w-full bg-placebo-gold hover:bg-placebo-gold/90 text-placebo-black font-medium">
                  {language === "en" ? "View Details" : "詳細を見る"}
                </Button>
              </Link>
              <Button variant="outline" size="icon" className="shrink-0 bg-transparent">
                <MessageCircle className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  )
}
