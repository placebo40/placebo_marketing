"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const { language } = useLanguage()
  const router = useRouter()
  const searchParams = useSearchParams()
  const auth = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [localError, setLocalError] = useState<string | null>(null)

  const redirectTo = searchParams.get("redirect") || null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)

    // Basic validation
    if (!formData.email || !formData.password) {
      setLocalError("Please enter both email and password")
      return
    }

    try {
      await auth.login(formData.email, formData.password)

      // Only redirect on successful login
      if (redirectTo) {
        router.push(redirectTo)
      } else {
        // Redirect based on user type
        if (auth.user) {
          switch (auth.user.userType) {
            case "admin":
              router.push("/admin")
              break
            case "dealer":
            case "seller":
              router.push("/seller-dashboard")
              break
            case "guest":
            default:
              router.push("/guest-dashboard")
              break
          }
        } else {
          router.push("/")
        }
      }
    } catch (error) {
      // Error is handled by auth context and displayed below
      console.error("Login error:", error)
      // Set local error as backup
      if (error instanceof Error) {
        setLocalError(error.message)
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
    // Clear errors when user starts typing
    if (auth.error) {
      auth.clearError()
    }
    if (localError) {
      setLocalError(null)
    }
  }

  // Display error from auth context or local error
  const displayError = auth.error || localError

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center mb-6">
          <Image src="/images/logo-black.png" alt="Placebo Marketing" width={200} height={45} className="h-10 w-auto" />
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
              {language === "en" ? "Welcome back" : "おかえりなさい"}
            </CardTitle>
            <CardDescription className="text-center">
              {language === "en" ? "Sign in to your account to continue" : "アカウントにサインインして続行してください"}
            </CardDescription>
            {redirectTo && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                <p className="text-sm text-blue-800">
                  {language === "en"
                    ? "Please sign in to access the requested page."
                    : "リクエストされたページにアクセスするにはサインインしてください。"}
                </p>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {/* Demo credentials info */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
              <h4 className="text-sm font-medium text-green-800 mb-2">Demo Credentials:</h4>
              <div className="text-xs text-green-700 space-y-1">
                <div>
                  <strong>Admin:</strong> admin@placebomarketing.com
                </div>
                <div>
                  <strong>Dealer:</strong> dealer@okinawacars.com
                </div>
                <div>
                  <strong>Seller:</strong> seller@example.com
                </div>
                <div>
                  <strong>Guest:</strong> john.doe@example.com
                </div>
                <div>
                  <strong>Password:</strong> password123 (for all accounts)
                </div>
              </div>
            </div>

            {displayError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{displayError}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
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
                    placeholder={language === "en" ? "Enter your email" : "メールアドレスを入力"}
                    disabled={auth.isLoading}
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
                    placeholder={language === "en" ? "Enter your password" : "パスワードを入力"}
                    disabled={auth.isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={auth.isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={setRememberMe}
                    disabled={auth.isLoading}
                  />
                  <Label htmlFor="remember" className="text-sm">
                    {language === "en" ? "Remember me" : "ログイン状態を保持"}
                  </Label>
                </div>
                <div className="text-sm">
                  <Link href="/forgot-password" className="text-placebo-gold hover:text-placebo-gold/80">
                    {language === "en" ? "Forgot your password?" : "パスワードをお忘れですか？"}
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90"
                disabled={auth.isLoading}
              >
                {auth.isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {language === "en" ? "Signing in..." : "サインイン中..."}
                  </>
                ) : language === "en" ? (
                  "Sign in"
                ) : (
                  "サインイン"
                )}
              </Button>
            </form>

            <div className="mt-6">
              <Separator />
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  {language === "en" ? "Don't have an account?" : "アカウントをお持ちでないですか？"}{" "}
                  <Link href="/signup" className="font-medium text-placebo-gold hover:text-placebo-gold/80">
                    {language === "en" ? "Sign up" : "サインアップ"}
                  </Link>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
