// Translation service using Google Translate API
// In production, you would use the actual Google Translate API

interface TranslationResult {
  translatedText: string
  detectedLanguage: string
  confidence: number
}

interface TranslationCache {
  [key: string]: TranslationResult
}

// Simple in-memory cache for translations
const translationCache: TranslationCache = {}

// Mock translation function - replace with actual Google Translate API
const mockTranslate = async (text: string, targetLang: string): Promise<TranslationResult> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Mock translations for demo
  const mockTranslations: { [key: string]: { [key: string]: string } } = {
    en: {
      ja: {
        "Hello, is this car still available?": "こんにちは、この車はまだ利用可能ですか？",
        "Thank you for your interest! The vehicle is still available. Would you like to schedule a test drive?":
          "お問い合わせありがとうございます！車両はまだ利用可能です。試乗の予約をしませんか？",
        "Hi, I'm interested in your vehicle. Is it still available? When would be a good time for a test drive?":
          "こんにちは、あなたの車に興味があります。まだ利用可能ですか？試乗はいつ頃が良いでしょうか？",
        "Yes, the car is still available. We can arrange a test drive this weekend.":
          "はい、車はまだ利用可能です。今週末に試乗を手配できます。",
        "What is the maintenance history of this vehicle?": "この車両のメンテナンス履歴はどうですか？",
        "The vehicle has been well maintained with regular service records.":
          "車両は定期的なサービス記録で良好に維持されています。",
      },
    },
    ja: {
      en: {
        "こんにちは、この車はまだ利用可能ですか？": "Hello, is this car still available?",
        "お問い合わせありがとうございます！車両はまだ利用可能です。試乗の予約をしませんか？":
          "Thank you for your interest! The vehicle is still available. Would you like to schedule a test drive?",
        "こんにちは、あなたの車に興味があります。まだ利用可能ですか？試乗はいつ頃が良いでしょうか？":
          "Hi, I'm interested in your vehicle. Is it still available? When would be a good time for a test drive?",
        "はい、車はまだ利用可能です。今週末に試乗を手配できます。":
          "Yes, the car is still available. We can arrange a test drive this weekend.",
        "この車両のメンテナンス履歴はどうですか？": "What is the maintenance history of this vehicle?",
        "車両は定期的なサービス記録で良好に維持されています。":
          "The vehicle has been well maintained with regular service records.",
      },
    },
  }

  // Detect source language (simplified)
  const detectedLang = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(text) ? "ja" : "en"

  // Get translation
  const translatedText =
    mockTranslations[detectedLang]?.[targetLang]?.[text] || `[Translated to ${targetLang.toUpperCase()}] ${text}`

  return {
    translatedText,
    detectedLanguage: detectedLang,
    confidence: 0.95,
  }
}

export const translateText = async (text: string, targetLanguage: string): Promise<TranslationResult> => {
  const cacheKey = `${text}_${targetLanguage}`

  // Check cache first
  if (translationCache[cacheKey]) {
    return translationCache[cacheKey]
  }

  try {
    const result = await mockTranslate(text, targetLanguage)

    // Cache the result
    translationCache[cacheKey] = result

    return result
  } catch (error) {
    console.error("Translation error:", error)
    throw new Error("Translation failed. Please try again.")
  }
}

export const detectLanguage = (text: string): string => {
  // Simple language detection
  if (/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(text)) {
    return "ja"
  }
  return "en"
}

export const getLanguageName = (code: string): string => {
  const languages: { [key: string]: string } = {
    en: "English",
    ja: "日本語",
    es: "Español",
    fr: "Français",
    de: "Deutsch",
    ko: "한국어",
    zh: "中文",
  }
  return languages[code] || code.toUpperCase()
}
