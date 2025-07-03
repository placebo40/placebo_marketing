"use client"

import type React from "react"

import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import { Send } from "lucide-react"

export default function ContactForm() {
  const { language } = useLanguage()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    inquiryType: "",
    preferredLanguage: "en",
    message: "",
    newsletter: false,
  })

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast({
      title: language === "en" ? "Message sent successfully!" : "メッセージが正常に送信されました！",
      description: language === "en" ? "We'll get back to you within 24 hours." : "24時間以内にご返信いたします。",
    })

    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      inquiryType: "",
      preferredLanguage: "en",
      message: "",
      newsletter: false,
    })

    setIsSubmitting(false)
  }

  const inquiryTypes = [
    { value: "buying", label: language === "en" ? "Buying a Vehicle" : "車両購入" },
    { value: "selling", label: language === "en" ? "Selling a Vehicle" : "車両販売" },
    { value: "business", label: language === "en" ? "Business Services" : "ビジネスサービス" },
    { value: "support", label: language === "en" ? "Customer Support" : "カスタマーサポート" },
    { value: "partnership", label: language === "en" ? "Partnership" : "パートナーシップ" },
    { value: "other", label: language === "en" ? "Other" : "その他" },
  ]

  return (
    <div className="bg-gray-50 p-8 lg:p-12">
      <Card className="border-gray-200 bg-placebo-white">
        <CardHeader>
          <CardTitle className="text-2xl text-placebo-black">
            {language === "en" ? "Send us a Message" : "メッセージを送信"}
          </CardTitle>
          <CardDescription>
            {language === "en"
              ? "Fill out the form below and we'll get back to you as soon as possible."
              : "以下のフォームにご記入いただければ、できるだけ早くご返信いたします。"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
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
                <Label htmlFor="phone">{language === "en" ? "Phone Number" : "電話番号"}</Label>
                <Input
                  id="phone"
                  placeholder="+81 90-XXXX-XXXX"
                  value={formData.phone}
                  onChange={(e) => updateFormData("phone", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="inquiryType">{language === "en" ? "Inquiry Type" : "お問い合わせ種類"} *</Label>
                <Select value={formData.inquiryType} onValueChange={(value) => updateFormData("inquiryType", value)}>
                  <SelectTrigger id="inquiryType">
                    <SelectValue placeholder={language === "en" ? "Select inquiry type" : "お問い合わせ種類を選択"} />
                  </SelectTrigger>
                  <SelectContent>
                    {inquiryTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">{language === "en" ? "Subject" : "件名"} *</Label>
              <Input
                id="subject"
                placeholder={language === "en" ? "Brief description of your inquiry" : "お問い合わせの簡単な説明"}
                value={formData.subject}
                onChange={(e) => updateFormData("subject", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>{language === "en" ? "Preferred Language for Response" : "返信希望言語"}</Label>
              <RadioGroup
                value={formData.preferredLanguage}
                onValueChange={(value) => updateFormData("preferredLanguage", value)}
                className="flex flex-row space-x-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="en" id="lang-en" />
                  <Label htmlFor="lang-en" className="font-normal">
                    English
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="jp" id="lang-jp" />
                  <Label htmlFor="lang-jp" className="font-normal">
                    日本語
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">{language === "en" ? "Message" : "メッセージ"} *</Label>
              <Textarea
                id="message"
                placeholder={
                  language === "en"
                    ? "Please provide details about your inquiry, including any specific requirements or questions you may have."
                    : "お問い合わせの詳細、特定の要件やご質問がございましたら、お聞かせください。"
                }
                value={formData.message}
                onChange={(e) => updateFormData("message", e.target.value)}
                rows={5}
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="newsletter"
                checked={formData.newsletter}
                onCheckedChange={(checked) => updateFormData("newsletter", checked)}
              />
              <label
                htmlFor="newsletter"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {language === "en"
                  ? "Subscribe to our newsletter for automotive market updates"
                  : "自動車市場の最新情報をお届けするニュースレターを購読する"}
              </label>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || !formData.name || !formData.email || !formData.subject || !formData.message}
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
                  {language === "en" ? "Sending..." : "送信中..."}
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  {language === "en" ? "Send Message" : "メッセージを送信"}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
