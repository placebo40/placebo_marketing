"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, ArrowRight, Home, Car, MessageSquare } from "lucide-react"

export default function ListCarConfirmationPage() {
  const { language } = useLanguage()

  const [listingData, setListingData] = useState<any>(null)

  useEffect(() => {
    // Get the listing ID from localStorage and retrieve the listing data
    const lastListingId = localStorage.getItem("lastSellerListingId")
    console.log("Last listing ID:", lastListingId)

    if (lastListingId) {
      const listings = JSON.parse(localStorage.getItem("seller_listings") || "[]")
      console.log("All listings:", listings)

      const listing = listings.find((l: any) => l.listingID === lastListingId)
      console.log("Found listing:", listing)

      if (listing) {
        setListingData(listing)
      }
    }
  }, [])

  // Add some confetti or celebration effect on mount
  useEffect(() => {
    // You could add confetti animation here
    document.title =
      language === "en" ? "Listing Submitted - Placebo Marketing" : "リスティング送信完了 - プラセボマーケティング"
  }, [language])

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container max-w-2xl">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-placebo-black mb-4">
            {language === "en" ? "Listing Submitted Successfully!" : "リスティングが正常に送信されました！"}
          </h1>
          <p className="text-lg text-placebo-dark-gray">
            {language === "en"
              ? "Thank you for listing your vehicle with Placebo Marketing."
              : "プラセボマーケティングでお車をご出品いただき、ありがとうございます。"}
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-center">
              {language === "en" ? "Listing Summary" : "リスティング概要"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Vehicle Image */}
              <div className="space-y-4">
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                  {listingData?.photos && listingData.photos.length > 0 ? (
                    <img
                      src={listingData.photos[0] || "/placeholder.svg"}
                      alt={`${listingData.year || ""} ${listingData.make || ""} ${listingData.model || ""}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg?height=300&width=400&text=Vehicle+Image"
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <Car className="h-12 w-12 mb-2" />
                      <span className="text-sm">No image available</span>
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <p className="text-sm text-placebo-dark-gray">
                    {language === "en" ? "Primary vehicle photo" : "メイン車両写真"}
                  </p>
                </div>
              </div>

              {/* Vehicle Details */}
              <div className="space-y-4">
                <div className="grid gap-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-placebo-dark-gray">
                      {language === "en" ? "Vehicle" : "車両"}
                    </span>
                    <span className="text-sm font-semibold text-placebo-black">
                      {listingData
                        ? `${listingData.year} ${listingData.make} ${listingData.model}`
                        : "2019 Honda Fit Hybrid"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-placebo-dark-gray">
                      {language === "en" ? "Price" : "価格"}
                    </span>
                    <span className="text-sm font-semibold text-placebo-black">
                      ¥
                      {listingData
                        ? Number(listingData.askingPrice || listingData.price || 0).toLocaleString()
                        : "1,250,000"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-placebo-dark-gray">
                      {language === "en" ? "Mileage" : "走行距離"}
                    </span>
                    <span className="text-sm font-semibold text-placebo-black">
                      {listingData ? `${listingData.mileage} km` : "45,000 km"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-placebo-dark-gray">
                      {language === "en" ? "Year" : "年式"}
                    </span>
                    <span className="text-sm font-semibold text-placebo-black">
                      {listingData ? listingData.year : "2019"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-placebo-dark-gray">
                      {language === "en" ? "Location" : "所在地"}
                    </span>
                    <span className="text-sm font-semibold text-placebo-black">
                      {listingData ? listingData.location : language === "en" ? "Naha, Okinawa" : "沖縄県那覇市"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm font-medium text-placebo-dark-gray">
                      {language === "en" ? "Listing ID" : "リスティングID"}
                    </span>
                    <span className="text-sm font-semibold text-placebo-black">
                      {listingData
                        ? listingData.listingId
                        : `#PM-${Math.random().toString(36).substr(2, 8).toUpperCase()}`}
                    </span>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      {language === "en" ? "Listing Submitted" : "リスティング送信済み"}
                    </span>
                  </div>
                  <p className="text-xs text-green-700 mt-1">
                    {language === "en"
                      ? "Your vehicle listing has been successfully submitted for review."
                      : "あなたの車両リスティングは審査のために正常に送信されました。"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-center">
              {language === "en" ? "What happens next?" : "次に何が起こりますか？"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-blue-600 font-semibold text-sm">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-placebo-black mb-1">
                    {language === "en" ? "Review Process" : "審査プロセス"}
                  </h3>
                  <p className="text-sm text-placebo-dark-gray">
                    {language === "en"
                      ? "Our team will review your listing within 24-48 hours to ensure it meets our quality standards."
                      : "私たちのチームは、品質基準を満たしていることを確認するために、24〜48時間以内にあなたのリスティングを審査します。"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-600 font-semibold text-sm">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-placebo-black mb-1">
                    {language === "en" ? "Listing Goes Live" : "リスティング公開"}
                  </h3>
                  <p className="text-sm text-placebo-dark-gray">
                    {language === "en"
                      ? "Once approved, your vehicle will be visible to thousands of potential buyers in Okinawa."
                      : "承認されると、あなたの車両は沖縄の何千人もの潜在的な買い手に表示されます。"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-placebo-gold/10 rounded-lg">
                <div className="w-8 h-8 bg-placebo-gold/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-placebo-black font-semibold text-sm">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-placebo-black mb-1">
                    {language === "en" ? "Start Receiving Inquiries" : "お問い合わせの受信開始"}
                  </h3>
                  <p className="text-sm text-placebo-dark-gray">
                    {language === "en"
                      ? "Interested buyers will contact you directly through our platform."
                      : "興味のある買い手が私たちのプラットフォームを通じて直接あなたに連絡します。"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">{language === "en" ? "Important Information" : "重要な情報"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">
                {language === "en" ? "Email Confirmation" : "メール確認"}
              </h4>
              <p className="text-sm text-yellow-700">
                {language === "en"
                  ? "You will receive an email confirmation with your listing details and reference number shortly."
                  : "まもなく、リスティングの詳細と参照番号が記載された確認メールが届きます。"}
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">
                {language === "en" ? "Seller Dashboard" : "販売者ダッシュボード"}
              </h4>
              <p className="text-sm text-blue-700">
                {language === "en"
                  ? "Track your listing status, manage inquiries, and update your vehicle information through your seller dashboard."
                  : "販売者ダッシュボードを通じて、リスティングの状況を追跡し、お問い合わせを管理し、車両情報を更新できます。"}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-3">
          <Button asChild className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90">
            <Link href="/seller-dashboard/listings" className="flex items-center justify-center gap-2">
              <Car className="h-4 w-4" />
              {language === "en" ? "View My Listings" : "私のリスティングを見る"}
            </Link>
          </Button>

          <Button asChild variant="outline">
            <Link href="/list-car" className="flex items-center justify-center gap-2">
              <ArrowRight className="h-4 w-4" />
              {language === "en" ? "List Another Car" : "別の車を出品"}
            </Link>
          </Button>

          <Button asChild variant="outline">
            <Link href="/" className="flex items-center justify-center gap-2">
              <Home className="h-4 w-4" />
              {language === "en" ? "Back to Home" : "ホームに戻る"}
            </Link>
          </Button>
        </div>

        <div className="text-center mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-placebo-dark-gray mb-4">
            {language === "en" ? "Need help or have questions?" : "ヘルプが必要ですか、または質問がありますか？"}
          </p>
          <Button asChild variant="ghost" size="sm">
            <Link href="/contact" className="flex items-center justify-center gap-2">
              <MessageSquare className="h-4 w-4" />
              {language === "en" ? "Contact Support" : "サポートに連絡"}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
