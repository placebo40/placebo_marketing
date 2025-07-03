"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, Check, CheckCircle, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { saveSellerListing } from "@/lib/seller-listings"
import { ComplianceAlert } from "@/components/compliance-alert"
import { checkComplianceStatus } from "@/lib/compliance"
import { getSellerListings } from "@/lib/seller-listings"
import { ValidatedImageUpload } from "@/components/validated-image-upload"

// Form steps
const STEPS = {
  VEHICLE_INFO: 0,
  VEHICLE_DETAILS: 1,
  PHOTOS: 2,
  PRICING: 3,
  REVIEW: 4,
}

// Vehicle makes and models
const vehicleMakes = [
  "Toyota",
  "Honda",
  "Nissan",
  "Mazda",
  "Suzuki",
  "Daihatsu",
  "Mitsubishi",
  "Subaru",
  "Lexus",
  "Other",
]

// Current year for form validation
const currentYear = new Date().getFullYear()

export default function ListCarPage() {
  const { language, t } = useLanguage()
  const router = useRouter()
  const [step, setStep] = useState(STEPS.VEHICLE_INFO)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    // Vehicle Info
    make: "",
    model: "",
    year: currentYear.toString(),
    mileage: "",
    color: "",
    interiorColor: "", // Add interior color field
    vin: "", // Add VIN field
    plateNumber: "", // Add plate number field
    fuelType: "",
    transmission: "",
    // Vehicle Details
    bodyType: "",
    doors: "",
    seats: "",
    engineSize: "",
    features: [] as string[],
    condition: "",
    description: "",
    // Photos
    photos: [] as string[],
    // Pricing
    price: "",
    negotiable: false,
    // Seller info will be retrieved from user context/session
    sellerType: "private", // This would come from user profile
    termsAccepted: false,
  })

  const [complianceStatus, setComplianceStatus] = useState(null)
  const [canProceed, setCanProceed] = useState(true)

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Check compliance for private seller
    const existingListings = getSellerListings()
    const activeListings = existingListings.filter((l) => l.status !== "sold").length

    // Simulate sales history
    const vehiclesSoldThisYear = Math.floor(Math.random() * 4)

    const status = checkComplianceStatus("private", vehiclesSoldThisYear, activeListings + 1)
    setComplianceStatus(status)

    // Block listing if license required
    if (status.requiresLicense) {
      setCanProceed(false)
    }
  }, [])

  // Handle file upload
  // const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const files = event.target.files
  //   if (files) {
  //     Array.from(files).forEach((file) => {
  //       if (file.type.startsWith("image/")) {
  //         const reader = new FileReader()
  //         reader.onload = (e) => {
  //           const result = e.target?.result as string
  //           setFormData((prev) => ({
  //             ...prev,
  //             photos: [...prev.photos, result],
  //           }))
  //         }
  //         reader.readAsDataURL(file)
  //       }
  //     })
  //   }
  //   // Reset the input
  //   if (event.target) {
  //     event.target.value = ""
  //   }
  // }

  // Progress calculation
  const progress = ((step + 1) / Object.keys(STEPS).length) * 100

  // Update form data
  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Toggle feature selection
  const toggleFeature = (feature: string) => {
    setFormData((prev) => {
      const features = [...prev.features]
      if (features.includes(feature)) {
        return { ...prev, features: features.filter((f) => f !== feature) }
      } else {
        return { ...prev, features: [...features, feature] }
      }
    })
  }

  // Remove photo
  // const removePhoto = (index: number) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     photos: prev.photos.filter((_, i) => i !== index),
  //   }))
  // }

  // Next step
  const nextStep = () => {
    if (step < STEPS.REVIEW) {
      setStep((prev) => prev + 1)
      window.scrollTo(0, 0)
    }
  }

  // Previous step
  const prevStep = () => {
    if (step > STEPS.VEHICLE_INFO) {
      setStep((prev) => prev - 1)
      window.scrollTo(0, 0)
    }
  }

  // Submit form
  const handleSubmit = async () => {
    setIsSubmitting(true)

    // Add seller information from user context (simulated here)
    const completeFormData = {
      ...formData,
      askingPrice: formData.price, // Map price to askingPrice
      // Remove the price field since we're using askingPrice
      price: undefined,
      // These would come from the authenticated user's profile
      name: "John Doe", // From user session
      email: "john.doe@example.com", // From user session
      phone: "+81 90-1234-5678", // From user profile
      location: "Naha, Okinawa", // From user profile
      preferredContact: "email", // From user preferences
      termsAccepted: true, // Assumed accepted during registration
    }

    // Save the listing to localStorage
    const savedListing = saveSellerListing(completeFormData)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Store the listing ID for the confirmation page
    localStorage.setItem("lastSellerListingId", savedListing.listingID)

    // Navigate to confirmation page
    router.push("/list-car/confirmation")

    setIsSubmitting(false)
  }

  // Form validation for current step
  const isCurrentStepValid = () => {
    switch (step) {
      case STEPS.VEHICLE_INFO:
        // Only require essential fields - VIN and plate number are optional
        return formData.make && formData.model && formData.year && formData.mileage
      case STEPS.VEHICLE_DETAILS:
        return formData.bodyType && formData.condition && formData.description
      case STEPS.PHOTOS:
        return formData.photos.length > 0
      case STEPS.PRICING:
        return formData.price
      case STEPS.REVIEW:
        return formData.termsAccepted
      default:
        return true
    }
  }

  // Render form based on current step
  const renderForm = () => {
    switch (step) {
      case STEPS.VEHICLE_INFO:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="make">{language === "en" ? "Make" : "メーカー"} *</Label>
                <Select value={formData.make} onValueChange={(value) => updateFormData("make", value)}>
                  <SelectTrigger id="make">
                    <SelectValue placeholder={language === "en" ? "Select make" : "メーカーを選択"} />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleMakes.map((make) => (
                      <SelectItem key={make} value={make}>
                        {make}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">{language === "en" ? "Model" : "モデル"} *</Label>
                <Input
                  id="model"
                  placeholder={language === "en" ? "e.g. Aqua, Fit, Note" : "例：アクア、フィット、ノート"}
                  value={formData.model}
                  onChange={(e) => updateFormData("model", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">{language === "en" ? "Year" : "年式"} *</Label>
                <Select value={formData.year} onValueChange={(value) => updateFormData("year", value)}>
                  <SelectTrigger id="year">
                    <SelectValue placeholder={language === "en" ? "Select year" : "年式を選択"} />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 20 }, (_, i) => currentYear - i).map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mileage">{language === "en" ? "Mileage (km)" : "走行距離 (km)"} *</Label>
                <Input
                  id="mileage"
                  type="number"
                  placeholder="e.g. 45000"
                  value={formData.mileage}
                  onChange={(e) => updateFormData("mileage", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">{language === "en" ? "Exterior Color" : "外装色"}</Label>
                <Input
                  id="color"
                  placeholder={language === "en" ? "e.g. White, Black, Silver" : "例：白、黒、シルバー"}
                  value={formData.color}
                  onChange={(e) => updateFormData("color", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="interiorColor">{language === "en" ? "Interior Color" : "内装色"}</Label>
                <Input
                  id="interiorColor"
                  placeholder={language === "en" ? "e.g. Black, Beige, Gray" : "例：黒、ベージュ、グレー"}
                  value={formData.interiorColor}
                  onChange={(e) => updateFormData("interiorColor", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vin">{language === "en" ? "VIN/Chassis Number (Optional)" : "車台番号（任意）"}</Label>
                <Input
                  id="vin"
                  placeholder={language === "en" ? "Vehicle identification number" : "車両識別番号"}
                  value={formData.vin}
                  onChange={(e) => updateFormData("vin", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="plateNumber">
                  {language === "en" ? "License Plate Number (Optional)" : "ナンバープレート（任意）"}
                </Label>
                <Input
                  id="plateNumber"
                  placeholder={language === "en" ? "e.g. 沖縄 500 あ 1234" : "例：沖縄 500 あ 1234"}
                  value={formData.plateNumber}
                  onChange={(e) => updateFormData("plateNumber", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fuelType">{language === "en" ? "Fuel Type" : "燃料タイプ"}</Label>
                <Select value={formData.fuelType} onValueChange={(value) => updateFormData("fuelType", value)}>
                  <SelectTrigger id="fuelType">
                    <SelectValue placeholder={language === "en" ? "Select fuel type" : "燃料タイプを選択"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gasoline">{language === "en" ? "Gasoline" : "ガソリン"}</SelectItem>
                    <SelectItem value="diesel">{language === "en" ? "Diesel" : "ディーゼル"}</SelectItem>
                    <SelectItem value="hybrid">{language === "en" ? "Hybrid" : "ハイブリッド"}</SelectItem>
                    <SelectItem value="electric">{language === "en" ? "Electric" : "電気"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="transmission">{language === "en" ? "Transmission" : "トランスミッション"}</Label>
                <Select value={formData.transmission} onValueChange={(value) => updateFormData("transmission", value)}>
                  <SelectTrigger id="transmission">
                    <SelectValue placeholder={language === "en" ? "Select transmission" : "トランスミッションを選択"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="automatic">{language === "en" ? "Automatic" : "オートマチック"}</SelectItem>
                    <SelectItem value="manual">{language === "en" ? "Manual" : "マニュアル"}</SelectItem>
                    <SelectItem value="cvt">CVT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )

      case STEPS.VEHICLE_DETAILS:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="bodyType">{language === "en" ? "Body Type" : "ボディタイプ"} *</Label>
                <Select value={formData.bodyType} onValueChange={(value) => updateFormData("bodyType", value)}>
                  <SelectTrigger id="bodyType">
                    <SelectValue placeholder={language === "en" ? "Select body type" : "ボディタイプを選択"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedan">{language === "en" ? "Sedan" : "セダン"}</SelectItem>
                    <SelectItem value="hatchback">{language === "en" ? "Hatchback" : "ハッチバック"}</SelectItem>
                    <SelectItem value="suv">SUV</SelectItem>
                    <SelectItem value="minivan">{language === "en" ? "Minivan" : "ミニバン"}</SelectItem>
                    <SelectItem value="kei">{language === "en" ? "Kei Car" : "軽自動車"}</SelectItem>
                    <SelectItem value="wagon">{language === "en" ? "Wagon" : "ワゴン"}</SelectItem>
                    <SelectItem value="truck">{language === "en" ? "Truck" : "トラック"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="doors">{language === "en" ? "Doors" : "ドア数"}</Label>
                <Select value={formData.doors} onValueChange={(value) => updateFormData("doors", value)}>
                  <SelectTrigger id="doors">
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

              <div className="space-y-2">
                <Label htmlFor="seats">{language === "en" ? "Seats" : "座席数"}</Label>
                <Select value={formData.seats} onValueChange={(value) => updateFormData("seats", value)}>
                  <SelectTrigger id="seats">
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

              <div className="space-y-2">
                <Label htmlFor="engineSize">{language === "en" ? "Engine Size (L)" : "エンジン排気量 (L)"}</Label>
                <Input
                  id="engineSize"
                  placeholder="e.g. 1.5"
                  value={formData.engineSize}
                  onChange={(e) => updateFormData("engineSize", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{language === "en" ? "Features" : "装備"}</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {[
                  "Air Conditioning",
                  "Power Steering",
                  "Power Windows",
                  "Navigation",
                  "Backup Camera",
                  "Bluetooth",
                  "Keyless Entry",
                  "Sunroof",
                  "Leather Seats",
                  "Alloy Wheels",
                  "Cruise Control",
                  "Safety Package",
                ].map((feature) => (
                  <div key={feature} className="flex items-center space-x-2">
                    <Checkbox
                      id={`feature-${feature}`}
                      checked={formData.features.includes(feature)}
                      onCheckedChange={() => toggleFeature(feature)}
                    />
                    <label
                      htmlFor={`feature-${feature}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {feature}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="condition">{language === "en" ? "Vehicle Condition" : "車両状態"} *</Label>
              <RadioGroup
                value={formData.condition}
                onValueChange={(value) => updateFormData("condition", value)}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="excellent" id="excellent" />
                  <Label htmlFor="excellent" className="font-normal">
                    {language === "en" ? "Excellent" : "優良"}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="very-good" id="very-good" />
                  <Label htmlFor="very-good" className="font-normal">
                    {language === "en" ? "Very Good" : "とても良い"}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="good" id="good" />
                  <Label htmlFor="good" className="font-normal">
                    {language === "en" ? "Good" : "良い"}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fair" id="fair" />
                  <Label htmlFor="fair" className="font-normal">
                    {language === "en" ? "Fair" : "普通"}
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{language === "en" ? "Description" : "説明"} *</Label>
              <Textarea
                id="description"
                placeholder={
                  language === "en"
                    ? "Describe your vehicle, including any special features, history, or other details potential buyers should know."
                    : "車両について説明してください。特別な機能、履歴、または他の詳細を含めてください。"
                }
                value={formData.description}
                onChange={(e) => updateFormData("description", e.target.value)}
                rows={5}
              />
            </div>
          </div>
        )

      case STEPS.PHOTOS:
        return (
          <div className="space-y-6">
            <ValidatedImageUpload
              images={formData.photos}
              onImagesChange={(photos) => updateFormData("photos", photos)}
              maxImages={10}
              language={language}
            />
          </div>
        )

      case STEPS.PRICING:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="price">{language === "en" ? "Price (JPY)" : "価格 (円)"} *</Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-placebo-dark-gray">¥</span>
                  <Input
                    id="price"
                    type="number"
                    placeholder="e.g. 1250000"
                    className="pl-7"
                    value={formData.price}
                    onChange={(e) => updateFormData("price", e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="negotiable"
                checked={formData.negotiable}
                onCheckedChange={(checked) => updateFormData("negotiable", checked)}
              />
              <label
                htmlFor="negotiable"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {language === "en" ? "Price is negotiable" : "価格は交渉可能"}
              </label>
            </div>

            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-500" />
              <AlertTitle className="text-blue-700">
                {language === "en" ? "Pricing Tips" : "価格設定のヒント"}
              </AlertTitle>
              <AlertDescription className="text-blue-600">
                {language === "en"
                  ? "Research similar vehicles in the Okinawa market to set a competitive price. Consider factors like age, mileage, condition, and special features."
                  : "沖縄市場の同様の車両を調査して、競争力のある価格を設定してください。年齢、走行距離、状態、特別な機能などの要素を考慮してください。"}
              </AlertDescription>
            </Alert>
          </div>
        )

      case STEPS.REVIEW:
        return (
          <div className="space-y-6">
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertTitle className="text-green-700">
                {language === "en" ? "Almost Done!" : "もう少しで完了です！"}
              </AlertTitle>
              <AlertDescription className="text-green-600">
                {language === "en"
                  ? "Please review your listing details before submitting. You can go back to make changes if needed."
                  : "送信する前にリスティングの詳細を確認してください。必要に応じて戻って変更することができます。"}
              </AlertDescription>
            </Alert>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{language === "en" ? "Vehicle Information" : "車両情報"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                    <div>
                      <dt className="text-sm text-placebo-dark-gray">{language === "en" ? "Make" : "メーカー"}</dt>
                      <dd className="font-medium">{formData.make}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-placebo-dark-gray">{language === "en" ? "Model" : "モデル"}</dt>
                      <dd className="font-medium">{formData.model}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-placebo-dark-gray">{language === "en" ? "Year" : "年式"}</dt>
                      <dd className="font-medium">{formData.year}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-placebo-dark-gray">{language === "en" ? "Mileage" : "走行距離"}</dt>
                      <dd className="font-medium">{formData.mileage} km</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-placebo-dark-gray">
                        {language === "en" ? "Exterior Color" : "外装色"}
                      </dt>
                      <dd className="font-medium">{formData.color || "-"}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-placebo-dark-gray">
                        {language === "en" ? "Interior Color" : "内装色"}
                      </dt>
                      <dd className="font-medium">{formData.interiorColor || "-"}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-placebo-dark-gray">{language === "en" ? "VIN" : "車台番号"}</dt>
                      <dd className="font-medium">{formData.vin || "-"}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-placebo-dark-gray">
                        {language === "en" ? "Plate Number" : "ナンバープレート"}
                      </dt>
                      <dd className="font-medium">{formData.plateNumber || "-"}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-placebo-dark-gray">
                        {language === "en" ? "Fuel Type" : "燃料タイプ"}
                      </dt>
                      <dd className="font-medium">{formData.fuelType || "-"}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-placebo-dark-gray">
                        {language === "en" ? "Transmission" : "トランスミッション"}
                      </dt>
                      <dd className="font-medium">{formData.transmission || "-"}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-placebo-dark-gray">
                        {language === "en" ? "Body Type" : "ボディタイプ"}
                      </dt>
                      <dd className="font-medium">{formData.bodyType}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-placebo-dark-gray">{language === "en" ? "Condition" : "状態"}</dt>
                      <dd className="font-medium">{formData.condition}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-placebo-dark-gray">{language === "en" ? "Price" : "価格"}</dt>
                      <dd className="font-medium text-placebo-gold">
                        ¥{Number(formData.price).toLocaleString()}
                        {formData.negotiable && (
                          <span className="text-sm text-placebo-dark-gray ml-2">
                            {language === "en" ? "(Negotiable)" : "(交渉可能)"}
                          </span>
                        )}
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{language === "en" ? "Photos" : "写真"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                    {formData.photos.map((photo, index) => (
                      <div key={index} className="aspect-[4/3] rounded-md overflow-hidden">
                        <img
                          src={photo || "/placeholder.svg"}
                          alt={`Vehicle photo ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="flex items-start space-x-2 pt-4">
                <Checkbox
                  id="terms"
                  checked={formData.termsAccepted}
                  onCheckedChange={(checked) => updateFormData("termsAccepted", checked)}
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {language === "en" ? "I accept the terms and conditions" : "利用規約に同意します"}
                  </label>
                  <p className="text-sm text-placebo-dark-gray">
                    {language === "en"
                      ? "By submitting this listing, you agree to our terms of service and privacy policy."
                      : "このリスティングを送信することにより、利用規約とプライバシーポリシーに同意したことになります。"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-placebo-black">
            {language === "en" ? "List Your Vehicle" : "あなたの車両を出品する"}
          </h1>
          <p className="mt-2 text-placebo-dark-gray">
            {language === "en"
              ? "Complete the form below to list your vehicle on Placebo Marketing."
              : "以下のフォームに記入して、プラセボマーケティングにあなたの車両をリストしてください。"}
          </p>
        </div>

        {/* Compliance Check */}
        {complianceStatus && complianceStatus.warningLevel !== "none" && (
          <div className="mb-8">
            <ComplianceAlert status={complianceStatus} language={language} showActions={true} />
          </div>
        )}

        <div className="mb-8">
          <Progress value={progress} className="h-2 bg-gray-200" />
          <div className="mt-2 flex justify-between text-sm text-placebo-dark-gray">
            <span>
              {language === "en" ? "Step" : "ステップ"} {step + 1} {language === "en" ? "of" : "/"}{" "}
              {Object.keys(STEPS).length}
            </span>
            <span>
              {language === "en" ? "Progress" : "進捗"}: {Math.round(progress)}%
            </span>
          </div>
        </div>

        <Tabs defaultValue={step.toString()} value={step.toString()} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger
              value="0"
              disabled
              className="data-[state=active]:bg-placebo-gold data-[state=active]:text-placebo-black"
            >
              {language === "en" ? "Basic Info" : "基本情報"}
            </TabsTrigger>
            <TabsTrigger
              value="1"
              disabled
              className="data-[state=active]:bg-placebo-gold data-[state=active]:text-placebo-black"
            >
              {language === "en" ? "Details" : "詳細"}
            </TabsTrigger>
            <TabsTrigger
              value="2"
              disabled
              className="data-[state=active]:bg-placebo-gold data-[state=active]:text-placebo-black"
            >
              {language === "en" ? "Photos" : "写真"}
            </TabsTrigger>
            <TabsTrigger
              value="3"
              disabled
              className="data-[state=active]:bg-placebo-gold data-[state=active]:text-placebo-black"
            >
              {language === "en" ? "Pricing" : "価格"}
            </TabsTrigger>
            <TabsTrigger
              value="4"
              disabled
              className="data-[state=active]:bg-placebo-gold data-[state=active]:text-placebo-black"
            >
              {language === "en" ? "Review" : "確認"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value={step.toString()} className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>
                  {step === STEPS.VEHICLE_INFO && (language === "en" ? "Vehicle Information" : "車両情報")}
                  {step === STEPS.VEHICLE_DETAILS && (language === "en" ? "Vehicle Details" : "車両詳細")}
                  {step === STEPS.PHOTOS && (language === "en" ? "Vehicle Photos" : "車両写真")}
                  {step === STEPS.PRICING && (language === "en" ? "Pricing Information" : "価格情報")}
                  {step === STEPS.REVIEW && (language === "en" ? "Review & Submit" : "確認と送信")}
                </CardTitle>
                <CardDescription>
                  {step === STEPS.VEHICLE_INFO &&
                    (language === "en"
                      ? "Enter the basic information about your vehicle."
                      : "あなたの車両に関する基本情報を入力してください。")}
                  {step === STEPS.VEHICLE_DETAILS &&
                    (language === "en"
                      ? "Provide more details about your vehicle's specifications and condition."
                      : "あなたの車両の仕様と状態についてより詳細な情報を提供してください。")}
                  {step === STEPS.PHOTOS &&
                    (language === "en"
                      ? "Upload photos of your vehicle to attract potential buyers."
                      : "潜在的な買い手を引き付けるために、あなたの車両の写真をアップロードしてください。")}
                  {step === STEPS.PRICING &&
                    (language === "en"
                      ? "Set your asking price and pricing options."
                      : "希望価格と価格オプションを設定してください。")}
                  {step === STEPS.REVIEW &&
                    (language === "en"
                      ? "Review your listing details before submitting."
                      : "送信する前にリスティングの詳細を確認してください。")}
                </CardDescription>
              </CardHeader>
              <CardContent>{renderForm()}</CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={prevStep} disabled={step === STEPS.VEHICLE_INFO}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {language === "en" ? "Back" : "戻る"}
                </Button>

                {step === STEPS.REVIEW ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={!isCurrentStepValid() || isSubmitting}
                    className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-placebo-black"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        {language === "en" ? "Submitting..." : "送信中..."}
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        {language === "en" ? "Submit Listing" : "リスティングを送信"}
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={nextStep}
                    disabled={!isCurrentStepValid()}
                    className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90"
                  >
                    {language === "en" ? "Continue" : "続ける"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
