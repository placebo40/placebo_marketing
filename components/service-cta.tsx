"use client"

import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function ServiceCTA() {
  const { language } = useLanguage()

  return (
    <section className="bg-placebo-black text-placebo-white py-16">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            {language === "en" ? "Ready to Get Started?" : "始める準備はできていますか？"}
          </h2>

          <p className="mt-4 text-gray-300">
            {language === "en"
              ? "Contact our team today to discuss how we can help with your automotive needs in Okinawa."
              : "沖縄でのあなたの自動車ニーズについて、どのようにお手伝いできるかを話し合うために、今日私たちのチームにお問い合わせください。"}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90 font-semibold"
            >
              <Link href="/contact">
                {language === "en" ? "Contact Us" : "お問い合わせ"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-placebo-white text-placebo-white bg-transparent hover:bg-placebo-white hover:text-placebo-black transition-colors"
            >
              <Link href="/about">{language === "en" ? "Learn More About Us" : "私たちについてもっと知る"}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
