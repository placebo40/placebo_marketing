"use client"

import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, FileText, Users, Shield, AlertTriangle, Scale, Gavel } from "lucide-react"

export default function TermsOfServicePage() {
  const { language } = useLanguage()

  const sections = [
    {
      icon: <FileText className="h-6 w-6 text-placebo-gold" />,
      title: language === "en" ? "Acceptance of Terms" : "利用規約の承諾",
      content:
        language === "en"
          ? "By accessing and using Placebo Marketing's services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service."
          : "プラセボマーケティングのサービスにアクセスし、利用することにより、本契約の条項および規定に拘束されることに同意し、承諾したものとみなされます。上記に同意されない場合は、本サービスをご利用にならないでください。",
    },
    {
      icon: <Users className="h-6 w-6 text-placebo-gold" />,
      title: language === "en" ? "User Responsibilities" : "ユーザーの責任",
      content:
        language === "en"
          ? "Users are responsible for maintaining the confidentiality of their account information, providing accurate vehicle and personal information, and complying with all applicable laws and regulations when using our platform."
          : "ユーザーは、アカウント情報の機密性を維持し、正確な車両および個人情報を提供し、当社のプラットフォームを使用する際にすべての適用法および規制を遵守する責任があります。",
    },
    {
      icon: <Shield className="h-6 w-6 text-placebo-gold" />,
      title: language === "en" ? "Platform Usage" : "プラットフォームの使用",
      content:
        language === "en"
          ? "Our platform is intended for legitimate vehicle buying, selling, and automotive business purposes. Users must not engage in fraudulent activities, misrepresent vehicles or services, or violate any terms of use."
          : "当社のプラットフォームは、正当な車両の売買および自動車ビジネス目的での使用を意図しています。ユーザーは、詐欺行為に従事したり、車両やサービスを偽って表示したり、利用規約に違反したりしてはなりません。",
    },
    {
      icon: <AlertTriangle className="h-6 w-6 text-placebo-gold" />,
      title: language === "en" ? "Prohibited Activities" : "禁止行為",
      content:
        language === "en"
          ? "Users are prohibited from posting false information, engaging in spam or harassment, attempting to circumvent our security measures, or using the platform for any illegal activities or purposes."
          : "ユーザーは、虚偽の情報を投稿したり、スパムやハラスメントに従事したり、当社のセキュリティ対策を回避しようとしたり、違法な活動や目的でプラットフォームを使用したりすることを禁止されています。",
    },
    {
      icon: <Scale className="h-6 w-6 text-placebo-gold" />,
      title: language === "en" ? "Limitation of Liability" : "責任の制限",
      content:
        language === "en"
          ? "Placebo Marketing acts as a marketplace facilitator and is not responsible for the quality, safety, or legality of vehicles listed, the truth or accuracy of listings, or the ability of sellers to sell or buyers to buy."
          : "プラセボマーケティングはマーケットプレイスのファシリテーターとして機能し、出品された車両の品質、安全性、合法性、出品の真実性や正確性、または売り手の販売能力や買い手の購入能力について責任を負いません。",
    },
    {
      icon: <Gavel className="h-6 w-6 text-placebo-gold" />,
      title: language === "en" ? "Dispute Resolution" : "紛争解決",
      content:
        language === "en"
          ? "Any disputes arising from the use of our services will be resolved through binding arbitration in accordance with Japanese law. We encourage users to first attempt to resolve disputes through our customer support team."
          : "当社のサービスの使用から生じる紛争は、日本法に従って拘束力のある仲裁により解決されます。ユーザーには、まず当社のカスタマーサポートチームを通じて紛争の解決を試みることをお勧めします。",
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

          <h1 className="text-3xl font-bold">{language === "en" ? "Terms of Service" : "利用規約"}</h1>
          <p className="mt-2 text-gray-300">
            {language === "en" ? "Last updated: December 2024" : "最終更新: 2024年12月"}
          </p>
        </div>
      </div>

      <div className="container py-16">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <div className="bg-placebo-white rounded-lg p-8 mb-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-placebo-black mb-4">
              {language === "en" ? "Agreement Overview" : "契約の概要"}
            </h2>
            <p className="text-placebo-dark-gray leading-relaxed">
              {language === "en"
                ? "These Terms of Service govern your use of Placebo Marketing's vehicle marketplace and related services. By using our platform, you agree to these terms and conditions. Please read them carefully before using our services."
                : "この利用規約は、プラセボマーケティングの車両マーケットプレイスおよび関連サービスの使用を規定します。当社のプラットフォームを使用することにより、これらの利用規約に同意したものとみなされます。サービスをご利用になる前に、注意深くお読みください。"}
            </p>
          </div>

          {/* Terms Sections */}
          <div className="space-y-6">
            {sections.map((section, index) => (
              <div key={index} className="bg-placebo-white rounded-lg p-8 border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 p-3 bg-placebo-gold/10 rounded-lg">{section.icon}</div>
                  <div>
                    <h3 className="text-xl font-semibold text-placebo-black mb-3">{section.title}</h3>
                    <p className="text-placebo-dark-gray leading-relaxed">{section.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Terms */}
          <div className="bg-placebo-black text-placebo-white rounded-lg p-8 mt-8">
            <h3 className="text-xl font-semibold mb-4">
              {language === "en" ? "Modifications to Terms" : "利用規約の変更"}
            </h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              {language === "en"
                ? "Placebo Marketing reserves the right to modify these terms at any time. Users will be notified of significant changes via email or platform notifications. Continued use of the service after changes constitutes acceptance of the new terms."
                : "プラセボマーケティングは、いつでもこれらの利用規約を変更する権利を留保します。重要な変更については、メールまたはプラットフォーム通知を通じてユーザーに通知されます。変更後のサービスの継続使用は、新しい利用規約の承諾を構成します。"}
            </p>
            <p className="text-gray-300 leading-relaxed">
              {language === "en"
                ? "For questions about these terms or our services, please contact our legal team at legal@placebomarketing.com or through our contact page."
                : "これらの利用規約または当社のサービスについてご質問がある場合は、legal@placebomarketing.comまたはお問い合わせページから法務チームにお問い合わせください。"}
            </p>
          </div>

          {/* Contact CTA */}
          <div className="text-center mt-12">
            <h3 className="text-2xl font-bold text-placebo-black mb-4">
              {language === "en" ? "Need Clarification on Our Terms?" : "利用規約について明確化が必要ですか？"}
            </h3>
            <p className="text-placebo-dark-gray mb-6">
              {language === "en"
                ? "Our team is available to help explain any aspect of our terms of service."
                : "当社のチームが利用規約のあらゆる側面について説明いたします。"}
            </p>
            <Button asChild className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90">
              <Link href="/contact">{language === "en" ? "Contact Us" : "お問い合わせ"}</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
