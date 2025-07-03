"use client"

import { useLanguage } from "@/contexts/language-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle } from "lucide-react"
import Image from "next/image"

export default function ServiceDetails() {
  const { language } = useLanguage()

  const serviceDetails = [
    {
      id: "vehicle-marketing",
      title: language === "en" ? "Vehicle Marketing" : "車両マーケティング",
      description:
        language === "en"
          ? "Our comprehensive vehicle marketing services help sellers reach the right buyers quickly."
          : "当社の包括的な車両マーケティングサービスは、売り手が適切な買い手に素早くリーチするのを支援します。",
      image: "/images/car-consultation-outdoor.jpg",
      features: [
        language === "en"
          ? "Professional photography and listing creation"
          : "プロフェッショナルな写真撮影とリスティング作成",
        language === "en"
          ? "Targeted online and offline promotion"
          : "ターゲットを絞ったオンラインおよびオフラインのプロモーション",
        language === "en" ? "Bilingual listing in English and Japanese" : "英語と日本語のバイリンガルリスティング",
        language === "en" ? "Featured placement on our platform" : "当社のプラットフォームでの特集配置",
        language === "en"
          ? "Social media promotion to our network"
          : "当社のネットワークへのソーシャルメディアプロモーション",
        language === "en" ? "Detailed analytics and performance reports" : "詳細な分析とパフォーマンスレポート",
      ],
    },
    {
      id: "buyer-assistance",
      title: language === "en" ? "Buyer Assistance" : "購入者支援",
      description:
        language === "en"
          ? "We provide comprehensive support for buyers throughout the entire vehicle purchase process."
          : "車両購入プロセス全体を通じて、買い手に包括的なサポートを提供します。",
      image: "/images/diverse-car-buyers.jpg",
      features: [
        language === "en" ? "Personalized vehicle sourcing and recommendations" : "パーソナライズされた車両調達と推奨",
        language === "en" ? "Thorough inspection and condition reports" : "徹底的な検査と状態レポート",
        language === "en" ? "Test drive coordination and accompaniment" : "試乗の調整と同行",
        language === "en" ? "Price negotiation and deal structuring" : "価格交渉と取引構成",
        language === "en" ? "Paperwork and registration assistance" : "書類作成と登録支援",
        language === "en" ? "Post-purchase support and guidance" : "購入後のサポートとガイダンス",
      ],
    },
    {
      id: "business-solutions",
      title: language === "en" ? "Business Solutions" : "ビジネスソリューション",
      description:
        language === "en"
          ? "Specialized marketing and operational solutions for automotive businesses in Okinawa."
          : "沖縄の自動車ビジネス向けの専門的なマーケティングと運営ソリューション。",
      image: "/images/automotive-partnership.jpg",
      features: [
        language === "en" ? "Custom website development and maintenance" : "カスタムウェブサイト開発とメンテナンス",
        language === "en"
          ? "Digital marketing campaigns and SEO optimization"
          : "デジタルマーケティングキャンペーンとSEO最適化",
        language === "en" ? "Inventory management systems" : "在庫管理システム",
        language === "en" ? "Multilingual customer service solutions" : "多言語カスタマーサービスソリューション",
        language === "en" ? "Market analysis and competitive positioning" : "市場分析と競争力のあるポジショニング",
        language === "en" ? "Brand development and design services" : "ブランド開発とデザインサービス",
      ],
    },
  ]

  return (
    <section className="bg-placebo-white py-16">
      <div className="container">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-placebo-black">
            {language === "en" ? "Our Service Approach" : "サービスアプローチ"}
          </h2>
          <p className="mt-4 text-placebo-dark-gray max-w-2xl mx-auto">
            {language === "en"
              ? "Discover how our specialized services address the unique challenges of Okinawa's automotive market."
              : "当社の専門サービスが沖縄の自動車市場の独自の課題にどのように対応するかをご覧ください。"}
          </p>
        </div>

        <Tabs defaultValue="vehicle-marketing" className="w-full">
          <TabsList className="flex justify-center mb-8 bg-transparent">
            {serviceDetails.map((service) => (
              <TabsTrigger
                key={service.id}
                value={service.id}
                className="data-[state=active]:bg-placebo-gold data-[state=active]:text-placebo-black px-6"
              >
                {service.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {serviceDetails.map((service) => (
            <TabsContent key={service.id} value={service.id}>
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <div className="relative h-[300px] sm:h-[400px] lg:h-full rounded-lg overflow-hidden">
                  <Image
                    src={service.image || "/placeholder.svg"}
                    alt={service.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>

                <div>
                  <Card className="h-full border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-2xl text-placebo-black">{service.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <p className="text-placebo-dark-gray">{service.description}</p>

                      <div className="space-y-3">
                        <h4 className="font-medium text-placebo-black">
                          {language === "en" ? "Key Features" : "主な特徴"}
                        </h4>
                        <ul className="space-y-2">
                          {service.features.map((feature, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="h-5 w-5 text-placebo-gold shrink-0 mt-0.5" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}
