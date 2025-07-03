"use client"

import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  CheckCircle,
  Clock,
  FileText,
  Users,
  Car,
  TrendingUp,
  Calculator,
  Search,
  Phone,
  Mail,
  Star,
  AlertCircle,
  ArrowRight,
  Target,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"

export default function AppraisalInfoPage() {
  const { language } = useLanguage()
  const [showAppraisalGuide, setShowAppraisalGuide] = useState(false)
  const router = useRouter()

  const appraisalTypes = [
    {
      id: "basic",
      name: language === "en" ? "Basic Appraisal" : "基本鑑定",
      price: "¥15,000",
      duration: language === "en" ? "1-2 business days" : "1-2営業日",
      icon: FileText,
      color: "blue",
      features: [
        language === "en" ? "Visual exterior and interior inspection" : "外装・内装の目視検査",
        language === "en" ? "Current market value assessment" : "現在の市場価値評価",
        language === "en" ? "Basic condition report" : "基本状態レポート",
        language === "en" ? "Digital certificate of appraisal" : "デジタル鑑定証明書",
        language === "en" ? "Comparable sales analysis" : "類似販売分析",
      ],
      bestFor: [
        language === "en" ? "Insurance claims" : "保険請求",
        language === "en" ? "Quick market value check" : "迅速な市場価値確認",
        language === "en" ? "Estate planning" : "相続計画",
        language === "en" ? "Divorce proceedings" : "離婚手続き",
      ],
    },
    {
      id: "comprehensive",
      name: language === "en" ? "Comprehensive Appraisal" : "包括的鑑定",
      price: "¥35,000",
      duration: language === "en" ? "2-3 business days" : "2-3営業日",
      icon: Search,
      color: "green",
      features: [
        language === "en" ? "Everything in Basic Appraisal" : "基本鑑定のすべて",
        language === "en" ? "Detailed mechanical inspection" : "詳細な機械検査",
        language === "en" ? "Engine and transmission assessment" : "エンジン・トランスミッション評価",
        language === "en" ? "Professional photography (20+ photos)" : "プロ写真撮影（20枚以上）",
        language === "en" ? "Comprehensive market analysis" : "包括的市場分析",
        language === "en" ? "Maintenance recommendations" : "メンテナンス推奨事項",
        language === "en" ? "Certified appraisal document" : "認定鑑定書",
      ],
      bestFor: [
        language === "en" ? "Vehicle purchase decisions" : "車両購入決定",
        language === "en" ? "Financing and loans" : "融資・ローン",
        language === "en" ? "Legal proceedings" : "法的手続き",
        language === "en" ? "High-value vehicles" : "高価値車両",
      ],
    },
    {
      id: "pre-sale",
      name: language === "en" ? "Pre-Sale Package" : "売却前パッケージ",
      price: "¥50,000",
      duration: language === "en" ? "3-5 business days" : "3-5営業日",
      icon: TrendingUp,
      color: "gold",
      features: [
        language === "en" ? "Everything in Comprehensive Appraisal" : "包括的鑑定のすべて",
        language === "en" ? "Strategic pricing recommendations" : "戦略的価格推奨",
        language === "en" ? "Marketing strategy consultation" : "マーケティング戦略コンサルテーション",
        language === "en" ? "Professional listing photography" : "プロ出品写真撮影",
        language === "en" ? "Condition improvement suggestions" : "状態改善提案",
        language === "en" ? "Sales timeline optimization" : "販売タイムライン最適化",
        language === "en" ? "Ongoing sales support" : "継続的販売サポート",
      ],
      bestFor: [
        language === "en" ? "Maximizing sale value" : "売却価値最大化",
        language === "en" ? "Quick sale requirements" : "迅速売却要件",
        language === "en" ? "First-time sellers" : "初回売却者",
        language === "en" ? "Premium vehicles" : "プレミアム車両",
      ],
    },
  ]

  const processSteps = [
    {
      step: 1,
      title: language === "en" ? "Request Submission" : "依頼提出",
      description:
        language === "en"
          ? "Submit your appraisal request with vehicle details and preferences"
          : "車両詳細と希望を含む鑑定依頼を提出",
      icon: FileText,
      duration: language === "en" ? "5 minutes" : "5分",
    },
    {
      step: 2,
      title: language === "en" ? "Appraiser Assignment" : "鑑定士割り当て",
      description:
        language === "en"
          ? "Certified appraiser reviews your request and contacts you within 24 hours"
          : "認定鑑定士が依頼を確認し、24時間以内にご連絡",
      icon: Users,
      duration: language === "en" ? "24 hours" : "24時間",
    },
    {
      step: 3,
      title: language === "en" ? "Inspection Scheduling" : "検査スケジュール",
      description:
        language === "en"
          ? "Schedule convenient time and location for vehicle inspection"
          : "車両検査の便利な時間と場所をスケジュール",
      icon: Clock,
      duration: language === "en" ? "1-3 days" : "1-3日",
    },
    {
      step: 4,
      title: language === "en" ? "Professional Inspection" : "プロ検査",
      description:
        language === "en"
          ? "Thorough inspection conducted by certified automotive appraiser"
          : "認定自動車鑑定士による徹底的な検査を実施",
      icon: Search,
      duration: language === "en" ? "1-3 hours" : "1-3時間",
    },
    {
      step: 5,
      title: language === "en" ? "Report Generation" : "レポート作成",
      description:
        language === "en"
          ? "Detailed appraisal report prepared with findings and valuation"
          : "調査結果と評価を含む詳細な鑑定レポートを作成",
      icon: Calculator,
      duration: language === "en" ? "1-2 days" : "1-2日",
    },
    {
      step: 6,
      title: language === "en" ? "Report Delivery" : "レポート配信",
      description:
        language === "en"
          ? "Receive certified appraisal report and consultation if needed"
          : "認定鑑定レポートを受領し、必要に応じてコンサルテーション",
      icon: Mail,
      duration: language === "en" ? "Same day" : "当日",
    },
  ]

  const faqs = [
    {
      question: language === "en" ? "What is a vehicle appraisal?" : "車両鑑定とは何ですか？",
      answer:
        language === "en"
          ? "A vehicle appraisal is a professional assessment of a vehicle's current market value, condition, and characteristics performed by a certified automotive appraiser. It provides an unbiased, expert opinion of what your vehicle is worth in the current market."
          : "車両鑑定とは、認定自動車鑑定士が行う車両の現在の市場価値、状態、特性の専門的評価です。現在の市場におけるあなたの車両の価値について、偏見のない専門的な意見を提供します。",
    },
    {
      question: language === "en" ? "Why do I need a professional appraisal?" : "なぜプロの鑑定が必要ですか？",
      answer:
        language === "en"
          ? "Professional appraisals are essential for insurance claims, legal proceedings, financing, estate planning, and making informed buying or selling decisions. They provide legally recognized documentation of your vehicle's value and condition."
          : "プロの鑑定は、保険請求、法的手続き、融資、相続計画、そして情報に基づいた売買決定に不可欠です。車両の価値と状態について法的に認められた文書を提供します。",
    },
    {
      question: language === "en" ? "How accurate are your appraisals?" : "鑑定の精度はどの程度ですか？",
      answer:
        language === "en"
          ? "Our appraisals are highly accurate, typically within 5-10% of actual market value. We use current market data, comparable sales, and our appraisers' extensive experience to ensure precision. All appraisals are backed by our accuracy guarantee."
          : "当社の鑑定は非常に正確で、通常は実際の市場価値の5-10%以内です。現在の市場データ、類似販売、そして鑑定士の豊富な経験を使用して精度を確保しています。すべての鑑定は精度保証に裏付けられています。",
    },
    {
      question: language === "en" ? "Are your appraisers certified?" : "鑑定士は認定されていますか？",
      answer:
        language === "en"
          ? "Yes, all our appraisers are certified by recognized automotive appraisal organizations and have extensive experience in the Japanese automotive market. They undergo continuous training to stay current with market trends and valuation methods."
          : "はい、当社の鑑定士はすべて認定された自動車鑑定組織によって認定されており、日本の自動車市場で豊富な経験を持っています。市場動向と評価方法に精通するため、継続的な研修を受けています。",
    },
    {
      question: language === "en" ? "How long does an appraisal take?" : "鑑定にはどのくらい時間がかかりますか？",
      answer:
        language === "en"
          ? "The timeline depends on the appraisal type: Basic (1-2 business days), Comprehensive (2-3 business days), Pre-Sale Package (3-5 business days). Rush services are available for urgent needs with additional fees."
          : "タイムラインは鑑定タイプによって異なります：基本（1-2営業日）、包括的（2-3営業日）、売却前パッケージ（3-5営業日）。緊急のニーズには追加料金で迅速サービスが利用可能です。",
    },
    {
      question: language === "en" ? "What areas do you serve?" : "どの地域でサービスを提供していますか？",
      answer:
        language === "en"
          ? "We provide appraisal services throughout Okinawa and surrounding areas. For locations outside our standard service area, additional travel fees may apply. Contact us to confirm service availability in your area."
          : "沖縄県全域および周辺地域で鑑定サービスを提供しています。標準サービスエリア外の場所については、追加の出張費が適用される場合があります。お住まいの地域でのサービス提供について確認するためにお問い合わせください。",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-placebo-black to-placebo-dark-gray text-white py-16">
        <div className="container max-w-6xl">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="bg-placebo-gold/20 p-4 rounded-full">
                <Shield className="h-12 w-12 text-placebo-gold" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {language === "en" ? "Professional Vehicle Appraisals" : "プロ車両鑑定"}
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              {language === "en"
                ? "Get accurate, certified vehicle valuations from Okinawa's most trusted automotive appraisers. Whether for insurance, legal, or sales purposes, we provide the expertise you need."
                : "沖縄で最も信頼される自動車鑑定士から正確で認定された車両評価を取得。保険、法的、または販売目的のいずれであっても、必要な専門知識を提供します。"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90"
                onClick={() => setShowAppraisalGuide(true)}
              >
                <Car className="h-5 w-5 mr-2" />
                {language === "en" ? "Request Appraisal" : "鑑定を依頼"}
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-placebo-white text-placebo-white bg-transparent hover:bg-placebo-white hover:text-placebo-black transition-colors"
              >
                <Link href="/contact">
                  <Phone className="h-5 w-5 mr-2" />
                  {language === "en" ? "Speak with Expert" : "専門家と話す"}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-6xl py-12">
        {/* Why Choose Professional Appraisal */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-placebo-black mb-4">
              {language === "en" ? "Why Choose Professional Appraisal?" : "なぜプロの鑑定を選ぶのか？"}
            </h2>
            <p className="text-placebo-dark-gray max-w-3xl mx-auto">
              {language === "en"
                ? "Professional vehicle appraisals provide accurate, legally recognized valuations that protect your interests and ensure fair transactions."
                : "プロの車両鑑定は、あなたの利益を保護し、公正な取引を確保する正確で法的に認められた評価を提供します。"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                title: language === "en" ? "Legal Protection" : "法的保護",
                description:
                  language === "en"
                    ? "Certified appraisals provide legal documentation for insurance, court, and financial purposes"
                    : "認定鑑定は保険、裁判、金融目的の法的文書を提供",
              },
              {
                icon: Target,
                title: language === "en" ? "Accurate Valuation" : "正確な評価",
                description:
                  language === "en"
                    ? "Expert analysis using current market data and comparable sales for precise valuations"
                    : "現在の市場データと類似販売を使用した専門分析による正確な評価",
              },
              {
                icon: TrendingUp,
                title: language === "en" ? "Market Insights" : "市場洞察",
                description:
                  language === "en"
                    ? "Comprehensive market analysis helps you understand your vehicle's position and potential"
                    : "包括的市場分析により、車両のポジションと可能性を理解",
              },
              {
                icon: CheckCircle,
                title: language === "en" ? "Peace of Mind" : "安心感",
                description:
                  language === "en"
                    ? "Professional expertise ensures you make informed decisions with confidence"
                    : "プロの専門知識により、自信を持って情報に基づいた決定を下せる",
              },
            ].map((benefit, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="bg-placebo-gold/10 p-3 rounded-full w-fit mx-auto mb-4">
                    <benefit.icon className="h-6 w-6 text-placebo-gold" />
                  </div>
                  <h3 className="font-semibold text-placebo-black mb-2">{benefit.title}</h3>
                  <p className="text-sm text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Appraisal Types */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-placebo-black mb-4">
              {language === "en" ? "Choose Your Appraisal Type" : "鑑定タイプを選択"}
            </h2>
            <p className="text-placebo-dark-gray max-w-3xl mx-auto">
              {language === "en"
                ? "We offer three comprehensive appraisal packages designed to meet different needs and budgets."
                : "異なるニーズと予算に対応するよう設計された3つの包括的鑑定パッケージを提供しています。"}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {appraisalTypes.map((type, index) => {
              const IconComponent = type.icon
              return (
                <Card
                  key={type.id}
                  className={`relative ${type.id === "comprehensive" ? "border-placebo-gold shadow-lg scale-105" : ""}`}
                >
                  {type.id === "comprehensive" && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-placebo-gold text-placebo-black">
                        {language === "en" ? "Most Popular" : "最も人気"}
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <div className={`bg-${type.color}-100 p-3 rounded-full w-fit mx-auto mb-4`}>
                      <IconComponent className={`h-8 w-8 text-${type.color}-600`} />
                    </div>
                    <CardTitle className="text-xl">{type.name}</CardTitle>
                    <div className="text-3xl font-bold text-placebo-gold">{type.price}</div>
                    <CardDescription>{type.duration}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold mb-3">{language === "en" ? "Includes:" : "含まれるもの："}</h4>
                        <ul className="space-y-2">
                          {type.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">{language === "en" ? "Best for:" : "最適な用途："}</h4>
                        <ul className="space-y-1">
                          {type.bestFor.map((use, idx) => (
                            <li key={idx} className="text-sm text-gray-600">
                              • {use}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* The Appraisal Process */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-placebo-black mb-4">
              {language === "en" ? "Our Appraisal Process" : "鑑定プロセス"}
            </h2>
            <p className="text-placebo-dark-gray max-w-3xl mx-auto">
              {language === "en"
                ? "Our streamlined process ensures accurate, efficient appraisals with minimal disruption to your schedule."
                : "合理化されたプロセスにより、スケジュールへの影響を最小限に抑えながら、正確で効率的な鑑定を確保します。"}
            </p>
          </div>

          <div className="space-y-8">
            {processSteps.map((step, index) => {
              const IconComponent = step.icon
              return (
                <div key={step.step} className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="bg-placebo-gold text-placebo-black rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
                      {step.step}
                    </div>
                  </div>
                  <Card className="flex-1">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <IconComponent className="h-6 w-6 text-placebo-gold" />
                          <h3 className="text-xl font-semibold text-placebo-black">{step.title}</h3>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {step.duration}
                        </Badge>
                      </div>
                      <p className="text-gray-600">{step.description}</p>
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>
        </section>

        {/* Pricing and Additional Services */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-placebo-black mb-4">
              {language === "en" ? "Additional Services & Pricing" : "追加サービスと料金"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-placebo-gold" />
                  {language === "en" ? "Rush Services" : "緊急サービス"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>{language === "en" ? "Expedited (2-3 days faster)" : "迅速（2-3日短縮）"}</span>
                    <Badge>+¥5,000</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>{language === "en" ? "Rush (24-hour turnaround)" : "緊急（24時間対応）"}</span>
                    <Badge>+¥15,000</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-placebo-gold" />
                  {language === "en" ? "Optional Add-ons" : "オプション追加"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>{language === "en" ? "Professional Photography" : "プロ写真撮影"}</span>
                    <Badge>+¥8,000</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>{language === "en" ? "Vehicle History Report" : "車両履歴レポート"}</span>
                    <Badge>+¥3,000</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>{language === "en" ? "Market Analysis Report" : "市場分析レポート"}</span>
                    <Badge>+¥5,000</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>{language === "en" ? "Sales Consultation" : "販売コンサルテーション"}</span>
                    <Badge>+¥10,000</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-placebo-black mb-4">
              {language === "en" ? "Frequently Asked Questions" : "よくある質問"}
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-placebo-black mb-3 flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-placebo-gold mt-0.5 flex-shrink-0" />
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 leading-relaxed pl-7">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <Card className="bg-gradient-to-br from-placebo-gold/10 to-yellow-100 border-placebo-gold">
            <CardContent className="py-12">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold text-placebo-black mb-4">
                  {language === "en" ? "Ready to Get Your Vehicle Appraised?" : "車両鑑定の準備はできましたか？"}
                </h2>
                <p className="text-placebo-dark-gray mb-8 text-lg">
                  {language === "en"
                    ? "Join hundreds of satisfied customers who trust our certified appraisers for accurate, professional vehicle valuations."
                    : "正確でプロフェッショナルな車両評価のために当社の認定鑑定士を信頼する数百人の満足した顧客に加わりましょう。"}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90"
                    onClick={() => setShowAppraisalGuide(true)}
                  >
                    <Car className="h-5 w-5 mr-2" />
                    {language === "en" ? "Request Appraisal Now" : "今すぐ鑑定を依頼"}
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link href="/contact">
                      <Phone className="h-5 w-5 mr-2" />
                      {language === "en" ? "Speak with Expert" : "専門家と話す"}
                    </Link>
                  </Button>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  {language === "en"
                    ? "Free consultation • No obligation • Professional service guaranteed"
                    : "無料相談 • 義務なし • プロフェッショナルサービス保証"}
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
      {/* Appraisal Guide Modal */}
      <Dialog open={showAppraisalGuide} onOpenChange={setShowAppraisalGuide}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-placebo-gold" />
              {language === "en" ? "How to Request Vehicle Appraisal" : "車両鑑定の依頼方法"}
            </DialogTitle>
            <DialogDescription>
              {language === "en"
                ? "Follow these simple steps to request a professional appraisal for your listed vehicles."
                : "出品された車両のプロ鑑定を依頼するには、以下の簡単な手順に従ってください。"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  step: "1",
                  title: language === "en" ? "Go to Dashboard" : "ダッシュボードへ",
                  description:
                    language === "en"
                      ? "Visit your Guest Dashboard to see all your listed vehicles"
                      : "ゲストダッシュボードにアクセスして、出品されたすべての車両を確認",
                  icon: Car,
                },
                {
                  step: "2",
                  title: language === "en" ? "Find Your Vehicle" : "車両を見つける",
                  description:
                    language === "en"
                      ? "Locate the vehicle card you want to get appraised"
                      : "鑑定を受けたい車両カードを見つける",
                  icon: Search,
                },
                {
                  step: "3",
                  title: language === "en" ? "Click 'Request Appraisal'" : "「鑑定を依頼」をクリック",
                  description:
                    language === "en"
                      ? "Click the 'Request Appraisal' link in the financial summary section"
                      : "財務概要セクションの「鑑定を依頼」リンクをクリック",
                  icon: Shield,
                },
              ].map((step, index) => {
                const IconComponent = step.icon
                return (
                  <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="bg-placebo-gold text-placebo-black rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm mx-auto mb-3">
                      {step.step}
                    </div>
                    <IconComponent className="h-8 w-8 text-placebo-gold mx-auto mb-3" />
                    <h3 className="font-semibold text-placebo-black mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                )
              })}
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {language === "en" ? "Important Note:" : "重要な注意事項："}
              </h4>
              <p className="text-sm text-blue-700">
                {language === "en"
                  ? "You can only request appraisals for vehicles you have listed. If you haven't listed a vehicle yet, please submit a listing request first."
                  : "出品した車両のみ鑑定を依頼できます。まだ車両を出品していない場合は、まず出品依頼を提出してください。"}
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowAppraisalGuide(false)}>
                {language === "en" ? "Cancel" : "キャンセル"}
              </Button>
              <Button
                onClick={() => {
                  setShowAppraisalGuide(false)
                  router.push("/guest-dashboard")
                }}
                className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90"
              >
                <Car className="h-4 w-4 mr-2" />
                {language === "en" ? "Go to My Dashboard" : "ダッシュボードへ移動"}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
