"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Car,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  User,
  Calendar,
  Search,
  Award,
  CheckCircle,
  AlertTriangle,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function SellerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { language, t } = useLanguage()
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Mock user state - in a real app this would come from your auth system
  const [user, setUser] = useState({
    sellerType: "unverified", // "unverified", "verified", "pro"
    name: language === "en" ? "John Doe" : "田中太郎",
    email: "john.doe@example.com",
  })

  const isVerifiedSeller = user?.sellerType === "verified"
  const isProSeller = user?.sellerType === "pro"

  // Close sidebar on mobile by default
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false)
      } else {
        setIsSidebarOpen(true)
      }
    }

    // Set initial state
    handleResize()

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const navItems = [
    {
      name: language === "en" ? "Dashboard" : "ダッシュボード",
      href: "/seller-dashboard",
      icon: LayoutDashboard,
    },
    {
      name: language === "en" ? "My Listings" : "出品一覧",
      href: "/seller-dashboard/listings",
      icon: Car,
    },
    {
      name: language === "en" ? "Inspections" : "検査",
      href: "/seller-dashboard/inspections",
      icon: Search,
    },
    {
      name: language === "en" ? "Appraisals" : "鑑定",
      href: "/seller-dashboard/appraisals",
      icon: Award,
    },
    {
      name: language === "en" ? "Test Drives" : "試乗",
      href: "/seller-dashboard/test-drives",
      icon: Calendar,
    },
    {
      name: language === "en" ? "Messages" : "メッセージ",
      href: "/seller-dashboard/messages",
      icon: MessageSquare,
    },
    {
      name: language === "en" ? "Notifications" : "通知",
      href: "/seller-dashboard/notifications",
      icon: Bell,
    },
    {
      name: language === "en" ? "Settings" : "設定",
      href: "/seller-dashboard/settings",
      icon: Settings,
    },
  ]

  const verificationItems = [
    {
      name: language === "en" ? "Verify Identity" : "本人確認",
      href: "/seller-dashboard/verify-identity",
      icon: User,
      requiredSellerType: null,
    },
    {
      name: language === "en" ? "Upgrade to Pro" : "プロにアップグレード",
      href: "/seller-dashboard/upgrade-to-pro",
      icon: Award,
      requiredSellerType: "verified",
    },
  ]

  const handleLogout = () => {
    // Dispatch logout event to update header
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("userLoggedOut"))
    }
    // Redirect to homepage
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo-black.png"
              alt="Placebo Marketing"
              width={150}
              height={40}
              className="h-8 w-auto"
            />
          </Link>
        </div>
        <Button variant="ghost" size="sm" className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">{language === "en" ? "My Account" : "マイアカウント"}</span>
        </Button>
      </header>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <Link href="/" className="flex items-center">
                <Image
                  src="/images/logo-black.png"
                  alt="Placebo Marketing"
                  width={150}
                  height={40}
                  className="h-8 w-auto"
                />
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                <X className="h-5 w-5" />
                <span className="sr-only">Close menu</span>
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto py-4">
              <nav className="space-y-1 px-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md",
                      pathname === item.href
                        ? "bg-placebo-gold/10 text-placebo-black"
                        : "text-gray-700 hover:bg-gray-100",
                    )}
                  >
                    <item.icon
                      className={cn("h-5 w-5", pathname === item.href ? "text-placebo-gold" : "text-gray-500")}
                    />
                    {item.name}
                  </Link>
                ))}
                {/* Mobile Verification Links */}
                {verificationItems.map(
                  (item) =>
                    (item.requiredSellerType === null || user?.sellerType === item.requiredSellerType) && (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md",
                          pathname === item.href
                            ? "bg-placebo-gold/10 text-placebo-black"
                            : "text-gray-700 hover:bg-gray-100",
                        )}
                      >
                        <item.icon
                          className={cn("h-5 w-5", pathname === item.href ? "text-placebo-gold" : "text-gray-500")}
                        />
                        {item.name}
                      </Link>
                    ),
                )}
              </nav>
            </div>
            <div className="p-4 border-t border-gray-200">
              <Button
                variant="ghost"
                className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5 mr-3" />
                {language === "en" ? "Log out" : "ログアウト"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:h-screen lg:sticky lg:top-0">
        <div
          className={cn(
            "transition-all duration-300 ease-in-out h-full bg-white border-r border-gray-200 flex flex-col",
            isSidebarOpen ? "w-64" : "w-20",
          )}
        >
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 flex-shrink-0">
            {isSidebarOpen ? (
              <Link href="/" className="flex items-center">
                <Image
                  src="/images/logo-black.png"
                  alt="Placebo Marketing"
                  width={150}
                  height={40}
                  className="h-8 w-auto"
                />
              </Link>
            ) : (
              <Link href="/" className="flex items-center justify-center w-full">
                <div className="w-8 h-8 bg-placebo-gold rounded-full flex items-center justify-center">
                  <span className="text-placebo-black font-bold">P</span>
                </div>
              </Link>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-gray-500 hover:text-gray-700"
            >
              <ChevronRight className={cn("h-5 w-5 transition-transform", !isSidebarOpen && "rotate-180")} />
            </Button>
          </div>

          {/* Verification Status Indicator */}
          <div className="px-4 py-2 border-b border-gray-200">
            {user?.sellerType === "unverified" && (
              <div className="flex items-center gap-2 text-sm text-yellow-600">
                <AlertTriangle className="h-4 w-4" />
                {isSidebarOpen && <span>{language === "en" ? "Unverified" : "未確認"}</span>}
              </div>
            )}
            {user?.sellerType === "verified" && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="h-4 w-4" />
                {isSidebarOpen && <span>{language === "en" ? "Verified" : "確認済"}</span>}
              </div>
            )}
            {user?.sellerType === "pro" && (
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <CheckCircle className="h-4 w-4" />
                {isSidebarOpen && <span>{language === "en" ? "Pro Seller" : "プロセラー"}</span>}
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto py-5">
            <nav className="space-y-1 px-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md",
                    pathname === item.href
                      ? "bg-placebo-gold/10 text-placebo-black"
                      : "text-gray-700 hover:bg-gray-100",
                    !isSidebarOpen && "justify-center",
                  )}
                  title={isSidebarOpen ? "" : item.name}
                >
                  <item.icon
                    className={cn("h-5 w-5", pathname === item.href ? "text-placebo-gold" : "text-gray-500")}
                  />
                  {isSidebarOpen && <span>{item.name}</span>}
                </Link>
              ))}

              {/* Desktop Verification Links */}
              {verificationItems.map(
                (item) =>
                  (item.requiredSellerType === null || user?.sellerType === item.requiredSellerType) && (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md",
                        pathname === item.href
                          ? "bg-placebo-gold/10 text-placebo-black"
                          : "text-gray-700 hover:bg-gray-100",
                        !isSidebarOpen && "justify-center",
                      )}
                      title={isSidebarOpen ? "" : item.name}
                    >
                      <item.icon
                        className={cn("h-5 w-5", pathname === item.href ? "text-placebo-gold" : "text-gray-500")}
                      />
                      {isSidebarOpen && <span>{item.name}</span>}
                    </Link>
                  ),
              )}
            </nav>
          </div>
          <div className={cn("p-4 border-t border-gray-200 flex-shrink-0", !isSidebarOpen && "flex justify-center")}>
            <Button
              variant="ghost"
              className={cn(
                "text-red-600 hover:bg-red-50 hover:text-red-700",
                isSidebarOpen ? "w-full justify-start" : "w-10 h-10 p-0",
              )}
              title={isSidebarOpen ? "" : language === "en" ? "Log out" : "ログアウト"}
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              {isSidebarOpen && <span className="ml-3">{language === "en" ? "Log out" : "ログアウト"}</span>}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:pt-0 pt-20 min-h-screen">{children}</main>
    </div>
  )
}
