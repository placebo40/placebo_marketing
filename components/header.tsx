"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Globe, User, LogOut, LayoutDashboard, Heart, Car, Bell } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import NotificationCenter from "@/components/notification-center"
import { notificationService } from "@/lib/notification-service"

export default function Header() {
  const { language, setLanguage, t } = useLanguage()
  const { user, isAuthenticated, logout, isLoading } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false)
  const [notificationCount, setNotificationCount] = useState(0)

  // Mock notifications - in a real app, these would come from the user's notification data
  const [notifications] = useState([
    {
      id: "1",
      type: "message",
      title: language === "en" ? "New message about your Honda Civic" : "ホンダシビックについての新しいメッセージ",
      time: "5m ago",
      read: false,
      link: "/seller-dashboard/messages",
      itemId: "1",
    },
    {
      id: "2",
      type: "listing",
      title: language === "en" ? "Your listing is now live" : "あなたの出品が公開されました",
      time: "1h ago",
      read: false,
      link: "/seller-dashboard/listings",
      itemId: "listing1",
    },
    {
      id: "3",
      type: "system",
      title: language === "en" ? "Profile verification complete" : "プロフィール認証完了",
      time: "2d ago",
      read: true,
      link: "/profile",
      itemId: null,
    },
  ])

  const unreadCount = notifications.filter((n) => !n.read).length

  // Update notification count
  useEffect(() => {
    const updateCount = () => {
      setNotificationCount(notificationService.getUnreadCount())
    }

    updateCount()
    return notificationService.subscribe(() => updateCount())
  }, [])

  const navItems = [
    { label: t("home"), href: "/" },
    { label: t("cars"), href: "/cars" },
    { label: t("services"), href: "/services" },
    { label: language === "en" ? "Pricing" : "料金", href: "/pricing" },
    { label: t("about"), href: "/about" },
    { label: t("contact"), href: "/contact" },
    // Only show Admin link to admin users
    ...(user?.userType === "admin" ? [{ label: language === "en" ? "Admin" : "管理者", href: "/admin" }] : []),
  ].filter(Boolean)

  const handleLogout = async () => {
    try {
      logout()
      // Redirect will be handled by auth context
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const getUserDisplayName = () => {
    if (!user) return ""
    return user.name || user.email || "User"
  }

  const getUserInitials = () => {
    if (!user) return "U"
    return user.name
      ? user.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : user.email[0].toUpperCase()
  }

  const hasAnyRole = (roles: string[]) => {
    return user && roles.includes(user.userType)
  }

  if (isLoading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-placebo-black backdrop-blur supports-[backdrop-filter]:bg-placebo-black/95">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/images/logo-white.png"
                alt="Placebo Marketing"
                width={180}
                height={40}
                className="h-8 w-auto"
              />
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-placebo-dark-gray rounded-full animate-pulse"></div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-placebo-black backdrop-blur supports-[backdrop-filter]:bg-placebo-black/95">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/images/logo-white.png"
              alt="Placebo Marketing"
              width={180}
              height={40}
              className="h-8 w-auto"
            />
          </Link>

          <nav className="hidden md:flex gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-placebo-white transition-colors hover:text-placebo-gold"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4 ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-placebo-white hover:bg-placebo-dark-gray hover:text-placebo-gold"
              >
                <Globe className="h-5 w-5" />
                <span className="sr-only">Toggle language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-placebo-white border-gray-200">
              <DropdownMenuItem onClick={() => setLanguage("en")} className="hover:bg-gray-50">
                English {language === "en" && <span className="text-placebo-gold ml-2">✓</span>}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("jp")} className="hover:bg-gray-50">
                日本語 {language === "jp" && <span className="text-placebo-gold ml-2">✓</span>}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {isAuthenticated && (
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full text-placebo-white hover:bg-placebo-dark-gray hover:text-placebo-gold"
              onClick={() => setIsNotificationCenterOpen(true)}
            >
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notificationCount > 9 ? "9+" : notificationCount}
                </span>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          )}

          {isAuthenticated ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full text-placebo-white hover:bg-placebo-dark-gray hover:text-placebo-gold"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/professional-headshot.png" alt={user?.name || "User"} />
                      <AvatarFallback className="bg-placebo-gold text-placebo-black text-xs">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="sr-only">Profile menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-placebo-white border-gray-200 w-56">
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-placebo-black">{getUserDisplayName()}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  {hasAnyRole(["seller", "dealer", "admin"]) && (
                    <DropdownMenuItem asChild className="hover:bg-gray-50">
                      <Link href="/seller-dashboard" className="flex items-center gap-2 w-full">
                        <LayoutDashboard className="h-4 w-4" />
                        {language === "en" ? "Seller Dashboard" : "販売者ダッシュボード"}
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild className="hover:bg-gray-50">
                    <Link href="/guest-dashboard" className="flex items-center gap-2 w-full">
                      <Car className="h-4 w-4" />
                      {language === "en" ? "Guest Dashboard" : "ゲストダッシュボード"}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="hover:bg-gray-50">
                    <Link href="/profile" className="flex items-center gap-2 w-full">
                      <User className="h-4 w-4" />
                      {language === "en" ? "My Profile" : "プロフィール"}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="hover:bg-gray-50">
                    <Link href="/guest-dashboard?tab=favorites" className="flex items-center gap-2 w-full">
                      <Heart className="h-4 w-4" />
                      {language === "en" ? "Favorites" : "お気に入り"}
                    </Link>
                  </DropdownMenuItem>
                  <div className="border-t border-gray-100 mt-1">
                    <DropdownMenuItem
                      className="hover:bg-red-50 text-red-600 hover:text-red-700"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      {language === "en" ? "Log out" : "ログアウト"}
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                asChild
                className="hidden md:inline-flex bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90 font-semibold"
              >
                <Link href="/list-car">{t("listMyCar")}</Link>
              </Button>
            </>
          ) : (
            <>
              <Button
                asChild
                variant="ghost"
                className="hidden md:inline-flex text-placebo-white hover:bg-placebo-dark-gray hover:text-placebo-gold"
              >
                <Link href="/login">{language === "en" ? "Sign In" : "ログイン"}</Link>
              </Button>
              <Button
                asChild
                className="hidden md:inline-flex bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90 font-semibold"
              >
                <Link href="/request-listing">{language === "en" ? "Sell Your Car" : "車を出品する"}</Link>
              </Button>
            </>
          )}

          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-placebo-white hover:bg-placebo-dark-gray">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-placebo-white">
              <div className="flex flex-col gap-6 pt-6">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-lg font-medium text-placebo-dark-gray transition-colors hover:text-placebo-gold"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                {isAuthenticated ? (
                  <>
                    <div className="border-t border-gray-200 pt-4">
                      <div className="mb-4">
                        <p className="text-sm font-medium text-placebo-black">{getUserDisplayName()}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      {isAuthenticated && (
                        <Link
                          href="/seller-dashboard/notifications"
                          className="flex items-center gap-2 text-sm font-medium text-placebo-dark-gray transition-colors hover:text-placebo-gold relative mb-2"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Bell className="h-4 w-4" />
                          {language === "en" ? "Notifications" : "通知"}
                          {notificationCount > 0 && (
                            <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                              {notificationCount > 9 ? "9+" : notificationCount}
                            </span>
                          )}
                        </Link>
                      )}
                      <div className="space-y-2">
                        {hasAnyRole(["seller", "dealer", "admin"]) && (
                          <Link
                            href="/seller-dashboard"
                            className="flex items-center gap-2 text-sm font-medium text-placebo-dark-gray transition-colors hover:text-placebo-gold"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <LayoutDashboard className="h-4 w-4" />
                            {language === "en" ? "Seller Dashboard" : "販売者ダッシュボード"}
                          </Link>
                        )}
                        <Link
                          href="/guest-dashboard"
                          className="flex items-center gap-2 text-sm font-medium text-placebo-dark-gray transition-colors hover:text-placebo-gold"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Car className="h-4 w-4" />
                          {language === "en" ? "Guest Dashboard" : "ゲストダッシュボード"}
                        </Link>
                        <Link
                          href="/profile"
                          className="flex items-center gap-2 text-sm font-medium text-placebo-dark-gray transition-colors hover:text-placebo-gold"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <User className="h-4 w-4" />
                          {language === "en" ? "My Profile" : "プロフィール"}
                        </Link>
                        <Link
                          href="/guest-dashboard?tab=favorites"
                          className="flex items-center gap-2 text-sm font-medium text-placebo-dark-gray transition-colors hover:text-placebo-gold"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Heart className="h-4 w-4" />
                          {language === "en" ? "Favorites" : "お気に入り"}
                        </Link>
                      </div>
                    </div>
                    <Button
                      asChild
                      className="mt-4 bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90 font-semibold"
                    >
                      <Link href="/list-car" onClick={() => setIsMenuOpen(false)}>
                        {t("listMyCar")}
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      className="text-red-600 hover:bg-red-50 hover:text-red-700 justify-start"
                      onClick={() => {
                        handleLogout()
                        setIsMenuOpen(false)
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      {language === "en" ? "Log out" : "ログアウト"}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      asChild
                      variant="ghost"
                      className="text-placebo-dark-gray hover:text-placebo-gold justify-start"
                    >
                      <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                        {language === "en" ? "Sign In" : "ログイン"}
                      </Link>
                    </Button>
                    <Button
                      asChild
                      className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90 font-semibold"
                    >
                      <Link href="/request-listing" onClick={() => setIsMenuOpen(false)}>
                        {language === "en" ? "Sell Your Car" : "車を出品する"}
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
        {/* Notification Center */}
        <NotificationCenter isOpen={isNotificationCenterOpen} onClose={() => setIsNotificationCenterOpen(false)} />
      </div>
    </header>
  )
}
