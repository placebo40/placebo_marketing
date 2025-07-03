"use client"

import { useLanguage } from "@/contexts/language-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Mail, Clock, MessageCircle, Navigation } from "lucide-react"

export default function ContactInfo() {
  const { language } = useLanguage()

  const contactDetails = [
    {
      icon: <MapPin className="h-5 w-5 text-placebo-gold" />,
      title: language === "en" ? "Office Location" : "オフィス所在地",
      details: ["123 Kokusai Street", "Naha, Okinawa 900-0013", "Japan"],
      action: {
        label: language === "en" ? "Get Directions" : "道順を取得",
        href: "https://maps.google.com",
      },
    },
    {
      icon: <Phone className="h-5 w-5 text-placebo-gold" />,
      title: language === "en" ? "Phone Numbers" : "電話番号",
      details: [
        language === "en" ? "Main Office: +81-98-XXX-XXXX" : "本社: +81-98-XXX-XXXX",
        language === "en" ? "Sales: +81-90-XXXX-XXXX" : "営業: +81-90-XXXX-XXXX",
        language === "en" ? "Support: +81-80-XXXX-XXXX" : "サポート: +81-80-XXXX-XXXX",
      ],
      action: {
        label: language === "en" ? "Call Now" : "今すぐ電話",
        href: "tel:+8198XXXXXXX",
      },
    },
    {
      icon: <Mail className="h-5 w-5 text-placebo-gold" />,
      title: language === "en" ? "Email Addresses" : "メールアドレス",
      details: ["info@placebomarketing.com", "sales@placebomarketing.com", "support@placebomarketing.com"],
      action: {
        label: language === "en" ? "Send Email" : "メール送信",
        href: "mailto:info@placebomarketing.com",
      },
    },
    {
      icon: <Clock className="h-5 w-5 text-placebo-gold" />,
      title: language === "en" ? "Business Hours" : "営業時間",
      details: [
        language === "en" ? "Monday - Friday: 9:00 AM - 6:00 PM" : "月曜日 - 金曜日: 9:00 - 18:00",
        language === "en" ? "Saturday: 9:00 AM - 5:00 PM" : "土曜日: 9:00 - 17:00",
        language === "en" ? "Sunday: Closed" : "日曜日: 休業",
      ],
      action: {
        label: language === "en" ? "Schedule Appointment" : "予約する",
        href: "#",
      },
    },
  ]

  const emergencyContact = {
    title: language === "en" ? "24/7 Emergency Support" : "24時間緊急サポート",
    description:
      language === "en"
        ? "For urgent vehicle-related issues or emergencies, our support team is available around the clock."
        : "緊急の車両関連の問題や緊急事態については、当社のサポートチームが24時間対応いたします。",
    phone: "+81-90-EMERGENCY",
    email: "emergency@placebomarketing.com",
  }

  return (
    <div className="bg-placebo-white p-8 lg:p-12">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-placebo-black mb-2">
            {language === "en" ? "Contact Information" : "連絡先情報"}
          </h2>
          <p className="text-placebo-dark-gray">
            {language === "en"
              ? "Multiple ways to reach our team. Choose what works best for you."
              : "私たちのチームに連絡する複数の方法。あなたに最適な方法をお選びください。"}
          </p>
        </div>

        <div className="space-y-4">
          {contactDetails.map((contact, index) => (
            <Card key={index} className="border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-lg">
                  {contact.icon}
                  {contact.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-1 mb-3">
                  {contact.details.map((detail, detailIndex) => (
                    <p key={detailIndex} className="text-placebo-dark-gray text-sm">
                      {detail}
                    </p>
                  ))}
                </div>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-placebo-gold text-placebo-gold hover:bg-placebo-gold hover:text-placebo-black"
                >
                  <a href={contact.action.href}>{contact.action.label}</a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Emergency Contact */}
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-3 text-lg text-red-700">
              <MessageCircle className="h-5 w-5" />
              {emergencyContact.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-red-600 text-sm mb-3">{emergencyContact.description}</p>
            <div className="flex flex-wrap gap-2">
              <Button asChild size="sm" className="bg-red-600 text-white hover:bg-red-700">
                <a href={`tel:${emergencyContact.phone}`}>
                  <Phone className="mr-2 h-4 w-4" />
                  {language === "en" ? "Emergency Call" : "緊急電話"}
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
              >
                <a href={`mailto:${emergencyContact.email}`}>
                  <Mail className="mr-2 h-4 w-4" />
                  {language === "en" ? "Emergency Email" : "緊急メール"}
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Map Placeholder */}
        <Card className="border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-3 text-lg">
              <Navigation className="h-5 w-5 text-placebo-gold" />
              {language === "en" ? "Find Us" : "所在地"}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center border">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-placebo-gold mx-auto mb-2" />
                <p className="text-placebo-dark-gray">
                  {language === "en" ? "Interactive map coming soon" : "インタラクティブマップ近日公開"}
                </p>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="mt-2 border-placebo-gold text-placebo-gold hover:bg-placebo-gold hover:text-placebo-black"
                >
                  <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer">
                    {language === "en" ? "View on Google Maps" : "Googleマップで見る"}
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
