export interface ServiceFeeCalculation {
  desiredAmount: number // What the seller wants to receive
  feePercentage: number
  calculatedFee: number
  actualFee: number
  askingPrice: number // Desired amount + service fee
  sellerReceives: number // Always equals desiredAmount
  isMinimumApplied: boolean
  isMaximumApplied: boolean
}

export const SERVICE_FEE_CONFIG = {
  percentage: 4, // 4%
  minimum: 40000, // ¥40,000
  maximum: 250000, // ¥250,000
}

export function calculateServiceFee(desiredAmount: number): ServiceFeeCalculation {
  const feePercentage = SERVICE_FEE_CONFIG.percentage
  const calculatedFee = (desiredAmount * feePercentage) / 100

  let actualFee = calculatedFee
  let isMinimumApplied = false
  let isMaximumApplied = false

  if (calculatedFee < SERVICE_FEE_CONFIG.minimum) {
    actualFee = SERVICE_FEE_CONFIG.minimum
    isMinimumApplied = true
  } else if (calculatedFee > SERVICE_FEE_CONFIG.maximum) {
    actualFee = SERVICE_FEE_CONFIG.maximum
    isMaximumApplied = true
  }

  const askingPrice = desiredAmount + actualFee
  const sellerReceives = desiredAmount // Seller always gets their full desired amount

  return {
    desiredAmount,
    feePercentage,
    calculatedFee,
    actualFee,
    askingPrice,
    sellerReceives,
    isMinimumApplied,
    isMaximumApplied,
  }
}

export function formatServiceFeeBreakdown(calculation: any, language: "en" | "ja") {
  // Handle both old and new data structures for backward compatibility
  const desiredAmount = calculation?.desiredAmount ?? calculation?.vehiclePrice ?? 0
  const actualFee = calculation?.actualFee ?? calculation?.calculatedFee ?? 0
  const marketAskingPrice = calculation?.marketAskingPrice ?? calculation?.askingPrice ?? desiredAmount + actualFee
  const sellerReceives = calculation?.sellerReceives ?? calculation?.netProceeds ?? desiredAmount
  const feePercentage = calculation?.feePercentage ?? SERVICE_FEE_CONFIG.percentage
  const calculatedFee = calculation?.calculatedFee ?? 0
  const isMinimumApplied = calculation?.isMinimumApplied ?? false
  const isMaximumApplied = calculation?.isMaximumApplied ?? false

  return {
    desiredAmount: `¥${Number(desiredAmount).toLocaleString()}`,
    serviceFee: `¥${Number(actualFee).toLocaleString()}`,
    marketAskingPrice: `¥${Number(marketAskingPrice).toLocaleString()}`, // Use the stored market asking price
    askingPrice: `¥${Number(marketAskingPrice).toLocaleString()}`, // For backward compatibility
    sellerReceives: `¥${Number(sellerReceives).toLocaleString()}`,
    vehiclePrice: `¥${Number(desiredAmount).toLocaleString()}`, // For backward compatibility
    netProceeds: `¥${Number(sellerReceives).toLocaleString()}`, // For backward compatibility
    feeNote: isMinimumApplied
      ? language === "en"
        ? `Minimum fee applied (${feePercentage}% would be ¥${Number(calculatedFee).toLocaleString()})`
        : `最低手数料適用（${feePercentage}%では¥${Number(calculatedFee).toLocaleString()}）`
      : isMaximumApplied
        ? language === "en"
          ? `Maximum fee applied (${feePercentage}% would be ¥${Number(calculatedFee).toLocaleString()})`
          : `最高手数料適用（${feePercentage}%では¥${Number(calculatedFee).toLocaleString()}）`
        : language === "en"
          ? `${feePercentage}% service fee`
          : `${feePercentage}%サービス手数料`,
  }
}

export const SERVICE_INCLUSIONS = {
  en: [
    "Professional listing creation and optimization",
    "Comprehensive buyer screening and communication",
    "Expert negotiation assistance",
    "Complete paperwork and title transfer handling",
    "Professional photography (if needed)",
    "Multi-platform marketing and promotion",
    "Legal compliance and documentation",
    "Dedicated support throughout the process",
  ],
  ja: [
    "プロフェッショナルな出品作成と最適化",
    "包括的な買い手スクリーニングとコミュニケーション",
    "専門的な交渉支援",
    "完全な書類作成と所有権移転処理",
    "プロフェッショナルな写真撮影（必要な場合）",
    "マルチプラットフォームマーケティングとプロモーション",
    "法的コンプライアンスと文書化",
    "プロセス全体を通じた専用サポート",
  ],
}
