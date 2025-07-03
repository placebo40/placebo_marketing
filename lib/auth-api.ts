import type {
  LoginRequest,
  RegisterRequest,
  User,
  UpdateProfileRequest,
  ChangePasswordRequest,
  PasswordResetRequest,
  PasswordResetConfirm,
} from "@/types/auth"

// API Response types
export interface AuthResponse {
  success: boolean
  user?: User
  token?: string
  refreshToken?: string
  message?: string
  errors?: Record<string, string[]>
}

export interface TokenResponse {
  token: string
  refreshToken: string
  expiresIn: number
}

// Mock database of users
const MOCK_USERS: User[] = [
  {
    id: "1",
    email: "john.doe@example.com",
    firstName: "John",
    lastName: "Doe",
    phone: "+81-90-1234-5678",
    userType: "seller",
    status: "active",
    isVerified: true,
    verificationLevel: "premium",
    createdAt: "2024-01-15T10:30:00Z",
    lastLoginAt: "2024-12-30T14:22:00Z",
    profile: {
      bio: "Experienced car seller in Okinawa",
      location: "Naha, Okinawa",
      preferences: {
        language: "en",
        notifications: { email: true, sms: true, push: true },
        privacy: { showEmail: false, showPhone: true },
      },
    },
  },
  {
    id: "2",
    email: "taro.tanaka@example.com",
    firstName: "Taro",
    lastName: "Tanaka",
    phone: "+81-90-8765-4321",
    userType: "guest",
    status: "active",
    isVerified: false,
    createdAt: "2024-02-20T09:15:00Z",
    lastLoginAt: "2024-12-29T16:45:00Z",
    profile: {
      location: "Okinawa City, Okinawa",
      preferences: {
        language: "ja",
        notifications: { email: true, sms: false, push: true },
        privacy: { showEmail: false, showPhone: false },
      },
    },
  },
  {
    id: "3",
    email: "admin@placebomarketing.com",
    firstName: "Admin",
    lastName: "User",
    userType: "admin",
    status: "active",
    isVerified: true,
    verificationLevel: "dealership",
    createdAt: "2024-01-01T00:00:00Z",
    lastLoginAt: "2024-12-30T18:30:00Z",
    profile: {
      preferences: {
        language: "en",
        notifications: { email: true, sms: true, push: true },
        privacy: { showEmail: true, showPhone: true },
      },
    },
  },
  {
    id: "4",
    email: "dealer@okinawacars.com",
    firstName: "Kenji",
    lastName: "Yamamoto",
    phone: "+81-98-123-4567",
    userType: "dealer",
    status: "active",
    isVerified: true,
    verificationLevel: "dealership",
    createdAt: "2024-01-10T12:00:00Z",
    lastLoginAt: "2024-12-30T11:15:00Z",
    profile: {
      bio: "Certified dealer with 15+ years experience",
      location: "Ginowan, Okinawa",
      website: "https://okinawacars.com",
      preferences: {
        language: "ja",
        notifications: { email: true, sms: true, push: false },
        privacy: { showEmail: true, showPhone: true },
      },
    },
  },
]

// Mock stored tokens (in real app, this would be server-side)
const MOCK_TOKENS = new Map<string, { userId: string; expiresAt: number }>()

// Utility functions
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const generateToken = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validatePassword = (password: string): string[] => {
  const errors: string[] = []
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long")
  }
  if (!/(?=.*[a-z])/.test(password)) {
    errors.push("Password must contain at least one lowercase letter")
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push("Password must contain at least one uppercase letter")
  }
  if (!/(?=.*\d)/.test(password)) {
    errors.push("Password must contain at least one number")
  }
  return errors
}

// API Functions
export const authAPI = {
  // Login user
  async login(request: LoginRequest): Promise<AuthResponse> {
    await delay(1000 + Math.random() * 1000) // Simulate network delay

    const { email, password } = request

    // Validate input
    if (!email || !password) {
      return {
        success: false,
        message: "Email and password are required",
        errors: {
          email: !email ? ["Email is required"] : [],
          password: !password ? ["Password is required"] : [],
        },
      }
    }

    if (!validateEmail(email)) {
      return {
        success: false,
        message: "Invalid email format",
        errors: { email: ["Please enter a valid email address"] },
      }
    }

    // Find user
    const user = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase())

    if (!user) {
      return {
        success: false,
        message: "Invalid credentials",
        errors: { email: ["No account found with this email address"] },
      }
    }

    // Simulate password check (in real app, compare hashed passwords)
    if (password !== "password123") {
      return {
        success: false,
        message: "Invalid credentials",
        errors: { password: ["Incorrect password"] },
      }
    }

    // Check user status
    if (user.status === "suspended") {
      return {
        success: false,
        message: "Account suspended",
        errors: { general: ["Your account has been suspended. Please contact support."] },
      }
    }

    if (user.status === "banned") {
      return {
        success: false,
        message: "Account banned",
        errors: { general: ["Your account has been banned. Please contact support."] },
      }
    }

    // Generate tokens
    const token = generateToken()
    const refreshToken = generateToken()
    const expiresIn = 24 * 60 * 60 * 1000 // 24 hours

    // Store token
    MOCK_TOKENS.set(token, {
      userId: user.id,
      expiresAt: Date.now() + expiresIn,
    })

    // Update last login
    user.lastLoginAt = new Date().toISOString()

    return {
      success: true,
      user,
      token,
      refreshToken,
      message: "Login successful",
    }
  },

  // Register new user
  async register(request: RegisterRequest): Promise<AuthResponse> {
    await delay(1500 + Math.random() * 1000) // Simulate network delay

    const { email, password, confirmPassword, firstName, lastName, phone, userType, acceptTerms } = request

    // Validate input
    const errors: Record<string, string[]> = {}

    if (!email) {
      errors.email = ["Email is required"]
    } else if (!validateEmail(email)) {
      errors.email = ["Please enter a valid email address"]
    } else if (MOCK_USERS.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      errors.email = ["An account with this email already exists"]
    }

    if (!password) {
      errors.password = ["Password is required"]
    } else {
      const passwordErrors = validatePassword(password)
      if (passwordErrors.length > 0) {
        errors.password = passwordErrors
      }
    }

    if (!confirmPassword) {
      errors.confirmPassword = ["Please confirm your password"]
    } else if (password !== confirmPassword) {
      errors.confirmPassword = ["Passwords do not match"]
    }

    if (!firstName) {
      errors.firstName = ["First name is required"]
    }

    if (!lastName) {
      errors.lastName = ["Last name is required"]
    }

    if (!acceptTerms) {
      errors.acceptTerms = ["You must accept the terms and conditions"]
    }

    if (phone && !/^\+?[\d\s\-$$$$]+$/.test(phone)) {
      errors.phone = ["Please enter a valid phone number"]
    }

    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: "Please correct the errors below",
        errors,
      }
    }

    // Create new user
    const newUser: User = {
      id: (MOCK_USERS.length + 1).toString(),
      email: email.toLowerCase(),
      firstName,
      lastName,
      phone,
      userType,
      status: userType === "dealer" ? "pending" : "active", // Dealers need approval
      isVerified: false,
      createdAt: new Date().toISOString(),
      profile: {
        preferences: {
          language: "en",
          notifications: { email: true, sms: false, push: true },
          privacy: { showEmail: false, showPhone: false },
        },
      },
    }

    // Add to mock database
    MOCK_USERS.push(newUser)

    // Generate tokens
    const token = generateToken()
    const refreshToken = generateToken()
    const expiresIn = 24 * 60 * 60 * 1000 // 24 hours

    // Store token
    MOCK_TOKENS.set(token, {
      userId: newUser.id,
      expiresAt: Date.now() + expiresIn,
    })

    return {
      success: true,
      user: newUser,
      token,
      refreshToken,
      message:
        userType === "dealer"
          ? "Registration successful! Your dealer account is pending approval."
          : "Registration successful! Welcome to Placebo Marketing.",
    }
  },

  // Logout user
  async logout(token: string): Promise<{ success: boolean; message: string }> {
    await delay(500) // Simulate network delay

    // Remove token
    MOCK_TOKENS.delete(token)

    return {
      success: true,
      message: "Logged out successfully",
    }
  },

  // Refresh token
  async refreshToken(refreshToken: string): Promise<TokenResponse | null> {
    await delay(500) // Simulate network delay

    // In a real app, you'd validate the refresh token
    // For now, just generate new tokens
    const token = generateToken()
    const newRefreshToken = generateToken()
    const expiresIn = 24 * 60 * 60 * 1000 // 24 hours

    return {
      token,
      refreshToken: newRefreshToken,
      expiresIn,
    }
  },

  // Get current user
  async getCurrentUser(token: string): Promise<User | null> {
    await delay(300) // Simulate network delay

    const tokenData = MOCK_TOKENS.get(token)
    if (!tokenData || tokenData.expiresAt < Date.now()) {
      return null
    }

    const user = MOCK_USERS.find((u) => u.id === tokenData.userId)
    return user || null
  },

  // Update user profile
  async updateProfile(token: string, request: UpdateProfileRequest): Promise<AuthResponse> {
    await delay(800) // Simulate network delay

    const tokenData = MOCK_TOKENS.get(token)
    if (!tokenData || tokenData.expiresAt < Date.now()) {
      return {
        success: false,
        message: "Authentication required",
      }
    }

    const user = MOCK_USERS.find((u) => u.id === tokenData.userId)
    if (!user) {
      return {
        success: false,
        message: "User not found",
      }
    }

    // Validate input
    const errors: Record<string, string[]> = {}

    if (request.firstName && request.firstName.trim().length === 0) {
      errors.firstName = ["First name cannot be empty"]
    }

    if (request.lastName && request.lastName.trim().length === 0) {
      errors.lastName = ["Last name cannot be empty"]
    }

    if (request.phone && !/^\+?[\d\s\-$$$$]+$/.test(request.phone)) {
      errors.phone = ["Please enter a valid phone number"]
    }

    if (request.website && !/^https?:\/\/.+/.test(request.website)) {
      errors.website = ["Please enter a valid website URL"]
    }

    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: "Please correct the errors below",
        errors,
      }
    }

    // Update user
    if (request.firstName) user.firstName = request.firstName
    if (request.lastName) user.lastName = request.lastName
    if (request.phone !== undefined) user.phone = request.phone

    if (!user.profile) user.profile = {}
    if (request.bio !== undefined) user.profile.bio = request.bio
    if (request.location !== undefined) user.profile.location = request.location
    if (request.website !== undefined) user.profile.website = request.website
    if (request.socialLinks) user.profile.socialLinks = { ...user.profile.socialLinks, ...request.socialLinks }
    if (request.preferences) user.profile.preferences = { ...user.profile.preferences, ...request.preferences }

    return {
      success: true,
      user,
      message: "Profile updated successfully",
    }
  },

  // Change password
  async changePassword(token: string, request: ChangePasswordRequest): Promise<AuthResponse> {
    await delay(1000) // Simulate network delay

    const tokenData = MOCK_TOKENS.get(token)
    if (!tokenData || tokenData.expiresAt < Date.now()) {
      return {
        success: false,
        message: "Authentication required",
      }
    }

    const { currentPassword, newPassword, confirmPassword } = request

    // Validate input
    const errors: Record<string, string[]> = {}

    if (!currentPassword) {
      errors.currentPassword = ["Current password is required"]
    } else if (currentPassword !== "password123") {
      // Mock password check
      errors.currentPassword = ["Current password is incorrect"]
    }

    if (!newPassword) {
      errors.newPassword = ["New password is required"]
    } else {
      const passwordErrors = validatePassword(newPassword)
      if (passwordErrors.length > 0) {
        errors.newPassword = passwordErrors
      }
    }

    if (!confirmPassword) {
      errors.confirmPassword = ["Please confirm your new password"]
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = ["Passwords do not match"]
    }

    if (currentPassword === newPassword) {
      errors.newPassword = ["New password must be different from current password"]
    }

    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: "Please correct the errors below",
        errors,
      }
    }

    return {
      success: true,
      message: "Password changed successfully",
    }
  },

  // Request password reset
  async requestPasswordReset(request: PasswordResetRequest): Promise<{ success: boolean; message: string }> {
    await delay(1000) // Simulate network delay

    const { email } = request

    if (!email || !validateEmail(email)) {
      return {
        success: false,
        message: "Please enter a valid email address",
      }
    }

    const user = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase())

    // Always return success for security (don't reveal if email exists)
    return {
      success: true,
      message: "If an account with this email exists, you will receive password reset instructions.",
    }
  },

  // Confirm password reset
  async confirmPasswordReset(
    request: PasswordResetConfirm,
  ): Promise<{ success: boolean; message: string; errors?: Record<string, string[]> }> {
    await delay(1000) // Simulate network delay

    const { token, newPassword, confirmPassword } = request

    // Validate input
    const errors: Record<string, string[]> = {}

    if (!token) {
      return {
        success: false,
        message: "Invalid or expired reset token",
      }
    }

    if (!newPassword) {
      errors.newPassword = ["New password is required"]
    } else {
      const passwordErrors = validatePassword(newPassword)
      if (passwordErrors.length > 0) {
        errors.newPassword = passwordErrors
      }
    }

    if (!confirmPassword) {
      errors.confirmPassword = ["Please confirm your new password"]
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = ["Passwords do not match"]
    }

    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        message: "Please correct the errors below",
        errors,
      }
    }

    return {
      success: true,
      message: "Password reset successfully. You can now log in with your new password.",
    }
  },
}

// Export mock users for testing
export const getMockUsers = () => MOCK_USERS
export const getMockTokens = () => MOCK_TOKENS
