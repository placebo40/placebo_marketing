"use client"

import type React from "react"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Search, CheckCircle, Clock, DollarSign } from "lucide-react"
import InspectionBadge from "@/components/inspection-badge"
import { Badge } from "@/components/ui/badge"

export default function InspectionPage() {
  const params = useParams()
  const router = useRouter()
  const { language } = useLanguage()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    inspectionType: "",
    preferredDate: "",
    preferredTime: "",
    specificConcerns: "",
    inspectionLocation: "",
    additionalServices: [] as string[],
    urgentRequest: false,
    agreeToTerms: false,
  })

  const [showTermsModal, setShowTermsModal] = useState(false)
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const vehicleId = params.id as string

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleAdditionalService = (service: string) => {
    setFormData((prev) => {
      const services = [...prev.additionalServices]
      if (services.includes(service)) {
        return { ...prev, additionalServices: services.filter((s) => s !== service) }
      } else {
        return { ...prev, additionalServices: [...services, service] }
      }
    })
  }

  const handleTermsScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10
    setHasScrolledToBottom(isAtBottom)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simulate getting user info from auth context
    const userInfo = {
      name: "John Doe", // From authenticated user
      email: "john.doe@example.com", // From authenticated user
      phone: "+81 90-1234-5678", // From authenticated user
    }

    setIsSubmitting(false)
    setShowConfirmation(true)
  }

  const inspectionTypes = [
    {
      value: "basic",
      label: language === "en" ? "Basic Inspection" : "基本検査",
      price: "¥15,000",
      duration: language === "en" ? "1-2 hours" : "1-2時間",
      description: language === "en" ? "Essential safety and mechanical checks" : "基本的な安全性と機械的チェック",
      features: [
        language === "en" ? "Visual exterior & interior inspection" : "外装・内装の目視点検",
        language === "en" ? "Engine bay examination" : "エンジンルーム検査",
        language === "en" ? "Basic safety systems check" : "基本安全システムチェック",
        language === "en" ? "Tire condition assessment" : "タイヤ状態評価",
        language === "en" ? "Digital inspection report" : "デジタル点検レポート",
      ],
    },
    {
      value: "comprehensive",
      label: language === "en" ? "Comprehensive Inspection" : "包括的検査",
      price: "¥25,000",
      duration: language === "en" ? "2-3 hours" : "2-3時間",
      description: language === "en" ? "Detailed inspection of all systems" : "すべてのシステムの詳細検査",
      popular: true,
      features: [
        language === "en" ? "Complete 50-point inspection" : "50項目完全点検",
        language === "en" ? "Engine performance diagnostics" : "エンジン性能診断",
        language === "en" ? "Brake system analysis" : "ブレーキシステム解析",
        language === "en" ? "Electrical system testing" : "電気系統テスト",
        language === "en" ? "Detailed photo documentation" : "詳細写真記録",
        language === "en" ? "Professional inspection report" : "プロ点検レポート",
      ],
    },
    {
      value: "premium",
      label: language === "en" ? "Premium Inspection" : "プレミアム検査",
      price: "¥35,000",
      duration: language === "en" ? "3-4 hours" : "3-4時間",
      description: language === "en" ? "Complete evaluation for buyers" : "買い手向けの完全評価",
      features: [
        language === "en" ? "Comprehensive 75-point inspection" : "75項目総合点検",
        language === "en" ? "Advanced diagnostic scanning" : "高度診断スキャン",
        language === "en" ? "Road test evaluation" : "路上テスト評価",
        language === "en" ? "Paint thickness measurement" : "塗装厚測定",
        language === "en" ? "Undercarriage inspection" : "車体下部点検",
        language === "en" ? "30-day inspection warranty" : "30日点検保証",
      ],
    },
  ]

  const additionalServices = [
    { id: "paint", label: language === "en" ? "Paint Condition Analysis" : "塗装状態分析", price: "¥5,000" },
    { id: "engine", label: language === "en" ? "Engine Diagnostics" : "エンジン診断", price: "¥8,000" },
    { id: "electrical", label: language === "en" ? "Electrical System Check" : "電気系統チェック", price: "¥6,000" },
    { id: "ac", label: language === "en" ? "A/C System Inspection" : "エアコンシステム検査", price: "¥4,000" },
    { id: "history", label: language === "en" ? "Vehicle History Report" : "車両履歴レポート", price: "¥3,000" },
  ]

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-placebo-black text-placebo-white py-12">
        <div className="container">
          <Button
            variant="ghost"
            asChild
            className="mb-6 text-placebo-white hover:text-placebo-gold hover:bg-placebo-white/10"
          >
            <Link href={`/cars/${vehicleId}`} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              {language === "en" ? "Back to Vehicle Details" : "車両詳細に戻る"}
            </Link>
          </Button>

          <div className="flex items-center gap-3 mb-4">
            <Search className="h-8 w-8 text-placebo-gold" />
            <h1 className="text-3xl font-bold">{language === "en" ? "Request Inspection" : "検査リクエスト"}</h1>
          </div>
          <p className="text-gray-300">
            {language === "en"
              ? "Get a professional inspection to ensure the vehicle meets your standards"
              : "車両があなたの基準を満たしていることを確認するためのプロフェッショナル検査"}
          </p>
        </div>
      </div>

      <div className="container py-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <Card className="border-gray-200 bg-placebo-white">
                <CardHeader>
                  <CardTitle className="text-2xl text-placebo-black">
                    {language === "en" ? "Inspection Request" : "検査リクエスト"}
                  </CardTitle>
                  <CardDescription>
                    {language === "en"
                      ? "Choose your inspection type and schedule an appointment with our certified mechanics."
                      : "検査タイプを選択し、認定メカニックとの予約をお取りください。"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Inspection Type */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-placebo-black">
                        {language === "en" ? "Inspection Type" : "検査タイプ"}
                      </h3>

                      <div className="space-y-3">
                        {inspectionTypes.map((type) => (
                          <div
                            key={type.value}
                            className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                              formData.inspectionType === type.value
                                ? "border-placebo-gold bg-placebo-gold/5 shadow-md"
                                : "border-gray-200 hover:border-placebo-gold/50 hover:shadow-sm"
                            }`}
                            onClick={() => updateFormData("inspectionType", type.value)}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-start gap-3">
                                <input
                                  type="radio"
                                  name="inspectionType"
                                  value={type.value}
                                  checked={formData.inspectionType === type.value}
                                  onChange={() => updateFormData("inspectionType", type.value)}
                                  className="mt-1"
                                />
                                <div className="flex items-center gap-3">
                                  <InspectionBadge
                                    level={type.value as "basic" | "comprehensive" | "premium"}
                                    language={language}
                                    size="md"
                                    iconOnly={true}
                                  />
                                  <div>
                                    <h4 className="font-medium text-placebo-black">{type.label}</h4>
                                    {type.popular && (
                                      <Badge className="bg-placebo-gold text-placebo-black text-xs mt-1">
                                        {language === "en" ? "Most Popular" : "最人気"}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="font-semibold text-placebo-gold text-lg">{type.price}</span>
                                <p className="text-sm text-placebo-dark-gray">{type.duration}</p>
                              </div>
                            </div>
                            <p className="text-sm text-placebo-dark-gray mb-3 ml-8">{type.description}</p>
                            <div className="ml-8">
                              <p className="text-xs font-medium text-placebo-dark-gray mb-2">
                                {language === "en" ? "Includes:" : "含まれる内容:"}
                              </p>
                              <ul className="text-xs text-placebo-dark-gray space-y-1">
                                {type.features.map((feature, index) => (
                                  <li key={index} className="flex items-center gap-2">
                                    <CheckCircle className="h-3 w-3 text-placebo-gold flex-shrink-0" />
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Additional Services */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-placebo-black">
                        {language === "en" ? "Additional Services" : "追加サービス"}
                      </h3>

                      <div className="space-y-2">
                        {additionalServices.map((service) => (
                          <div
                            key={service.id}
                            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              <Checkbox
                                id={service.id}
                                checked={formData.additionalServices.includes(service.id)}
                                onCheckedChange={() => toggleAdditionalService(service.id)}
                              />
                              <label htmlFor={service.id} className="text-sm font-medium">
                                {service.label}
                              </label>
                            </div>
                            <span className="text-sm font-semibold text-placebo-gold">{service.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Scheduling */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-placebo-black">
                        {language === "en" ? "Preferred Schedule" : "希望スケジュール"}
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="preferredDate">{language === "en" ? "Preferred Date" : "希望日"} *</Label>
                          <Input
                            id="preferredDate"
                            type="date"
                            value={formData.preferredDate}
                            onChange={(e) => updateFormData("preferredDate", e.target.value)}
                            min={new Date().toISOString().split("T")[0]}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="preferredTime">{language === "en" ? "Preferred Time" : "希望時間"} *</Label>
                          <Select
                            value={formData.preferredTime}
                            onValueChange={(value) => updateFormData("preferredTime", value)}
                          >
                            <SelectTrigger id="preferredTime">
                              <SelectValue placeholder={language === "en" ? "Select time" : "時間を選択"} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="morning">
                                {language === "en" ? "Morning (9:00-12:00)" : "午前（9:00-12:00）"}
                              </SelectItem>
                              <SelectItem value="afternoon">
                                {language === "en" ? "Afternoon (13:00-17:00)" : "午後（13:00-17:00）"}
                              </SelectItem>
                              <SelectItem value="flexible">
                                {language === "en" ? "Flexible" : "フレキシブル"}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-placebo-black">
                        {language === "en" ? "Inspection Location" : "検査場所"}
                      </h3>

                      <div className="space-y-2">
                        <Label htmlFor="inspectionLocation">
                          {language === "en" ? "Preferred Location" : "希望場所"} *
                        </Label>
                        <Select
                          value={formData.inspectionLocation}
                          onValueChange={(value) => updateFormData("inspectionLocation", value)}
                        >
                          <SelectTrigger id="inspectionLocation">
                            <SelectValue placeholder={language === "en" ? "Select location" : "場所を選択"} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="our-facility">
                              {language === "en" ? "Our Inspection Facility" : "当社検査施設"}
                            </SelectItem>
                            <SelectItem value="vehicle-location">
                              {language === "en" ? "Vehicle's Current Location" : "車両の現在地"}
                            </SelectItem>
                            <SelectItem value="mobile">
                              {language === "en" ? "Mobile Inspection Service" : "出張検査サービス"}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Specific Concerns */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-placebo-black">
                        {language === "en" ? "Specific Concerns" : "特定の懸念事項"}
                      </h3>

                      <div className="space-y-2">
                        <Label htmlFor="specificConcerns">{language === "en" ? "Areas of Concern" : "懸念箇所"}</Label>
                        <Textarea
                          id="specificConcerns"
                          placeholder={
                            language === "en"
                              ? "Please describe any specific areas you'd like us to focus on during the inspection..."
                              : "検査中に重点的に確認してほしい特定の箇所をお聞かせください..."
                          }
                          value={formData.specificConcerns}
                          onChange={(e) => updateFormData("specificConcerns", e.target.value)}
                          rows={4}
                        />
                      </div>
                    </div>

                    {/* Urgent Request */}
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="urgentRequest"
                        checked={formData.urgentRequest}
                        onCheckedChange={(checked) => updateFormData("urgentRequest", checked)}
                      />
                      <label htmlFor="urgentRequest" className="text-sm font-medium">
                        {language === "en"
                          ? "This is an urgent request (additional fee may apply)"
                          : "これは緊急リクエストです（追加料金が発生する場合があります）"}
                      </label>
                    </div>

                    {/* Terms Agreement */}
                    <div className="flex items-start space-x-2 pt-4">
                      <Checkbox
                        id="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onCheckedChange={(checked) => updateFormData("agreeToTerms", checked)}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor="agreeToTerms"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {language === "en"
                            ? "I agree to the inspection terms and conditions"
                            : "検査の利用規約に同意します"}
                        </label>
                        <p className="text-sm text-placebo-dark-gray">
                          {language === "en" ? (
                            <>
                              By requesting an inspection, you agree to our{" "}
                              <button
                                type="button"
                                onClick={() => {
                                  setShowTermsModal(true)
                                  setHasScrolledToBottom(false)
                                }}
                                className="text-placebo-gold hover:underline font-medium"
                              >
                                service terms and payment policies
                              </button>
                              .
                            </>
                          ) : (
                            <>
                              検査をリクエストすることにより、当社の
                              <button
                                type="button"
                                onClick={() => {
                                  setShowTermsModal(true)
                                  setHasScrolledToBottom(false)
                                }}
                                className="text-placebo-gold hover:underline font-medium"
                              >
                                サービス条項と支払いポリシー
                              </button>
                              に同意したことになります。
                            </>
                          )}
                        </p>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting || !formData.agreeToTerms}
                      className="w-full bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90 font-semibold"
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
                          <Search className="mr-2 h-4 w-4" />
                          {language === "en" ? "Request Inspection" : "検査をリクエスト"}
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Information */}
            <div className="space-y-6">
              {/* Inspection Process */}
              <Card className="border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-placebo-gold" />
                    {language === "en" ? "Inspection Process" : "検査プロセス"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="text-sm text-placebo-dark-gray space-y-2">
                    <li>• {language === "en" ? "Certified mechanic inspection" : "認定メカニックによる検査"}</li>
                    <li>• {language === "en" ? "Detailed written report" : "詳細な書面レポート"}</li>
                    <li>• {language === "en" ? "Photo documentation" : "写真による記録"}</li>
                    <li>• {language === "en" ? "Repair cost estimates" : "修理費用見積もり"}</li>
                    <li>• {language === "en" ? "Safety rating assessment" : "安全性評価"}</li>
                    <li>• {language === "en" ? "Verified inspection badge" : "認証検査バッジ"}</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Timing */}
              <Card className="border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-placebo-gold" />
                    {language === "en" ? "Timing & Duration" : "タイミングと所要時間"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="text-sm text-placebo-dark-gray space-y-2">
                    <li>• {language === "en" ? "Basic: 1-2 hours" : "基本: 1-2時間"}</li>
                    <li>• {language === "en" ? "Comprehensive: 2-3 hours" : "包括的: 2-3時間"}</li>
                    <li>• {language === "en" ? "Pre-purchase: 3-4 hours" : "購入前: 3-4時間"}</li>
                    <li>• {language === "en" ? "Report delivered within 24 hours" : "24時間以内にレポート提供"}</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Pricing Info */}
              <Card className="border-green-200 bg-green-50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <DollarSign className="h-5 w-5" />
                    {language === "en" ? "Pricing Information" : "料金情報"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="text-sm text-green-700 space-y-2">
                    <li>• {language === "en" ? "Transparent pricing" : "透明な料金体系"}</li>
                    <li>• {language === "en" ? "No hidden fees" : "隠れた費用なし"}</li>
                    <li>• {language === "en" ? "Payment after inspection" : "検査後の支払い"}</li>
                    <li>• {language === "en" ? "Money-back guarantee" : "返金保証"}</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      {/* Terms and Conditions Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-placebo-black">
                {language === "en" ? "Service Terms and Payment Policies" : "サービス条項と支払いポリシー"}
              </h2>
            </div>

            <div
              className="flex-1 overflow-y-auto p-6 space-y-4 text-sm text-placebo-dark-gray"
              onScroll={handleTermsScroll}
            >
              {language === "en" ? (
                <>
                  <div>
                    <h3 className="font-semibold text-placebo-black mb-2">1. Inspection Services</h3>
                    <p>
                      Placebo Marketing provides professional vehicle inspection services through certified mechanics
                      and automotive experts. Our inspections are conducted according to industry standards and best
                      practices.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-placebo-black mb-2">2. Service Scope</h3>
                    <p>
                      Inspection services include visual examination, mechanical testing, diagnostic scans, and
                      documentation of findings. We provide detailed reports with photographs and recommendations.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-placebo-black mb-2">3. Payment Terms</h3>
                    <p>
                      Payment is due upon completion of inspection services. We accept cash, bank transfer, and major
                      credit cards. Additional services requested during inspection may incur extra charges.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-placebo-black mb-2">4. Scheduling and Cancellation</h3>
                    <p>
                      Appointments must be scheduled at least 24 hours in advance. Cancellations made less than 24 hours
                      before the scheduled time may incur a cancellation fee of ¥5,000.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-placebo-black mb-2">5. Liability and Limitations</h3>
                    <p>
                      Our liability is limited to the cost of the inspection service. We are not responsible for
                      pre-existing vehicle conditions or issues not discoverable through standard inspection procedures.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-placebo-black mb-2">6. Report Accuracy</h3>
                    <p>
                      While we strive for accuracy, our reports reflect conditions at the time of inspection. Vehicle
                      conditions may change, and we recommend addressing identified issues promptly.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-placebo-black mb-2">7. Confidentiality</h3>
                    <p>
                      All inspection results and customer information are kept confidential and will not be shared with
                      third parties without explicit consent, except as required by law.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-placebo-black mb-2">8. Dispute Resolution</h3>
                    <p>
                      Any disputes arising from our services will be resolved through mediation or arbitration in
                      accordance with Japanese law. The jurisdiction for any legal proceedings is Tokyo, Japan.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-placebo-black mb-2">9. Service Guarantee</h3>
                    <p>
                      We guarantee the quality of our inspection services. If you are not satisfied with our service,
                      please contact us within 48 hours for resolution.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-placebo-black mb-2">10. Contact Information</h3>
                    <p>
                      For questions about these terms or our services, contact us at inspection@mplacebo.com or
                      +81-3-XXXX-XXXX.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h3 className="font-semibold text-placebo-black mb-2">1. 検査サービス</h3>
                    <p>
                      プラセボマーケティングは、認定メカニックと自動車専門家による専門的な車両検査サービスを提供します。当社の検査は業界標準とベストプラクティスに従って実施されます。
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-placebo-black mb-2">2. サービス範囲</h3>
                    <p>
                      検査サービスには、目視検査、機械的テスト、診断スキャン、および所見の文書化が含まれます。写真と推奨事項を含む詳細なレポートを提供します。
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-placebo-black mb-2">3. 支払い条件</h3>
                    <p>
                      支払いは検査サービス完了時に行います。現金、銀行振込、主要クレジットカードを受け付けます。検査中に要求された追加サービスには追加料金が発生する場合があります。
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-placebo-black mb-2">4. スケジュールとキャンセル</h3>
                    <p>
                      予約は少なくとも24時間前に行う必要があります。予定時刻の24時間未満のキャンセルには、5,000円のキャンセル料が発生する場合があります。
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-placebo-black mb-2">5. 責任と制限</h3>
                    <p>
                      当社の責任は検査サービスの費用に限定されます。既存の車両状態や標準的な検査手順では発見できない問題については責任を負いません。
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-placebo-black mb-2">6. レポートの正確性</h3>
                    <p>
                      正確性を追求していますが、当社のレポートは検査時点での状態を反映しています。車両の状態は変化する可能性があり、特定された問題には迅速に対処することをお勧めします。
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-placebo-black mb-2">7. 機密保持</h3>
                    <p>
                      すべての検査結果と顧客情報は機密に保たれ、明示的な同意なしに第三者と共有されることはありません（法律で要求される場合を除く）。
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-placebo-black mb-2">8. 紛争解決</h3>
                    <p>
                      当社のサービスから生じる紛争は、日本法に従って調停または仲裁により解決されます。法的手続きの管轄は日本の東京です。
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-placebo-black mb-2">9. サービス保証</h3>
                    <p>
                      当社は検査サービスの品質を保証します。サービスにご満足いただけない場合は、48時間以内にお問い合わせください。
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-placebo-black mb-2">10. 連絡先情報</h3>
                    <p>
                      これらの条件や当社のサービスについてご質問がある場合は、inspection@mplacebo.comまたは+81-3-XXXX-XXXXまでお問い合わせください。
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="p-6 border-t border-gray-200">
              <Button
                onClick={() => setShowTermsModal(false)}
                disabled={!hasScrolledToBottom}
                className={`w-full font-semibold ${
                  hasScrolledToBottom
                    ? "bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {hasScrolledToBottom
                  ? language === "en"
                    ? "I Understand"
                    : "理解しました"
                  : language === "en"
                    ? "Please scroll to bottom to continue"
                    : "続行するには最後までスクロールしてください"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>

              <h3 className="text-lg font-semibold text-placebo-black mb-2">
                {language === "en" ? "Inspection Request Received!" : "検査リクエストを受信しました！"}
              </h3>

              <p className="text-placebo-dark-gray mb-4">
                {language === "en"
                  ? "Thank you for your inspection request. We have received your information and will contact you within 24 hours via email and phone call to confirm the inspection date and details. Upon completion, your vehicle will receive a verified inspection badge."
                  : "検査リクエストをありがとうございます。お客様の情報を受信いたしました。24時間以内にメールとお電話にて検査日と詳細の確認のためご連絡いたします。完了後、お客様の車両は認証検査バッジを受け取ります。"}
              </p>

              <div className="text-left bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-placebo-black mb-2">
                  {language === "en" ? "Next Steps:" : "次のステップ："}
                </h4>
                <ul className="text-sm text-placebo-dark-gray space-y-1">
                  <li>• {language === "en" ? "Check your email for confirmation" : "確認メールをご確認ください"}</li>
                  <li>
                    •{" "}
                    {language === "en"
                      ? "Keep your phone available for our call"
                      : "お電話に出られるようご準備ください"}
                  </li>
                  <li>
                    •{" "}
                    {language === "en"
                      ? "Prepare any questions about the inspection"
                      : "検査に関するご質問をご準備ください"}
                  </li>
                </ul>
              </div>

              <Button
                onClick={() => {
                  setShowConfirmation(false)
                  router.push(`/cars/${vehicleId}`)
                }}
                className="w-full bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90 font-semibold"
              >
                {language === "en" ? "Return to Vehicle Details" : "車両詳細に戻る"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
