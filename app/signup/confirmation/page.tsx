"use client"

import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Mail, ArrowRight } from "lucide-react"

export default function SignupConfirmationPage() {
  const { language } = useLanguage()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center mb-6">
          <Image src="/images/logo-black.png" alt="Placebo Marketing" width={200} height={45} className="h-10 w-auto" />
        </Link>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold">
              {language === "en" ? "Account Created Successfully!" : "アカウントが正常に作成されました！"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-blue-100 rounded-full">
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {language === "en" ? "Check Your Email" : "メールを確認してください"}
                </h3>
                <p className="text-gray-600 text-sm">
                  {language === "en"
                    ? "We've sent a verification email to your inbox. Please click the link in the email to verify your account."
                    : "受信トレイに確認メールを送信しました。メール内のリンクをクリックしてアカウントを確認し、登録プロセスを完了してください。"}
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">{language === "en" ? "Important:" : "重要："}</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>
                  {language === "en"
                    ? "• Check your spam/junk folder if you don't see the email"
                    : "• メールが見つからない場合は、スパム/迷惑メールフォルダを確認してください"}
                </li>
                <li>
                  {language === "en"
                    ? "• The verification link will expire in 24 hours"
                    : "• 確認リンクは24時間で期限切れになります"}
                </li>
                <li>
                  {language === "en" ? "• You can resend the email if needed" : "• 必要に応じてメールを再送信できます"}
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <Button asChild className="w-full bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90">
                <Link href="/login">
                  {language === "en" ? "Go to Sign In" : "サインインページへ"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button variant="outline" className="w-full">
                {language === "en" ? "Resend Verification Email" : "確認メールを再送信"}
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                {language === "en" ? "Need help? " : "ヘルプが必要ですか？ "}
                <Link href="/contact" className="text-placebo-gold hover:text-placebo-gold/80">
                  {language === "en" ? "Contact Support" : "サポートに連絡"}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
