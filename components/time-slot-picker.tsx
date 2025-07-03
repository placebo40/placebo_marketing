"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Clock, Coffee, Sun, Sunset } from "lucide-react"
import { cn } from "@/lib/utils"
import { getAvailableTimeSlots } from "@/lib/calendar-utils"

interface TimeSlotPickerProps {
  selectedDate?: string
  selectedTime?: string
  onTimeSelect: (time: string) => void
  blockedTimeSlots?: string[]
  className?: string
  showTimeCategories?: boolean
}

interface TimeSlot {
  time: string
  displayTime: string
  isAvailable: boolean
  isBlocked: boolean
  isSelected: boolean
  category: "morning" | "afternoon" | "evening"
}

const TIME_CATEGORIES = {
  morning: { label: "Morning", icon: Coffee, color: "text-orange-600" },
  afternoon: { label: "Afternoon", icon: Sun, color: "text-yellow-600" },
  evening: { label: "Evening", icon: Sunset, color: "text-purple-600" },
}

export default function TimeSlotPicker({
  selectedDate,
  selectedTime,
  onTimeSelect,
  blockedTimeSlots = [],
  className,
  showTimeCategories = true,
}: TimeSlotPickerProps) {
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)

  useEffect(() => {
    if (selectedDate) {
      const date = new Date(selectedDate)
      const slots = getAvailableTimeSlots(date)
      setAvailableSlots(slots)
    } else {
      setAvailableSlots([])
    }
  }, [selectedDate])

  const formatDisplayTime = (time: string): string => {
    const [hours, minutes] = time.split(":").map(Number)
    const period = hours >= 12 ? "PM" : "AM"
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours
    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`
  }

  const getTimeCategory = (time: string): "morning" | "afternoon" | "evening" => {
    const hours = Number.parseInt(time.split(":")[0])
    if (hours < 12) return "morning"
    if (hours < 17) return "afternoon"
    return "evening"
  }

  const generateTimeSlots = (): TimeSlot[] => {
    return availableSlots.map((time) => ({
      time,
      displayTime: formatDisplayTime(time),
      isAvailable: true,
      isBlocked: blockedTimeSlots.includes(time),
      isSelected: time === selectedTime,
      category: getTimeCategory(time),
    }))
  }

  const groupSlotsByCategory = (slots: TimeSlot[]) => {
    return slots.reduce(
      (groups, slot) => {
        if (!groups[slot.category]) {
          groups[slot.category] = []
        }
        groups[slot.category].push(slot)
        return groups
      },
      {} as Record<string, TimeSlot[]>,
    )
  }

  const handleTimeClick = (slot: TimeSlot) => {
    if (slot.isAvailable && !slot.isBlocked) {
      onTimeSelect(slot.time)
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    setTouchStart({ x: touch.clientX, y: touch.clientY })
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return
    setTouchStart(null)
  }

  const timeSlots = generateTimeSlots()
  const groupedSlots = showTimeCategories ? groupSlotsByCategory(timeSlots) : null

  if (!selectedDate) {
    return (
      <div className={cn("bg-white rounded-lg border shadow-sm p-6", className)}>
        <div className="text-center text-gray-500">
          <Clock className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p className="text-lg font-medium mb-2">Select a Date First</p>
          <p className="text-sm">Choose a date from the calendar to see available time slots</p>
        </div>
      </div>
    )
  }

  if (timeSlots.length === 0) {
    return (
      <div className={cn("bg-white rounded-lg border shadow-sm p-6", className)}>
        <div className="text-center text-gray-500">
          <Clock className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p className="text-lg font-medium mb-2">No Available Times</p>
          <p className="text-sm">There are no available time slots for the selected date</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("bg-white rounded-lg border shadow-sm", className)}>
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b">
        <Clock className="h-5 w-5 text-gray-600" />
        <h3 className="font-semibold text-lg">Available Times</h3>
        <span className="text-sm text-gray-500 ml-auto">
          {new Date(selectedDate).toLocaleDateString("en-US", {
            weekday: "long",
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>

      {/* Time Slots */}
      <div className="p-4 max-h-80 overflow-y-auto" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        {showTimeCategories && groupedSlots ? (
          <div className="space-y-6">
            {Object.entries(TIME_CATEGORIES).map(([category, config]) => {
              const slots = groupedSlots[category as keyof typeof groupedSlots]
              if (!slots || slots.length === 0) return null

              const Icon = config.icon

              return (
                <div key={category}>
                  <div className="flex items-center gap-2 mb-3">
                    <Icon className={cn("h-4 w-4", config.color)} />
                    <h4 className={cn("font-medium text-sm", config.color)}>{config.label}</h4>
                    <div className="flex-1 h-px bg-gray-200" />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {slots.map((slot) => (
                      <Button
                        key={slot.time}
                        variant={slot.isSelected ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleTimeClick(slot)}
                        disabled={slot.isBlocked}
                        className={cn("h-10 text-sm transition-all duration-200", "hover:scale-105 active:scale-95", {
                          "bg-placebo-gold hover:bg-placebo-gold/90 text-white border-placebo-gold": slot.isSelected,
                          "border-gray-200 hover:border-placebo-gold hover:bg-placebo-gold/5":
                            !slot.isSelected && !slot.isBlocked,
                          "opacity-50 cursor-not-allowed": slot.isBlocked,
                          "ring-2 ring-placebo-gold ring-offset-1": slot.isSelected,
                        })}
                      >
                        {slot.displayTime}
                      </Button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {timeSlots.map((slot) => (
              <Button
                key={slot.time}
                variant={slot.isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => handleTimeClick(slot)}
                disabled={slot.isBlocked}
                className={cn("h-10 text-sm transition-all duration-200", "hover:scale-105 active:scale-95", {
                  "bg-placebo-gold hover:bg-placebo-gold/90 text-white border-placebo-gold": slot.isSelected,
                  "border-gray-200 hover:border-placebo-gold hover:bg-placebo-gold/5":
                    !slot.isSelected && !slot.isBlocked,
                  "opacity-50 cursor-not-allowed": slot.isBlocked,
                  "ring-2 ring-placebo-gold ring-offset-1": slot.isSelected,
                })}
              >
                {slot.displayTime}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Footer with quick actions */}
      <div className="px-4 pb-4 border-t bg-gray-50">
        <div className="flex flex-wrap gap-2 pt-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onTimeSelect("")}
            className="text-xs text-gray-600 hover:text-gray-800"
          >
            Clear Selection
          </Button>
          {selectedTime && (
            <span className="text-xs text-gray-600 flex items-center gap-1">
              Selected: <strong>{formatDisplayTime(selectedTime)}</strong>
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
