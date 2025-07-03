"use client"

import { useState } from "react"
import { translateText, type TranslationResult } from "@/lib/translation-service"

interface UseTranslationReturn {
  translate: (text: string, targetLanguage: string) => Promise<TranslationResult>
  isTranslating: boolean
  error: string | null
  clearError: () => void
}

export const useTranslation = (): UseTranslationReturn => {
  const [isTranslating, setIsTranslating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const translate = async (text: string, targetLanguage: string): Promise<TranslationResult> => {
    setIsTranslating(true)
    setError(null)

    try {
      const result = await translateText(text, targetLanguage)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Translation failed"
      setError(errorMessage)
      throw err
    } finally {
      setIsTranslating(false)
    }
  }

  const clearError = () => setError(null)

  return {
    translate,
    isTranslating,
    error,
    clearError,
  }
}
