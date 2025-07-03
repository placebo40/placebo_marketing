"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Edit3, Check } from "lucide-react"
import { getMessageTemplates } from "@/lib/email-service"

interface MessageTemplatesProps {
  onSelectTemplate: (content: string, type: string) => void
  selectedTemplate?: string
  className?: string
}

export default function MessageTemplates({ onSelectTemplate, selectedTemplate, className }: MessageTemplatesProps) {
  const [customMessage, setCustomMessage] = useState("")
  const [showCustom, setShowCustom] = useState(false)
  const templates = getMessageTemplates()

  const handleTemplateSelect = (templateKey: string, content: string) => {
    onSelectTemplate(content, templateKey)
    setShowCustom(false)
    setCustomMessage("")
  }

  const handleCustomMessage = () => {
    if (customMessage.trim()) {
      onSelectTemplate(customMessage.trim(), "custom")
      setCustomMessage("")
      setShowCustom(false)
    }
  }

  const templateLabels: Record<string, string> = {
    general: "General Interest",
    pricing: "Price Inquiry",
    availability: "Availability Check",
    condition: "Condition Details",
    financing: "Financing Options",
    inspection: "Inspection Request",
    trade: "Trade-In Discussion",
  }

  return (
    <div className={className}>
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="h-4 w-4 text-placebo-gold" />
          <span className="text-sm font-medium text-placebo-black">Quick Message Templates</span>
        </div>

        {/* Template Options */}
        <div className="grid grid-cols-1 gap-2">
          {Object.entries(templates).map(([key, content]) => (
            <Card
              key={key}
              className={`cursor-pointer transition-all hover:border-placebo-gold/50 ${
                selectedTemplate === key ? "border-placebo-gold bg-placebo-gold/5" : "border-gray-200"
              }`}
              onClick={() => handleTemplateSelect(key, content)}
            >
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-xs">
                    {templateLabels[key]}
                  </Badge>
                  {selectedTemplate === key && <Check className="h-4 w-4 text-placebo-gold" />}
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{content}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Custom Message Option */}
        <div className="border-t pt-3">
          {!showCustom ? (
            <Button
              variant="outline"
              onClick={() => setShowCustom(true)}
              className="w-full justify-start bg-transparent"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Write Custom Message
            </Button>
          ) : (
            <div className="space-y-3">
              <Textarea
                placeholder="Write your custom message here..."
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows={3}
                className="resize-none"
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleCustomMessage}
                  disabled={!customMessage.trim()}
                  className="flex-1 bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90"
                >
                  Use This Message
                </Button>
                <Button variant="outline" onClick={() => setShowCustom(false)} className="bg-transparent">
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
