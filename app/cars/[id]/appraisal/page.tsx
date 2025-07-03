"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Car,
  Shield,
  CheckCircle,
  Clock,
  FileText,
  Phone,
  Calendar,
  AlertCircle,
  ArrowLeft,
  Star,
  Award,
  Clipboard,
  BookOpen,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getGuestListings, type GuestListing } from "@/lib/guest-listings"

interface AppraisalRequest {
  vehicleId: string
  appraisalType: "basic" | "comprehensive" | "pre-sale"
  urgency: "standard" | "expedited" | "rush"
  purpose: "insurance" | "sale" | "purchase" | "legal" | "financing" | "other"
  contactInfo: {
    name: string
    email: string
    phone: string
    preferredContact: "email" | "phone" | "both"
  }
  schedulingPreferences: {
    preferredDate: string
    preferredTime: string
    location: "seller" | "neutral" | "buyer"
    flexibleScheduling: boolean
  }
  additionalServices: string[]
  specialRequests: string
  agreedToTerms: boolean
}

export default function VehicleAppraisalPage() {
  const { language } = useLanguage()
  const router = useRouter()
  const params = useParams()
  const vehicleId = params.id as string

  const [listing, setListing] = useState<GuestListing | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const [appraisalRequest, setAppraisalRequest] = useState<AppraisalRequest>({
    vehicleId: vehicleId,
    appraisalType: "basic",
    urgency: "standard",
    purpose: "sale",
    contactInfo: {
      name: "",
      email: "",
      phone: "",
      preferredContact: "email",
    },
    schedulingPreferences: {
      preferredDate: "",
      preferredTime: "",
      location: "seller",
      flexibleScheduling: false,
    },
    additionalServices: [],
    specialRequests: "",
    agreedToTerms: false,
  })

  useEffect(() => {
    // Find the listing
    const guestListings = getGuestListings()
    const foundListing = guestListings.find((l) => l.id === vehicleId)

    if (foundListing) {
      setListing(foundListing)
    }
    setIsLoading(false)
  }, [vehicleId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!appraisalRequest.agreedToTerms) {
      alert(language === "en" ? "Please agree to the terms and conditions" : "利用規約に同意してください")
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // In a real app, this would submit to an API
    console.log("Appraisal request submitted:", appraisalRequest)

    setSubmitSuccess(true)
    setIsSubmitting(false)
  }

  const handleServiceToggle = (service: string) => {
    setAppraisalRequest((prev) => ({
      ...prev,
      additionalServices: prev.additionalServices.includes(service)
        ? prev.additionalServices.filter((s) => s !== service)
        : [...prev.additionalServices, service],
    }))
  }

  const appraisalTypes = [
    {
      id: "basic",
      name: language === "en" ? "Basic Appraisal" : "基本鑑定",
      price: "¥15,000",
      duration: language === "en" ? "1-2 business days" : "1-2営業日",
      features: [
        language === "en" ? "Visual inspection" : "目視検査",
        language === "en" ? "Market value assessment" : "市場価値評価",
        language === "en" ? "Basic condition report" : "基本状態レポート",
        language === "en" ? "Digital certificate" : "デジタル証明書",
      ],
    },
    {
      id: "comprehensive",
      name: language === "en" ? "Comprehensive Appraisal" : "包括的鑑定",
      price: "¥35,000",
      duration: language === "en" ? "2-3 business days" : "2-3営業日",
      features: [
        language === "en" ? "Detailed mechanical inspection" : "詳細な機械検査",
        language === "en" ? "Professional photography" : "プロ写真撮影",
        language === "en" ? "Market analysis report" : "市場分析レポート",
        language === "en" ? "Maintenance recommendations" : "メンテナンス推奨事項",
        language === "en" ? "Certified appraisal document" : "認定鑑定書",
      ],
    },
    {
      id: "pre-sale",
      name: language === "en" ? "Pre-Sale Package" : "売却前パッケージ",
      price: "¥50,000",
      duration: language === "en" ? "3-5 business days" : "3-5営業日",
      features: [
        language === "en" ? "Everything in Comprehensive" : "包括的鑑定のすべて",
        language === "en" ? "Marketing recommendations" : "マーケティング推奨事項",
        language === "en" ? "Pricing strategy" : "価格戦略",
        language === "en" ? "Professional listing photos" : "プロ出品写真",
        language === "en" ? "Sales consultation" : "販売コンサルテーション",
      ],
    },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-placebo-gold mx-auto mb-4"></div>
          <p className="text-placebo-dark-gray">{language === "en" ? "Loading..." : "読み込み中..."}</p>
        </div>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center py-12">
            <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-placebo-black mb-2">
              {language === "en" ? "Vehicle Not Found" : "車両が見つかりません"}
            </h3>
            <p className="text-gray-600 mb-6">
              {language === "en"
                ? "The vehicle you're looking for could not be found."
                : "お探しの車両が見つかりませんでした。"}
            </p>
            <Button asChild className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90">
              <Link href="/guest-dashboard">{language === "en" ? "Back to Dashboard" : "ダッシュボードに戻る"}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container max-w-4xl">
          <Card>
            <CardContent className="text-center py-12">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-placebo-black mb-4">
                {language === "en" ? "Appraisal Request Submitted!" : "鑑定依頼が送信されました！"}
              </h1>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                {language === "en"
                  ? "Thank you for requesting a professional appraisal. Our certified appraisers will contact you within 24 hours to schedule the inspection."
                  : "プロの鑑定をご依頼いただきありがとうございます。認定鑑定士が24時間以内にご連絡し、検査の予定を調整いたします。"}
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6 max-w-2xl mx-auto">
                <h3 className="font-semibold text-blue-800 mb-3">
                  {language === "en" ? "What happens next:" : "次のステップ："}
                </h3>
                <ul className="text-sm text-blue-700 space-y-2 text-left">
                  <li className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {language === "en" ? "Appraiser will contact you within 24 hours" : "24時間以内に鑑定士からご連絡"}
                  </li>
                  <li className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {language === "en" ? "Schedule convenient inspection time" : "便利な検査時間を予定"}
                  </li>
                  <li className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    {language === "en" ? "Professional inspection conducted" : "プロの検査を実施"}
                  </li>
                  <li className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    {language === "en" ? "Receive detailed appraisal report" : "詳細な鑑定レポートを受領"}
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90">
                  <Link href="/guest-dashboard">
                    {language === "en" ? "Back to Dashboard" : "ダッシュボードに戻る"}
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href={`/cars/${vehicleId}`}>
                    {language === "en" ? "View Vehicle Details" : "車両詳細を見る"}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/guest-dashboard" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              {language === "en" ? "Back to Dashboard" : "ダッシュボードに戻る"}
            </Link>
          </Button>

          <h1 className="text-3xl font-bold text-placebo-black mb-2">
            {language === "en" ? "Professional Vehicle Appraisal" : "プロ車両鑑定"}
          </h1>
          <p className="text-placebo-dark-gray">
            {language === "en"
              ? "Get an accurate, certified appraisal from our qualified professionals"
              : "資格を持つプロフェッショナルから正確で認定された鑑定を受けましょう"}
          </p>
          <p className="text-sm">
            <Link
              href="/appraisal-info"
              className="text-placebo-gold hover:text-placebo-gold/80 underline inline-flex items-center gap-1"
            >
              <BookOpen className="h-4 w-4" />
              {language === "en" ? "Learn more about our appraisal services" : "鑑定サービスについて詳しく見る"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Vehicle Information */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-placebo-gold" />
                  {language === "en" ? "Vehicle Details" : "車両詳細"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Vehicle Image */}
                <div className="w-full h-48 bg-gray-100 rounded-lg mb-4 overflow-hidden">
                  {listing.photos.length > 0 && listing.photos[0] ? (
                    <Image
                      src={listing.photos[0] || "/placeholder.svg"}
                      alt={`${listing.year} ${listing.make} ${listing.model}`}
                      width={400}
                      height={192}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Car className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Vehicle Info */}
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg text-placebo-black">
                      {listing.year} {listing.make} {listing.model}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {language === "en" ? "Ref:" : "参照:"} {listing.referenceNumber}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">{language === "en" ? "Mileage:" : "走行距離:"}</span>
                      <p className="font-medium">{Number(listing.mileage).toLocaleString()} km</p>
                    </div>
                    <div>
                      <span className="text-gray-500">{language === "en" ? "Year:" : "年式:"}</span>
                      <p className="font-medium">{listing.year}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">{language === "en" ? "Fuel:" : "燃料:"}</span>
                      <p className="font-medium">{listing.fuelType || "N/A"}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">{language === "en" ? "Transmission:" : "変速機:"}</span>
                      <p className="font-medium">{listing.transmission || "N/A"}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t">
                    <span className="text-gray-500 text-sm">
                      {language === "en" ? "Current Asking Price:" : "現在の希望価格:"}
                    </span>
                    <p className="font-bold text-placebo-gold text-xl">
                      ¥{Number(listing.askingPrice).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Appraisal Request Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Appraisal Type Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-placebo-gold" />
                    {language === "en" ? "Choose Appraisal Type" : "鑑定タイプを選択"}
                  </CardTitle>
                  <CardDescription>
                    {language === "en"
                      ? "Select the level of appraisal service that best meets your needs"
                      : "あなのニーズに最も適した鑑定サービスのレベルを選択してください"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={appraisalRequest.appraisalType}
                    onValueChange={(value) => setAppraisalRequest((prev) => ({ ...prev, appraisalType: value as any }))}
                  >
                    <div className="space-y-4">
                      {appraisalTypes.map((type) => (
                        <div key={type.id} className="relative">
                          <div
                            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                              appraisalRequest.appraisalType === type.id
                                ? "border-placebo-gold bg-placebo-gold/5"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <RadioGroupItem value={type.id} id={type.id} className="mt-1" />
                              <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                  <Label htmlFor={type.id} className="font-semibold text-placebo-black cursor-pointer">
                                    {type.name}
                                  </Label>
                                  <div className="text-right">
                                    <div className="font-bold text-placebo-gold">{type.price}</div>
                                    <div className="text-xs text-gray-500">{type.duration}</div>
                                  </div>
                                </div>
                                <ul className="text-sm text-gray-600 space-y-1">
                                  {type.features.map((feature, index) => (
                                    <li key={index} className="flex items-center gap-2">
                                      <CheckCircle className="h-3 w-3 text-green-500" />
                                      {feature}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Purpose and Urgency */}
              <Card>
                <CardHeader>
                  <CardTitle>{language === "en" ? "Appraisal Details" : "鑑定詳細"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="purpose">{language === "en" ? "Purpose of Appraisal" : "鑑定の目的"}</Label>
                      <select
                        id="purpose"
                        value={appraisalRequest.purpose}
                        onChange={(e) => setAppraisalRequest((prev) => ({ ...prev, purpose: e.target.value as any }))}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-placebo-gold"
                      >
                        <option value="sale">{language === "en" ? "Vehicle Sale" : "車両売却"}</option>
                        <option value="purchase">{language === "en" ? "Vehicle Purchase" : "車両購入"}</option>
                        <option value="insurance">{language === "en" ? "Insurance Claim" : "保険請求"}</option>
                        <option value="financing">{language === "en" ? "Financing/Loan" : "融資・ローン"}</option>
                        <option value="legal">{language === "en" ? "Legal/Court" : "法的・裁判"}</option>
                        <option value="other">{language === "en" ? "Other" : "その他"}</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="urgency">{language === "en" ? "Urgency Level" : "緊急度"}</Label>
                      <select
                        id="urgency"
                        value={appraisalRequest.urgency}
                        onChange={(e) => setAppraisalRequest((prev) => ({ ...prev, urgency: e.target.value as any }))}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-placebo-gold"
                      >
                        <option value="standard">
                          {language === "en" ? "Standard (No rush)" : "標準（急がない）"}
                        </option>
                        <option value="expedited">
                          {language === "en" ? "Expedited (+¥5,000)" : "迅速（+¥5,000）"}
                        </option>
                        <option value="rush">
                          {language === "en" ? "Rush (24hr, +¥15,000)" : "緊急（24時間、+¥15,000）"}
                        </option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-placebo-gold" />
                    {language === "en" ? "Contact Information" : "連絡先情報"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">{language === "en" ? "Full Name" : "氏名"} *</Label>
                      <Input
                        id="name"
                        value={appraisalRequest.contactInfo.name}
                        onChange={(e) =>
                          setAppraisalRequest((prev) => ({
                            ...prev,
                            contactInfo: { ...prev.contactInfo, name: e.target.value },
                          }))
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">{language === "en" ? "Email Address" : "メールアドレス"} *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={appraisalRequest.contactInfo.email}
                        onChange={(e) =>
                          setAppraisalRequest((prev) => ({
                            ...prev,
                            contactInfo: { ...prev.contactInfo, email: e.target.value },
                          }))
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">{language === "en" ? "Phone Number" : "電話番号"} *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={appraisalRequest.contactInfo.phone}
                        onChange={(e) =>
                          setAppraisalRequest((prev) => ({
                            ...prev,
                            contactInfo: { ...prev.contactInfo, phone: e.target.value },
                          }))
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="preferredContact">
                        {language === "en" ? "Preferred Contact Method" : "希望連絡方法"}
                      </Label>
                      <select
                        id="preferredContact"
                        value={appraisalRequest.contactInfo.preferredContact}
                        onChange={(e) =>
                          setAppraisalRequest((prev) => ({
                            ...prev,
                            contactInfo: { ...prev.contactInfo, preferredContact: e.target.value as any },
                          }))
                        }
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-placebo-gold"
                      >
                        <option value="email">{language === "en" ? "Email" : "メール"}</option>
                        <option value="phone">{language === "en" ? "Phone" : "電話"}</option>
                        <option value="both">{language === "en" ? "Both" : "両方"}</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Scheduling Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-placebo-gold" />
                    {language === "en" ? "Scheduling Preferences" : "スケジュール希望"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="preferredDate">{language === "en" ? "Preferred Date" : "希望日"}</Label>
                      <Input
                        id="preferredDate"
                        type="date"
                        value={appraisalRequest.schedulingPreferences.preferredDate}
                        onChange={(e) =>
                          setAppraisalRequest((prev) => ({
                            ...prev,
                            schedulingPreferences: { ...prev.schedulingPreferences, preferredDate: e.target.value },
                          }))
                        }
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                    <div>
                      <Label htmlFor="preferredTime">{language === "en" ? "Preferred Time" : "希望時間"}</Label>
                      <select
                        id="preferredTime"
                        value={appraisalRequest.schedulingPreferences.preferredTime}
                        onChange={(e) =>
                          setAppraisalRequest((prev) => ({
                            ...prev,
                            schedulingPreferences: { ...prev.schedulingPreferences, preferredTime: e.target.value },
                          }))
                        }
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-placebo-gold"
                      >
                        <option value="">{language === "en" ? "Select time" : "時間を選択"}</option>
                        <option value="morning">{language === "en" ? "Morning (9AM-12PM)" : "午前（9時-12時）"}</option>
                        <option value="afternoon">
                          {language === "en" ? "Afternoon (1PM-5PM)" : "午後（13時-17時）"}
                        </option>
                        <option value="evening">{language === "en" ? "Evening (5PM-7PM)" : "夕方（17時-19時）"}</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label>{language === "en" ? "Inspection Location" : "検査場所"}</Label>
                    <RadioGroup
                      value={appraisalRequest.schedulingPreferences.location}
                      onValueChange={(value) =>
                        setAppraisalRequest((prev) => ({
                          ...prev,
                          schedulingPreferences: { ...prev.schedulingPreferences, location: value as any },
                        }))
                      }
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="seller" id="seller" />
                        <Label htmlFor="seller">{language === "en" ? "At vehicle location" : "車両所在地で"}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="neutral" id="neutral" />
                        <Label htmlFor="neutral">{language === "en" ? "Neutral location" : "中立的な場所で"}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="buyer" id="buyer" />
                        <Label htmlFor="buyer">{language === "en" ? "At my location" : "私の場所で"}</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="flexible"
                      checked={appraisalRequest.schedulingPreferences.flexibleScheduling}
                      onCheckedChange={(checked) =>
                        setAppraisalRequest((prev) => ({
                          ...prev,
                          schedulingPreferences: {
                            ...prev.schedulingPreferences,
                            flexibleScheduling: checked as boolean,
                          },
                        }))
                      }
                    />
                    <Label htmlFor="flexible">
                      {language === "en" ? "I'm flexible with scheduling" : "スケジュールは柔軟に対応可能"}
                    </Label>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Services */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-placebo-gold" />
                    {language === "en" ? "Additional Services" : "追加サービス"}
                  </CardTitle>
                  <CardDescription>
                    {language === "en"
                      ? "Optional services to enhance your appraisal"
                      : "鑑定を強化するオプションサービス"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      {
                        id: "photos",
                        name: language === "en" ? "Professional Photography (+¥8,000)" : "プロ写真撮影（+¥8,000）",
                      },
                      {
                        id: "history",
                        name: language === "en" ? "Vehicle History Report (+¥3,000)" : "車両履歴レポート（+¥3,000）",
                      },
                      {
                        id: "market",
                        name: language === "en" ? "Market Analysis Report (+¥5,000)" : "市場分析レポート（+¥5,000）",
                      },
                      {
                        id: "consultation",
                        name:
                          language === "en" ? "Sales Consultation (+¥10,000)" : "販売コンサルテーション（+¥10,000）",
                      },
                    ].map((service) => (
                      <div key={service.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={service.id}
                          checked={appraisalRequest.additionalServices.includes(service.id)}
                          onCheckedChange={() => handleServiceToggle(service.id)}
                        />
                        <Label htmlFor={service.id}>{service.name}</Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Special Requests */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clipboard className="h-5 w-5 text-placebo-gold" />
                    {language === "en" ? "Special Requests" : "特別なリクエスト"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder={
                      language === "en"
                        ? "Any specific areas of concern, special requirements, or additional information..."
                        : "特に気になる箇所、特別な要件、追加情報など..."
                    }
                    value={appraisalRequest.specialRequests}
                    onChange={(e) => setAppraisalRequest((prev) => ({ ...prev, specialRequests: e.target.value }))}
                    rows={4}
                  />
                </CardContent>
              </Card>

              {/* Terms and Submit */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="terms"
                        checked={appraisalRequest.agreedToTerms}
                        onCheckedChange={(checked) =>
                          setAppraisalRequest((prev) => ({ ...prev, agreedToTerms: checked as boolean }))
                        }
                        required
                      />
                      <Label htmlFor="terms" className="text-sm leading-relaxed">
                        {language === "en"
                          ? "I agree to the terms and conditions of the appraisal service, including payment terms and cancellation policy."
                          : "鑑定サービスの利用規約（支払い条件およびキャンセルポリシーを含む）に同意します。"}
                      </Label>
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting || !appraisalRequest.agreedToTerms}
                      className="w-full bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90 h-12 text-lg font-semibold"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-placebo-black mr-2"></div>
                          {language === "en" ? "Submitting Request..." : "リクエスト送信中..."}
                        </>
                      ) : (
                        <>
                          <Shield className="h-5 w-5 mr-2" />
                          {language === "en" ? "Request Professional Appraisal" : "プロ鑑定を依頼する"}
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
