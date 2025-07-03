"use client"

import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { MapPin, CheckCircle, Shield, Users, Building2 } from "lucide-react"
import InspectionBadge, { type InspectionLevel } from "./inspection-badge"
import VerificationBadge, { type VerificationLevel } from "./verification-badge"

const featuredVehicles = [
  {
    id: "1",
    title: "Toyota Aqua Hybrid",
    price: 1250000,
    year: 2019,
    mileage: 45000,
    location: "Naha, Okinawa",
    imageUrl: "/images/toyota-aqua-hybrid-okinawa.png",
    inspectionLevel: "premium" as InspectionLevel,
    inspectionDate: "2024-12-01",
    expiryDate: "2025-12-01",
    vehicleVerification: "verified" as VerificationLevel,
  },
  {
    id: "2",
    title: "Honda Fit RS",
    price: 980000,
    year: 2018,
    mileage: 62000,
    location: "Ginowan, Okinawa",
    imageUrl: "/images/honda-fit-rs-okinawa.png",
    inspectionLevel: "comprehensive" as InspectionLevel,
    inspectionDate: "2024-11-15",
    expiryDate: "2025-11-15",
    vehicleVerification: "verified" as VerificationLevel,
  },
  {
    id: "3",
    title: "Nissan Note e-Power",
    price: 1450000,
    year: 2020,
    mileage: 28000,
    location: "Urasoe, Okinawa",
    imageUrl: "/images/nissan-note-epower-okinawa.png",
    inspectionLevel: "basic" as InspectionLevel,
    inspectionDate: "2024-10-20",
    expiryDate: "2025-10-20",
    vehicleVerification: "verified" as VerificationLevel,
  },
]

const trustStats = [
  { number: "500+", label: "Verified Vehicles", labelJa: "認証済み車両" },
  { number: "98%", label: "KYC Completion Rate", labelJa: "KYC完了率" },
  { number: "24/7", label: "Trust & Safety", labelJa: "信頼・安全サポート" },
]

const verificationProcess = [
  {
    icon: Users,
    title: { en: "User Verification", ja: "ユーザー認証" },
    description: { en: "KYC process for all users", ja: "全ユーザーのKYC" },
  },
  {
    icon: Shield,
    title: { en: "Seller Screening", ja: "販売者審査" },
    description: { en: "Background checks & credentials", ja: "身元調査・資格確認" },
  },
  {
    icon: Building2,
    title: { en: "Dealership Licensing", ja: "ディーラー免許" },
    description: { en: "Licensed dealer verification", ja: "認定ディーラー確認" },
  },
  {
    icon: CheckCircle,
    title: { en: "Vehicle Authentication", ja: "車両認証" },
    description: { en: "Document & history verification", ja: "書類・履歴確認" },
  },
]

export default function HeroSection() {
  const { t, language } = useLanguage()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Auto-rotate carousel
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredVehicles.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredVehicles.length)
    setIsAutoPlaying(false)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredVehicles.length) % featuredVehicles.length)
    setIsAutoPlaying(false)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const currentVehicle = featuredVehicles[currentSlide]

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-placebo-white via-gray-50 to-gray-100">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fillRule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23000000&quot; fillOpacity=&quot;0.1&quot;%3E%3Ccircle cx=&quot;30&quot; cy=&quot;30&quot; r=&quot;2&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
      </div>

      <div className="container relative z-10 py-12 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Trust Badge */}
            <div className="flex items-center gap-2">
              <Badge className="bg-placebo-gold/10 text-placebo-black border-placebo-gold/20 hover:bg-placebo-gold/20">
                <Shield className="w-3 h-3 mr-1" />
                {language === "en"
                  ? "Okinawa's Most Trusted Car Marketplace"
                  : "沖縄で最も信頼される車のマーケットプレイス"}
              </Badge>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-placebo-black leading-tight">
                {language === "en" ? (
                  <>
                    Find Your Car
                    <span className="block text-placebo-gold">with Complete Confidence</span>
                  </>
                ) : (
                  <>
                    認証済みの理想の車を見つけよう
                    <span className="block text-placebo-gold">完全な安心とともに</span>
                  </>
                )}
              </h1>

              <p className="text-lg md:text-xl text-placebo-dark-gray max-w-lg leading-relaxed">
                {language === "en"
                  ? "Browse quality vehicles that have been thoroughly inspected and verified. Whether you're buying or selling, we make car transactions simple, safe, and stress-free."
                  : "徹底的に点検・認証された高品質な車両をご覧ください。購入でも販売でも、車の取引をシンプル、安全、そしてストレスフリーにします。"}
              </p>
            </div>

            {/* Verification Process Preview */}
            <div className="space-y-4">
              <p className="text-sm font-semibold text-placebo-dark-gray uppercase tracking-wide">
                {language === "en" ? "Why Choose Us" : "選ばれる理由"}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {verificationProcess.map((process, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200">
                    <process.icon className="w-5 h-5 text-placebo-gold flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs sm:text-sm font-medium text-placebo-black leading-tight">
                        {process.title[language] || process.title.en}
                      </div>
                      <div className="text-xs text-placebo-dark-gray leading-tight">
                        {process.description[language] || process.description.en}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90 font-semibold px-8 py-3 text-base"
              >
                <Link href="/cars">{language === "en" ? "Browse Vehicles" : "車を探す"}</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-placebo-black text-placebo-black hover:bg-placebo-black hover:text-placebo-white px-8 py-3 text-base bg-transparent"
              >
                <Link href="/request-listing">{language === "en" ? "Sell Your Car" : "車を売る"}</Link>
              </Button>
            </div>

            {/* Trust Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
              {trustStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-placebo-black">{stat.number}</div>
                  <div className="text-xs md:text-sm text-placebo-dark-gray">
                    {language === "en" ? stat.label : stat.labelJa}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Vehicle Carousel with Verification */}
          <div className="relative">
            <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
              {/* Vehicle Image */}
              <div className="relative h-64 md:h-80 lg:h-96">
                <Image
                  src={currentVehicle.imageUrl || "/placeholder.svg"}
                  alt={currentVehicle.title}
                  fill
                  className="object-cover transition-all duration-500"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Verification Badges Overlay */}
                <div className="absolute top-4 left-4 flex flex-row gap-3">
                  <InspectionBadge
                    level={currentVehicle.inspectionLevel}
                    language={language}
                    size="sm"
                    inspectionDate={currentVehicle.inspectionDate}
                    expiryDate={currentVehicle.expiryDate}
                  />
                  <VerificationBadge
                    type="vehicle"
                    status={currentVehicle.vehicleVerification}
                    language={language}
                    size="sm"
                    showTooltip={true}
                  />
                </div>
              </div>

              {/* Vehicle Info with Verification Status */}
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-placebo-black">{currentVehicle.title}</h3>
                    <p className="text-placebo-dark-gray flex items-center gap-1 text-sm">
                      <MapPin className="w-4 h-4" />
                      {currentVehicle.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-placebo-gold">{formatPrice(currentVehicle.price)}</div>
                  </div>
                </div>

                <div className="flex justify-between text-sm text-placebo-dark-gray">
                  <span>{currentVehicle.year}</span>
                  <span>{currentVehicle.mileage.toLocaleString()} km</span>
                </div>

                {/* Trust Indicators */}
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-800 font-medium">
                    {language === "en" ? "Fully Verified Vehicle & Seller" : "車両・販売者完全認証済み"}
                  </span>
                </div>

                <Button asChild className="w-full bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90">
                  <Link href={`/cars/${currentVehicle.id}`}>{language === "en" ? "View Details" : "詳細を見る"}</Link>
                </Button>
              </div>
            </div>

            {/* Carousel Indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {featuredVehicles.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentSlide(index)
                    setIsAutoPlaying(false)
                  }}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentSlide ? "bg-placebo-gold scale-110" : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Trust Assurance Badge */}
            <div className="absolute -bottom-4 -right-4 bg-placebo-gold text-placebo-black rounded-full p-4 shadow-lg">
              <Shield className="w-8 h-8" />
            </div>
          </div>
        </div>

        {/* Verification Process Section */}
        <div className="mt-16 pt-16 border-t border-gray-200">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-placebo-black mb-4">
              {language === "en" ? "Complete Verification Process" : "完全認証プロセス"}
            </h2>
            <p className="text-lg text-placebo-dark-gray max-w-2xl mx-auto">
              {language === "en"
                ? "Our comprehensive KYC process ensures every participant in our marketplace is verified, creating a safe and trustworthy environment for all."
                : "包括的なKYCプロセスにより、マーケットプレイスのすべての参加者が認証され、全員にとって安全で信頼できる環境を作り出しています。"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {verificationProcess.map((process, index) => (
              <div
                key={index}
                className="text-center p-6 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 bg-placebo-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <process.icon className="w-8 h-8 text-placebo-gold" />
                </div>
                <h3 className="text-lg font-semibold text-placebo-black mb-2">{process.title[language]}</h3>
                <p className="text-sm text-placebo-dark-gray">{process.description[language]}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button asChild size="lg" className="bg-placebo-black text-placebo-white hover:bg-placebo-dark-gray">
              <Link href="/verification">
                {language === "en" ? "Learn More About Verification" : "認証について詳しく見る"}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" fill="none" className="w-full h-12 text-white">
          <path d="M0,120 L0,60 Q300,0 600,60 T1200,60 L1200,120 Z" fill="currentColor" />
        </svg>
      </div>
    </div>
  )
}
