"use client"

import { useLanguage } from "@/contexts/language-context"
import { Phone, Mail, MessageCircle, MapPin } from "lucide-react"

export default function ContactHero() {
  const { language } = useLanguage()

  const quickContacts = [
    {
      icon: <Phone className="h-5 w-5" />,
      label: language === "en" ? "Call Us" : "お電話",
      value: "+81-98-XXX-XXXX",
      action: "tel:+8198XXXXXXX",
    },
    {
      icon: <Mail className="h-5 w-5" />,
      label: language === "en" ? "Email Us" : "メール",
      value: language === "en" ? "info@placebo.com" : "info@placebo.com",
      action: "mailto:info@placebomarketing.com",
    },
    {
      icon: <MessageCircle className="h-5 w-5" />,
      label: language === "en" ? "Live Chat" : "ライブチャット",
      value: language === "en" ? "Available 24/7" : "24時間対応",
      action: "#",
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      label: language === "en" ? "Visit Us" : "ご来店",
      value: language === "en" ? "Naha, Okinawa" : "沖縄県那覇市",
      action: "#",
    },
  ]

  return (
    <div className="relative bg-placebo-black text-placebo-white overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-placebo-black via-placebo-black/95 to-placebo-black/80" />
        <img
          src="/images/automotive-partnership.jpg"
          alt="Professional automotive consultation"
          className="w-full h-full object-cover opacity-30"
        />
      </div>

      <div className="container relative z-10 py-16 md:py-24">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            {language === "en" ? "Get in Touch" : "お問い合わせ"}
          </h1>

          <p className="mt-6 text-lg text-gray-300 max-w-2xl">
            {language === "en"
              ? "Ready to buy, sell, or grow your automotive business? Our bilingual team is here to help you every step of the way."
              : "車の購入、販売、または自動車ビジネスの成長をお考えですか？私たちのバイリンガルチームが、あらゆるステップでお手伝いします。"}
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickContacts.map((contact, index) => (
              <a
                key={index}
                href={contact.action}
                className="flex items-center gap-3 p-4 bg-placebo-white/10 backdrop-blur-sm rounded-lg border border-placebo-white/20 hover:bg-placebo-white/20 transition-colors min-w-0"
              >
                <div className="text-placebo-gold flex-shrink-0">{contact.icon}</div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-placebo-white truncate">{contact.label}</p>
                  <p className="text-xs text-gray-300 truncate">{contact.value}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
