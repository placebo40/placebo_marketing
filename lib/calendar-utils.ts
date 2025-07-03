interface CalendarEvent {
  title: string
  description: string
  startDate: Date
  endDate: Date
  location?: string
  attendees?: string[]
}

// Business hours configuration
export const BUSINESS_HOURS = {
  monday: { start: 9, end: 18 },
  tuesday: { start: 9, end: 18 },
  wednesday: { start: 9, end: 18 },
  thursday: { start: 9, end: 18 },
  friday: { start: 9, end: 18 },
  saturday: { start: 9, end: 16 },
  sunday: null, // Closed on Sunday
}

// Check if a date is a business day
export function isBusinessDay(date: Date): boolean {
  const day = date.getDay() // 0 = Sunday, 1 = Monday, etc.
  return day >= 1 && day <= 6 // Monday to Saturday
}

// Check if a time is within business hours
export function isBusinessHours(date: Date): boolean {
  const day = date.getDay()
  const hour = date.getHours()

  const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"] as const
  const dayName = dayNames[day]
  const businessHour = BUSINESS_HOURS[dayName]

  if (!businessHour) return false

  return hour >= businessHour.start && hour < businessHour.end
}

// Generate available time slots for a given date
export function getAvailableTimeSlots(date: Date): string[] {
  const slots: string[] = []
  const day = date.getDay()

  const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"] as const
  const dayName = dayNames[day]
  const businessHour = BUSINESS_HOURS[dayName]

  if (!businessHour) return slots

  for (let hour = businessHour.start; hour < businessHour.end; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
      slots.push(timeString)
    }
  }

  return slots
}

// Validate if a date is within acceptable booking range
export function isValidBookingDate(date: Date): boolean {
  const now = new Date()
  const minDate = new Date(now.getTime() + 24 * 60 * 60 * 1000) // Tomorrow
  const maxDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days from now

  return date >= minDate && date <= maxDate && isBusinessDay(date)
}

// Generate ICS file content
export function generateICSFile(event: CalendarEvent): string {
  const formatDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
  }

  const escapeText = (text: string): string => {
    return text.replace(/[,;\\]/g, "\\$&").replace(/\n/g, "\\n")
  }

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Placebo Motors//Test Drive Scheduler//EN",
    "BEGIN:VEVENT",
    `UID:${Date.now()}@placebomotors.com`,
    `DTSTART:${formatDate(event.startDate)}`,
    `DTEND:${formatDate(event.endDate)}`,
    `SUMMARY:${escapeText(event.title)}`,
    `DESCRIPTION:${escapeText(event.description)}`,
    event.location ? `LOCATION:${escapeText(event.location)}` : "",
    "BEGIN:VALARM",
    "TRIGGER:-PT15M",
    "ACTION:DISPLAY",
    "DESCRIPTION:Test Drive Reminder",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n")

  return icsContent
}

// Download ICS file
export function downloadICSFile(event: CalendarEvent, filename = "test-drive.ics"): void {
  const icsContent = generateICSFile(event)
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" })
  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Generate Google Calendar URL
export function getGoogleCalendarUrl(event: CalendarEvent): string {
  const formatDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
  }

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${formatDate(event.startDate)}/${formatDate(event.endDate)}`,
    details: event.description,
    location: event.location || "",
  })

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

// Generate Outlook Calendar URL
export function getOutlookCalendarUrl(event: CalendarEvent): string {
  const formatDate = (date: Date): string => {
    return date.toISOString()
  }

  const params = new URLSearchParams({
    subject: event.title,
    startdt: formatDate(event.startDate),
    enddt: formatDate(event.endDate),
    body: event.description,
    location: event.location || "",
  })

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`
}

// Generate Yahoo Calendar URL
export function getYahooCalendarUrl(event: CalendarEvent): string {
  const formatDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
  }

  const params = new URLSearchParams({
    v: "60",
    title: event.title,
    st: formatDate(event.startDate),
    et: formatDate(event.endDate),
    desc: event.description,
    in_loc: event.location || "",
  })

  return `https://calendar.yahoo.com/?${params.toString()}`
}
