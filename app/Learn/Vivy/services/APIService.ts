import { APIError, APIRequestConfig } from "../types"
import { API_CONFIG, ERROR_MESSAGES } from "../utils"

/**
 * Base API service with error handling, retries, and proper HTTP client
 */
export class APIService {
  private baseURL: string
  private defaultConfig: APIRequestConfig

  constructor(baseURL = API_CONFIG.BASE_URL) {
    this.baseURL = baseURL
    this.defaultConfig = {
      timeout: API_CONFIG.TIMEOUT,
      retries: API_CONFIG.RETRY_ATTEMPTS,
      retryDelay: API_CONFIG.RETRY_DELAY,
    }
  }

  /**
   * Make an HTTP request with proper error handling and retries
   */
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit,
    config: APIRequestConfig = {}
  ): Promise<T> {
    const fullConfig = { ...this.defaultConfig, ...config }
    const url = this.buildURL(endpoint)

    let lastError: Error

    for (let attempt = 0; attempt < (fullConfig.retries || 1); attempt++) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(
          () => controller.abort("Request timeout"),
          fullConfig.timeout
        )

        const response = await fetch(url, {
          ...options,
          headers: {
            "Content-Type": "application/json",
            ...options.headers,
          },
          signal: fullConfig.signal || controller.signal,
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          const errorData = await this.handleErrorResponse(response)
          const error: any = new Error(errorData.error)
          error.response = errorData // Attach full response data to error
          error.status = response.status
          throw error
        }

        return await response.json()
      } catch (error) {
        lastError = error as Error

        // Don't retry on certain errors
        const errorMessage = (error as Error)?.message || ""
        if (
          error instanceof TypeError ||
          (error as any).name === "AbortError" ||
          errorMessage.includes("400") ||
          errorMessage.includes("401") ||
          errorMessage.includes("403") ||
          errorMessage.includes("404")
        ) {
          throw this.createAPIError(error as Error, url)
        }

        // Wait before retrying (with exponential backoff)
        if (attempt < (fullConfig.retries || 1) - 1) {
          const delay = (fullConfig.retryDelay || 1000) * Math.pow(2, attempt)
          await this.sleep(delay)
        }
      }
    }

    throw this.createAPIError(lastError!, url)
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, config?: APIRequestConfig): Promise<T> {
    return this.makeRequest<T>(endpoint, { method: "GET" }, config)
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    data?: any,
    config?: APIRequestConfig
  ): Promise<T> {
    return this.makeRequest<T>(
      endpoint,
      {
        method: "POST",
        body: data ? JSON.stringify(data) : undefined,
      },
      config
    )
  }

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    data?: any,
    config?: APIRequestConfig
  ): Promise<T> {
    return this.makeRequest<T>(
      endpoint,
      {
        method: "PATCH",
        body: data ? JSON.stringify(data) : undefined,
      },
      config
    )
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, config?: APIRequestConfig): Promise<T> {
    return this.makeRequest<T>(endpoint, { method: "DELETE" }, config)
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    data?: any,
    config?: APIRequestConfig
  ): Promise<T> {
    return this.makeRequest<T>(
      endpoint,
      {
        method: "PUT",
        body: data ? JSON.stringify(data) : undefined,
      },
      config
    )
  }

  /**
   * Build full URL from endpoint
   */
  private buildURL(endpoint: string): string {
    if (endpoint.startsWith("http")) {
      return endpoint
    }

    const cleanBaseURL = this.baseURL.replace(/\/$/, "")
    const cleanEndpoint = endpoint.replace(/^\//, "")

    return `${cleanBaseURL}/${cleanEndpoint}`
  }

  /**
   * Handle error responses from the API
   */
  private async handleErrorResponse(response: Response): Promise<APIError> {
    let errorData: any

    try {
      errorData = await response.json()
    } catch {
      errorData = { error: `HTTP ${response.status}: ${response.statusText}` }
    }

    return {
      error: errorData.error || this.getDefaultErrorMessage(response.status),
      details: errorData.details || errorData.message,
      status: response.status,
      timestamp: new Date().toISOString(),
      suggestedModels: errorData.suggestedModels, // Include suggested models from server
      retryable: errorData.retryable, // Include retryable flag from server
    }
  }

  /**
   * Get default error message for HTTP status codes
   */
  private getDefaultErrorMessage(status: number): string {
    switch (status) {
      case 400:
        return ERROR_MESSAGES.VALIDATION_ERROR
      case 401:
        return ERROR_MESSAGES.AUTHENTICATION_ERROR
      case 403:
        return ERROR_MESSAGES.AUTHORIZATION_ERROR
      case 404:
        return ERROR_MESSAGES.NOT_FOUND
      case 500:
        return ERROR_MESSAGES.SERVER_ERROR
      default:
        return ERROR_MESSAGES.UNKNOWN_ERROR
    }
  }

  /**
   * Create a standardized API error
   */
  private createAPIError(error: Error, _url: string): Error {
    const errorMessage = error?.message || ""
    const isNetworkError =
      error.name === "TypeError" && errorMessage.includes("fetch")

    if (isNetworkError) {
      return new Error(ERROR_MESSAGES.NETWORK_ERROR)
    }

    return error
  }

  /**
   * Sleep utility for retries
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  /**
   * Create a request with abort controller
   */
  createAbortController(): AbortController {
    return new AbortController()
  }

  /**
   * Create request config with custom timeout
   */
  createConfig(overrides: Partial<APIRequestConfig> = {}): APIRequestConfig {
    return { ...this.defaultConfig, ...overrides }
  }
}

// Create default instance
export const apiService = new APIService()
