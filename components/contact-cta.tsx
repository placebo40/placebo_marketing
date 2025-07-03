"use client"

import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, MessageCircle, Phone } from "lucide-react"

export default function ContactCTA() {
  const { language } = useLanguage()

  return (
    <section className="bg-placebo-black text-placebo-white py-16">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            {language === "en" ? "Still Have Questions?" : "まだご質問がありますか？"}
          </h2>

          <p className="mt-4 text-gray-300">
            {language === "en"
              ? "Our team is always ready to help. Don't hesitate to reach out through any of our contact methods."
              : "私たちのチームはいつでもお手伝いする準備ができています。お気軽にお問い合わせ方法のいずれかでご連絡ください。"}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90 font-semibold"
            >
              <a href="tel:+8198XXXXXXX">
                <Phone className="mr-2 h-4 w-4" />
                {language === "en" ? "Call Us Now" : "今すぐお電話"}
              </a>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-placebo-white text-placebo-white bg-transparent hover:bg-placebo-white hover:text-placebo-black transition-colors"
            >
              <a
                href="#"
                onClick={() => {
                  // This would trigger the AI chat component
                  const chatButton = document.querySelector("[data-chat-trigger]") as HTMLElement
                  if (chatButton) chatButton.click()
                }}
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                {language === "en" ? "Start Live Chat" : "ライブチャット開始"}
              </a>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-placebo-white text-placebo-white bg-transparent hover:bg-placebo-white hover:text-placebo-black transition-colors"
            >
              <Link href="/services">
                {language === "en" ? "View Our Services" : "サービスを見る"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
