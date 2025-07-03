"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Shield, CheckCircle, Clock, ArrowLeft, Lock, Calendar, User, Building2, Star } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface RegistrationData {
  sellerType: string
  selectedPlan: string
  businessName?: string
  address: string
  city: string
  prefecture: string
  postalCode: string
  businessLicense?: string
  taxId?: string
  yearsInBusiness?: string
  numberOfEmployees?: string
  businessDescription?: string
}

export default function SellerRegistrationPaymentPage() {
  const { language } = useLanguage()
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [isProcessing, setIsProcessing] = useState(false)
  const [registrationData, setRegistrationData] = useState<RegistrationData | null>(null)
  const [paymentMethod, setPaymentMethod] = useState("credit-card")
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    billingAddress: "",
    billingCity: "",
    billingPostal: "",
    savePaymentMethod: false,
  })

  useEffect(() => {
    // Only set registration data if it hasn't been set yet
    if (!registrationData) {
      const mockRegistrationData: RegistrationData = {
        sellerType: searchParams.get("type") || "private",
        selectedPlan: searchParams.get("plan") || "private-seller",
        businessName: searchParams.get("businessName") || "",
        address: "Sample Address",
        city: "Naha",
        prefecture: "Okinawa",
        postalCode: "900-0001",
      }
      setRegistrationData(mockRegistrationData)
    }
  }, [searchParams, registrationData]) // Add registrationData to dependencies but check if null before setting

  const getPlanDetails = () => {
    if (!registrationData) return null

    const plans = {
      "private-seller": {
        name: language === "en" ? "Private Seller" : "個人販売者",
        price: "¥3,980",
        billing: language === "en" ? "One-time payment" : "一回払い",
        trial: false,
        features: [
          language === "en" ? "2 vehicles at a time" : "同時に2台まで",
          language === "en" ? "1 sale per year" : "年間1回まで",
          language === "en" ? "Priority support" : "優先サポート",
        ],
      },
      starter: {
        name: language === "en" ? "Starter" : "スターター",
        price: "¥7,800",
        billing: language === "en" ? "/month" : "/月",
        trial: true,
        trialDays: 7, // Changed from 14 to 7
        features: [
          language === "en" ? "1 listing during 7-day trial" : "7日間トライアル中1台",
          language === "en" ? "Up to 15 listings after payment" : "支払い後最大15台",
          language === "en" ? "Dedicated support" : "専用サポート",
        ],
      },
      professional: {
        name: language === "en" ? "Professional" : "プロフェッショナル",
        price: "¥15,800",
        billing: language === "en" ? "/month" : "/月",
        trial: true,
        trialDays: 7, // Changed from 14 to 7
        features: [
          language === "en" ? "1 listing during 7-day trial" : "7日間トライアル中1台",
          language === "en" ? "Up to 50 listings after payment" : "支払い後最大50台",
          language === "en" ? "Premium support" : "プレミアムサポート",
        ],
      },
      enterprise: {
        name: language === "en" ? "Enterprise" : "エンタープライズ",
        price: "¥24,800",
        billing: language === "en" ? "/month" : "/月",
        trial: true,
        trialDays: 7, // Changed from 30 to 7
        features: [
          language === "en" ? "1 listing during 7-day trial" : "7日間トライアル中1台",
          language === "en" ? "Unlimited listings after payment" : "支払い後無制限掲載",
          language === "en" ? "White-glove support" : "ホワイトグローブサポート",
        ],
      },
    }

    return plans[registrationData.selectedPlan as keyof typeof plans]
  }

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const planDetails = getPlanDetails()
      const registrationId = `SR${Date.now().toString().slice(-6)}`

      if (planDetails?.trial) {
        // For trial plans, activate trial immediately
        router.push(
          `/seller-registration/confirmation?id=${registrationId}&type=${registrationData?.sellerType}&plan=${registrationData?.selectedPlan}&trial=true`,
        )
      } else {
        // For one-time payments, process payment and activate
        router.push(
          `/seller-registration/confirmation?id=${registrationId}&type=${registrationData?.sellerType}&plan=${registrationData?.selectedPlan}&paid=true`,
        )
      }
    } catch (error) {
      toast({
        title: language === "en" ? "Payment Failed" : "支払いに失敗しました",
        description:
          language === "en" ? "Please try again or contact support." : "再試行するか、サポートにお問い合わせください。",
        variant: "destructive",
      })
      setIsProcessing(false)
    }
  }

  const planDetails = getPlanDetails()

  if (!registrationData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-placebo-gold mx-auto mb-4"></div>
          <p className="text-gray-600">Loading registration details...</p>
        </div>
      </div>
    )
  }

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
                <CreditCard className="h-5 w-5 text-placebo-black" />
              </div>
              <span className="ml-2 text-sm font-medium text-placebo-black">
                {language === "en" ? "Payment" : "支払い"}
              </span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <Shield className="h-5 w-5 text-gray-500" />
              </div>
              <span className="ml-2 text-sm font-medium text-gray-500">
                {language === "en" ? "Verification" : "確認"}
              </span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <Star className="h-5 w-5 text-gray-500" />
              </div>
              <span className="ml-2 text-sm font-medium text-gray-500">{language === "en" ? "Complete" : "完了"}</span>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-placebo-black mb-4">
            {planDetails.trial
              ? language === "en"
                ? "Start Your Free Trial"
                : "無料トライアルを開始"
              : language === "en"
                ? "Complete Your Registration"
                : "登録を完了"}
          </h1>
          <p className="text-lg text-gray-600">
            {planDetails.trial
              ? language === "en"
                ? `Begin your ${planDetails.trialDays}-day free trial and set up billing for later.`
                : `${planDetails.trialDays}日間の無料トライアルを開始し、後で請求を設定します。`
              : language === "en"
                ? "Secure payment processing to activate your seller account."
                : "販売者アカウントを有効化するための安全な支払い処理。"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {registrationData.sellerType === "dealership" ? (
                    <Building2 className="h-5 w-5 text-placebo-gold" />
                  ) : (
                    <User className="h-5 w-5 text-placebo-gold" />
                  )}
                  {language === "en" ? "Order Summary" : "注文概要"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-lg p-4 bg-placebo-gold/5">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{planDetails.name}</h3>
                      <p className="text-sm text-gray-600">
                        {registrationData.sellerType === "dealership" ? "Dealership Plan" : "Private Seller Plan"}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-placebo-gold">{planDetails.price}</div>
                      <div className="text-xs text-gray-600">{planDetails.billing}</div>
                    </div>
                  </div>

                  {planDetails.trial && (
                    <Badge className="bg-green-100 text-green-800 mb-3">
                      {language === "en"
                        ? `${planDetails.trialDays}-day free trial`
                        : `${planDetails.trialDays}日間無料トライアル`}
                    </Badge>
                  )}

                  <div className="space-y-1">
                    {planDetails.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">{language === "en" ? "Total Today" : "本日の合計"}</span>
                    <span className="font-bold text-lg">{planDetails.trial ? "¥0" : planDetails.price}</span>
                  </div>
                  {planDetails.trial && (
                    <p className="text-xs text-gray-600 mt-1">
                      {language === "en"
                        ? `Billing starts after ${planDetails.trialDays}-day trial`
                        : `${planDetails.trialDays}日間のトライアル後に請求開始`}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handlePaymentSubmit} className="space-y-6">
              {/* Payment Method Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-placebo-gold" />
                    {language === "en" ? "Payment Method" : "支払い方法"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        paymentMethod === "credit-card" ? "border-placebo-gold bg-placebo-gold/5" : "border-gray-200"
                      }`}
                      onClick={() => setPaymentMethod("credit-card")}
                    >
                      <CreditCard className="h-6 w-6 text-placebo-gold mb-2" />
                      <div className="font-medium">{language === "en" ? "Credit Card" : "クレジットカード"}</div>
                      <div className="text-xs text-gray-600">Visa, Mastercard, JCB</div>
                    </div>
                    <div
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        paymentMethod === "bank-transfer" ? "border-placebo-gold bg-placebo-gold/5" : "border-gray-200"
                      }`}
                      onClick={() => setPaymentMethod("bank-transfer")}
                    >
                      <Building2 className="h-6 w-6 text-placebo-gold mb-2" />
                      <div className="font-medium">{language === "en" ? "Bank Transfer" : "銀行振込"}</div>
                      <div className="text-xs text-gray-600">{language === "en" ? "Japanese banks" : "日本の銀行"}</div>
                    </div>
                    <div
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        paymentMethod === "digital-wallet" ? "border-placebo-gold bg-placebo-gold/5" : "border-gray-200"
                      }`}
                      onClick={() => setPaymentMethod("digital-wallet")}
                    >
                      <Shield className="h-6 w-6 text-placebo-gold mb-2" />
                      <div className="font-medium">{language === "en" ? "Digital Wallet" : "デジタルウォレット"}</div>
                      <div className="text-xs text-gray-600">PayPay, LINE Pay</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Details */}
              {paymentMethod === "credit-card" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="h-5 w-5 text-placebo-gold" />
                      {language === "en" ? "Card Details" : "カード詳細"}
                    </CardTitle>
                    <CardDescription>
                      {language === "en"
                        ? "Your payment information is encrypted and secure."
                        : "お支払い情報は暗号化され、安全に保護されています。"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="cardNumber">{language === "en" ? "Card Number" : "カード番号"}</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={paymentData.cardNumber}
                        onChange={(e) => setPaymentData((prev) => ({ ...prev, cardNumber: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate">{language === "en" ? "Expiry Date" : "有効期限"}</Label>
                        <Input
                          id="expiryDate"
                          placeholder="MM/YY"
                          value={paymentData.expiryDate}
                          onChange={(e) => setPaymentData((prev) => ({ ...prev, expiryDate: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">{language === "en" ? "CVV" : "セキュリティコード"}</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={paymentData.cvv}
                          onChange={(e) => setPaymentData((prev) => ({ ...prev, cvv: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="cardholderName">{language === "en" ? "Cardholder Name" : "カード名義人"}</Label>
                      <Input
                        id="cardholderName"
                        placeholder={language === "en" ? "Full name as on card" : "カードに記載の氏名"}
                        value={paymentData.cardholderName}
                        onChange={(e) => setPaymentData((prev) => ({ ...prev, cardholderName: e.target.value }))}
                        required
                      />
                    </div>

                    {!planDetails.trial && (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="savePaymentMethod"
                          checked={paymentData.savePaymentMethod}
                          onCheckedChange={(checked) =>
                            setPaymentData((prev) => ({ ...prev, savePaymentMethod: checked as boolean }))
                          }
                        />
                        <Label htmlFor="savePaymentMethod" className="text-sm">
                          {language === "en"
                            ? "Save payment method for future use"
                            : "今後の利用のために支払い方法を保存"}
                        </Label>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Security Notice */}
              <Card className="border-green-200 bg-green-50">
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-green-800">
                        {language === "en" ? "Secure Payment Processing" : "安全な支払い処理"}
                      </h3>
                      <p className="text-sm text-green-700 mt-1">
                        {language === "en"
                          ? "Your payment is processed securely using 256-bit SSL encryption. We never store your payment details."
                          : "お支払いは256ビットSSL暗号化を使用して安全に処理されます。お支払い詳細は保存されません。"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {language === "en" ? "Back to Registration" : "登録に戻る"}
                </Button>

                <Button
                  type="submit"
                  disabled={isProcessing}
                  className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90 font-semibold px-8"
                >
                  {isProcessing ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      {language === "en" ? "Processing..." : "処理中..."}
                    </>
                  ) : planDetails.trial ? (
                    <>
                      <Calendar className="h-4 w-4 mr-2" />
                      {language === "en" ? "Start Free Trial" : "無料トライアル開始"}
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      {language === "en" ? `Pay ${planDetails.price}` : `${planDetails.price}を支払う`}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
