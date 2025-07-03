import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { LanguageProvider } from "@/contexts/language-context"
import { AuthProvider } from "@/contexts/auth-context"
import { MessagingProvider } from "@/contexts/messaging-context"
import { EnhancedMessagingProvider } from "@/contexts/enhanced-messaging-context"
import { TestDriveProvider } from "@/contexts/test-drive-context"
import ClientLayout from "./clientLayout"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Placebo Marketing - Premium Vehicle Sales in Okinawa",
  description:
    "Find your perfect vehicle in Okinawa with our premium car sales service. Quality vehicles, expert service, and trusted transactions.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <LanguageProvider>
            <MessagingProvider>
              <EnhancedMessagingProvider>
                <TestDriveProvider>
                  <ClientLayout>{children}</ClientLayout>
                  <Toaster />
                </TestDriveProvider>
              </EnhancedMessagingProvider>
            </MessagingProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
