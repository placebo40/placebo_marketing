"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  MapPin,
  Phone,
  Mail,
  Car,
  Fuel,
  Gauge,
  Users,
  Shield,
  Award,
  MessageCircle,
  CalendarCheck,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import SendMessageModal from "@/components/send-message-modal"
import TestDriveModal from "@/components/test-drive-modal"
import VerificationBadge from "@/components/verification-badge"
import InspectionBadge from "@/components/inspection-badge"
import AppraisalBadge from "@/components/appraisal-badge"

// Mock data - in a real app, this would come from an API
const vehicleData = {
  id: "1",
  make: "Toyota",
  model: "Aqua",
  year: 2019,
  price: 1250000,
  mileage: 45000,
  fuelType: "Hybrid",
  transmission: "CVT",
  seatingCapacity: 5,
  color: "Pearl White",
  location: "Naha, Okinawa",
  description:
    "Excellent condition Toyota Aqua hybrid. Perfect for Okinawa driving with great fuel economy. Well maintained with complete service history. Non-smoking vehicle.",
  features: [
    "Hybrid Engine",
    "CVT Transmission",
    "Air Conditioning",
    "Power Steering",
    "Electric Windows",
    "Central Locking",
    "ABS Brakes",
    "Airbags",
    "Navigation System",
    "Backup Camera",
  ],
  images: [
    "/images/toyota-aqua-hybrid-okinawa.png",
    "/images/vehicle-front-angle.jpg",
    "/images/vehicle-side-profile.jpg",
    "/images/vehicle-interior.jpg",
  ],
  seller: {
    name: "Tanaka Hiroshi",
    email: "tanaka@example.com",
    phone: "+81-90-1234-5678",
    rating: 4.8,
    reviewCount: 23,
    memberSince: "2020",
    isVerified: true,
    responseTime: "Usually responds within 2 hours",
  },
  verification: {
    isVerified: true,
    verifiedDate: "2024-01-15",
    verificationLevel: "premium" as const,
  },
  inspection: {
    isInspected: true,
    inspectionDate: "2024-01-10",
    inspectionScore: 8.5,
    reportUrl: "/inspection-report-1.pdf",
  },
  appraisal: {
    isAppraised: true,
    appraisalDate: "2024-01-12",
    appraisalValue: 1300000,
    reportUrl: "/appraisal-report-1.pdf",
  },
}

export default function VehicleDetailPage() {
  const { isAuthenticated } = useAuth()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false)
  const [isTestDriveModalOpen, setIsTestDriveModalOpen] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % vehicleData.images.length)
  }

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + vehicleData.images.length) % vehicleData.images.length)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${vehicleData.year} ${vehicleData.make} ${vehicleData.model}`,
          text: `Check out this ${vehicleData.year} ${vehicleData.make} ${vehicleData.model} for ¥${vehicleData.price.toLocaleString()}`,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  // Prepare vehicle data for TestDriveModal
  const testDriveVehicleData = {
    id: vehicleData.id,
    make: vehicleData.make,
    model: vehicleData.model,
    year: vehicleData.year,
    price: vehicleData.price,
    seller: {
      name: vehicleData.seller.name,
      email: vehicleData.seller.email,
      phone: vehicleData.seller.phone,
    },
  }

  // Prepare vehicle data for SendMessageModal
  const messageVehicleData = {
    id: vehicleData.id,
    make: vehicleData.make,
    model: vehicleData.model,
    year: vehicleData.year,
    price: vehicleData.price,
    seller: vehicleData.seller,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link href="/cars" className="inline-flex items-center text-placebo-gold hover:text-placebo-gold/80">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Listings
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card>
              <CardContent className="p-0">
                <div className="relative">
                  <div className="aspect-video relative overflow-hidden rounded-t-lg">
                    <Image
                      src={vehicleData.images[currentImageIndex] || "/placeholder.svg"}
                      alt={`${vehicleData.make} ${vehicleData.model}`}
                      fill
                      className="object-cover"
                    />

                    {/* Navigation Arrows */}
                    {vehicleData.images.length > 1 && (
                      <>
                        <button
                          onClick={previousImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </>
                    )}

                    {/* Image Counter */}
                    <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {vehicleData.images.length}
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button
                        onClick={() => setIsFavorited(!isFavorited)}
                        className={`p-2 rounded-full transition-colors ${
                          isFavorited ? "bg-red-500 text-white" : "bg-white/90 text-gray-700 hover:bg-white"
                        }`}
                      >
                        <Heart className={`h-5 w-5 ${isFavorited ? "fill-current" : ""}`} />
                      </button>
                      <button
                        onClick={handleShare}
                        className="p-2 rounded-full bg-white/90 text-gray-700 hover:bg-white transition-colors"
                      >
                        <Share2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Thumbnail Strip */}
                  {vehicleData.images.length > 1 && (
                    <div className="flex gap-2 p-4 overflow-x-auto">
                      {vehicleData.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                            index === currentImageIndex
                              ? "border-placebo-gold"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <Image
                            src={image || "/placeholder.svg"}
                            alt={`${vehicleData.make} ${vehicleData.model} ${index + 1}`}
                            width={80}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Vehicle Details */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">
                      {vehicleData.year} {vehicleData.make} {vehicleData.model}
                    </CardTitle>
                    <p className="text-3xl font-bold text-placebo-gold mt-2">¥{vehicleData.price.toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <VerificationBadge
                      isVerified={vehicleData.verification.isVerified}
                      level={vehicleData.verification.verificationLevel}
                    />
                    <InspectionBadge
                      isInspected={vehicleData.inspection.isInspected}
                      score={vehicleData.inspection.inspectionScore}
                    />
                    <AppraisalBadge
                      isAppraised={vehicleData.appraisal.isAppraised}
                      value={vehicleData.appraisal.appraisalValue}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Key Specifications */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <Gauge className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Mileage</p>
                      <p className="font-semibold">{vehicleData.mileage.toLocaleString()} km</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Fuel className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Fuel Type</p>
                      <p className="font-semibold">{vehicleData.fuelType}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Car className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Transmission</p>
                      <p className="font-semibold">{vehicleData.transmission}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Seating</p>
                      <p className="font-semibold">{vehicleData.seatingCapacity} seats</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{vehicleData.description}</p>
                </div>

                <Separator />

                {/* Features */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Features & Equipment</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {vehicleData.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="justify-start">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Location */}
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-700">{vehicleData.location}</span>
                </div>
              </CardContent>
            </Card>

            {/* Verification & Reports */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {vehicleData.verification.isVerified && (
                <Card>
                  <CardContent className="p-4 text-center">
                    <Shield className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <h4 className="font-semibold">Verified Vehicle</h4>
                    <p className="text-sm text-gray-600">
                      Verified on {new Date(vehicleData.verification.verifiedDate).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              )}

              {vehicleData.inspection.isInspected && (
                <Card>
                  <CardContent className="p-4 text-center">
                    <Award className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <h4 className="font-semibold">Professional Inspection</h4>
                    <p className="text-sm text-gray-600">Score: {vehicleData.inspection.inspectionScore}/10</p>
                    <Button variant="link" size="sm" className="p-0 h-auto">
                      View Report
                    </Button>
                  </CardContent>
                </Card>
              )}

              {vehicleData.appraisal.isAppraised && (
                <Card>
                  <CardContent className="p-4 text-center">
                    <Award className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                    <h4 className="font-semibold">Professional Appraisal</h4>
                    <p className="text-sm text-gray-600">
                      Value: ¥{vehicleData.appraisal.appraisalValue.toLocaleString()}
                    </p>
                    <Button variant="link" size="sm" className="p-0 h-auto">
                      View Report
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Seller Information */}
            <Card>
              <CardHeader>
                <CardTitle>Seller Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{vehicleData.seller.name}</h4>
                    <div className="flex items-center gap-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-sm ${
                              i < Math.floor(vehicleData.seller.rating) ? "text-yellow-400" : "text-gray-300"
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {vehicleData.seller.rating} ({vehicleData.seller.reviewCount} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <p>Member since {vehicleData.seller.memberSince}</p>
                  <p>{vehicleData.seller.responseTime}</p>
                  {vehicleData.seller.isVerified && (
                    <div className="flex items-center gap-1">
                      <Shield className="h-4 w-4 text-green-500" />
                      <span className="text-green-600">Verified Seller</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span>{vehicleData.seller.email}</span>
                  </div>
                  {vehicleData.seller.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>{vehicleData.seller.phone}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Contact Actions */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <Button
                  onClick={() => setIsTestDriveModalOpen(true)}
                  className="w-full bg-placebo-gold hover:bg-placebo-gold/90 text-white"
                  disabled={!isAuthenticated}
                >
                  <CalendarCheck className="h-4 w-4 mr-2" />
                  Schedule Test Drive
                </Button>

                <Button
                  onClick={() => setIsMessageModalOpen(true)}
                  variant="outline"
                  className="w-full"
                  disabled={!isAuthenticated}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Send Message
                </Button>

                {!isAuthenticated && (
                  <p className="text-sm text-gray-500 text-center">
                    <Link href="/login" className="text-placebo-gold hover:underline">
                      Sign in
                    </Link>{" "}
                    to contact the seller
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Color</span>
                  <span className="font-medium">{vehicleData.color}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Year</span>
                  <span className="font-medium">{vehicleData.year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mileage</span>
                  <span className="font-medium">{vehicleData.mileage.toLocaleString()} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fuel Type</span>
                  <span className="font-medium">{vehicleData.fuelType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transmission</span>
                  <span className="font-medium">{vehicleData.transmission}</span>
                </div>
              </CardContent>
            </Card>

            {/* Safety Notice */}
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  <Shield className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-amber-800">Safety Tips</h4>
                    <ul className="text-sm text-amber-700 mt-2 space-y-1">
                      <li>• Meet in a public place</li>
                      <li>• Bring a friend if possible</li>
                      <li>• Verify seller identity</li>
                      <li>• Inspect the vehicle thoroughly</li>
                      <li>• Check all documentation</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modals */}
      <SendMessageModal
        isOpen={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        vehicle={messageVehicleData}
      />

      <TestDriveModal
        isOpen={isTestDriveModalOpen}
        onClose={() => setIsTestDriveModalOpen(false)}
        vehicle={testDriveVehicleData}
      />
    </div>
  )
}
