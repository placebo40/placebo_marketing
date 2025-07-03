"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  CheckCircle,
  Clock,
  Shield,
  Calendar,
  Phone,
  Mail,
  ArrowLeft,
  Eye,
  MessageSquare,
  Settings,
} from "lucide-react"
import { getGuestListings } from "@/lib/guest-listings"

// Vehicle data fetching function (simplified version)
const getVehicleData = (id: string) => {
  if (id.startsWith("guest_")) {
    const guestListings = getGuestListings()
    const guestListing = guestListings.find((listing) => listing.id === id)

    if (guestListing) {
      return {
        id: guestListing.id,
        title: `${guestListing.year} ${guestListing.make} ${guestListing.model}`,
        price: guestListing.marketAskingPrice, // Use marketAskingPrice instead of price
        year: guestListing.year,
        mileage: guestListing.mileage,
        location: "Okinawa, Japan", // Default location for guest listings
        images: guestListing.photos || ["/car-listing-photo.png"], // Use photos instead of images
        make: guestListing.make,
        model: guestListing.model,
      }
    }
  }

  // Regular mock vehicle data for non-guest listings
  const vehicles: { [key: string]: any } = {
    "1": {
      id: "1",
      title: "2019 Toyota Aqua Hybrid",
      price: 1250000,
      year: 2019,
      mileage: 45000,
      location: "Naha, Okinawa",
      images: ["/images/compact-car-daylight.jpg"],
      make: "Toyota",
      model: "Aqua",
    },
    "2": {
      id: "2",
      title: "2018 Honda Fit RS",
      price: 980000,
      year: 2018,
      mileage: 62000,
      location: "Ginowan, Okinawa",
      images: ["/images/honda-fit-clean.jpg"],
      make: "Honda",
      model: "Fit",
    },
  }
  return vehicles[id] || null
}

export default function VehicleVerificationConfirmationPage() {
  const { language } = useLanguage()
  const params = useParams()
  const [vehicle, setVehicle] = useState<any>(null)

  const vehicleId = params.id as string

  useEffect(() => {
    // Update localStorage to indicate vehicle verification is pending
    localStorage.setItem(`vehicleVerificationStatus_${vehicleId}`, "pending")

    // Fetch vehicle data
    const vehicleData = getVehicleData(vehicleId)
    setVehicle(vehicleData)
  }, [vehicleId])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(language === "en" ? "en-US" : "ja-JP", {
      style: "currency",
      currency: "JPY",
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatMileage = (mileage: string | number) => {
    const mileageNum = typeof mileage === "string" ? Number.parseInt(mileage) : mileage
    return new Intl.NumberFormat(language === "en" ? "en-US" : "ja-JP").format(mileageNum) + " km"
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-2xl mx-auto px-4">
        <Card className="border-none shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto bg-green-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold">
              {language === "en" ? "Vehicle Verification Submitted" : "車両認証が送信されました"}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Vehicle Information Display */}
            {vehicle && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-800 mb-3">
                  {language === "en" ? "Vehicle Submitted for Verification" : "認証に提出された車両"}
                </h3>
                <div className="flex gap-4">
                  <div className="relative w-32 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 border">
                    <Image
                      src={vehicle.images?.[0] || "/car-listing-photo.png"}
                      alt={vehicle.title}
                      fill
                      className="object-cover"
                      sizes="128px"
                      priority
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">{vehicle.title}</h4>
                    <div className="space-y-1">
                      <p className="text-lg font-bold text-placebo-gold">{formatPrice(vehicle.price)}</p>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <span>{vehicle.year}</span> • <span>{formatMileage(vehicle.mileage)}</span> •{" "}
                        <span>{vehicle.location}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="text-center">
              <p className="text-gray-600">
                {language === "en"
                  ? "Thank you for submitting your vehicle verification request. Our certified team will review your submission and schedule any required inspections."
                  : "車両認証リクエストをご提出いただきありがとうございます。認定チームがあなたの提出物を確認し、必要な検査をスケジュールします。"}
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3 text-left">
              <Clock className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-blue-800">
                  {language === "en" ? "What Happens Next?" : "次に何が起こりますか？"}
                </h3>
                <ul className="text-sm text-blue-700 mt-2 space-y-1">
                  <li>• {language === "en" ? "Document review (1 business day)" : "書類審査（1営業日）"}</li>
                  <li>
                    •{" "}
                    {language === "en" ? "Inspection scheduling (if selected)" : "検査スケジューリング（選択した場合）"}
                  </li>
                  <li>• {language === "en" ? "Physical inspection (2-3 business days)" : "物理検査（2〜3営業日）"}</li>
                  <li>• {language === "en" ? "Verification completion & badge issuance" : "認証完了とバッジ発行"}</li>
                </ul>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3 text-left">
              <Shield className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-amber-800">
                  {language === "en" ? "Verification Benefits" : "認証の利点"}
                </h3>
                <ul className="text-sm text-amber-700 mt-2 space-y-1">
                  <li>• {language === "en" ? "Verified vehicle badge on your listing" : "出品に認証済み車両バッジ"}</li>
                  <li>• {language === "en" ? "Higher search ranking priority" : "検索ランキングの優先度向上"}</li>
                  <li>
                    • {language === "en" ? "Increased buyer trust and inquiries" : "購入者の信頼と問い合わせの増加"}
                  </li>
                  <li>• {language === "en" ? "Professional verification report" : "プロの認証レポート"}</li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-left">
              <h3 className="font-medium text-gray-800 mb-2">
                {language === "en" ? "Contact Information" : "連絡先情報"}
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>+81-98-XXX-XXXX</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>verification@placebo.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{language === "en" ? "Mon-Fri 9:00-18:00 JST" : "月〜金 9:00-18:00 JST"}</span>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 pt-6">
            <div className="w-full space-y-3">
              <Button asChild className="w-full bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90">
                <Link href={`/cars/${vehicleId}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  {language === "en" ? "View Vehicle Listing" : "車両リストを見る"}
                </Link>
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" asChild>
                  <Link href="/guest-dashboard?tab=listings">
                    <Settings className="h-4 w-4 mr-2" />
                    {language === "en" ? "My Dashboard" : "マイダッシュボード"}
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/guest-dashboard?tab=messages">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    {language === "en" ? "Messages" : "メッセージ"}
                  </Link>
                </Button>
              </div>

              <Button variant="ghost" asChild className="w-full">
                <Link href="/cars" className="flex items-center justify-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  {language === "en" ? "Browse More Vehicles" : "他の車両を閲覧"}
                </Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
