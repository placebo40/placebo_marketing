"use client"

import { useLanguage } from "@/contexts/language-context"
import { Card, CardContent } from "@/components/ui/card"
import { Quote, Star } from "lucide-react"

export default function ServiceTestimonials() {
  const { language } = useLanguage()

  const testimonials = [
    {
      quote:
        language === "en"
          ? "Placebo Marketing helped me sell my car in just two weeks. Their professional photography and bilingual support made all the difference."
          : "プラセボマーケティングのおかげで、わずか2週間で車を売ることができました。彼らのプロフェッショナルな写真撮影とバイリンガルサポートが大きな違いを生みました。",
      author: language === "en" ? "Michael T." : "マイケル T.",
      role: language === "en" ? "Seller" : "販売者",
      rating: 5,
    },
    {
      quote:
        language === "en"
          ? "As a first-time car buyer in Okinawa, I was nervous about the process. Their team guided me through every step and found me the perfect vehicle."
          : "沖縄で初めて車を購入する際、プロセスについて不安でした。彼らのチームは私をすべてのステップでガイドし、完璧な車を見つけてくれました。",
      author: language === "en" ? "Yuki S." : "ユキ S.",
      role: language === "en" ? "Buyer" : "購入者",
      rating: 5,
    },
    {
      quote:
        language === "en"
          ? "Our dealership's online presence has improved dramatically since working with Placebo Marketing. Their understanding of the local market is unmatched."
          : "プラセボマーケティングと協力して以来、当社のディーラーシップのオンラインプレゼンスは劇的に向上しました。彼らの地元市場の理解は比類のないものです。",
      author: language === "en" ? "David K." : "デビッド K.",
      role: language === "en" ? "Business Owner" : "ビジネスオーナー",
      rating: 5,
    },
  ]

  return (
    <section className="bg-gray-50 py-16">
      <div className="container">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-placebo-black">
            {language === "en" ? "What Our Clients Say" : "お客様の声"}
          </h2>
          <p className="mt-4 text-placebo-dark-gray max-w-2xl mx-auto">
            {language === "en"
              ? "Read testimonials from our satisfied clients across Okinawa."
              : "沖縄全域の満足されたお客様からの声をお読みください。"}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="overflow-hidden border-gray-200 bg-placebo-white">
              <CardContent className="p-6">
                <Quote className="h-8 w-8 text-placebo-gold/30 mb-4" />

                <p className="text-placebo-dark-gray mb-6">"{testimonial.quote}"</p>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-placebo-black">{testimonial.author}</p>
                    <p className="text-sm text-placebo-dark-gray">{testimonial.role}</p>
                  </div>

                  <div className="flex">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
