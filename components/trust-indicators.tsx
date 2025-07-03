"use client"

import { useLanguage } from "@/contexts/language-context"
import { Shield, Users, MapPin, Clock } from "lucide-react"

export default function TrustIndicators() {
  const { language } = useLanguage()

  const indicators = [
    {
      icon: Shield,
      title: language === "en" ? "Verified Sellers" : "認証済み売り手",
      description: language === "en" ? "All sellers undergo KYC verification" : "すべての売り手がKYC認証を受けています",
    },
    {
      icon: Users,
      title: language === "en" ? "Bilingual Support" : "バイリンガルサポート",
      description: language === "en" ? "English & Japanese customer service" : "英語と日本語のカスタマーサービス",
    },
    {
      icon: MapPin,
      title: language === "en" ? "Okinawa Local" : "沖縄ローカル",
      description: language === "en" ? "Serving the Okinawa community" : "沖縄コミュニティにサービス提供",
    },
    {
      icon: Clock,
      title: language === "en" ? "Quick Response" : "迅速な対応",
      description: language === "en" ? "Fast, reliable communication" : "迅速で信頼性の高いコミュニケーション",
    },
  ]

  return (
    <section className="bg-placebo-white py-12 border-t border-gray-100">
      <div className="container">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {indicators.map((indicator, index) => {
            const Icon = indicator.icon
            return (
              <div key={index} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-placebo-gold/10">
                  <Icon className="h-6 w-6 text-placebo-gold" />
                </div>
                <h3 className="mb-2 font-semibold text-placebo-black">{indicator.title}</h3>
                <p className="text-sm text-placebo-dark-gray">{indicator.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
