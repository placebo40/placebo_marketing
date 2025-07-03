"use client"

import { useLanguage } from "@/contexts/language-context"
import { Card, CardContent } from "@/components/ui/card"
import { Linkedin, Mail } from "lucide-react"

export default function AboutTeam() {
  const { language } = useLanguage()

  const teamMembers = [
    {
      name: "Alex Thompson",
      role: language === "en" ? "Founder & CEO" : "創設者兼CEO",
      bio:
        language === "en"
          ? "Former automotive industry executive with 15+ years of experience in international markets."
          : "国際市場で15年以上の経験を持つ元自動車業界エグゼクティブ。",
      image: "/placeholder.svg?height=300&width=300&text=Alex+Thompson",
    },
    {
      name: "Yuki Tanaka",
      role: language === "en" ? "Head of Operations" : "オペレーション責任者",
      bio:
        language === "en"
          ? "Okinawa native with deep local market knowledge and bilingual customer service expertise."
          : "深い地域市場知識とバイリンガルカスタマーサービスの専門知識を持つ沖縄出身者。",
      image: "/placeholder.svg?height=300&width=300&text=Yuki+Tanaka",
    },
    {
      name: "Marcus Rodriguez",
      role: language === "en" ? "Marketing Director" : "マーケティングディレクター",
      bio:
        language === "en"
          ? "Digital marketing specialist focused on cross-cultural communication and community building."
          : "異文化コミュニケーションとコミュニティ構築に焦点を当てたデジタルマーケティングスペシャリスト。",
      image: "/placeholder.svg?height=300&width=300&text=Marcus+Rodriguez",
    },
  ]

  return (
    <section className="bg-gray-50 py-16">
      <div className="container">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-placebo-black">
            {language === "en" ? "Meet Our Team" : "私たちのチーム"}
          </h2>
          <p className="mt-4 text-placebo-dark-gray max-w-2xl mx-auto">
            {language === "en"
              ? "The passionate individuals behind Placebo Marketing's success."
              : "プラセボマーケティングの成功を支える情熱的な個人たち。"}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {teamMembers.map((member, index) => (
            <Card key={index} className="overflow-hidden border-gray-200 bg-placebo-white">
              <div className="aspect-square overflow-hidden">
                <img
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="font-semibold text-placebo-black">{member.name}</h3>
                <p className="text-sm text-placebo-gold font-medium mb-3">{member.role}</p>
                <p className="text-placebo-dark-gray text-sm mb-4">{member.bio}</p>
                <div className="flex gap-2">
                  <button className="p-2 text-placebo-dark-gray hover:text-placebo-gold transition-colors">
                    <Linkedin className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-placebo-dark-gray hover:text-placebo-gold transition-colors">
                    <Mail className="h-4 w-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
