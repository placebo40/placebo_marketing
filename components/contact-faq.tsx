"use client"

import { useLanguage } from "@/contexts/language-context"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function ContactFAQ() {
  const { language } = useLanguage()

  const faqs = [
    {
      question:
        language === "en"
          ? "How quickly do you respond to inquiries?"
          : "お問い合わせにはどのくらいで返信いただけますか？",
      answer:
        language === "en"
          ? "We typically respond to all inquiries within 24 hours during business days. For urgent matters, please call our main office number or use our emergency contact for immediate assistance."
          : "営業日内であれば、通常24時間以内にすべてのお問い合わせにご返信いたします。緊急の場合は、本社の電話番号にお電話いただくか、緊急連絡先をご利用ください。",
    },
    {
      question:
        language === "en"
          ? "Do you provide services in both English and Japanese?"
          : "英語と日本語の両方でサービスを提供していますか？",
      answer:
        language === "en"
          ? "Yes, our entire team is bilingual and we provide all services in both English and Japanese. You can communicate with us in whichever language you're most comfortable with."
          : "はい、私たちのチーム全体がバイリンガルで、すべてのサービスを英語と日本語の両方で提供しています。最も快適な言語でコミュニケーションを取っていただけます。",
    },
    {
      question:
        language === "en" ? "What areas of Okinawa do you serve?" : "沖縄のどの地域にサービスを提供していますか？",
      answer:
        language === "en"
          ? "We serve all areas of Okinawa Prefecture, including Naha, Ginowan, Urasoe, Okinawa City, Uruma, Nago, and surrounding areas. We can arrange vehicle pickup and delivery services as needed."
          : "那覇、宜野湾、浦添、沖縄市、うるま、名護、その他周辺地域を含む沖縄県全域にサービスを提供しています。必要に応じて車両の引き取りや配送サービスも手配できます。",
    },
    {
      question:
        language === "en" ? "Can you help with vehicle export procedures?" : "車両輸出手続きのお手伝いはできますか？",
      answer:
        language === "en"
          ? "We specialize in helping military personnel and other customers with vehicle export procedures, including all necessary documentation, customs clearance, and shipping arrangements."
          : "もちろんです！軍関係者やその他のお客様の車両輸出手続きを専門としており、必要な書類、通関手続き、配送手配をすべてサポートいたします。",
    },
    {
      question:
        language === "en" ? "What payment methods do you accept?" : "どのような支払い方法を受け付けていますか？",
      answer:
        language === "en"
          ? "We accept various payment methods including bank transfers, credit cards, PayPal, and cash. For high-value transactions, we use secure escrow services to protect both buyers and sellers."
          : "銀行振込、クレジットカード、PayPal、現金など、さまざまな支払い方法を受け付けています。高額取引の場合は、買い手と売り手の両方を保護するために安全なエスクローサービスを使用します。",
    },
    {
      question:
        language === "en" ? "Do you offer vehicle inspection services?" : "車両検査サービスは提供していますか？",
      answer:
        language === "en"
          ? "Yes, we offer comprehensive vehicle inspection services conducted by certified mechanics. This includes pre-purchase inspections, condition reports, and detailed assessments for both buyers and sellers."
          : "はい、認定メカニックによる包括的な車両検査サービスを提供しています。これには、購入前検査、状態レポート、買い手と売り手の両方のための詳細な評価が含まれます。",
    },
  ]

  return (
    <section className="bg-gray-50 py-16">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-placebo-black">
              {language === "en" ? "Frequently Asked Questions" : "よくある質問"}
            </h2>
            <p className="mt-4 text-placebo-dark-gray">
              {language === "en"
                ? "Quick answers to common questions about our services and processes."
                : "私たちのサービスとプロセスに関するよくある質問への迅速な回答。"}
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-gray-200">
                <AccordionTrigger className="text-left hover:text-placebo-gold">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-placebo-dark-gray">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
