'use server'

import { auth } from '@clerk/nextjs/server'
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
  // MVP: Allow public access, but log user ID if available.
  try {
    const { userId } = await auth()
    console.log('User ID calling generateEvent:', userId)
  } catch (e) {
    // Ignore auth errors in MVP/demo mode if Clerk is not fully configured
    console.warn('Auth check failed, proceeding as guest:', e)
  }

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
