"use client"

import type React from "react"

import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { MessageCircle, Send, User, Bot } from "lucide-react"

type Message = {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

export default function AiChat() {
  const { language } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        language === "en"
          ? "Hello! I'm your Placebo Marketing assistant. How can I help you today?"
          : "こんにちは！プラセボマーケティングのアシスタントです。今日はどのようにお手伝いできますか？",
      sender: "bot",
      timestamp: new Date(),
    },
  ])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Simulate bot response
    setTimeout(() => {
      const botResponses = {
        en: [
          "I can help you with that! Would you like more information about our services?",
          "That's a great question. Let me find the answer for you.",
          "Would you like to speak with one of our human representatives?",
        ],
        jp: [
          "お手伝いします！サービスについての詳細情報が必要ですか？",
          "それは良い質問です。答えを見つけましょう。",
          "人間の担当者と話したいですか？",
        ],
      }

      const randomResponse = botResponses[language][Math.floor(Math.random() * botResponses[language].length)]

      const botMessage: Message = {
        id: Date.now().toString(),
        content: randomResponse,
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    }, 1000)
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            size="icon"
            className="h-16 w-16 rounded-full bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90 shadow-lg transition-all duration-200 hover:scale-105"
          >
            <MessageCircle className="h-8 w-8" />
            <span className="sr-only">Open chat</span>
          </Button>
        </SheetTrigger>
        <SheetContent className="flex h-[80vh] w-[90vw] flex-col p-0 sm:max-w-md bg-placebo-white">
          <SheetHeader className="border-b border-gray-200 p-4 bg-placebo-black">
            <SheetTitle className="text-placebo-white">
              {language === "en" ? "Placebo Assistant" : "プラセボアシスタント"}
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`flex max-w-[80%] items-start gap-2 rounded-lg p-3 ${
                      message.sender === "user"
                        ? "bg-placebo-gold text-placebo-black"
                        : "bg-gray-100 text-placebo-dark-gray"
                    }`}
                  >
                    {message.sender === "bot" && <Bot className="mt-1 h-4 w-4 shrink-0 text-placebo-gold" />}
                    <div>
                      <p>{message.content}</p>
                      <p className="mt-1 text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    {message.sender === "user" && <User className="mt-1 h-4 w-4 shrink-0" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-4">
            <div className="flex gap-2">
              <Input
                placeholder={language === "en" ? "Type a message..." : "メッセージを入力..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 border-gray-200 focus:border-placebo-gold focus:ring-placebo-gold"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim()}
                className="bg-placebo-gold text-placebo-black hover:bg-placebo-gold/90"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  )
}
