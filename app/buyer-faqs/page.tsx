"use client"

import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Link from "next/link"
import { ArrowLeft, HelpCircle, Search, CreditCard, FileCheck, Shield, MessageCircle, ExternalLink } from "lucide-react"

export default function BuyerFAQsPage() {
  const { language } = useLanguage()

  const faqCategories = [
    {
      icon: <Search className="h-6 w-6 text-placebo-gold" />,
      title: language === "en" ? "Finding Vehicles" : "車両検索",
      faqs: [
        {
          question:
            language === "en"
              ? "How do I search for vehicles on your platform?"
              : "プラットフォームで車両を検索するにはどうすればよいですか？",
          answer:
            language === "en"
              ? "You can search for vehicles using our advanced filter system on the Cars page. Filter by make, model, year, price range, mileage, location, and more. You can also save your searches and set up alerts for new listings that match your criteria."
              : "車両ページの高度なフィルターシステムを使用して車両を検索できます。メーカー、モデル、年式、価格帯、走行距離、場所などでフィルタリングできます。検索を保存し、条件に一致する新しいリスティングのアラートを設定することもできます。",
        },
        {
          question:
            language === "en"
              ? "What information is provided for each vehicle listing?"
              : "各車両リスティングにはどのような情報が提供されますか？",
          answer:
            language === "en"
              ? "Each listing includes detailed specifications, high-quality photos, vehicle history, condition reports, seller information, and pricing details. Verified listings also include professional inspection reports and additional documentation."
              : "各リスティングには、詳細な仕様、高品質な写真、車両履歴、状態レポート、販売者情報、価格詳細が含まれています。認証済みリスティングには、プロの検査レポートと追加書類も含まれています。",
        },
        {
          question: language === "en" ? "Can I schedule a test drive?" : "試乗の予約はできますか？",
          answer:
            language === "en"
              ? "Yes, you can request a test drive directly through the vehicle listing page. We'll coordinate with the seller to arrange a convenient time and location. For your safety, we recommend meeting in public places and bringing a valid driver's license."
              : "はい、車両リスティングページから直接試乗をリクエストします。売り手と調整して、便利な時間と場所を手配します。安全のため、公共の場所で会い、有効な運転免許証を持参することをお勧めします。",
        },
      ],
    },
    {
      icon: <CreditCard className="h-6 w-6 text-placebo-gold" />,
      title: language === "en" ? "Payment & Financing" : "支払いと融資",
      faqs: [
        {
          question:
            language === "en" ? "What payment methods do you accept?" : "どのような支払い方法を受け付けていますか？",
          answer:
            language === "en"
              ? "We accept bank transfers, certified checks, cash (for in-person transactions), and financing through our partner institutions. For high-value purchases, we use secure escrow services to protect both buyers and sellers."
              : "銀行振込、認証小切手、現金（対面取引の場合）、およびパートナー機関を通じた融資を受け付けています。高額購入の場合は、買い手と売り手の両方を保護するために安全なエスクローサービスを使用します。",
        },
        {
          question: language === "en" ? "Do you offer financing options?" : "融資オプションは提供していますか？",
          answer:
            language === "en"
              ? "Yes, we work with several financial institutions to offer competitive financing options. You can apply for pre-approval through our platform, and we'll help you find the best rates and terms for your situation."
              : "はい、複数の金融機関と協力して競争力のある融資オプションを提供しています。当社のプラットフォームを通じて事前承認を申請でき、お客様の状況に最適な金利と条件を見つけるお手伝いをします。",
        },
        {
          question: language === "en" ? "Is there buyer protection?" : "買い手保護はありますか？",
          answer:
            language === "en"
              ? "Yes, we offer buyer protection through our verification system, escrow services, and dispute resolution process. All verified sellers undergo background checks, and we provide mediation services for any issues that arise."
              : "はい、認証システム、エスクローサービス、紛争解決プロセスを通じて買い手保護を提供しています。すべての認証済み売り手は身元調査を受け、発生した問題に対して調停サービスを提供します。",
        },
      ],
    },
    {
      icon: <FileCheck className="h-6 w-6 text-placebo-gold" />,
      title: language === "en" ? "Documentation & Legal" : "書類と法的事項",
      faqs: [
        {
          question:
            language === "en"
              ? "What documents do I need to buy a vehicle?"
              : "車両を購入するのに必要な書類は何ですか？",
          answer:
            language === "en"
              ? "You'll need a valid driver's license, proof of insurance, and payment verification. For financing, additional documentation may be required. We'll guide you through the entire documentation process to ensure everything is completed correctly."
              : "有効な運転免許証、保険証明書、支払い確認書が必要です。融資の場合は、追加の書類が必要になる場合があります。すべてが正しく完了するよう、書類作成プロセス全体をガイドします。",
        },
        {
          question: language === "en" ? "Do you help with title transfers?" : "名義変更のお手伝いはしていますか？",
          answer:
            language === "en"
              ? "We provide complete assistance with title transfers, registration, and all necessary paperwork. Our team is familiar with both Japanese and U.S. military requirements for vehicle ownership transfers."
              : "もちろんです！名義変更、登録、必要な書類作成を完全にサポートします。当社のチームは、車両所有権移転に関する日本と米軍の両方の要件に精通しています。",
        },
        {
          question:
            language === "en"
              ? "Can you help with vehicle export procedures?"
              : "車両輸出手続きのお手伝いはできますか？",
          answer:
            language === "en"
              ? "Yes, we specialize in helping customers with vehicle export procedures, especially for military personnel. We handle all customs documentation, shipping arrangements, and compliance requirements for international vehicle transport."
              : "はい、特に軍関係者のお客様の車両輸出手続きを専門としています。国際車両輸送のための通関書類、配送手配、コンプライアンス要件をすべて処理します。",
        },
      ],
    },
    {
      icon: <Shield className="h-6 w-6 text-placebo-gold" />,
      title: language === "en" ? "Safety & Verification" : "安全性と認証",
      faqs: [
        {
          question: language === "en" ? "How do you verify sellers?" : "販売者をどのように認証していますか？",
          answer:
            language === "en"
              ? "All sellers undergo our KYC (Know Your Customer) verification process, which includes identity verification, background checks, and documentation review. Verified sellers receive a special badge on their listings."
              : "すべての売り手は、身元確認、身元調査、書類審査を含むKYC（顧客確認）認証プロセスを受けます。認証済み売り手は、リスティングに特別なバッジを受け取ります。",
        },
        {
          question:
            language === "en"
              ? "What should I look for when inspecting a vehicle?"
              : "車両を検査する際に何を確認すべきですか？",
          answer:
            language === "en"
              ? "Check the exterior and interior condition, test all electrical systems, inspect the engine and undercarriage, and verify all documentation. We also offer professional inspection services if you prefer an expert evaluation."
              : "外装と内装の状態を確認し、すべての電気系統をテストし、エンジンと車体下部を検査し、すべての書類を確認してください。専門家による評価をご希望の場合は、プロの検査サービスも提供しています。",
        },
        {
          question:
            language === "en"
              ? "What if I discover issues after purchase?"
              : "購入後に問題を発見した場合はどうなりますか？",
          answer:
            language === "en"
              ? "Contact our customer support team immediately. We offer dispute resolution services and will work with both parties to find a fair solution. For verified listings, additional protections may apply."
              : "すぐに当社のカスタマーサポートチームにお問い合わせください。紛争解決サービスを提供し、公正な解決策を見つけるために両当事者と協力します。認証済みリスティングの場合、追加の保護が適用される場合があります。",
        },
      ],
    },
    {
      icon: <Shield className="h-6 w-6 text-placebo-gold" />,
      title: language === "en" ? "Vehicle Inspections in Okinawa" : "沖縄の車両検査",
      faqs: [
        {
          question:
            language === "en"
              ? "What are the vehicle inspection requirements in Okinawa?"
              : "沖縄の車両検査要件は何ですか？",
          answer:
            language === "en"
              ? "Vehicle inspections in Okinawa follow Japan's rigorous Shaken (車検) system. New vehicles require inspection after 3 years, then every 2 years. The process differs for Japanese plates vs Y-plates (SOFA personnel), with different locations, costs, and procedures."
              : "沖縄の車両検査は日本の厳格な車検システムに従います。新車は3年後、その後は2年ごとに検査が必要です。日本ナンバーとYナンバー（SOFA関係者）では場所、費用、手続きが異なります。",
        },
        {
          question:
            language === "en"
              ? "How much does vehicle inspection cost in Okinawa?"
              : "沖縄での車両検査費用はいくらですか？",
          answer:
            language === "en"
              ? "Costs vary significantly: Japanese plate vehicles typically cost ¥60,000-¥140,000 ($400-$900), while Y-plate vehicles (SOFA personnel) have a flat $50 USD inspection fee plus taxes and insurance. The total cost depends on vehicle size, age, and required repairs."
              : "費用は大きく異なります：日本ナンバー車両は通常¥60,000-¥140,000（$400-$900）、Yナンバー車両（SOFA関係者）は一律$50 USDの検査料に税金と保険が加算されます。総費用は車両サイズ、年式、必要な修理によって決まります。",
        },
        {
          question:
            language === "en"
              ? "Where can I get my vehicle inspected in Okinawa?"
              : "沖縄で車両検査はどこで受けられますか？",
          answer:
            language === "en"
              ? "Japanese plate vehicles can be inspected at the government center in Urasoe City, authorized garages, or dealerships. Y-plate vehicles (SOFA personnel) must use the Joint Service Vehicle Registration Office (JSVRO) at Camp Butler/Foster or AAFES inspection lanes on military installations."
              : "日本ナンバー車両は浦添市の政府検査場、認定工場、またはディーラーで検査できます。Yナンバー車両（SOFA関係者）はキャンプバトラー/フォスターのJSVROまたは軍事施設のAAFES検査レーンを利用する必要があります。",
        },
      ],
    },
  ]

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-placebo-black text-placebo-white py-12">
        <div className="container">
          <Button
            variant="ghost"
            asChild
            className="mb-6 text-placebo-white hover:text-placebo-gold hover:bg-placebo-white/10"
          >
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              {language === "en" ? "Back to Home" : "ホームに戻る"}
            </Link>
          </Button>

          <div className="flex items-center gap-3 mb-4">
            <HelpCircle className="h-8 w-8 text-placebo-gold" />
            <h1 className="text-3xl font-bold">{language === "en" ? "Buyer FAQs" : "買い手よくある質問"}</h1>
          </div>
          <p className="text-gray-300">
            {language === "en"
              ? "Everything you need to know about buying vehicles through Placebo Marketing"
              : "プラセボマーケティングを通じて車両を購入するために知っておくべきすべてのこと"}
          </p>
        </div>
      </div>

      <div className="container py-16">
        <div className="max-w-4xl mx-auto">
          {/* Quick Help */}
          <div className="bg-placebo-white rounded-lg p-8 mb-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-placebo-black mb-4">
              {language === "en" ? "Need Immediate Help?" : "すぐにサポートが必要ですか？"}
            </h2>
            <p className="text-placebo-dark-gray mb-6">
              {language === "en"
                ? "Can't find what you're looking for? Our bilingual support team is here to help."
                : "お探しの情報が見つかりませんか？当社のバイリンガルサポートチームがお手伝いします。"}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90">
                <Link href="/contact">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  {language === "en" ? "Contact Support" : "サポートに連絡"}
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-placebo-gold text-placebo-gold hover:bg-placebo-gold hover:text-placebo-black"
              >
                <a href="tel:+8198XXXXXXX">{language === "en" ? "Call Us" : "お電話"}</a>
              </Button>
            </div>
          </div>

          {/* Vehicle Inspection Guide Highlight */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-4">
              <Shield className="h-8 w-8 text-blue-600 mt-1" />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-blue-900 mb-2">
                  {language === "en" ? "Complete Vehicle Inspection Guide" : "車両検査完全ガイド"}
                </h3>
                <p className="text-blue-800 mb-4">
                  {language === "en"
                    ? "Everything you need to know about Shaken inspections in Okinawa, including costs, locations, and procedures for both Japanese and Y-plate vehicles."
                    : "日本ナンバーとYナンバー車両の費用、場所、手続きを含む、沖縄での車検に関するすべての情報。"}
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                >
                  <Link href="/vehicle-inspections-okinawa" className="flex items-center gap-2">
                    {language === "en" ? "View Complete Guide" : "完全ガイドを見る"}
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* FAQ Categories */}
          <div className="space-y-8">
            {faqCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="bg-placebo-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 p-6 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    {category.icon}
                    <h3 className="text-xl font-semibold text-placebo-black">{category.title}</h3>
                  </div>
                </div>

                <div className="p-6">
                  <Accordion type="single" collapsible className="w-full">
                    {category.faqs.map((faq, faqIndex) => (
                      <AccordionItem key={faqIndex} value={`${categoryIndex}-${faqIndex}`} className="border-gray-200">
                        <AccordionTrigger className="text-left hover:text-placebo-gold">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-placebo-dark-gray leading-relaxed">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Resources */}
          <div className="bg-placebo-black text-placebo-white rounded-lg p-8 mt-12">
            <h3 className="text-2xl font-bold mb-4">{language === "en" ? "Additional Resources" : "追加リソース"}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-placebo-gold mb-2">
                  {language === "en" ? "Buying Guide" : "購入ガイド"}
                </h4>
                <p className="text-gray-300 text-sm">
                  {language === "en"
                    ? "Comprehensive guide to buying vehicles in Okinawa, including legal requirements and best practices."
                    : "法的要件とベストプラクティスを含む、沖縄での車両購入に関する包括的なガイド。"}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-placebo-gold mb-2">
                  {language === "en" ? "Financing Calculator" : "融資計算機"}
                </h4>
                <p className="text-gray-300 text-sm">
                  {language === "en"
                    ? "Calculate your monthly payments and explore financing options before you buy."
                    : "購入前に月々の支払いを計算し、融資オプションを検討してください。"}
                </p>
              </div>
            </div>
          </div>

          {/* Still Need Help */}
          <div className="text-center mt-12">
            <h3 className="text-2xl font-bold text-placebo-black mb-4">
              {language === "en" ? "Still Have Questions?" : "まだご質問がありますか？"}
            </h3>
            <p className="text-placebo-dark-gray mb-6">
              {language === "en"
                ? "Our team is ready to provide personalized assistance for your vehicle buying journey."
                : "当社のチームは、お客様の車両購入の旅に個別のサポートを提供する準備ができています。"}
            </p>
            <Button asChild className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90">
              <Link href="/contact">{language === "en" ? "Get Personal Help" : "個別サポートを受ける"}</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
