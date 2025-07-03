"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface CalendarPickerProps {
  selectedDate?: string
  onDateSelect: (date: string) => void
  minDate?: Date
  maxDate?: Date
  blockedDates?: string[]
  className?: string
  showWeekNumbers?: boolean
}

interface CalendarDay {
  date: Date
  dateString: string
  isCurrentMonth: boolean
  isToday: boolean
  isSelected: boolean
  isBlocked: boolean
  isWeekend: boolean
  isBusinessDay: boolean
}

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

export default function CalendarPicker({
  selectedDate,
  onDateSelect,
  minDate = new Date(),
  maxDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  blockedDates = [],
  className,
  showWeekNumbers = false,
}: CalendarPickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)

  useEffect(() => {
    if (selectedDate) {
      const selected = new Date(selectedDate)
      setCurrentMonth(new Date(selected.getFullYear(), selected.getMonth(), 1))
    }
  }, [selectedDate])

  const isBusinessDay = (date: Date): boolean => {
    const day = date.getDay()
    return day >= 1 && day <= 6 // Monday to Saturday
  }

  const isDateBlocked = (dateString: string): boolean => {
    return blockedDates.includes(dateString)
  }

  const isDateSelectable = (date: Date): boolean => {
    const dateString = date.toISOString().split("T")[0]
    return date >= minDate && date <= maxDate && isBusinessDay(date) && !isDateBlocked(dateString)
  }

  const generateCalendarDays = (): CalendarDay[] => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()

    const firstDayOfMonth = new Date(year, month, 1)
    const lastDayOfMonth = new Date(year, month + 1, 0)
    const firstDayOfWeek = firstDayOfMonth.getDay()

    const days: CalendarDay[] = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Previous month days
    const prevMonth = new Date(year, month - 1, 0)
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonth.getDate() - i)
      const dateString = date.toISOString().split("T")[0]

      days.push({
        date,
        dateString,
        isCurrentMonth: false,
        isToday: date.getTime() === today.getTime(),
        isSelected: dateString === selectedDate,
        isBlocked: isDateBlocked(dateString),
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
        isBusinessDay: isBusinessDay(date),
      })
    }

    // Current month days
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      const date = new Date(year, month, day)
      const dateString = date.toISOString().split("T")[0]

      days.push({
        date,
        dateString,
        isCurrentMonth: true,
        isToday: date.getTime() === today.getTime(),
        isSelected: dateString === selectedDate,
        isBlocked: isDateBlocked(dateString),
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
        isBusinessDay: isBusinessDay(date),
      })
    }

    // Next month days to fill the grid
    const remainingDays = 42 - days.length // 6 weeks * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day)
      const dateString = date.toISOString().split("T")[0]

      days.push({
        date,
        dateString,
        isCurrentMonth: false,
        isToday: date.getTime() === today.getTime(),
        isSelected: dateString === selectedDate,
        isBlocked: isDateBlocked(dateString),
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
        isBusinessDay: isBusinessDay(date),
      })
    }

    return days
  }

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const handleDateClick = (day: CalendarDay) => {
    if (day.isCurrentMonth && isDateSelectable(day.date)) {
      onDateSelect(day.dateString)
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    setTouchStart({ x: touch.clientX, y: touch.clientY })
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return

    const touch = e.changedTouches[0]
    const deltaX = touch.clientX - touchStart.x
    const deltaY = Math.abs(touch.clientY - touchStart.y)

    // Only handle horizontal swipes
    if (Math.abs(deltaX) > 50 && deltaY < 100) {
      if (deltaX > 0) {
        handlePrevMonth()
      } else {
        handleNextMonth()
      }
    }

    setTouchStart(null)
  }

  const calendarDays = generateCalendarDays()

  return (
    <div className={cn("bg-white rounded-lg border shadow-sm", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <Button variant="ghost" size="sm" onClick={handlePrevMonth} className="h-8 w-8 p-0 hover:bg-gray-100">
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 text-gray-600" />
          <h3 className="font-semibold text-lg">
            {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
        </div>

        <Button variant="ghost" size="sm" onClick={handleNextMonth} className="h-8 w-8 p-0 hover:bg-gray-100">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="p-4" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {showWeekNumbers && <div className="text-xs text-gray-400 text-center py-2">Wk</div>}
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="text-xs font-medium text-gray-600 text-center py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            const isSelectable = day.isCurrentMonth && isDateSelectable(day.date)

            return (
              <button
                key={`${day.dateString}-${index}`}
                onClick={() => handleDateClick(day)}
                disabled={!isSelectable}
                className={cn(
                  "h-10 w-full text-sm rounded-md transition-all duration-200 relative",
                  "hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-placebo-gold focus:ring-offset-1",
                  {
                    // Current month styling
                    "text-gray-900": day.isCurrentMonth && isSelectable,
                    "text-gray-400": !day.isCurrentMonth,

                    // Selected date
                    "bg-placebo-gold text-white hover:bg-placebo-gold/90": day.isSelected,

                    // Today
                    "ring-2 ring-blue-500 ring-offset-1": day.isToday && !day.isSelected,

                    // Blocked/unavailable dates
                    "text-gray-300 cursor-not-allowed": day.isCurrentMonth && !isSelectable,
                    "bg-red-50 text-red-400": day.isBlocked && day.isCurrentMonth,

                    // Weekend styling
                    "text-red-600": day.isWeekend && day.isCurrentMonth && !day.isSelected,

                    // Business days
                    "font-medium": day.isBusinessDay && day.isCurrentMonth,
                  },
                )}
              >
                {day.date.getDate()}

                {/* Availability indicator */}
                {day.isCurrentMonth && isSelectable && (
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                    <div className="w-1 h-1 bg-green-500 rounded-full" />
                  </div>
                )}

                {/* Blocked indicator */}
                {day.isBlocked && day.isCurrentMonth && (
                  <div className="absolute top-1 right-1">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="px-4 pb-4 border-t bg-gray-50">
        <div className="flex flex-wrap gap-4 text-xs text-gray-600 pt-3">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-red-500 rounded-full" />
            <span>Blocked</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            <span>Today</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-placebo-gold rounded-full" />
            <span>Selected</span>
          </div>
        </div>
      </div>
    </div>
  )
}
