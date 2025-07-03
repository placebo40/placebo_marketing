"use client"

import type { TestDriveRequest, TestDriveFormData } from "@/types/test-drive"

class IndexedDBService {
  private dbName = "PlaceboMotorsDB"
  private version = 1
  private db: IDBDatabase | null = null

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)

      request.onerror = () => {
        reject(new Error("Failed to open IndexedDB"))
      }

      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Test Drive Requests store
        if (!db.objectStoreNames.contains("testDriveRequests")) {
          const requestStore = db.createObjectStore("testDriveRequests", { keyPath: "id" })
          requestStore.createIndex("vehicleId", "vehicleId", { unique: false })
          requestStore.createIndex("status", "status", { unique: false })
          requestStore.createIndex("timestamp", "timestamp", { unique: false })
        }

        // Drafts store
        if (!db.objectStoreNames.contains("drafts")) {
          db.createObjectStore("drafts", { keyPath: "vehicleId" })
        }

        // Offline Queue store
        if (!db.objectStoreNames.contains("offlineQueue")) {
          const queueStore = db.createObjectStore("offlineQueue", { keyPath: "id" })
          queueStore.createIndex("timestamp", "timestamp", { unique: false })
        }
      }
    })
  }

  async saveTestDriveRequest(request: TestDriveRequest): Promise<void> {
    if (!this.db) throw new Error("Database not initialized")

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["testDriveRequests"], "readwrite")
      const store = transaction.objectStore("testDriveRequests")
      const request_op = store.put(request)

      request_op.onsuccess = () => resolve()
      request_op.onerror = () => reject(new Error("Failed to save test drive request"))
    })
  }

  async getTestDriveRequests(): Promise<TestDriveRequest[]> {
    if (!this.db) throw new Error("Database not initialized")

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["testDriveRequests"], "readonly")
      const store = transaction.objectStore("testDriveRequests")
      const request = store.getAll()

      request.onsuccess = () => {
        const requests = request.result.map((req: any) => ({
          ...req,
          timestamp: new Date(req.timestamp),
          lastUpdated: new Date(req.lastUpdated),
        }))
        resolve(requests)
      }
      request.onerror = () => reject(new Error("Failed to get test drive requests"))
    })
  }

  async saveDraft(vehicleId: string, data: Partial<TestDriveFormData>): Promise<void> {
    if (!this.db) throw new Error("Database not initialized")

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["drafts"], "readwrite")
      const store = transaction.objectStore("drafts")
      const request = store.put({ vehicleId, data, timestamp: new Date() })

      request.onsuccess = () => resolve()
      request.onerror = () => reject(new Error("Failed to save draft"))
    })
  }

  async getDraft(vehicleId: string): Promise<Partial<TestDriveFormData> | null> {
    if (!this.db) throw new Error("Database not initialized")

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["drafts"], "readonly")
      const store = transaction.objectStore("drafts")
      const request = store.get(vehicleId)

      request.onsuccess = () => {
        const result = request.result
        resolve(result ? result.data : null)
      }
      request.onerror = () => reject(new Error("Failed to get draft"))
    })
  }

  async deleteDraft(vehicleId: string): Promise<void> {
    if (!this.db) throw new Error("Database not initialized")

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["drafts"], "readwrite")
      const store = transaction.objectStore("drafts")
      const request = store.delete(vehicleId)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(new Error("Failed to delete draft"))
    })
  }

  async addToOfflineQueue(request: TestDriveRequest): Promise<void> {
    if (!this.db) throw new Error("Database not initialized")

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["offlineQueue"], "readwrite")
      const store = transaction.objectStore("offlineQueue")
      const request_op = store.put(request)

      request_op.onsuccess = () => resolve()
      request_op.onerror = () => reject(new Error("Failed to add to offline queue"))
    })
  }

  async getOfflineQueue(): Promise<TestDriveRequest[]> {
    if (!this.db) throw new Error("Database not initialized")

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["offlineQueue"], "readonly")
      const store = transaction.objectStore("offlineQueue")
      const request = store.getAll()

      request.onsuccess = () => {
        const requests = request.result.map((req: any) => ({
          ...req,
          timestamp: new Date(req.timestamp),
          lastUpdated: new Date(req.lastUpdated),
        }))
        resolve(requests)
      }
      request.onerror = () => reject(new Error("Failed to get offline queue"))
    })
  }

  async removeFromOfflineQueue(requestId: string): Promise<void> {
    if (!this.db) throw new Error("Database not initialized")

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["offlineQueue"], "readwrite")
      const store = transaction.objectStore("offlineQueue")
      const request = store.delete(requestId)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(new Error("Failed to remove from offline queue"))
    })
  }
}

export const indexedDBService = new IndexedDBService()
