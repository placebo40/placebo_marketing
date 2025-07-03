"use client"

import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HeroSectionAlt() {
  const { t } = useLanguage()

  return (
    <div className="relative overflow-hidden bg-placebo-white">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 opacity-50" />

      <div className="container relative z-10 py-16 md:py-24 lg:py-32">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8">
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-bold tracking-tight text-placebo-black sm:text-5xl md:text-6xl">
              {t("heroTitle")}
            </h1>
            <p className="mt-6 text-lg text-placebo-dark-gray">{t("heroSubtitle")}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button
                asChild
                size="lg"
                className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90 font-semibold"
              >
                <Link href="/cars">{t("browseVehicles")}</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-placebo-black text-placebo-black hover:bg-placebo-black hover:text-placebo-white"
              >
                <Link href="/list-car">{t("listMyCar")}</Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button
                asChild
                variant="ghost"
                className="text-placebo-dark-gray hover:text-placebo-gold hover:bg-transparent"
              >
                <Link href="/sell-with-us">{t("sellWithUs")}</Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="text-placebo-dark-gray hover:text-placebo-gold hover:bg-transparent"
              >
                <Link href="/start-project">{t("startYourProject")}</Link>
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="relative h-[300px] w-full overflow-hidden rounded-2xl shadow-xl sm:h-[400px] lg:h-[500px] border border-gray-200">
              <img
                src="/placeholder.svg?height=500&width=600&text=US+military+buyer+using+phone+while+viewing+car+in+Okinawa+natural+daylight+setting"
                alt="U.S. military buyer using mobile phone while viewing a vehicle in natural Okinawa daylight setting"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-placebo-black/20 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
