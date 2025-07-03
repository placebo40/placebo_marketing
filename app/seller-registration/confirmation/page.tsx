"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  CheckCircle,
  Clock,
  Mail,
  Phone,
  FileText,
  Shield,
  Star,
  Download,
  ArrowRight,
  User,
  Building2,
  Gift,
} from "lucide-react"
import Link from "next/link"

export default function SellerRegistrationConfirmationPage() {
  const { language } = useLanguage()
  const searchParams = useSearchParams()
  const [registrationId, setRegistrationId] = useState("")
  const [sellerType, setSellerType] = useState("")
  const [selectedPlan, setSelectedPlan] = useState("")
  const [isTrialActivated, setIsTrialActivated] = useState(false)
  const [isPaid, setIsPaid] = useState(false)
  const [submissionDate, setSubmissionDate] = useState("")

  useEffect(() => {
    try {
      const id = searchParams.get("id") || `SR${Date.now().toString().slice(-6)}`
      const type = searchParams.get("type") || "private"
      const plan = searchParams.get("plan") || "private-seller"
      const trial = searchParams.get("trial") === "true"
      const paid = searchParams.get("paid") === "true"

      setRegistrationId(id)
      setSellerType(type)
      setSelectedPlan(plan)
      setIsTrialActivated(trial)
      setIsPaid(paid)
      setSubmissionDate(new Date().toLocaleDateString(language === "en" ? "en-US" : "ja-JP"))
    } catch (error) {
      console.error("Error processing search parameters:", error)
      // Set fallback values
      setRegistrationId(`SR${Date.now().toString().slice(-6)}`)
      setSellerType("private")
      setSelectedPlan("private-seller")
      setSubmissionDate(new Date().toLocaleDateString(language === "en" ? "en-US" : "ja-JP"))
    }
  }, [searchParams, language])

  const getPlanDetails = () => {
    const plans = {
      "private-seller": {
        name: language === "en" ? "Private Seller" : "個人販売者",
        price: "¥3,980",
        billing: language === "en" ? "One-time payment" : "一回払い",
      },
      starter: {
        name: language === "en" ? "Starter" : "スターター",
        price: "¥7,800",
        billing: language === "en" ? "/month" : "/月",
        trialDays: 7, // Changed from 14 to 7
      },
      professional: {
        name: language === "en" ? "Professional" : "プロフェッショナル",
        price: "¥15,800",
        billing: language === "en" ? "/month" : "/月",
        trialDays: 7, // Changed from 14 to 7
      },
      enterprise: {
        name: language === "en" ? "Enterprise" : "エンタープライズ",
        price: "¥24,800",
        billing: language === "en" ? "/month" : "/月",
        trialDays: 7, // Changed from 30 to 7
      },
    }
    return plans[selectedPlan as keyof typeof plans]
  }

  const getTrialEndDate = () => {
    const planDetails = getPlanDetails()
    if (!planDetails?.trialDays) return ""

    const endDate = new Date()
    endDate.setDate(endDate.getDate() + planDetails.trialDays)
    return endDate.toLocaleDateString(language === "en" ? "en-US" : "ja-JP")
  }

  const planDetails = getPlanDetails()

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-4xl">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-placebo-gold rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-placebo-black" />
              </div>
              <span className="ml-2 text-sm font-medium text-placebo-black">
                {language === "en" ? "Registration" : "登録"}
              </span>
            </div>
            <div className="w-16 h-0.5 bg-placebo-gold"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-placebo-gold rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-placebo-black" />
              </div>
              <span className="ml-2 text-sm font-medium text-placebo-black">
                {language === "en" ? "Payment" : "支払い"}
              </span>
            </div>
            <div className="w-16 h-0.5 bg-placebo-gold"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Clock className="h-5 w-5 text-white animate-pulse" />
              </div>
              <span className="ml-2 text-sm font-medium text-blue-600">
                {language === "en" ? "Verification" : "確認"}
              </span>
            </div>
            <div className="w-16 h-0.5 bg-placebo-gold"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-placebo-gold rounded-full flex items-center justify-center">
                <Star className="h-5 w-5 text-placebo-black" />
              </div>
              <span className="ml-2 text-sm font-medium text-placebo-black">
                {language === "en" ? "Complete" : "完了"}
              </span>
            </div>
          </div>
        </div>

        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            {isTrialActivated ? (
              <Gift className="h-12 w-12 text-green-600" />
            ) : (
              <CheckCircle className="h-12 w-12 text-green-600" />
            )}
          </div>
          <h1 className="text-4xl font-bold text-placebo-black mb-4">
            {isTrialActivated
              ? language === "en"
                ? "Trial Activated Successfully!"
                : "トライアルが正常に有効化されました！"
              : language === "en"
                ? "Registration Complete!"
                : "登録完了！"}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {isTrialActivated
              ? language === "en"
                ? `Your ${planDetails?.trialDays}-day free trial has started. You now have full access to your seller dashboard.`
                : `${planDetails?.trialDays}日間の無料トライアルが開始されました。販売者ダッシュボードへのフルアクセスが可能です。`
              : language === "en"
                ? "Thank you for your payment. Your seller account is now active and ready to use."
                : "お支払いありがとうございます。販売者アカウントが有効化され、ご利用いただけます。"}
          </p>
        </div>

        {/* Registration & Payment Details */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-placebo-gold" />
              {language === "en" ? "Registration & Payment Details" : "登録・支払い詳細"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <div>
                <span className="text-sm font-medium text-gray-500">
                  {language === "en" ? "Registration ID" : "登録ID"}
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <code className="text-lg font-mono font-bold text-placebo-black bg-gray-100 px-2 py-1 rounded">
                    {registrationId}
                  </code>
                </div>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">
                  {language === "en" ? "Account Type" : "アカウントタイプ"}
                </span>
                <div className="flex items-center gap-2 mt-1">
                  {sellerType === "dealership" ? (
                    <Building2 className="h-4 w-4 text-placebo-gold" />
                  ) : (
                    <User className="h-4 w-4 text-placebo-gold" />
                  )}
                  <span className="font-medium">
                    {sellerType === "dealership"
                      ? language === "en"
                        ? "Dealership"
                        : "ディーラー"
                      : language === "en"
                        ? "Private Seller"
                        : "個人販売者"}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">
                  {language === "en" ? "Selected Plan" : "選択プラン"}
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <Star className="h-4 w-4 text-placebo-gold" />
                  <span className="font-medium">{planDetails?.name}</span>
                </div>
              </div>
            </div>

            {/* Payment Details Section */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-placebo-black mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-placebo-gold" />
                {language === "en" ? "Payment Details" : "支払い詳細"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    {language === "en" ? "Amount Paid" : "支払い金額"}
                  </span>
                  <div className="text-xl font-bold text-placebo-black mt-1">
                    {isTrialActivated ? (
                      <span className="text-green-600">{language === "en" ? "¥0 (Trial)" : "¥0（トライアル）"}</span>
                    ) : (
                      <span>
                        {planDetails?.price}
                        {selectedPlan === "private-seller" ? "" : planDetails?.billing}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    {language === "en" ? "Payment Method" : "支払い方法"}
                  </span>
                  <div className="font-medium mt-1">
                    {isTrialActivated
                      ? language === "en"
                        ? "Free Trial"
                        : "無料トライアル"
                      : language === "en"
                        ? "Credit Card"
                        : "クレジットカード"}
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    {language === "en" ? "Transaction ID" : "取引ID"}
                  </span>
                  <div className="font-mono text-sm mt-1">
                    {isTrialActivated ? "TRIAL-" + registrationId : "TXN-" + registrationId}
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    {language === "en" ? "Payment Date" : "支払い日"}
                  </span>
                  <div className="font-medium mt-1">{submissionDate}</div>
                </div>
              </div>

              {/* Billing Information */}
              {!isTrialActivated && selectedPlan !== "private-seller" && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">
                    {language === "en" ? "Billing Information" : "請求情報"}
                  </h4>
                  <p className="text-sm text-blue-800">
                    {language === "en"
                      ? `Your subscription will renew automatically on ${getTrialEndDate()} for ${planDetails?.price}${planDetails?.billing}.`
                      : `サブスクリプションは${getTrialEndDate()}に${planDetails?.price}${planDetails?.billing}で自動更新されます。`}
                  </p>
                </div>
              )}

              {selectedPlan === "private-seller" && !isTrialActivated && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">
                    {language === "en" ? "One-time Payment" : "一回払い"}
                  </h4>
                  <p className="text-sm text-green-800">
                    {language === "en"
                      ? "This is a one-time payment. No recurring charges will be applied to your account."
                      : "これは一回限りの支払いです。アカウントに継続的な請求は発生しません。"}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Trial Information */}
        {isTrialActivated && (
          <Card className="mb-8 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <Gift className="h-5 w-5" />
                {language === "en" ? "Free Trial Information" : "無料トライアル情報"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <span className="text-sm font-medium text-green-700">
                    {language === "en" ? "Trial Period" : "トライアル期間"}
                  </span>
                  <div className="text-lg font-bold text-green-800 mt-1">
                    {planDetails?.trialDays} {language === "en" ? "days" : "日間"}
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-green-700">
                    {language === "en" ? "Trial Ends" : "トライアル終了日"}
                  </span>
                  <div className="text-lg font-bold text-green-800 mt-1">{getTrialEndDate()}</div>
                </div>
                <div>
                  <span className="text-sm font-medium text-green-700">
                    {language === "en" ? "Billing Starts" : "請求開始"}
                  </span>
                  <div className="text-lg font-bold text-green-800 mt-1">
                    {planDetails?.price}
                    {planDetails?.billing}
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-green-100 rounded-lg">
                <p className="text-sm text-green-800">
                  {language === "en"
                    ? "💡 During your 7-day trial, you can create 1 active listing. After payment, you'll get access to your full plan limits. You can cancel anytime during your trial period without being charged."
                    : "💡 7日間のトライアル中は1つのアクティブなリスティングを作成できます。支払い後、プランの全制限にアクセスできます。トライアル期間中はいつでも課金されることなくキャンセルできます。"}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Next Steps */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="h-5 w-5 text-placebo-gold" />
              {language === "en" ? "What's Next?" : "次のステップ"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-placebo-gold/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="h-6 w-6 text-placebo-gold" />
                </div>
                <h3 className="font-semibold mb-2">
                  {language === "en" ? "1. Account Verification" : "1. アカウント確認"}
                </h3>
                <p className="text-sm text-gray-600">
                  {language === "en"
                    ? "Complete identity verification (usually within 24 hours)"
                    : "身元確認を完了（通常24時間以内）"}
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-placebo-gold/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileText className="h-6 w-6 text-placebo-gold" />
                </div>
                <h3 className="font-semibold mb-2">
                  {language === "en" ? "2. Dashboard Access" : "2. ダッシュボードアクセス"}
                </h3>
                <p className="text-sm text-gray-600">
                  {language === "en"
                    ? "Access your seller dashboard and start listing vehicles"
                    : "販売者ダッシュボードにアクセスして車両掲載を開始"}
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-placebo-gold/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="h-6 w-6 text-placebo-gold" />
                </div>
                <h3 className="font-semibold mb-2">{language === "en" ? "3. Start Selling" : "3. 販売開始"}</h3>
                <p className="text-sm text-gray-600">
                  {language === "en"
                    ? "Create your first vehicle listing and reach buyers"
                    : "最初の車両掲載を作成して購入者にリーチ"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-placebo-gold" />
              {language === "en" ? "Important Information" : "重要な情報"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-placebo-gold mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium mb-1">
                  {language === "en" ? "Confirmation Email Sent" : "確認メールを送信しました"}
                </h4>
                <p className="text-sm text-gray-600">
                  {language === "en"
                    ? "Check your email for detailed registration information and next steps."
                    : "詳細な登録情報と次のステップについてメールをご確認ください。"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-placebo-gold mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium mb-1">
                  {language === "en" ? "Support Available" : "サポートをご利用いただけます"}
                </h4>
                <p className="text-sm text-gray-600">
                  {language === "en"
                    ? "Our team is here to help. Contact us at sales@mplacebo.com or +81-98-123-4567"
                    : "チームがサポートいたします。sales@mplacebo.com または +81-98-123-4567 までご連絡ください"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Download className="h-5 w-5 text-placebo-gold mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium mb-1">
                  {language === "en" ? "Keep Your Registration ID" : "登録IDを保管してください"}
                </h4>
                <p className="text-sm text-gray-600">
                  {language === "en"
                    ? "Save your registration ID for future reference and support requests."
                    : "今後の参照およびサポートリクエストのために登録IDを保存してください。"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" className="flex items-center gap-2" onClick={() => window.print()}>
            <Download className="h-4 w-4" />
            {language === "en" ? "Download Receipt" : "領収書をダウンロード"}
          </Button>
          <Link href={`/seller-dashboard?type=${sellerType}`}>
            <Button className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90 flex items-center gap-2 w-full sm:w-auto">
              <ArrowRight className="h-4 w-4" />
              {language === "en" ? "Go to Dashboard" : "ダッシュボードへ"}
            </Button>
          </Link>
          <Link href="/services/sellers">
            <Button variant="outline" className="flex items-center gap-2 w-full sm:w-auto">
              <FileText className="h-4 w-4" />
              {language === "en" ? "Seller Resources" : "販売者リソース"}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
