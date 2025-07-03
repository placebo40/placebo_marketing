"use client"

import { useLanguage } from "@/contexts/language-context"

export default function AboutStats() {
  const { language } = useLanguage()

  const stats = [
    {
      number: "2,500+",
      label: language === "en" ? "Vehicles Sold" : "販売車両数",
    },
    {
      number: "98%",
      label: language === "en" ? "Customer Satisfaction" : "顧客満足度",
    },
    {
      number: "150+",
      label: language === "en" ? "Business Partners" : "ビジネスパートナー",
    },
    {
      number: "24/7",
      label: language === "en" ? "Bilingual Support" : "バイリンガルサポート",
    },
  ]

  return (
    <section className="bg-placebo-black text-placebo-white py-16">
      <div className="container">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight">{language === "en" ? "Our Impact" : "私たちの影響"}</h2>
          <p className="mt-4 text-gray-300 max-w-2xl mx-auto">
            {language === "en"
              ? "Numbers that reflect our commitment to serving Okinawa's automotive community."
              : "沖縄の自動車コミュニティへのサービス提供に対する私たちのコミットメントを反映する数字。"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold text-placebo-gold mb-2">{stat.number}</div>
              <div className="text-gray-300">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
