"use client"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Star, ArrowRight, Shield, Zap, Users, TrendingUp } from "lucide-react"

export default function UpgradeToProPage() {
  const { language } = useLanguage()
  const router = useRouter()

  const proFeatures = [
    {
      icon: TrendingUp,
      title: language === "en" ? "Unlimited Listings" : "無制限リスト",
      description: language === "en" ? "List as many vehicles as you want" : "好きなだけ車両をリスト",
    },
    {
      icon: Star,
      title: language === "en" ? "Priority Placement" : "優先表示",
      description: language === "en" ? "Your listings appear higher in search results" : "検索結果で上位表示",
    },
    {
      icon: Shield,
      title: language === "en" ? "Advanced Analytics" : "高度な分析",
      description: language === "en" ? "Detailed insights on listing performance" : "リストパフォーマンスの詳細分析",
    },
    {
      icon: Users,
      title: language === "en" ? "Dedicated Support" : "専用サポート",
      description: language === "en" ? "Priority customer support channel" : "優先カスタマーサポートチャネル",
    },
    {
      icon: Zap,
      title: language === "en" ? "Marketing Tools" : "マーケティングツール",
      description: language === "en" ? "Promote your listings with featured spots" : "注目スポットでリストを宣伝",
    },
  ]

  const handleUpgrade = () => {
    router.push("/verification/dealer")
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-placebo-black mb-2">
          {language === "en" ? "Upgrade to Pro Seller" : "プロセラーにアップグレード"}
        </h1>
        <p className="text-gray-600">
          {language === "en"
            ? "Unlock advanced features and grow your vehicle sales business"
            : "高度な機能を解除して車両販売ビジネスを成長させましょう"}
        </p>
      </div>

      {/* Current Status */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                {language === "en" ? "Current Status: Verified Seller" : "現在のステータス：確認済み販売者"}
              </CardTitle>
              <CardDescription>
                {language === "en"
                  ? "You're eligible to upgrade to Pro Seller"
                  : "プロセラーへのアップグレードが可能です"}
              </CardDescription>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {language === "en" ? "Verified" : "確認済み"}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Comparison */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Current Plan */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">{language === "en" ? "Verified Seller" : "確認済み販売者"}</CardTitle>
            <CardDescription className="text-center">
              {language === "en" ? "Your current plan" : "現在のプラン"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">{language === "en" ? "Up to 2 listings" : "最大2件のリスト"}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">{language === "en" ? "Basic support" : "基本サポート"}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">{language === "en" ? "Standard placement" : "標準表示"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pro Plan */}
        <Card className="border-placebo-gold border-2 relative">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-placebo-gold text-placebo-black">
              {language === "en" ? "Recommended" : "おすすめ"}
            </Badge>
          </div>
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <Star className="h-5 w-5 text-placebo-gold" />
              {language === "en" ? "Pro Seller" : "プロセラー"}
            </CardTitle>
            <CardDescription className="text-center">
              {language === "en" ? "Upgrade to unlock all features" : "すべての機能を解除するためにアップグレード"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {proFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-2">
                  <feature.icon className="h-4 w-4 text-placebo-gold mt-0.5" />
                  <div>
                    <span className="text-sm font-medium">{feature.title}</span>
                    <p className="text-xs text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Requirements */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{language === "en" ? "Pro Seller Requirements" : "プロセラー要件"}</CardTitle>
          <CardDescription>
            {language === "en"
              ? "Additional verification steps required for Pro Seller status"
              : "プロセラーステータスには追加の確認手順が必要です"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-placebo-gold mt-0.5" />
              <div>
                <h4 className="font-medium text-placebo-black">
                  {language === "en" ? "Business Verification" : "事業確認"}
                </h4>
                <p className="text-sm text-gray-600">
                  {language === "en"
                    ? "Provide business registration and dealer license documentation"
                    : "事業登録とディーラーライセンスの書類を提供"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-placebo-gold mt-0.5" />
              <div>
                <h4 className="font-medium text-placebo-black">
                  {language === "en" ? "Enhanced KYC" : "強化されたKYC"}
                </h4>
                <p className="text-sm text-gray-600">
                  {language === "en"
                    ? "Additional identity verification and background checks"
                    : "追加の本人確認と身元調査"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-placebo-gold mt-0.5" />
              <div>
                <h4 className="font-medium text-placebo-black">
                  {language === "en" ? "Compliance Review" : "コンプライアンス審査"}
                </h4>
                <p className="text-sm text-gray-600">
                  {language === "en"
                    ? "Review of business practices and regulatory compliance"
                    : "事業慣行と規制遵守の審査"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleUpgrade}
          className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90 font-semibold px-8 py-3"
        >
          {language === "en" ? "Start Pro Verification" : "プロ確認を開始"}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
