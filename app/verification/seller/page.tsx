"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, CheckCircle2, FileText, Shield, Upload, User, Camera } from "lucide-react"
import { savePendingVerification } from "@/lib/admin-system"

export default function SellerVerificationPage() {
  const { language } = useLanguage()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState("personal")

  const [userSellerType, setUserSellerType] = useState("private") // "private" or "dealership"

  // Add useEffect to determine seller type (this would come from your auth system)
  useEffect(() => {
    // Check URL params first, then localStorage
    const urlParams = new URLSearchParams(window.location.search)
    const sellerType = urlParams.get("type") || localStorage.getItem("registeredSellerType") || "private"
    setUserSellerType(sellerType)
  }, [])

  // Redirect dealerships to the proper verification flow
  useEffect(() => {
    if (userSellerType === "dealership") {
      router.push("/verification/dealer")
    }
  }, [userSellerType, router])

  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    nationality: "Japan",
    address: "",
    city: "",
    prefecture: "",
    postalCode: "",
    country: "Japan",
    email: "",
    phone: "",

    // Identity Documents
    idType: "drivers_license",
    idNumber: "",
    idExpiryDate: "",

    // Compliance
    agreeTerms: false,
    agreePrivacy: false,
    agreeAML: false,
    agreeDataProcessing: false,
    agreeKobutsu: false, // For sellers
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Create verification submission
    const verificationData = {
      userType: "private_seller" as const,
      personalInfo: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        nationality: formData.nationality,
        address: {
          street: formData.address,
          city: formData.city,
          prefecture: formData.prefecture,
          postalCode: formData.postalCode,
          country: formData.country,
        },
        contact: {
          email: formData.email,
          phone: formData.phone,
        },
      },
      identityDocuments: {
        primaryId: {
          type: formData.idType as "drivers_license" | "passport" | "residence_card" | "mynumber_card",
          number: formData.idNumber,
          expiryDate: formData.idExpiryDate,
        },
        livenessCheck: {
          completed: false, // Would be updated when documents are uploaded
        },
        addressProof: {
          type: "utility_bill" as const,
          issueDate: new Date().toISOString().split("T")[0],
        },
      },
      compliance: {
        termsAccepted: formData.agreeTerms,
        privacyPolicyAccepted: formData.agreePrivacy,
        antiMoneyLaunderingAccepted: formData.agreeAML,
        dataProcessingConsent: formData.agreeDataProcessing,
        kobutsuEigyoAcknowledged: formData.agreeKobutsu,
      },
    }

    // Save to pending verifications
    savePendingVerification(verificationData)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Navigate to confirmation page
    router.push("/verification/confirmation")
  }

  const isPersonalInfoComplete = () => {
    return (
      formData.firstName.trim() !== "" &&
      formData.lastName.trim() !== "" &&
      formData.dateOfBirth.trim() !== "" &&
      formData.address.trim() !== "" &&
      formData.city.trim() !== "" &&
      formData.prefecture.trim() !== "" &&
      formData.postalCode.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.phone.trim() !== ""
    )
  }

  const isIdentityVerificationComplete = () => {
    return formData.idType.trim() !== "" && formData.idNumber.trim() !== "" && formData.idExpiryDate.trim() !== ""
  }

  const isComplianceComplete = () => {
    return (
      formData.agreeTerms &&
      formData.agreePrivacy &&
      formData.agreeAML &&
      formData.agreeDataProcessing &&
      formData.agreeKobutsu
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-placebo-black mb-2">
            {language === "en" ? "Complete Seller Verification" : "販売者認証を完了"}
          </h1>
          <p className="text-gray-600">
            {language === "en"
              ? "Complete seller verification to list and manage your vehicles on our platform."
              : "プラットフォームで車両を出品・管理するために販売者認証を完了してください。"}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-placebo-gold" />
              {userSellerType === "dealership"
                ? language === "en"
                  ? "Dealership Verification"
                  : "ディーラー認証"
                : language === "en"
                  ? "Private Seller Verification"
                  : "個人販売者認証"}
            </CardTitle>
            <CardDescription>
              {userSellerType === "dealership"
                ? language === "en"
                  ? "Complete dealership verification to access all dealer features and manage unlimited vehicle listings."
                  : "ディーラー認証を完了して、すべてのディーラー機能にアクセスし、無制限の車両リスティングを管理してください。"
                : language === "en"
                  ? "As a private seller, you can sell up to 2 vehicles per year. Your information is encrypted and securely stored. Your submission will be reviewed by our team within 24-48 hours."
                  : "個人販売者として、年間最大2台の車両を販売できます。あなたの情報は暗号化され、安全に保管されます。提出内容は24-48時間以内にチームが確認いたします。"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={currentStep} onValueChange={setCurrentStep} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="personal">
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">{language === "en" ? "Personal" : "個人情報"}</span>
                  </span>
                </TabsTrigger>
                <TabsTrigger value="identity" disabled={!isPersonalInfoComplete()}>
                  <span className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    <span className="hidden sm:inline">{language === "en" ? "Identity" : "本人確認"}</span>
                  </span>
                </TabsTrigger>
                <TabsTrigger value="vehicle-ownership" disabled={!isIdentityVerificationComplete()}>
                  <span className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    <span className="hidden sm:inline">{language === "en" ? "Ownership" : "所有権"}</span>
                  </span>
                </TabsTrigger>
                <TabsTrigger value="review" disabled={!isIdentityVerificationComplete() || !isPersonalInfoComplete()}>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="hidden sm:inline">{language === "en" ? "Review" : "確認"}</span>
                  </span>
                </TabsTrigger>
              </TabsList>

              <div className="mt-6">
                <TabsContent value="personal">
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName" className="text-sm font-medium">
                          {language === "en" ? "First Name" : "名"}
                          <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName" className="text-sm font-medium">
                          {language === "en" ? "Last Name" : "姓"}
                          <span className="text-red-500 ml-1">*</span>
                        </Label>
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
                        <Label htmlFor="dateOfBirth" className="text-sm font-medium">
                          {language === "en" ? "Date of Birth" : "生年月日"}
                          <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="nationality" className="text-sm font-medium">
                          {language === "en" ? "Nationality" : "国籍"}
                          <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <Select
                          value={formData.nationality}
                          onValueChange={(value) => handleInputChange("nationality", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Japan">{language === "en" ? "Japan" : "日本"}</SelectItem>
                            <SelectItem value="United States">
                              {language === "en" ? "United States" : "アメリカ合衆国"}
                            </SelectItem>
                            <SelectItem value="China">{language === "en" ? "China" : "中国"}</SelectItem>
                            <SelectItem value="South Korea">{language === "en" ? "South Korea" : "韓国"}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address" className="text-sm font-medium">
                        {language === "en" ? "Address" : "住所"}
                        <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city" className="text-sm font-medium">
                          {language === "en" ? "City" : "市区町村"}
                          <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => handleInputChange("city", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="prefecture" className="text-sm font-medium">
                          {language === "en" ? "Prefecture" : "都道府県"}
                          <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <Input
                          id="prefecture"
                          value={formData.prefecture}
                          onChange={(e) => handleInputChange("prefecture", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="postalCode" className="text-sm font-medium">
                          {language === "en" ? "Postal Code" : "郵便番号"}
                          <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <Input
                          id="postalCode"
                          value={formData.postalCode}
                          onChange={(e) => handleInputChange("postalCode", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email" className="text-sm font-medium">
                          {language === "en" ? "Email Address" : "メールアドレス"}
                          <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone" className="text-sm font-medium">
                          {language === "en" ? "Phone Number" : "電話番号"}
                          <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <Button
                        type="button"
                        onClick={() => setCurrentStep("identity")}
                        disabled={!isPersonalInfoComplete()}
                        className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90"
                      >
                        {language === "en" ? "Next" : "次へ"}
                      </Button>
                    </div>
                  </form>
                </TabsContent>

                <TabsContent value="identity">
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="idType" className="text-sm font-medium">
                          {language === "en" ? "ID Type" : "身分証明書の種類"}
                          <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <Select value={formData.idType} onValueChange={(value) => handleInputChange("idType", value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="drivers_license">
                              {language === "en" ? "Driver's License" : "運転免許証"}
                            </SelectItem>
                            <SelectItem value="passport">{language === "en" ? "Passport" : "パスポート"}</SelectItem>
                            <SelectItem value="residence_card">
                              {language === "en" ? "Residence Card" : "在留カード"}
                            </SelectItem>
                            <SelectItem value="mynumber_card">
                              {language === "en" ? "My Number Card" : "マイナンバーカード"}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="idNumber" className="text-sm font-medium">
                          {language === "en" ? "ID Number" : "身分証明書番号"}
                          <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <Input
                          id="idNumber"
                          value={formData.idNumber}
                          onChange={(e) => handleInputChange("idNumber", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="idExpiryDate" className="text-sm font-medium">
                        {language === "en" ? "ID Expiry Date" : "身分証明書有効期限"}
                        <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <Input
                        id="idExpiryDate"
                        type="date"
                        value={formData.idExpiryDate}
                        onChange={(e) => handleInputChange("idExpiryDate", e.target.value)}
                        required
                      />
                    </div>

                    {/* Document Upload Sections */}
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">
                          {language === "en" ? "Upload ID Document (Front)" : "身分証明書のアップロード（表面）"}
                          <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600 mb-2">
                            {language === "en"
                              ? "Upload front side of your ID document"
                              : "身分証明書の表面をアップロードしてください"}
                          </p>
                          <Button type="button" variant="outline" size="sm">
                            {language === "en" ? "Choose File" : "ファイルを選択"}
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">
                          {language === "en" ? "Upload ID Document (Back)" : "身分証明書のアップロード（裏面）"}
                        </Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600 mb-2">
                            {language === "en"
                              ? "Upload back side of your ID document (if applicable)"
                              : "身分証明書の裏面をアップロードしてください（該当する場合）"}
                          </p>
                          <Button type="button" variant="outline" size="sm">
                            {language === "en" ? "Choose File" : "ファイルを選択"}
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">
                          {language === "en" ? "Liveness Verification" : "生体認証"}
                          <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <Camera className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600 mb-2">
                            {language === "en"
                              ? "Take a selfie for liveness verification"
                              : "生体認証のためのセルフィーを撮影してください"}
                          </p>
                          <Button type="button" variant="outline" size="sm">
                            {language === "en" ? "Start Camera" : "カメラを開始"}
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">
                          {language === "en" ? "Address Proof Document" : "住所証明書"}
                          <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600 mb-2">
                            {language === "en"
                              ? "Upload utility bill, bank statement, or residence certificate"
                              : "公共料金請求書、銀行明細書、または住民票をアップロードしてください"}
                          </p>
                          <Button type="button" variant="outline" size="sm">
                            {language === "en" ? "Choose File" : "ファイルを選択"}
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 flex justify-between">
                      <Button type="button" variant="outline" onClick={() => setCurrentStep("personal")}>
                        {language === "en" ? "Back" : "戻る"}
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setCurrentStep("vehicle-ownership")}
                        disabled={!isIdentityVerificationComplete()}
                        className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90"
                      >
                        {language === "en" ? "Next" : "次へ"}
                      </Button>
                    </div>
                  </form>
                </TabsContent>

                <TabsContent value="vehicle-ownership">
                  <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="font-medium text-blue-800 mb-2">
                        {language === "en" ? "Vehicle Ownership Verification" : "車両所有権の確認"}
                      </h3>
                      <p className="text-sm text-blue-700">
                        {language === "en"
                          ? "As a private seller, you'll need to provide ownership documents for each vehicle you list. This can be done when creating listings."
                          : "個人販売者として、出品する各車両の所有権書類を提供する必要があります。これはリスティング作成時に行うことができます。"}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">
                          {language === "en"
                            ? "Sample Vehicle Registration (Optional)"
                            : "車両登録証のサンプル（任意）"}
                        </Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600 mb-2">
                            {language === "en"
                              ? "Upload a sample vehicle registration document to speed up future listings"
                              : "将来のリスティングを迅速化するために、車両登録証のサンプルをアップロードしてください"}
                          </p>
                          <Button type="button" variant="outline" size="sm">
                            {language === "en" ? "Choose File" : "ファイルを選択"}
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 flex justify-between">
                      <Button type="button" variant="outline" onClick={() => setCurrentStep("identity")}>
                        {language === "en" ? "Back" : "戻る"}
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setCurrentStep("review")}
                        className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90"
                      >
                        {language === "en" ? "Next" : "次へ"}
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="review">
                  <div className="space-y-6">
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-amber-800">
                          {language === "en" ? "Private Seller Compliance" : "個人販売者コンプライアンス"}
                        </h3>
                        <p className="text-sm text-amber-700">
                          {language === "en"
                            ? "As a private seller in Japan, you can sell up to 2 vehicles per year. Selling more requires a dealer license. Your submission will be reviewed by our team within 24-48 hours."
                            : "日本の個人販売者として、年間最大2台の車両を販売できます。それ以上の販売にはディーラーライセンスが必要です。提出内容は24-48時間以内にチームが確認いたします。"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="terms"
                          checked={formData.agreeTerms}
                          onCheckedChange={(checked) => handleInputChange("agreeTerms", checked)}
                        />
                        <div className="grid gap-1.5 leading-none">
                          <label htmlFor="terms" className="text-sm font-medium leading-none">
                            {language === "en"
                              ? "I agree to the Terms of Service and Privacy Policy"
                              : "利用規約とプライバシーポリシーに同意します"}
                          </label>
                        </div>
                      </div>

                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="aml"
                          checked={formData.agreeAML}
                          onCheckedChange={(checked) => handleInputChange("agreeAML", checked)}
                        />
                        <div className="grid gap-1.5 leading-none">
                          <label htmlFor="aml" className="text-sm font-medium leading-none">
                            {language === "en"
                              ? "I agree to Anti-Money Laundering (AML) compliance"
                              : "マネーロンダリング防止（AML）コンプライアンスに同意します"}
                          </label>
                        </div>
                      </div>

                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="dataProcessing"
                          checked={formData.agreeDataProcessing}
                          onCheckedChange={(checked) => handleInputChange("agreeDataProcessing", checked)}
                        />
                        <div className="grid gap-1.5 leading-none">
                          <label htmlFor="dataProcessing" className="text-sm font-medium leading-none">
                            {language === "en"
                              ? "I consent to the processing of my personal data for verification"
                              : "認証のための個人データ処理に同意します"}
                          </label>
                        </div>
                      </div>

                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="kobutsu"
                          checked={formData.agreeKobutsu}
                          onCheckedChange={(checked) => handleInputChange("agreeKobutsu", checked)}
                        />
                        <div className="grid gap-1.5 leading-none">
                          <label htmlFor="kobutsu" className="text-sm font-medium leading-none">
                            {language === "en"
                              ? "I acknowledge compliance with 古物営業法 (Used Goods Business Law) and understand the 2-vehicle annual limit"
                              : "古物営業法の遵守を認め、年間2台の制限を理解しています"}
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 flex justify-between">
                      <Button type="button" variant="outline" onClick={() => setCurrentStep("vehicle-ownership")}>
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
                            ? "Submit Seller Verification"
                            : "販売者認証を送信"}
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
