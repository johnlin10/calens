import { GoogleGenerativeAI, Part } from '@google/generative-ai'

const apiKey = process.env.GOOGLE_GEMINI_API_KEY

const genAI = new GoogleGenerativeAI(apiKey || '')

const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
  generationConfig: {
    responseMimeType: 'application/json',
  },
})

export interface EventDetails {
  title: string
  start: string // ISO 8601
  end: string // ISO 8601
  location?: string
  description?: string
}

export async function parseEventWithGemini(
  promptText: string,
  imageBase64?: string
): Promise<EventDetails> {
  if (!apiKey) {
    throw new Error('GOOGLE_GEMINI_API_KEY is not defined')
  }

  const now = new Date().toISOString()

  const systemPrompt = `
    You are an intelligent assistant that extracts event details from text or images.
    Current time: ${now}
    
    Please analyze the provided content and extract the following information in strict JSON format:
    - title: Event title
    - start: Start time in ISO 8601 format (e.g., 2023-10-27T10:00:00). Infer the year/date if implied relative to current time.
    - end: End time in ISO 8601 format. If not specified, assume 1 hour duration after start.
    - location: Event location (optional)
    - description: Brief description or other details (optional)

    Return ONLY the JSON object.
  `

  const parts: Part[] = [
    { text: systemPrompt },
    { text: `Input content: ${promptText}` },
  ]

  if (imageBase64) {
    const base64Data = imageBase64.split(',')[1] || imageBase64
    parts.push({
      inlineData: {
        data: base64Data,
        mimeType: 'image/jpeg',
      },
    })
  }

  try {
    const result = await model.generateContent(parts)
    const response = result.response
    const text = response.text()
    return JSON.parse(text) as EventDetails
  } catch (error) {
    console.error('Gemini analysis failed:', error)
    throw new Error('Failed to analyze event details')
  }
}
