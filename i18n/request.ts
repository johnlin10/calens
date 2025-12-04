import { getRequestConfig } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { routing } from './routing'

//* 使用靜態 import 避免 Vercel 上動態路徑解析問題
import en from '../messages/en.json'
import zhTw from '../messages/zh-tw.json'

const messagesMap: Record<string, typeof en> = {
  en,
  'zh-tw': zhTw,
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale

  return {
    locale,
    messages: messagesMap[locale as string],
  }
})
