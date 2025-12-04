'use server'

import { parseEventWithGemini, EventDetails } from '../lib/gemini'

export interface GenerateEventResult {
  success: boolean
  data?: EventDetails
  error?: string
}

export async function generateEvent(
  prevState: GenerateEventResult,
  formData: FormData
): Promise<GenerateEventResult> {
  // TODO: Add authenticated logging after Clerk adds proxy-aware middleware detection.

  const text = formData.get('text') as string
  const image = formData.get('image') as string // Base64 string

  if (!text && !image) {
    return { success: false, error: '請提供文字或圖片內容' }
  }

  try {
    const eventDetails = await parseEventWithGemini(text, image)
    return { success: true, data: eventDetails }
  } catch (error) {
    console.error('Error generating event:', error)
    return {
      success: false,
      error: '無法分析內容，請稍後再試或提供更清晰的資訊',
    }
  }
}
