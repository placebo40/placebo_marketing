"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { FileText, Download, Eye, Award, Calendar, DollarSign, User, Shield, CheckCircle } from "lucide-react"

interface AppraisalReportViewerProps {
  appraisal: {
    hasAppraisal: boolean
    appraisalDate?: string
    appraisedValue?: number
    appraiserName?: string
    appraiserLicense?: string
    reportUrl?: string
    reportType?: "basic" | "comprehensive" | "premium"
    validUntil?: string
    notes?: string
  }
  language: "en" | "ja"
  vehicleTitle: string
}

const reportTypeConfig = {
  basic: {
    colors: "bg-gradient-to-r from-green-400 to-green-600 text-white",
    label: { en: "Basic Appraisal", ja: "基本鑑定" },
    features: {
      en: ["Market value assessment", "Condition evaluation", "Basic documentation"],
      ja: ["市場価値評価", "状態評価", "基本書類"],
    },
  },
  comprehensive: {
    colors: "bg-gradient-to-r from-blue-400 to-blue-600 text-white",
    label: { en: "Comprehensive Appraisal", ja: "総合鑑定" },
    features: {
      en: ["Detailed market analysis", "Comprehensive inspection", "Damage assessment", "Maintenance history review"],
      ja: ["詳細市場分析", "総合検査", "損傷評価", "整備履歴確認"],
    },
  },
  premium: {
    colors: "bg-gradient-to-r from-purple-400 to-purple-600 text-white",
    label: { en: "Premium Appraisal", ja: "プレミアム鑑定" },
    features: {
      en: [
        "Complete professional assessment",
        "Certified appraiser report",
        "Legal documentation",
        "Insurance valuation",
        "Resale projections",
      ],
      ja: ["完全プロ評価", "認定鑑定士レポート", "法的書類", "保険評価", "再販予測"],
    },
  },
}

export default function AppraisalReportViewer({ appraisal, language, vehicleTitle }: AppraisalReportViewerProps) {
  const [showFullReport, setShowFullReport] = useState(false)

  if (!appraisal.hasAppraisal) return null

  const config = reportTypeConfig[appraisal.reportType || "basic"]

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(language === "en" ? "en-US" : "ja-JP", {
      style: "currency",
      currency: "JPY",
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(language === "en" ? "en-US" : "ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const isValidAppraisal = appraisal.validUntil ? new Date(appraisal.validUntil) > new Date() : true

  return (
    <Card className="border-2 border-dashed border-blue-200 bg-gradient-to-r from-blue-50 to-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-blue-600" />
          {language === "en" ? "Professional Appraisal Report" : "プロ鑑定レポート"}
          <Badge className={config.colors}>{config.label[language]}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Appraisal Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {appraisal.appraisedValue && (
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">{language === "en" ? "Appraised Value" : "鑑定価格"}</p>
                <p className="font-bold text-lg text-green-600">{formatPrice(appraisal.appraisedValue)}</p>
              </div>
            </div>
          )}

          {appraisal.appraisalDate && (
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">{language === "en" ? "Appraisal Date" : "鑑定日"}</p>
                <p className="font-medium">{formatDate(appraisal.appraisalDate)}</p>
              </div>
            </div>
          )}

          {appraisal.appraiserName && (
            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
              <User className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">{language === "en" ? "Certified Appraiser" : "認定鑑定士"}</p>
                <p className="font-medium">{appraisal.appraiserName}</p>
                {appraisal.appraiserLicense && (
                  <p className="text-xs text-gray-500">License: {appraisal.appraiserLicense}</p>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
            <Shield className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">{language === "en" ? "Status" : "ステータス"}</p>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <p className="font-medium text-green-600">
                  {isValidAppraisal
                    ? language === "en"
                      ? "Valid"
                      : "有効"
                    : language === "en"
                      ? "Expired"
                      : "期限切れ"}
                </p>
              </div>
              {appraisal.validUntil && (
                <p className="text-xs text-gray-500">
                  {language === "en" ? "Until:" : "期限:"} {formatDate(appraisal.validUntil)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Appraisal Features */}
        <div className="bg-white p-4 rounded-lg border">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            {language === "en" ? "This appraisal includes:" : "この鑑定に含まれる内容:"}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {config.features[language].map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        {appraisal.notes && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold mb-2 text-blue-800">
              {language === "en" ? "Appraiser Notes:" : "鑑定士のメモ:"}
            </h4>
            <p className="text-sm text-blue-700">{appraisal.notes}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Dialog open={showFullReport} onOpenChange={setShowFullReport}>
            <DialogTrigger asChild>
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                <Eye className="h-4 w-4 mr-2" />
                {language === "en" ? "View Full Report" : "完全レポートを見る"}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {language === "en" ? "Appraisal Report" : "鑑定レポート"} - {vehicleTitle}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {appraisal.reportUrl ? (
                  <iframe
                    src={appraisal.reportUrl}
                    className="w-full h-96 border rounded-lg"
                    title="Appraisal Report"
                  />
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                      {language === "en"
                        ? "Full report will be available once the appraisal is complete."
                        : "完全なレポートは鑑定完了後に利用可能になります。"}
                    </p>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          {appraisal.reportUrl && (
            <Button variant="outline" asChild>
              <a href={appraisal.reportUrl} download target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4 mr-2" />
                {language === "en" ? "Download PDF" : "PDFダウンロード"}
              </a>
            </Button>
          )}
        </div>

        {/* Trust Indicator */}
        <div className="bg-green-50 p-3 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 text-green-800">
            <Shield className="h-4 w-4" />
            <span className="text-sm font-medium">
              {language === "en"
                ? "This appraisal was conducted by a certified professional appraiser"
                : "この鑑定は認定プロ鑑定士によって実施されました"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
