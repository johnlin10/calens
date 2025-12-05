import { getRequestConfig } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { routing } from './routing'

import en from '@/messages/en.json'
import zh_tw from '@/messages/zh_tw.json'

const messagesMap = {
  en: en,
  'zh-tw': zh_tw,
} as const

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale

  return {
    locale,
    messages: messagesMap[locale as keyof typeof messagesMap],
  }
})
