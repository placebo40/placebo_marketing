"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  User,
  Building2,
  Shield,
  FileText,
  CheckCircle,
  AlertTriangle,
  Star,
  ArrowRight,
  Clock,
  CreditCard,
} from "lucide-react"
import Link from "next/link"

export default function SellerRegistrationPage() {
  const { language } = useLanguage()
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<"private" | "dealership" | null>(null)
  const [selectedPlan, setSelectedPlan] = useState("")
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    prefecture: "",
    postalCode: "",

    // Business Information (for dealerships)
    businessName: "",
    businessType: "",
    businessLicense: "",
    taxId: "",
    yearsInBusiness: "",
    numberOfEmployees: "",
    businessDescription: "",

    // Agreements
    agreeTerms: false,
    agreeCompliance: false,
    agreeMarketing: false,
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Store seller type in localStorage before navigation
    localStorage.setItem("registeredSellerType", selectedType || "private")

    // Navigate to payment page with registration data
    const params = new URLSearchParams({
      type: selectedType || "private",
      plan: selectedPlan,
      businessName: formData.businessName || "",
    })

    router.push(`/seller-registration/payment?${params.toString()}`)
  }

  const plans = {
    private: [
      {
        id: "private-seller",
        name: language === "en" ? "Private Seller" : "個人販売者",
        price: "¥3,980",
        billing: language === "en" ? "One-time payment" : "一回払い",
        popular: true,
        features: [
          language === "en" ? "2 vehicles at a time" : "同時に2台まで",
          language === "en" ? "2 sales per year" : "年間2回まで",
          language === "en" ? "Priority support" : "優先サポート",
          language === "en" ? "Compliance monitoring" : "コンプライアンス監視",
        ],
      },
    ],
    dealership: [
      {
        id: "starter",
        name: language === "en" ? "Starter" : "スターター",
        price: "¥7,800",
        billing: language === "en" ? "/month" : "/月",
        trial: true,
        trialDays: 7,
        features: [
          language === "en" ? "Up to 15 listings" : "最大15台掲載",
          language === "en" ? "7-day free trial" : "7日間無料トライアル",
          language === "en" ? "Dedicated support" : "専用サポート",
          language === "en" ? "Analytics dashboard" : "分析ダッシュボード",
        ],
      },
      {
        id: "professional",
        name: language === "en" ? "Professional" : "プロフェッショナル",
        price: "¥15,800",
        billing: language === "en" ? "/month" : "/月",
        trial: true,
        trialDays: 7,
        popular: true,
        features: [
          language === "en" ? "Up to 50 listings" : "最大50台掲載",
          language === "en" ? "7-day free trial" : "7日間無料トライアル",
          language === "en" ? "Premium support" : "プレミアムサポート",
          language === "en" ? "Advanced analytics" : "高度な分析",
          language === "en" ? "Priority placement" : "優先表示",
        ],
      },
      {
        id: "enterprise",
        name: language === "en" ? "Enterprise" : "エンタープライズ",
        price: "¥24,800",
        billing: language === "en" ? "/month" : "/月",
        trial: true,
        trialDays: 7,
        features: [
          language === "en" ? "Unlimited listings" : "無制限掲載",
          language === "en" ? "7-day free trial" : "7日間無料トライアル",
          language === "en" ? "White-glove support" : "ホワイトグローブサポート",
          language === "en" ? "Custom analytics" : "カスタム分析",
          language === "en" ? "API access" : "APIアクセス",
          language === "en" ? "Dedicated account manager" : "専任アカウントマネージャー",
        ],
      },
    ],
  }

  const isStepComplete = (step: number) => {
    switch (step) {
      case 1:
        return selectedType !== null
      case 2:
        return selectedPlan !== ""
      case 3:
        if (selectedType === "private") {
          return formData.firstName && formData.lastName && formData.email && formData.phone && formData.address
        } else {
          return (
            formData.businessName &&
            formData.businessType &&
            formData.email &&
            formData.phone &&
            formData.businessLicense
          )
        }
      case 4:
        return formData.agreeTerms && formData.agreeCompliance
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-4xl">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= 1 ? "bg-placebo-gold" : "bg-gray-300"
                }`}
              >
                <User className="h-5 w-5 text-placebo-black" />
              </div>
              <span className="ml-2 text-sm font-medium">{language === "en" ? "Type" : "タイプ"}</span>
            </div>
            <div className={`w-16 h-0.5 ${currentStep >= 2 ? "bg-placebo-gold" : "bg-gray-300"}`}></div>
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= 2 ? "bg-placebo-gold" : "bg-gray-300"
                }`}
              >
                <Star className="h-5 w-5 text-placebo-black" />
              </div>
              <span className="ml-2 text-sm font-medium">{language === "en" ? "Plan" : "プラン"}</span>
            </div>
            <div className={`w-16 h-0.5 ${currentStep >= 3 ? "bg-placebo-gold" : "bg-gray-300"}`}></div>
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= 3 ? "bg-placebo-gold" : "bg-gray-300"
                }`}
              >
                <FileText className="h-5 w-5 text-placebo-black" />
              </div>
              <span className="ml-2 text-sm font-medium">{language === "en" ? "Details" : "詳細"}</span>
            </div>
            <div className={`w-16 h-0.5 ${currentStep >= 4 ? "bg-placebo-gold" : "bg-gray-300"}`}></div>
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= 4 ? "bg-placebo-gold" : "bg-gray-300"
                }`}
              >
                <Shield className="h-5 w-5 text-placebo-black" />
              </div>
              <span className="ml-2 text-sm font-medium">{language === "en" ? "Review" : "確認"}</span>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-placebo-black mb-4">
            {language === "en" ? "Become a Seller" : "販売者になる"}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {language === "en"
              ? "Join our marketplace and start selling vehicles with confidence. Choose the plan that fits your needs."
              : "マーケットプレイスに参加して、自信を持って車両販売を始めましょう。ニーズに合ったプランをお選びください。"}
          </p>
        </div>

        {/* Step 1: Seller Type Selection */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                {language === "en" ? "Choose Your Seller Type" : "販売者タイプを選択"}
              </CardTitle>
              <CardDescription className="text-center">
                {language === "en"
                  ? "Select the type that best describes your selling activity"
                  : "あなたの販売活動に最も適したタイプを選択してください"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Private Seller */}
                <div
                  className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                    selectedType === "private"
                      ? "border-placebo-gold bg-placebo-gold/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => {
                    setSelectedType("private")
                    localStorage.setItem("registeredSellerType", "private")
                  }}
                >
                  <div className="text-center">
                    <User className="h-12 w-12 text-placebo-gold mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      {language === "en" ? "Private Seller" : "個人販売者"}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {language === "en"
                        ? "Selling your personal vehicle or occasional sales"
                        : "個人の車両または時々の販売"}
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        {language === "en" ? "Up to 2 sales per year" : "年間最大2回の販売"}
                      </div>
                      <div className="flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        {language === "en" ? "2 active listings" : "2つのアクティブリスト"}
                      </div>
                      <div className="flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        {language === "en" ? "Compliance monitoring" : "コンプライアンス監視"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dealership */}
                <div
                  className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                    selectedType === "dealership"
                      ? "border-placebo-gold bg-placebo-gold/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => {
                    setSelectedType("dealership")
                    localStorage.setItem("registeredSellerType", "dealership")
                  }}
                >
                  <div className="text-center">
                    <Building2 className="h-12 w-12 text-placebo-gold mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      {language === "en" ? "Licensed Dealership" : "認可ディーラー"}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {language === "en"
                        ? "Professional vehicle sales business with proper licensing"
                        : "適切なライセンスを持つプロの車両販売事業"}
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        {language === "en" ? "Unlimited sales" : "無制限販売"}
                      </div>
                      <div className="flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        {language === "en" ? "Multiple listing plans" : "複数のリスティングプラン"}
                      </div>
                      <div className="flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        {language === "en" ? "Advanced features" : "高度な機能"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Compliance Warning */}
              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-amber-800 mb-1">
                      {language === "en" ? "Important Compliance Information" : "重要なコンプライアンス情報"}
                    </h4>
                    <p className="text-sm text-amber-700">
                      {language === "en"
                        ? "In Japan, selling more than 2 vehicles per year or operating as a business requires a dealer license."
                        : "日本では、年間2台以上の車両販売や事業運営にはディーラーライセンスが必要です。適切なライセンスをお持ちの場合は「認可ディーラー」を選択してください。"}
                    </p>
                    <Link href="/compliance-info" className="text-amber-800 underline text-sm mt-1 inline-block">
                      {language === "en" ? "Learn more about compliance" : "コンプライアンスについて詳しく"}
                    </Link>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button
                  onClick={() => setCurrentStep(2)}
                  disabled={!selectedType}
                  className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90"
                >
                  {language === "en" ? "Continue" : "続行"}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Plan Selection */}
        {currentStep === 2 && selectedType && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                {language === "en" ? "Choose Your Plan" : "プランを選択"}
              </CardTitle>
              <CardDescription className="text-center">
                {selectedType === "private"
                  ? language === "en"
                    ? "Perfect for individual sellers"
                    : "個人販売者に最適"
                  : language === "en"
                    ? "Professional plans for licensed dealerships"
                    : "認可ディーラー向けプロフェッショナルプラン"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans[selectedType].map((plan) => (
                  <div
                    key={plan.id}
                    className={`border-2 rounded-lg p-6 cursor-pointer transition-all relative ${
                      selectedPlan === plan.id
                        ? "border-placebo-gold bg-placebo-gold/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    {plan.popular && (
                      <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-placebo-gold text-placebo-black">
                        {language === "en" ? "Most Popular" : "人気"}
                      </Badge>
                    )}
                    {/* Remove the absolute positioned trial badge */}
                    {/* {plan.trial && (
                      <Badge className="absolute -top-2 right-4 bg-green-500 text-white">
                        {language === "en" ? `${plan.trialDays}-day trial` : `${plan.trialDays}日間トライアル`}
                      </Badge>
                    )} */}

                    <div className="text-center">
                      <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                      <div className="mb-4">
                        <span className="text-3xl font-bold text-placebo-gold">{plan.price}</span>
                        <span className="text-gray-600">{plan.billing}</span>
                        {plan.trial && (
                          <div className="text-xs text-green-600 font-medium mt-1">
                            {language === "en"
                              ? `${plan.trialDays}-day free trial`
                              : `${plan.trialDays}日間無料トライアル`}
                          </div>
                        )}
                      </div>
                      <div className="space-y-2 text-sm">
                        {plan.features.map((feature, index) => (
                          <div key={index} className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setCurrentStep(1)}>
                  {language === "en" ? "Back" : "戻る"}
                </Button>
                <Button
                  onClick={() => setCurrentStep(3)}
                  disabled={!selectedPlan}
                  className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90"
                >
                  {language === "en" ? "Continue" : "続行"}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Registration Form */}
        {currentStep === 3 && selectedType && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                {selectedType === "private"
                  ? language === "en"
                    ? "Personal Information"
                    : "個人情報"
                  : language === "en"
                    ? "Business Information"
                    : "事業情報"}
              </CardTitle>
              <CardDescription className="text-center">
                {language === "en"
                  ? "Please provide accurate information for verification"
                  : "確認のため正確な情報をご提供ください"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                {selectedType === "private" ? (
                  // Private Seller Form
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">{language === "en" ? "First Name" : "名"} *</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">{language === "en" ? "Last Name" : "姓"} *</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">{language === "en" ? "Email Address" : "メールアドレス"} *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">{language === "en" ? "Phone Number" : "電話番号"} *</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="address">{language === "en" ? "Address" : "住所"} *</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">{language === "en" ? "City" : "市区町村"} *</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => handleInputChange("city", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="prefecture">{language === "en" ? "Prefecture" : "都道府県"} *</Label>
                        <Select
                          value={formData.prefecture}
                          onValueChange={(value) => handleInputChange("prefecture", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={language === "en" ? "Select prefecture" : "都道府県を選択"} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="okinawa">{language === "en" ? "Okinawa" : "沖縄県"}</SelectItem>
                            <SelectItem value="tokyo">{language === "en" ? "Tokyo" : "東京都"}</SelectItem>
                            <SelectItem value="osaka">{language === "en" ? "Osaka" : "大阪府"}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="postalCode">{language === "en" ? "Postal Code" : "郵便番号"} *</Label>
                        <Input
                          id="postalCode"
                          value={formData.postalCode}
                          onChange={(e) => handleInputChange("postalCode", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  // Dealership Form
                  <>
                    <div>
                      <Label htmlFor="businessName">{language === "en" ? "Business Name" : "事業名"} *</Label>
                      <Input
                        id="businessName"
                        value={formData.businessName}
                        onChange={(e) => handleInputChange("businessName", e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="businessType">{language === "en" ? "Business Type" : "事業タイプ"} *</Label>
                        <Select
                          value={formData.businessType}
                          onValueChange={(value) => handleInputChange("businessType", value)}
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={language === "en" ? "Select business type" : "事業タイプを選択"}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new-car-dealer">
                              {language === "en" ? "New Car Dealer" : "新車ディーラー"}
                            </SelectItem>
                            <SelectItem value="used-car-dealer">
                              {language === "en" ? "Used Car Dealer" : "中古車ディーラー"}
                            </SelectItem>
                            <SelectItem value="auto-auction">
                              {language === "en" ? "Auto Auction" : "オートオークション"}
                            </SelectItem>
                            <SelectItem value="rental-company">
                              {language === "en" ? "Rental Company" : "レンタル会社"}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="businessLicense">
                          {language === "en" ? "Business License Number" : "事業許可番号"} *
                        </Label>
                        <Input
                          id="businessLicense"
                          value={formData.businessLicense}
                          onChange={(e) => handleInputChange("businessLicense", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">{language === "en" ? "Business Email" : "事業メール"} *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">{language === "en" ? "Business Phone" : "事業電話"} *</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="businessDescription">
                        {language === "en" ? "Business Description" : "事業説明"}
                      </Label>
                      <Textarea
                        id="businessDescription"
                        value={formData.businessDescription}
                        onChange={(e) => handleInputChange("businessDescription", e.target.value)}
                        rows={3}
                      />
                    </div>
                  </>
                )}
              </form>

              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setCurrentStep(2)}>
                  {language === "en" ? "Back" : "戻る"}
                </Button>
                <Button
                  onClick={() => setCurrentStep(4)}
                  disabled={!isStepComplete(3)}
                  className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90"
                >
                  {language === "en" ? "Continue" : "続行"}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Review & Terms */}
        {currentStep === 4 && selectedType && selectedPlan && (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                {language === "en" ? "Review & Confirm" : "確認・同意"}
              </CardTitle>
              <CardDescription className="text-center">
                {language === "en"
                  ? "Please review your information and agree to our terms"
                  : "情報を確認し、利用規約に同意してください"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Registration Summary */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-lg mb-4">
                  {language === "en" ? "Registration Summary" : "登録概要"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">
                      {language === "en" ? "Account Type:" : "アカウントタイプ:"}
                    </span>
                    <p className="font-medium">
                      {selectedType === "private"
                        ? language === "en"
                          ? "Private Seller"
                          : "個人販売者"
                        : language === "en"
                          ? "Licensed Dealership"
                          : "認可ディーラー"}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">
                      {language === "en" ? "Selected Plan:" : "選択プラン:"}
                    </span>
                    <p className="font-medium">{plans[selectedType].find((p) => p.id === selectedPlan)?.name}</p>
                  </div>
                  {selectedType === "private" ? (
                    <div>
                      <span className="text-sm text-gray-600">{language === "en" ? "Name:" : "名前:"}</span>
                      <p className="font-medium">
                        {formData.firstName} {formData.lastName}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <span className="text-sm text-gray-600">{language === "en" ? "Business Name:" : "事業名:"}</span>
                      <p className="font-medium">{formData.businessName}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-sm text-gray-600">{language === "en" ? "Email:" : "メール:"}</span>
                    <p className="font-medium">{formData.email}</p>
                  </div>
                </div>
              </div>

              {/* Terms and Agreements */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="agreeTerms"
                    checked={formData.agreeTerms}
                    onCheckedChange={(checked) => handleInputChange("agreeTerms", checked)}
                  />
                  <div>
                    <Label htmlFor="agreeTerms" className="font-medium">
                      {language === "en"
                        ? "I agree to the Terms of Service and Privacy Policy"
                        : "利用規約とプライバシーポリシーに同意します"}
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      {language === "en" ? (
                        <>
                          By checking this box, you agree to our{" "}
                          <Link href="/terms" className="text-placebo-gold hover:underline">
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link href="/privacy" className="text-placebo-gold hover:underline">
                            Privacy Policy
                          </Link>
                          .
                        </>
                      ) : (
                        <>
                          このボックスをチェックすることにより、{" "}
                          <Link href="/terms" className="text-placebo-gold hover:underline">
                            利用規約
                          </Link>
                          と{" "}
                          <Link href="/privacy" className="text-placebo-gold hover:underline">
                            プライバシーポリシー
                          </Link>
                          に同意したことになります。
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="agreeCompliance"
                    checked={formData.agreeCompliance}
                    onCheckedChange={(checked) => handleInputChange("agreeCompliance", checked)}
                  />
                  <div>
                    <Label htmlFor="agreeCompliance" className="font-medium">
                      {language === "en"
                        ? "I understand and agree to comply with Japanese automotive sales regulations"
                        : "日本の自動車販売規制を理解し、遵守することに同意します"}
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      {language === "en"
                        ? "You acknowledge that you will comply with all applicable laws and regulations regarding vehicle sales in Japan."
                        : "日本における車両販売に関するすべての適用法および規制を遵守することを認めます。"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="agreeMarketing"
                    checked={formData.agreeMarketing}
                    onCheckedChange={(checked) => handleInputChange("agreeMarketing", checked)}
                  />
                  <div>
                    <Label htmlFor="agreeMarketing" className="font-medium">
                      {language === "en"
                        ? "I agree to receive marketing communications (optional)"
                        : "マーケティング通信の受信に同意します（任意）"}
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      {language === "en"
                        ? "Receive updates about new features, promotions, and automotive market insights."
                        : "新機能、プロモーション、自動車市場の洞察に関する更新を受け取ります。"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <Button variant="outline" onClick={() => setCurrentStep(3)}>
                  {language === "en" ? "Back" : "戻る"}
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!isStepComplete(4) || isSubmitting}
                  className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90"
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      {language === "en" ? "Processing..." : "処理中..."}
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      {language === "en" ? "Proceed to Payment" : "支払いに進む"}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
