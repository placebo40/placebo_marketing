"use client"

import { useLanguage } from "@/contexts/language-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Shield, AlertTriangle, CheckCircle, ExternalLink, FileText, Users, Car, Info } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ComplianceInfoPage() {
  const { language } = useLanguage()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-placebo-black mb-2">
            {language === "en" ? "Japanese Automotive Sales Compliance" : "日本の自動車販売コンプライアンス"}
          </h1>
          <p className="text-placebo-dark-gray">
            {language === "en"
              ? "Understanding legal requirements for vehicle sales in Japan"
              : "日本での車両販売の法的要件を理解する"}
          </p>
        </div>

        {/* Quick Summary */}
        <Alert className="mb-8 border-placebo-gold/20 bg-placebo-gold/5">
          <Info className="h-5 w-5 text-placebo-gold" />
          <AlertTitle className="text-placebo-black font-bold">
            {language === "en" ? "Selling Limits Summary" : "販売制限の概要"}
          </AlertTitle>
          <AlertDescription className="text-placebo-dark-gray">
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>
                <span className="font-medium">{language === "en" ? "Guest Users:" : "ゲストユーザー:"}</span>{" "}
                {language === "en"
                  ? "Can request to sell one vehicle at a time, twice per year"
                  : "年に2回まで、一度に1台の車両の販売をリクエスト可能"}
              </li>
              <li>
                <span className="font-medium">{language === "en" ? "Private Sellers:" : "個人販売者:"}</span>{" "}
                {language === "en"
                  ? "Can sell two vehicles at a time, once per year"
                  : "年に1回、一度に2台の車両を販売可能"}
              </li>
              <li>
                <span className="font-medium">{language === "en" ? "Licensed Dealers:" : "認可ディーラー:"}</span>{" "}
                {language === "en" ? "Unlimited sales" : "販売制限なし"}
              </li>
            </ul>
          </AlertDescription>
        </Alert>

        {/* Tabs for different sections */}
        <Tabs defaultValue="account-types" className="mb-8">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="account-types">{language === "en" ? "Account Types" : "アカウントタイプ"}</TabsTrigger>
            <TabsTrigger value="legal-requirements">
              {language === "en" ? "Legal Requirements" : "法的要件"}
            </TabsTrigger>
            <TabsTrigger value="compliance-help">{language === "en" ? "How We Help" : "サポート方法"}</TabsTrigger>
          </TabsList>

          {/* Account Types Tab */}
          <TabsContent value="account-types">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-placebo-gold" />
                  {language === "en" ? "Account Types & Selling Limits" : "アカウントタイプと販売制限"}
                </CardTitle>
                <CardDescription>
                  {language === "en"
                    ? "Choose the right account type for your selling needs"
                    : "販売ニーズに適したアカウントタイプを選択してください"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left p-4 font-semibold">
                          {language === "en" ? "Account Type" : "アカウントタイプ"}
                        </th>
                        <th className="text-left p-4 font-semibold">
                          {language === "en" ? "Simultaneous Listings" : "同時出品数"}
                        </th>
                        <th className="text-left p-4 font-semibold">
                          {language === "en" ? "Annual Limit" : "年間制限"}
                        </th>
                        <th className="text-left p-4 font-semibold">{language === "en" ? "Features" : "機能"}</th>
                        <th className="text-left p-4 font-semibold">{language === "en" ? "Cost" : "費用"}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100 bg-blue-50">
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-blue-500" />
                            <div>
                              <div className="font-medium">{language === "en" ? "Guest User" : "ゲストユーザー"}</div>
                              <div className="text-sm text-gray-600">
                                {language === "en" ? "No registration required" : "登録不要"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-medium">1 {language === "en" ? "vehicle" : "台"}</span>
                        </td>
                        <td className="p-4">
                          <span className="font-medium">2 {language === "en" ? "requests/year" : "リクエスト/年"}</span>
                        </td>
                        <td className="p-4">
                          <ul className="text-sm space-y-1">
                            <li>• {language === "en" ? "Listing requests only" : "出品リクエストのみ"}</li>
                            <li>• {language === "en" ? "Placebo handles everything" : "Placeboがすべてを処理"}</li>
                          </ul>
                        </td>
                        <td className="p-4">
                          <Badge className="bg-green-100 text-green-800">{language === "en" ? "Free" : "無料"}</Badge>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100 bg-green-50">
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Car className="h-5 w-5 text-green-500" />
                            <div>
                              <div className="font-medium">{language === "en" ? "Private Seller" : "個人販売者"}</div>
                              <div className="text-sm text-gray-600">
                                {language === "en" ? "One-time payment" : "一回払い"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-medium">2 {language === "en" ? "vehicles" : "台"}</span>
                        </td>
                        <td className="p-4">
                          <span className="font-medium">2 {language === "en" ? "sales/year" : "販売/年"}</span>
                        </td>
                        <td className="p-4">
                          <ul className="text-sm space-y-1">
                            <li>• {language === "en" ? "All guest user features" : "すべてのゲストユーザー機能"}</li>
                            <li>• {language === "en" ? "Full seller dashboard" : "完全な販売者ダッシュボード"}</li>
                            <li>
                              • {language === "en" ? "Direct buyer communication" : "買い手との直接コミュニケーション"}
                            </li>
                            <li>• {language === "en" ? "Compliance monitoring" : "コンプライアンス監視"}</li>
                          </ul>
                        </td>
                        <td className="p-4">
                          <Badge className="bg-blue-100 text-blue-800">{language === "en" ? "¥3,980" : "¥3,980"}</Badge>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100 bg-yellow-50">
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-placebo-gold" />
                            <div>
                              <div className="font-medium">
                                {language === "en" ? "Licensed Dealer" : "認可ディーラー"}
                              </div>
                              <div className="text-sm text-gray-600">
                                {language === "en" ? "Business license required" : "事業許可が必要"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm">
                            <div className="font-medium">15 - 50 - {language === "en" ? "Unlimited" : "無制限"}</div>
                            <div className="text-gray-600">{language === "en" ? "Based on plan" : "プランによる"}</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm">
                            <div className="font-medium">{language === "en" ? "Unlimited" : "無制限"}</div>
                            <div className="text-gray-600">{language === "en" ? "All plans" : "全プラン"}</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <ul className="text-sm space-y-1">
                            <li>• {language === "en" ? "All private seller features" : "すべての個人販売者機能"}</li>
                            <li>• {language === "en" ? "Commercial advertising" : "商業広告"}</li>
                            <li>• {language === "en" ? "Bulk listing tools" : "一括出品ツール"}</li>
                            <li>• {language === "en" ? "Priority support" : "優先サポート"}</li>
                          </ul>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline">
                            {language === "en" ? "Subscription-based" : "サブスクリプション制"}
                          </Badge>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">{language === "en" ? "Important Notes:" : "重要な注意事項："}</h4>
                  <ul className="text-sm space-y-1 text-gray-700">
                    <li>
                      •{" "}
                      {language === "en"
                        ? "Guest users can make 2 listing requests per calendar year (January-December)"
                        : "ゲストユーザーは暦年（1月〜12月）に2回の出品リクエストが可能"}
                    </li>
                    <li>
                      •{" "}
                      {language === "en"
                        ? "Private sellers can complete 2 sales per calendar year with up to 2 vehicles listed simultaneously"
                        : "個人販売者は暦年に2回の販売を完了でき、最大2台の車両を同時に出品可能"}
                    </li>
                    <li>
                      •{" "}
                      {language === "en"
                        ? "Exceeding private seller limits requires upgrading to a licensed dealer account"
                        : "個人販売者の制限を超える場合は、認可ディーラーアカウントへのアップグレードが必要"}
                    </li>
                    <li>
                      •{" "}
                      {language === "en"
                        ? "All limits reset on January 1st each year"
                        : "すべての制限は毎年1月1日にリセットされます"}
                    </li>
                    <li>
                      •{" "}
                      {language === "en"
                        ? "Licensed dealers have three plan options: Starter (15 listings), Professional (50 listings), and Enterprise (unlimited listings)"
                        : "認可ディーラーには3つのプランオプションがあります：スターター（15出品）、プロフェッショナル（50出品）、エンタープライズ（無制限出品）"}
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Legal Requirements Tab */}
          <TabsContent value="legal-requirements">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-placebo-gold" />
                  {language === "en" ? "When a Business License is Required" : "事業許可が必要な場合"}
                </CardTitle>
                <CardDescription>
                  {language === "en"
                    ? "Japanese law requires a business license in the following situations:"
                    : "日本の法律では、以下の状況で事業許可が必要です："}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertTitle className="text-red-800">
                      {language === "en" ? "License Required If:" : "以下の場合はライセンスが必要："}
                    </AlertTitle>
                    <AlertDescription className="text-red-700">
                      <ul className="list-disc pl-5 space-y-2 mt-2">
                        <li>
                          {language === "en"
                            ? "Selling two vehicles at a time, more than once per year"
                            : "年に1回以上、一度に2台の車両を販売"}
                        </li>
                        <li>
                          {language === "en"
                            ? "Selling one vehicle at a time, more than twice per year"
                            : "年に2回以上、一度に1台の車両を販売"}
                        </li>
                        <li>
                          {language === "en"
                            ? "Advertising or marketing vehicles commercially"
                            : "車両を商業的に広告またはマーケティング"}
                        </li>
                        <li>
                          {language === "en"
                            ? "Operating as a business rather than liquidating personal property"
                            : "個人財産の処分ではなく事業として運営"}
                        </li>
                      </ul>
                    </AlertDescription>
                  </Alert>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-semibold text-lg mb-3">
                      {language === "en" ? "Japanese Automotive Sales Laws" : "日本の自動車販売法"}
                    </h3>
                    <p className="mb-4 text-sm">
                      {language === "en"
                        ? "In Japan, the sale of vehicles is regulated by several laws, including the Road Transport Vehicle Act and the Secondhand Articles Dealer Act. These laws are designed to ensure consumer protection, prevent fraud, and maintain proper business practices."
                        : "日本では、道路運送車両法や古物営業法など、いくつかの法律によって車両の販売が規制されています。これらの法律は、消費者保護、詐欺防止、適切なビジネス慣行の維持を目的としています。"}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="p-3 bg-gray-50 rounded-md">
                        <h4 className="font-medium mb-2">
                          {language === "en" ? "Secondhand Articles Dealer Act" : "古物営業法"}
                        </h4>
                        <p>
                          {language === "en"
                            ? "Requires a license for businesses that buy and sell used goods, including vehicles. Private individuals selling their own property are exempt, but regular trading requires licensing."
                            : "中古品（車両を含む）の売買を行う事業者にはライセンスが必要です。個人が自分の財産を売却する場合は免除されますが、定期的な取引にはライセンスが必要です。"}
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-md">
                        <h4 className="font-medium mb-2">
                          {language === "en" ? "Road Transport Vehicle Act" : "道路運送車両法"}
                        </h4>
                        <p>
                          {language === "en"
                            ? "Governs vehicle registration, inspection, and transfer of ownership. All vehicle sales must comply with these regulations, regardless of seller type."
                            : "車両の登録、検査、所有権の移転を管理します。販売者の種類に関係なく、すべての車両販売はこれらの規制に準拠する必要があります。"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* How We Help Tab */}
          <TabsContent value="compliance-help">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  {language === "en"
                    ? "How Placebo Marketing Ensures Compliance"
                    : "Placebo Marketingのコンプライアンス確保方法"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">{language === "en" ? "Automated Monitoring" : "自動監視"}</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>
                          {language === "en" ? "Track sales frequency per user" : "ユーザーごとの販売頻度追跡"}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{language === "en" ? "Monitor simultaneous listings" : "同時出品の監視"}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{language === "en" ? "Detect business-like patterns" : "ビジネス様パターンの検出"}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>
                          {language === "en" ? "Real-time compliance alerts" : "リアルタイムコンプライアンスアラート"}
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">{language === "en" ? "User Support" : "ユーザーサポート"}</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>
                          {language === "en" ? "Clear compliance guidelines" : "明確なコンプライアンスガイドライン"}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{language === "en" ? "Automatic upgrade prompts" : "自動アップグレードプロンプト"}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{language === "en" ? "License application assistance" : "ライセンス申請支援"}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{language === "en" ? "Legal resource center" : "法的リソースセンター"}</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    {language === "en" ? "Our Compliance Guarantee" : "コンプライアンス保証"}
                  </h4>
                  <p className="text-sm text-gray-700">
                    {language === "en"
                      ? "Placebo Marketing is committed to helping all users stay compliant with Japanese automotive sales laws. Our platform automatically enforces selling limits and provides clear guidance when upgrades are needed. We also offer resources to help users understand their obligations and options."
                      : "Placebo Marketingは、すべてのユーザーが日本の自動車販売法に準拠するよう支援することを約束します。当社のプラットフォームは、販売制限を自動的に適用し、アップグレードが必要な場合に明確なガイダンスを提供します。また、ユーザーが自分の義務とオプションを理解するためのリソースも提供しています。"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Upgrade Path */}
        <Card className="mb-8 border-placebo-gold">
          <CardHeader className="bg-placebo-gold/10">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-placebo-gold" />
              {language === "en" ? "Upgrade Your Account" : "アカウントのアップグレード"}
            </CardTitle>
            <CardDescription>
              {language === "en"
                ? "Choose the right account type for your selling needs"
                : "販売ニーズに適したアカウントタイプを選択してください"}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Car className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-lg">
                    {language === "en" ? "Upgrade to Private Seller" : "個人販売者へアップグレード"}
                  </h3>
                </div>
                <ul className="space-y-2 text-sm mb-4">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>
                      {language === "en" ? "List up to 2 vehicles simultaneously" : "最大2台の車両を同時に出品"}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{language === "en" ? "Full seller dashboard" : "完全な販売者ダッシュボード"}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{language === "en" ? "Direct messaging with buyers" : "買い手との直接メッセージング"}</span>
                  </li>
                </ul>
                <Button asChild className="w-full">
                  <Link href="/seller-registration">
                    {language === "en" ? "Register as Private Seller" : "個人販売者として登録"}
                  </Link>
                </Button>
              </div>

              <div className="border border-placebo-gold rounded-lg p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-placebo-gold/20 p-2 rounded-full">
                    <Shield className="h-5 w-5 text-placebo-gold" />
                  </div>
                  <h3 className="font-semibold text-lg">
                    {language === "en" ? "Become a Licensed Dealer" : "認可ディーラーになる"}
                  </h3>
                </div>
                <ul className="space-y-2 text-sm mb-4">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{language === "en" ? "Unlimited vehicle listings" : "無制限の車両出品"}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{language === "en" ? "Commercial advertising tools" : "商業広告ツール"}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{language === "en" ? "Full legal compliance" : "完全な法的コンプライアンス"}</span>
                  </li>
                </ul>
                <Button asChild className="w-full bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90">
                  <Link href="/seller-registration?type=dealership">
                    {language === "en" ? "Register as Dealer" : "ディーラーとして登録"}
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Legal Disclaimer */}
        <Alert className="mb-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{language === "en" ? "Important Legal Notice" : "重要な法的通知"}</AlertTitle>
          <AlertDescription>
            <p className="mb-2">
              {language === "en"
                ? "This information is provided for educational purposes only and does not constitute legal advice. Users are responsible for ensuring compliance with all applicable Japanese laws and regulations."
                : "この情報は教育目的でのみ提供されており、法的助言を構成するものではありません。ユーザーは適用されるすべての日本の法律および規制への準拠を確保する責任があります。"}
            </p>
            <p>
              {language === "en"
                ? "For specific legal guidance, please consult with a qualified Japanese attorney or the appropriate government authorities."
                : "具体的な法的指導については、資格のある日本の弁護士または適切な政府当局にご相談ください。"}
            </p>
          </AlertDescription>
        </Alert>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button asChild className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90">
            <Link href="/seller-registration">
              <Shield className="h-4 w-4 mr-2" />
              {language === "en" ? "Register as Seller" : "販売者として登録"}
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contact">
              <FileText className="h-4 w-4 mr-2" />
              {language === "en" ? "Contact Support" : "サポートに連絡"}
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="https://www.mlit.go.jp/" target="_blank">
              <ExternalLink className="h-4 w-4 mr-2" />
              {language === "en" ? "Government Resources" : "政府リソース"}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
