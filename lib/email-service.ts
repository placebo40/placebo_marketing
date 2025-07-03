import type { TestDriveRequest } from "@/types/test-drive"

interface EmailResponse {
  success: boolean
  message?: string
}

interface MessageData {
  to: string
  subject: string
  message: string
  from?: string
  vehicleInfo?: string
}

export async function sendTestDriveEmail(request: TestDriveRequest): Promise<EmailResponse> {
  try {
    // Mock implementation for development
    console.log("🧪 MOCK: Sending test drive email:", {
      to: request.sellerEmail,
      from: request.buyerData.email,
      vehicle: request.vehicleTitle,
      date: request.buyerData.preferredDate,
      time: request.buyerData.preferredTime,
    })

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock success response (90% success rate for demo)
    const success = Math.random() > 0.1

    if (success) {
      return {
        success: true,
        message: "Test drive request sent successfully",
      }
    } else {
      return {
        success: false,
        message: "Failed to send email. Please try again.",
      }
    }
  } catch (error) {
    console.error("Failed to send test drive email:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to send email",
    }
  }
}

export async function sendMessage(data: MessageData): Promise<EmailResponse> {
  try {
    // Mock implementation for development
    console.log("🧪 MOCK: Sending message:", {
      to: data.to,
      subject: data.subject,
      from: data.from,
    })

    // Validate required fields
    if (!data.to || !data.subject || !data.message) {
      throw new Error("Missing required fields: to, subject, or message")
    }

    if (!isValidEmail(data.to)) {
      throw new Error("Invalid recipient email address")
    }

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Mock success response
    return {
      success: true,
      message: "Message sent successfully",
    }
  } catch (error) {
    console.error("Failed to send message:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to send message",
    }
  }
}

export async function sendTestDriveConfirmation(
  request: TestDriveRequest,
  confirmationMessage: string,
  rescheduleData?: { date: string; time: string },
): Promise<EmailResponse> {
  try {
    const isReschedule = !!rescheduleData
    const subject = isReschedule
      ? `Test Drive Rescheduled - ${request.vehicleTitle}`
      : `Test Drive Confirmed - ${request.vehicleTitle}`

    const message = isReschedule
      ? `Your test drive has been rescheduled to ${rescheduleData.date} at ${rescheduleData.time}. ${confirmationMessage}`
      : `Your test drive has been confirmed for ${request.buyerData.preferredDate} at ${request.buyerData.preferredTime}. ${confirmationMessage}`

    return await sendMessage({
      to: request.buyerData.email,
      subject,
      message,
      vehicleInfo: `${request.vehicleTitle} - ${request.vehiclePrice}`,
    })
  } catch (error) {
    console.error("Failed to send test drive confirmation:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to send confirmation",
    }
  }
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function getMessageTemplates() {
  return {
    testDriveRequest: {
      subject: "Test Drive Request for {{vehicle_title}}",
      template: `
        Hello {{seller_name}},
        
        {{buyer_name}} is interested in scheduling a test drive for your {{vehicle_title}}.
        
        Preferred Date: {{preferred_date}}
        Preferred Time: {{preferred_time}}
        Contact: {{buyer_email}} | {{buyer_phone}}
        
        {{#if additional_notes}}
        Additional Notes: {{additional_notes}}
        {{/if}}
        
        Please respond to confirm or suggest an alternative time.
        
        Best regards,
        The Placebo Marketing Team
      `,
    },
    testDriveConfirmation: {
      subject: "Test Drive Confirmed - {{vehicle_title}}",
      template: `
        Hello {{buyer_name}},
        
        Your test drive for {{vehicle_title}} has been confirmed!
        
        Date: {{appointment_date}}
        Time: {{appointment_time}}
        Location: {{meeting_location}}
        Seller: {{seller_name}}
        
        Please arrive on time and bring a valid driver's license.
        
        Best regards,
        The Placebo Marketing Team
      `,
    },
  }
}
