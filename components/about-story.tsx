"use client"

import { useLanguage } from "@/contexts/language-context"
import Image from "next/image"

export default function AboutStory() {
  const { language } = useLanguage()

  return (
    <section className="bg-gray-50 py-16">
      <div className="container">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8">
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold tracking-tight text-placebo-black">
              {language === "en" ? "Our Story" : "私たちのストーリー"}
            </h2>
            <div className="mt-6 space-y-4 text-placebo-dark-gray">
              <p>
                {language === "en"
                  ? "Founded in 2020, Placebo Marketing emerged from a simple observation: Okinawa's unique position as a cultural crossroads created both opportunities and challenges in the automotive market."
                  : "2020年に設立されたプラセボマーケティングは、シンプルな観察から生まれました：文化の交差点としての沖縄の独特な位置が、自動車市場において機会と課題の両方を生み出していることです。"}
              </p>
              <p>
                {language === "en"
                  ? "With a significant U.S. military presence alongside the local Japanese community, we recognized the need for a service that could bridge language barriers, cultural differences, and varying automotive needs."
                  : "地元の日本人コミュニティと並んで重要な米軍の存在があることで、言語の壁、文化的違い、そして様々な自動車ニーズを橋渡しできるサービスの必要性を認識しました。"}
              </p>
              <p>
                {language === "en"
                  ? "Today, we're proud to serve as Okinawa's premier automotive marketplace and marketing agency, helping thousands of residents buy, sell, and service their vehicles with confidence."
                  : "今日、私たちは沖縄の一流自動車マーケットプレイスおよびマーケティング代理店として、何千人もの住民が自信を持って車を売買し、サービスを受けることを支援していることを誇りに思います。"}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="relative h-[300px] w-full overflow-hidden rounded-2xl shadow-xl sm:h-[400px] border border-gray-200">
              <Image
                src="/images/multicultural-car-handshake.jpg"
                alt="Multicultural business handshake representing our founding principles"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-placebo-black/30 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
