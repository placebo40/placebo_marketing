"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowLeft, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { GuestOnlyRoute } from "@/components/guest-only-route"
import { useAuth } from "@/contexts/auth-context"

export default function SignupPage() {
  const { language } = useLanguage()
  const router = useRouter()
  const auth = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })

  const [showTermsDialog, setShowTermsDialog] = useState(false)
  const [showPrivacyDialog, setShowPrivacyDialog] = useState(false)
  const [termsScrolledToBottom, setTermsScrolledToBottom] = useState(false)
  const [privacyScrolledToBottom, setPrivacyScrolledToBottom] = useState(false)

  const termsScrollRef = useRef<HTMLDivElement>(null)
  const privacyScrollRef = useRef<HTMLDivElement>(null)

  // Check if content requires scrolling when dialogs open
  useEffect(() => {
    if (showTermsDialog && termsScrollRef.current) {
      const { scrollHeight, clientHeight } = termsScrollRef.current
      if (scrollHeight <= clientHeight) {
        setTermsScrolledToBottom(true)
      }
    }
  }, [showTermsDialog])

  useEffect(() => {
    if (showPrivacyDialog && privacyScrollRef.current) {
      const { scrollHeight, clientHeight } = privacyScrollRef.current
      if (scrollHeight <= clientHeight) {
        setPrivacyScrolledToBottom(true)
      }
    }
  }, [showPrivacyDialog])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert(language === "en" ? "Passwords don't match" : "パスワードが一致しません")
      return
    }
    if (!acceptTerms) {
      alert(language === "en" ? "Please accept the terms and conditions" : "利用規約に同意してください")
      return
    }

    try {
      await auth.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        userType: "guest", // Default to guest registration
      })

      // Redirect to confirmation or dashboard
      router.push("/signup/confirmation")
    } catch (error) {
      // Error is handled by auth context
      console.error("Registration error:", error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleTermsScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      setTermsScrolledToBottom(true)
    }
  }

  const handlePrivacyScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      setPrivacyScrolledToBottom(true)
    }
  }

  const openTermsDialog = (e: React.MouseEvent) => {
    e.preventDefault()
    setShowTermsDialog(true)
    setTermsScrolledToBottom(false)
  }

  const openPrivacyDialog = (e: React.MouseEvent) => {
    e.preventDefault()
    setShowPrivacyDialog(true)
    setPrivacyScrolledToBottom(false)
  }

  return (
    <GuestOnlyRoute>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link href="/" className="flex justify-center mb-6">
            <Image
              src="/images/logo-black.png"
              alt="Placebo Marketing"
              width={200}
              height={45}
              className="h-10 w-auto"
            />
          </Link>

          <Card>
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2 mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.back()}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  {language === "en" ? "Back" : "戻る"}
                </Button>
              </div>
              <CardTitle className="text-2xl font-bold text-center">
                {language === "en" ? "Create your account" : "アカウントを作成"}
              </CardTitle>
              <CardDescription className="text-center">
                {language === "en"
                  ? "Join Placebo Marketing to start buying and selling vehicles"
                  : "Placebo Marketingに参加して車両の売買を始めましょう"}
              </CardDescription>
              {auth.error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-red-800">{auth.error}</p>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">{language === "en" ? "First name" : "名"}</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="pl-10"
                        placeholder={language === "en" ? "John" : "太郎"}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">{language === "en" ? "Last name" : "姓"}</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder={language === "en" ? "Doe" : "田中"}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{language === "en" ? "Email address" : "メールアドレス"}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10"
                      placeholder={language === "en" ? "john@example.com" : "taro@example.com"}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">{language === "en" ? "Phone number" : "電話番号"}</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="pl-10"
                      placeholder={language === "en" ? "+81 90-1234-5678" : "090-1234-5678"}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">{language === "en" ? "Password" : "パスワード"}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-10 pr-10"
                      placeholder={language === "en" ? "Create a password" : "パスワードを作成"}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{language === "en" ? "Confirm password" : "パスワード確認"}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="pl-10 pr-10"
                      placeholder={language === "en" ? "Confirm your password" : "パスワードを確認"}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" checked={acceptTerms} onCheckedChange={setAcceptTerms} />
                  <Label htmlFor="terms" className="text-sm">
                    {language === "en" ? "I agree to the " : "私は"}
                    <button
                      type="button"
                      onClick={openTermsDialog}
                      className="text-placebo-gold hover:text-placebo-gold/80 underline"
                    >
                      {language === "en" ? "Terms of Service" : "利用規約"}
                    </button>
                    {language === "en" ? " and " : "と"}
                    <button
                      type="button"
                      onClick={openPrivacyDialog}
                      className="text-placebo-gold hover:text-placebo-gold/80 underline"
                    >
                      {language === "en" ? "Privacy Policy" : "プライバシーポリシー"}
                    </button>
                    {language === "en" ? "" : "に同意します"}
                  </Label>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90"
                  disabled={auth.isLoading}
                >
                  {auth.isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {language === "en" ? "Creating account..." : "アカウント作成中..."}
                    </>
                  ) : language === "en" ? (
                    "Create account"
                  ) : (
                    "アカウントを作成"
                  )}
                </Button>
              </form>

              <div className="mt-6">
                <Separator />
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    {language === "en" ? "Already have an account?" : "すでにアカウントをお持ちですか？"}{" "}
                    <Link href="/login" className="font-medium text-placebo-gold hover:text-placebo-gold/80">
                      {language === "en" ? "Sign in" : "サインイン"}
                    </Link>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Terms of Service Dialog */}
        <Dialog open={showTermsDialog} onOpenChange={setShowTermsDialog}>
          <DialogContent className="max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>{language === "en" ? "Terms of Service" : "利用規約"}</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[60vh] pr-4" onScrollCapture={handleTermsScroll}>
              <div className="space-y-6" ref={termsScrollRef}>
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    {language === "en" ? "Acceptance of Terms" : "利用規約の承諾"}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {language === "en"
                      ? "By accessing and using Placebo Marketing's services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service."
                      : "プラセボマーケティングのサービスにアクセスし、利用することにより、本契約の条項および規定に拘束されることに同意し、承諾したものとみなされます。上記に同意されない場合は、本サービスをご利用にならないでください。"}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    {language === "en" ? "User Responsibilities" : "ユーザーの責任"}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {language === "en"
                      ? "Users are responsible for maintaining the confidentiality of their account information, providing accurate vehicle and personal information, and complying with all applicable laws and regulations when using our platform."
                      : "ユーザーは、アカウント情報の機密性を維持し、正確な車両および個人情報を提供し、当社のプラットフォームを使用する際にすべての適用法および規制を遵守する責任があります。"}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    {language === "en" ? "Platform Usage" : "プラットフォームの使用"}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {language === "en"
                      ? "Our platform is intended for legitimate vehicle buying, selling, and automotive business purposes. Users must not engage in fraudulent activities, misrepresent vehicles or services, or violate any terms of use."
                      : "当社のプラットフォームは、正当な車両の売買および自動車ビジネス目的での使用を意図しています。ユーザーは、詐欺行為に従事したり、車両やサービスを偽って表示したり、利用規約に違反したりしてはなりません。"}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    {language === "en" ? "Limitation of Liability" : "責任の制限"}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {language === "en"
                      ? "Placebo Marketing acts as a marketplace facilitator and is not responsible for the quality, safety, or legality of vehicles listed, the truth or accuracy of listings, or the ability of sellers to sell or buyers to buy."
                      : "プラセボマーケティングはマーケットプレイスのファシリテーターとして機能し、出品された車両の品質、安全性、合法性、出品の真実性や正確性、または売り手の販売能力や買い手の購入能力について責任を負いません。"}
                  </p>
                </div>
              </div>
            </ScrollArea>
            <div className="flex justify-end pt-4">
              <Button
                onClick={() => setShowTermsDialog(false)}
                className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90"
              >
                {language === "en" ? "Close" : "閉じる"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Privacy Policy Dialog */}
        <Dialog open={showPrivacyDialog} onOpenChange={setShowPrivacyDialog}>
          <DialogContent className="max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>{language === "en" ? "Privacy Policy" : "プライバシーポリシー"}</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[60vh] pr-4" onScrollCapture={handlePrivacyScroll}>
              <div className="space-y-6" ref={privacyScrollRef}>
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    {language === "en" ? "Information We Collect" : "収集する情報"}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {language === "en"
                      ? "We collect information you provide directly to us, such as when you create an account, list a vehicle, contact sellers, or communicate with us. This includes your name, email address, phone number, and vehicle information."
                      : "アカウント作成、車両出品、販売者への連絡、または当社とのコミュニケーション時に直接提供される情報を収集します。これには、お名前、メールアドレス、電話番号、車両情報が含まれます。"}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    {language === "en" ? "How We Use Your Information" : "情報の使用方法"}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {language === "en"
                      ? "We use the information we collect to provide, maintain, and improve our services, process transactions, send communications, and ensure the security of our platform. We may also use your information to personalize your experience and provide customer support."
                      : "収集した情報は、サービスの提供、維持、改善、取引処理、コミュニケーション送信、プラットフォームのセキュリティ確保に使用します。また、体験のパーソナライズやカスタマーサポートの提供にも使用する場合があります。"}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    {language === "en" ? "Information Sharing" : "情報の共有"}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {language === "en"
                      ? "We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy. We may share information with service providers, legal authorities when required, or in connection with business transfers."
                      : "本ポリシーに記載されている場合を除き、お客様の同意なしに個人情報を第三者に販売、取引、または譲渡することはありません。サービスプロバイダー、法的機関（必要な場合）、または事業譲渡に関連して情報を共有する場合があります。"}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    {language === "en" ? "Data Security" : "データセキュリティ"}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {language === "en"
                      ? "We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes encryption, secure servers, and regular security assessments."
                      : "不正アクセス、改変、開示、破壊から個人情報を保護するために適切なセキュリティ対策を実施しています。これには、暗号化、セキュアサーバー、定期的なセキュリティ評価が含まれます。"}
                  </p>
                </div>
              </div>
            </ScrollArea>
            <div className="flex justify-end pt-4">
              <Button
                onClick={() => setShowPrivacyDialog(false)}
                className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90"
              >
                {language === "en" ? "Close" : "閉じる"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </GuestOnlyRoute>
  )
}
