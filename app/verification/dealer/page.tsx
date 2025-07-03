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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, CheckCircle2, FileText, Upload, User, Building2, Camera } from "lucide-react"
import { savePendingVerification } from "@/lib/admin-system"

export default function DealerVerificationPage() {
  const { language } = useLanguage()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState("personal")

  const [formData, setFormData] = useState({
    // Personal Information (Representative)
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

    // Business Information
    companyName: "",
    businessType: "",
    registrationNumber: "",
    taxId: "",
    establishedDate: "",
    numberOfEmployees: "",
    businessDescription: "",
    businessAddress: "",
    businessCity: "",
    businessPrefecture: "",
    businessPostalCode: "",
    dealerPermitNumber: "",
    dealerPermitExpiry: "",

    // Compliance
    agreeTerms: false,
    agreePrivacy: false,
    agreeAML: false,
    agreeDataProcessing: false,
    agreeDealerCompliance: false,
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Create verification submission
    const verificationData = {
      userType: "dealership" as const,
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
      businessInfo: {
        companyName: formData.companyName,
        businessType: formData.businessType,
        registrationNumber: formData.registrationNumber,
        taxId: formData.taxId,
        establishedDate: formData.establishedDate,
        numberOfEmployees: Number(formData.numberOfEmployees),
        businessAddress: {
          street: formData.businessAddress,
          city: formData.businessCity,
          prefecture: formData.businessPrefecture,
          postalCode: formData.businessPostalCode,
          country: "Japan",
        },
        representativeInfo: {
          name: `${formData.firstName} ${formData.lastName}`,
          position: "Representative",
          idNumber: formData.idNumber,
        },
        licenses: {
          dealerPermit: {
            number: formData.dealerPermitNumber,
            expiryDate: formData.dealerPermitExpiry,
          },
          businessRegistration: {},
        },
      },
      compliance: {
        termsAccepted: formData.agreeTerms,
        privacyPolicyAccepted: formData.agreePrivacy,
        antiMoneyLaunderingAccepted: formData.agreeAML,
        dataProcessingConsent: formData.agreeDataProcessing,
        agreeDealerCompliance: formData.agreeDealerCompliance,
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

  const isBusinessInfoComplete = () => {
    return (
      formData.companyName.trim() !== "" &&
      formData.businessType.trim() !== "" &&
      formData.registrationNumber.trim() !== "" &&
      formData.dealerPermitNumber.trim() !== "" &&
      formData.businessAddress.trim() !== ""
    )
  }

  const isComplianceComplete = () => {
    return (
      formData.agreeTerms &&
      formData.agreePrivacy &&
      formData.agreeAML &&
      formData.agreeDataProcessing &&
      formData.agreeDealerCompliance
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-placebo-black mb-2">
            {language === "en" ? "Complete Dealership Verification" : "ディーラー認証を完了"}
          </h1>
          <p className="text-gray-600">
            {language === "en"
              ? "Complete dealership verification to access all dealer features and manage unlimited vehicle listings."
              : "ディーラー認証を完了して、すべてのディーラー機能にアクセスし、無制限の車両リスティングを管理してください。"}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-placebo-gold" />
              {language === "en" ? "Licensed Dealership Verification" : "認可ディーラー認証"}
            </CardTitle>
            <CardDescription>
              {language === "en"
                ? "Comprehensive verification for licensed automotive dealerships. Your business information is encrypted and securely stored. Your submission will be reviewed by our team within 24-48 hours."
                : "認可自動車ディーラー向けの包括的な認証。あなたの事業情報は暗号化され、安全に保管されます。提出内容は24-48時間以内にチームが確認いたします。"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={currentStep} onValueChange={setCurrentStep} className="w-full">
              <TabsList className="grid w-full grid-cols-5">
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
                <TabsTrigger value="business" disabled={!isIdentityVerificationComplete()}>
                  <span className="flex items-center gap-1">
                    <Building2 className="h-4 w-4" />
                    <span className="hidden sm:inline">{language === "en" ? "Business" : "事業情報"}</span>
                  </span>
                </TabsTrigger>
                <TabsTrigger value="documents" disabled={!isBusinessInfoComplete()}>
                  <span className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    <span className="hidden sm:inline">{language === "en" ? "Documents" : "書類"}</span>
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="review"
                  disabled={!isBusinessInfoComplete() || !isIdentityVerificationComplete() || !isPersonalInfoComplete()}
                >
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="hidden sm:inline">{language === "en" ? "Review" : "確認"}</span>
                  </span>
                </TabsTrigger>
              </TabsList>

              <div className="mt-6">
                <TabsContent value="personal">
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="font-medium text-blue-800 mb-2">
                        {language === "en" ? "Representative Information" : "代表者情報"}
                      </h3>
                      <p className="text-sm text-blue-700">
                        {language === "en"
                          ? "Please provide information for the authorized representative of the dealership."
                          : "ディーラーの認定代表者の情報を提供してください。"}
                      </p>
                    </div>

                    <form className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName" className="text-sm font-medium">
                            {language === "en" ? "Representative First Name" : "代表者名"}
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
                            {language === "en" ? "Representative Last Name" : "代表者姓"}
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
                          {language === "en" ? "Personal Address" : "個人住所"}
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
                            {language === "en" ? "Business Email Address" : "事業メールアドレス"}
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
                            {language === "en" ? "Business Phone Number" : "事業電話番号"}
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
                  </div>
                </TabsContent>

                <TabsContent value="identity">
                  <form className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="font-medium text-blue-800 mb-2">
                        {language === "en" ? "Representative Identity Verification" : "代表者本人確認"}
                      </h3>
                      <p className="text-sm text-blue-700">
                        {language === "en"
                          ? "Identity verification for the authorized representative of the dealership."
                          : "ディーラーの認定代表者の本人確認。"}
                      </p>
                    </div>

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
                          {language === "en" ? "Upload Representative ID (Front)" : "代表者身分証明書（表面）"}
                          <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                          <Button type="button" variant="outline" size="sm">
                            {language === "en" ? "Choose File" : "ファイルを選択"}
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">
                          {language === "en" ? "Upload Representative ID (Back)" : "代表者身分証明書（裏面）"}
                        </Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                          <Button type="button" variant="outline" size="sm">
                            {language === "en" ? "Choose File" : "ファイルを選択"}
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">
                          {language === "en" ? "Representative Liveness Verification" : "代表者生体認証"}
                          <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <Camera className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                          <Button type="button" variant="outline" size="sm">
                            {language === "en" ? "Start Camera" : "カメラを開始"}
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
                        onClick={() => setCurrentStep("business")}
                        disabled={!isIdentityVerificationComplete()}
                        className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90"
                      >
                        {language === "en" ? "Next" : "次へ"}
                      </Button>
                    </div>
                  </form>
                </TabsContent>

                <TabsContent value="business">
                  <form className="space-y-4">
                    <div>
                      <Label htmlFor="companyName" className="text-sm font-medium">
                        {language === "en" ? "Company Name" : "会社名"}
                        <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <Input
                        id="companyName"
                        value={formData.companyName}
                        onChange={(e) => handleInputChange("companyName", e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="businessType" className="text-sm font-medium">
                          {language === "en" ? "Business Type" : "事業タイプ"}
                          <span className="text-red-500 ml-1">*</span>
                        </Label>
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
                        <Label htmlFor="establishedDate" className="text-sm font-medium">
                          {language === "en" ? "Established Date" : "設立日"}
                        </Label>
                        <Input
                          id="establishedDate"
                          type="date"
                          value={formData.establishedDate}
                          onChange={(e) => handleInputChange("establishedDate", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="registrationNumber" className="text-sm font-medium">
                          {language === "en" ? "Business Registration Number" : "事業登録番号"}
                          <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <Input
                          id="registrationNumber"
                          value={formData.registrationNumber}
                          onChange={(e) => handleInputChange("registrationNumber", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="taxId" className="text-sm font-medium">
                          {language === "en" ? "Tax ID" : "税務ID"}
                        </Label>
                        <Input
                          id="taxId"
                          value={formData.taxId}
                          onChange={(e) => handleInputChange("taxId", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="dealerPermitNumber" className="text-sm font-medium">
                          {language === "en" ? "Dealer Permit Number" : "ディーラー許可番号"}
                          <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <Input
                          id="dealerPermitNumber"
                          value={formData.dealerPermitNumber}
                          onChange={(e) => handleInputChange("dealerPermitNumber", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="dealerPermitExpiry" className="text-sm font-medium">
                          {language === "en" ? "Dealer Permit Expiry" : "ディーラー許可有効期限"}
                        </Label>
                        <Input
                          id="dealerPermitExpiry"
                          type="date"
                          value={formData.dealerPermitExpiry}
                          onChange={(e) => handleInputChange("dealerPermitExpiry", e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="numberOfEmployees" className="text-sm font-medium">
                        {language === "en" ? "Number of Employees" : "従業員数"}
                      </Label>
                      <Input
                        id="numberOfEmployees"
                        type="number"
                        value={formData.numberOfEmployees}
                        onChange={(e) => handleInputChange("numberOfEmployees", e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="businessAddress" className="text-sm font-medium">
                        {language === "en" ? "Business Address" : "事業所住所"}
                        <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <Input
                        id="businessAddress"
                        value={formData.businessAddress}
                        onChange={(e) => handleInputChange("businessAddress", e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="businessCity" className="text-sm font-medium">
                          {language === "en" ? "Business City" : "事業所市区町村"}
                        </Label>
                        <Input
                          id="businessCity"
                          value={formData.businessCity}
                          onChange={(e) => handleInputChange("businessCity", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="businessPrefecture" className="text-sm font-medium">
                          {language === "en" ? "Business Prefecture" : "事業所都道府県"}
                        </Label>
                        <Input
                          id="businessPrefecture"
                          value={formData.businessPrefecture}
                          onChange={(e) => handleInputChange("businessPrefecture", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="businessPostalCode" className="text-sm font-medium">
                          {language === "en" ? "Business Postal Code" : "事業所郵便番号"}
                        </Label>
                        <Input
                          id="businessPostalCode"
                          value={formData.businessPostalCode}
                          onChange={(e) => handleInputChange("businessPostalCode", e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="businessDescription" className="text-sm font-medium">
                        {language === "en" ? "Business Description" : "事業内容"}
                      </Label>
                      <Textarea
                        id="businessDescription"
                        value={formData.businessDescription}
                        onChange={(e) => handleInputChange("businessDescription", e.target.value)}
                        placeholder={
                          language === "en"
                            ? "Describe your dealership's main business activities..."
                            : "ディーラーの主な事業活動を説明してください..."
                        }
                      />
                    </div>

                    <div className="pt-4 flex justify-between">
                      <Button type="button" variant="outline" onClick={() => setCurrentStep("identity")}>
                        {language === "en" ? "Back" : "戻る"}
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setCurrentStep("documents")}
                        disabled={!isBusinessInfoComplete()}
                        className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90"
                      >
                        {language === "en" ? "Next" : "次へ"}
                      </Button>
                    </div>
                  </form>
                </TabsContent>

                <TabsContent value="documents">
                  <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="font-medium text-blue-800 mb-2">
                        {language === "en" ? "Business Documentation" : "事業書類"}
                      </h3>
                      <p className="text-sm text-blue-700">
                        {language === "en"
                          ? "Upload required business documents to complete dealership verification."
                          : "ディーラー認証を完了するために必要な事業書類をアップロードしてください。"}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">
                          {language === "en" ? "Dealer Permit/License" : "ディーラー許可証/ライセンス"}
                          <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600 mb-2">
                            {language === "en"
                              ? "Upload your dealer permit or license document"
                              : "ディーラー許可証またはライセンス書類をアップロードしてください"}
                          </p>
                          <Button type="button" variant="outline" size="sm">
                            {language === "en" ? "Choose File" : "ファイルを選択"}
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">
                          {language === "en" ? "Business Registration Certificate" : "事業登録証明書"}
                          <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600 mb-2">
                            {language === "en"
                              ? "Upload your business registration certificate"
                              : "事業登録証明書をアップロードしてください"}
                          </p>
                          <Button type="button" variant="outline" size="sm">
                            {language === "en" ? "Choose File" : "ファイルを選択"}
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">
                          {language === "en" ? "Company Seal (Hanko)" : "会社印（判子）"}
                        </Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600 mb-2">
                            {language === "en"
                              ? "Upload image of your registered company seal"
                              : "登録済み会社印の画像をアップロードしてください"}
                          </p>
                          <Button type="button" variant="outline" size="sm">
                            {language === "en" ? "Choose File" : "ファイルを選択"}
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">
                          {language === "en" ? "Tax Registration Document" : "税務登録書類"}
                        </Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600 mb-2">
                            {language === "en"
                              ? "Upload tax registration or certificate"
                              : "税務登録書または証明書をアップロードしてください"}
                          </p>
                          <Button type="button" variant="outline" size="sm">
                            {language === "en" ? "Choose File" : "ファイルを選択"}
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">
                          {language === "en" ? "Business Insurance Certificate" : "事業保険証明書"}
                        </Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600 mb-2">
                            {language === "en"
                              ? "Upload business insurance certificate"
                              : "事業保険証明書をアップロードしてください"}
                          </p>
                          <Button type="button" variant="outline" size="sm">
                            {language === "en" ? "Choose File" : "ファイルを選択"}
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 flex justify-between">
                      <Button type="button" variant="outline" onClick={() => setCurrentStep("business")}>
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
                          {language === "en" ? "Dealership Compliance" : "ディーラーコンプライアンス"}
                        </h3>
                        <p className="text-sm text-amber-700">
                          {language === "en"
                            ? "As a licensed dealership, you have unlimited listing capabilities and access to all dealer features. Your submission will be reviewed by our team within 24-48 hours."
                            : "認可ディーラーとして、無制限のリスティング機能とすべてのディーラー機能にアクセスできます。提出内容は24-48時間以内にチームが確認いたします。"}
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
                              ? "I consent to the processing of business data for verification"
                              : "認証のための事業データ処理に同意します"}
                          </label>
                        </div>
                      </div>

                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="dealerCompliance"
                          checked={formData.agreeDealerCompliance}
                          onCheckedChange={(checked) => handleInputChange("agreeDealerCompliance", checked)}
                        />
                        <div className="grid gap-1.5 leading-none">
                          <label htmlFor="dealerCompliance" className="text-sm font-medium leading-none">
                            {language === "en"
                              ? "I acknowledge compliance with all applicable dealer regulations and licensing requirements"
                              : "すべての適用されるディーラー規制およびライセンス要件の遵守を認めます"}
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 flex justify-between">
                      <Button type="button" variant="outline" onClick={() => setCurrentStep("documents")}>
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
                            ? "Submit Dealership Verification"
                            : "ディーラー認証を送信"}
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
