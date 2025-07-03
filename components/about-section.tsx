"use client"

import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default function AboutSection() {
  const { t, language } = useLanguage()

  return (
    <section className="bg-placebo-white py-16">
      <div className="container">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8">
          <div className="flex items-center justify-center">
            <div className="relative h-[300px] w-full overflow-hidden rounded-2xl shadow-xl sm:h-[400px] border border-gray-200">
              <Image
                src="/images/diverse-team-consultation.jpg"
                alt="Diverse team consultation representing Placebo Marketing's collaborative approach to automotive services"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-placebo-black/40 to-transparent" />

              {/* Multi-layered trust and service indicators */}
              <div className="absolute top-4 left-4 right-4">
                <div className="flex flex-wrap gap-2">
                  <div className="bg-placebo-gold/90 backdrop-blur-sm rounded-full px-3 py-1">
                    <p className="text-xs font-semibold text-placebo-black">
                      {language === "en" ? "Expert Guidance" : "専門ガイダンス"}
                    </p>
                  </div>
                  <div className="bg-placebo-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                    <p className="text-xs font-semibold text-placebo-black">
                      {language === "en" ? "Cultural Bridge" : "文化の架け橋"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom service highlight */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-placebo-black/80 backdrop-blur-sm rounded-lg p-3">
                  <p className="text-sm font-medium text-placebo-white">
                    {language === "en"
                      ? "Supporting Okinawa's diverse automotive community"
                      : "沖縄の多様な自動車コミュニティをサポート"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold tracking-tight text-placebo-black">{t("aboutPlacebo")}</h2>
            <div className="mt-6 space-y-4 text-placebo-dark-gray">
              <p>
                {language === "en"
                  ? "Placebo Marketing bridges the gap between Okinawa's diverse automotive community, serving both local Japanese residents and the international military community with equal expertise and cultural understanding."
                  : "プラセボマーケティングは、沖縄の多様な自動車コミュニティの架け橋となり、地元の日本人住民と国際的な軍事コミュニティの両方に、同等の専門知識と文化的理解でサービスを提供しています。"}
              </p>
              <p>
                {language === "en"
                  ? "Our bilingual team specializes in creating trust-first transactions that respect cultural differences while ensuring transparency and security for all parties involved in vehicle sales and marketing services."
                  : "私たちのバイリンガルチームは、文化的違いを尊重しながら、車両販売とマーケティングサービスに関わるすべての当事者に透明性とセキュリティを確保する、信頼第一の取引の創出を専門としています。"}
              </p>
              <p>
                {language === "en"
                  ? "From individual vehicle transactions to comprehensive business marketing solutions, we're committed to fostering understanding and success across Okinawa's unique multicultural landscape."
                  : "個人の車両取引から包括的なビジネスマーケティングソリューションまで、沖縄独特の多文化的な環境における理解と成功の促進に取り組んでいます。"}
              </p>
            </div>
            <div className="mt-8">
              <Button asChild className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90 font-semibold">
                <Link href="/about">{t("aboutUs")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
