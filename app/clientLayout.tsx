"use client"

import type React from "react"
import { LanguageProvider } from "@/contexts/language-context"
import { AuthProvider } from "@/contexts/auth-context"
import { TestDriveProvider } from "@/contexts/test-drive-context"
import { MessagingProvider } from "@/contexts/messaging-context"
import { EnhancedMessagingProvider } from "@/contexts/enhanced-messaging-context"
import { Toaster } from "@/components/ui/toaster"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { usePathname } from "next/navigation"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Define routes that should not show header/footer
  const hideHeaderFooterRoutes = ["/login", "/signup", "/unauthorized"]
  const shouldHideHeaderFooter = hideHeaderFooterRoutes.includes(pathname)

  return (
    <AuthProvider>
      <LanguageProvider>
        <MessagingProvider>
          <EnhancedMessagingProvider>
            <TestDriveProvider>
              <div className="min-h-screen flex flex-col">
                {!shouldHideHeaderFooter && <Header />}
                <main className="flex-1">{children}</main>
                {!shouldHideHeaderFooter && <Footer />}
              </div>
              <Toaster />
            </TestDriveProvider>
          </EnhancedMessagingProvider>
        </MessagingProvider>
      </LanguageProvider>
    </AuthProvider>
  )
}
