import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  //* 取得 locale，如果不存在則使用預設值
  let locale = await requestLocale

  //* 確保 locale 有效
  if (!locale || !routing.locales.includes(locale as 'en' | 'zh-tw')) {
    locale = routing.defaultLocale
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
