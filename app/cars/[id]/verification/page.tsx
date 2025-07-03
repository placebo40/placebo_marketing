"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Upload, FileText, Car, Shield, Camera, CheckCircle2, AlertCircle, Clock, Award } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getGuestListings } from "@/lib/guest-listings"
import { getSellerListings } from "@/lib/seller-listings"

// Mock vehicle data + guest listings data + seller listings data
const getVehicleData = (id: string) => {
  // Check if it's a guest listing ID
  if (id.startsWith("guest_")) {
    const guestListings = getGuestListings()
    const guestListing = guestListings.find((listing) => listing.id === id)

    if (guestListing) {
      // Transform guest listing to vehicle format with proper data mapping
      return {
        id: guestListing.id,
        title: `${guestListing.year} ${guestListing.make} ${guestListing.model}`,
        year: Number.parseInt(guestListing.year),
        make: guestListing.make,
        model: guestListing.model,
        price: guestListing.marketAskingPrice,
        mileage: Number.parseInt(guestListing.mileage),
        location: "Okinawa, Japan", // Default location for guest listings
        image: guestListing.photos[0] || "/images/compact-car-daylight.jpg",
        // Use collected data or indicate if not provided
        vin: guestListing.vin || null,
        plateNumber: guestListing.plateNumber || null,
        exteriorColor: guestListing.exteriorColor || null,
        interiorColor: guestListing.interiorColor || null,
        fuelType: guestListing.fuelType || null,
        transmission: guestListing.transmission || null,
        engineSize: guestListing.engineSize || null,
        // Additional fields from guest listing
        cylinders: guestListing.cylinders || null,
        driveType: guestListing.driveType || null,
        doors: guestListing.doors || null,
        seats: guestListing.seats || null,
        bodyType: guestListing.bodyType || null,
        condition: guestListing.condition || null,
        features: guestListing.features || [],
        specialFeatures: guestListing.specialFeatures || null,
        knownIssues: guestListing.knownIssues || null,
        accidentFree: guestListing.accidentFree,
        nonSmoker: guestListing.nonSmoker,
        singleOwner: guestListing.singleOwner,
        serviceRecords: guestListing.serviceRecords,
      }
    }
  }

  // Check if it's a seller listing ID
  if (id.startsWith("seller_")) {
    const sellerListings = getSellerListings()
    const sellerListing = sellerListings.find((listing) => listing.id === id)

    if (sellerListing) {
      // Transform seller listing to vehicle format with proper data mapping
      return {
        id: sellerListing.id,
        title: `${sellerListing.year} ${sellerListing.make} ${sellerListing.model}`,
        year: Number.parseInt(sellerListing.year),
        make: sellerListing.make,
        model: sellerListing.model,
        price: Number.parseInt(sellerListing.price.replace(/[^\d]/g, "")), // Remove currency symbols
        mileage: Number.parseInt(sellerListing.mileage.replace(/[^\d]/g, "")), // Remove non-numeric chars
        location: sellerListing.location || "Okinawa, Japan",
        image: sellerListing.photos[0] || "/car-listing-photo.png",
        // Map seller listing fields to vehicle format
        vin: null, // VIN not collected in seller listings yet
        plateNumber: null, // Plate number not collected in seller listings yet
        exteriorColor: sellerListing.color,
        interiorColor: sellerListing.interiorColor,
        fuelType: sellerListing.fuelType,
        transmission: sellerListing.transmission,
        engineSize: sellerListing.engineSize,
        // Additional fields from seller listing
        cylinders: null, // Not collected in seller listings
        driveType: null, // Not collected in seller listings
        doors: sellerListing.doors,
        seats: sellerListing.seats,
        bodyType: sellerListing.bodyType,
        condition: sellerListing.condition,
        features: sellerListing.features || [],
        specialFeatures: null, // Not collected separately in seller listings
        knownIssues: null, // Not collected in seller listings
        accidentFree: null, // Not collected in seller listings
        nonSmoker: null, // Not collected in seller listings
        singleOwner: null, // Not collected in seller listings
        serviceRecords: null, // Not collected in seller listings
      }
    }
  }

  // Regular mock vehicle data (unchanged)
  const vehicles: { [key: string]: any } = {
    "1": {
      id: "1",
      title: "2019 Toyota Aqua Hybrid",
      year: 2019,
      make: "Toyota",
      model: "Aqua",
      price: 1250000,
      mileage: 45000,
      location: "Naha, Okinawa",
      image: "/images/compact-car-daylight.jpg",
      vin: "JT2BK18E8X0123456",
      plateNumber: "沖縄 500 あ 1234",
      exteriorColor: "Pearl White",
      interiorColor: "Black",
      fuelType: "Hybrid",
      transmission: "CVT",
      engineSize: "1.5L",
    },
    "2": {
      id: "2",
      title: "2018 Honda Fit RS",
      year: 2018,
      make: "Honda",
      model: "Fit",
      price: 980000,
      mileage: 62000,
      location: "Ginowan, Okinawa",
      image: "/images/honda-fit-clean.jpg",
      vin: "JHMGD18658S123456",
      plateNumber: "沖縄 300 か 5678",
      exteriorColor: "Premium Red Pearl",
      interiorColor: "Black Leather",
      fuelType: "Gasoline",
      transmission: "CVT",
      engineSize: "1.5L",
    },
  }
  return vehicles[id] || null
}

export default function VehicleVerificationPage() {
  const params = useParams()
  const router = useRouter()
  const { language } = useLanguage()
  const [vehicle, setVehicle] = useState<any>(null)
  const [currentStep, setCurrentStep] = useState("documents")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    // Vehicle Documents
    registrationDocument: null,
    titleDocument: null,
    insuranceDocument: null,
    inspectionCertificate: null,

    // Ownership Verification
    ownershipType: "owner",
    ownerName: "",
    ownerIdNumber: "",
    relationshipToOwner: "",

    // Vehicle History
    accidentHistory: "no",
    accidentDetails: "",
    serviceHistory: "complete",
    serviceRecords: null,
    previousOwners: "1",

    // Physical Verification
    inspectionPreference: "comprehensive",
    inspectionDate: "",
    inspectionTime: "",
    inspectionLocation: "",
    specialInstructions: "",

    // Legal Compliance
    registrationValid: false,
    insuranceValid: false,
    noLiens: false,
    legalOwnership: false,
    accurateInfo: false,

    // Additional Information
    modifications: "no",
    modificationDetails: "",
    warrantyStatus: "none",
    warrantyDetails: "",
  })

  const [missingInfo, setMissingInfo] = useState({
    vin: "",
    plateNumber: "",
    exteriorColor: "",
    interiorColor: "",
  })

  const [inputValues, setInputValues] = useState({
    vin: "",
    plateNumber: "",
    exteriorColor: "",
    interiorColor: "",
  })

  const vehicleId = params.id as string

  useEffect(() => {
    const vehicleData = getVehicleData(vehicleId)
    if (vehicleData) {
      setVehicle(vehicleData)

      // Initialize input values with any existing missing info
      setInputValues({
        vin: missingInfo.vin,
        plateNumber: missingInfo.plateNumber,
        exteriorColor: missingInfo.exteriorColor,
        interiorColor: missingInfo.interiorColor,
      })
    } else {
      // Handle case where vehicle is not found
      console.error("Vehicle not found:", vehicleId)
    }
  }, [vehicleId])

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Navigate to confirmation
    router.push(`/cars/${vehicleId}/verification/confirmation`)
  }

  const isDocumentsComplete = () => {
    return (
      formData.ownershipType &&
      formData.ownerName.trim() !== "" &&
      formData.registrationValid &&
      formData.insuranceValid
    )
  }

  const isHistoryComplete = () => {
    return formData.accidentHistory && formData.serviceHistory && formData.previousOwners
  }

  const isInspectionComplete = () => {
    return (
      formData.inspectionPreference &&
      (formData.inspectionPreference === "skip" || (formData.inspectionDate && formData.inspectionTime))
    )
  }

  const isComplianceComplete = () => {
    return formData.legalOwnership && formData.noLiens && formData.accurateInfo
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-placebo-gold mx-auto mb-4"></div>
          <p className="text-placebo-dark-gray">{language === "en" ? "Loading vehicle..." : "車両を読み込み中..."}</p>
        </div>
      </div>
    )
  }

  // Create merged vehicle data that prioritizes user input
  const displayVehicle = vehicle
    ? {
        ...vehicle,
        vin: missingInfo.vin || vehicle.vin,
        plateNumber: missingInfo.plateNumber || vehicle.plateNumber,
        exteriorColor: missingInfo.exteriorColor || vehicle.exteriorColor,
        interiorColor: missingInfo.interiorColor || vehicle.interiorColor,
      }
    : null

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href={`/cars/${vehicleId}`} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              {language === "en" ? "Back to Vehicle" : "車両に戻る"}
            </Link>
          </Button>

          <div className="flex items-start gap-4 mb-6">
            <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={vehicle.image || "/placeholder.svg"}
                alt={vehicle.title}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-placebo-black mb-2">
                {language === "en" ? "Vehicle Verification" : "車両認証"}
              </h1>
              <p className="text-xl text-placebo-dark-gray mb-1">{vehicle.title}</p>
              <p className="text-placebo-gold font-semibold">¥{Number(vehicle.price).toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-blue-800 mb-1">
                  {language === "en" ? "Why Verify Your Vehicle?" : "なぜ車両を認証するのですか？"}
                </h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>
                    • {language === "en" ? "Increase buyer trust and confidence" : "購入者の信頼と信頼性を高める"}
                  </li>
                  <li>
                    • {language === "en" ? "Get priority placement in search results" : "検索結果で優先的に表示される"}
                  </li>
                  <li>• {language === "en" ? "Access to verified vehicle badge" : "認証済み車両バッジにアクセス"}</li>
                  <li>
                    •{" "}
                    {language === "en" ? "Professional documentation and history report" : "プロの文書化と履歴レポート"}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5 text-placebo-gold" />
              {language === "en" ? "Vehicle Verification Process" : "車両認証プロセス"}
            </CardTitle>
            <CardDescription>
              {language === "en"
                ? "Complete all steps to get your vehicle verified. This process typically takes 2-3 business days."
                : "車両を認証するためにすべてのステップを完了してください。このプロセスは通常2〜3営業日かかります。"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={currentStep} onValueChange={setCurrentStep} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="documents">
                  <span className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    <span className="hidden sm:inline">{language === "en" ? "Documents" : "書類"}</span>
                  </span>
                </TabsTrigger>
                <TabsTrigger value="history" disabled={!isDocumentsComplete()}>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span className="hidden sm:inline">{language === "en" ? "History" : "履歴"}</span>
                  </span>
                </TabsTrigger>
                <TabsTrigger value="inspection" disabled={!isHistoryComplete() || !isDocumentsComplete()}>
                  <span className="flex items-center gap-1">
                    <Camera className="h-4 w-4" />
                    <span className="hidden sm:inline">{language === "en" ? "Inspection" : "検査"}</span>
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="review"
                  disabled={!isInspectionComplete() || !isHistoryComplete() || !isDocumentsComplete()}
                >
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="hidden sm:inline">{language === "en" ? "Review" : "確認"}</span>
                  </span>
                </TabsTrigger>
              </TabsList>

              <div className="mt-6">
                <TabsContent value="documents">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        {language === "en" ? "Vehicle Documents & Ownership" : "車両書類と所有権"}
                      </h3>

                      {/* Vehicle Information Display */}
                      <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <h4 className="font-medium mb-3">{language === "en" ? "Vehicle Information" : "車両情報"}</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">{language === "en" ? "VIN:" : "車台番号:"}</span>
                            <p className="font-medium">
                              {displayVehicle?.vin || (
                                <span className="text-amber-600 italic">
                                  {language === "en" ? "To be provided" : "後で提供"}
                                </span>
                              )}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">{language === "en" ? "Plate:" : "ナンバー:"}</span>
                            <p className="font-medium">
                              {displayVehicle?.plateNumber || (
                                <span className="text-amber-600 italic">
                                  {language === "en" ? "To be provided" : "後で提供"}
                                </span>
                              )}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">{language === "en" ? "Year:" : "年式:"}</span>
                            <p className="font-medium">{vehicle.year}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">
                              {language === "en" ? "Make/Model:" : "メーカー/モデル:"}
                            </span>
                            <p className="font-medium">
                              {vehicle.make} {vehicle.model}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">{language === "en" ? "Exterior Color:" : "外装色:"}</span>
                            <p className="font-medium">
                              {displayVehicle?.exteriorColor || (
                                <span className="text-amber-600 italic">
                                  {language === "en" ? "To be provided" : "後で提供"}
                                </span>
                              )}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">{language === "en" ? "Interior Color:" : "内装色:"}</span>
                            <p className="font-medium">
                              {displayVehicle?.interiorColor || (
                                <span className="text-amber-600 italic">
                                  {language === "en" ? "To be provided" : "後で提供"}
                                </span>
                              )}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">{language === "en" ? "Mileage:" : "走行距離:"}</span>
                            <p className="font-medium">{Number(vehicle.mileage).toLocaleString()} km</p>
                          </div>
                          <div>
                            <span className="text-gray-500">{language === "en" ? "Fuel Type:" : "燃料:"}</span>
                            <p className="font-medium">
                              {vehicle.fuelType || (
                                <span className="text-amber-600 italic">
                                  {language === "en" ? "To be provided" : "後で提供"}
                                </span>
                              )}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">{language === "en" ? "Transmission:" : "変速機:"}</span>
                            <p className="font-medium">
                              {vehicle.transmission || (
                                <span className="text-amber-600 italic">
                                  {language === "en" ? "To be provided" : "後で提供"}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>

                        {/* Data Completeness Indicator */}
                        <div className="mt-4 pt-3 border-t border-gray-200">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">
                              {language === "en" ? "Information Completeness:" : "情報完成度:"}
                            </span>
                            <div className="flex items-center gap-2">
                              {displayVehicle?.vin &&
                              displayVehicle?.plateNumber &&
                              displayVehicle?.exteriorColor &&
                              vehicle.fuelType &&
                              vehicle.transmission ? (
                                <span className="text-green-600 font-medium">
                                  {language === "en" ? "Complete" : "完了"}
                                </span>
                              ) : (
                                <span className="text-amber-600 font-medium">
                                  {language === "en" ? "Needs completion during verification" : "認証時に完成が必要"}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Missing Information Completion */}
                      {(!displayVehicle?.vin || !displayVehicle?.plateNumber || !displayVehicle?.exteriorColor) && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                          <h4 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
                            <AlertCircle className="h-5 w-5" />
                            {language === "en" ? "Complete Missing Information" : "不足情報の完成"}
                          </h4>
                          <p className="text-sm text-blue-700 mb-4">
                            {language === "en"
                              ? "Please provide the following information to complete your vehicle verification:"
                              : "車両認証を完了するために、以下の情報を提供してください："}
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {!displayVehicle?.vin && (
                              <div>
                                <Label htmlFor="missing-vin" className="text-sm font-medium">
                                  {language === "en" ? "VIN/Chassis Number" : "車台番号"}
                                  <span className="text-red-500 ml-1">*</span>
                                </Label>
                                <Input
                                  id="missing-vin"
                                  value={inputValues.vin}
                                  onChange={(e) => setInputValues((prev) => ({ ...prev, vin: e.target.value }))}
                                  onBlur={(e) => setMissingInfo((prev) => ({ ...prev, vin: e.target.value }))}
                                  placeholder={language === "en" ? "Enter VIN/Chassis number" : "車台番号を入力"}
                                  className="mt-1"
                                />
                              </div>
                            )}

                            {!displayVehicle?.plateNumber && (
                              <div>
                                <Label htmlFor="missing-plate" className="text-sm font-medium">
                                  {language === "en" ? "License Plate Number" : "ナンバープレート"}
                                  <span className="text-red-500 ml-1">*</span>
                                </Label>
                                <Input
                                  id="missing-plate"
                                  value={inputValues.plateNumber}
                                  onChange={(e) => setInputValues((prev) => ({ ...prev, plateNumber: e.target.value }))}
                                  onBlur={(e) => setMissingInfo((prev) => ({ ...prev, plateNumber: e.target.value }))}
                                  placeholder={
                                    language === "en" ? "Enter license plate number" : "ナンバープレートを入力"
                                  }
                                  className="mt-1"
                                />
                              </div>
                            )}

                            {!displayVehicle?.exteriorColor && (
                              <div>
                                <Label htmlFor="missing-exterior-color" className="text-sm font-medium">
                                  {language === "en" ? "Exterior Color" : "外装色"}
                                  <span className="text-red-500 ml-1">*</span>
                                </Label>
                                <Input
                                  id="missing-exterior-color"
                                  value={inputValues.exteriorColor}
                                  onChange={(e) =>
                                    setInputValues((prev) => ({ ...prev, exteriorColor: e.target.value }))
                                  }
                                  onBlur={(e) => setMissingInfo((prev) => ({ ...prev, exteriorColor: e.target.value }))}
                                  placeholder={language === "en" ? "e.g., Pearl White" : "例：パールホワイト"}
                                  className="mt-1"
                                />
                              </div>
                            )}

                            {!displayVehicle?.interiorColor && (
                              <div>
                                <Label htmlFor="missing-interior-color" className="text-sm font-medium">
                                  {language === "en" ? "Interior Color" : "内装色"}
                                </Label>
                                <Input
                                  id="missing-interior-color"
                                  value={inputValues.interiorColor}
                                  onChange={(e) =>
                                    setInputValues((prev) => ({ ...prev, interiorColor: e.target.value }))
                                  }
                                  onBlur={(e) => setMissingInfo((prev) => ({ ...prev, interiorColor: e.target.value }))}
                                  placeholder={language === "en" ? "e.g., Black Leather" : "例：ブラックレザー"}
                                  className="mt-1"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Ownership Type */}
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium">
                            {language === "en" ? "Ownership Type" : "所有権タイプ"}
                            <span className="text-red-500 ml-1">*</span>
                          </Label>
                          <Select
                            value={formData.ownershipType}
                            onValueChange={(value) => handleInputChange("ownershipType", value)}
                          >
                            <SelectTrigger className="mt-2">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="owner">
                                {language === "en" ? "I am the owner" : "私が所有者です"}
                              </SelectItem>
                              <SelectItem value="authorized">
                                {language === "en"
                                  ? "Authorized to sell (family/business)"
                                  : "販売権限あり（家族/事業）"}
                              </SelectItem>
                              <SelectItem value="dealer">
                                {language === "en" ? "Dealer/Business" : "ディーラー/事業者"}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="ownerName" className="text-sm font-medium">
                              {language === "en" ? "Legal Owner Name" : "法的所有者名"}
                              <span className="text-red-500 ml-1">*</span>
                            </Label>
                            <Input
                              id="ownerName"
                              value={formData.ownerName}
                              onChange={(e) => handleInputChange("ownerName", e.target.value)}
                              placeholder={language === "en" ? "Full legal name as on documents" : "書類記載の正式名称"}
                              className="mt-2"
                            />
                          </div>
                          <div>
                            <Label htmlFor="ownerIdNumber" className="text-sm font-medium">
                              {language === "en" ? "Owner ID Number" : "所有者ID番号"}
                            </Label>
                            <Input
                              id="ownerIdNumber"
                              value={formData.ownerIdNumber}
                              onChange={(e) => handleInputChange("ownerIdNumber", e.target.value)}
                              placeholder={
                                language === "en" ? "Driver's license or ID number" : "運転免許証またはID番号"
                              }
                              className="mt-2"
                            />
                          </div>
                        </div>

                        {formData.ownershipType === "authorized" && (
                          <div>
                            <Label htmlFor="relationshipToOwner" className="text-sm font-medium">
                              {language === "en" ? "Relationship to Owner" : "所有者との関係"}
                              <span className="text-red-500 ml-1">*</span>
                            </Label>
                            <Input
                              id="relationshipToOwner"
                              value={formData.relationshipToOwner}
                              onChange={(e) => handleInputChange("relationshipToOwner", e.target.value)}
                              placeholder={
                                language === "en"
                                  ? "e.g., Spouse, Business Partner, etc."
                                  : "例：配偶者、ビジネスパートナーなど"
                              }
                              className="mt-2"
                            />
                          </div>
                        )}
                      </div>

                      <Separator />

                      {/* Document Uploads */}
                      <div className="space-y-4">
                        <h4 className="font-medium">{language === "en" ? "Required Documents" : "必要書類"}</h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium">
                              {language === "en" ? "Vehicle Registration (車検証)" : "車検証"}
                              <span className="text-red-500 ml-1">*</span>
                            </Label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center mt-2">
                              <Upload className="h-6 w-6 mx-auto text-gray-400 mb-2" />
                              <p className="text-sm text-gray-600 mb-2">
                                {language === "en" ? "Upload vehicle registration" : "車検証をアップロード"}
                              </p>
                              <Button type="button" variant="outline" size="sm">
                                {language === "en" ? "Choose File" : "ファイルを選択"}
                              </Button>
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-medium">
                              {language === "en" ? "Title/Ownership Document" : "所有権証明書"}
                              <span className="text-red-500 ml-1">*</span>
                            </Label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center mt-2">
                              <Upload className="h-6 w-6 mx-auto text-gray-400 mb-2" />
                              <p className="text-sm text-gray-600 mb-2">
                                {language === "en" ? "Upload title document" : "所有権証明書をアップロード"}
                              </p>
                              <Button type="button" variant="outline" size="sm">
                                {language === "en" ? "Choose File" : "ファイルを選択"}
                              </Button>
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-medium">
                              {language === "en" ? "Insurance Certificate" : "保険証明書"}
                              <span className="text-red-500 ml-1">*</span>
                            </Label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center mt-2">
                              <Upload className="h-6 w-6 mx-auto text-gray-400 mb-2" />
                              <p className="text-sm text-gray-600 mb-2">
                                {language === "en" ? "Upload insurance certificate" : "保険証明書をアップロード"}
                              </p>
                              <Button type="button" variant="outline" size="sm">
                                {language === "en" ? "Choose File" : "ファイルを選択"}
                              </Button>
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-medium">
                              {language === "en" ? "Inspection Certificate (Shaken)" : "車検証明書"}
                            </Label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center mt-2">
                              <Upload className="h-6 w-6 mx-auto text-gray-400 mb-2" />
                              <p className="text-sm text-gray-600 mb-2">
                                {language === "en" ? "Upload inspection certificate" : "車検証明書をアップロード"}
                              </p>
                              <Button type="button" variant="outline" size="sm">
                                {language === "en" ? "Choose File" : "ファイルを選択"}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Legal Confirmations */}
                      <div className="space-y-3">
                        <h4 className="font-medium">{language === "en" ? "Legal Confirmations" : "法的確認"}</h4>

                        <div className="space-y-3">
                          <div className="flex items-start space-x-2">
                            <Checkbox
                              id="registrationValid"
                              checked={formData.registrationValid}
                              onCheckedChange={(checked) => handleInputChange("registrationValid", checked)}
                            />
                            <label htmlFor="registrationValid" className="text-sm leading-none">
                              {language === "en"
                                ? "I confirm that the vehicle registration is current and valid"
                                : "車両登録が現在有効であることを確認します"}
                            </label>
                          </div>

                          <div className="flex items-start space-x-2">
                            <Checkbox
                              id="insuranceValid"
                              checked={formData.insuranceValid}
                              onCheckedChange={(checked) => handleInputChange("insuranceValid", checked)}
                            />
                            <label htmlFor="insuranceValid" className="text-sm leading-none">
                              {language === "en"
                                ? "I confirm that the vehicle insurance is current and valid"
                                : "車両保険が現在有効であることを確認します"}
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <Button
                        type="button"
                        onClick={() => setCurrentStep("history")}
                        disabled={!isDocumentsComplete()}
                        className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90"
                      >
                        {language === "en" ? "Next: Vehicle History" : "次へ：車両履歴"}
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="history">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        {language === "en" ? "Vehicle History & Condition" : "車両履歴と状態"}
                      </h3>

                      <div className="space-y-6">
                        {/* Accident History */}
                        <div>
                          <Label className="text-sm font-medium">
                            {language === "en" ? "Accident History" : "事故歴"}
                            <span className="text-red-500 ml-1">*</span>
                          </Label>
                          <Select
                            value={formData.accidentHistory}
                            onValueChange={(value) => handleInputChange("accidentHistory", value)}
                          >
                            <SelectTrigger className="mt-2">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="no">{language === "en" ? "No accidents" : "事故歴なし"}</SelectItem>
                              <SelectItem value="minor">
                                {language === "en"
                                  ? "Minor accidents (cosmetic damage only)"
                                  : "軽微な事故（外観損傷のみ）"}
                              </SelectItem>
                              <SelectItem value="major">
                                {language === "en" ? "Major accidents (structural damage)" : "重大な事故（構造的損傷）"}
                              </SelectItem>
                            </SelectContent>
                          </Select>

                          {formData.accidentHistory !== "no" && (
                            <div className="mt-3">
                              <Label htmlFor="accidentDetails" className="text-sm font-medium">
                                {language === "en" ? "Accident Details" : "事故詳細"}
                              </Label>
                              <Textarea
                                id="accidentDetails"
                                value={formData.accidentDetails}
                                onChange={(e) => handleInputChange("accidentDetails", e.target.value)}
                                placeholder={
                                  language === "en"
                                    ? "Please describe the accidents, repairs made, and current condition"
                                    : "事故、修理内容、現在の状態について説明してください"
                                }
                                className="mt-2"
                                rows={3}
                              />
                            </div>
                          )}
                        </div>

                        {/* Service History */}
                        <div>
                          <Label className="text-sm font-medium">
                            {language === "en" ? "Service History" : "整備履歴"}
                            <span className="text-red-500 ml-1">*</span>
                          </Label>
                          <Select
                            value={formData.serviceHistory}
                            onValueChange={(value) => handleInputChange("serviceHistory", value)}
                          >
                            <SelectTrigger className="mt-2">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="complete">
                                {language === "en" ? "Complete service records available" : "完全な整備記録あり"}
                              </SelectItem>
                              <SelectItem value="partial">
                                {language === "en" ? "Partial service records" : "部分的な整備記録"}
                              </SelectItem>
                              <SelectItem value="none">
                                {language === "en" ? "No service records" : "整備記録なし"}
                              </SelectItem>
                            </SelectContent>
                          </Select>

                          {formData.serviceHistory !== "none" && (
                            <div className="mt-3">
                              <Label className="text-sm font-medium">
                                {language === "en" ? "Upload Service Records" : "整備記録をアップロード"}
                              </Label>
                              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center mt-2">
                                <Upload className="h-6 w-6 mx-auto text-gray-400 mb-2" />
                                <p className="text-sm text-gray-600 mb-2">
                                  {language === "en"
                                    ? "Upload service records and receipts"
                                    : "整備記録と領収書をアップロード"}
                                </p>
                                <Button type="button" variant="outline" size="sm">
                                  {language === "en" ? "Choose Files" : "ファイルを選択"}
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Previous Owners */}
                        <div>
                          <Label className="text-sm font-medium">
                            {language === "en" ? "Number of Previous Owners" : "前オーナー数"}
                            <span className="text-red-500 ml-1">*</span>
                          </Label>
                          <Select
                            value={formData.previousOwners}
                            onValueChange={(value) => handleInputChange("previousOwners", value)}
                          >
                            <SelectTrigger className="mt-2">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">
                                {language === "en" ? "1 owner (me)" : "1オーナー（私）"}
                              </SelectItem>
                              <SelectItem value="2">{language === "en" ? "2 owners" : "2オーナー"}</SelectItem>
                              <SelectItem value="3">{language === "en" ? "3 owners" : "3オーナー"}</SelectItem>
                              <SelectItem value="4+">{language === "en" ? "4+ owners" : "4+オーナー"}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Modifications */}
                        <div>
                          <Label className="text-sm font-medium">
                            {language === "en" ? "Vehicle Modifications" : "車両改造"}
                          </Label>
                          <Select
                            value={formData.modifications}
                            onValueChange={(value) => handleInputChange("modifications", value)}
                          >
                            <SelectTrigger className="mt-2">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="no">{language === "en" ? "No modifications" : "改造なし"}</SelectItem>
                              <SelectItem value="cosmetic">
                                {language === "en" ? "Cosmetic modifications only" : "外観改造のみ"}
                              </SelectItem>
                              <SelectItem value="performance">
                                {language === "en" ? "Performance modifications" : "性能改造"}
                              </SelectItem>
                            </SelectContent>
                          </Select>

                          {formData.modifications !== "no" && (
                            <div className="mt-3">
                              <Label htmlFor="modificationDetails" className="text-sm font-medium">
                                {language === "en" ? "Modification Details" : "改造詳細"}
                              </Label>
                              <Textarea
                                id="modificationDetails"
                                value={formData.modificationDetails}
                                onChange={(e) => handleInputChange("modificationDetails", e.target.value)}
                                placeholder={
                                  language === "en"
                                    ? "Please describe all modifications made to the vehicle"
                                    : "車両に施されたすべての改造について説明してください"
                                }
                                className="mt-2"
                                rows={3}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 flex justify-between">
                      <Button type="button" variant="outline" onClick={() => setCurrentStep("documents")}>
                        {language === "en" ? "Back" : "戻る"}
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setCurrentStep("inspection")}
                        disabled={!isHistoryComplete()}
                        className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90"
                      >
                        {language === "en" ? "Next: Physical Inspection" : "次へ：物理検査"}
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="inspection">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        {language === "en" ? "Physical Inspection" : "物理検査"}
                      </h3>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <div className="flex items-start gap-3">
                          <Award className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium text-blue-800 mb-1">
                              {language === "en" ? "Professional Inspection" : "プロ検査"}
                            </h4>
                            <p className="text-sm text-blue-700">
                              {language === "en"
                                ? "A certified inspector will verify the vehicle's condition, authenticity, and compliance. This adds significant value to your listing."
                                : "認定検査員が車両の状態、真正性、コンプライアンスを確認します。これにより、あなたの出品に大きな価値が加わります。"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        {/* Inspection Preference */}
                        <div>
                          <Label className="text-sm font-medium">
                            {language === "en" ? "Inspection Preference" : "検査希望"}
                            <span className="text-red-500 ml-1">*</span>
                          </Label>
                          <Select
                            value={formData.inspectionPreference}
                            onValueChange={(value) => handleInputChange("inspectionPreference", value)}
                          >
                            <SelectTrigger className="mt-2">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="basic">
                                {language === "en"
                                  ? "Basic Inspection - ¥15,000 (1-2 hours)"
                                  : "基本点検 - ¥15,000（1-2時間）"}
                              </SelectItem>
                              <SelectItem value="comprehensive">
                                {language === "en"
                                  ? "Comprehensive Inspection - ¥25,000 (2-3 hours)"
                                  : "総合点検 - ¥25,000（2-3時間）"}
                              </SelectItem>
                              <SelectItem value="premium">
                                {language === "en"
                                  ? "Premium Inspection - ¥35,000 (3-4 hours)"
                                  : "プレミアム点検 - ¥35,000（3-4時間）"}
                              </SelectItem>
                              <SelectItem value="skip">
                                {language === "en"
                                  ? "Skip physical inspection (document verification only)"
                                  : "物理検査をスキップ（書類確認のみ）"}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {formData.inspectionPreference !== "skip" && (
                          <>
                            {/* Inspection Scheduling */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="inspectionDate" className="text-sm font-medium">
                                  {language === "en" ? "Preferred Date" : "希望日"}
                                  <span className="text-red-500 ml-1">*</span>
                                </Label>
                                <Input
                                  id="inspectionDate"
                                  type="date"
                                  value={formData.inspectionDate}
                                  onChange={(e) => handleInputChange("inspectionDate", e.target.value)}
                                  min={new Date().toISOString().split("T")[0]}
                                  className="mt-2"
                                />
                              </div>
                              <div>
                                <Label htmlFor="inspectionTime" className="text-sm font-medium">
                                  {language === "en" ? "Preferred Time" : "希望時間"}
                                  <span className="text-red-500 ml-1">*</span>
                                </Label>
                                <Select
                                  value={formData.inspectionTime}
                                  onValueChange={(value) => handleInputChange("inspectionTime", value)}
                                >
                                  <SelectTrigger className="mt-2">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="09:00">09:00 - 10:00</SelectItem>
                                    <SelectItem value="10:00">10:00 - 11:00</SelectItem>
                                    <SelectItem value="11:00">11:00 - 12:00</SelectItem>
                                    <SelectItem value="13:00">13:00 - 14:00</SelectItem>
                                    <SelectItem value="14:00">14:00 - 15:00</SelectItem>
                                    <SelectItem value="15:00">15:00 - 16:00</SelectItem>
                                    <SelectItem value="16:00">16:00 - 17:00</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            {formData.inspectionPreference === "mobile" && (
                              <div>
                                <Label htmlFor="inspectionLocation" className="text-sm font-medium">
                                  {language === "en" ? "Inspection Location" : "検査場所"}
                                  <span className="text-red-500 ml-1">*</span>
                                </Label>
                                <Input
                                  id="inspectionLocation"
                                  value={formData.inspectionLocation}
                                  onChange={(e) => handleInputChange("inspectionLocation", e.target.value)}
                                  placeholder={
                                    language === "en"
                                      ? "Full address where vehicle can be inspected"
                                      : "車両を検査できる完全な住所"
                                  }
                                  className="mt-2"
                                />
                              </div>
                            )}

                            <div>
                              <Label htmlFor="specialInstructions" className="text-sm font-medium">
                                {language === "en" ? "Special Instructions" : "特別な指示"}
                              </Label>
                              <Textarea
                                id="specialInstructions"
                                value={formData.specialInstructions}
                                onChange={(e) => handleInputChange("specialInstructions", e.target.value)}
                                placeholder={
                                  language === "en"
                                    ? "Any special instructions for the inspector (parking, access, etc.)"
                                    : "検査員への特別な指示（駐車場、アクセスなど）"
                                }
                                className="mt-2"
                                rows={3}
                              />
                            </div>
                          </>
                        )}

                        {formData.inspectionPreference === "skip" && (
                          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                              <div>
                                <h4 className="font-medium text-amber-800 mb-1">
                                  {language === "en" ? "Document Verification Only" : "書類確認のみ"}
                                </h4>
                                <p className="text-sm text-amber-700">
                                  {language === "en"
                                    ? "Without physical inspection, your vehicle will receive basic verification only. Physical inspection significantly increases buyer trust and listing value."
                                    : "物理検査なしでは、車両は基本的な認証のみを受けます。物理検査により、購入者の信頼と出品価値が大幅に向上します。"}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 flex justify-between">
                      <Button type="button" variant="outline" onClick={() => setCurrentStep("history")}>
                        {language === "en" ? "Back" : "戻る"}
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setCurrentStep("review")}
                        disabled={!isInspectionComplete()}
                        className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90"
                      >
                        {language === "en" ? "Next: Review & Submit" : "次へ：確認と送信"}
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="review">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">
                        {language === "en" ? "Review & Submit" : "確認と送信"}
                      </h3>

                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium text-amber-800 mb-1">
                              {language === "en" ? "Final Review" : "最終確認"}
                            </h4>
                            <p className="text-sm text-amber-700">
                              {language === "en"
                                ? "Please review all information carefully. Once submitted, our verification team will process your request within 2-3 business days."
                                : "すべての情報を慎重に確認してください。送信後、認証チームが2〜3営業日以内にリクエストを処理します。"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Summary Sections */}
                      <div className="space-y-6">
                        {/* Vehicle & Ownership Summary */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-medium mb-3">
                            {language === "en" ? "Vehicle & Ownership" : "車両と所有権"}
                          </h4>
                          <div className="grid grid-cols-2 gap-y-2 text-sm">
                            <div className="text-gray-500">{language === "en" ? "Vehicle:" : "車両:"}</div>
                            <div>{displayVehicle.title}</div>
                            <div className="text-gray-500">{language === "en" ? "VIN:" : "車台番号:"}</div>
                            <div>{displayVehicle.vin}</div>
                            <div className="text-gray-500">{language === "en" ? "Owner:" : "所有者:"}</div>
                            <div>{formData.ownerName}</div>
                            <div className="text-gray-500">
                              {language === "en" ? "Ownership Type:" : "所有権タイプ:"}
                            </div>
                            <div>
                              {formData.ownershipType === "owner"
                                ? language === "en"
                                  ? "Owner"
                                  : "所有者"
                                : formData.ownershipType === "authorized"
                                  ? language === "en"
                                    ? "Authorized"
                                    : "権限あり"
                                  : language === "en"
                                    ? "Dealer"
                                    : "ディーラー"}
                            </div>
                          </div>
                        </div>

                        {/* History Summary */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-medium mb-3">{language === "en" ? "Vehicle History" : "車両履歴"}</h4>
                          <div className="grid grid-cols-2 gap-y-2 text-sm">
                            <div className="text-gray-500">{language === "en" ? "Accident History:" : "事故歴:"}</div>
                            <div>
                              {formData.accidentHistory === "no"
                                ? language === "en"
                                  ? "No accidents"
                                  : "事故歴なし"
                                : formData.accidentHistory === "minor"
                                  ? language === "en"
                                    ? "Minor accidents"
                                    : "軽微な事故"
                                  : language === "en"
                                    ? "Major accidents"
                                    : "重大な事故"}
                            </div>
                            <div className="text-gray-500">{language === "en" ? "Service History:" : "整備履歴:"}</div>
                            <div>
                              {formData.serviceHistory === "complete"
                                ? language === "en"
                                  ? "Complete records"
                                  : "完全な記録"
                                : formData.serviceHistory === "partial"
                                  ? language === "en"
                                    ? "Partial records"
                                    : "部分的な記録"
                                  : language === "en"
                                    ? "No records"
                                    : "記録なし"}
                            </div>
                            <div className="text-gray-500">
                              {language === "en" ? "Previous Owners:" : "前オーナー数:"}
                            </div>
                            <div>{formData.previousOwners}</div>
                          </div>
                        </div>

                        {/* Inspection Summary */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-medium mb-3">{language === "en" ? "Inspection Plan" : "検査計画"}</h4>
                          <div className="grid grid-cols-2 gap-y-2 text-sm">
                            <div className="text-gray-500">{language === "en" ? "Type:" : "タイプ:"}</div>
                            <div>
                              {formData.inspectionPreference === "basic"
                                ? language === "en"
                                  ? "Basic Inspection"
                                  : "基本点検"
                                : formData.inspectionPreference === "comprehensive"
                                  ? language === "en"
                                    ? "Comprehensive Inspection"
                                    : "総合点検"
                                  : formData.inspectionPreference === "premium"
                                    ? language === "en"
                                      ? "Premium Inspection"
                                      : "プレミアム点検"
                                    : language === "en"
                                      ? "Document Only"
                                      : "書類のみ"}
                            </div>
                            {formData.inspectionPreference !== "skip" && (
                              <>
                                <div className="text-gray-500">{language === "en" ? "Date:" : "日付:"}</div>
                                <div>{formData.inspectionDate}</div>
                                <div className="text-gray-500">{language === "en" ? "Time:" : "時間:"}</div>
                                <div>{formData.inspectionTime}</div>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Cost Summary */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-medium mb-3">{language === "en" ? "Verification Cost" : "認証費用"}</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>{language === "en" ? "Document Verification:" : "書類確認:"}</span>
                              <span className="text-green-600 font-semibold">
                                {language === "en" ? "FREE" : "無料"}
                              </span>
                            </div>
                            {formData.inspectionPreference === "basic" && (
                              <div className="flex justify-between">
                                <span>{language === "en" ? "Basic Inspection:" : "基本点検:"}</span>
                                <span>¥15,000</span>
                              </div>
                            )}
                            {formData.inspectionPreference === "comprehensive" && (
                              <div className="flex justify-between">
                                <span>{language === "en" ? "Comprehensive Inspection:" : "総合点検:"}</span>
                                <span>¥25,000</span>
                              </div>
                            )}
                            {formData.inspectionPreference === "premium" && (
                              <div className="flex justify-between">
                                <span>{language === "en" ? "Premium Inspection:" : "プレミアム点検:"}</span>
                                <span>¥35,000</span>
                              </div>
                            )}
                            <Separator />
                            <div className="flex justify-between font-semibold">
                              <span>{language === "en" ? "Total:" : "合計:"}</span>
                              <span>
                                {formData.inspectionPreference === "skip"
                                  ? language === "en"
                                    ? "FREE"
                                    : "無料"
                                  : `¥${
                                      formData.inspectionPreference === "basic"
                                        ? "15,000"
                                        : formData.inspectionPreference === "comprehensive"
                                          ? "25,000"
                                          : formData.inspectionPreference === "premium"
                                            ? "35,000"
                                            : "0"
                                    }`}
                              </span>
                            </div>
                            {formData.inspectionPreference === "skip" && (
                              <p className="text-xs text-green-700 mt-2">
                                {language === "en"
                                  ? "Document verification is provided at no cost."
                                  : "書類確認は無料で提供されています。"}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Legal Confirmations */}
                        <div className="space-y-3">
                          <h4 className="font-medium">{language === "en" ? "Final Confirmations" : "最終確認"}</h4>

                          <div className="space-y-3">
                            <div className="flex items-start space-x-2">
                              <Checkbox
                                id="legalOwnership"
                                checked={formData.legalOwnership}
                                onCheckedChange={(checked) => handleInputChange("legalOwnership", checked)}
                              />
                              <label htmlFor="legalOwnership" className="text-sm leading-none">
                                {language === "en"
                                  ? "I confirm that I have legal authority to sell this vehicle"
                                  : "この車両を販売する法的権限があることを確認します"}
                              </label>
                            </div>

                            <div className="flex items-start space-x-2">
                              <Checkbox
                                id="noLiens"
                                checked={formData.noLiens}
                                onCheckedChange={(checked) => handleInputChange("noLiens", checked)}
                              />
                              <label htmlFor="noLiens" className="text-sm leading-none">
                                {language === "en"
                                  ? "I confirm that there are no outstanding liens or loans on this vehicle"
                                  : "この車両に未払いの担保権やローンがないことを確認します"}
                              </label>
                            </div>

                            <div className="flex items-start space-x-2">
                              <Checkbox
                                id="accurateInfo"
                                checked={formData.accurateInfo}
                                onCheckedChange={(checked) => handleInputChange("accurateInfo", checked)}
                              />
                              <label htmlFor="accurateInfo" className="text-sm leading-none">
                                {language === "en"
                                  ? "I confirm that all information provided is accurate and complete"
                                  : "提供されたすべての情報が正確で完全であることを確認します"}
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 flex justify-between">
                      <Button type="button" variant="outline" onClick={() => setCurrentStep("inspection")}>
                        {language === "en" ? "Back" : "戻る"}
                      </Button>
                      <Button
                        onClick={handleSubmit}
                        disabled={!isComplianceComplete() || isSubmitting}
                        className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90"
                      >
                        {isSubmitting
                          ? language === "en"
                            ? "Submitting..."
                            : "送信中..."
                          : language === "en"
                            ? "Submit Vehicle Verification"
                            : "車両認証を送信"}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
