"use client"

import { Shield, Award, Crown, Clock, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useState } from "react"

export type InspectionLevel = "basic" | "comprehensive" | "premium"

interface InspectionBadgeProps {
  level: InspectionLevel
  language: "en" | "ja"
  size?: "sm" | "md" | "lg"
  inspectionDate?: string
  expiryDate?: string
  showTooltip?: boolean
  iconOnly?: boolean
  expandOnHover?: boolean
  className?: string
}

const inspectionConfig = {
  basic: {
    icon: Shield,
    colors: "bg-gradient-to-r from-green-400 to-green-600 text-white",
    hoverColors: "hover:from-green-500 hover:to-green-700",
    labels: {
      en: "Basic Inspection",
      ja: "基本検査",
    },
    features: {
      en: ["Visual inspection", "Basic safety check", "Documentation review"],
      ja: ["目視検査", "基本安全チェック", "書類確認"],
    },
  },
  comprehensive: {
    icon: Award,
    colors: "bg-gradient-to-r from-blue-400 to-blue-600 text-white",
    hoverColors: "hover:from-blue-500 hover:to-blue-700",
    labels: {
      en: "Comprehensive Inspection",
      ja: "総合検査",
    },
    features: {
      en: ["Detailed mechanical check", "Engine diagnostics", "Safety systems test", "Interior/exterior assessment"],
      ja: ["詳細機械チェック", "エンジン診断", "安全システムテスト", "内外装評価"],
    },
  },
  premium: {
    icon: Crown,
    colors: "bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 text-white",
    hoverColors: "hover:from-purple-500 hover:via-purple-600 hover:to-purple-700",
    labels: {
      en: "Premium Inspection",
      ja: "プレミアム検査",
    },
    features: {
      en: [
        "Complete 200-point inspection",
        "Advanced diagnostics",
        "Road test included",
        "Detailed report with photos",
        "6-month warranty",
      ],
      ja: ["完全200項目検査", "高度診断", "試乗テスト込み", "写真付き詳細レポート", "6ヶ月保証"],
    },
  },
}

const sizeConfig = {
  sm: {
    badge: "text-xs px-2 py-0.5",
    badgeIconOnly: "text-xs p-1",
    icon: "h-3 w-3",
  },
  md: {
    badge: "text-xs px-2 py-1",
    badgeIconOnly: "text-xs p-1.5",
    icon: "h-3 w-3",
  },
  lg: {
    badge: "text-sm px-3 py-1.5",
    badgeIconOnly: "text-sm p-2",
    icon: "h-4 w-4",
  },
}

export default function InspectionBadge({
  level,
  language,
  size = "md",
  inspectionDate,
  expiryDate,
  showTooltip = false,
  iconOnly = false,
  expandOnHover = false,
  className,
}: InspectionBadgeProps) {
  const [isHovered, setIsHovered] = useState(false)
  const config = inspectionConfig[level]
  const sizeStyles = sizeConfig[size]

  // Add error handling
  if (!config) {
    console.warn(`Invalid inspection level: ${level}`)
    return null
  }

  if (!config.features || !config.features[language]) {
    console.warn(`Missing features for level: ${level}, language: ${language}`)
    return null
  }

  const Icon = config.icon

  // Check if inspection is expiring (within 30 days) or expired
  const isExpiring = expiryDate ? new Date(expiryDate).getTime() - Date.now() < 30 * 24 * 60 * 60 * 1000 : false
  const isExpired = expiryDate ? new Date(expiryDate) < new Date() : false

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(language === "en" ? "en-US" : "ja-JP", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const shouldShowIconOnly = iconOnly || (expandOnHover && !isHovered)
  const shouldAnimate = expandOnHover

  const badgeContent = (
    <Badge
      className={cn(
        config.colors,
        config.hoverColors,
        shouldShowIconOnly ? sizeStyles.badgeIconOnly : sizeStyles.badge,
        "font-medium shadow-sm transition-all duration-300 hover:shadow-md hover:scale-102",
        shouldAnimate && "overflow-hidden",
        isExpired && "grayscale opacity-75",
        className,
      )}
      onMouseEnter={() => {
        if (expandOnHover) setIsHovered(true)
      }}
      onMouseLeave={() => {
        if (expandOnHover) setIsHovered(false)
      }}
    >
      <div className="flex items-center whitespace-nowrap">
        <Icon className={cn(sizeStyles.icon, shouldShowIconOnly ? "" : "mr-1")} />

        {shouldAnimate ? (
          <span
            className={cn(
              "transition-all duration-300 ease-in-out",
              isHovered ? "max-w-48 opacity-100 ml-1" : "max-w-0 opacity-0 ml-0",
            )}
          >
            {config.labels[language]}
          </span>
        ) : (
          !shouldShowIconOnly && <span>{config.labels[language]}</span>
        )}

        {!shouldShowIconOnly && (
          <>
            {isExpiring && !isExpired && <Clock className={cn(sizeStyles.icon, "ml-1 text-yellow-200")} />}
            {isExpired && <AlertCircle className={cn(sizeStyles.icon, "ml-1 text-red-200")} />}
          </>
        )}
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
            <div className="font-semibold">{config.labels[language]}</div>
            <div className="text-sm">
              <div className="font-medium mb-1">{language === "en" ? "Includes:" : "含まれる内容:"}</div>
              <ul className="text-xs space-y-0.5">
                {config.features[language].map((feature, index) => (
                  <li key={index}>• {feature}</li>
                ))}
              </ul>
            </div>
            {inspectionDate && (
              <div className="text-xs text-gray-500 border-t pt-2">
                <div>
                  {language === "en" ? "Inspected:" : "検査日:"} {formatDate(inspectionDate)}
                </div>
                {expiryDate && (
                  <div className={isExpiring ? "text-yellow-600 font-medium" : ""}>
                    {language === "en" ? "Valid until:" : "有効期限:"} {formatDate(expiryDate)}
                    {isExpiring && !isExpired && (
                      <span className="ml-1">({language === "en" ? "Expiring soon" : "まもなく期限切れ"})</span>
                    )}
                    {isExpired && (
                      <span className="ml-1 text-red-600">({language === "en" ? "Expired" : "期限切れ"})</span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
