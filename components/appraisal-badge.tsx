"use client"

import { FileText, Award, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface AppraisalBadgeProps {
  hasAppraisal: boolean
  appraisalDate?: string
  appraisedValue?: number
  reportType?: "basic" | "comprehensive" | "premium"
  language: "en" | "ja"
  size?: "sm" | "md" | "lg"
  showTooltip?: boolean
  iconOnly?: boolean
  className?: string
}

const reportTypeConfig = {
  basic: {
    colors: "bg-gradient-to-r from-green-400 to-green-600 text-white",
    label: { en: "Basic Appraisal", ja: "基本鑑定" },
  },
  comprehensive: {
    colors: "bg-gradient-to-r from-blue-400 to-blue-600 text-white",
    label: { en: "Comprehensive Appraisal", ja: "総合鑑定" },
  },
  premium: {
    colors: "bg-gradient-to-r from-purple-400 to-purple-600 text-white",
    label: { en: "Premium Appraisal", ja: "プレミアム鑑定" },
  },
}

const sizeConfig = {
  sm: {
    badge: "text-xs px-2 py-1",
    badgeIconOnly: "text-xs p-1.5",
    icon: "h-3 w-3",
  },
  md: {
    badge: "text-sm px-3 py-1.5",
    badgeIconOnly: "text-sm p-2",
    icon: "h-4 w-4",
  },
  lg: {
    badge: "text-base px-4 py-2",
    badgeIconOnly: "text-base p-2.5",
    icon: "h-5 w-5",
  },
}

export default function AppraisalBadge({
  hasAppraisal,
  appraisalDate,
  appraisedValue,
  reportType = "basic",
  language,
  size = "md",
  showTooltip = false,
  iconOnly = false,
  className,
}: AppraisalBadgeProps) {
  if (!hasAppraisal) return null

  const config = reportTypeConfig[reportType]
  const sizeStyles = sizeConfig[size]

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
      month: "short",
      day: "numeric",
    })
  }

  const badgeContent = (
    <Badge
      className={cn(
        config.colors,
        iconOnly ? sizeStyles.badgeIconOnly : sizeStyles.badge,
        "font-semibold shadow-sm transition-all duration-200 hover:shadow-md",
        className,
      )}
    >
      <div className="flex items-center whitespace-nowrap">
        <FileText className={cn(sizeStyles.icon, iconOnly ? "" : "mr-1")} />
        {!iconOnly && <span>{language === "en" ? "Appraised" : "鑑定済み"}</span>}
      </div>
    </Badge>
  )

  if (!showTooltip) {
    return badgeContent
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{badgeContent}</TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <div className="space-y-2">
            <div className="font-semibold flex items-center gap-2">
              <Award className="h-4 w-4" />
              {config.label[language]}
            </div>
            <div className="text-sm space-y-1">
              {appraisalDate && (
                <div>
                  <span className="font-medium">{language === "en" ? "Appraised:" : "鑑定日:"}</span>{" "}
                  {formatDate(appraisalDate)}
                </div>
              )}
              {appraisedValue && (
                <div>
                  <span className="font-medium">{language === "en" ? "Appraised Value:" : "鑑定価格:"}</span>{" "}
                  {formatPrice(appraisedValue)}
                </div>
              )}
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle className="h-3 w-3" />
                <span className="text-xs">
                  {language === "en" ? "Professional appraisal report available" : "プロの鑑定レポートが利用可能"}
                </span>
              </div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
