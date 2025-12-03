type Language = {
  displayName: string
  shortName: string
}

export const languages: Record<string, Language> = {
  'en-US': {
    displayName: 'English',
    shortName: 'EN',
  },
  'zh-TW': {
    displayName: '繁體中文（台灣）',
    shortName: 'TW',
  },
}

export const getLanguageDisplayName = (locale: string) => {
  return languages[locale as keyof typeof languages].displayName
}
