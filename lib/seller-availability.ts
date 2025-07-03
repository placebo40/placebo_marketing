export interface TimeSlot {
  start: string // HH:MM format
  end: string // HH:MM format
}

export interface DayAvailability {
  isAvailable: boolean
  timeSlots: TimeSlot[]
  notes?: string
}

export interface WeeklySchedule {
  monday: DayAvailability
  tuesday: DayAvailability
  wednesday: DayAvailability
  thursday: DayAvailability
  friday: DayAvailability
  saturday: DayAvailability
  sunday: DayAvailability
}

export interface SellerAvailability {
  sellerId: string
  weeklySchedule: WeeklySchedule
  blockedDates: string[] // YYYY-MM-DD format
  blockedTimeSlots: {
    date: string
    timeSlot: TimeSlot
    reason?: string
  }[]
  timezone: string
  lastUpdated: Date
}

export interface TestDriveSlot {
  date: string
  timeSlot: TimeSlot
  isAvailable: boolean
  isBooked: boolean
  requestId?: string
  reason?: string
}

class SellerAvailabilityService {
  private availability: Map<string, SellerAvailability> = new Map()

  // Default business hours
  private defaultSchedule: WeeklySchedule = {
    monday: {
      isAvailable: true,
      timeSlots: [{ start: "09:00", end: "17:00" }],
    },
    tuesday: {
      isAvailable: true,
      timeSlots: [{ start: "09:00", end: "17:00" }],
    },
    wednesday: {
      isAvailable: true,
      timeSlots: [{ start: "09:00", end: "17:00" }],
    },
    thursday: {
      isAvailable: true,
      timeSlots: [{ start: "09:00", end: "17:00" }],
    },
    friday: {
      isAvailable: true,
      timeSlots: [{ start: "09:00", end: "17:00" }],
    },
    saturday: {
      isAvailable: true,
      timeSlots: [{ start: "09:00", end: "16:00" }],
    },
    sunday: {
      isAvailable: false,
      timeSlots: [],
    },
  }

  async getSellerAvailability(sellerId: string): Promise<SellerAvailability> {
    let availability = this.availability.get(sellerId)

    if (!availability) {
      // Create default availability for new seller
      availability = {
        sellerId,
        weeklySchedule: this.defaultSchedule,
        blockedDates: [],
        blockedTimeSlots: [],
        timezone: "Asia/Tokyo",
        lastUpdated: new Date(),
      }
      this.availability.set(sellerId, availability)
    }

    return availability
  }

  async updateSellerAvailability(sellerId: string, updates: Partial<SellerAvailability>): Promise<void> {
    const current = await this.getSellerAvailability(sellerId)
    const updated = {
      ...current,
      ...updates,
      lastUpdated: new Date(),
    }
    this.availability.set(sellerId, updated)
  }

  async getAvailableSlots(sellerId: string, startDate: Date, endDate: Date): Promise<TestDriveSlot[]> {
    const availability = await this.getSellerAvailability(sellerId)
    const slots: TestDriveSlot[] = []

    const currentDate = new Date(startDate)

    while (currentDate <= endDate) {
      const dateString = currentDate.toISOString().split("T")[0]
      const dayName = currentDate.toLocaleDateString("en-US", { weekday: "lowercase" }) as keyof WeeklySchedule
      const dayAvailability = availability.weeklySchedule[dayName]

      // Skip if day is not available or blocked
      if (!dayAvailability.isAvailable || availability.blockedDates.includes(dateString)) {
        currentDate.setDate(currentDate.getDate() + 1)
        continue
      }

      // Generate time slots for the day
      for (const timeSlot of dayAvailability.timeSlots) {
        const slot: TestDriveSlot = {
          date: dateString,
          timeSlot,
          isAvailable: true,
          isBooked: false,
        }

        // Check if this specific time slot is blocked
        const isBlocked = availability.blockedTimeSlots.some(
          (blocked) => blocked.date === dateString && this.timeSlotsOverlap(blocked.timeSlot, timeSlot),
        )

        if (isBlocked) {
          const blockedSlot = availability.blockedTimeSlots.find(
            (blocked) => blocked.date === dateString && this.timeSlotsOverlap(blocked.timeSlot, timeSlot),
          )
          slot.isAvailable = false
          slot.reason = blockedSlot?.reason || "Unavailable"
        }

        slots.push(slot)
      }

      currentDate.setDate(currentDate.getDate() + 1)
    }

    return slots
  }

  async blockTimeSlot(sellerId: string, date: string, timeSlot: TimeSlot, reason?: string): Promise<void> {
    const availability = await this.getSellerAvailability(sellerId)

    availability.blockedTimeSlots.push({
      date,
      timeSlot,
      reason,
    })

    await this.updateSellerAvailability(sellerId, availability)
  }

  async unblockTimeSlot(sellerId: string, date: string, timeSlot: TimeSlot): Promise<void> {
    const availability = await this.getSellerAvailability(sellerId)

    availability.blockedTimeSlots = availability.blockedTimeSlots.filter(
      (blocked) => !(blocked.date === date && this.timeSlotsOverlap(blocked.timeSlot, timeSlot)),
    )

    await this.updateSellerAvailability(sellerId, availability)
  }

  async blockDate(sellerId: string, date: string): Promise<void> {
    const availability = await this.getSellerAvailability(sellerId)

    if (!availability.blockedDates.includes(date)) {
      availability.blockedDates.push(date)
      await this.updateSellerAvailability(sellerId, availability)
    }
  }

  async unblockDate(sellerId: string, date: string): Promise<void> {
    const availability = await this.getSellerAvailability(sellerId)

    availability.blockedDates = availability.blockedDates.filter((blocked) => blocked !== date)
    await this.updateSellerAvailability(sellerId, availability)
  }

  async updateWeeklySchedule(sellerId: string, schedule: WeeklySchedule): Promise<void> {
    await this.updateSellerAvailability(sellerId, { weeklySchedule: schedule })
  }

  async isTimeSlotAvailable(sellerId: string, date: string, timeSlot: TimeSlot): Promise<boolean> {
    const availability = await this.getSellerAvailability(sellerId)

    // Check if date is blocked
    if (availability.blockedDates.includes(date)) {
      return false
    }

    // Check day of week availability
    const dayName = new Date(date).toLocaleDateString("en-US", { weekday: "lowercase" }) as keyof WeeklySchedule
    const dayAvailability = availability.weeklySchedule[dayName]

    if (!dayAvailability.isAvailable) {
      return false
    }

    // Check if time slot falls within available hours
    const isWithinHours = dayAvailability.timeSlots.some((availableSlot) =>
      this.timeSlotWithinRange(timeSlot, availableSlot),
    )

    if (!isWithinHours) {
      return false
    }

    // Check if specific time slot is blocked
    const isBlocked = availability.blockedTimeSlots.some(
      (blocked) => blocked.date === date && this.timeSlotsOverlap(blocked.timeSlot, timeSlot),
    )

    return !isBlocked
  }

  private timeSlotsOverlap(slot1: TimeSlot, slot2: TimeSlot): boolean {
    const start1 = this.timeToMinutes(slot1.start)
    const end1 = this.timeToMinutes(slot1.end)
    const start2 = this.timeToMinutes(slot2.start)
    const end2 = this.timeToMinutes(slot2.end)

    return start1 < end2 && start2 < end1
  }

  private timeSlotWithinRange(slot: TimeSlot, range: TimeSlot): boolean {
    const slotStart = this.timeToMinutes(slot.start)
    const slotEnd = this.timeToMinutes(slot.end)
    const rangeStart = this.timeToMinutes(range.start)
    const rangeEnd = this.timeToMinutes(range.end)

    return slotStart >= rangeStart && slotEnd <= rangeEnd
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(":").map(Number)
    return hours * 60 + minutes
  }

  async generateTimeSlots(
    startTime: string,
    endTime: string,
    duration = 60, // minutes
  ): Promise<TimeSlot[]> {
    const slots: TimeSlot[] = []
    const startMinutes = this.timeToMinutes(startTime)
    const endMinutes = this.timeToMinutes(endTime)

    for (let current = startMinutes; current + duration <= endMinutes; current += duration) {
      const start = this.minutesToTime(current)
      const end = this.minutesToTime(current + duration)
      slots.push({ start, end })
    }

    return slots
  }

  private minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`
  }
}

// Export singleton instance
export const sellerAvailabilityService = new SellerAvailabilityService()

// Export types
export type { SellerAvailability, WeeklySchedule, DayAvailability, TimeSlot, TestDriveSlot }
