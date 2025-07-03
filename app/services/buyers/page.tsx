"use client"

import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function BuyerServicesPage() {
  const { language } = useLanguage()

  return (
    <div className="container py-16">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/services" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          {language === "en" ? "Back to Services" : "サービスに戻る"}
        </Link>
      </Button>

      <h1 className="text-3xl font-bold text-placebo-black mb-6">
        {language === "en" ? "Buyer Services" : "購入者向けサービス"}
      </h1>

      <p className="text-placebo-dark-gray">
        {language === "en"
          ? "Detailed information about our buyer services coming soon."
          : "購入者向けサービスに関する詳細情報は近日公開予定です。"}
      </p>
    </div>
  )
}
