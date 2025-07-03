"use client"

import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { ArrowLeft, Shield, Clock, MapPin, DollarSign, AlertTriangle, FileText, Car, Users } from "lucide-react"

export default function VehicleInspectionsOkinawaPage() {
  const { language } = useLanguage()

  const inspectionIntervals = [
    {
      type: language === "en" ? "New Vehicles" : "新車",
      interval: language === "en" ? "3 years" : "3年",
      description: language === "en" ? "First inspection required after 3 years" : "初回検査は3年後に必要",
    },
    {
      type: language === "en" ? "Used Vehicles" : "中古車",
      interval: language === "en" ? "2 years" : "2年",
      description:
        language === "en"
          ? "Most used vehicles require inspection every 2 years"
          : "ほとんどの中古車は2年ごとに検査が必要",
    },
    {
      type: language === "en" ? "Certain Models" : "特定車種",
      interval: language === "en" ? "1 year" : "1年",
      description: language === "en" ? "Some vehicle models require annual inspection" : "一部の車種は年次検査が必要",
    },
  ]

  const inspectionItems = [
    { item: language === "en" ? "Exterior Compliance" : "外装適合性", icon: <Car className="h-4 w-4" /> },
    { item: language === "en" ? "Wheel Alignment" : "ホイールアライメント", icon: <Shield className="h-4 w-4" /> },
    { item: language === "en" ? "Speedometer Accuracy" : "スピードメーター精度", icon: <Clock className="h-4 w-4" /> },
    { item: language === "en" ? "Headlamp Alignment" : "ヘッドライト調整", icon: <Shield className="h-4 w-4" /> },
    { item: language === "en" ? "Brake System" : "ブレーキシステム", icon: <AlertTriangle className="h-4 w-4" /> },
    { item: language === "en" ? "Exhaust Emissions" : "排気ガス", icon: <Shield className="h-4 w-4" /> },
    { item: language === "en" ? "Undercarriage Inspection" : "車体下部検査", icon: <Car className="h-4 w-4" /> },
  ]

  const japanesePlateCosts = [
    { item: language === "en" ? "24-month inspection fee" : "24ヶ月点検料", cost: "~¥20,000" },
    { item: language === "en" ? "Safety standards fee" : "安全基準適合証明書", cost: "~¥10,000" },
    { item: language === "en" ? "Agent fee" : "代行手数料", cost: "~¥10,000" },
    { item: language === "en" ? "Weight tax" : "重量税", cost: "¥6,600-¥32,800" },
    { item: language === "en" ? "Compulsory insurance" : "自賠責保険", cost: "¥11,200" },
    { item: language === "en" ? "Revenue stamp" : "印紙代", cost: "¥1,100-¥1,800" },
  ]

  const yPlateCosts = [
    { item: language === "en" ? "JCI insurance" : "JCI保険", cost: language === "en" ? "Varies" : "変動" },
    {
      item: language === "en" ? "Weight tax" : "重量税",
      cost: language === "en" ? "Based on engine size" : "エンジンサイズによる",
    },
    { item: language === "en" ? "Inspection fee" : "検査料", cost: "$50 USD" },
    { item: language === "en" ? "Reinspection fee" : "再検査料", cost: "¥1,800" },
    { item: language === "en" ? "Temporary plates" : "仮ナンバー", cost: "¥1,500" },
  ]

  const requiredDocs = [
    {
      doc: language === "en" ? "JCI inspection certificate" : "自動車検査証",
      description: language === "en" ? "Current vehicle registration" : "現在の車両登録証",
    },
    {
      doc: language === "en" ? "Road tax receipt" : "自動車税納税証明書",
      description: language === "en" ? "Proof of annual tax payment" : "年税納付証明",
    },
    {
      doc: language === "en" ? "Insurance certificate" : "自賠責保険証書",
      description: language === "en" ? "Valid insurance documentation" : "有効な保険書類",
    },
  ]

  const yPlateProcess = [
    {
      step: 1,
      action: language === "en" ? "Purchase JCI insurance" : "JCI保険購入",
      location: language === "en" ? "Approved insurance offices" : "認定保険事務所",
    },
    {
      step: 2,
      action: language === "en" ? "Visit JSVRO" : "JSVRO訪問",
      location: language === "en" ? "Pay weight tax at right-hand counters" : "右側カウンターで重量税支払い",
    },
    {
      step: 3,
      action: language === "en" ? "Pay inspection fee" : "検査料支払い",
      location: language === "en" ? "$50 USD at Door 6" : "ドア6で$50 USD",
    },
    {
      step: 4,
      action: language === "en" ? "Initial inspection" : "初期検査",
      location: language === "en" ? "Wait in Lane 5" : "レーン5で待機",
    },
    {
      step: 5,
      action: language === "en" ? "Repairs if needed" : "必要に応じて修理",
      location: language === "en" ? "Same-day completion avoids fees" : "当日完了で追加料金なし",
    },
    {
      step: 6,
      action: language === "en" ? "Final inspection" : "最終検査",
      location: language === "en" ? "Lane 3 or 4 (closed Fridays)" : "レーン3または4（金曜休み）",
    },
    {
      step: 7,
      action: language === "en" ? "Update registration" : "登録更新",
      location: language === "en" ? "Counters A or B" : "カウンターAまたはB",
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
            <Shield className="h-8 w-8 text-placebo-gold" />
            <h1 className="text-3xl font-bold">
              {language === "en" ? "Vehicle Inspections in Okinawa" : "沖縄の車両検査"}
            </h1>
          </div>
          <p className="text-gray-300 text-lg">
            {language === "en"
              ? "Complete guide to Shaken inspections for Japanese and Y-plate vehicles"
              : "日本ナンバーとYナンバー車両の車検完全ガイド"}
          </p>
        </div>
      </div>

      <div className="container py-16">
        <div className="max-w-6xl mx-auto">
          {/* Overview */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-placebo-gold" />
                {language === "en" ? "Understanding Shaken (車検)" : "車検について"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-placebo-dark-gray leading-relaxed">
                {language === "en"
                  ? "Vehicle inspections in Okinawa follow Japan's rigorous Shaken (車検) system, officially known as Japanese Compulsory Insurance (JCI) inspection. While both Japanese plate and Y-plate vehicles must undergo similar safety inspections, there are important differences in procedures, locations, and costs depending on your status."
                  : "沖縄の車両検査は、日本の厳格な車検システムに従います。正式には日本強制保険（JCI）検査として知られています。日本ナンバーとYナンバーの両方の車両が同様の安全検査を受ける必要がありますが、ステータスによって手続き、場所、費用に重要な違いがあります。"}
              </p>
            </CardContent>
          </Card>

          {/* Plate Types */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{language === "en" ? "Japanese Plates" : "日本ナンバー"}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-placebo-dark-gray">
                  {language === "en"
                    ? "Used by Japanese nationals and permanent residents, featuring kanji characters and following standard Japanese registration procedures."
                    : "日本国民と永住者が使用し、漢字が特徴で、標準的な日本の登録手続きに従います。"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{language === "en" ? "Y Plates (SOFA)" : "Yナンバー（SOFA）"}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-placebo-dark-gray">
                  {language === "en"
                    ? "Special plates for Status of Forces Agreement personnel, including U.S. military members, DoD civilians, contractors, and their dependents."
                    : "地位協定関係者用の特別ナンバーで、米軍関係者、国防総省職員、契約者、その扶養家族が対象です。"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Inspection Intervals */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-placebo-gold" />
                {language === "en" ? "Inspection Intervals" : "検査間隔"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {inspectionIntervals.map((interval, index) => (
                  <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-placebo-gold mb-2">{interval.interval}</div>
                    <div className="font-semibold text-placebo-black mb-1">{interval.type}</div>
                    <div className="text-sm text-placebo-dark-gray">{interval.description}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* What's Inspected */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-placebo-gold" />
                {language === "en" ? "What's Inspected" : "検査項目"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inspectionItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="text-placebo-gold">{item.icon}</div>
                    <span className="text-placebo-dark-gray">{item.item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Locations and Costs */}
          <Tabs defaultValue="locations" className="mb-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="locations">{language === "en" ? "Locations" : "場所"}</TabsTrigger>
              <TabsTrigger value="costs">{language === "en" ? "Costs" : "費用"}</TabsTrigger>
              <TabsTrigger value="process">{language === "en" ? "Process" : "手続き"}</TabsTrigger>
            </TabsList>

            <TabsContent value="locations" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-placebo-gold" />
                      {language === "en" ? "Japanese Plate Vehicles" : "日本ナンバー車両"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{language === "en" ? "Government Center" : "政府検査場"}</Badge>
                      <span className="text-sm">{language === "en" ? "Urasoe City" : "浦添市"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{language === "en" ? "Authorized Garages" : "認定工場"}</Badge>
                      <span className="text-sm">{language === "en" ? "Throughout Okinawa" : "沖縄全域"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{language === "en" ? "Dealerships" : "ディーラー"}</Badge>
                      <span className="text-sm">{language === "en" ? "Various locations" : "各所"}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-placebo-gold" />
                      {language === "en" ? "Y Plate Vehicles (SOFA)" : "Yナンバー車両（SOFA）"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">JSVRO</Badge>
                      <span className="text-sm">
                        {language === "en" ? "Camp Butler/Foster" : "キャンプバトラー/フォスター"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">AAFES</Badge>
                      <span className="text-sm">{language === "en" ? "Military installations" : "軍事施設"}</span>
                    </div>
                    <div className="text-sm text-placebo-dark-gray mt-3">
                      <strong>{language === "en" ? "Hours:" : "営業時間:"}</strong>
                      <br />
                      {language === "en" ? "Monday-Friday 0730-1130, 1230-1600" : "月-金 0730-1130, 1230-1600"}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="costs" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-placebo-gold" />
                      {language === "en" ? "Japanese Plate Costs" : "日本ナンバー費用"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {japanesePlateCosts.map((cost, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                        >
                          <span className="text-sm text-placebo-dark-gray">{cost.item}</span>
                          <Badge variant="outline">{cost.cost}</Badge>
                        </div>
                      ))}
                      <div className="mt-4 p-3 bg-placebo-gold/10 rounded-lg">
                        <div className="font-semibold text-placebo-black">
                          {language === "en" ? "Total Estimated Cost" : "総推定費用"}
                        </div>
                        <div className="text-lg font-bold text-placebo-gold">¥60,000-¥140,000 ($400-$900 USD)</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-placebo-gold" />
                      {language === "en" ? "Y Plate Costs (SOFA)" : "Yナンバー費用（SOFA）"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {yPlateCosts.map((cost, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                        >
                          <span className="text-sm text-placebo-dark-gray">{cost.item}</span>
                          <Badge variant="outline">{cost.cost}</Badge>
                        </div>
                      ))}
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <div className="font-semibold text-placebo-black">
                          {language === "en" ? "Key Advantage" : "主な利点"}
                        </div>
                        <div className="text-sm text-placebo-dark-gray">
                          {language === "en"
                            ? "Flat $50 USD inspection fee regardless of vehicle size"
                            : "車両サイズに関係なく一律$50 USDの検査料"}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="process" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {language === "en"
                      ? "Y Plate Inspection Process (SOFA Personnel)"
                      : "Yナンバー検査手続き（SOFA関係者）"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {yPlateProcess.map((step, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0 w-8 h-8 bg-placebo-gold text-placebo-black rounded-full flex items-center justify-center font-bold text-sm">
                          {step.step}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-placebo-black mb-1">{step.action}</div>
                          <div className="text-sm text-placebo-dark-gray">{step.location}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Required Documents */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-placebo-gold" />
                {language === "en" ? "Required Documents" : "必要書類"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {requiredDocs.map((doc, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <FileText className="h-5 w-5 text-placebo-gold mt-0.5" />
                    <div>
                      <div className="font-semibold text-placebo-black">{doc.doc}</div>
                      <div className="text-sm text-placebo-dark-gray">{doc.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Penalties Warning */}
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-800">
                <AlertTriangle className="h-5 w-5" />
                {language === "en" ? "Important: Penalties for Non-Compliance" : "重要：違反時の罰則"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-red-700">
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">{language === "en" ? "Driving Suspension" : "運転停止"}</Badge>
                  <span className="text-sm">{language === "en" ? "Up to 30 days" : "最大30日間"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">{language === "en" ? "Financial Liability" : "金銭的責任"}</Badge>
                  <span className="text-sm">
                    {language === "en" ? "Personal responsibility for accident costs" : "事故費用の個人負担"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">{language === "en" ? "Criminal Penalties" : "刑事罰"}</Badge>
                  <span className="text-sm">
                    {language === "en"
                      ? "Up to 1 year imprisonment or ¥500,000 fine"
                      : "最大1年の懲役または50万円の罰金"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comparison Table */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>
                {language === "en" ? "Key Differences: Y Plate vs Japanese Plate" : "主な違い：YナンバーVS日本ナンバー"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-semibold">{language === "en" ? "Aspect" : "項目"}</th>
                      <th className="text-left p-3 font-semibold">
                        {language === "en" ? "Japanese Plates" : "日本ナンバー"}
                      </th>
                      <th className="text-left p-3 font-semibold">
                        {language === "en" ? "Y Plates (SOFA)" : "Yナンバー（SOFA）"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-3 font-medium">{language === "en" ? "Location" : "場所"}</td>
                      <td className="p-3">
                        {language === "en" ? "Urasoe center or authorized garages" : "浦添検査場または認定工場"}
                      </td>
                      <td className="p-3">
                        {language === "en" ? "JSVRO at Camp Butler/Foster" : "キャンプバトラー/フォスターのJSVRO"}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 font-medium">{language === "en" ? "Inspection Fee" : "検査料"}</td>
                      <td className="p-3">¥1,100-¥1,800 + {language === "en" ? "garage fees" : "工場手数料"}</td>
                      <td className="p-3">$50 USD {language === "en" ? "flat rate" : "一律料金"}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 font-medium">{language === "en" ? "Total Cost" : "総費用"}</td>
                      <td className="p-3">¥60,000-¥140,000</td>
                      <td className="p-3">
                        {language === "en" ? "Generally lower due to SOFA benefits" : "SOFA特典により一般的に安価"}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 font-medium">{language === "en" ? "Language" : "言語"}</td>
                      <td className="p-3">
                        {language === "en" ? "Japanese forms and procedures" : "日本語の書類と手続き"}
                      </td>
                      <td className="p-3">{language === "en" ? "English-speaking staff" : "英語対応スタッフ"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="bg-placebo-black text-placebo-white">
            <CardHeader>
              <CardTitle>{language === "en" ? "Need Help with Your Inspection?" : "検査でお困りですか？"}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-6">
                {language === "en"
                  ? "Our team can help guide you through the inspection process and connect you with trusted service providers."
                  : "当社のチームが検査プロセスをガイドし、信頼できるサービスプロバイダーをご紹介します。"}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90">
                  <Link href="/contact">{language === "en" ? "Contact Our Team" : "チームに連絡"}</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white hover:text-placebo-black"
                >
                  <Link href="/services">{language === "en" ? "Our Services" : "サービス一覧"}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
