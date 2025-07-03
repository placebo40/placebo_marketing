import type { TestDriveFormData, TestDriveValidationErrors } from "@/types/test-drive"

export function validateTestDriveForm(data: TestDriveFormData): TestDriveValidationErrors {
  const errors: TestDriveValidationErrors = {}

  // Name validation
  if (!data.name.trim()) {
    errors.name = "Name is required"
  } else if (data.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters"
  }

  // Email validation
  if (!data.email.trim()) {
    errors.email = "Email is required"
  } else if (!isValidEmail(data.email)) {
    errors.email = "Please enter a valid email address"
  }

  // Phone validation
  if (!data.phone.trim()) {
    errors.phone = "Phone number is required"
  } else if (!isValidPhone(data.phone)) {
    errors.phone = "Please enter a valid phone number"
  }

  // Date validation
  if (!data.preferredDate) {
    errors.preferredDate = "Preferred date is required"
  } else if (!isValidFutureDate(data.preferredDate)) {
    errors.preferredDate = "Please select a future date"
  }

  // Time validation
  if (!data.preferredTime) {
    errors.preferredTime = "Preferred time is required"
  }

  // Custom location validation
  if (data.meetingLocation === "custom" && !data.customLocation.trim()) {
    errors.customLocation = "Please specify the custom location"
  }

  // License type validation
  if (!data.licenseType.trim()) {
    errors.licenseType = "License type is required"
  }

  // Driving experience validation
  if (!data.drivingExperience.trim()) {
    errors.drivingExperience = "Driving experience is required"
  }

  // Emergency contact validation
  if (!data.emergencyContactName.trim()) {
    errors.emergencyContactName = "Emergency contact name is required"
  }

  if (!data.emergencyContactPhone.trim()) {
    errors.emergencyContactPhone = "Emergency contact phone is required"
  } else if (!isValidPhone(data.emergencyContactPhone)) {
    errors.emergencyContactPhone = "Please enter a valid emergency contact phone"
  }

  return errors
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function isValidPhone(phone: string): boolean {
  // Support Japanese and international phone formats
  const phoneRegex = /^[+]?[0-9\-().\s]{10,15}$/
  return phoneRegex.test(phone.replace(/\s/g, ""))
}

function isValidFutureDate(dateString: string): boolean {
  const selectedDate = new Date(dateString)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return selectedDate >= today
}

export function validateField(
  field: keyof TestDriveFormData,
  value: string,
  allData?: TestDriveFormData,
): string | null {
  const tempData = allData ? { ...allData, [field]: value } : ({ [field]: value } as Partial<TestDriveFormData>)
  const errors = validateTestDriveForm(tempData as TestDriveFormData)
  return errors[field] || null
}

export function validateEmail(email: string): boolean {
  return isValidEmail(email)
}

export function validatePhone(phone: string): boolean {
  return isValidPhone(phone)
}

export function validateDate(date: string): boolean {
  return isValidFutureDate(date)
}
