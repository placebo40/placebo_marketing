"use client"

import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Shield, Eye, Lock, Database, UserCheck, Mail } from "lucide-react"

export default function PrivacyPolicyPage() {
  const { language } = useLanguage()

  const sections = [
    {
      icon: <Database className="h-6 w-6 text-placebo-gold" />,
      title: language === "en" ? "Information We Collect" : "収集する情報",
      content:
        language === "en"
          ? "We collect information you provide directly to us, such as when you create an account, list a vehicle, contact sellers, or communicate with us. This includes your name, email address, phone number, and vehicle information."
          : "アカウント作成、車両出品、販売者への連絡、または当社とのコミュニケーション時に直接提供される情報を収集します。これには、お名前、メールアドレス、電話番号、車両情報が含まれます。",
    },
    {
      icon: <Eye className="h-6 w-6 text-placebo-gold" />,
      title: language === "en" ? "How We Use Your Information" : "情報の使用方法",
      content:
        language === "en"
          ? "We use the information we collect to provide, maintain, and improve our services, process transactions, send communications, and ensure the security of our platform. We may also use your information to personalize your experience and provide customer support."
          : "収集した情報は、サービスの提供、維持、改善、取引処理、コミュニケーション送信、プラットフォームのセキュリティ確保に使用します。また、体験のパーソナライズやカスタマーサポートの提供にも使用する場合があります。",
    },
    {
      icon: <Shield className="h-6 w-6 text-placebo-gold" />,
      title: language === "en" ? "Information Sharing" : "情報の共有",
      content:
        language === "en"
          ? "We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy. We may share information with service providers, legal authorities when required, or in connection with business transfers."
          : "本ポリシーに記載されている場合を除き、お客様の同意なしに個人情報を第三者に販売、取引、または譲渡することはありません。サービスプロバイダー、法的機関（必要な場合）、または事業譲渡に関連して情報を共有する場合があります。",
    },
    {
      icon: <Lock className="h-6 w-6 text-placebo-gold" />,
      title: language === "en" ? "Data Security" : "データセキュリティ",
      content:
        language === "en"
          ? "We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes encryption, secure servers, and regular security assessments."
          : "不正アクセス、改変、開示、破壊から個人情報を保護するために適切なセキュリティ対策を実施しています。これには、暗号化、セキュアサーバー、定期的なセキュリティ評価が含まれます。",
    },
    {
      icon: <UserCheck className="h-6 w-6 text-placebo-gold" />,
      title: language === "en" ? "Your Rights" : "お客様の権利",
      content:
        language === "en"
          ? "You have the right to access, update, or delete your personal information. You may also opt out of certain communications and request data portability. Contact us to exercise these rights or if you have any questions about your data."
          : "個人情報へのアクセス、更新、削除の権利があります。また、特定のコミュニケーションをオプトアウトし、データポータビリティを要求することもできます。これらの権利を行使する場合やデータに関してご質問がある場合は、お問い合わせください。",
    },
    {
      icon: <Mail className="h-6 w-6 text-placebo-gold" />,
      title: language === "en" ? "Contact Information" : "連絡先情報",
      content:
        language === "en"
          ? "If you have any questions about this Privacy Policy or our data practices, please contact us at privacy@placebomarketing.com or through our contact page. We will respond to your inquiries promptly."
          : "このプライバシーポリシーまたは当社のデータ慣行についてご質問がある場合は、privacy@placebomarketing.comまたはお問い合わせページからご連絡ください。お問い合わせには迅速に対応いたします。",
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

          <h1 className="text-3xl font-bold">{language === "en" ? "Privacy Policy" : "プライバシーポリシー"}</h1>
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
              {language === "en" ? "Our Commitment to Your Privacy" : "プライバシーへの取り組み"}
            </h2>
            <p className="text-placebo-dark-gray leading-relaxed">
              {language === "en"
                ? "At Placebo Marketing, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our vehicle marketplace and marketing services."
                : "プラセボマーケティングでは、お客様のプライバシーを保護し、個人情報のセキュリティを確保することをお約束します。このプライバシーポリシーでは、車両マーケットプレイスおよびマーケティングサービスをご利用いただく際に、お客様の情報をどのように収集、使用、開示、保護するかについて説明します。"}
            </p>
          </div>

          {/* Policy Sections */}
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

          {/* Additional Information */}
          <div className="bg-placebo-black text-placebo-white rounded-lg p-8 mt-8">
            <h3 className="text-xl font-semibold mb-4">
              {language === "en" ? "Updates to This Policy" : "ポリシーの更新"}
            </h3>
            <p className="text-gray-300 leading-relaxed">
              {language === "en"
                ? "We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the 'Last updated' date."
                : "慣行の変更やその他の運営上、法的、または規制上の理由により、このプライバシーポリシーを随時更新する場合があります。重要な変更については、このページに新しいプライバシーポリシーを掲載し、「最終更新」日を更新することでお知らせします。"}
            </p>
          </div>

          {/* Contact CTA */}
          <div className="text-center mt-12">
            <h3 className="text-2xl font-bold text-placebo-black mb-4">
              {language === "en"
                ? "Questions About Our Privacy Policy?"
                : "プライバシーポリシーについてご質問がありますか？"}
            </h3>
            <p className="text-placebo-dark-gray mb-6">
              {language === "en"
                ? "We're here to help clarify any concerns you may have about how we handle your data."
                : "お客様のデータの取り扱いに関するご不明な点がございましたら、お気軽にお問い合わせください。"}
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
