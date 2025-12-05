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
  end?: string // ISO 8601
  isAllDay: boolean
  location?: string
  description?: string
}

export async function parseEventWithGemini(
  promptText: string,
  imageBase64?: string
): Promise<EventDetails[]> {
  if (!apiKey) {
    throw new Error('GOOGLE_GEMINI_API_KEY is not defined')
  }

  const now = new Date().toISOString()

  const systemPrompt = `
    You are an intelligent assistant that extracts event details from text or images.
    Current time: ${now}
    
    Please analyze the provided content and extract event details. 
    The content might contain multiple events.
    
    Output strictly a JSON ARRAY of objects. Each object should have:
    - title: Event title
    - start: Start time. 
      - If specific time is given: ISO 8601 format (e.g., "2023-10-27T10:00:00").
      - If it's an all-day event or no specific time: Date only (e.g., "2023-10-27").
    - end: End time.
      - If specific time is given: ISO 8601 format. Infer duration if not specified.
      - If all-day event: Same as start date (for single day) or end date (for multi-day).
    - isAllDay: Boolean. True if the event has no specific time or is explicitly all-day.
    - location: Event location (optional)
    - description: Brief description (optional)

    Rules:
    1. Return ONLY the JSON ARRAY.
    2. If multiple events are detected, include them all as separate objects in the array.
    3. Infer the year based on current time if not specified.
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
    // 使用 Gemini 生成內容
    const result = await model.generateContent(parts)
    // 取得回應
    const response = result.response
    // 取得回應的文字
    const text = response.text()
    // 清除文字中可能出現的 ``` 符號
    const cleanText = text.replace(/|```/g, '').trim()
    // 解析 JSON
    const parsed = JSON.parse(cleanText)

    // 檢查解析出來的是否為陣列
    if (Array.isArray(parsed)) {
      // 如果解析出來的是陣列，直接回傳
      return parsed as EventDetails[]
    } else {
      // 如果解析出來的是單一事件，且不是陣列，則包裝成陣列回傳
      return [parsed] as EventDetails[]
    }
  } catch (error) {
    console.error('Gemini analysis failed:', error)
    throw new Error('Failed to analyze event details')
  }
}
