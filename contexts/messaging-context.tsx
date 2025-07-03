"use client"

import type { ReactNode } from "react"
import { createContext, useContext, useReducer, useEffect } from "react"
import { type MessageData, sendMessage, type EmailResponse } from "@/lib/email-service"

export interface Message {
  id: string
  vehicleId: string
  vehicleTitle: string
  sellerEmail: string
  sellerName: string
  content: string
  inquiryType: MessageData["inquiry_type"]
  timestamp: Date
  status: "sending" | "sent" | "delivered" | "read" | "failed"
  response?: EmailResponse
  deliveredAt?: Date
  readAt?: Date
  threadId: string
}

export interface MessageThread {
  id: string
  vehicleId: string
  vehicleTitle: string
  sellerEmail: string
  sellerName: string
  messages: Message[]
  lastActivity: Date
  unreadCount: number
  status: "active" | "archived" | "blocked"
  isTyping?: boolean
}

interface MessagingState {
  threads: MessageThread[]
  isLoading: boolean
  error: string | null
}

type MessagingAction =
  | { type: "SEND_MESSAGE_START"; payload: { message: Message } }
  | { type: "SEND_MESSAGE_SUCCESS"; payload: { messageId: string; response: EmailResponse } }
  | { type: "SEND_MESSAGE_FAILURE"; payload: { messageId: string; error: string } }
  | { type: "LOAD_THREADS"; payload: { threads: MessageThread[] } }
  | { type: "MARK_THREAD_READ"; payload: { vehicleId: string } }
  | { type: "SET_ERROR"; payload: { error: string } }
  | { type: "CLEAR_ERROR" }

const initialState: MessagingState = {
  threads: [],
  isLoading: false,
  error: null,
}

function messagingReducer(state: MessagingState, action: MessagingAction): MessagingState {
  switch (action.type) {
    case "SEND_MESSAGE_START": {
      const { message } = action.payload
      const existingThreadIndex = state.threads.findIndex((t) => t.vehicleId === message.vehicleId)

      if (existingThreadIndex >= 0) {
        const updatedThreads = [...state.threads]
        updatedThreads[existingThreadIndex] = {
          ...updatedThreads[existingThreadIndex],
          messages: [...updatedThreads[existingThreadIndex].messages, message],
          lastActivity: message.timestamp,
        }
        return {
          ...state,
          threads: updatedThreads,
          isLoading: true,
          error: null,
        }
      } else {
        const newThread: MessageThread = {
          id: message.vehicleId, // Assuming vehicleId can be used as a unique ID
          vehicleId: message.vehicleId,
          vehicleTitle: message.vehicleTitle,
          sellerEmail: message.sellerEmail,
          sellerName: message.sellerName,
          messages: [message],
          lastActivity: message.timestamp,
          unreadCount: 0,
          status: "active", // Default status
        }
        return {
          ...state,
          threads: [newThread, ...state.threads],
          isLoading: true,
          error: null,
        }
      }
    }

    case "SEND_MESSAGE_SUCCESS": {
      const { messageId, response } = action.payload
      const updatedThreads = state.threads.map((thread) => ({
        ...thread,
        messages: thread.messages.map((msg) =>
          msg.id === messageId ? { ...msg, status: "sent" as const, response } : msg,
        ),
      }))
      return {
        ...state,
        threads: updatedThreads,
        isLoading: false,
      }
    }

    case "SEND_MESSAGE_FAILURE": {
      const { messageId, error } = action.payload
      const updatedThreads = state.threads.map((thread) => ({
        ...thread,
        messages: thread.messages.map((msg) =>
          msg.id === messageId
            ? { ...msg, status: "failed" as const, response: { success: false, message: error } }
            : msg,
        ),
      }))
      return {
        ...state,
        threads: updatedThreads,
        isLoading: false,
        error,
      }
    }

    case "LOAD_THREADS":
      return {
        ...state,
        threads: action.payload.threads,
      }

    case "MARK_THREAD_READ": {
      const updatedThreads = state.threads.map((thread) =>
        thread.vehicleId === action.payload.vehicleId ? { ...thread, unreadCount: 0 } : thread,
      )
      return {
        ...state,
        threads: updatedThreads,
      }
    }

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload.error,
        isLoading: false,
      }

    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      }

    default:
      return state
  }
}

interface MessagingContextType {
  state: MessagingState
  sendMessageToSeller: (data: MessageData) => Promise<void>
  markThreadAsRead: (vehicleId: string) => void
  getTotalUnreadCount: () => number
  getThreadByVehicleId: (vehicleId: string) => MessageThread | undefined
  clearError: () => void
}

const MessagingContext = createContext<MessagingContextType | undefined>(undefined)

export function MessagingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(messagingReducer, initialState)

  // Load threads from localStorage on mount
  useEffect(() => {
    const savedThreads = localStorage.getItem("messaging-threads")
    if (savedThreads) {
      try {
        const threads = JSON.parse(savedThreads).map((thread: any) => ({
          ...thread,
          lastActivity: new Date(thread.lastActivity),
          messages: thread.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
        }))
        dispatch({ type: "LOAD_THREADS", payload: { threads } })
      } catch (error) {
        console.error("Failed to load messaging threads:", error)
      }
    }
  }, [])

  // Save threads to localStorage whenever they change
  useEffect(() => {
    if (state.threads.length > 0) {
      localStorage.setItem("messaging-threads", JSON.stringify(state.threads))
    }
  }, [state.threads])

  const sendMessageToSeller = async (data: MessageData) => {
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const message: Message = {
      id: messageId,
      vehicleId: data.vehicle_id,
      vehicleTitle: data.vehicle_title,
      sellerEmail: data.to_email,
      sellerName: data.to_name,
      content: data.message,
      inquiryType: data.inquiry_type,
      timestamp: new Date(),
      status: "sending",
      threadId: data.vehicle_id, // Assuming vehicleId can be used as a unique thread ID
    }

    dispatch({ type: "SEND_MESSAGE_START", payload: { message } })

    try {
      const response = await sendMessage(data)

      if (response.success) {
        dispatch({
          type: "SEND_MESSAGE_SUCCESS",
          payload: { messageId, response },
        })
      } else {
        dispatch({
          type: "SEND_MESSAGE_FAILURE",
          payload: { messageId, error: response.message },
        })
      }
    } catch (error) {
      dispatch({
        type: "SEND_MESSAGE_FAILURE",
        payload: {
          messageId,
          error: error instanceof Error ? error.message : "Unknown error",
        },
      })
    }
  }

  const markThreadAsRead = (vehicleId: string) => {
    dispatch({ type: "MARK_THREAD_READ", payload: { vehicleId } })
  }

  const getTotalUnreadCount = () => {
    return state.threads.reduce((total, thread) => total + thread.unreadCount, 0)
  }

  const getThreadByVehicleId = (vehicleId: string) => {
    return state.threads.find((thread) => thread.vehicleId === vehicleId)
  }

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" })
  }

  return (
    <MessagingContext.Provider
      value={{
        state,
        sendMessageToSeller,
        markThreadAsRead,
        getTotalUnreadCount,
        getThreadByVehicleId,
        clearError,
      }}
    >
      {children}
    </MessagingContext.Provider>
  )
}

export function useMessaging() {
  const context = useContext(MessagingContext)
  if (context === undefined) {
    throw new Error("useMessaging must be used within a MessagingProvider")
  }
  return context
}
