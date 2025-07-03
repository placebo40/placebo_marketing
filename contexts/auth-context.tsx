"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"
import { useRouter } from "next/navigation"

// Types
interface User {
  id: string
  email: string
  name: string
  userType: "admin" | "dealer" | "seller" | "guest"
  avatar?: string
  createdAt: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  clearError: () => void
}

// Mock users database
const MOCK_USERS: User[] = [
  {
    id: "1",
    email: "admin@placebomarketing.com",
    name: "Admin User",
    userType: "admin",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    email: "dealer@okinawacars.com",
    name: "Dealer User",
    userType: "dealer",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    email: "seller@example.com",
    name: "Seller User",
    userType: "seller",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "4",
    email: "john.doe@example.com",
    name: "John Doe",
    userType: "guest",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "5",
    email: "taro.tanaka@example.com",
    name: "Taro Tanaka",
    userType: "guest",
    createdAt: "2024-01-01T00:00:00Z",
  },
]

// Action types
type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGIN_FAILURE"; payload: string }
  | { type: "LOGOUT" }
  | { type: "CLEAR_ERROR" }
  | { type: "SET_LOADING"; payload: boolean }

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
}

// Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN_START":
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      }
    case "LOGIN_FAILURE":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      }
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      }
    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      }
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      }
    default:
      return state
  }
}

// Context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Provider
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)
  const router = useRouter()

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = localStorage.getItem("auth_user")
        if (storedUser) {
          const user = JSON.parse(storedUser)
          dispatch({ type: "LOGIN_SUCCESS", payload: user })
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
        localStorage.removeItem("auth_user")
      } finally {
        dispatch({ type: "SET_LOADING", payload: false })
      }
    }

    initializeAuth()
  }, [])

  // Set cookie helper
  const setCookie = (name: string, value: string, days = 7) => {
    const expires = new Date()
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;samesite=lax`
  }

  // Clear cookie helper
  const clearCookie = (name: string) => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;samesite=lax`
  }

  const login = async (email: string, password: string): Promise<void> => {
    dispatch({ type: "LOGIN_START" })

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Find user in mock database
      const user = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase())

      if (!user) {
        throw new Error("No account found with this email address")
      }

      // Check password (all mock users use "password123")
      if (password !== "password123") {
        throw new Error("Incorrect password")
      }

      // Store user in localStorage and cookies
      localStorage.setItem("auth_user", JSON.stringify(user))
      setCookie("auth_token", "mock_token_" + user.id)
      setCookie("user_type", user.userType)

      dispatch({ type: "LOGIN_SUCCESS", payload: user })

      // Small delay to ensure state is updated before redirect
      setTimeout(() => {
        // Redirect based on user type
        switch (user.userType) {
          case "admin":
            router.push("/admin")
            break
          case "dealer":
          case "seller":
            router.push("/seller-dashboard")
            break
          case "guest":
          default:
            router.push("/guest-dashboard")
            break
        }
      }, 100)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Login failed"
      dispatch({ type: "LOGIN_FAILURE", payload: errorMessage })
      throw error
    }
  }

  const logout = () => {
    // Clear localStorage and cookies
    localStorage.removeItem("auth_user")
    clearCookie("auth_token")
    clearCookie("user_type")

    dispatch({ type: "LOGOUT" })
    router.push("/")
  }

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" })
  }

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    clearError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Hook for guest-only routes
export function useGuestOnly() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, isLoading, router])

  return { isLoading, shouldRender: !isAuthenticated }
}

// Hook for protected routes
export function useRequireAuth() {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  return { isLoading, isAuthenticated, user }
}
