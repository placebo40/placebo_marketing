"use client"

import { useLanguage } from "@/contexts/language-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle } from "lucide-react"

export default function ServicesSection() {
  const { t } = useLanguage()

  const services = {
    sellers: [
      { title: "Vehicle Appraisal", description: "Get a fair market value for your vehicle" },
      { title: "KYC & Inspection Badge", description: "Build trust with verified seller status" },
      { title: "Marketing Services", description: "We handle all promotion for maximum visibility" },
      { title: "Title Transfer Support", description: "Hassle-free paperwork handling" },
      { title: "Secure Payments", description: "Stripe escrow for safe transactions" },
      { title: "Bilingual Support", description: "Customer negotiation in English and Japanese" },
    ],
    buyers: [
      { title: "Advanced Search Filters", description: "Find exactly what you're looking for" },
      { title: "Saved Vehicles Dashboard", description: "Track favorites and get price alerts" },
      { title: "AI Car Matcher", description: "Get personalized vehicle recommendations" },
      { title: "Financing Simulation", description: "Calculate payments before you buy" },
      { title: "Verified Seller Badges", description: "Shop with confidence from trusted sellers" },
      { title: "Full Inspection Reports", description: "Know the vehicle's condition upfront" },
    ],
    businesses: [
      { title: "Dealer Portal", description: "Manage your inventory efficiently" },
      { title: "Web Design", description: "Custom websites for automotive businesses" },
      { title: "Digital Marketing", description: "Targeted campaigns for your audience" },
      { title: "Branding Services", description: "Stand out in the competitive market" },
      { title: "SEO Optimization", description: "Improve your online visibility" },
      { title: "Analytics Dashboard", description: "Track performance and conversions" },
    ],
  }

  return (
    <section className="bg-gray-50 py-16">
      <div className="container">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-placebo-black">{t("ourServices")}</h2>
          <p className="mt-4 text-placebo-dark-gray max-w-2xl mx-auto">
            Placebo Marketing offers comprehensive services for buyers, sellers, and businesses in the automotive
            industry.
          </p>
        </div>

        <Tabs defaultValue="sellers" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-placebo-white border border-gray-200">
            <TabsTrigger
              value="sellers"
              className="data-[state=active]:bg-placebo-gold data-[state=active]:text-placebo-black"
            >
              {t("forSellers")}
            </TabsTrigger>
            <TabsTrigger
              value="buyers"
              className="data-[state=active]:bg-placebo-gold data-[state=active]:text-placebo-black"
            >
              {t("forBuyers")}
            </TabsTrigger>
            <TabsTrigger
              value="businesses"
              className="data-[state=active]:bg-placebo-gold data-[state=active]:text-placebo-black"
            >
              {t("forBusinesses")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sellers">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.sellers.map((service, index) => (
                <ServiceCard key={index} {...service} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="buyers">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.buyers.map((service, index) => (
                <ServiceCard key={index} {...service} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="businesses">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.businesses.map((service, index) => (
                <ServiceCard key={index} {...service} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}

interface ServiceCardProps {
  title: string
  description: string
}

function ServiceCard({ title, description }: ServiceCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md border-gray-200 bg-placebo-white">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-placebo-gold" />
          <CardTitle className="text-lg text-placebo-black">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-placebo-dark-gray">{description}</CardDescription>
      </CardContent>
    </Card>
  )
}
