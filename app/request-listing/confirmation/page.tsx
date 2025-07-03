"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Car, Calendar, Phone, Mail, Calculator, TrendingUp, Shield } from "lucide-react"
import Link from "next/link"
import { getGuestListings, type GuestListing } from "@/lib/guest-listings"
import { formatServiceFeeBreakdown } from "@/lib/service-fee"

export default function RequestListingConfirmationPage() {
  const { language } = useLanguage()
  const searchParams = useSearchParams()
  const referenceNumber = searchParams.get("ref")
  const [listing, setListing] = useState<GuestListing | null>(null)

  useEffect(() => {
    if (referenceNumber) {
      const listings = getGuestListings()
      const foundListing = listings.find((l) => l.referenceNumber === referenceNumber)
      setListing(foundListing || null)
    }
  }, [referenceNumber])

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-placebo-gold mx-auto mb-4"></div>
          <p className="text-placebo-dark-gray">{language === "en" ? "Loading..." : "読み込み中..."}</p>
        </div>
      </div>
    )
  }

  // Safely get fee breakdown with fallback
  let feeBreakdown = null
  try {
    if (listing.feeCalculation) {
      feeBreakdown = formatServiceFeeBreakdown(listing.feeCalculation, language)
    }
  } catch (error) {
    console.error("Error formatting fee breakdown:", error)
    feeBreakdown = null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-placebo-black mb-2">
            {language === "en" ? "Listing Request Submitted!" : "出品リクエストが送信されました！"}
          </h1>
          <p className="text-placebo-dark-gray">
            {language === "en"
              ? "Thank you for choosing Placebo Marketing. We'll handle everything from here."
              : "Placebo Marketingをお選びいただきありがとうございます。ここからはすべてお任せください。"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Listing Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5 text-placebo-gold" />
                {language === "en" ? "Your Vehicle Listing" : "あなたの車両出品"}
              </CardTitle>
              <CardDescription>
                {language === "en" ? "Reference Number:" : "参照番号:"} <strong>{listing.referenceNumber}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Vehicle Image */}
              <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden mb-4">
                <img
                  src={listing.photos && listing.photos.length > 0 ? listing.photos[0] : "/car-listing-photo.png"}
                  alt={`${listing.year} ${listing.make} ${listing.model}`}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-placebo-black">
                  {listing.year} {listing.make} {listing.model}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">{language === "en" ? "Mileage:" : "走行距離:"}</span>
                  <p className="font-medium">{Number(listing.mileage || 0).toLocaleString()} km</p>
                </div>
                <div>
                  <span className="text-gray-500">{language === "en" ? "Asking Price:" : "希望価格:"}</span>
                  <p className="font-medium text-placebo-gold">¥{Number(listing.askingPrice || 0).toLocaleString()}</p>
                </div>
              </div>

              {listing.description && (
                <div>
                  <span className="text-gray-500">{language === "en" ? "Description:" : "説明:"}</span>
                  <p className="text-sm mt-1">{listing.description}</p>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>
                  {language === "en" ? "Submitted:" : "提出日:"}{" "}
                  {new Date(listing.submittedAt).toLocaleDateString(language === "en" ? "en-US" : "ja-JP")}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Service Fee Breakdown */}
          {feeBreakdown && (
            <Card className="border-placebo-gold/30 bg-gradient-to-br from-placebo-gold/5 to-placebo-gold/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-placebo-gold" />
                  {language === "en" ? "Service Fee Breakdown" : "サービス手数料内訳"}
                </CardTitle>
                <CardDescription>
                  {language === "en"
                    ? "You receive your full desired amount - service fee is added to market price"
                    : "ご希望の金額を満額受け取れます - サービス手数料は市場価格に追加されます"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-white rounded-lg p-4 border border-placebo-gold/20">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        {language === "en" ? "Your Desired Amount:" : "ご希望金額:"}
                      </span>
                      <span className="font-semibold text-green-600">
                        ¥{Number(listing.askingPrice).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">{language === "en" ? "Service Fee:" : "サービス手数料:"}</span>
                      <span className="font-semibold text-placebo-gold">
                        +¥{Number(listing.serviceFee).toLocaleString()}
                      </span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-800">
                          {language === "en" ? "Market Asking Price:" : "市場販売価格:"}
                        </span>
                        <span className="font-bold text-placebo-black text-lg">
                          ¥
                          {Number(
                            listing.marketAskingPrice || listing.askingPrice + listing.serviceFee,
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-green-800">
                          {language === "en" ? "You Receive:" : "あなたが受け取る金額:"}
                        </span>
                        <span className="font-bold text-green-600 text-lg">
                          ¥{Number(listing.askingPrice).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="text-sm text-blue-800">
                      <strong>{language === "en" ? "Fee Structure:" : "手数料体系:"}</strong>
                      <br />
                      {feeBreakdown.feeNote}
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span className="font-semibold text-green-800">
                      {language === "en" ? "Zero Risk Guarantee" : "ゼロリスク保証"}
                    </span>
                  </div>
                  <p className="text-sm text-green-700">
                    {language === "en"
                      ? "You receive your full desired amount. Service fee is only charged when your vehicle successfully sells and is added to the market price - no cost to you!"
                      : "ご希望の金額を満額受け取れます。サービス手数料は車両が正常に売却された場合のみ請求され、市場価格に追加されます - あなたに費用負担はありません！"}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Fallback card if no fee breakdown */}
          {!feeBreakdown && (
            <Card className="border-placebo-gold/30 bg-gradient-to-br from-placebo-gold/5 to-placebo-gold/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-placebo-gold" />
                  {language === "en" ? "Zero Risk Guarantee" : "ゼロリスク保証"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <p className="text-sm text-green-700">
                    {language === "en"
                      ? "You receive your full desired amount. Our service fee is added to the market price - no cost to you!"
                      : "ご希望の金額を満額受け取れます。サービス手数料は市場価格に追加されます - あなたに費用負担はありません！"}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Next Steps */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-placebo-gold" />
              {language === "en" ? "What Happens Next?" : "次に何が起こりますか？"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h3 className="font-semibold text-placebo-black mb-2">
                  {language === "en" ? "Review & Approval" : "審査・承認"}
                </h3>
                <p className="text-sm text-gray-600">
                  {language === "en"
                    ? "Our team will review your submission within 24 hours and contact you for any additional information."
                    : "当チームが24時間以内に提出内容を審査し、追加情報が必要な場合はご連絡いたします。"}
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-placebo-gold/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-placebo-black font-bold">2</span>
                </div>
                <h3 className="font-semibold text-placebo-black mb-2">
                  {language === "en" ? "Professional Listing" : "プロフェッショナル出品"}
                </h3>
                <p className="text-sm text-gray-600">
                  {language === "en"
                    ? "We'll create a professional listing with your desired amount guaranteed, plus our service fee added to the market price."
                    : "ご希望金額を保証し、サービス手数料を市場価格に追加したプロフェッショナルな出品を作成します。"}
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 font-bold">3</span>
                </div>
                <h3 className="font-semibold text-placebo-black mb-2">
                  {language === "en" ? "Sell & Complete" : "売却・完了"}
                </h3>
                <p className="text-sm text-gray-600">
                  {language === "en"
                    ? "We handle all buyer communications, negotiations, and paperwork until your vehicle is sold."
                    : "車両が売却されるまで、すべての買い手とのコミュニケーション、交渉、書類作成を処理します。"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>{language === "en" ? "Need Help?" : "サポートが必要ですか？"}</CardTitle>
            <CardDescription>
              {language === "en"
                ? "Our team is here to assist you throughout the process"
                : "当チームがプロセス全体を通してサポートいたします"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-placebo-gold" />
                <div>
                  <p className="font-medium">{language === "en" ? "Phone Support" : "電話サポート"}</p>
                  <p className="text-sm text-gray-600">+81-98-XXX-XXXX</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-placebo-gold" />
                <div>
                  <p className="font-medium">{language === "en" ? "Email Support" : "メールサポート"}</p>
                  <p className="text-sm text-gray-600">support@placebomarketing.com</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Button asChild className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90">
            <Link href="/guest-dashboard">{language === "en" ? "View Your Dashboard" : "ダッシュボードを見る"}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/request-listing">{language === "en" ? "List Another Vehicle" : "別の車両を出品"}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">{language === "en" ? "Return to Homepage" : "ホームページに戻る"}</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
