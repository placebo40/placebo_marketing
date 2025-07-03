"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MessageCircle, Calendar, Phone, Mail, X } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface MobileOptimizedCTAProps {
  variant?: "floating" | "sticky" | "inline"
  vehicleTitle?: string
  sellerName?: string
  onSendMessage?: () => void
  onScheduleTestDrive?: () => void
  onCall?: () => void
  onEmail?: () => void
  className?: string
}

export default function MobileOptimizedCTA({
  variant = "floating",
  vehicleTitle,
  sellerName,
  onSendMessage,
  onScheduleTestDrive,
  onCall,
  onEmail,
  className = "",
}: MobileOptimizedCTAProps) {
  const { language } = useLanguage()
  const [isVisible, setIsVisible] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showActionSheet, setShowActionSheet] = useState(false)

  useEffect(() => {
    if (variant === "floating") {
      const handleScroll = () => {
        const scrolled = window.scrollY > 200
        setIsVisible(scrolled)
      }

      window.addEventListener("scroll", handleScroll)
      return () => window.removeEventListener("scroll", handleScroll)
    } else {
      setIsVisible(true)
    }
  }, [variant])

  const handlePrimaryAction = () => {
    if (variant === "floating") {
      setShowActionSheet(true)
    } else if (onSendMessage) {
      onSendMessage()
    }
  }

  const handleSecondaryAction = () => {
    if (onScheduleTestDrive) {
      onScheduleTestDrive()
    }
  }

  const actions = [
    {
      icon: MessageCircle,
      label: language === "en" ? "Send Message" : "メッセージ送信",
      action: onSendMessage,
      primary: true,
    },
    {
      icon: Calendar,
      label: language === "en" ? "Schedule Test Drive" : "試乗予約",
      action: onScheduleTestDrive,
      primary: false,
    },
    {
      icon: Phone,
      label: language === "en" ? "Call Seller" : "販売者に電話",
      action: onCall,
      primary: false,
    },
    {
      icon: Mail,
      label: language === "en" ? "Email Seller" : "販売者にメール",
      action: onEmail,
      primary: false,
    },
  ].filter((action) => action.action)

  // Floating Action Button
  if (variant === "floating") {
    return (
      <>
        <div
          className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
          } ${className}`}
        >
          <Button
            size="lg"
            onClick={handlePrimaryAction}
            className="h-14 w-14 rounded-full bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        </div>

        {/* Action Sheet Modal */}
        <Dialog open={showActionSheet} onOpenChange={setShowActionSheet}>
          <DialogContent className="sm:max-w-md bottom-0 top-auto translate-y-0 rounded-t-xl rounded-b-none border-0 p-0">
            <div className="p-6">
              <DialogHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-lg font-semibold">
                    {language === "en" ? "Contact Options" : "連絡オプション"}
                  </DialogTitle>
                  <Button variant="ghost" size="sm" onClick={() => setShowActionSheet(false)} className="h-8 w-8 p-0">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {vehicleTitle && <p className="text-sm text-gray-600 text-left">{vehicleTitle}</p>}
              </DialogHeader>

              <div className="space-y-3">
                {actions.map((action, index) => {
                  const Icon = action.icon
                  return (
                    <Button
                      key={index}
                      variant={action.primary ? "default" : "outline"}
                      size="lg"
                      onClick={() => {
                        action.action?.()
                        setShowActionSheet(false)
                      }}
                      className={`w-full justify-start h-12 ${
                        action.primary
                          ? "bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90"
                          : "bg-transparent"
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {action.label}
                    </Button>
                  )
                })}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  // Sticky Bottom Bar
  if (variant === "sticky") {
    return (
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 bg-white border-t shadow-lg transition-all duration-300 ${
          isVisible ? "translate-y-0" : "translate-y-full"
        } ${className}`}
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            {vehicleTitle && (
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-placebo-black truncate">{vehicleTitle}</p>
                {sellerName && (
                  <p className="text-xs text-gray-600 truncate">
                    {language === "en" ? "by" : ""} {sellerName}
                  </p>
                )}
              </div>
            )}
            <div className="flex gap-2">
              {onScheduleTestDrive && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSecondaryAction}
                  className="bg-transparent whitespace-nowrap"
                >
                  <Calendar className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">{language === "en" ? "Test Drive" : "試乗"}</span>
                </Button>
              )}
              {onSendMessage && (
                <Button
                  size="sm"
                  onClick={handlePrimaryAction}
                  className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90 whitespace-nowrap"
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">{language === "en" ? "Message" : "メッセージ"}</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Inline CTA
  return (
    <Card className={`${className}`}>
      <CardContent className="p-4">
        <div className="space-y-4">
          {vehicleTitle && (
            <div className="text-center">
              <h3 className="font-semibold text-placebo-black mb-1">
                {language === "en" ? "Interested in this vehicle?" : "この車両に興味がありますか？"}
              </h3>
              <p className="text-sm text-gray-600">
                {language === "en" ? "Contact the seller to learn more" : "詳細については販売者にお問い合わせください"}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {onSendMessage && (
              <Button
                size="lg"
                onClick={onSendMessage}
                className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90 h-12"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                {language === "en" ? "Send Message" : "メッセージ送信"}
              </Button>
            )}
            {onScheduleTestDrive && (
              <Button variant="outline" size="lg" onClick={onScheduleTestDrive} className="bg-transparent h-12">
                <Calendar className="h-5 w-5 mr-2" />
                {language === "en" ? "Schedule Test Drive" : "試乗予約"}
              </Button>
            )}
          </div>

          {(onCall || onEmail) && (
            <div className="flex gap-2 pt-2 border-t">
              {onCall && (
                <Button variant="ghost" size="sm" onClick={onCall} className="flex-1">
                  <Phone className="h-4 w-4 mr-2" />
                  {language === "en" ? "Call" : "電話"}
                </Button>
              )}
              {onEmail && (
                <Button variant="ghost" size="sm" onClick={onEmail} className="flex-1">
                  <Mail className="h-4 w-4 mr-2" />
                  {language === "en" ? "Email" : "メール"}
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
