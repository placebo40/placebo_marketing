"use client"
import { indexedDBService } from "@/lib/indexeddb-service"
import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from "react"
import type {
    TestDriveContextType,
    TestDriveState,
    TestDriveFormState,
    TestDriveFormData,
    TestDriveRequest,
    TestDriveStatus,
    VehicleData,
    TestDriveValidationErrors,
} from "@/types/test-drive"
import { validateTestDriveForm } from "@/lib/form-validation"
import { sendTestDriveEmail } from "@/lib/email-service"
import { getRequestsForSeller, getRequestsByStatus } from "@/lib/test-drive-utils"

// Helper function to ensure array
const ensureArray = <T>(value: T[] | undefined | null): T[] => {\
  return Array.isArray(value) ? value : []
}

// Initial form data
const initialFormData: TestDriveFormData = {\
  name: "",
  email: "",
  phone: "",
  preferredDate: "",
  preferredTime: "",
  meetingLocation: "seller_location",
  customLocation: "",
  licenseType: "",
  drivingExperience: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  additionalNotes: "",
}

// Initial state with guaranteed array
const initialState: TestDriveState = {\
  requests: [], // Ensure this is always an array
  drafts: {},
  isLoading: false,
  error: null,
  lastSync: null,
  offlineQueue: [],
  connectionStatus: "connected",
  realtimeConnectionId: null,
}

const initialFormState: TestDriveFormState = {\
  data: initialFormData,
  errors: {},
  isValid: false,
  isDirty: false,
  lastSaved: null,
  autoSaveEnabled: true,
}

// Action types
type TestDriveAction =\
  | { type: "SET_LOADING"; payload: boolean }\
  | { type: "SET_ERROR"; payload: string | null }\
  | { type: "ADD_REQUEST"; payload: TestDriveRequest }\
  | { type: "UPDATE_REQUEST_STATUS\"; payload: { id: string; status: TestDriveStatus } }\
  | { type: "SET_REQUESTS"; payload: TestDriveRequest[] | undefined | null }\
  | { type: "UPDATE_FORM_DATA\"; payload: { field: keyof TestDriveFormData; value: string } }\
  | { type: "SET_FORM_ERRORS"; payload: TestDriveValidationErrors }\
  | { type: "RESET_FORM" }\
  | { type: "LOAD_DRAFT"; payload: Partial<TestDriveFormData> }\
  | { type: "SET_CONNECTION_STATUS"; payload: "connected" | "disconnected" | "connecting" }\
  | { type: "SET_LAST_SYNC"; payload: Date }

// Reducers with defensive programming
function testDriveReducer(state: TestDriveState, action: TestDriveAction): TestDriveState {\
  switch (action.type) {\
    case "SET_LOADING":\
      return { ...state, isLoading: action.payload }
    case "SET_ERROR":\
      return { ...state, error: action.payload, isLoading: false }
    case "ADD_REQUEST":
      // Ensure requests is always an array before adding
      const currentRequests = ensureArray(state.requests)
      return {
        ...state,\
        requests: [...currentRequests, action.payload],
        isLoading: false,
        error: null,
      }
    case "UPDATE_REQUEST_STATUS":
      // Ensure requests is always an array before mapping
      const requestsToUpdate = ensureArray(state.requests)
      return {
        ...state,\
        requests: requestsToUpdate.map((req) =>\
          req.id === action.payload.id ? { ...req, status: action.payload.status, lastUpdated: new Date() } : req,
        ),
      }
    case "SET_REQUESTS":
      // Always ensure payload is converted to array\
      return { ...state, requests: ensureArray(action.payload) }
    case "SET_CONNECTION_STATUS":\
      return { ...state, connectionStatus: action.payload }
    case "SET_LAST_SYNC":\
      return { ...state, lastSync: action.payload }
    default:
      return state
  }
}

function formReducer(state: TestDriveFormState, action: TestDriveAction): TestDriveFormState {\
  switch (action.type) {\
    case "UPDATE_FORM_DATA":\
      const newData = { ...state.data, [action.payload.field]: action.payload.value }
      return {
        ...state,
        data: newData,
        isDirty: true,
        isValid: Object.keys(validateTestDriveForm(newData)).length === 0,
      }
    case "SET_FORM_ERRORS":
      return { ...state, errors: action.payload }
    case "RESET_FORM":
      return { ...initialFormState }
    case "LOAD_DRAFT":
      const draftData = { ...state.data, ...action.payload }
      return {
        ...state,
        data: draftData,
        isValid: Object.keys(validateTestDriveForm(draftData)).length === 0,
      }
    default:
      return state
  }
}

// Context
const TestDriveContext = createContext<TestDriveContextType | undefined>(undefined)

// Provider component
export function TestDriveProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(testDriveReducer, initialState)
  const [formState, formDispatch] = useReducer(formReducer, initialFormState)

  // Load initial data - memoized to prevent recreation
  const loadStoredRequests = useCallback(async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })

      // Initialize IndexedDB first
      await indexedDBService.init()

      // Get test drive requests from IndexedDB
      const stored = await indexedDBService.getTestDriveRequests()
      
      // Defensive check - ensure we always set an array
      if (stored && Array.isArray(stored)) {
        dispatch({ type: "SET_REQUESTS", payload: stored })
      } else {
        // If stored data is corrupted or not an array, set empty array
        dispatch({ type: "SET_REQUESTS", payload: [] })
      }
    } catch (error) {
      console.error("Failed to load stored requests:", error)
      dispatch({ type: "SET_ERROR", payload: "Failed to load stored data" })
      // Ensure we still have an empty array even on error
      dispatch({ type: "SET_REQUESTS", payload: [] })
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }, [])

  // Load initial data only once
  useEffect(() => {
    loadStoredRequests()
  }, [loadStoredRequests])

  // Auto-save form data - memoized dependencies
  useEffect(() => {
    if (formState.isDirty && formState.autoSaveEnabled) {
      const timer = setTimeout(() => {
        // Auto-save logic would go here
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [formState.isDirty, formState.autoSaveEnabled])

  // Memoized store request function
  const storeRequest = useCallback(async (request: TestDriveRequest) => {
    try {
      // Save to IndexedDB
      await indexedDBService.saveTestDriveRequest(request)

      // Update local state - ensure we're working with arrays
      const currentRequests = ensureArray(state.requests)
      const updatedRequests = currentRequests.filter((r) => r.id !== request.id)
      dispatch({ type: "SET_REQUESTS", payload: [...updatedRequests, request] })
    } catch (error) {
      console.error("Failed to store request:", error)
    }
  }, [state.requests])

  // Memoized schedule test drive function
  const scheduleTestDrive = useCallback(
    async (data: TestDriveFormData, vehicleData: VehicleData) => {
      try {
        dispatch({ type: "SET_LOADING", payload: true })
        dispatch({ type: "SET_ERROR", payload: null })

        // Validate form data
        const errors = validateTestDriveForm(data)
        if (Object.keys(errors).length > 0) {
          formDispatch({ type: "SET_FORM_ERRORS", payload: errors })
          throw new Error("Please fix form errors before submitting")
        }

        // Create request object
        const request: TestDriveRequest = {
          id: `td_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          vehicleId: vehicleData.id,
          vehicleTitle: vehicleData.title,
          vehiclePrice: vehicleData.price,
          sellerEmail: vehicleData.sellerEmail,
          sellerName: vehicleData.sellerName,
          buyerData: data,
          timestamp: new Date(),
          status: "sending",
          lastUpdated: new Date(),
          version: 1,
        }

        // Add to state
        dispatch({ type: "ADD_REQUEST", payload: request })

        // Send email
        const emailResponse = await sendTestDriveEmail(request)

        // Update status based on email result
        const finalStatus: TestDriveStatus = emailResponse.success ? "sent" : "failed"
        dispatch({
          type: "UPDATE_REQUEST_STATUS",
          payload: { id: request.id, status: finalStatus },
        })

        // Store updated request
        const updatedRequest = { ...request, status: finalStatus, response: emailResponse }
        await storeRequest(updatedRequest)

        if (!emailResponse.success) {
          throw new Error(emailResponse.message || "Failed to send test drive request")
        }

        // Reset form on success
        formDispatch({ type: "RESET_FORM" })
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to schedule test drive"
        dispatch({ type: "SET_ERROR", payload: errorMessage })
        throw error
      }
    },
    [storeRequest],
  )

  // Memoized form functions
  const updateFormData = useCallback((field: keyof TestDriveFormData, value: string) => {
    formDispatch({ type: "UPDATE_FORM_DATA", payload: { field, value } })
  }, [])

  const validateForm = useCallback((): boolean => {
    const errors = validateTestDriveForm(formState.data)
    formDispatch({ type: "SET_FORM_ERRORS", payload: errors })
    return Object.keys(errors).length === 0
  }, [formState.data])

  const saveDraft = useCallback(
    async (vehicleId: string) => {
      try {
        await indexedDBService.saveDraft(vehicleId, formState.data)
      } catch (error) {
        console.error("Failed to save draft:", error)
      }
    },
    [formState.data],
  )

  const loadDraft = useCallback(async (vehicleId: string) => {
    try {
      const draftData = await indexedDBService.getDraft(vehicleId)
      if (draftData) {
        formDispatch({ type: "LOAD_DRAFT", payload: draftData })
      }
    } catch (error) {
      console.error("Failed to load draft:", error)
    }
  }, [])

  const clearDraft = useCallback(async (vehicleId: string) => {
    try {
      await indexedDBService.deleteDraft(vehicleId)
    } catch (error) {
      console.error("Failed to clear draft:", error)
    }
  }, [])

  // Memoized request functions with defensive programming
  const getRequestsByVehicleId = useCallback(
    (vehicleId: string): TestDriveRequest[] => {
      const requests = ensureArray(state.requests)
      return requests.filter((req) => req.vehicleId === vehicleId)
    },
    [state.requests],
  )

  const getRequestsForBuyer = useCallback(
    (buyerEmail: string): TestDriveRequest[] => {
      const requests = ensureArray(state.requests)
      return requests.filter((req) => req.buyerData?.email === buyerEmail)
    },
    [state.requests],
  )

  const updateRequestStatus = useCallback(
    async (requestId: string, status: TestDriveStatus) => {
      dispatch({ type: "UPDATE_REQUEST_STATUS", payload: { id: requestId, status } })

      // Update in IndexedDB - with defensive programming
      const requests = ensureArray(state.requests)
      const request = requests.find((r) => r.id === requestId)
      if (request) {
        const updatedRequest = { ...request, status, lastUpdated: new Date() }
        await indexedDBService.saveTestDriveRequest(updatedRequest)
      }
    },
    [state.requests],
  )

  const retryFailedRequest = useCallback(
    async (requestId: string) => {
      const requests = ensureArray(state.requests)
      const request = requests.find((r) => r.id === requestId)
      if (!request) return

      try {
        dispatch({ type: "SET_LOADING", payload: true })
        dispatch({ type: "UPDATE_REQUEST_STATUS", payload: { id: requestId, status: "sending" } })

        const emailResponse = await sendTestDriveEmail(request)
        const finalStatus: TestDriveStatus = emailResponse.success ? "sent" : "failed"

        dispatch({ type: "UPDATE_REQUEST_STATUS", payload: { id: requestId, status: finalStatus } })

        if (!emailResponse.success) {
          throw new Error(emailResponse.message || "Failed to retry request")
        }
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: "Failed to retry request" })
      } finally {
        dispatch({ type: "SET_LOADING", payload: false })
      }
    },
    [state.requests],
  )

  const clearError = useCallback(() => {
    dispatch({ type: "SET_ERROR", payload: null })
  }, [])

  const syncOfflineRequests = useCallback(async () => {
    try {
      const offlineQueue = await indexedDBService.getOfflineQueue()
      // Process offline queue here
      console.log("Syncing offline requests:", offlineQueue.length)
    } catch (error) {
      console.error("Failed to sync offline requests:", error)
    }
  }, [])

  // Context functions that use the utils - memoized with defensive programming
  const getRequestsForSellerContext = useCallback(
    (sellerEmail: string): TestDriveRequest[] => {
      const requests = ensureArray(state.requests)
      return getRequestsForSeller(requests, sellerEmail)
    },
    [state.requests],
  )

  const getRequestsByStatusContext = useCallback(
    (sellerEmail: string, status: TestDriveStatus): TestDriveRequest[] => {
      const requests = ensureArray(state.requests)
      return getRequestsByStatus(requests, sellerEmail, status)
    },
    [state.requests],
  )

  const respondToTestDrive = useCallback(
    async (
      requestId: string,
      responseType: "confirm" | "reschedule" | "decline",
      message: string,
      rescheduleData?: { date: string; time: string },
    ) => {
      const requests = ensureArray(state.requests)
      const request = requests.find((r) => r.id === requestId)
      if (!request) return

      let newStatus: TestDriveStatus
      switch (responseType) {
        case "confirm":
          newStatus = "confirmed"
          break
        case "decline":
          newStatus = "cancelled"
          break
        case "reschedule":
          newStatus = "sent" // Keep as pending with reschedule info
          break
        default:
          return
      }

      await updateRequestStatus(requestId, newStatus)
    },
    [state.requests, updateRequestStatus],
  )

  const syncWithRemote = useCallback(async () => {
    try {
      dispatch({ type: "SET_CONNECTION_STATUS", payload: "connecting" })
      // Simulate sync
      await new Promise((resolve) => setTimeout(resolve, 1000))
      dispatch({ type: "SET_CONNECTION_STATUS", payload: "connected" })
      dispatch({ type: "SET_LAST_SYNC", payload: new Date() })
    } catch (error) {
      dispatch({ type: "SET_CONNECTION_STATUS", payload: "disconnected" })
      dispatch({ type: "SET_ERROR", payload: "Failed to sync with server" })
    }
  }, [])

  // Memoized context value to prevent unnecessary re-renders
  const contextValue = useMemo<TestDriveContextType>(
    () => ({
      state: {
        ...state,
        requests: ensureArray(state.requests), // Always ensure requests is an array
      },
      formState,
      scheduleTestDrive,
      updateFormData,
      validateForm,
      saveDraft,
      loadDraft,
      clearDraft,
      getRequestsByVehicleId,
      getRequestsForBuyer,
      updateRequestStatus,
      retryFailedRequest,
      clearError,
      syncOfflineRequests,
      getRequestsForSeller: getRequestsForSellerContext,
      getRequestsByStatus: getRequestsByStatusContext,
      respondToTestDrive,
      syncWithRemote,
    }),
    [
      state,
      formState,
      scheduleTestDrive,
      updateFormData,
      validateForm,
      saveDraft,
      loadDraft,
      clearDraft,
      getRequestsByVehicleId,
      getRequestsForBuyer,
      updateRequestStatus,
      retryFailedRequest,
      clearError,
      syncOfflineRequests,
      getRequestsForSellerContext,
      getRequestsByStatusContext,
      respondToTestDrive,
      syncWithRemote,
    ],
  )

  return <TestDriveContext.Provider value={contextValue}>{children}</TestDriveContext.Provider>
}

// Hook to use the context
export function useTestDrive() {
  const context = useContext(TestDriveContext)
  if (context === undefined) {
    throw new Error("useTestDrive must be used within a TestDriveProvider")
  }
  return context
}
