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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Calendar, Clock, MapPin, Car, Phone, Mail, AlertTriangle } from "lucide-react"

export default function TestDrivePage() {
  const params = useParams()
  const router = useRouter()
  const { language } = useLanguage()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    preferredDate: "",
    preferredTime: "",
    alternateDate: "",
    alternateTime: "",
    meetingLocation: "",
    drivingExperience: "",
    licenseType: "",
    additionalRequests: "",
    agreeToTerms: false,
    emergencyContact: "",
  })

  const [showTermsModal, setShowTermsModal] = useState(false)
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const vehicleId = params.id as string

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleTermsScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10 // 10px threshold
    if (isAtBottom && !hasScrolledToBottom) {
      setHasScrolledToBottom(true)
    }
  }

  const openTermsModal = () => {
    setShowTermsModal(true)
    setHasScrolledToBottom(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setShowConfirmation(true)
  }

  const timeSlots = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
  ]

  const meetingLocations = [
    { value: "seller", label: language === "en" ? "Seller's Location" : "販売者の場所" },
    { value: "placebo", label: language === "en" ? "Placebo Marketing Office" : "プラセボマーケティングオフィス" },
    { value: "public", label: language === "en" ? "Public Meeting Place" : "公共の場所" },
    { value: "custom", label: language === "en" ? "Custom Location" : "指定場所" },
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
            <Car className="h-8 w-8 text-placebo-gold" />
            <h1 className="text-3xl font-bold">{language === "en" ? "Schedule Test Drive" : "試乗予約"}</h1>
          </div>
          <p className="text-gray-300">
            {language === "en"
              ? "Book a test drive to experience the vehicle before making your decision"
              : "決定する前に車両を体験するために試乗を予約してください"}
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
                    {language === "en" ? "Test Drive Request" : "試乗リクエスト"}
                  </CardTitle>
                  <CardDescription>
                    {language === "en"
                      ? "Fill out the form below to schedule your test drive appointment."
                      : "以下のフォームにご記入いただき、試乗予約をお取りください。"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-placebo-black">
                        {language === "en" ? "Personal Information" : "個人情報"}
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">{language === "en" ? "Full Name" : "お名前"} *</Label>
                          <Input
                            id="name"
                            placeholder={language === "en" ? "Your full name" : "お名前をご入力ください"}
                            value={formData.name}
                            onChange={(e) => updateFormData("name", e.target.value)}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">{language === "en" ? "Email Address" : "メールアドレス"} *</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="your.email@example.com"
                            value={formData.email}
                            onChange={(e) => updateFormData("email", e.target.value)}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone">{language === "en" ? "Phone Number" : "電話番号"} *</Label>
                          <Input
                            id="phone"
                            placeholder="+81 90-XXXX-XXXX"
                            value={formData.phone}
                            onChange={(e) => updateFormData("phone", e.target.value)}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="licenseType">{language === "en" ? "License Type" : "免許証の種類"} *</Label>
                          <Select
                            value={formData.licenseType}
                            onValueChange={(value) => updateFormData("licenseType", value)}
                          >
                            <SelectTrigger id="licenseType">
                              <SelectValue
                                placeholder={language === "en" ? "Select license type" : "免許証の種類を選択"}
                              />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="japanese">
                                {language === "en" ? "Japanese License" : "日本の免許証"}
                              </SelectItem>
                              <SelectItem value="international">
                                {language === "en" ? "International License" : "国際免許証"}
                              </SelectItem>
                              <SelectItem value="us-military">
                                {language === "en" ? "U.S. Military License" : "米軍免許証"}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
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
                              {timeSlots.map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="alternateDate">{language === "en" ? "Alternate Date" : "代替日"}</Label>
                          <Input
                            id="alternateDate"
                            type="date"
                            value={formData.alternateDate}
                            onChange={(e) => updateFormData("alternateDate", e.target.value)}
                            min={new Date().toISOString().split("T")[0]}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="alternateTime">{language === "en" ? "Alternate Time" : "代替時間"}</Label>
                          <Select
                            value={formData.alternateTime}
                            onValueChange={(value) => updateFormData("alternateTime", value)}
                          >
                            <SelectTrigger id="alternateTime">
                              <SelectValue placeholder={language === "en" ? "Select time" : "時間を選択"} />
                            </SelectTrigger>
                            <SelectContent>
                              {timeSlots.map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Meeting Location */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-placebo-black">
                        {language === "en" ? "Meeting Location" : "待ち合わせ場所"}
                      </h3>

                      <div className="space-y-2">
                        <Label>{language === "en" ? "Preferred Meeting Location" : "希望待ち合わせ場所"} *</Label>
                        <RadioGroup
                          value={formData.meetingLocation}
                          onValueChange={(value) => updateFormData("meetingLocation", value)}
                          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                        >
                          {meetingLocations.map((location) => (
                            <div key={location.value} className="flex items-center space-x-2">
                              <RadioGroupItem value={location.value} id={location.value} />
                              <Label htmlFor={location.value} className="font-normal">
                                {location.label}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    </div>

                    {/* Additional Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-placebo-black">
                        {language === "en" ? "Additional Information" : "追加情報"}
                      </h3>

                      <div className="space-y-2">
                        <Label htmlFor="drivingExperience">
                          {language === "en" ? "Driving Experience" : "運転経験"}
                        </Label>
                        <Select
                          value={formData.drivingExperience}
                          onValueChange={(value) => updateFormData("drivingExperience", value)}
                        >
                          <SelectTrigger id="drivingExperience">
                            <SelectValue
                              placeholder={language === "en" ? "Select experience level" : "経験レベルを選択"}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">
                              {language === "en" ? "Beginner (0-2 years)" : "初心者（0-2年）"}
                            </SelectItem>
                            <SelectItem value="intermediate">
                              {language === "en" ? "Intermediate (3-5 years)" : "中級者（3-5年）"}
                            </SelectItem>
                            <SelectItem value="experienced">
                              {language === "en" ? "Experienced (5+ years)" : "経験者（5年以上）"}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="emergencyContact">
                          {language === "en" ? "Emergency Contact" : "緊急連絡先"}
                        </Label>
                        <Input
                          id="emergencyContact"
                          placeholder={
                            language === "en" ? "Emergency contact name and phone" : "緊急連絡先の名前と電話番号"
                          }
                          value={formData.emergencyContact}
                          onChange={(e) => updateFormData("emergencyContact", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="additionalRequests">
                          {language === "en" ? "Additional Requests" : "追加リクエスト"}
                        </Label>
                        <Textarea
                          id="additionalRequests"
                          placeholder={
                            language === "en"
                              ? "Any specific requests or questions about the test drive..."
                              : "試乗に関する特別なリクエストやご質問..."
                          }
                          value={formData.additionalRequests}
                          onChange={(e) => updateFormData("additionalRequests", e.target.value)}
                          rows={3}
                        />
                      </div>
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
                            ? "I agree to the test drive terms and conditions"
                            : "試乗の利用規約に同意します"}
                        </label>
                        <p className="text-sm text-placebo-dark-gray">
                          {language === "en"
                            ? "By scheduling a test drive, you agree to our "
                            : "試乗を予約することにより、当社の"}
                          <button
                            type="button"
                            onClick={openTermsModal}
                            className="text-placebo-gold hover:text-placebo-gold/80 underline font-medium"
                          >
                            {language === "en" ? "test drive terms and conditions" : "試乗利用規約"}
                          </button>
                          {language === "en" ? "." : "に同意したことになります。"}
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
                          {language === "en" ? "Scheduling..." : "予約中..."}
                        </>
                      ) : (
                        <>
                          <Calendar className="mr-2 h-4 w-4" />
                          {language === "en" ? "Schedule Test Drive" : "試乗を予約"}
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Information */}
            <div className="space-y-6">
              {/* Safety Guidelines */}
              <Card className="border-yellow-200 bg-yellow-50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-yellow-800">
                    <AlertTriangle className="h-5 w-5" />
                    {language === "en" ? "Safety Guidelines" : "安全ガイドライン"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="text-sm text-yellow-700 space-y-2">
                    <li>• {language === "en" ? "Valid driver's license required" : "有効な運転免許証が必要"}</li>
                    <li>• {language === "en" ? "Insurance coverage provided" : "保険適用あり"}</li>
                    <li>• {language === "en" ? "Accompanied by our representative" : "当社代表者が同行"}</li>
                    <li>• {language === "en" ? "Follow all traffic laws" : "すべての交通法規を遵守"}</li>
                    <li>• {language === "en" ? "No smoking or eating in vehicle" : "車内での喫煙・飲食禁止"}</li>
                  </ul>
                </CardContent>
              </Card>

              {/* What to Expect */}
              <Card className="border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-placebo-gold" />
                    {language === "en" ? "What to Expect" : "予想される内容"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="text-sm text-placebo-dark-gray space-y-2">
                    <li>• {language === "en" ? "30-45 minute test drive" : "30-45分の試乗"}</li>
                    <li>• {language === "en" ? "Vehicle inspection walkthrough" : "車両検査の説明"}</li>
                    <li>• {language === "en" ? "Questions and answers session" : "質疑応答セッション"}</li>
                    <li>• {language === "en" ? "Documentation review" : "書類確認"}</li>
                    <li>• {language === "en" ? "No pressure sales approach" : "押し売りなしのアプローチ"}</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card className="border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-placebo-gold" />
                    {language === "en" ? "Need Help?" : "サポートが必要ですか？"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-placebo-gold" />
                    <span>+81-98-XXX-XXXX</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-placebo-gold" />
                    <span>testdrive@mplacebo.com</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-placebo-gold" />
                    <span>{language === "en" ? "Naha, Okinawa" : "沖縄県那覇市"}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      {/* Terms and Conditions Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-placebo-black">
                {language === "en" ? "Test Drive Terms and Conditions" : "試乗利用規約"}
              </h2>
            </div>

            <div
              className="flex-1 overflow-y-auto p-6 space-y-4 text-sm text-placebo-dark-gray"
              onScroll={handleTermsScroll}
            >
              {language === "en" ? (
                <>
                  <div>
                    <h3 className="font-semibold text-placebo-black mb-2">1. Driver Requirements</h3>
                    <p>
                      The test driver must possess a valid driver's license appropriate for the vehicle type.
                      International licenses and U.S. military licenses are accepted with proper documentation. The
                      driver must be at least 18 years of age and have a minimum of 1 year driving experience.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-placebo-black mb-2">2. Insurance Coverage</h3>
                    <p>
                      Placebo Marketing provides comprehensive insurance coverage during the test drive period. However,
                      the test driver may be held responsible for damages resulting from negligent or reckless driving,
                      violation of traffic laws, or driving under the influence of alcohol or drugs.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-placebo-black mb-2">3. Vehicle Condition and Inspection</h3>
                    <p>
                      The vehicle will be inspected before and after the test drive. Any pre-existing damage will be
                      documented. The test driver agrees to report any issues or concerns immediately during the test
                      drive.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-placebo-black mb-2">4. Supervision and Route</h3>
                    <p>
                      All test drives must be accompanied by a Placebo Marketing representative. The test drive route
                      will be predetermined and communicated to the driver. Deviation from the approved route is not
                      permitted without prior authorization.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-placebo-black mb-2">5. Safety Guidelines</h3>
                    <p>
                      The test driver must follow all traffic laws and safety regulations. Smoking, eating, or drinking
                      (except water) is prohibited in the vehicle. Mobile phone use while driving is strictly forbidden
                      except for hands-free emergency calls.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-placebo-black mb-2">6. Duration and Mileage</h3>
                    <p>
                      Test drives are limited to 45 minutes and 30 kilometers unless otherwise agreed upon. Extended
                      test drives may be arranged for serious buyers with additional documentation and approval.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-placebo-black mb-2">7. Liability and Damages</h3>
                    <p>
                      The test driver assumes responsibility for any damages, fines, or violations incurred during the
                      test drive period. This includes but is not limited to traffic violations, parking tickets, and
                      vehicle damage not covered by insurance.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-placebo-black mb-2">8. Emergency Procedures</h3>
                    <p>
                      In case of emergency, contact emergency services immediately, then notify Placebo Marketing.
                      Emergency contact information will be provided before the test drive begins.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-placebo-black mb-2">9. Cancellation Policy</h3>
                    <p>
                      Test drive appointments may be cancelled up to 2 hours before the scheduled time without penalty.
                      Late cancellations or no-shows may result in a cancellation fee.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-placebo-black mb-2">10. Agreement</h3>
                    <p>
                      By scheduling and participating in a test drive, you acknowledge that you have read, understood,
                      and agree to comply with all terms and conditions outlined above. Violation of these terms may
                      result in immediate termination of the test drive and potential legal action.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h3 className="font-semibold text-placebo-black mb-2">1. 運転者の要件</h3>
                    <p>
                      試乗者は車両タイプに適した有効な運転免許証を所持している必要があります。国際免許証および米軍免許証は適切な書類とともに受け入れられます。運転者は18歳以上で、最低1年の運転経験が必要です。
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-placebo-black mb-2">2. 保険適用</h3>
                    <p>
                      プラセボマーケティングは試乗期間中の包括的な保険適用を提供します。ただし、過失または無謀な運転、交通法規違反、または飲酒・薬物使用による運転の結果生じた損害については、試乗者が責任を負う場合があります。
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-placebo-black mb-2">3. 車両状態と検査</h3>
                    <p>
                      車両は試乗前後に検査されます。既存の損傷はすべて記録されます。試乗者は試乗中に問題や懸念事項があれば直ちに報告することに同意します。
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-placebo-black mb-2">4. 監督とルート</h3>
                    <p>
                      すべての試乗はプラセボマーケティングの代表者が同行する必要があります。試乗ルートは事前に決定され、運転者に伝達されます。事前の許可なく承認されたルートから逸脱することは許可されません。
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-placebo-black mb-2">5. 安全ガイドライン</h3>
                    <p>
                      試乗者はすべての交通法規と安全規則に従う必要があります。車内での喫煙、飲食（水を除く）は禁止されています。運転中の携帯電話の使用は、ハンズフリーでの緊急通話を除き厳格に禁止されています。
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-placebo-black mb-2">6. 時間と走行距離</h3>
                    <p>
                      試乗は別途合意がない限り45分間、30キロメートルに制限されます。真剣な購入者には追加の書類と承認により延長試乗が手配される場合があります。
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-placebo-black mb-2">7. 責任と損害</h3>
                    <p>
                      試乗者は試乗期間中に発生したあらゆる損害、罰金、または違反に対する責任を負います。これには交通違反、駐車違反、保険でカバーされない車両損害が含まれますが、これらに限定されません。
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-placebo-black mb-2">8. 緊急時の手順</h3>
                    <p>
                      緊急時には直ちに緊急サービスに連絡し、その後プラセボマーケティングに通知してください。緊急連絡先情報は試乗開始前に提供されます。
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-placebo-black mb-2">9. キャンセルポリシー</h3>
                    <p>
                      試乗予約は予定時刻の2時間前までペナルティなしでキャンセルできます。直前のキャンセルまたは無断欠席の場合、キャンセル料が発生する場合があります。
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-placebo-black mb-2">10. 同意</h3>
                    <p>
                      試乗を予約し参加することにより、上記のすべての利用規約を読み、理解し、遵守することに同意したことを認めます。これらの規約に違反した場合、試乗の即座の終了および法的措置の可能性があります。
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end">
              <Button
                onClick={() => setShowTermsModal(false)}
                disabled={!hasScrolledToBottom}
                className={`${
                  hasScrolledToBottom
                    ? "bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {hasScrolledToBottom
                  ? language === "en"
                    ? "Close"
                    : "閉じる"
                  : language === "en"
                    ? "Scroll to bottom to close"
                    : "最後まで読んでから閉じる"}
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h3 className="text-xl font-bold text-placebo-black">
                {language === "en" ? "Request Received!" : "リクエストを受信しました！"}
              </h3>

              <p className="text-placebo-dark-gray">
                {language === "en"
                  ? "Thank you for your test drive request. We have received your information and will contact you via email and phone call within 24 hours to confirm the date and details for your test drive."
                  : "試乗リクエストをありがとうございます。お客様の情報を受信いたしました。24時間以内にメールとお電話にて試乗の日時と詳細を確認させていただきます。"}
              </p>

              <div className="bg-placebo-gold/10 p-4 rounded-lg">
                <p className="text-sm text-placebo-dark-gray">
                  <strong className="text-placebo-black">{language === "en" ? "What's next?" : "次のステップ"}</strong>
                  <br />
                  {language === "en"
                    ? "• Check your email for confirmation details\n• We'll call to finalize the appointment\n• Bring your valid driver's license on test drive day"
                    : "• 確認詳細のメールをご確認ください\n• 予約確定のためお電話いたします\n• 試乗当日は有効な運転免許証をお持ちください"}
                </p>
              </div>

              <Button
                onClick={() => {
                  setShowConfirmation(false)
                  router.push(`/cars/${vehicleId}`)
                }}
                className="w-full bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90 font-semibold"
              >
                {language === "en" ? "Back to Vehicle Details" : "車両詳細に戻る"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
