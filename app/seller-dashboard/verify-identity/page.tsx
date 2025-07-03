"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertTriangle, ArrowRight, Shield, FileText, Camera } from "lucide-react"

export default function VerifyIdentityPage() {
  const { language } = useLanguage()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [currentSellerType, setCurrentSellerType] = useState("private")

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const sellerType = urlParams.get("type") || localStorage.getItem("registeredSellerType") || "private"
    setCurrentSellerType(sellerType)
  }, [])

  const steps = [
    {
      id: 1,
      title: language === "en" ? "Personal Information" : "個人情報",
      description: language === "en" ? "Verify your basic details" : "基本情報を確認",
      icon: FileText,
      completed: false,
    },
    {
      id: 2,
      title: language === "en" ? "Identity Documents" : "身分証明書",
      description: language === "en" ? "Upload government-issued ID" : "政府発行の身分証明書をアップロード",
      icon: Camera,
      completed: false,
    },
    {
      id: 3,
      title: language === "en" ? "Review & Submit" : "確認・提出",
      description: language === "en" ? "Final review of your information" : "情報の最終確認",
      icon: CheckCircle,
      completed: false,
    },
  ]

  const handleStartVerification = () => {
    // Check URL params first, then localStorage
    const urlParams = new URLSearchParams(window.location.search)
    const sellerType = urlParams.get("type") || localStorage.getItem("registeredSellerType") || "private"

    if (sellerType === "dealership") {
      router.push("/verification/dealer")
    } else {
      router.push("/verification/seller")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-placebo-black mb-2">
          {currentSellerType === "dealership"
            ? language === "en"
              ? "Dealership Verification"
              : "ディーラー認証"
            : language === "en"
              ? "Seller Identity Verification"
              : "販売者本人確認"}
        </h1>
        <p className="text-gray-600">
          {language === "en"
            ? "Complete your identity verification to start selling vehicles on our platform"
            : "プラットフォームで車両の販売を開始するために本人確認を完了してください"}
        </p>
      </div>

      {/* Current Status */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                {language === "en" ? "Verification Status" : "確認ステータス"}
              </CardTitle>
              <CardDescription>
                {language === "en" ? "Your account is currently unverified" : "あなたのアカウントは現在未確認です"}
              </CardDescription>
            </div>
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              {language === "en" ? "Unverified" : "未確認"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-placebo-black">
                  {language === "en" ? "Limited Access" : "制限されたアクセス"}
                </h4>
                <p className="text-sm text-gray-600">
                  {language === "en"
                    ? "You can browse listings but cannot create new listings until verified"
                    : "確認が完了するまで、リストの閲覧はできますが新しいリストの作成はできません"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Verification Process */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-placebo-gold" />
            {language === "en" ? "Verification Process" : "確認プロセス"}
          </CardTitle>
          <CardDescription>
            {language === "en"
              ? "Follow these steps to complete your seller verification"
              : "以下の手順に従って販売者確認を完了してください"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-start gap-4">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    step.completed
                      ? "bg-green-100 text-green-600"
                      : currentStep === step.id
                        ? "bg-placebo-gold text-placebo-black"
                        : "bg-gray-100 text-gray-400"
                  }`}
                >
                  <step.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-placebo-black">{step.title}</h4>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
                {step.completed && <CheckCircle className="h-5 w-5 text-green-500" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Benefits */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{language === "en" ? "Benefits of Verification" : "確認のメリット"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-placebo-black">
                  {language === "en" ? "Create Listings" : "リスト作成"}
                </h4>
                <p className="text-sm text-gray-600">
                  {language === "en" ? "List up to 2 vehicles for sale" : "最大2台の車両を販売用にリスト"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-placebo-black">{language === "en" ? "Buyer Trust" : "購入者の信頼"}</h4>
                <p className="text-sm text-gray-600">
                  {language === "en"
                    ? "Verified badge increases buyer confidence"
                    : "確認済みバッジで購入者の信頼度向上"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-placebo-black">
                  {language === "en" ? "Secure Transactions" : "安全な取引"}
                </h4>
                <p className="text-sm text-gray-600">
                  {language === "en" ? "Access to secure payment processing" : "安全な決済処理へのアクセス"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-placebo-black">
                  {language === "en" ? "Priority Support" : "優先サポート"}
                </h4>
                <p className="text-sm text-gray-600">
                  {language === "en" ? "Faster response times for support requests" : "サポートリクエストの迅速な対応"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleStartVerification}
          className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90 font-semibold px-8 py-3"
        >
          {language === "en" ? "Start Verification Process" : "確認プロセスを開始"}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
