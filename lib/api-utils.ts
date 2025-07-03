import type { APIConfig } from "./api-config" // Declare or import APIConfig

// API configuration
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  timeout: 10000,
  retryAttempts: 3,
  retryDelay: 1000,
}

// Error types
export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public errors?: Record<string, string[]>,
  ) {
    super(message)
    this.name = "APIError"
  }
}

export class NetworkError extends Error {
  constructor(message = "Network error occurred") {
    super(message)
    this.name = "NetworkError"
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public errors: Record<string, string[]>,
  ) {
    super(message)
    this.name = "ValidationError"
  }
}

// Request interceptor type
export type RequestInterceptor = (config: RequestOptions) => RequestOptions | Promise<RequestOptions>

// Response interceptor type
export type ResponseInterceptor = (response: APIResponse) => APIResponse | Promise<APIResponse>

// Error interceptor type
export type ErrorInterceptor = (error: Error) => Error | Promise<Error>

// Request configuration
export interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
  headers?: Record<string, string>
  body?: any
  timeout?: number
  retries?: number
  requireAuth?: boolean
}

// API response type
export interface APIResponse<T = any> {
  data: T
  status: number
  statusText: string
  headers: Record<string, string>
}

// API client class
class APIClient {
  private config: APIConfig
  private token: string | null = null
  private refreshToken: string | null = null
  private isRefreshing = false
  private refreshPromise: Promise<string> | null = null

  constructor(config: Partial<APIConfig> = {}) {
    this.config = {
      baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
      timeout: 10000,
      retries: 3,
      retryDelay: 1000,
      ...config,
    }

    // Load tokens from localStorage if available
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token")
      this.refreshToken = localStorage.getItem("refresh_token")
    }
  }

  // Set authentication tokens
  setTokens(token: string, refreshToken?: string) {
    this.token = token
    if (refreshToken) {
      this.refreshToken = refreshToken
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token)
      if (refreshToken) {
        localStorage.setItem("refresh_token", refreshToken)
      }
    }
  }

  // Clear authentication tokens
  clearTokens() {
    this.token = null
    this.refreshToken = null

    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token")
      localStorage.removeItem("refresh_token")
    }
  }

  // Get current token
  getToken(): string | null {
    return this.token
  }

  // Refresh authentication token
  private async refreshAuthToken(): Promise<string> {
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise
    }

    if (!this.refreshToken) {
      throw new APIError("No refresh token available", 401, "NO_REFRESH_TOKEN")
    }

    this.isRefreshing = true
    this.refreshPromise = this.performTokenRefresh()

    try {
      const newToken = await this.refreshPromise
      this.isRefreshing = false
      this.refreshPromise = null
      return newToken
    } catch (error) {
      this.isRefreshing = false
      this.refreshPromise = null
      this.clearTokens()
      throw error
    }
  }

  private async performTokenRefresh(): Promise<string> {
    // In a real app, this would call the refresh token endpoint
    // For now, we'll simulate it
    await new Promise((resolve) => setTimeout(resolve, 500))

    const newToken = Math.random().toString(36).substring(2) + Date.now().toString(36)
    const newRefreshToken = Math.random().toString(36).substring(2) + Date.now().toString(36)

    this.setTokens(newToken, newRefreshToken)
    return newToken
  }

  // Make HTTP request with retry logic
  async request<T = any>(endpoint: string, options: RequestOptions = {}): Promise<APIResponse<T>> {
    const {
      method = "GET",
      headers = {},
      body,
      timeout = this.config.timeout,
      retries = this.config.retries,
      requireAuth = false,
    } = options

    let lastError: Error | null = null

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        // Add authentication header if required and token is available
        if (requireAuth && this.token) {
          headers["Authorization"] = `Bearer ${this.token}`
        }

        // Add default headers
        headers["Content-Type"] = headers["Content-Type"] || "application/json"
        headers["Accept"] = headers["Accept"] || "application/json"

        // Create request configuration
        const requestConfig: RequestInit = {
          method,
          headers,
          signal: AbortSignal.timeout(timeout),
        }

        // Add body for non-GET requests
        if (body && method !== "GET") {
          requestConfig.body = typeof body === "string" ? body : JSON.stringify(body)
        }

        // Make the request
        const url = `${this.config.baseURL}${endpoint}`
        const response = await fetch(url, requestConfig)

        // Handle authentication errors
        if (response.status === 401 && requireAuth && this.refreshToken) {
          try {
            const newToken = await this.refreshAuthToken()
            headers["Authorization"] = `Bearer ${newToken}`

            // Retry the request with new token
            const retryResponse = await fetch(url, {
              ...requestConfig,
              headers,
            })

            if (!retryResponse.ok) {
              throw new APIError(`Request failed: ${retryResponse.statusText}`, retryResponse.status)
            }

            const data = await this.parseResponse<T>(retryResponse)
            return {
              data,
              status: retryResponse.status,
              statusText: retryResponse.statusText,
              headers: this.parseHeaders(retryResponse.headers),
            }
          } catch (refreshError) {
            this.clearTokens()
            throw new APIError("Authentication failed", 401, "AUTH_FAILED")
          }
        }

        // Handle other HTTP errors
        if (!response.ok) {
          const errorData = await this.parseErrorResponse(response)
          throw new APIError(
            errorData.message || `Request failed: ${response.statusText}`,
            response.status,
            errorData.code,
            errorData.errors,
          )
        }

        // Parse successful response
        const data = await this.parseResponse<T>(response)
        return {
          data,
          status: response.status,
          statusText: response.statusText,
          headers: this.parseHeaders(response.headers),
        }
      } catch (error) {
        lastError = error as Error

        // Don't retry on certain errors
        if (error instanceof APIError && [400, 401, 403, 404, 422].includes(error.status)) {
          throw error
        }

        // Don't retry on validation errors
        if (error instanceof ValidationError) {
          throw error
        }

        // Wait before retrying (exponential backoff)
        if (attempt < retries) {
          const delay = this.config.retryDelay * Math.pow(2, attempt)
          await new Promise((resolve) => setTimeout(resolve, delay))
        }
      }
    }

    // If all retries failed, throw the last error
    if (lastError) {
      if (lastError.name === "AbortError") {
        throw new NetworkError("Request timeout")
      }
      if (lastError instanceof TypeError && lastError.message.includes("fetch")) {
        throw new NetworkError("Network connection failed")
      }
      throw lastError
    }

    throw new NetworkError("Request failed after all retries")
  }

  // Parse response data
  private async parseResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get("content-type")

    if (contentType?.includes("application/json")) {
      return await response.json()
    }

    if (contentType?.includes("text/")) {
      return (await response.text()) as unknown as T
    }

    return (await response.blob()) as unknown as T
  }

  // Parse error response
  private async parseErrorResponse(response: Response): Promise<{
    message: string
    code?: string
    errors?: Record<string, string[]>
  }> {
    try {
      const contentType = response.headers.get("content-type")

      if (contentType?.includes("application/json")) {
        return await response.json()
      }

      return {
        message: (await response.text()) || response.statusText,
      }
    } catch {
      return {
        message: response.statusText || "Unknown error occurred",
      }
    }
  }

  // Parse response headers
  private parseHeaders(headers: Headers): Record<string, string> {
    const result: Record<string, string> = {}
    headers.forEach((value, key) => {
      result[key] = value
    })
    return result
  }

  // Convenience methods
  async get<T = any>(endpoint: string, options: Omit<RequestOptions, "method"> = {}): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "GET" })
  }

  async post<T = any>(
    endpoint: string,
    body?: any,
    options: Omit<RequestOptions, "method" | "body"> = {},
  ): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "POST", body })
  }

  async put<T = any>(
    endpoint: string,
    body?: any,
    options: Omit<RequestOptions, "method" | "body"> = {},
  ): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "PUT", body })
  }

  async patch<T = any>(
    endpoint: string,
    body?: any,
    options: Omit<RequestOptions, "method" | "body"> = {},
  ): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "PATCH", body })
  }

  async delete<T = any>(endpoint: string, options: Omit<RequestOptions, "method"> = {}): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" })
  }
}

// Create and export default API client instance
export const apiClient = new APIClient()

// Request/Response interceptors
class InterceptorManager {
  private requestInterceptors: RequestInterceptor[] = []
  private responseInterceptors: ResponseInterceptor[] = []
  private errorInterceptors: ErrorInterceptor[] = []

  addRequestInterceptor(interceptor: RequestInterceptor): () => void {
    this.requestInterceptors.push(interceptor)
    return () => {
      const index = this.requestInterceptors.indexOf(interceptor)
      if (index > -1) {
        this.requestInterceptors.splice(index, 1)
      }
    }
  }

  addResponseInterceptor(interceptor: ResponseInterceptor): () => void {
    this.responseInterceptors.push(interceptor)
    return () => {
      const index = this.responseInterceptors.indexOf(interceptor)
      if (index > -1) {
        this.responseInterceptors.splice(index, 1)
      }
    }
  }

  addErrorInterceptor(interceptor: ErrorInterceptor): () => void {
    this.errorInterceptors.push(interceptor)
    return () => {
      const index = this.errorInterceptors.indexOf(interceptor)
      if (index > -1) {
        this.errorInterceptors.splice(index, 1)
      }
    }
  }

  async processRequest(config: RequestOptions): Promise<RequestOptions> {
    let processedConfig = config
    for (const interceptor of this.requestInterceptors) {
      processedConfig = await interceptor(processedConfig)
    }
    return processedConfig
  }

  async processResponse(response: APIResponse): Promise<APIResponse> {
    let processedResponse = response
    for (const interceptor of this.responseInterceptors) {
      processedResponse = await interceptor(processedResponse)
    }
    return processedResponse
  }

  async processError(error: Error): Promise<Error> {
    let processedError = error
    for (const interceptor of this.errorInterceptors) {
      processedError = await interceptor(processedError)
    }
    return processedError
  }
}

export const interceptors = new InterceptorManager()

// Utility functions
export const isAPIError = (error: unknown): error is APIError => {
  return error instanceof APIError
}

export const isNetworkError = (error: unknown): error is NetworkError => {
  return error instanceof NetworkError
}

export const isValidationError = (error: unknown): error is ValidationError => {
  return error instanceof ValidationError
}

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof APIError || error instanceof NetworkError || error instanceof ValidationError) {
    return error.message
  }
  if (error instanceof Error) {
    return error.message
  }
  return "An unknown error occurred"
}

export const getValidationErrors = (error: unknown): Record<string, string[]> => {
  if (error instanceof APIError && error.errors) {
    return error.errors
  }
  if (error instanceof ValidationError) {
    return error.errors
  }
  return {}
}
