"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "en" | "jp"

type Translations = {
  [key: string]: {
    en: string
    jp: string
  }
}

// Common translations used across the site
const translations: Translations = {
  // Navigation
  home: {
    en: "Home",
    jp: "ホーム",
  },
  cars: {
    en: "Cars",
    jp: "車両",
  },
  services: {
    en: "Services",
    jp: "サービス",
  },
  about: {
    en: "About",
    jp: "会社概要",
  },
  contact: {
    en: "Contact",
    jp: "お問い合わせ",
  },

  // CTAs
  listMyCar: {
    en: "List My Car",
    jp: "車を出品する",
  },
  browseVehicles: {
    en: "Browse Vehicles",
    jp: "車両を探す",
  },
  sellWithUs: {
    en: "Sell With Us",
    jp: "私たちと売る",
  },
  startYourProject: {
    en: "Start Your Project",
    jp: "プロジェクトを始める",
  },

  // Hero Section
  heroTitle: {
    en: "Okinawa's Premier Vehicle Marketplace",
    jp: "沖縄の一流車両マーケットプレイス",
  },
  heroSubtitle: {
    en: "Buy, sell, and discover vehicles with confidence",
    jp: "自信を持って車を買い、売り、発見する",
  },

  // Featured Vehicles
  featuredVehicles: {
    en: "Featured Vehicles",
    jp: "おすすめ車両",
  },
  viewAll: {
    en: "View All",
    jp: "すべて見る",
  },

  // Services
  ourServices: {
    en: "Our Services",
    jp: "私たちのサービス",
  },
  forSellers: {
    en: "For Sellers",
    jp: "売り手向け",
  },
  forBuyers: {
    en: "For Buyers",
    jp: "買い手向け",
  },
  forBusinesses: {
    en: "For Businesses",
    jp: "企業向け",
  },

  // About
  aboutUs: {
    en: "About Us",
    jp: "私たちについて",
  },
  aboutPlacebo: {
    en: "About Placebo Marketing",
    jp: "プラセボマーケティングについて",
  },

  // Footer
  privacyPolicy: {
    en: "Privacy Policy",
    jp: "プライバシーポリシー",
  },
  termsOfService: {
    en: "Terms of Service",
    jp: "利用規約",
  },
  sellerRegistration: {
    en: "Seller Registration",
    jp: "販売者登録",
  },
  sellerTools: {
    en: "Seller Tools",
    jp: "売り手ツール",
  },
  buyerFAQs: {
    en: "Buyer FAQs",
    jp: "買い手よくある質問",
  },
}

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>("en")

  // Load language preference from localStorage on client side
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "jp")) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Save language preference to localStorage
  useEffect(() => {
    localStorage.setItem("language", language)
  }, [language])

  // Translation function
  const t = (key: string): string => {
    if (translations[key]) {
      return translations[key][language]
    }
    console.warn(`Translation missing for key: ${key}`)
    return key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
