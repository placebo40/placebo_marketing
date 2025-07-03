"use client"

import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Shield, CheckCircle, Phone, Wrench, ArrowRight, Calendar, MessageCircle } from "lucide-react"
import Link from "next/link"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import InspectionBadge from "@/components/inspection-badge"

export default function InspectionServicesPage() {
  const { language } = useLanguage()
  const [selectedPlan, setSelectedPlan] = useState("comprehensive")
  const [showBookingModal, setShowBookingModal] = useState(false)

  const inspectionPlans = [
    {
      id: "basic",
      name: language === "en" ? "Basic Inspection" : "基本点検",
      price: "¥15,000",
      duration: language === "en" ? "1-2 hours" : "1-2時間",
      popular: false,
      features: [
        language === "en" ? "Visual exterior & interior inspection" : "外装・内装の目視点検",
        language === "en" ? "Engine bay examination" : "エンジンルーム検査",
        language === "en" ? "Basic safety systems check" : "基本安全システムチェック",
        language === "en" ? "Tire condition assessment" : "タイヤ状態評価",
        language === "en" ? "Digital inspection report" : "デジタル点検レポート",
        language === "en" ? "Verified badge for listing" : "リスティング認証バッジ",
      ],
      description:
        language === "en"
          ? "Essential inspection covering key safety and condition points"
          : "主要な安全性と状態をカバーする基本点検",
    },
    {
      id: "comprehensive",
      name: language === "en" ? "Comprehensive Inspection" : "総合点検",
      price: "¥25,000",
      duration: language === "en" ? "2-3 hours" : "2-3時間",
      popular: true,
      features: [
        language === "en" ? "Complete 50-point inspection" : "50項目完全点検",
        language === "en" ? "Engine performance diagnostics" : "エンジン性能診断",
        language === "en" ? "Brake system analysis" : "ブレーキシステム解析",
        language === "en" ? "Electrical system testing" : "電気系統テスト",
        language === "en" ? "Detailed photo documentation" : "詳細写真記録",
        language === "en" ? "Professional inspection report" : "プロ点検レポート",
        language === "en" ? "Maintenance recommendations" : "メンテナンス推奨事項",
        language === "en" ? "Verified badge for listing" : "リスティング認証バッジ",
      ],
      description:
        language === "en"
          ? "Thorough inspection with detailed analysis and recommendations"
          : "詳細な分析と推奨事項を含む徹底的な点検",
    },
    {
      id: "premium",
      name: language === "en" ? "Premium Inspection" : "プレミアム点検",
      price: "¥35,000",
      duration: language === "en" ? "3-4 hours" : "3-4時間",
      popular: false,
      features: [
        language === "en" ? "Comprehensive 75-point inspection" : "75項目総合点検",
        language === "en" ? "Advanced diagnostic scanning" : "高度診断スキャン",
        language === "en" ? "Road test evaluation" : "路上テスト評価",
        language === "en" ? "Paint thickness measurement" : "塗装厚測定",
        language === "en" ? "Undercarriage inspection" : "車体下部点検",
        language === "en" ? "Professional photography" : "プロ写真撮影",
        language === "en" ? "Detailed written report" : "詳細書面レポート",
        language === "en" ? "30-day inspection warranty" : "30日点検保証",
        language === "en" ? "Priority scheduling" : "優先スケジューリング",
        language === "en" ? "Verified badge for listing" : "リスティング認証バッジ",
      ],
      description:
        language === "en"
          ? "Complete professional inspection with warranty and priority service"
          : "保証と優先サービス付きの完全プロ点検",
    },
  ]

  const inspectionProcess = [
    {
      step: 1,
      title: language === "en" ? "List Your Vehicle" : "車両をリスト",
      description:
        language === "en"
          ? "Create your vehicle listing on our platform first"
          : "まずプラットフォームで車両リストを作成",
      icon: Calendar,
    },
    {
      step: 2,
      title: language === "en" ? "Schedule Appointment" : "予約スケジュール",
      description:
        language === "en"
          ? "Our team contacts you to schedule a convenient time"
          : "チームが連絡し、都合の良い時間を調整",
      icon: Phone,
    },
    {
      step: 3,
      title: language === "en" ? "Professional Inspection" : "プロ点検",
      description:
        language === "en"
          ? "Certified mechanic performs thorough vehicle inspection"
          : "認定メカニックが徹底的な車両点検を実施",
      icon: Wrench,
    },
    {
      step: 4,
      title: language === "en" ? "Receive Report & Badge" : "レポート・バッジ受領",
      description:
        language === "en"
          ? "Get detailed report and verified badge for your listing"
          : "詳細レポートとリスティング認証バッジを取得",
      icon: Shield,
    },
  ]

  const faqs = [
    {
      question: language === "en" ? "How long does an inspection take?" : "点検にはどのくらい時間がかかりますか？",
      answer:
        language === "en"
          ? "Inspection duration varies by plan: Basic (1-2 hours), Comprehensive (2-3 hours), Premium (3-4 hours). We'll provide an estimated timeframe when scheduling your appointment."
          : "点検時間はプランによって異なります：基本（1-2時間）、総合（2-3時間）、プレミアム（3-4時間）。予約時に推定時間をお知らせします。",
    },
    {
      question: language === "en" ? "Where do inspections take place?" : "点検はどこで行われますか？",
      answer:
        language === "en"
          ? "We offer flexible inspection locations including our certified service centers, your location, or a mutually convenient meeting point in Okinawa."
          : "認定サービスセンター、お客様の場所、または沖縄の相互に便利な場所など、柔軟な点検場所を提供しています。",
    },
    {
      question:
        language === "en"
          ? "What if my vehicle doesn't pass inspection?"
          : "車両が点検に合格しなかった場合はどうなりますか？",
      answer:
        language === "en"
          ? "We provide detailed reports on any issues found. You can address the concerns and request a re-inspection, or list the vehicle with full disclosure of its condition."
          : "発見された問題について詳細なレポートを提供します。問題に対処して再点検を依頼するか、状態を完全に開示して車両をリストできます。",
    },
    {
      question:
        language === "en"
          ? "Do you inspect both Japanese and Y-plate vehicles?"
          : "日本ナンバーとYナンバーの両方を点検しますか？",
      answer:
        language === "en"
          ? "Yes, our certified mechanics are experienced with both Japanese plate and Y-plate vehicles, understanding the unique requirements for SOFA personnel and Japanese residents."
          : "はい、認定メカニックは日本ナンバーとYナンバーの両方の車両に精通しており、SOFA関係者と日本居住者の独特な要件を理解しています。",
    },
    {
      question:
        language === "en"
          ? "How does the verified badge help sell my vehicle?"
          : "認証バッジは車両の販売にどのように役立ちますか？",
      answer:
        language === "en"
          ? "The verified badge builds buyer confidence by showing your vehicle has been professionally inspected. This typically leads to faster sales, higher offers, and reduced negotiation time."
          : "認証バッジは、車両がプロによって点検されたことを示すことで、買い手の信頼を築きます。これにより通常、より早い販売、より高いオファー、交渉時間の短縮につながります。",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-placebo-black via-placebo-dark-gray to-placebo-black text-white py-20">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-placebo-gold/20 p-4 rounded-full">
                <Shield className="h-12 w-12 text-placebo-gold" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {language === "en" ? "Professional Vehicle Inspections" : "プロ車両点検サービス"}
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
              {language === "en"
                ? "Build buyer confidence with certified inspections by vetted mechanics. Get your verified badge and sell faster."
                : "認定メカニックによる認証点検で買い手の信頼を築く。認証バッジを取得してより早く販売。"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90">
                <Link href="#pricing">
                  {language === "en" ? "View Pricing" : "料金を見る"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white hover:text-placebo-black"
              >
                <Link href="/contact">{language === "en" ? "Contact Us" : "お問い合わせ"}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section with Badge Examples */}

      {/* Pricing Section */}
      <section id="pricing" className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-placebo-black mb-4">
              {language === "en" ? "Inspection Service Plans" : "点検サービスプラン"}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {language === "en"
                ? "Choose the inspection level that best fits your vehicle and budget"
                : "お客様の車両と予算に最適な点検レベルをお選びください"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {inspectionPlans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative border-2 transition-all duration-300 ${
                  plan.popular
                    ? "border-placebo-gold shadow-xl scale-105"
                    : "border-gray-200 hover:border-placebo-gold/50"
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-placebo-gold text-placebo-black">
                    {language === "en" ? "Most Popular" : "最人気"}
                  </Badge>
                )}

                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <InspectionBadge
                      level={plan.id as "basic" | "comprehensive" | "premium"}
                      language={language}
                      size="lg"
                      iconOnly={true}
                    />
                  </div>
                  <h3 className="text-xl font-bold text-placebo-black mb-2">{plan.name}</h3>
                  <div className="mt-4">
                    <span className="text-3xl font-bold text-placebo-black">{plan.price}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">{plan.duration}</p>
                  <CardDescription className="mt-4">{plan.description}</CardDescription>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => setShowBookingModal(true)}
                    className={`w-full ${
                      plan.popular
                        ? "bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90"
                        : "bg-placebo-black text-white hover:bg-placebo-dark-gray"
                    }`}
                  >
                    {language === "en" ? "Book Inspection" : "点検予約"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-placebo-black mb-4">
              {language === "en" ? "How It Works" : "仕組み"}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {language === "en"
                ? "Simple 4-step process to get your vehicle professionally inspected"
                : "車両をプロに点検してもらう簡単な4ステップ"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {inspectionProcess.map((step, index) => (
              <div key={step.step} className="text-center">
                <div className="relative mb-6">
                  <div className="w-12 h-12 bg-placebo-gold rounded-full flex items-center justify-center mx-auto mb-4">
                    <step.icon className="h-6 w-6 text-placebo-black" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-placebo-black text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-placebo-black mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-placebo-black mb-4">
              {language === "en" ? "Frequently Asked Questions" : "よくある質問"}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {language === "en"
                ? "Get answers to common questions about our inspection services"
                : "点検サービスに関するよくある質問への回答"}
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border border-gray-200 rounded-lg px-6">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 pt-2">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-placebo-black text-white">
        <div className="container text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            {language === "en" ? "Ready to Get Your Vehicle Inspected?" : "車両点検の準備はできましたか？"}
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            {language === "en"
              ? "Join thousands of satisfied customers who trust our professional inspection services"
              : "当社のプロ点検サービスを信頼する何千人もの満足したお客様に参加"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90">
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault() /* Add live chat functionality here */
                }}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                {language === "en" ? "Start Live Chat" : "ライブチャット開始"}
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white hover:text-placebo-black"
            >
              <Link href="/vehicle-inspections-okinawa">
                {language === "en" ? "Learn About JCI Requirements" : "JCI要件について学ぶ"}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-placebo-black">
              {language === "en" ? "Ready to Book Your Inspection?" : "点検予約の準備はできましたか？"}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              {language === "en"
                ? "To book a professional vehicle inspection, you'll need to list your vehicle on our platform first. This helps us understand your vehicle details and provide the most accurate inspection service."
                : "プロの車両点検を予約するには、まずプラットフォームで車両をリストする必要があります。これにより、車両の詳細を理解し、最も正確な点検サービスを提供できます。"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-placebo-black mb-2">
                {language === "en" ? "Quick Process:" : "簡単なプロセス："}
              </h4>
              <ol className="text-sm text-gray-600 space-y-1">
                <li>{language === "en" ? "1. List your vehicle (free)" : "1. 車両をリスト（無料）"}</li>
                <li>{language === "en" ? "2. Request inspection service" : "2. 点検サービスを依頼"}</li>
                <li>{language === "en" ? "3. Professional inspection" : "3. プロによる点検"}</li>
                <li>{language === "en" ? "4. Get verified badge" : "4. 認証バッジを取得"}</li>
              </ol>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                asChild
                className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90"
                onClick={() => setShowBookingModal(false)}
              >
                <Link href="/request-listing">{language === "en" ? "List My Vehicle Now" : "今すぐ車両をリスト"}</Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="border-placebo-black text-placebo-black hover:bg-placebo-black hover:text-white bg-transparent"
                onClick={() => setShowBookingModal(false)}
              >
                <Link href="/guest-dashboard">
                  {language === "en" ? "I Already Have a Listing" : "すでにリストがあります"}
                </Link>
              </Button>

              <Button
                asChild
                variant="ghost"
                className="text-gray-600 hover:text-placebo-black"
                onClick={() => setShowBookingModal(false)}
              >
                <Link href="/contact">{language === "en" ? "Contact Us for Questions" : "質問はお問い合わせ"}</Link>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
