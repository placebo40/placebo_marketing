"use client"

import { useState, useCallback } from "react"
import type { LoginRequest, RegisterRequest } from "@/contexts/auth-context"

// Form validation types
export interface FormErrors {
  [key: string]: string[]
}

export interface LoginFormData {
  email: string
  password: string
  rememberMe: boolean
}

export interface RegisterFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  userType: "guest" | "seller" | "dealer"
  acceptTerms: boolean
}

// Login form hook
export function useLoginForm() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {}

    // Email validation
    if (!formData.email) {
      newErrors.email = ["Email is required"]
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = ["Please enter a valid email address"]
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = ["Password is required"]
    } else if (formData.password.length < 6) {
      newErrors.password = ["Password must be at least 6 characters"]
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  const updateField = useCallback(
    (field: keyof LoginFormData, value: string | boolean) => {
      setFormData((prev) => ({ ...prev, [field]: value }))
      // Clear field error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: [] }))
      }
    },
    [errors],
  )

  const getLoginRequest = useCallback(
    (): LoginRequest => ({
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      rememberMe: formData.rememberMe,
    }),
    [formData],
  )

  const reset = useCallback(() => {
    setFormData({
      email: "",
      password: "",
      rememberMe: false,
    })
    setErrors({})
    setIsSubmitting(false)
  }, [])

  return {
    formData,
    errors,
    isSubmitting,
    setIsSubmitting,
    validateForm,
    updateField,
    getLoginRequest,
    reset,
    hasErrors: Object.keys(errors).length > 0,
  }
}

// Register form hook
export function useRegisterForm() {
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    userType: "guest",
    acceptTerms: false,
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {}

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = ["First name is required"]
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = ["First name must be at least 2 characters"]
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = ["Last name is required"]
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = ["Last name must be at least 2 characters"]
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = ["Email is required"]
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = ["Please enter a valid email address"]
    }

    // Phone validation (optional but must be valid if provided)
    if (formData.phone && !/^\+?[\d\s\-()]+$/.test(formData.phone)) {
      newErrors.phone = ["Please enter a valid phone number"]
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = ["Password is required"]
    } else {
      const passwordErrors: string[] = []
      if (formData.password.length < 8) {
        passwordErrors.push("Password must be at least 8 characters")
      }
      if (!/(?=.*[a-z])/.test(formData.password)) {
        passwordErrors.push("Password must contain at least one lowercase letter")
      }
      if (!/(?=.*[A-Z])/.test(formData.password)) {
        passwordErrors.push("Password must contain at least one uppercase letter")
      }
      if (!/(?=.*\d)/.test(formData.password)) {
        passwordErrors.push("Password must contain at least one number")
      }
      if (passwordErrors.length > 0) {
        newErrors.password = passwordErrors
      }
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = ["Please confirm your password"]
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = ["Passwords do not match"]
    }

    // Terms acceptance validation
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = ["You must accept the terms and conditions"]
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  const updateField = useCallback(
    (field: keyof RegisterFormData, value: string | boolean) => {
      setFormData((prev) => ({ ...prev, [field]: value }))
      // Clear field error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: [] }))
      }
    },
    [errors],
  )

  const getRegisterRequest = useCallback(
    (): RegisterRequest => ({
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim() || undefined,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      userType: formData.userType,
      acceptTerms: formData.acceptTerms,
    }),
    [formData],
  )

  const reset = useCallback(() => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      userType: "guest",
      acceptTerms: false,
    })
    setErrors({})
    setIsSubmitting(false)
  }, [])

  return {
    formData,
    errors,
    isSubmitting,
    setIsSubmitting,
    validateForm,
    updateField,
    getRegisterRequest,
    reset,
    hasErrors: Object.keys(errors).length > 0,
  }
}

// Password strength checker
export function usePasswordStrength(password: string) {
  const getStrength = useCallback(
    (
      pwd: string,
    ): {
      score: number
      label: string
      color: string
      suggestions: string[]
    } => {
      if (!pwd) {
        return { score: 0, label: "Enter a password", color: "gray", suggestions: [] }
      }

      let score = 0
      const suggestions: string[] = []

      // Length check
      if (pwd.length >= 8) score += 1
      else suggestions.push("Use at least 8 characters")

      // Lowercase check
      if (/[a-z]/.test(pwd)) score += 1
      else suggestions.push("Add lowercase letters")

      // Uppercase check
      if (/[A-Z]/.test(pwd)) score += 1
      else suggestions.push("Add uppercase letters")

      // Number check
      if (/\d/.test(pwd)) score += 1
      else suggestions.push("Add numbers")

      // Special character check
      if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) score += 1
      else suggestions.push("Add special characters")

      // Length bonus
      if (pwd.length >= 12) score += 1

      const labels = ["Very Weak", "Weak", "Fair", "Good", "Strong", "Very Strong"]
      const colors = ["red", "orange", "yellow", "blue", "green", "green"]

      return {
        score: Math.min(score, 5),
        label: labels[Math.min(score, 5)],
        color: colors[Math.min(score, 5)],
        suggestions: suggestions.slice(0, 3), // Show top 3 suggestions
      }
    },
    [],
  )

  return getStrength(password)
}
