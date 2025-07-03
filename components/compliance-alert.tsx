"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, Info, Shield, ExternalLink } from "lucide-react"
import Link from "next/link"
import {
  type ComplianceStatus,
  getComplianceMessage,
  getRemainingListings,
  getRemainingAnnualSales,
} from "@/lib/compliance"

interface ComplianceAlertProps {
  status: ComplianceStatus
  language: "en" | "jp"
  showActions?: boolean
  className?: string
}

export function ComplianceAlert({ status, language, showActions = true, className }: ComplianceAlertProps) {
  const message = getComplianceMessage(status, language)

  const getIcon = () => {
    switch (message.type) {
      case "error":
        return <AlertTriangle className="h-5 w-5" />
      case "warning":
        return <Info className="h-5 w-5" />
      case "success":
        return <CheckCircle className="h-5 w-5" />
      default:
        return <Info className="h-5 w-5" />
    }
  }

  const getAlertClass = () => {
    switch (message.type) {
      case "error":
        return "border-red-200 bg-red-50 text-red-800"
      case "warning":
        return "border-yellow-200 bg-yellow-50 text-yellow-800"
      case "success":
        return "border-green-200 bg-green-50 text-green-800"
      default:
        return "border-blue-200 bg-blue-50 text-blue-800"
    }
  }

  return (
    <Alert className={`${getAlertClass()} ${className}`}>
      {getIcon()}
      <AlertTitle className="flex items-center gap-2">
        {message.title}
        <Badge variant="outline" className="text-xs">
          {status.accountType === "guest"
            ? language === "en"
              ? "Guest"
              : "ゲスト"
            : status.accountType === "private"
              ? language === "en"
                ? "Private"
                : "個人"
              : language === "en"
                ? "Dealer"
                : "ディーラー"}
        </Badge>
      </AlertTitle>
      <AlertDescription className="mt-2">
        <p className="mb-3">{message.message}</p>

        {/* Compliance Stats */}
        <div className="grid grid-cols-2 gap-4 text-sm mb-3">
          <div>
            <span className="font-medium">{language === "en" ? "Vehicles sold this year:" : "今年の販売台数:"}</span>
            <span className="ml-2">
              {status.vehiclesSoldThisYear}/{getRemainingAnnualSales(status)}
            </span>
          </div>
          <div>
            <span className="font-medium">{language === "en" ? "Active listings:" : "アクティブな出品:"}</span>
            <span className="ml-2">
              {status.activeListings}/{getRemainingListings(status)}
            </span>
          </div>
        </div>

        {/* Actions */}
        {showActions && status.warningLevel !== "none" && (
          <div className="flex flex-wrap gap-2 mt-4">
            {status.requiresLicense && (
              <Button asChild size="sm" className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90">
                <Link href="/seller-registration?type=dealership">
                  <Shield className="h-4 w-4 mr-2" />
                  {language === "en" ? "Register as Dealer" : "ディーラー登録"}
                </Link>
              </Button>
            )}

            <Button asChild variant="outline" size="sm">
              <Link href="/compliance-info">
                <ExternalLink className="h-4 w-4 mr-2" />
                {language === "en" ? "Learn More" : "詳細を見る"}
              </Link>
            </Button>
          </div>
        )}

        {/* Legal Disclaimer */}
        <div className="mt-4 p-3 bg-gray-100 rounded-md text-xs">
          <p className="font-medium mb-1">{language === "en" ? "Legal Notice:" : "法的通知:"}</p>
          <p>
            {language === "en"
              ? "Under Japanese law, selling 2+ vehicles per year, advertising vehicles commercially, or operating as a business requires proper licensing. Placebo Marketing helps ensure compliance but users are responsible for following all applicable laws."
              : "日本の法律では、年間2台以上の車両販売、商業的な車両広告、または事業としての運営には適切なライセンスが必要です。Placebo Marketingはコンプライアンスの確保を支援しますが、ユーザーは適用されるすべての法律に従う責任があります。"}
          </p>
        </div>
      </AlertDescription>
    </Alert>
  )
}
