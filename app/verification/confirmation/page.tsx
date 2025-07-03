"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock } from "lucide-react"

export default function VerificationConfirmationPage() {
  const { language } = useLanguage()
  const router = useRouter()
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    // Update localStorage to indicate verification is in progress
    localStorage.setItem("verificationStatus", "pending")

    // Countdown timer for auto-redirect
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push("/profile")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-md mx-auto px-4">
        <Card className="border-none shadow-lg">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto bg-green-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold">
              {language === "en" ? "Verification Submitted" : "認証が送信されました"}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p>
              {language === "en"
                ? "Thank you for submitting your verification information. Our team will review your submission shortly."
                : "認証情報をご提出いただきありがとうございます。当社のチームがまもなくあなたの提出物を確認します。"}
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3 text-left">
              <Clock className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-amber-800">
                  {language === "en" ? "Verification in Progress" : "認証処理中"}
                </h3>
                <p className="text-sm text-amber-700">
                  {language === "en"
                    ? "Verification typically takes 1-2 business days. You'll receive an email once your account is verified."
                    : "認証は通常1〜2営業日かかります。アカウントが認証されると、メールが届きます。"}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button asChild className="w-full bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90">
              <Link href="/profile">
                {language === "en" ? "Return to Profile" : "プロフィールに戻る"} ({countdown})
              </Link>
            </Button>
            <p className="text-sm text-gray-500 text-center">
              {language === "en"
                ? "Have questions? Contact our support team."
                : "ご質問がありますか？サポートチームにお問い合わせください。"}
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
