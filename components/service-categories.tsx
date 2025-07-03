"use client"

import { useLanguage } from "@/contexts/language-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Search,
  DollarSign,
  FileCheck,
  Camera,
  Shield,
  MessageSquare,
  CreditCard,
  BarChart,
  Globe,
  PenTool,
  Smartphone,
} from "lucide-react"

export default function ServiceCategories() {
  const { t, language } = useLanguage()

  const serviceCategories = [
    {
      id: "sellers",
      title: t("forSellers"),
      description:
        language === "en"
          ? "Comprehensive services to help you sell your vehicle quickly and at the best price."
          : "あなたの車を素早く最高の価格で売るためのトータルサポート。",
      services: [
        {
          icon: <DollarSign className="h-6 w-6 text-placebo-gold" />,
          title: language === "en" ? "Vehicle Appraisal" : "車両査定",
          description:
            language === "en"
              ? "Get a fair market value assessment for your vehicle based on condition, mileage, and local market trends."
              : "状態、走行距離、地域市場の傾向に基づいて、あなたの車の公正な市場価値評価を取得します。",
        },
        {
          icon: <Shield className="h-6 w-6 text-placebo-gold" />,
          title: language === "en" ? "Seller Verification" : "販売者認証",
          description:
            language === "en"
              ? "Build trust with buyers through our KYC verification process and inspection badge program."
              : "当社のKYC認証プロセスと検査バッジプログラムを通じて、買い手との信頼を構築します。",
        },
        {
          icon: <Camera className="h-6 w-6 text-placebo-gold" />,
          title: language === "en" ? "Professional Photography" : "プロフェッショナル写真撮影",
          description:
            language === "en"
              ? "High-quality vehicle photography service to make your listing stand out from the competition."
              : "あなたのリスティングを競合から際立たせるための高品質な車両写真サービス。",
        },
        {
          icon: <FileCheck className="h-6 w-6 text-placebo-gold" />,
          title: language === "en" ? "Paperwork Handling" : "書類手続き",
          description:
            language === "en"
              ? "Complete support with title transfers, export documentation, and legal requirements."
              : "名義変更、輸出書類、法的要件に関する完全なサポート。",
        },
      ],
    },
    {
      id: "buyers",
      title: t("forBuyers"),
      description:
        language === "en"
          ? "Find your perfect vehicle with confidence through our buyer-focused services."
          : "買い手に焦点を当てたサービスを通じて、自信を持って理想の車を見つけましょう。",
      services: [
        {
          icon: <Search className="h-6 w-6 text-placebo-gold" />,
          title: language === "en" ? "Vehicle Sourcing" : "車両調達",
          description:
            language === "en"
              ? "Let us find your dream car based on your specific requirements and preferences."
              : "あなたの特定の要件と好みに基づいて、夢の車を見つけるお手伝いをします。",
        },
        {
          icon: <Shield className="h-6 w-6 text-placebo-gold" />,
          title: language === "en" ? "Pre-Purchase Inspection" : "購入前検査",
          description:
            language === "en"
              ? "Comprehensive vehicle inspection service to ensure you're making a sound investment."
              : "あなたが健全な投資をしていることを確認するための包括的な車両検査サービス。",
        },
        {
          icon: <MessageSquare className="h-6 w-6 text-placebo-gold" />,
          title: language === "en" ? "Bilingual Negotiation" : "バイリンガル交渉",
          description:
            language === "en"
              ? "English and Japanese negotiation support to help you get the best deal possible."
              : "最良の取引を得るためのサポートとして、英語と日本語の交渉サポート。",
        },
        {
          icon: <CreditCard className="h-6 w-6 text-placebo-gold" />,
          title: language === "en" ? "Financing Assistance" : "資金調達支援",
          description:
            language === "en"
              ? "Connect with our financing partners for competitive rates and flexible payment options."
              : "競争力のあるレートと柔軟な支払いオプションについて、当社の資金調達パートナーとつながります。",
        },
      ],
    },
    {
      id: "businesses",
      title: t("forBusinesses"),
      description:
        language === "en"
          ? "Specialized marketing and automotive solutions for dealerships and related businesses."
          : "ディーラーや関連企業向けの専門的なマーケティングと自動車ソリューション。",
      services: [
        {
          icon: <Globe className="h-6 w-6 text-placebo-gold" />,
          title: language === "en" ? "Web Development" : "ウェブ開発",
          description:
            language === "en"
              ? "Custom website design and development specifically for automotive businesses."
              : "自動車ビジネス向けのカスタムウェブサイトデザインと開発。",
        },
        {
          icon: <BarChart className="h-6 w-6 text-placebo-gold" />,
          title: language === "en" ? "Digital Marketing" : "デジタルマーケティング",
          description:
            language === "en"
              ? "Targeted campaigns, SEO, and social media strategies to grow your automotive business."
              : "あなたの自動車ビジネスを成長させるためのターゲットを絞ったキャンペーン、SEO、ソーシャルメディア戦略。",
        },
        {
          icon: <PenTool className="h-6 w-6 text-placebo-gold" />,
          title: language === "en" ? "Branding Services" : "ブランディングサービス",
          description:
            language === "en"
              ? "Comprehensive branding solutions to help your business stand out in the competitive market."
              : "競争の激しい市場であなたのビジネスを際立たせるための包括的なブランディングソリューション。",
        },
        {
          icon: <Smartphone className="h-6 w-6 text-placebo-gold" />,
          title: language === "en" ? "Inventory Management" : "在庫管理",
          description:
            language === "en"
              ? "Custom software solutions for efficient inventory tracking and management."
              : "効率的な在庫追跡と管理のためのカスタムソフトウェアソリューション。",
        },
      ],
    },
  ]

  return (
    <section id="service-categories" className="bg-gray-50 py-16">
      <div className="container">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-placebo-black">{t("ourServices")}</h2>
          <p className="mt-4 text-placebo-dark-gray max-w-2xl mx-auto">
            {language === "en"
              ? "Placebo Marketing offers specialized services tailored to the unique needs of the Okinawa automotive market."
              : "プラセボマーケティングは、沖縄の自動車市場の独自のニーズに合わせた専門サービスを提供しています。"}
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

          {serviceCategories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-placebo-black">{category.title}</h3>
                <p className="mt-2 text-placebo-dark-gray">{category.description}</p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {category.services.map((service, index) => (
                  <Card
                    key={index}
                    className="overflow-hidden transition-all hover:shadow-md border-gray-200 bg-placebo-white h-full"
                  >
                    <CardHeader className="pb-2">
                      <div className="mb-2">{service.icon}</div>
                      <CardTitle className="text-lg text-placebo-black">{service.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-placebo-dark-gray">{service.description}</CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-8 text-center">
                <Button asChild className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90">
                  <Link href={`/services/${category.id}`}>
                    {language === "en"
                      ? `View All ${category.title} Services`
                      : `すべての${category.title}サービスを見る`}
                  </Link>
                </Button>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}
