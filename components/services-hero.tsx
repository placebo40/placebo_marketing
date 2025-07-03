"use client"

import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ServicesHero() {
  const { language } = useLanguage()

  return (
    <div className="relative bg-placebo-black text-placebo-white overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-placebo-black via-placebo-black/95 to-placebo-black/80" />
        <img
          src="/images/car-consultation-outdoor.jpg"
          alt="Professional automotive consultation"
          className="w-full h-full object-cover opacity-30"
        />
      </div>

      <div className="container relative z-10 py-16 md:py-24 lg:py-32">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            {language === "en" ? "Comprehensive Automotive Services" : "包括的な自動車サービス"}
          </h1>

          <p className="mt-6 text-lg text-gray-300 max-w-2xl">
            {language === "en"
              ? "Placebo Marketing offers specialized services for buyers, sellers, and businesses in Okinawa's unique automotive market."
              : "プラセボマーケティングは、沖縄の独自の自動車市場において、買い手、売り手、企業向けの専門サービスを提供しています。"}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Button
              asChild
              size="lg"
              className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90 font-semibold"
            >
              <Link href="#service-categories">{language === "en" ? "Explore Services" : "サービスを探る"}</Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-placebo-white text-placebo-white bg-transparent hover:bg-placebo-white hover:text-placebo-black transition-colors"
            >
              <Link href="/contact">{language === "en" ? "Contact Us" : "お問い合わせ"}</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
