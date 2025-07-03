"use client"

import { Shield, Building2, User, Car } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export type VerificationType = "user" | "private_seller" | "dealership" | "vehicle"
export type VerificationStatus = "verified" | "unverified" | "pending" | "rejected"

interface VerificationBadgeProps {
  type: VerificationType
  status: VerificationStatus
  language: "en" | "ja"
  size?: "sm" | "md" | "lg"
  showTooltip?: boolean
  iconOnly?: boolean
  className?: string
}

const verificationConfig = {
  user: {
    icon: User,
    colors: {
      verified: "bg-gradient-to-r from-green-500 to-green-600 text-white",
      pending: "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white",
      rejected: "bg-gradient-to-r from-red-400 to-red-500 text-white",
      unverified: "bg-gray-400 text-white",
    },
    labels: {
      verified: { en: "Verified User", ja: "認証済みユーザー" },
      pending: { en: "Verification Pending", ja: "認証手続き中" },
      rejected: { en: "Verification Failed", ja: "認証失敗" },
      unverified: { en: "Unverified", ja: "未認証" },
    },
    descriptions: {
      verified: {
        en: "Identity verified through full KYC process",
        ja: "完全なKYCプロセスで本人確認済み",
      },
      pending: {
        en: "KYC verification in progress",
        ja: "KYC認証手続き中",
      },
      rejected: {
        en: "KYC verification failed - please resubmit",
        ja: "KYC認証に失敗しました - 再提出してください",
      },
      unverified: {
        en: "KYC verification required",
        ja: "KYC認証が必要です",
      },
    },
  },
  private_seller: {
    icon: Shield,
    colors: {
      verified: "bg-gradient-to-r from-blue-500 to-blue-600 text-white",
      pending: "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white",
      rejected: "bg-gradient-to-r from-red-400 to-red-500 text-white",
      unverified: "bg-gray-400 text-white",
    },
    labels: {
      verified: { en: "Verified Private Seller", ja: "認証済み個人販売者" },
      pending: { en: "Seller Verification Pending", ja: "販売者認証手続き中" },
      rejected: { en: "Seller Verification Failed", ja: "販売者認証失敗" },
      unverified: { en: "Unverified Seller", ja: "未認証販売者" },
    },
    descriptions: {
      verified: {
        en: "Full KYC completed with seller compliance verification",
        ja: "販売者コンプライアンス確認を含む完全なKYC完了",
      },
      pending: {
        en: "Seller KYC verification in progress",
        ja: "販売者KYC認証手続き中",
      },
      rejected: {
        en: "Seller verification failed - please resubmit documents",
        ja: "販売者認証に失敗しました - 書類を再提出してください",
      },
      unverified: {
        en: "Seller KYC verification required",
        ja: "販売者KYC認証が必要です",
      },
    },
  },
  dealership: {
    icon: Building2,
    colors: {
      verified: "bg-gradient-to-r from-amber-500 to-amber-600 text-white",
      pending: "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white",
      rejected: "bg-gradient-to-r from-red-400 to-red-500 text-white",
      unverified: "bg-gray-400 text-white",
    },
    labels: {
      verified: { en: "Verified Dealership", ja: "認証済みディーラー" },
      pending: { en: "Dealership Verification Pending", ja: "ディーラー認証手続き中" },
      rejected: { en: "Dealership Verification Failed", ja: "ディーラー認証失敗" },
      unverified: { en: "Unverified Dealership", ja: "未認証ディーラー" },
    },
    descriptions: {
      verified: {
        en: "Licensed dealership with full business verification",
        ja: "完全な事業認証を受けた認可ディーラー",
      },
      pending: {
        en: "Dealership license and business verification in progress",
        ja: "ディーラーライセンスと事業認証手続き中",
      },
      rejected: {
        en: "Dealership verification failed - please contact support",
        ja: "ディーラー認証に失敗しました - サポートにお問い合わせください",
      },
      unverified: {
        en: "Dealership verification required",
        ja: "ディーラー認証が必要です",
      },
    },
  },
  vehicle: {
    icon: Car,
    colors: {
      verified: "bg-gradient-to-r from-teal-500 to-teal-600 text-white",
      pending: "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white",
      rejected: "bg-gradient-to-r from-red-400 to-red-500 text-white",
      unverified: "bg-gray-400 text-white",
    },
    labels: {
      verified: { en: "Verified Vehicle", ja: "認証済み車両" },
      pending: { en: "Vehicle Verification Pending", ja: "車両認証手続き中" },
      rejected: { en: "Vehicle Verification Failed", ja: "車両認証失敗" },
      unverified: { en: "Unverified Vehicle", ja: "未認証車両" },
    },
    descriptions: {
      verified: {
        en: "Vehicle documents verified and history checked",
        ja: "車両書類確認・履歴チェック済み",
      },
      pending: {
        en: "Vehicle document verification in progress",
        ja: "車両書類認証手続き中",
      },
      rejected: {
        en: "Vehicle verification failed - please resubmit documents",
        ja: "車両認証に失敗しました - 書類を再提出してください",
      },
      unverified: {
        en: "Vehicle verification required",
        ja: "車両認証が必要です",
      },
    },
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

export default function VerificationBadge({
  type,
  status,
  language,
  size = "md",
  showTooltip = false,
  iconOnly = false,
  className,
}: VerificationBadgeProps) {
  // Add safety checks and defaults
  const safeType = type || "user"
  const safeStatus = status || "unverified"
  const safeLanguage = language || "en"

  const config = verificationConfig[safeType]
  if (!config) {
    console.warn(`Invalid verification type: ${safeType}`)
    return null
  }

  const sizeStyles = sizeConfig[size]
  const Icon = config.icon

  // Check if status exists in config
  if (!config.colors[safeStatus] || !config.labels[safeStatus]) {
    console.warn(`Invalid verification status: ${safeStatus} for type: ${safeType}`)
    return null
  }

  const badgeContent = (
    <Badge
      className={cn(
        config.colors[safeStatus],
        iconOnly ? sizeStyles.badgeIconOnly || sizeStyles.badge : sizeStyles.badge,
        "font-semibold shadow-sm transition-all duration-300 hover:shadow-md hover:scale-102",
        className,
      )}
    >
      <div className="flex items-center whitespace-nowrap">
        <Icon className={cn(sizeStyles.icon, iconOnly ? "" : "mr-1")} />
        {!iconOnly && <span>{config.labels[safeStatus][safeLanguage]}</span>}
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
            <div className="font-semibold">{config.labels[safeStatus][safeLanguage]}</div>
            <div className="text-sm">{config.descriptions[safeStatus][safeLanguage]}</div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
