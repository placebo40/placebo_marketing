"use client"
import { useState } from "react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  CreditCard,
  TrendingDown,
  Shield,
  Users,
  Calculator,
  FileText,
  AlertCircle,
  CheckCircle,
  Star,
  Info,
} from "lucide-react"

export default function FinancingPage() {
  const { language } = useLanguage()
  const [selectedSegment, setSelectedSegment] = useState<"military" | "civilian" | "japanese">("military")

  const militaryLenders = [
    {
      name: "Navy Federal Credit Union",
      rate: "3.84%",
      originalRate: "4.09%",
      discount: "0.25% with direct deposit",
      features: ["100% financing available", "Military discounts", "Okinawa branch location"],
      popular: true,
    },
    {
      name: "Pentagon Federal Credit Union",
      rate: "3.79%",
      features: ["Car buying service discount", "Military-focused", "Competitive rates"],
      note: "Car buying service not available overseas",
    },
    {
      name: "USAA",
      rate: "4.09%",
      originalRate: "4.34%",
      discount: "0.25% with autopay",
      features: ["Military exclusive", "Autopay discount", "Comprehensive services"],
      note: "Limitations on Japanese imports",
    },
    {
      name: "Community Bank (DoD)",
      rate: "4.59%",
      usedRate: "4.99%",
      features: ["New car: 4.59%", "Used car: 4.99%", "Motorcycle: 7.23%"],
      note: "Serves military installations",
    },
  ]

  const civilianLenders = [
    {
      name: "Suruga Bank",
      rate: "6.0% - 12.0%",
      features: ["¥100,000 - ¥3,000,000", "Up to 10 years", "No permanent residency required"],
      popular: true,
      note: "Support plan for foreigners",
    },
    {
      name: "SMBC Trust Bank",
      rate: "2.52%",
      features: ["Home equity loans", "Up to ¥20,000,000", "Multiple use purposes"],
      note: "Can be used for vehicle purchases",
    },
  ]

  const specializedLenders = [
    {
      name: "AK Kogyo",
      rate: "1% per month",
      features: ["SOFA status exclusive", "6-36 month terms", "Any vehicle/dealer", "Special ordering"],
      note: "Flat commission rate",
    },
  ]

  const japaneseLenders = [
    {
      name: "MUFG Bank",
      rate: "1.5% - 4.5%",
      features: ["Major bank reliability", "Branch network", "Online applications", "Flexible terms"],
      popular: true,
      note: "Mitsubishi UFJ Financial Group",
    },
    {
      name: "Mizuho Bank",
      rate: "1.8% - 4.2%",
      features: ["Competitive rates", "Quick approval", "Multiple payment options", "Insurance packages"],
      note: "One of Japan's largest banks",
    },
    {
      name: "SMBC (Sumitomo Mitsui)",
      rate: "1.7% - 4.0%",
      features: ["Low rates for good credit", "Digital banking", "Comprehensive services", "Dealer partnerships"],
      note: "Extensive dealer network",
    },
    {
      name: "JA Bank (Agricultural Co-op)",
      rate: "1.2% - 3.8%",
      features: ["Lowest rates available", "Member benefits", "Local community focus", "Flexible terms"],
      popular: true,
      note: "Best rates for members",
    },
    {
      name: "Shinkin Banks (Credit Unions)",
      rate: "1.5% - 3.5%",
      features: ["Community-based", "Personal service", "Competitive rates", "Local expertise"],
      note: "Regional credit unions",
    },
    {
      name: "Dealer Financing",
      rate: "0% - 6.0%",
      features: ["Promotional 0% rates", "Instant approval", "No bank visits", "Manufacturer incentives"],
      note: "Varies by manufacturer and promotion",
    },
  ]

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-placebo-black text-placebo-white py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <CreditCard className="h-10 w-10 text-placebo-gold" />
              <h1 className="text-3xl md:text-4xl font-bold">
                {language === "en" ? "Vehicle Financing in Okinawa" : "沖縄での車両融資"}
              </h1>
            </div>
            <p className="text-lg md:text-xl text-gray-300 mb-8">
              {language === "en"
                ? "Navigate Okinawa's unique financing landscape with competitive rates for military personnel and civilians"
                : "軍関係者と民間人向けの競争力のある金利で、沖縄独特の融資環境をナビゲート"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90">
                <Calculator className="mr-2 h-5 w-5" />
                {language === "en" ? "Get Financing Quote" : "融資見積もりを取得"}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-placebo-gold text-placebo-gold bg-placebo-black/20 hover:bg-placebo-gold hover:text-placebo-black hover:border-placebo-gold"
              >
                <FileText className="mr-2 h-5 w-5" />
                {language === "en" ? "Documentation Guide" : "書類ガイド"}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="container py-16">
        <div className="max-w-6xl mx-auto">
          {/* Market Overview */}
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-placebo-black mb-4">
              {language === "en" ? "Okinawa's Unique Financing Market" : "沖縄独特の融資市場"}
            </h2>
            <p className="text-lg text-placebo-dark-gray max-w-3xl mx-auto">
              {language === "en"
                ? "Okinawa's automotive financing combines Japanese civilian banking with specialized U.S. military credit unions, creating diverse options with competitive rates."
                : "沖縄の自動車融資は、日本の民間銀行と専門的な米軍信用組合を組み合わせ、競争力のある金利で多様な選択肢を提供しています。"}
            </p>
          </div>

          {/* Segment Selection */}
          <div className="mb-12">
            <Tabs
              value={selectedSegment}
              onValueChange={(value) => setSelectedSegment(value as "military" | "civilian" | "japanese")}
            >
              <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto">
                <TabsTrigger value="military" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  {language === "en" ? "Military" : "軍関係者"}
                </TabsTrigger>
                <TabsTrigger value="civilian" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {language === "en" ? "Foreign Civilian" : "外国人民間"}
                </TabsTrigger>
                <TabsTrigger value="japanese" className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  {language === "en" ? "Japanese Resident" : "日本居住者"}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="military" className="mt-8">
                {/* Military Financing Options */}
                <div className="space-y-8">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-placebo-black mb-2">
                      {language === "en" ? "Military Credit Union Rates" : "軍事信用組合金利"}
                    </h3>
                    <p className="text-placebo-dark-gray">
                      {language === "en"
                        ? "Exclusive rates and benefits for U.S. military personnel and families"
                        : "米軍関係者とその家族向けの特別金利と特典"}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {militaryLenders.map((lender, index) => (
                      <Card
                        key={index}
                        className={`relative ${lender.popular ? "border-2 border-placebo-gold bg-placebo-gold/5" : "border-gray-200"}`}
                      >
                        {lender.popular && (
                          <Badge className="absolute -top-3 left-4 bg-placebo-gold text-placebo-black">
                            <Star className="h-3 w-3 mr-1" />
                            {language === "en" ? "Most Popular" : "最も人気"}
                          </Badge>
                        )}
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <span className="text-lg">{lender.name}</span>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-placebo-gold">{lender.rate}</div>
                              {lender.originalRate && (
                                <div className="text-sm text-gray-500 line-through">{lender.originalRate}</div>
                              )}
                            </div>
                          </CardTitle>
                          {lender.discount && (
                            <CardDescription className="text-green-600 font-medium">{lender.discount}</CardDescription>
                          )}
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2 mb-4">
                            {lender.features.map((feature, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-sm">
                                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                          {lender.note && (
                            <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                              <Info className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                              <p className="text-sm text-blue-700">{lender.note}</p>
                            </div>
                          )}
                          {lender.usedRate && (
                            <div className="mt-3 text-sm text-placebo-dark-gray">
                              <strong>Used vehicles:</strong> {lender.usedRate} APR
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Specialized Military Financing */}
                  <div className="mt-12">
                    <h4 className="text-lg font-bold text-placebo-black mb-4">
                      {language === "en" ? "Specialized Military Financing" : "専門軍事融資"}
                    </h4>
                    <div className="grid grid-cols-1 gap-6">
                      {specializedLenders.map((lender, index) => (
                        <Card key={index} className="border-orange-200 bg-orange-50">
                          <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                              <span className="text-lg">{lender.name}</span>
                              <div className="text-2xl font-bold text-orange-600">{lender.rate}</div>
                            </CardTitle>
                            <CardDescription>{lender.note}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {lender.features.map((feature, idx) => (
                                <li key={idx} className="flex items-center gap-2 text-sm">
                                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="civilian" className="mt-8">
                {/* Civilian Financing Options */}
                <div className="space-y-8">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-placebo-black mb-2">
                      {language === "en" ? "Japanese Bank & International Options" : "日本の銀行・国際オプション"}
                    </h3>
                    <p className="text-placebo-dark-gray">
                      {language === "en"
                        ? "Financing options for Japanese residents and international civilians"
                        : "日本居住者と国際民間人向けの融資オプション"}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {civilianLenders.map((lender, index) => (
                      <Card
                        key={index}
                        className={`relative ${lender.popular ? "border-2 border-placebo-gold bg-placebo-gold/5" : "border-gray-200"}`}
                      >
                        {lender.popular && (
                          <Badge className="absolute -top-3 left-4 bg-placebo-gold text-placebo-black">
                            <Star className="h-3 w-3 mr-1" />
                            {language === "en" ? "Foreigner Friendly" : "外国人対応"}
                          </Badge>
                        )}
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <span className="text-lg">{lender.name}</span>
                            <div className="text-2xl font-bold text-placebo-gold">{lender.rate}</div>
                          </CardTitle>
                          {lender.note && (
                            <CardDescription className="text-blue-600 font-medium">{lender.note}</CardDescription>
                          )}
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {lender.features.map((feature, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-sm">
                                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Rate Comparison Alert */}
                  <Card className="border-yellow-200 bg-yellow-50">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <TrendingDown className="h-6 w-6 text-yellow-600 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-yellow-800 mb-2">
                            {language === "en" ? "Rate Advantage for Military Personnel" : "軍関係者の金利優遇"}
                          </h4>
                          <p className="text-sm text-yellow-700">
                            {language === "en"
                              ? "Military personnel typically access rates 2-4 percentage points lower than civilian alternatives due to government backing and lower default risk."
                              : "軍関係者は政府保証と低いデフォルトリスクにより、通常民間人より2-4パーセントポイント低い金利にアクセスできます。"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="japanese" className="mt-8">
                {/* Japanese Financing Options */}
                <div className="space-y-8">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-placebo-black mb-2">
                      {language === "en" ? "Japanese Banking & Credit Options" : "日本の銀行・信用オプション"}
                    </h3>
                    <p className="text-placebo-dark-gray">
                      {language === "en"
                        ? "Comprehensive financing options for Japanese residents with competitive rates and flexible terms"
                        : "競争力のある金利と柔軟な条件で日本居住者向けの包括的な融資オプション"}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {japaneseLenders.map((lender, index) => (
                      <Card
                        key={index}
                        className={`relative ${lender.popular ? "border-2 border-placebo-gold bg-placebo-gold/5" : "border-gray-200"}`}
                      >
                        {lender.popular && (
                          <Badge className="absolute -top-3 left-4 bg-placebo-gold text-placebo-black">
                            <Star className="h-3 w-3 mr-1" />
                            {language === "en" ? "Best Rates" : "最良金利"}
                          </Badge>
                        )}
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <span className="text-lg">{lender.name}</span>
                            <div className="text-2xl font-bold text-placebo-gold">{lender.rate}</div>
                          </CardTitle>
                          {lender.note && (
                            <CardDescription className="text-blue-600 font-medium">{lender.note}</CardDescription>
                          )}
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {lender.features.map((feature, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-sm">
                                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Japanese Advantages */}
                  <Card className="border-green-200 bg-green-50">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-green-800 mb-2">
                            {language === "en" ? "Advantages for Japanese Residents" : "日本居住者の利点"}
                          </h4>
                          <ul className="text-sm text-green-700 space-y-1">
                            <li>
                              •{" "}
                              {language === "en"
                                ? "Access to the lowest interest rates (1.2% - 4.5%)"
                                : "最低金利へのアクセス（1.2% - 4.5%）"}
                            </li>
                            <li>
                              •{" "}
                              {language === "en"
                                ? "Extensive branch networks and local support"
                                : "広範囲な支店ネットワークと地域サポート"}
                            </li>
                            <li>
                              •{" "}
                              {language === "en"
                                ? "Promotional 0% financing from dealers"
                                : "ディーラーからの0%プロモーション融資"}
                            </li>
                            <li>
                              • {language === "en" ? "Simplified documentation process" : "簡素化された書類手続き"}
                            </li>
                            <li>
                              •{" "}
                              {language === "en"
                                ? "Integration with Japanese credit systems"
                                : "日本の信用システムとの統合"}
                            </li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Documentation Requirements */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-placebo-black mb-6 text-center">
              {language === "en" ? "Documentation Requirements" : "必要書類"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Military Documentation */}
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-800">
                    <Shield className="h-5 w-5" />
                    {language === "en" ? "Military Personnel (SOFA)" : "軍関係者（SOFA）"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      {language === "en" ? "Picture ID and SOFA driver's license" : "写真付きIDとSOFA運転免許証"}
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      {language === "en" ? "Military orders (first vehicle)" : "軍事命令書（初回車両）"}
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      {language === "en" ? "30-day waiver from JSVRO" : "JSVROからの30日間免除"}
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      {language === "en" ? "Letter of Attorney (JSVRO stamped)" : "委任状（JSVRO押印）"}
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Civilian Documentation */}
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <Users className="h-5 w-5" />
                    {language === "en" ? "Civilian Residents" : "民間居住者"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      {language === "en" ? "Valid ID and residence proof" : "有効なIDと居住証明"}
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      {language === "en" ? "Proof of income" : "収入証明"}
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      {language === "en" ? "Bank statements (3 months)" : "銀行明細書（3ヶ月分）"}
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      {language === "en" ? "Employment verification" : "雇用証明"}
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Japanese Documentation */}
              <Card className="border-purple-200 bg-purple-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-800">
                    <Star className="h-5 w-5" />
                    {language === "en" ? "Japanese Residents" : "日本居住者"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      {language === "en" ? "Japanese driver's license" : "日本の運転免許証"}
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      {language === "en" ? "Resident registration (Juminhyo)" : "住民登録（住民票）"}
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      {language === "en" ? "Income certificate (Shotoku Shomeisho)" : "所得証明書"}
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      {language === "en" ? "Bank account and seal (Hanko)" : "銀行口座と印鑑"}
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Insurance Requirements */}
          <Card className="mb-12 border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-800">
                <AlertCircle className="h-5 w-5" />
                {language === "en" ? "Required Insurance Coverage" : "必要保険カバレッジ"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-semibold text-red-800 mb-2">
                    {language === "en" ? "Japanese Compulsory Insurance (JCI)" : "日本強制保険（JCI）"}
                  </h4>
                  <p className="text-sm text-red-700">
                    {language === "en" ? "Cash payment only - cannot be financed" : "現金支払いのみ - 融資不可"}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-red-800 mb-2">
                    {language === "en" ? "Personal Liability Insurance (PLI)" : "個人賠償責任保険（PLI）"}
                  </h4>
                  <p className="text-sm text-red-700">
                    {language === "en"
                      ? "Minimum ¥30,000,000 coverage - can be financed"
                      : "最低3,000万円カバレッジ - 融資可能"}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-red-800 mb-2">
                    {language === "en" ? "Property Damage Insurance (PDI)" : "物損保険（PDI）"}
                  </h4>
                  <p className="text-sm text-red-700">
                    {language === "en" ? "Required for SOFA-registered vehicles" : "SOFA登録車両に必要"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-placebo-black mb-6 text-center">
              {language === "en" ? "Frequently Asked Questions" : "よくある質問"}
            </h3>

            <Accordion type="single" collapsible className="max-w-4xl mx-auto">
              <AccordionItem value="rates">
                <AccordionTrigger>
                  {language === "en" ? "Why are military rates so much lower?" : "なぜ軍事金利はそんなに低いのですか？"}
                </AccordionTrigger>
                <AccordionContent>
                  {language === "en"
                    ? "Military credit unions offer lower rates due to government backing, lower default risk among military borrowers, and their non-profit status. They also compete specifically for military business, leading to more competitive rates."
                    : "軍事信用組合は政府保証、軍事借り手の低いデフォルトリスク、非営利ステータスにより低金利を提供します。また、軍事ビジネスに特化して競争するため、より競争力のある金利になります。"}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="currency">
                <AccordionTrigger>
                  {language === "en"
                    ? "How do currency fluctuations affect my loan?"
                    : "通貨変動はローンにどう影響しますか？"}
                </AccordionTrigger>
                <AccordionContent>
                  {language === "en"
                    ? "If you're paid in USD but have a yen-denominated loan, currency fluctuations can affect your payment amounts. Military personnel paid in USD have seen increased purchasing power recently due to yen weakness, but should consider potential currency risk."
                    : "USD給与で円建てローンの場合、通貨変動が支払額に影響します。USD給与の軍関係者は円安により購買力が向上していますが、潜在的な通貨リスクを考慮すべきです。"}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="sofa">
                <AccordionTrigger>
                  {language === "en"
                    ? "What is SOFA status and how does it help?"
                    : "SOFAステータスとは何で、どう役立ちますか？"}
                </AccordionTrigger>
                <AccordionContent>
                  {language === "en"
                    ? "SOFA (Status of Forces Agreement) grants special privileges to U.S. military personnel in Japan, including access to military credit unions, special vehicle registration processes, and exemptions from certain Japanese regulations."
                    : "SOFA（地位協定）は在日米軍関係者に特別特権を付与し、軍事信用組合へのアクセス、特別車両登録プロセス、特定の日本規制からの免除を含みます。"}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="civilian-options">
                <AccordionTrigger>
                  {language === "en"
                    ? "What options do civilians have for better rates?"
                    : "民間人がより良い金利を得る選択肢は？"}
                </AccordionTrigger>
                <AccordionContent>
                  {language === "en"
                    ? "Civilians can explore Suruga Bank's foreigner support program, consider home equity loans from SMBC Trust Bank, or look into international banking relationships. Building a strong credit history in Japan also helps secure better rates over time."
                    : "民間人はスルガ銀行の外国人サポートプログラム、SMBC信託銀行の住宅担保ローン、国際銀行関係を検討できます。日本での信用履歴構築も時間をかけてより良い金利確保に役立ちます。"}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* CTA Section */}
        </div>
      </div>{" "}
      {/* End of container */}
      {/* CTA Section */}
      <section className="py-16 bg-placebo-black text-placebo-white">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">
              {language === "en" ? "Ready to Get Financing?" : "融資を受ける準備はできましたか？"}
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              {language === "en"
                ? "Get personalized financing quotes from multiple lenders and find the best rates for your situation."
                : "複数の貸し手から個別の融資見積もりを取得し、あなたの状況に最適な金利を見つけてください。"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90">
                <CreditCard className="mr-2 h-5 w-5" />
                {language === "en" ? "Get Financing Quote" : "融資見積もりを取得"}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-placebo-gold text-placebo-gold bg-placebo-black/20 hover:bg-placebo-gold hover:text-placebo-black hover:border-placebo-gold"
                asChild
              >
                <Link href="/contact">
                  <FileText className="mr-2 h-5 w-5" />
                  {language === "en" ? "Speak with Expert" : "専門家と相談"}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
