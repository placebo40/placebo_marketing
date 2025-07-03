"use client"

import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Check, X, Calculator, Star } from "lucide-react"
import Link from "next/link"

export default function PricingPage() {
  const { language } = useLanguage()
  const [isAnnual, setIsAnnual] = useState(false)
  const [listingsCount, setListingsCount] = useState([25])

  const plans = [
    {
      id: "guest",
      name: language === "en" ? "Guest User" : "ゲストユーザー",
      price: 0,
      period: language === "en" ? "Free" : "無料",
      description: language === "en" ? "Perfect for occasional sellers" : "たまに売る方に最適",
      features: [
        { name: language === "en" ? "1 vehicle at a time" : "同時に1台まで", included: true },
        { name: language === "en" ? "2 requests per year" : "年間2回まで", included: true },
        { name: language === "en" ? "Basic support" : "基本サポート", included: true },
        { name: language === "en" ? "Compliance monitoring" : "コンプライアンス監視", included: true },
        { name: language === "en" ? "Professional photos" : "プロ写真撮影", included: false },
        { name: language === "en" ? "Priority listing" : "優先掲載", included: false },
        { name: language === "en" ? "Advanced analytics" : "高度な分析", included: false },
      ],
      cta: language === "en" ? "Get Started" : "始める",
      popular: false,
      color: "border-gray-200",
      buttonStyle: "outline",
    },
    {
      id: "private",
      name: language === "en" ? "Private Seller" : "個人販売者",
      price: 3980,
      period: language === "en" ? "One-time" : "一回払い",
      description: language === "en" ? "For serious individual sellers" : "本格的な個人販売者向け",
      features: [
        { name: language === "en" ? "2 vehicles at a time" : "同時に2台まで", included: true },
        { name: language === "en" ? "2 sales per year" : "年間2回まで", included: true },
        { name: language === "en" ? "Priority support" : "優先サポート", included: true },
        { name: language === "en" ? "Advanced compliance tools" : "高度なコンプライアンスツール", included: true },
        { name: language === "en" ? "Professional photos" : "プロ写真撮影", included: true },
        { name: language === "en" ? "Priority listing" : "優先掲載", included: true },
        { name: language === "en" ? "Advanced analytics" : "高度な分析", included: false },
      ],
      cta: language === "en" ? "Upgrade Now" : "今すぐアップグレード",
      popular: true,
      color: "border-placebo-gold",
      buttonStyle: "default",
    },
    {
      id: "starter",
      name: language === "en" ? "Dealer Starter" : "ディーラー スターター",
      price: isAnnual ? 7020 : 7800,
      originalPrice: isAnnual ? 7800 : null,
      period: language === "en" ? "/month" : "/月",
      description: language === "en" ? "Perfect for small dealerships" : "小規模ディーラー向け",
      features: [
        { name: language === "en" ? "Up to 15 listings" : "最大15台まで", included: true },
        { name: language === "en" ? "Unlimited sales" : "販売数無制限", included: true },
        { name: language === "en" ? "Dedicated support" : "専用サポート", included: true },
        { name: language === "en" ? "Full compliance suite" : "完全コンプライアンススイート", included: true },
        { name: language === "en" ? "Professional photos" : "プロ写真撮影", included: true },
        { name: language === "en" ? "Priority listing" : "優先掲載", included: true },
        { name: language === "en" ? "Advanced analytics" : "高度な分析", included: true },
      ],
      cta: language === "en" ? "Start Free Trial" : "無料トライアル開始",
      popular: false,
      color: "border-blue-200",
      buttonStyle: "outline",
      trial: language === "en" ? "14-day free trial" : "14日間無料トライアル",
    },
    {
      id: "professional",
      name: language === "en" ? "Dealer Professional" : "ディーラー プロフェッショナル",
      price: isAnnual ? 14220 : 15800,
      originalPrice: isAnnual ? 15800 : null,
      period: language === "en" ? "/month" : "/月",
      description: language === "en" ? "For established dealerships" : "確立されたディーラー向け",
      features: [
        { name: language === "en" ? "Up to 50 listings" : "最大50台まで", included: true },
        { name: language === "en" ? "Unlimited sales" : "販売数無制限", included: true },
        { name: language === "en" ? "Premium support" : "プレミアムサポート", included: true },
        { name: language === "en" ? "Full compliance suite" : "完全コンプライアンススイート", included: true },
        { name: language === "en" ? "Professional photos" : "プロ写真撮影", included: true },
        { name: language === "en" ? "Priority listing" : "優先掲載", included: true },
        { name: language === "en" ? "Advanced analytics" : "高度な分析", included: true },
      ],
      cta: language === "en" ? "Start Free Trial" : "無料トライアル開始",
      popular: false,
      color: "border-purple-200",
      buttonStyle: "outline",
      trial: language === "en" ? "14-day free trial" : "14日間無料トライアル",
    },
    {
      id: "enterprise",
      name: language === "en" ? "Dealer Enterprise" : "ディーラー エンタープライズ",
      price: isAnnual ? 22320 : 24800,
      originalPrice: isAnnual ? 24800 : null,
      period: language === "en" ? "/month" : "/月",
      description: language === "en" ? "For large dealership networks" : "大規模ディーラーネットワーク向け",
      features: [
        { name: language === "en" ? "Unlimited listings" : "無制限掲載", included: true },
        { name: language === "en" ? "Unlimited sales" : "販売数無制限", included: true },
        { name: language === "en" ? "White-glove support" : "ホワイトグローブサポート", included: true },
        { name: language === "en" ? "Full compliance suite" : "完全コンプライアンススイート", included: true },
        { name: language === "en" ? "Professional photos" : "プロ写真撮影", included: true },
        { name: language === "en" ? "Priority listing" : "優先掲載", included: true },
        { name: language === "en" ? "Advanced analytics" : "高度な分析", included: true },
      ],
      cta: language === "en" ? "Contact Sales" : "営業に連絡",
      popular: false,
      color: "border-placebo-gold",
      buttonStyle: "default",
      trial: language === "en" ? "30-day free trial" : "30日間無料トライアル",
    },
  ]

  const calculateCostPerListing = (plan: any, listings: number) => {
    if (plan.id === "guest" || plan.id === "private") return null
    return Math.round(plan.price / listings)
  }

  const getRecommendedPlan = (listings: number) => {
    if (listings <= 15) return "starter"
    if (listings <= 50) return "professional"
    return "enterprise"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-placebo-black text-placebo-white py-16">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {language === "en" ? "Simple, Transparent Pricing" : "シンプルで透明な料金体系"}
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              {language === "en"
                ? "Choose the perfect plan for your vehicle selling needs. All plans include compliance monitoring and professional support."
                : "あなたの車両販売ニーズに最適なプランをお選びください。すべてのプランにコンプライアンス監視とプロフェッショナルサポートが含まれています。"}
            </p>

            {/* Annual/Monthly Toggle */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className={`text-sm ${!isAnnual ? "text-placebo-gold" : "text-gray-400"}`}>
                {language === "en" ? "Monthly" : "月額"}
              </span>
              <Switch
                checked={isAnnual}
                onCheckedChange={setIsAnnual}
                className="data-[state=checked]:bg-placebo-gold data-[state=unchecked]:bg-gray-600 data-[state=checked]:border-placebo-gold data-[state=unchecked]:border-gray-600"
              />
              <span className={`text-sm ${isAnnual ? "text-placebo-gold" : "text-gray-400"}`}>
                {language === "en" ? "Annual" : "年額"}
              </span>
              {isAnnual && (
                <Badge variant="secondary" className="bg-placebo-gold text-placebo-black">
                  {language === "en" ? "Save 10%" : "10%お得"}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative ${plan.color} ${plan.popular ? "ring-2 ring-placebo-gold" : ""}`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-placebo-gold text-placebo-black">
                    <Star className="w-3 h-3 mr-1" />
                    {language === "en" ? "Most Popular" : "人気No.1"}
                  </Badge>
                )}

                <CardHeader className="text-center">
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>

                  <div className="mt-4">
                    <div className="flex items-baseline justify-center">
                      {plan.originalPrice && (
                        <span className="text-sm text-gray-500 line-through mr-2">
                          ¥{plan.originalPrice.toLocaleString()}
                        </span>
                      )}
                      <span className="text-3xl font-bold">¥{plan.price.toLocaleString()}</span>
                      <span className="text-sm text-gray-600 ml-1">{plan.period}</span>
                    </div>
                    {plan.trial && <p className="text-xs text-placebo-gold mt-1">{plan.trial}</p>}
                  </div>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        {feature.included ? (
                          <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        ) : (
                          <X className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                        )}
                        <span className={feature.included ? "" : "text-gray-500"}>{feature.name}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full ${plan.buttonStyle === "default" ? "bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90" : ""}`}
                    variant={plan.buttonStyle as any}
                    asChild
                  >
                    <Link
                      href={plan.id === "guest" ? "/request-listing" : plan.id === "private" ? "/signup" : "/contact"}
                    >
                      {plan.cta}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Cost Calculator */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Calculator className="w-12 h-12 text-placebo-gold mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">
                {language === "en" ? "Find Your Perfect Plan" : "最適なプランを見つける"}
              </h2>
              <p className="text-gray-600">
                {language === "en"
                  ? "Use our calculator to determine the most cost-effective plan for your listing volume."
                  : "計算機を使用して、あなたの掲載数に最もコスト効率の良いプランを決定してください。"}
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">
                  {language === "en"
                    ? "How many vehicles do you plan to list monthly?"
                    : "月に何台の車両を掲載予定ですか？"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm text-gray-600">
                        {language === "en" ? "Monthly Listings" : "月間掲載数"}
                      </span>
                      <span className="text-2xl font-bold text-placebo-gold">
                        {listingsCount[0]} {language === "en" ? "vehicles" : "台"}
                      </span>
                    </div>
                    <Slider
                      value={listingsCount}
                      onValueChange={setListingsCount}
                      max={100}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  {/* Recommendation Summary */}
                  <div className="bg-placebo-gold/10 border border-placebo-gold/20 rounded-lg p-6">
                    <div className="text-center mb-4">
                      <h3 className="text-xl font-bold text-placebo-gold mb-2">
                        {language === "en" ? "🎯 Perfect Plan for You" : "🎯 あなたに最適なプラン"}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {language === "en"
                          ? `Based on ${listingsCount[0]} monthly listings, here's our recommendation:`
                          : `月間${listingsCount[0]}台の掲載に基づく、おすすめプランです：`}
                      </p>
                    </div>

                    {(() => {
                      const recommendedPlan = plans.find((p) => p.id === getRecommendedPlan(listingsCount[0]))
                      const costPerListing = calculateCostPerListing(recommendedPlan, listingsCount[0])

                      return (
                        <div className="text-center">
                          <div className="bg-white rounded-lg p-4 mb-4">
                            <h4 className="text-lg font-bold text-placebo-black mb-1">{recommendedPlan?.name}</h4>
                            <div className="text-2xl font-bold text-placebo-gold mb-2">
                              ¥{recommendedPlan?.price.toLocaleString()}/month
                            </div>
                            {costPerListing && (
                              <div className="text-sm text-gray-600">
                                {language === "en" ? "Only" : "わずか"} ¥{costPerListing.toLocaleString()}{" "}
                                {language === "en" ? "per listing" : "1台あたり"}
                              </div>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="bg-green-50 border border-green-200 rounded p-3">
                              <div className="font-semibold text-green-800 mb-1">
                                {language === "en" ? "✅ Perfect Fit Because:" : "✅ 最適な理由："}
                              </div>
                              <div className="text-green-700">
                                {listingsCount[0] <= 15
                                  ? language === "en"
                                    ? "Covers all your listings with room to grow"
                                    : "すべての掲載をカバーし、成長の余地があります"
                                  : listingsCount[0] <= 50
                                    ? language === "en"
                                      ? "Ideal capacity for your listing volume"
                                      : "あなたの掲載数に理想的な容量"
                                    : language === "en"
                                      ? "Unlimited listings for maximum flexibility"
                                      : "最大限の柔軟性のための無制限掲載"}
                              </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded p-3">
                              <div className="font-semibold text-blue-800 mb-1">
                                {language === "en" ? "💰 Annual Savings:" : "💰 年間節約額："}
                              </div>
                              <div className="text-blue-700">
                                {isAnnual
                                  ? `¥${((recommendedPlan?.price || 0) * 1.2 - (recommendedPlan?.price || 0)).toLocaleString()}/year`
                                  : language === "en"
                                    ? "Switch to annual for 10% off!"
                                    : "年額に切り替えて10%オフ！"}
                              </div>
                            </div>
                          </div>

                          <Button
                            size="lg"
                            className="mt-4 bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90"
                            asChild
                          >
                            <Link href={recommendedPlan?.id === "enterprise" ? "/contact" : "/signup"}>
                              {language === "en"
                                ? `Start with ${recommendedPlan?.name}`
                                : `${recommendedPlan?.name}で開始`}
                            </Link>
                          </Button>
                        </div>
                      )
                    })()}
                  </div>

                  {/* Plan Comparison for Current Volume */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4 text-center">
                      {language === "en" ? "All Dealer Plans Comparison" : "全ディーラープラン比較"}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {plans
                        .filter((p) => p.id.includes("dealer"))
                        .map((plan) => {
                          const costPerListing = calculateCostPerListing(plan, listingsCount[0])
                          const isRecommended = getRecommendedPlan(listingsCount[0]) === plan.id
                          const canHandle =
                            plan.id === "enterprise" ||
                            (plan.id === "starter" && listingsCount[0] <= 15) ||
                            (plan.id === "professional" && listingsCount[0] <= 50)

                          return (
                            <Card
                              key={plan.id}
                              className={`${isRecommended ? "ring-2 ring-placebo-gold bg-placebo-gold/5" : ""} ${!canHandle ? "opacity-60" : ""}`}
                            >
                              <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                                  {isRecommended && (
                                    <Badge className="bg-placebo-gold text-placebo-black text-xs">
                                      {language === "en" ? "Best Choice" : "ベストチョイス"}
                                    </Badge>
                                  )}
                                  {!canHandle && (
                                    <Badge variant="secondary" className="text-xs">
                                      {language === "en" ? "Too Small" : "容量不足"}
                                    </Badge>
                                  )}
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">
                                      {language === "en" ? "Monthly Cost" : "月額費用"}
                                    </span>
                                    <span className="font-semibold">¥{plan.price.toLocaleString()}</span>
                                  </div>
                                  {costPerListing && canHandle && (
                                    <div className="flex justify-between">
                                      <span className="text-sm text-gray-600">
                                        {language === "en" ? "Cost per Listing" : "1台あたりの費用"}
                                      </span>
                                      <span className="font-semibold text-placebo-gold">
                                        ¥{costPerListing.toLocaleString()}
                                      </span>
                                    </div>
                                  )}
                                  <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">
                                      {language === "en" ? "Capacity" : "容量"}
                                    </span>
                                    <span className="text-sm font-medium">
                                      {plan.id === "starter" ? "15" : plan.id === "professional" ? "50" : "∞"}
                                      {language === "en" ? " listings" : " 台"}
                                    </span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )
                        })}
                    </div>
                  </div>

                  {/* Usage Warning */}
                  {listingsCount[0] > 50 && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <div className="text-orange-600 mr-3">⚠️</div>
                        <div>
                          <h4 className="font-semibold text-orange-800 mb-1">
                            {language === "en" ? "High Volume Detected" : "大量掲載が検出されました"}
                          </h4>
                          <p className="text-sm text-orange-700">
                            {language === "en"
                              ? "With this many listings, you'll need our Enterprise plan for unlimited capacity. Contact our sales team for volume discounts and custom solutions."
                              : "この掲載数では、無制限容量のエンタープライズプランが必要です。ボリューム割引とカスタムソリューションについては営業チームにお問い合わせください。"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{language === "en" ? "Compare All Features" : "全機能を比較"}</h2>
            <p className="text-gray-600">
              {language === "en"
                ? "See exactly what's included in each plan to make the best choice for your business."
                : "各プランに含まれる内容を正確に確認して、あなたのビジネスに最適な選択をしてください。"}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-semibold">{language === "en" ? "Features" : "機能"}</th>
                  {plans.map((plan) => (
                    <th key={plan.id} className="text-center p-4 font-semibold min-w-[120px]">
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    name: language === "en" ? "Simultaneous Listings" : "同時掲載数",
                    values: ["1", "2", "15", "50", "Unlimited"],
                  },
                  {
                    name: language === "en" ? "Annual Sales Limit" : "年間販売制限",
                    values: ["2", "2", "Unlimited", "Unlimited", "Unlimited"],
                  },
                  {
                    name: language === "en" ? "Professional Photos" : "プロ写真撮影",
                    values: [false, true, true, true, true],
                  },
                  {
                    name: language === "en" ? "Priority Listing" : "優先掲載",
                    values: [false, true, true, true, true],
                  },
                  {
                    name: language === "en" ? "Advanced Analytics" : "高度な分析",
                    values: [false, false, true, true, true],
                  },
                  {
                    name: language === "en" ? "Support Level" : "サポートレベル",
                    values: ["Basic", "Priority", "Dedicated", "Premium", "White-glove"],
                  },
                ].map((feature, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">{feature.name}</td>
                    {feature.values.map((value, planIndex) => (
                      <td key={planIndex} className="p-4 text-center">
                        {typeof value === "boolean" ? (
                          value ? (
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-gray-400 mx-auto" />
                          )
                        ) : (
                          <span className="text-sm">{value}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                {language === "en" ? "Frequently Asked Questions" : "よくある質問"}
              </h2>
            </div>

            <div className="space-y-6">
              {[
                {
                  q: language === "en" ? "Can I change my plan anytime?" : "いつでもプランを変更できますか？",
                  a:
                    language === "en"
                      ? "Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the next billing cycle."
                      : "はい、いつでもプランをアップグレードまたはダウングレードできます。変更は次の請求サイクルから有効になります。",
                },
                {
                  q:
                    language === "en"
                      ? "What happens if I exceed my listing limit?"
                      : "掲載制限を超えた場合はどうなりますか？",
                  a:
                    language === "en"
                      ? "We'll notify you when approaching your limit and help you upgrade to a suitable plan. No listings will be removed without notice."
                      : "制限に近づいた際にお知らせし、適切なプランへのアップグレードをサポートします。予告なしに掲載が削除されることはありません。",
                },
                {
                  q:
                    language === "en"
                      ? "Is there a setup fee for dealer accounts?"
                      : "ディーラーアカウントに初期費用はありますか？",
                  a:
                    language === "en"
                      ? "No setup fees! All dealer plans include free onboarding and account setup assistance."
                      : "初期費用はありません！すべてのディーラープランには無料のオンボーディングとアカウント設定サポートが含まれています。",
                },
                {
                  q:
                    language === "en"
                      ? "Can I cancel my subscription anytime?"
                      : "いつでもサブスクリプションをキャンセルできますか？",
                  a:
                    language === "en"
                      ? "Yes, you can cancel anytime. Your account will remain active until the end of your current billing period."
                      : "はい、いつでもキャンセルできます。現在の請求期間の終了まで、アカウントはアクティブのままです。",
                },
              ].map((faq, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.q}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{faq.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-placebo-black text-placebo-white">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">
              {language === "en" ? "Ready to Get Started?" : "始める準備はできましたか？"}
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              {language === "en"
                ? "Join thousands of satisfied sellers who trust Placebo Marketing with their vehicle sales."
                : "車両販売をPlacebo Marketingに信頼する何千もの満足した販売者に参加してください。"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90" asChild>
                <Link href="/signup">{language === "en" ? "Start Free Trial" : "無料トライアル開始"}</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-placebo-white text-placebo-white hover:bg-placebo-white hover:text-placebo-black bg-transparent"
                asChild
              >
                <Link href="/contact">{language === "en" ? "Contact Sales" : "営業に連絡"}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
