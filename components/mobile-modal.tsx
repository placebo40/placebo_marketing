"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"

interface MobileModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  showBackButton?: boolean
  onBack?: () => void
  className?: string
  fullScreen?: boolean
}

export default function MobileModal({
  isOpen,
  onClose,
  title,
  children,
  showBackButton = false,
  onBack,
  className,
  fullScreen = false,
}: MobileModalProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Handle swipe to close on mobile
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    setTouchStart({ x: touch.clientX, y: touch.clientY })
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return

    const touch = e.changedTouches[0]
    const deltaY = touch.clientY - touchStart.y
    const deltaX = Math.abs(touch.clientX - touchStart.x)

    // Swipe down to close (only if swipe is more vertical than horizontal)
    if (deltaY > 100 && deltaX < 100) {
      onClose()
    }

    setTouchStart(null)
  }

  if (isMobile) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          className={cn(
            "fixed inset-0 z-50 bg-white",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
            "duration-300 ease-out",
            fullScreen ? "h-full" : "h-[95vh] top-[5vh] rounded-t-xl",
            className,
          )}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-4 border-b bg-white sticky top-0 z-10">
            {showBackButton && onBack ? (
              <Button variant="ghost" size="sm" onClick={onBack} className="h-8 w-8 p-0">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            ) : (
              <div className="w-8" />
            )}

            <DialogTitle className="text-lg font-semibold text-center flex-1">{title}</DialogTitle>

            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Swipe indicator */}
          <div className="flex justify-center py-2 bg-white">
            <div className="w-12 h-1 bg-gray-300 rounded-full" />
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">{children}</div>
        </DialogContent>
      </Dialog>
    )
  }

  // Desktop version
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn("max-w-4xl max-h-[90vh] overflow-y-auto", className)}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}
