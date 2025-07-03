"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, MapPin, User, Phone, Mail, Car, Download, ExternalLink, Plus, XCircle } from "lucide-react"
import { downloadICSFile, getGoogleCalendarUrl, getOutlookCalendarUrl, getYahooCalendarUrl } from "@/lib/calendar-utils"
import { useToast } from "@/hooks/use-toast"
import { useTestDrive } from "@/contexts/test-drive-context"
import CalendarPicker from "@/components/calendar-picker"
import TimeSlotPicker from "@/components/time-slot-picker"
import MobileModal from "@/components/mobile-modal"
import type { TestDriveFormData, VehicleData } from "@/types/test-drive"

interface TestDriveModalProps {
  isOpen: boolean
  onClose: () => void
  vehicle: {
    id: string
    make: string
    model: string
    year: number
    price: number
    seller: {
      name: string
      email: string
      phone?: string
    }
  }
}

export default function TestDriveModal({ isOpen, onClose, vehicle }: TestDriveModalProps) {
  const { formState, updateFormData, validateForm, scheduleTestDrive, saveDraft, loadDraft, clearDraft } =
    useTestDrive()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({})

  const { toast } = useToast()
  const router = useRouter()

  // Load draft when modal opens
  useEffect(() => {
    if (isOpen && vehicle.id) {
      loadDraft(vehicle.id)
    }
  }, [isOpen, vehicle.id, loadDraft])

  // Auto-save draft periodically
  useEffect(() => {
    if (!isOpen || !formState.isDirty || !vehicle.id) return

    const autoSaveTimer = setTimeout(() => {
      saveDraft(vehicle.id)
    }, 2000)

    return () => clearTimeout(autoSaveTimer)
  }, [formState.data, formState.isDirty, isOpen, vehicle.id, saveDraft])

  const handleInputChange = useCallback(
    (field: keyof TestDriveFormData, value: string) => {
      updateFormData(field, value)
    },
    [updateFormData],
  )

  const handleFieldBlur = useCallback((field: keyof TestDriveFormData) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }))
  }, [])

  const validateStep1 = useCallback((): boolean => {
    const requiredFields = ["name", "email", "phone", "licenseType", "drivingExperience"]
    const hasErrors = requiredFields.some((field) => {
      const error = formState.errors[field as keyof TestDriveFormData]
      return error || !formState.data[field as keyof TestDriveFormData]
    })

    // Mark required fields as touched
    const newTouchedFields = requiredFields.reduce(
      (acc, field) => {
        acc[field] = true
        return acc
      },
      {} as Record<string, boolean>,
    )

    setTouchedFields((prev) => ({ ...prev, ...newTouchedFields }))

    return !hasErrors
  }, [formState.errors, formState.data])

  const validateStep2 = useCallback((): boolean => {
    const requiredFields = ["preferredDate", "preferredTime", "meetingLocation"]
    const hasErrors = requiredFields.some((field) => {
      const error = formState.errors[field as keyof TestDriveFormData]
      return error || !formState.data[field as keyof TestDriveFormData]
    })

    // Check custom location if selected
    if (formState.data.meetingLocation === "custom" && !formState.data.customLocation.trim()) {
      return false
    }

    // Mark required fields as touched
    const newTouchedFields = requiredFields.reduce(
      (acc, field) => {
        acc[field] = true
        return acc
      },
      {} as Record<string, boolean>,
    )

    setTouchedFields((prev) => ({ ...prev, ...newTouchedFields }))

    return !hasErrors
  }, [formState.errors, formState.data])

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2)
    } else {
      toast({
        title: "Please fix the errors",
        description: "Please fill in all required fields correctly before proceeding.",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async () => {
    if (!validateStep2()) {
      toast({
        title: "Please fix the errors",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const vehicleData: VehicleData = {
        id: vehicle.id,
        title: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
        price: vehicle.price.toString(),
        sellerEmail: vehicle.seller.email,
        sellerName: vehicle.seller.name,
      }

      await scheduleTestDrive(formState.data, vehicleData)

      // Clear draft after successful submission
      await clearDraft(vehicle.id)

      setStep(3)
      toast({
        title: "Test Drive Scheduled!",
        description: "Your test drive request has been sent successfully.",
      })
    } catch (error) {
      console.error("Test drive request error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setStep(1)
    setTouchedFields({})
    onClose()
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const generateCalendarEvent = () => {
    const startDate = new Date(`${formState.data.preferredDate}T${formState.data.preferredTime}:00`)
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000)

    return {
      title: `Test Drive - ${vehicle.year} ${vehicle.make} ${vehicle.model}`,
      description: `Test drive appointment for ${vehicle.year} ${vehicle.make} ${vehicle.model}

Customer: ${formState.data.name}
Phone: ${formState.data.phone}
Email: ${formState.data.email}

Meeting Location: ${formState.data.meetingLocation === "custom" ? formState.data.customLocation : formState.data.meetingLocation}

Notes: ${formState.data.additionalNotes || "None"}`,
      startDate,
      endDate,
      location:
        formState.data.meetingLocation === "custom" ? formState.data.customLocation : formState.data.meetingLocation,
      attendees: [formState.data.email],
    }
  }

  const handleDownloadCalendar = () => {
    const event = generateCalendarEvent()
    downloadICSFile(event, `test-drive-${vehicle.id}.ics`)
  }

  const handleAddToGoogleCalendar = () => {
    const event = generateCalendarEvent()
    window.open(getGoogleCalendarUrl(event), "_blank")
  }

  const handleAddToOutlookCalendar = () => {
    const event = generateCalendarEvent()
    window.open(getOutlookCalendarUrl(event), "_blank")
  }

  const handleAddToYahooCalendar = () => {
    const event = generateCalendarEvent()
    window.open(getYahooCalendarUrl(event), "_blank")
  }

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Personal Information"
      case 2:
        return "Schedule Details"
      case 3:
        return "Confirmation"
      default:
        return "Schedule Test Drive"
    }
  }

  const vehicleTitle = `${vehicle.year} ${vehicle.make} ${vehicle.model}`

  return (
    <MobileModal
      isOpen={isOpen}
      onClose={handleClose}
      title={`${getStepTitle()} - ${vehicleTitle}`}
      showBackButton={step > 1 && step < 3}
      onBack={handleBack}
      fullScreen={step === 2}
    >
      {step === 1 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name *
              </Label>
              <Input
                id="name"
                value={formState.data.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                onBlur={() => handleFieldBlur("name")}
                placeholder="Enter your full name"
                className={formState.errors.name && touchedFields.name ? "border-red-500 focus:border-red-500" : ""}
              />
              {formState.errors.name && touchedFields.name && (
                <p className="text-sm text-red-500 mt-1">{formState.errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                value={formState.data.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                onBlur={() => handleFieldBlur("email")}
                placeholder="Enter your email address"
                className={formState.errors.email && touchedFields.email ? "border-red-500 focus:border-red-500" : ""}
              />
              {formState.errors.email && touchedFields.email && (
                <p className="text-sm text-red-500 mt-1">{formState.errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number *
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formState.data.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                onBlur={() => handleFieldBlur("phone")}
                placeholder="Enter phone number (e.g., 080-3967-9000)"
                className={formState.errors.phone && touchedFields.phone ? "border-red-500 focus:border-red-500" : ""}
              />
              {formState.errors.phone && touchedFields.phone && (
                <p className="text-sm text-red-500 mt-1">{formState.errors.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="licenseType">License Type *</Label>
              <Select
                value={formState.data.licenseType}
                onValueChange={(value) => handleInputChange("licenseType", value)}
              >
                <SelectTrigger
                  className={
                    formState.errors.licenseType && touchedFields.licenseType
                      ? "border-red-500 focus:border-red-500"
                      : ""
                  }
                >
                  <SelectValue placeholder="Select license type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Full License</SelectItem>
                  <SelectItem value="provisional">Provisional License</SelectItem>
                  <SelectItem value="international">International License</SelectItem>
                </SelectContent>
              </Select>
              {formState.errors.licenseType && touchedFields.licenseType && (
                <p className="text-sm text-red-500 mt-1">{formState.errors.licenseType}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="drivingExperience">Driving Experience *</Label>
              <Select
                value={formState.data.drivingExperience}
                onValueChange={(value) => handleInputChange("drivingExperience", value)}
              >
                <SelectTrigger
                  className={
                    formState.errors.drivingExperience && touchedFields.drivingExperience
                      ? "border-red-500 focus:border-red-500"
                      : ""
                  }
                >
                  <SelectValue placeholder="Select your driving experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner (0-2 years)</SelectItem>
                  <SelectItem value="intermediate">Intermediate (3-5 years)</SelectItem>
                  <SelectItem value="experienced">Experienced (6+ years)</SelectItem>
                </SelectContent>
              </Select>
              {formState.errors.drivingExperience && touchedFields.drivingExperience && (
                <p className="text-sm text-red-500 mt-1">{formState.errors.drivingExperience}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={handleNext} className="w-full sm:w-auto bg-placebo-gold hover:bg-placebo-gold/90">
              Next: Schedule Details
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          {/* Calendar Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-placebo-gold" />
              <h3 className="font-semibold text-lg">Select Date</h3>
            </div>

            <CalendarPicker
              selectedDate={formState.data.preferredDate}
              onDateSelect={(date) => {
                handleInputChange("preferredDate", date)
                // Clear time selection when date changes
                if (formState.data.preferredTime) {
                  handleInputChange("preferredTime", "")
                }
              }}
              minDate={new Date(Date.now() + 24 * 60 * 60 * 1000)}
              maxDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
              className="w-full"
            />
            {formState.errors.preferredDate && touchedFields.preferredDate && (
              <p className="text-sm text-red-500">{formState.errors.preferredDate}</p>
            )}
          </div>

          {/* Time Slot Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-placebo-gold" />
              <h3 className="font-semibold text-lg">Select Time</h3>
            </div>

            <TimeSlotPicker
              selectedDate={formState.data.preferredDate}
              selectedTime={formState.data.preferredTime}
              onTimeSelect={(time) => handleInputChange("preferredTime", time)}
              className="w-full"
              showTimeCategories={true}
            />
            {formState.errors.preferredTime && touchedFields.preferredTime && (
              <p className="text-sm text-red-500">{formState.errors.preferredTime}</p>
            )}
          </div>

          {/* Meeting Location */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-placebo-gold" />
              <h3 className="font-semibold text-lg">Meeting Location</h3>
            </div>

            <Select
              value={formState.data.meetingLocation}
              onValueChange={(value) => handleInputChange("meetingLocation", value)}
            >
              <SelectTrigger
                className={
                  formState.errors.meetingLocation && touchedFields.meetingLocation
                    ? "border-red-500 focus:border-red-500"
                    : ""
                }
              >
                <SelectValue placeholder="Select meeting location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="seller">Seller's Location</SelectItem>
                <SelectItem value="office">Our Office</SelectItem>
                <SelectItem value="public">Public Meeting Place</SelectItem>
                <SelectItem value="custom">Custom Location</SelectItem>
              </SelectContent>
            </Select>
            {formState.errors.meetingLocation && touchedFields.meetingLocation && (
              <p className="text-sm text-red-500">{formState.errors.meetingLocation}</p>
            )}

            {formState.data.meetingLocation === "custom" && (
              <div className="space-y-2">
                <Label htmlFor="customLocation">Custom Location *</Label>
                <Input
                  id="customLocation"
                  value={formState.data.customLocation}
                  onChange={(e) => handleInputChange("customLocation", e.target.value)}
                  onBlur={() => handleFieldBlur("customLocation")}
                  placeholder="Enter custom meeting location"
                  className={
                    formState.errors.customLocation && touchedFields.customLocation
                      ? "border-red-500 focus:border-red-500"
                      : ""
                  }
                />
                {formState.errors.customLocation && touchedFields.customLocation && (
                  <p className="text-sm text-red-500">{formState.errors.customLocation}</p>
                )}
              </div>
            )}
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Additional Information (Optional)</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
                <Input
                  id="emergencyContactName"
                  value={formState.data.emergencyContactName}
                  onChange={(e) => handleInputChange("emergencyContactName", e.target.value)}
                  placeholder="Emergency contact name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyContactPhone">Emergency Contact Phone</Label>
                <Input
                  id="emergencyContactPhone"
                  type="tel"
                  value={formState.data.emergencyContactPhone}
                  onChange={(e) => handleInputChange("emergencyContactPhone", e.target.value)}
                  placeholder="Emergency contact phone"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalNotes">Additional Notes</Label>
              <Textarea
                id="additionalNotes"
                value={formState.data.additionalNotes}
                onChange={(e) => handleInputChange("additionalNotes", e.target.value)}
                placeholder="Any additional notes or special requests..."
                rows={3}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button variant="outline" onClick={handleBack} className="w-full sm:w-auto bg-transparent">
              Back
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-placebo-gold hover:bg-placebo-gold/90"
            >
              {isSubmitting ? "Scheduling..." : "Schedule Test Drive"}
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Car className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-green-600">Test Drive Scheduled!</h3>
            <p className="text-gray-600">
              Your test drive request has been sent successfully. The seller will contact you shortly to confirm the
              details.
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg text-left space-y-2">
            <h4 className="font-semibold">Appointment Summary:</h4>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(formState.data.preferredDate).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p>
              <strong>Time:</strong>{" "}
              {formState.data.preferredTime &&
                new Date(`2000-01-01T${formState.data.preferredTime}:00`).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}
            </p>
            <p>
              <strong>Location:</strong>{" "}
              {formState.data.meetingLocation === "custom"
                ? formState.data.customLocation
                : formState.data.meetingLocation}
            </p>
            <p>
              <strong>Vehicle:</strong> {vehicleTitle}
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">Add to Calendar:</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={handleDownloadCalendar}
                className="flex items-center gap-2 bg-transparent"
              >
                <Download className="h-4 w-4" />
                Download .ics
              </Button>
              <Button
                variant="outline"
                onClick={handleAddToGoogleCalendar}
                className="flex items-center gap-2 bg-transparent"
              >
                <ExternalLink className="h-4 w-4" />
                Google Calendar
              </Button>
              <Button
                variant="outline"
                onClick={handleAddToOutlookCalendar}
                className="flex items-center gap-2 bg-transparent"
              >
                <ExternalLink className="h-4 w-4" />
                Outlook
              </Button>
              <Button
                variant="outline"
                onClick={handleAddToYahooCalendar}
                className="flex items-center gap-2 bg-transparent"
              >
                <ExternalLink className="h-4 w-4" />
                Yahoo Calendar
              </Button>
            </div>
          </div>

          {/* Primary Navigation Actions */}
          <div className="space-y-3">
            <h4 className="font-semibold">What's Next?</h4>

            {/* Primary CTA */}
            <Button
              onClick={() => {
                handleClose()
                router.push("/guest-dashboard?tab=test-drives")
              }}
              className="w-full bg-placebo-gold hover:bg-placebo-gold/90 text-placebo-black font-semibold"
            >
              <Calendar className="h-4 w-4 mr-2" />
              View My Test Drives
            </Button>

            {/* Secondary Actions */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  handleClose()
                  router.push("/guest-dashboard")
                }}
                className="flex items-center gap-2 bg-transparent"
              >
                <User className="h-4 w-4" />
                Go to Dashboard
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  handleClose()
                  router.push("/cars")
                }}
                className="flex items-center gap-2 bg-transparent"
              >
                <Car className="h-4 w-4" />
                Browse Vehicles
              </Button>
            </div>

            {/* Tertiary Actions */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="ghost"
                onClick={() => {
                  setStep(1)
                }}
                className="flex items-center gap-2 text-sm"
              >
                <Plus className="h-4 w-4" />
                Schedule Another
              </Button>
              <Button variant="ghost" onClick={handleClose} className="flex items-center gap-2 text-sm">
                <XCircle className="h-4 w-4" />
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </MobileModal>
  )
}
