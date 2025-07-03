"use client"

import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default function AboutHero() {
  const { language } = useLanguage()

  return (
    <div className="relative bg-placebo-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 opacity-50" />

      <div className="container relative z-10 py-16 md:py-24 lg:py-32">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8">
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-bold tracking-tight text-placebo-black sm:text-5xl md:text-6xl">
              {language === "en" ? "About Placebo Marketing" : "プラセボマーケティングについて"}
            </h1>
            <p className="mt-6 text-lg text-placebo-dark-gray">
              {language === "en"
                ? "Bridging cultures and connecting communities through innovative automotive solutions in Okinawa."
                : "沖縄で革新的な自動車ソリューションを通じて文化を橋渡しし、コミュニティをつなぐ。"}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button
                asChild
                size="lg"
                className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90 font-semibold"
              >
                <Link href="/contact">{language === "en" ? "Get in Touch" : "お問い合わせ"}</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-placebo-black text-placebo-black hover:bg-placebo-black hover:text-placebo-white"
              >
                <Link href="/services">{language === "en" ? "Our Services" : "私たちのサービス"}</Link>
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="relative h-[300px] w-full overflow-hidden rounded-2xl shadow-xl sm:h-[400px] lg:h-[500px] border border-gray-200">
              <Image
                src="/images/diverse-team-consultation.jpg"
                alt="Diverse team consultation representing Placebo Marketing's collaborative approach"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-placebo-black/40 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-placebo-white/95 backdrop-blur-sm rounded-lg p-4 border border-placebo-gold/20">
                  <p className="text-sm font-semibold text-placebo-black">
                    {language === "en"
                      ? "Serving Okinawa's diverse automotive community since 2020"
                      : "2020年から沖縄の多様な自動車コミュニティにサービスを提供"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
