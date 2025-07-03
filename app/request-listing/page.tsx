"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Upload, Car, CheckCircle, Shield, Calculator, DollarSign, TrendingUp, AlertCircle } from "lucide-react"
import { saveGuestListing, getGuestListings } from "@/lib/guest-listings"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ComplianceAlert } from "@/components/compliance-alert"
import { checkComplianceStatus } from "@/lib/compliance"
import { calculateServiceFee, SERVICE_INCLUSIONS } from "@/lib/service-fee"
import { ValidatedImageUpload } from "@/components/validated-image-upload"

export default function RequestListingPage() {
  const { language } = useLanguage()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([])
  const [showServiceDialog, setShowServiceDialog] = useState(false)
  const [showTermsDialog, setShowTermsDialog] = useState(false)
  const [showPrivacyDialog, setShowPrivacyDialog] = useState(false)
  const [serviceScrolledToBottom, setServiceScrolledToBottom] = useState(false)
  const [termsScrolledToBottom, setTermsScrolledToBottom] = useState(false)
  const [privacyScrolledToBottom, setPrivacyScrolledToBottom] = useState(false)
  const [showComplianceWarning, setShowComplianceWarning] = useState(false)
  const [complianceStatus, setComplianceStatus] = useState(null)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [feeAccepted, setFeeAccepted] = useState(false)
  const [askingPrice, setAskingPrice] = useState("")
  const [serviceFeeCalculation, setServiceFeeCalculation] = useState(null)
  const [showValidationErrors, setShowValidationErrors] = useState(false)

  const serviceScrollRef = useRef<HTMLDivElement>(null)
  const termsScrollRef = useRef<HTMLDivElement>(null)
  const privacyScrollRef = useRef<HTMLDivElement>(null)

  const handlePriceChange = (value: string) => {
    setAskingPrice(value)
    const price = Number.parseInt(value.replace(/[^0-9]/g, ""))
    if (price && price > 0) {
      const calculation = calculateServiceFee(price)
      setServiceFeeCalculation(calculation)
    } else {
      setServiceFeeCalculation(null)
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      // Get form data
      const formData = new FormData(event.target as HTMLFormElement)

      // Helper function to get form values
      const getFormValue = (name: string) => (formData.get(name) as string) || ""
      const getFormArray = (name: string) => formData.getAll(name) as string[]

      // Create listing object with all collected data
      const listingData = {
        make: getFormValue("make"),
        model: getFormValue("model"),
        year: getFormValue("year"),
        mileage: getFormValue("mileage"),
        askingPrice: getFormValue("asking-price"),
        description: getFormValue("description"),
        photos: uploadedPhotos,
        status: "pending" as const,
        // New vehicle details
        vin: getFormValue("vin"),
        plateNumber: getFormValue("plate-number"),
        exteriorColor: getFormValue("exterior-color"),
        interiorColor: getFormValue("interior-color"),
        engineSize: getFormValue("engine-size"),
        cylinders: getFormValue("cylinders"),
        fuelType: getFormValue("fuel-type"),
        transmission: getFormValue("transmission"),
        driveType: getFormValue("drive-type"),
        doors: getFormValue("doors"),
        seats: getFormValue("seats"),
        bodyType: getFormValue("body-type"),
        condition: getFormValue("condition"),
        features: getFormArray("features[]"),
        specialFeatures: getFormValue("special-features"),
        knownIssues: getFormValue("known-issues"),
        accidentFree: formData.get("accident-free") === "on",
        nonSmoker: formData.get("non-smoker") === "on",
        singleOwner: formData.get("single-owner") === "on",
        serviceRecords: formData.get("service-records") === "on",
        contactInfo: {
          firstName: "Guest",
          lastName: "User",
          email: "guest@example.com",
          phone: "+81-90-XXXX-XXXX",
          preferredContact: "email",
        },
        sellerName: "Guest User",
        sellerEmail: "guest@example.com",
        sellerPhone: "+81-90-XXXX-XXXX",
        preferredContact: "email",
      }

      // Save to localStorage
      const savedListing = saveGuestListing(listingData)

      // Verify the listing was saved with a reference number
      if (!savedListing || !savedListing.referenceNumber) {
        throw new Error("Failed to generate reference number")
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Navigate to confirmation with reference number
      router.push(`/request-listing/confirmation?ref=${savedListing.referenceNumber}`)
    } catch (error) {
      console.error("Error submitting listing:", error)
      // Handle error - could show an error message to user
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    // Check existing listings for compliance
    const existingListings = getGuestListings()
    const activeListings = existingListings.filter((l) => l.status !== "sold").length

    // Simulate sales history for demo
    const vehiclesSoldThisYear = Math.floor(Math.random() * 3)

    const status = checkComplianceStatus("guest", vehiclesSoldThisYear, activeListings + 1) // +1 for new listing
    setComplianceStatus(status)

    if (status.warningLevel !== "none") {
      setShowComplianceWarning(true)
    }
  }, [])

  useEffect(() => {
    if (showServiceDialog && serviceScrollRef.current) {
      const { scrollHeight, clientHeight } = serviceScrollRef.current
      if (scrollHeight <= clientHeight) {
        setServiceScrolledToBottom(true)
      }
    }
  }, [showServiceDialog])

  useEffect(() => {
    if (showTermsDialog && termsScrollRef.current) {
      const { scrollHeight, clientHeight } = termsScrollRef.current
      if (scrollHeight <= clientHeight) {
        setTermsScrolledToBottom(true)
      }
    }
  }, [showTermsDialog])

  useEffect(() => {
    if (showPrivacyDialog && privacyScrollRef.current) {
      const { scrollHeight, clientHeight } = privacyScrollRef.current
      if (scrollHeight <= clientHeight) {
        setPrivacyScrolledToBottom(true)
      }
    }
  }, [showPrivacyDialog])

  const handleServiceScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      setServiceScrolledToBottom(true)
    }
  }

  const handleTermsScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      setTermsScrolledToBottom(true)
    }
  }

  const handlePrivacyScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      setPrivacyScrolledToBottom(true)
    }
  }

  const openServiceDialog = (e: React.MouseEvent) => {
    e.preventDefault()
    setShowServiceDialog(true)
    setServiceScrolledToBottom(false)
  }

  const openTermsDialog = (e: React.MouseEvent) => {
    e.preventDefault()
    setShowTermsDialog(true)
    setTermsScrolledToBottom(false)
  }

  const openPrivacyDialog = (e: React.MouseEvent) => {
    e.preventDefault()
    setShowPrivacyDialog(true)
    setPrivacyScrolledToBottom(false)
  }

  const handleInvalidSubmit = () => {
    setShowValidationErrors(true)

    // Scroll to the service fee section if it's not accepted
    if (!feeAccepted && serviceFeeCalculation) {
      const feeSection = document.getElementById("service-fee-section")
      if (feeSection) {
        feeSection.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }

    // Scroll to terms if not accepted
    if (!termsAccepted) {
      const termsSection = document.getElementById("terms-section")
      if (termsSection) {
        termsSection.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-placebo-black mb-2">
            {language === "en" ? "Request Vehicle Listing" : "車両出品依頼"}
          </h1>
          <p className="text-placebo-dark-gray">
            {language === "en"
              ? "Let Placebo Marketing handle your vehicle listing professionally. Fill out the form below and we'll take care of the rest."
              : "Placebo Marketingがあなたの車両出品をプロフェッショナルに対応いたします。以下のフォームにご記入いただければ、後はお任せください。"}
          </p>
        </div>

        {/* Compliance Warning */}
        {showComplianceWarning && complianceStatus && (
          <div className="mb-8">
            <ComplianceAlert status={complianceStatus} language={language} showActions={true} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Vehicle Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="h-5 w-5" />
                    {language === "en" ? "Vehicle Information" : "車両情報"}
                  </CardTitle>
                  <CardDescription>
                    {language === "en" ? "Tell us about your vehicle" : "お車について教えてください"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="make">{language === "en" ? "Make" : "メーカー"}</Label>
                      <Input
                        id="make"
                        name="make"
                        placeholder={language === "en" ? "e.g., Toyota" : "例：トヨタ"}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="model">{language === "en" ? "Model" : "モデル"}</Label>
                      <Input
                        id="model"
                        name="model"
                        placeholder={language === "en" ? "e.g., Camry" : "例：カムリ"}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="year">{language === "en" ? "Year" : "年式"}</Label>
                      <Input id="year" name="year" type="number" placeholder="2020" required />
                    </div>
                    <div>
                      <Label htmlFor="mileage">{language === "en" ? "Mileage (km)" : "走行距離（km）"}</Label>
                      <Input id="mileage" name="mileage" type="number" placeholder="50000" required />
                    </div>
                    <div>
                      <Label htmlFor="vin">
                        {language === "en" ? "VIN/Chassis Number (Optional)" : "車台番号（任意）"}
                      </Label>
                      <Input
                        id="vin"
                        name="vin"
                        placeholder={language === "en" ? "e.g., JT2BK18E8X0123456" : "例：JT2BK18E8X0123456"}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {language === "en"
                          ? "Can be added later during verification if not available now"
                          : "今利用できない場合は、認証時に後で追加できます"}
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="plate-number">
                        {language === "en" ? "License Plate Number (Optional)" : "ナンバープレート（任意）"}
                      </Label>
                      <Input
                        id="plate-number"
                        name="plate-number"
                        placeholder={language === "en" ? "e.g., 沖縄 500 あ 1234" : "例：沖縄 500 あ 1234"}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {language === "en"
                          ? "Can be added later during verification if not available now"
                          : "今利用できない場合は、認証時に後で追加できます"}
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="fuel-type">{language === "en" ? "Fuel Type" : "燃料タイプ"}</Label>
                      <Select name="fuel-type">
                        <SelectTrigger>
                          <SelectValue placeholder={language === "en" ? "Select fuel type" : "燃料タイプを選択"} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gasoline">{language === "en" ? "Gasoline" : "ガソリン"}</SelectItem>
                          <SelectItem value="hybrid">{language === "en" ? "Hybrid" : "ハイブリッド"}</SelectItem>
                          <SelectItem value="electric">{language === "en" ? "Electric" : "電気"}</SelectItem>
                          <SelectItem value="diesel">{language === "en" ? "Diesel" : "ディーゼル"}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="transmission">{language === "en" ? "Transmission" : "トランスミッション"}</Label>
                      <Select name="transmission">
                        <SelectTrigger>
                          <SelectValue
                            placeholder={language === "en" ? "Select transmission" : "トランスミッションを選択"}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="automatic">
                            {language === "en" ? "Automatic" : "オートマチック"}
                          </SelectItem>
                          <SelectItem value="manual">{language === "en" ? "Manual" : "マニュアル"}</SelectItem>
                          <SelectItem value="cvt">CVT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">{language === "en" ? "Vehicle Description" : "車両説明"}</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder={
                        language === "en"
                          ? "Describe your vehicle's condition, features, and any additional information..."
                          : "お車の状態、機能、その他の情報について説明してください..."
                      }
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label htmlFor="asking-price">
                      {language === "en" ? "How much do you want to receive? (¥)" : "いくら受け取りたいですか？（¥）"}
                    </Label>
                    <Input
                      id="asking-price"
                      name="asking-price"
                      type="number"
                      placeholder="1500000"
                      value={askingPrice}
                      onChange={(e) => handlePriceChange(e.target.value)}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {language === "en"
                        ? "This is the amount you want to receive. Our service fee will be added to create the market asking price."
                        : "これはあなたが受け取りたい金額です。当社のサービス手数料が追加されて市場販売価格となります。"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Service Fee Calculator */}
              {serviceFeeCalculation && (
                <Card
                  id="service-fee-section"
                  className={`border-placebo-gold/30 bg-gradient-to-br from-placebo-gold/5 to-placebo-gold/10 ${showValidationErrors && !feeAccepted ? "ring-2 ring-red-500 ring-opacity-50" : ""}`}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calculator className="h-5 w-5 text-placebo-gold" />
                      {language === "en" ? "Service Fee Breakdown" : "サービス手数料内訳"}
                    </CardTitle>
                    <CardDescription>
                      {language === "en"
                        ? "Transparent pricing for our professional vehicle selling service"
                        : "プロフェッショナルな車両販売サービスの透明な料金体系"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Fee Calculation */}
                    <div className="bg-white rounded-lg p-6 border border-placebo-gold/20">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-placebo-black">
                            ¥{serviceFeeCalculation.desiredAmount.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">
                            {language === "en" ? "You Want to Receive" : "受け取り希望額"}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-placebo-gold">
                            +¥{serviceFeeCalculation.actualFee.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">
                            {language === "en" ? "Service Fee" : "サービス手数料"}
                            <div className="text-xs text-placebo-gold">
                              {serviceFeeCalculation.isMinimumApplied
                                ? language === "en"
                                  ? "Minimum applied"
                                  : "最低額適用"
                                : serviceFeeCalculation.isMaximumApplied
                                  ? language === "en"
                                    ? "Maximum applied"
                                    : "最高額適用"
                                  : `${serviceFeeCalculation.feePercentage}%`}
                            </div>
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            ¥{serviceFeeCalculation.askingPrice.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">
                            {language === "en" ? "Market Asking Price" : "市場販売価格"}
                          </div>
                        </div>
                      </div>

                      {/* Fee Note */}
                      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="text-sm text-blue-800">
                          <strong>{language === "en" ? "Fee Structure:" : "手数料体系:"}</strong>
                          <br />
                          {language === "en"
                            ? "4% of desired amount (Minimum: ¥40,000, Maximum: ¥250,000) - added to asking price"
                            : "希望額の4%（最低：¥40,000、最高：¥250,000）- 販売価格に追加"}
                        </div>
                      </div>
                    </div>

                    {/* What's Included */}
                    <div className="bg-white rounded-lg p-6 border border-placebo-gold/20">
                      <h4 className="font-semibold text-placebo-black mb-4 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        {language === "en" ? "What's Included in Your Service Fee" : "サービス手数料に含まれるもの"}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {SERVICE_INCLUSIONS[language].map((inclusion, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{inclusion}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Value Proposition */}
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        {language === "en" ? "Why Choose Our Service?" : "なぜ当サービスを選ぶのか？"}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="font-medium text-green-800">
                            {language === "en" ? "Get Your Full Amount" : "希望額を満額受取"}
                          </div>
                          <div className="text-green-700">
                            {language === "en"
                              ? "You receive exactly what you want - no deductions"
                              : "希望額を満額受取 - 手数料差引なし"}
                          </div>
                        </div>
                        <div>
                          <div className="font-medium text-green-800">
                            {language === "en" ? "Professional Service" : "プロフェッショナルサービス"}
                          </div>
                          <div className="text-green-700">
                            {language === "en"
                              ? "Buyers pay for premium listing and service"
                              : "買い手がプレミアム出品とサービスに対価を支払い"}
                          </div>
                        </div>
                        <div>
                          <div className="font-medium text-green-800">
                            {language === "en" ? "Zero Risk" : "リスクゼロ"}
                          </div>
                          <div className="text-green-700">
                            {language === "en"
                              ? "No upfront costs, no financial loss to you"
                              : "初期費用なし、あなたに金銭的損失なし"}
                          </div>
                        </div>
                        <div>
                          <div className="font-medium text-green-800">
                            {language === "en" ? "Market Competitive" : "市場競争力"}
                          </div>
                          <div className="text-green-700">
                            {language === "en"
                              ? "Total price often lower than dealer markups"
                              : "総額は多くの場合ディーラーマークアップより安価"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Fee Acceptance */}
                    <div
                      className={`flex items-center space-x-3 p-4 rounded-lg border ${
                        showValidationErrors && !feeAccepted
                          ? "border-red-300 bg-red-50"
                          : feeAccepted
                            ? "border-gray-200 bg-white"
                            : "border-blue-200 bg-blue-50"
                      }`}
                    >
                      <Checkbox
                        id="fee-acceptance"
                        checked={feeAccepted}
                        onCheckedChange={(checked) => {
                          setFeeAccepted(checked)
                          if (checked) setShowValidationErrors(false)
                        }}
                        required
                      />
                      <label
                        htmlFor="fee-acceptance"
                        className={`text-sm font-medium ${
                          showValidationErrors && !feeAccepted
                            ? "text-red-700"
                            : feeAccepted
                              ? "text-gray-700"
                              : "text-blue-800"
                        }`}
                      >
                        {language === "en"
                          ? `I understand that a service fee of ¥${serviceFeeCalculation.actualFee.toLocaleString()} will be added to my asking price, and I will receive my full desired amount of ¥${serviceFeeCalculation.desiredAmount.toLocaleString()}`
                          : `サービス手数料¥${serviceFeeCalculation.actualFee.toLocaleString()}が販売価格に追加され、希望額¥${serviceFeeCalculation.desiredAmount.toLocaleString()}を満額受け取ることを理解しています`}
                      </label>
                    </div>

                    {showValidationErrors && !feeAccepted && (
                      <div className="text-red-600 text-sm mt-2 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        {language === "en"
                          ? "Please accept the service fee to continue"
                          : "続行するにはサービス手数料に同意してください"}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Vehicle Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    {language === "en" ? "Vehicle Details" : "車両詳細"}
                  </CardTitle>
                  <CardDescription>
                    {language === "en" ? "Additional specifications and condition details" : "追加仕様と状態の詳細"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="engine-size">
                        {language === "en" ? "Engine Size (L)" : "エンジン排気量（L）"}
                      </Label>
                      <Input id="engine-size" name="engine-size" type="number" step="0.1" placeholder="2.0" />
                    </div>
                    <div>
                      <Label htmlFor="cylinders">{language === "en" ? "Cylinders" : "シリンダー数"}</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder={language === "en" ? "Select cylinders" : "シリンダー数を選択"} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                          <SelectItem value="6">6</SelectItem>
                          <SelectItem value="8">8</SelectItem>
                          <SelectItem value="12">12</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="exterior-color">{language === "en" ? "Exterior Color" : "外装色"}</Label>
                      <Input
                        id="exterior-color"
                        name="exterior-color"
                        placeholder={language === "en" ? "e.g., Pearl White" : "例：パールホワイト"}
                      />
                    </div>
                    <div>
                      <Label htmlFor="interior-color">{language === "en" ? "Interior Color" : "内装色"}</Label>
                      <Input
                        id="interior-color"
                        name="interior-color"
                        placeholder={language === "en" ? "e.g., Black Leather" : "例：ブラックレザー"}
                      />
                    </div>
                    <div>
                      <Label htmlFor="drive-type">{language === "en" ? "Drive Type" : "駆動方式"}</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder={language === "en" ? "Select drive type" : "駆動方式を選択"} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fwd">
                            {language === "en" ? "Front Wheel Drive (FWD)" : "前輪駆動（FF）"}
                          </SelectItem>
                          <SelectItem value="rwd">
                            {language === "en" ? "Rear Wheel Drive (RWD)" : "後輪駆動（FR）"}
                          </SelectItem>
                          <SelectItem value="awd">
                            {language === "en" ? "All Wheel Drive (AWD)" : "全輪駆動（AWD）"}
                          </SelectItem>
                          <SelectItem value="4wd">
                            {language === "en" ? "4 Wheel Drive (4WD)" : "四輪駆動（4WD）"}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="doors">{language === "en" ? "Number of Doors" : "ドア数"}</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder={language === "en" ? "Select doors" : "ドア数を選択"} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                          <SelectItem value="5">5</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="seats">{language === "en" ? "Number of Seats" : "座席数"}</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder={language === "en" ? "Select seats" : "座席数を選択"} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="7">7</SelectItem>
                          <SelectItem value="8">8</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="body-type">{language === "en" ? "Body Type" : "ボディタイプ"}</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder={language === "en" ? "Select body type" : "ボディタイプを選択"} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sedan">{language === "en" ? "Sedan" : "セダン"}</SelectItem>
                          <SelectItem value="hatchback">{language === "en" ? "Hatchback" : "ハッチバック"}</SelectItem>
                          <SelectItem value="suv">{language === "en" ? "SUV" : "SUV"}</SelectItem>
                          <SelectItem value="wagon">{language === "en" ? "Wagon" : "ワゴン"}</SelectItem>
                          <SelectItem value="coupe">{language === "en" ? "Coupe" : "クーペ"}</SelectItem>
                          <SelectItem value="convertible">
                            {language === "en" ? "Convertible" : "オープンカー"}
                          </SelectItem>
                          <SelectItem value="truck">{language === "en" ? "Truck" : "トラック"}</SelectItem>
                          <SelectItem value="van">{language === "en" ? "Van" : "バン"}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="condition">{language === "en" ? "Overall Condition" : "全体的な状態"}</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder={language === "en" ? "Select condition" : "状態を選択"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">{language === "en" ? "Excellent" : "優秀"}</SelectItem>
                        <SelectItem value="very-good">{language === "en" ? "Very Good" : "非常に良い"}</SelectItem>
                        <SelectItem value="good">{language === "en" ? "Good" : "良い"}</SelectItem>
                        <SelectItem value="fair">{language === "en" ? "Fair" : "普通"}</SelectItem>
                        <SelectItem value="poor">{language === "en" ? "Poor" : "悪い"}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>{language === "en" ? "Key Features & Options" : "主要機能・オプション"}</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                      {[
                        { en: "Air Conditioning", ja: "エアコン" },
                        { en: "Power Steering", ja: "パワーステアリング" },
                        { en: "Power Windows", ja: "パワーウィンドウ" },
                        { en: "Navigation", ja: "ナビゲーション" },
                        { en: "Backup Camera", ja: "バックカメラ" },
                        { en: "Bluetooth", ja: "Bluetooth" },
                        { en: "Keyless Entry", ja: "キーレスエントリー" },
                        { en: "Sunroof", ja: "サンルーフ" },
                        { en: "Leather Seats", ja: "レザーシート" },
                        { en: "Alloy Wheels", ja: "アルミホイール" },
                        { en: "Cruise Control", ja: "クルーズコントロール" },
                        { en: "Safety Package", ja: "安全パッケージ" },
                        { en: "Heated Seats", ja: "シートヒーター" },
                        { en: "Remote Start", ja: "リモートスタート" },
                        { en: "Parking Sensors", ja: "パーキングセンサー" },
                        { en: "Lane Assist", ja: "レーンアシスト" },
                        { en: "Automatic Lights", ja: "オートライト" },
                        { en: "Rain Sensors", ja: "レインセンサー" },
                      ].map((feature) => (
                        <div key={feature.en} className="flex items-center space-x-2">
                          <Checkbox
                            id={`feature-${feature.en.replace(/\s+/g, "-").toLowerCase()}`}
                            name="features[]"
                            value={feature.en}
                          />
                          <label
                            htmlFor={`feature-${feature.en.replace(/\s+/g, "-").toLowerCase()}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {language === "en" ? feature.en : feature.ja}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="special-features">{language === "en" ? "Special Features" : "特別機能"}</Label>
                    <Textarea
                      id="special-features"
                      name="special-features"
                      placeholder={
                        language === "en"
                          ? "Any unique features, modifications, or special equipment not listed above..."
                          : "上記にない独特な機能、改造、特別装備について..."
                      }
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="known-issues">
                      {language === "en" ? "Known Issues (if any)" : "既知の問題（ある場合）"}
                    </Label>
                    <Textarea
                      id="known-issues"
                      name="known-issues"
                      placeholder={
                        language === "en"
                          ? "Any known mechanical issues, cosmetic damage, or areas needing attention..."
                          : "既知の機械的問題、外観の損傷、注意が必要な箇所..."
                      }
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="accident-free" name="accident-free" />
                      <label htmlFor="accident-free" className="text-sm">
                        {language === "en" ? "Accident-free vehicle" : "無事故車"}
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="non-smoker" name="non-smoker" />
                      <label htmlFor="non-smoker" className="text-sm">
                        {language === "en" ? "Non-smoker vehicle" : "禁煙車"}
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="single-owner" name="single-owner" />
                      <label htmlFor="single-owner" className="text-sm">
                        {language === "en" ? "Single owner" : "ワンオーナー"}
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="service-records" name="service-records" />
                      <label htmlFor="service-records" className="text-sm">
                        {language === "en" ? "Complete service records available" : "完全な整備記録あり"}
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Photo Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    {language === "en" ? "Vehicle Photos" : "車両写真"}
                  </CardTitle>
                  <CardDescription>
                    {language === "en"
                      ? "Upload high-quality photos of your vehicle. Images will be validated for optimal display."
                      : "お車の高品質な写真をアップロードしてください。画像は最適な表示のために検証されます。"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ValidatedImageUpload
                    images={uploadedPhotos}
                    onImagesChange={setUploadedPhotos}
                    maxImages={10}
                    language={language}
                  />
                </CardContent>
              </Card>

              {/* Terms and Submit */}
              <Card id="terms-section">
                <CardContent className="pt-6">
                  <div
                    className={`flex items-center space-x-2 mb-6 ${showValidationErrors && !termsAccepted ? "p-3 border border-red-500 rounded-lg bg-red-50" : ""}`}
                  >
                    <Checkbox
                      id="terms"
                      required
                      checked={termsAccepted}
                      onCheckedChange={(checked) => {
                        setTermsAccepted(checked)
                        if (checked) setShowValidationErrors(false)
                      }}
                    />
                    <label
                      htmlFor="terms"
                      className={`text-sm ${showValidationErrors && !termsAccepted ? "text-red-800" : "text-gray-600"}`}
                    >
                      {language === "en" ? (
                        <>
                          I agree to the{" "}
                          <button
                            type="button"
                            onClick={openServiceDialog}
                            className="text-placebo-gold hover:text-placebo-gold/80 underline"
                          >
                            service agreement
                          </button>
                          ,{" "}
                          <button
                            type="button"
                            onClick={openTermsDialog}
                            className="text-placebo-gold hover:text-placebo-gold/80 underline"
                          >
                            terms and conditions
                          </button>
                          , and{" "}
                          <button
                            type="button"
                            onClick={openPrivacyDialog}
                            className="text-placebo-gold hover:text-placebo-gold/80 underline"
                          >
                            privacy policy
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={openServiceDialog}
                            className="text-placebo-gold hover:text-placebo-gold/80 underline"
                          >
                            サービス契約
                          </button>
                          、{" "}
                          <button
                            type="button"
                            onClick={openTermsDialog}
                            className="text-placebo-gold hover:text-placebo-gold/80 underline"
                          >
                            利用規約
                          </button>
                          、{" "}
                          <button
                            type="button"
                            onClick={openPrivacyDialog}
                            className="text-placebo-gold hover:text-placebo-gold/80 underline"
                          >
                            プライバシーポリシー
                          </button>
                          に同意します
                        </>
                      )}
                    </label>
                  </div>

                  {showValidationErrors && !termsAccepted && (
                    <div className="text-red-600 text-sm mb-4 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      {language === "en"
                        ? "Please accept the terms and conditions to continue"
                        : "続行するには利用規約に同意してください"}
                    </div>
                  )}

                  <div className="flex flex-col gap-2">
                    <Button
                      type="submit"
                      className="w-full bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90 font-semibold"
                      disabled={isSubmitting || !termsAccepted || !feeAccepted || !serviceFeeCalculation}
                    >
                      {isSubmitting
                        ? language === "en"
                          ? "Submitting Request..."
                          : "リクエスト送信中..."
                        : language === "en"
                          ? "Submit Listing Request"
                          : "出品リクエストを送信"}
                    </Button>

                    {showValidationErrors && (!termsAccepted || !feeAccepted || !serviceFeeCalculation) && (
                      <div className="text-red-600 text-sm text-center flex items-center justify-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        {language === "en"
                          ? "Please complete all required fields above"
                          : "上記の必須項目をすべて入力してください"}
                      </div>
                    )}

                    {(!termsAccepted || !feeAccepted || !serviceFeeCalculation) && (
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full text-red-600 border-red-300 hover:bg-red-50 bg-transparent"
                        onClick={handleInvalidSubmit}
                      >
                        {language === "en" ? "Show Missing Requirements" : "不足している要件を表示"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </form>
          </div>

          <div className="lg:col-span-1">
            {/* Benefits and Expectations Card - moved here as sidebar */}
            <div className="sticky top-8">
              <div className="bg-gradient-to-br from-placebo-gold/10 to-placebo-gold/5 border border-placebo-gold/20 rounded-xl p-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-placebo-black mb-2">
                    {language === "en" ? "Professional Listing Service" : "プロフェッショナル出品サービス"}
                  </h2>
                  <p className="text-placebo-dark-gray text-sm">
                    {language === "en" ? "Transparent pricing with guaranteed results" : "結果保証付きの透明な料金体系"}
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                    <h3 className="font-bold text-lg text-placebo-black mb-3 flex items-center gap-2">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      {language === "en" ? "What We Do For You" : "私たちが行うこと"}
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-placebo-dark-gray text-sm">
                          {language === "en"
                            ? "Professional listing creation and management"
                            : "プロフェッショナルな出品作成と管理"}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-placebo-dark-gray text-sm">
                          {language === "en"
                            ? "Handle all buyer inquiries and negotiations"
                            : "すべての買い手の問い合わせと交渉を処理"}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-placebo-dark-gray text-sm">
                          {language === "en" ? "Complete title transfer process" : "所有権移転手続きの完了"}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-placebo-dark-gray text-sm">
                          {language === "en"
                            ? "Professional photography (if needed)"
                            : "プロフェッショナルな写真撮影（必要な場合）"}
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                    <h3 className="font-bold text-lg text-placebo-black mb-3 flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-blue-600" />
                      </div>
                      {language === "en" ? "Transparent Pricing" : "透明な料金体系"}
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <Shield className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-placebo-dark-gray text-sm">
                          {language === "en"
                            ? "4% service fee (Min: ¥40,000, Max: ¥250,000)"
                            : "4%サービス手数料（最低：¥40,000、最高：¥250,000）"}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Shield className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-placebo-dark-gray text-sm">
                          {language === "en" ? "Fee only charged when vehicle sells" : "車両が売れた時のみ手数料を請求"}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Shield className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-placebo-dark-gray text-sm">
                          {language === "en" ? "No hidden costs or surprise fees" : "隠れたコストや追加料金なし"}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Shield className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-placebo-dark-gray text-sm">
                          {language === "en" ? "Full service included in fee" : "手数料にフルサービス含む"}
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 bg-placebo-gold/20 text-placebo-black px-3 py-2 rounded-full font-semibold text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      {language === "en" ? "Pay Only When Sold" : "売れた時のみ支払い"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Service Agreement Dialog */}
        <Dialog open={showServiceDialog} onOpenChange={setShowServiceDialog}>
          <DialogContent className="max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>{language === "en" ? "Service Agreement" : "サービス契約"}</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[60vh] pr-4" onScrollCapture={handleServiceScroll}>
              <div className="space-y-6" ref={serviceScrollRef}>
                <div>
                  <h4 className="font-semibold mb-2">
                    {language === "en" ? "Placebo Marketing Listing Agreement" : "Placebo Marketing出品契約"}
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed mb-2">
                    {language === "en"
                      ? "By agreeing to this document, you authorize Placebo Marketing to:"
                      : "この文書に同意することにより、Placebo Marketingに以下の権限を与えます："}
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2 list-disc pl-5 mb-4">
                    <li>
                      {language === "en"
                        ? "List your vehicle on our platform on your behalf"
                        : "あなたに代わって当プラットフォームに車両を出品する"}
                    </li>
                    <li>
                      {language === "en"
                        ? "Handle all communications with potential buyers"
                        : "潜在的な買い手とのすべてのコミュニケーションを処理する"}
                    </li>
                    <li>
                      {language === "en"
                        ? "Negotiate the final selling price within your specified range"
                        : "指定された範囲内で最終販売価格を交渉する"}
                    </li>
                    <li>
                      {language === "en"
                        ? "Process all necessary paperwork for title transfer"
                        : "所有権移転に必要なすべての書類を処理する"}
                    </li>
                    <li>
                      {language === "en"
                        ? "Take professional photographs of your vehicle if needed"
                        : "必要に応じて車両のプロフェッショナルな写真を撮影する"}
                    </li>
                  </ul>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {language === "en"
                      ? "You acknowledge that Placebo Marketing will charge a service fee of 4% of the final sale price (minimum ¥40,000, maximum ¥250,000) only when your vehicle is successfully sold."
                      : "Placebo Marketingが車両の売却が成功した場合のみ、最終販売価格の4%（最低¥40,000、最高¥250,000）のサービス手数料を請求することを認めます。"}
                  </p>
                </div>
              </div>
            </ScrollArea>
            <div className="flex justify-end pt-4">
              <Button
                onClick={() => setShowServiceDialog(false)}
                className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90"
              >
                {language === "en" ? "Close" : "閉じる"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Terms and Conditions Dialog */}
        <Dialog open={showTermsDialog} onOpenChange={setShowTermsDialog}>
          <DialogContent className="max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>{language === "en" ? "Terms and Conditions" : "利用規約"}</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[60vh] pr-4" onScrollCapture={handleTermsScroll}>
              <div className="space-y-6" ref={termsScrollRef}>
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    {language === "en" ? "Acceptance of Terms" : "利用規約の承諾"}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {language === "en"
                      ? "By accessing and using Placebo Marketing's services, you accept and agree to be bound by the terms and provision of this agreement."
                      : "プラセボマーケティングのサービスにアクセスし、利用することにより、本契約の条項および規定に拘束されることに同意し、承諾したものとみなされます。"}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    {language === "en" ? "User Responsibilities" : "ユーザーの責任"}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {language === "en"
                      ? "Users are responsible for maintaining the confidentiality of their account information and providing accurate vehicle and personal information."
                      : "ユーザーは、アカウント情報の機密性を維持し、正確な車両および個人情報を提供する責任があります。"}
                  </p>
                </div>
              </div>
            </ScrollArea>
            <div className="flex justify-end pt-4">
              <Button
                onClick={() => setShowTermsDialog(false)}
                className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90"
              >
                {language === "en" ? "Close" : "閉じる"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Privacy Policy Dialog */}
        <Dialog open={showPrivacyDialog} onOpenChange={setShowPrivacyDialog}>
          <DialogContent className="max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>{language === "en" ? "Privacy Policy" : "プライバシーポリシー"}</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[60vh] pr-4" onScrollCapture={handlePrivacyScroll}>
              <div className="space-y-6" ref={privacyScrollRef}>
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    {language === "en" ? "Information We Collect" : "収集する情報"}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {language === "en"
                      ? "We collect information you provide directly to us, such as when you create an account, list a vehicle, or contact sellers."
                      : "アカウント作成、車両出品、販売者への連絡時に直接提供される情報を収集します。"}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    {language === "en" ? "How We Use Your Information" : "情報の使用方法"}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {language === "en"
                      ? "We use the information we collect to provide, maintain, and improve our services."
                      : "収集した情報は、サービスの提供、維持、改善に使用します。"}
                  </p>
                </div>
              </div>
            </ScrollArea>
            <div className="flex justify-end pt-4">
              <Button
                onClick={() => setShowPrivacyDialog(false)}
                className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90"
              >
                {language === "en" ? "Close" : "閉じる"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
