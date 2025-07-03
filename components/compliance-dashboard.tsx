"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Car, Shield, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"
import { type ComplianceStatus, getRemainingListings, getRemainingAnnualSales } from "@/lib/compliance"

interface ComplianceDashboardProps {
  status: ComplianceStatus
  language: "en" | "jp"
}

export function ComplianceDashboard({ status, language }: ComplianceDashboardProps) {
  const salesProgress = (status.vehiclesSoldThisYear / getRemainingAnnualSales(status)) * 100
  const listingsProgress = (status.activeListings / getRemainingListings(status)) * 100

  return (
    <div className="space-y-6">
      {/* Compliance Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-placebo-gold" />
            {language === "en" ? "Compliance Status" : "コンプライアンス状況"}
          </CardTitle>
          <CardDescription>
            {language === "en"
              ? "Your account compliance with Japanese automotive sales regulations"
              : "日本の自動車販売規制に対するアカウントのコンプライアンス"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Account Type */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 bg-placebo-gold/10 rounded-full flex items-center justify-center">
                {status.accountType === "dealer" ? (
                  <Shield className="h-8 w-8 text-placebo-gold" />
                ) : (
                  <Car className="h-8 w-8 text-placebo-gold" />
                )}
              </div>
              <h3 className="font-semibold mb-1">{language === "en" ? "Account Type" : "アカウントタイプ"}</h3>
              <Badge variant={status.accountType === "dealer" ? "default" : "secondary"}>
                {status.accountType === "guest"
                  ? language === "en"
                    ? "Guest User"
                    : "ゲストユーザー"
                  : status.accountType === "private"
                    ? language === "en"
                      ? "Private Seller"
                      : "個人販売者"
                    : language === "en"
                      ? "Licensed Dealer"
                      : "認可ディーラー"}
              </Badge>
            </div>

            {/* Compliance Status */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 bg-placebo-gold/10 rounded-full flex items-center justify-center">
                {status.requiresLicense ? (
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                ) : (
                  <CheckCircle className="h-8 w-8 text-green-500" />
                )}
              </div>
              <h3 className="font-semibold mb-1">{language === "en" ? "Status" : "状況"}</h3>
              <Badge variant={status.requiresLicense ? "destructive" : "default"}>
                {status.requiresLicense
                  ? language === "en"
                    ? "License Required"
                    : "ライセンス必要"
                  : language === "en"
                    ? "Compliant"
                    : "コンプライアント"}
              </Badge>
            </div>

            {/* Year Reset */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 bg-placebo-gold/10 rounded-full flex items-center justify-center">
                <Clock className="h-8 w-8 text-placebo-gold" />
              </div>
              <h3 className="font-semibold mb-1">{language === "en" ? "Year Reset" : "年次リセット"}</h3>
              <p className="text-sm text-gray-600">
                {status.daysUntilYearReset} {language === "en" ? "days" : "日"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sales Tracking */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{language === "en" ? "Annual Sales Limit" : "年間販売制限"}</CardTitle>
            <CardDescription>
              {language === "en" ? "Vehicles sold this calendar year" : "今年度に販売された車両"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>
                  {status.vehiclesSoldThisYear} / {getRemainingAnnualSales(status)}
                </span>
                <span>{Math.round(salesProgress)}%</span>
              </div>
              <Progress
                value={salesProgress}
                className={`h-3 ${salesProgress >= 100 ? "bg-red-100" : salesProgress >= 50 ? "bg-yellow-100" : "bg-green-100"}`}
              />
              <p className="text-xs text-gray-600">
                {language === "en"
                  ? "Selling 2+ vehicles per year requires a business license"
                  : "年間2台以上の販売には事業許可が必要です"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{language === "en" ? "Simultaneous Listings" : "同時出品数"}</CardTitle>
            <CardDescription>
              {language === "en" ? "Currently active vehicle listings" : "現在アクティブな車両出品"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>
                  {status.activeListings} / {getRemainingListings(status)}
                </span>
                <span>{Math.round(listingsProgress)}%</span>
              </div>
              <Progress
                value={listingsProgress}
                className={`h-3 ${listingsProgress >= 100 ? "bg-red-100" : listingsProgress >= 50 ? "bg-yellow-100" : "bg-green-100"}`}
              />
              <p className="text-xs text-gray-600">
                {language === "en"
                  ? "Multiple simultaneous listings may indicate commercial activity"
                  : "複数の同時出品は商業活動を示す可能性があります"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Items */}
      {status.requiresLicense && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              {language === "en" ? "Action Required" : "アクション必要"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700 mb-4">
              {language === "en"
                ? "Your account has exceeded the limits for private sales. You must register as a licensed dealer to continue selling vehicles."
                : "あなたのアカウントは個人販売の制限を超えています。車両の販売を続けるには認可ディーラーとして登録する必要があります。"}
            </p>
            <div className="flex gap-3">
              <Button asChild className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90">
                <Link href="/seller-registration?type=dealership">
                  {language === "en" ? "Register as Dealer" : "ディーラー登録"}
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/compliance-info">{language === "en" ? "Learn More" : "詳細を見る"}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
