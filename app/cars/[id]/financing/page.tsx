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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { toast } from "@/components/ui/use-toast"
import { ArrowLeft, CreditCard, Calculator, TrendingUp, Shield, Info } from "lucide-react"

export default function FinancingPage() {
  const params = useParams()
  const router = useRouter()
  const { language } = useLanguage()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [vehiclePrice] = useState(1250000) // This would come from vehicle data
  const [formData, setFormData] = useState({
    // Personal Information
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    nationality: "",
    residencyStatus: "",

    // Employment Information
    employmentStatus: "",
    employer: "",
    monthlyIncome: "",
    employmentDuration: "",

    // Financial Information
    downPayment: vehiclePrice * 0.2, // 20% default
    loanTerm: 60, // months
    creditScore: "",
    existingDebts: "",
    bankPreference: "",

    // Loan Preferences
    loanType: "",
    insuranceRequired: true,
    agreeToTerms: false,
  })

  const vehicleId = params.id as string

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast({
      title: language === "en" ? "Financing Quote Requested!" : "融資見積もりリクエスト完了！",
      description:
        language === "en"
          ? "We'll contact you within 24 hours with financing options and pre-approval status."
          : "24時間以内に融資オプションと事前承認状況についてご連絡いたします。",
    })

    // Redirect back to vehicle details
    router.push(`/cars/${vehicleId}`)
    setIsSubmitting(false)
  }

  // Calculate loan details
  const loanAmount = vehiclePrice - formData.downPayment
  const monthlyInterestRate = 0.035 / 12 // Assuming 3.5% annual rate
  const monthlyPayment =
    (loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, formData.loanTerm))) /
    (Math.pow(1 + monthlyInterestRate, formData.loanTerm) - 1)
  const totalPayment = monthlyPayment * formData.loanTerm + formData.downPayment
  const totalInterest = totalPayment - vehiclePrice

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(language === "en" ? "en-US" : "ja-JP", {
      style: "currency",
      currency: "JPY",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const employmentStatuses = [
    { value: "full-time", label: language === "en" ? "Full-time Employee" : "正社員" },
    { value: "part-time", label: language === "en" ? "Part-time Employee" : "パートタイム" },
    { value: "self-employed", label: language === "en" ? "Self-employed" : "自営業" },
    { value: "military", label: language === "en" ? "Military Personnel" : "軍関係者" },
    { value: "contractor", label: language === "en" ? "Contractor" : "契約社員" },
    { value: "retired", label: language === "en" ? "Retired" : "退職者" },
  ]

  const loanTerms = [
    { value: 36, label: language === "en" ? "3 years" : "3年" },
    { value: 48, label: language === "en" ? "4 years" : "4年" },
    { value: 60, label: language === "en" ? "5 years" : "5年" },
    { value: 72, label: language === "en" ? "6 years" : "6年" },
    { value: 84, label: language === "en" ? "7 years" : "7年" },
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
            <CreditCard className="h-8 w-8 text-placebo-gold" />
            <h1 className="text-3xl font-bold">{language === "en" ? "Get Financing Quote" : "融資見積もり取得"}</h1>
          </div>
          <p className="text-gray-300">
            {language === "en"
              ? "Apply for vehicle financing with competitive rates and flexible terms"
              : "競争力のある金利と柔軟な条件で車両融資を申し込む"}
          </p>
        </div>
      </div>

      <div className="container py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <Card className="border-gray-200 bg-placebo-white">
                <CardHeader>
                  <CardTitle className="text-2xl text-placebo-black">
                    {language === "en" ? "Financing Application" : "融資申請"}
                  </CardTitle>
                  <CardDescription>
                    {language === "en"
                      ? "Complete the form below to receive personalized financing options."
                      : "以下のフォームにご記入いただき、個別の融資オプションを受け取ってください。"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-8">
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
                          <Label htmlFor="dateOfBirth">{language === "en" ? "Date of Birth" : "生年月日"} *</Label>
                          <Input
                            id="dateOfBirth"
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={(e) => updateFormData("dateOfBirth", e.target.value)}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="nationality">{language === "en" ? "Nationality" : "国籍"} *</Label>
                          <Select
                            value={formData.nationality}
                            onValueChange={(value) => updateFormData("nationality", value)}
                          >
                            <SelectTrigger id="nationality">
                              <SelectValue placeholder={language === "en" ? "Select nationality" : "国籍を選択"} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="japanese">{language === "en" ? "Japanese" : "日本"}</SelectItem>
                              <SelectItem value="american">{language === "en" ? "American" : "アメリカ"}</SelectItem>
                              <SelectItem value="other">{language === "en" ? "Other" : "その他"}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="residencyStatus">
                            {language === "en" ? "Residency Status" : "居住ステータス"} *
                          </Label>
                          <Select
                            value={formData.residencyStatus}
                            onValueChange={(value) => updateFormData("residencyStatus", value)}
                          >
                            <SelectTrigger id="residencyStatus">
                              <SelectValue placeholder={language === "en" ? "Select status" : "ステータスを選択"} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="citizen">
                                {language === "en" ? "Japanese Citizen" : "日本国民"}
                              </SelectItem>
                              <SelectItem value="permanent">
                                {language === "en" ? "Permanent Resident" : "永住者"}
                              </SelectItem>
                              <SelectItem value="military">
                                {language === "en" ? "Military Personnel" : "軍関係者"}
                              </SelectItem>
                              <SelectItem value="temporary">
                                {language === "en" ? "Temporary Resident" : "一時居住者"}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Employment Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-placebo-black">
                        {language === "en" ? "Employment Information" : "雇用情報"}
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="employmentStatus">
                            {language === "en" ? "Employment Status" : "雇用状況"} *
                          </Label>
                          <Select
                            value={formData.employmentStatus}
                            onValueChange={(value) => updateFormData("employmentStatus", value)}
                          >
                            <SelectTrigger id="employmentStatus">
                              <SelectValue placeholder={language === "en" ? "Select status" : "状況を選択"} />
                            </SelectTrigger>
                            <SelectContent>
                              {employmentStatuses.map((status) => (
                                <SelectItem key={status.value} value={status.value}>
                                  {status.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="employer">{language === "en" ? "Employer" : "雇用主"} *</Label>
                          <Input
                            id="employer"
                            placeholder={language === "en" ? "Company name" : "会社名"}
                            value={formData.employer}
                            onChange={(e) => updateFormData("employer", e.target.value)}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="monthlyIncome">
                            {language === "en" ? "Monthly Income (JPY)" : "月収（円）"} *
                          </Label>
                          <Input
                            id="monthlyIncome"
                            type="number"
                            placeholder="300000"
                            value={formData.monthlyIncome}
                            onChange={(e) => updateFormData("monthlyIncome", e.target.value)}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="employmentDuration">
                            {language === "en" ? "Employment Duration" : "雇用期間"} *
                          </Label>
                          <Select
                            value={formData.employmentDuration}
                            onValueChange={(value) => updateFormData("employmentDuration", value)}
                          >
                            <SelectTrigger id="employmentDuration">
                              <SelectValue placeholder={language === "en" ? "Select duration" : "期間を選択"} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0-6">{language === "en" ? "0-6 months" : "0-6ヶ月"}</SelectItem>
                              <SelectItem value="6-12">{language === "en" ? "6-12 months" : "6-12ヶ月"}</SelectItem>
                              <SelectItem value="1-2">{language === "en" ? "1-2 years" : "1-2年"}</SelectItem>
                              <SelectItem value="2-5">{language === "en" ? "2-5 years" : "2-5年"}</SelectItem>
                              <SelectItem value="5+">{language === "en" ? "5+ years" : "5年以上"}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Loan Preferences */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-placebo-black">
                        {language === "en" ? "Loan Preferences" : "ローン設定"}
                      </h3>

                      <div className="space-y-6">
                        {/* Down Payment */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label>{language === "en" ? "Down Payment" : "頭金"}</Label>
                            <span className="font-semibold text-placebo-gold">
                              {formatCurrency(formData.downPayment)}
                            </span>
                          </div>
                          <Slider
                            value={[formData.downPayment]}
                            onValueChange={(value) => updateFormData("downPayment", value[0])}
                            max={vehiclePrice * 0.5}
                            min={vehiclePrice * 0.1}
                            step={50000}
                            className="w-full"
                          />
                          <div className="flex justify-between text-sm text-placebo-dark-gray">
                            <span>{formatCurrency(vehiclePrice * 0.1)} (10%)</span>
                            <span>{formatCurrency(vehiclePrice * 0.5)} (50%)</span>
                          </div>
                        </div>

                        {/* Loan Term */}
                        <div className="space-y-2">
                          <Label htmlFor="loanTerm">{language === "en" ? "Loan Term" : "ローン期間"} *</Label>
                          <Select
                            value={formData.loanTerm.toString()}
                            onValueChange={(value) => updateFormData("loanTerm", Number.parseInt(value))}
                          >
                            <SelectTrigger id="loanTerm">
                              <SelectValue placeholder={language === "en" ? "Select term" : "期間を選択"} />
                            </SelectTrigger>
                            <SelectContent>
                              {loanTerms.map((term) => (
                                <SelectItem key={term.value} value={term.value.toString()}>
                                  {term.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Loan Type */}
                        <div className="space-y-2">
                          <Label>{language === "en" ? "Loan Type Preference" : "ローンタイプの希望"}</Label>
                          <RadioGroup
                            value={formData.loanType}
                            onValueChange={(value) => updateFormData("loanType", value)}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="new" id="new" />
                              <Label htmlFor="new" className="font-normal">
                                {language === "en" ? "New Vehicle Loan" : "新車ローン"}
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="used" id="used" />
                              <Label htmlFor="used" className="font-normal">
                                {language === "en" ? "Used Vehicle Loan" : "中古車ローン"}
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>

                        {/* Bank Preference */}
                        <div className="space-y-2">
                          <Label htmlFor="bankPreference">{language === "en" ? "Bank Preference" : "銀行の希望"}</Label>
                          <Select
                            value={formData.bankPreference}
                            onValueChange={(value) => updateFormData("bankPreference", value)}
                          >
                            <SelectTrigger id="bankPreference">
                              <SelectValue placeholder={language === "en" ? "Select bank" : "銀行を選択"} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="any">
                                {language === "en" ? "Any Bank (Best Rate)" : "どの銀行でも（最良レート）"}
                              </SelectItem>
                              <SelectItem value="mizuho">{language === "en" ? "Mizuho Bank" : "みずほ銀行"}</SelectItem>
                              <SelectItem value="sumitomo">
                                {language === "en" ? "Sumitomo Mitsui" : "三井住友銀行"}
                              </SelectItem>
                              <SelectItem value="ufj">{language === "en" ? "MUFG Bank" : "三菱UFJ銀行"}</SelectItem>
                              <SelectItem value="okinawa">
                                {language === "en" ? "Bank of Okinawa" : "沖縄銀行"}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* Financial Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-placebo-black">
                        {language === "en" ? "Financial Information" : "財務情報"}
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="creditScore">
                            {language === "en" ? "Credit Score Range" : "クレジットスコア範囲"}
                          </Label>
                          <Select
                            value={formData.creditScore}
                            onValueChange={(value) => updateFormData("creditScore", value)}
                          >
                            <SelectTrigger id="creditScore">
                              <SelectValue placeholder={language === "en" ? "Select range" : "範囲を選択"} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="excellent">
                                {language === "en" ? "Excellent (750+)" : "優秀（750+）"}
                              </SelectItem>
                              <SelectItem value="good">
                                {language === "en" ? "Good (700-749)" : "良好（700-749）"}
                              </SelectItem>
                              <SelectItem value="fair">
                                {language === "en" ? "Fair (650-699)" : "普通（650-699）"}
                              </SelectItem>
                              <SelectItem value="poor">
                                {language === "en" ? "Poor (600-649)" : "不良（600-649）"}
                              </SelectItem>
                              <SelectItem value="unknown">
                                {language === "en" ? "Unknown/No Credit" : "不明/クレジットなし"}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="existingDebts">
                            {language === "en" ? "Monthly Debt Payments (JPY)" : "月々の債務支払い（円）"}
                          </Label>
                          <Input
                            id="existingDebts"
                            type="number"
                            placeholder="50000"
                            value={formData.existingDebts}
                            onChange={(e) => updateFormData("existingDebts", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Insurance */}
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="insuranceRequired"
                        checked={formData.insuranceRequired}
                        onCheckedChange={(checked) => updateFormData("insuranceRequired", checked)}
                      />
                      <label htmlFor="insuranceRequired" className="text-sm font-medium">
                        {language === "en"
                          ? "I understand that comprehensive insurance is required"
                          : "包括的な保険が必要であることを理解しています"}
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
                            ? "I agree to the financing terms and credit check authorization"
                            : "融資条件と信用調査の承認に同意します"}
                        </label>
                        <p className="text-sm text-placebo-dark-gray">
                          {language === "en"
                            ? "By submitting this application, you authorize us to perform a credit check and share your information with our lending partners."
                            : "この申請を送信することにより、信用調査の実行と融資パートナーとの情報共有を承認したことになります。"}
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
                          {language === "en" ? "Processing..." : "処理中..."}
                        </>
                      ) : (
                        <>
                          <CreditCard className="mr-2 h-4 w-4" />
                          {language === "en" ? "Get Financing Quote" : "融資見積もりを取得"}
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Loan Calculator & Information */}
            <div className="space-y-6">
              {/* Loan Calculator */}
              <Card className="border-placebo-gold bg-placebo-gold/5">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-placebo-black">
                    <Calculator className="h-5 w-5 text-placebo-gold" />
                    {language === "en" ? "Loan Calculator" : "ローン計算機"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-placebo-dark-gray">
                        {language === "en" ? "Vehicle Price:" : "車両価格:"}
                      </span>
                      <span className="font-semibold">{formatCurrency(vehiclePrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-placebo-dark-gray">
                        {language === "en" ? "Down Payment:" : "頭金:"}
                      </span>
                      <span className="font-semibold">{formatCurrency(formData.downPayment)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-placebo-dark-gray">
                        {language === "en" ? "Loan Amount:" : "ローン金額:"}
                      </span>
                      <span className="font-semibold">{formatCurrency(loanAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-placebo-dark-gray">
                        {language === "en" ? "Loan Term:" : "ローン期間:"}
                      </span>
                      <span className="font-semibold">
                        {formData.loanTerm} {language === "en" ? "months" : "ヶ月"}
                      </span>
                    </div>
                    <hr className="border-placebo-gold/20" />
                    <div className="flex justify-between">
                      <span className="font-medium">{language === "en" ? "Monthly Payment:" : "月々の支払い:"}</span>
                      <span className="font-bold text-placebo-gold">{formatCurrency(monthlyPayment)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-placebo-dark-gray">
                        {language === "en" ? "Total Interest:" : "総利息:"}
                      </span>
                      <span className="font-semibold">{formatCurrency(totalInterest)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-placebo-dark-gray">
                        {language === "en" ? "Total Payment:" : "総支払額:"}
                      </span>
                      <span className="font-semibold">{formatCurrency(totalPayment)}</span>
                    </div>
                  </div>
                  <div className="text-xs text-placebo-dark-gray">
                    * {language === "en" ? "Estimated based on 3.5% APR" : "年利3.5%での概算"}
                  </div>
                </CardContent>
              </Card>

              {/* Financing Benefits */}
              <Card className="border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-placebo-gold" />
                    {language === "en" ? "Financing Benefits" : "融資のメリット"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="text-sm text-placebo-dark-gray space-y-2">
                    <li>• {language === "en" ? "Competitive interest rates" : "競争力のある金利"}</li>
                    <li>• {language === "en" ? "Flexible payment terms" : "柔軟な支払い条件"}</li>
                    <li>• {language === "en" ? "Quick pre-approval process" : "迅速な事前承認プロセス"}</li>
                    <li>• {language === "en" ? "No prepayment penalties" : "早期返済手数料なし"}</li>
                    <li>• {language === "en" ? "Multiple lender options" : "複数の貸し手オプション"}</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Requirements */}
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-blue-800">
                    <Info className="h-5 w-5" />
                    {language === "en" ? "Requirements" : "必要条件"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="text-sm text-blue-700 space-y-2">
                    <li>• {language === "en" ? "Valid ID and residence proof" : "有効なIDと居住証明"}</li>
                    <li>• {language === "en" ? "Proof of income" : "収入証明"}</li>
                    <li>• {language === "en" ? "Bank statements (3 months)" : "銀行明細書（3ヶ月分）"}</li>
                    <li>• {language === "en" ? "Employment verification" : "雇用証明"}</li>
                    <li>• {language === "en" ? "Comprehensive insurance" : "包括的な保険"}</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Security Notice */}
              <Card className="border-green-200 bg-green-50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <Shield className="h-5 w-5" />
                    {language === "en" ? "Secure & Confidential" : "安全・機密"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-green-700">
                    {language === "en"
                      ? "Your personal and financial information is protected with bank-level encryption and will only be shared with approved lending partners."
                      : "お客様の個人情報と財務情報は銀行レベルの暗号化で保護され、承認された融資パートナーとのみ共有されます。"}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
