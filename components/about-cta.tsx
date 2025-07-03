"use client"

import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, MessageCircle } from "lucide-react"

export default function AboutCTA() {
  const { language } = useLanguage()

  return (
    <section className="bg-placebo-white py-16">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight text-placebo-black">
            {language === "en" ? "Ready to Work Together?" : "一緒に働く準備はできていますか？"}
          </h2>

          <p className="mt-4 text-placebo-dark-gray">
            {language === "en"
              ? "Whether you're looking to buy, sell, or grow your automotive business, we're here to help you succeed."
              : "車の購入、販売、または自動車ビジネスの成長をお考えの場合、私たちがあなたの成功をお手伝いします。"}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90 font-semibold"
            >
              <Link href="/contact">
                <MessageCircle className="mr-2 h-4 w-4" />
                {language === "en" ? "Get in Touch" : "お問い合わせ"}
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-placebo-black text-placebo-black hover:bg-placebo-black hover:text-placebo-white"
            >
              <Link href="/services">
                {language === "en" ? "Explore Our Services" : "私たちのサービスを探る"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
