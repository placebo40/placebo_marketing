"use client"

import { useLanguage } from "@/contexts/language-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Shield, Users, Globe } from "lucide-react"

export default function AboutValues() {
  const { language } = useLanguage()

  const values = [
    {
      icon: <Heart className="h-8 w-8 text-placebo-gold" />,
      title: language === "en" ? "Trust First" : "信頼第一",
      description:
        language === "en"
          ? "Every interaction is built on transparency, honesty, and mutual respect between all parties."
          : "すべての相互作用は、すべての当事者間の透明性、誠実さ、相互尊重に基づいて構築されています。",
    },
    {
      icon: <Users className="h-8 w-8 text-placebo-gold" />,
      title: language === "en" ? "Cultural Bridge" : "文化の架け橋",
      description:
        language === "en"
          ? "We celebrate diversity and work to connect different communities through shared automotive needs."
          : "私たちは多様性を祝い、共通の自動車ニーズを通じて異なるコミュニティをつなぐために働いています。",
    },
    {
      icon: <Shield className="h-8 w-8 text-placebo-gold" />,
      title: language === "en" ? "Security & Safety" : "セキュリティと安全",
      description:
        language === "en"
          ? "Advanced verification processes and secure payment systems protect all our users."
          : "高度な認証プロセスと安全な支払いシステムがすべてのユーザーを保護します。",
    },
    {
      icon: <Globe className="h-8 w-8 text-placebo-gold" />,
      title: language === "en" ? "Local Expertise" : "地域の専門知識",
      description:
        language === "en"
          ? "Deep understanding of Okinawa's unique market dynamics, regulations, and community needs."
          : "沖縄の独特な市場動向、規制、コミュニティのニーズに対する深い理解。",
    },
  ]

  return (
    <section className="bg-placebo-white py-16">
      <div className="container">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-placebo-black">
            {language === "en" ? "Our Values" : "私たちの価値観"}
          </h2>
          <p className="mt-4 text-placebo-dark-gray max-w-2xl mx-auto">
            {language === "en"
              ? "The principles that guide everything we do at Placebo Marketing."
              : "プラセボマーケティングで私たちが行うすべてを導く原則。"}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {values.map((value, index) => (
            <Card
              key={index}
              className="text-center border-gray-200 bg-placebo-white hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-2">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-placebo-gold/10">
                  {value.icon}
                </div>
                <CardTitle className="text-lg text-placebo-black">{value.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-placebo-dark-gray">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
