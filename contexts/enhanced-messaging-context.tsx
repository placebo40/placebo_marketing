"use client"

import type React from "react"

import { createContext, useContext, useReducer } from "react"
import { MessageThreadingService } from "@/lib/message-threading"

// Define the types for the messaging context
export interface EnhancedMessagingContextType {
  threads: MessageThread[]
  activeThreadId: string | null
  createThread: (threadData: CreateThreadData) => Promise<string>
  getThread: (threadId: string) => MessageThread | undefined
  sendMessage: (threadId: string, messageData: MessageData) => Promise<void>
  getMessages: (threadId: string) => Message[]
  markAsRead: (threadId: string) => void
  archiveThread: (threadId: string) => void
  unarchiveThread: (threadId: string) => void
  deleteThread: (threadId: string) => void
}

// Define the types for message threads and messages
export interface MessageThread {
  id: string
  participants: string[]
  messages: Message[]
  status: "active" | "archived" | "deleted"
  subject: string
  category: string
  priority: "high" | "medium" | "low"
  tags: string[]
  metadata: Record<string, any>
}

export interface Message {
  id: string
  senderId: string
  timestamp: Date
  content: string
  type: "text" | "image" | "file" | "test_drive_request"
  metadata: Record<string, any>
}

// Define the types for creating threads and sending messages
export interface CreateThreadData {
  vehicleId: string
  sellerId: string
  buyerId: string
  subject: string
  category: string
  priority: string
  metadata: Record<string, any>
}

export interface MessageData {
  content: string
  type: string
  metadata: Record<string, any>
}

// Define the action types for the reducer
type MessagingAction =
  | { type: "ADD_THREAD"; payload: MessageThread }
  | { type: "ADD_MESSAGE"; payload: { threadId: string; message: Message } }
  | { type: "MARK_AS_READ"; payload: string }
  | { type: "ARCHIVE_THREAD"; payload: string }
  | { type: "UNARCHIVE_THREAD"; payload: string }
  | { type: "DELETE_THREAD"; payload: string }

// Define the reducer function
const messagingReducer = (state: any, action: MessagingAction) => {
  switch (action.type) {
    case "ADD_THREAD":
      return { ...state, threads: [...state.threads, action.payload] }
    case "ADD_MESSAGE":
      return {
        ...state,
        threads: state.threads.map((thread: MessageThread) =>
          thread.id === action.payload.threadId
            ? { ...thread, messages: [...thread.messages, action.payload.message] }
            : thread,
        ),
      }
    case "MARK_AS_READ":
      return {
        ...state,
        threads: state.threads.map((thread: MessageThread) =>
          thread.id === action.payload ? { ...thread, status: "read" } : thread,
        ),
      }
    case "ARCHIVE_THREAD":
      return {
        ...state,
        threads: state.threads.map((thread: MessageThread) =>
          thread.id === action.payload ? { ...thread, status: "archived" } : thread,
        ),
      }
    case "UNARCHIVE_THREAD":
      return {
        ...state,
        threads: state.threads.map((thread: MessageThread) =>
          thread.id === action.payload ? { ...thread, status: "active" } : thread,
        ),
      }
    case "DELETE_THREAD":
      return {
        ...state,
        threads: state.threads.map((thread: MessageThread) =>
          thread.id === action.payload ? { ...thread, status: "deleted" } : thread,
        ),
      }
    default:
      return state
  }
}

// Create the context
const EnhancedMessagingContext = createContext<EnhancedMessagingContextType | undefined>(undefined)

// Create the provider component
export function EnhancedMessagingProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(messagingReducer, { threads: [], activeThreadId: null })
  const messageThreadingService = new MessageThreadingService()

  const createThread = async (threadData: CreateThreadData): Promise<string> => {
    const threadId = messageThreadingService.createThread(threadData)
    const newThread = {
      id: threadId,
      participants: [threadData.buyerId, threadData.sellerId],
      messages: [],
      status: "active",
      subject: threadData.subject,
      category: threadData.category,
      priority: threadData.priority,
      tags: [],
      metadata: threadData.metadata,
    }
    dispatch({ type: "ADD_THREAD", payload: newThread })
    console.log(`💬 Created new message thread: ${threadId}`)
    return threadId
  }

  const getThread = (threadId: string): MessageThread | undefined => {
    return state.threads.find((thread: MessageThread) => thread.id === threadId)
  }

  const sendMessage = async (threadId: string, messageData: MessageData): Promise<void> => {
    const message = messageThreadingService.createMessage(messageData)
    dispatch({ type: "ADD_MESSAGE", payload: { threadId, message } })
    console.log(`✉️ Sent message to thread ${threadId}: ${message.content}`)
  }

  const getMessages = (threadId: string): Message[] => {
    const thread = getThread(threadId)
    return thread ? thread.messages : []
  }

  const markAsRead = (threadId: string): void => {
    dispatch({ type: "MARK_AS_READ", payload: threadId })
    console.log(`✔️ Marked thread ${threadId} as read`)
  }

  const archiveThread = (threadId: string): void => {
    dispatch({ type: "ARCHIVE_THREAD", payload: threadId })
    console.log(`🗄️ Archived thread ${threadId}`)
  }

  const unarchiveThread = (threadId: string): void => {
    dispatch({ type: "UNARCHIVE_THREAD", payload: threadId })
    console.log(`⬆️ Unarchived thread ${threadId}`)
  }

  const deleteThread = (threadId: string): void => {
    dispatch({ type: "DELETE_THREAD", payload: threadId })
    console.log(`🗑️ Deleted thread ${threadId}`)
  }

  const contextValue: EnhancedMessagingContextType = {
    threads: state.threads,
    activeThreadId: state.activeThreadId,
    createThread,
    getThread,
    sendMessage,
    getMessages,
    markAsRead,
    archiveThread,
    unarchiveThread,
    deleteThread,
  }

  return <EnhancedMessagingContext.Provider value={contextValue}>{children}</EnhancedMessagingContext.Provider>
}

// Create the hook for using the context
export function useEnhancedMessaging() {
  const context = useContext(EnhancedMessagingContext)
  if (!context) {
    throw new Error("useEnhancedMessaging must be used within a EnhancedMessagingProvider")
  }
  return context
}
