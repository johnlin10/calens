type Language = {
  displayName: string
  shortName: string
}

export const languages: Record<string, Language> = {
  en: {
    displayName: 'English',
    shortName: 'EN',
  },
  'zh-tw': {
    displayName: '繁體中文（台灣）',
    shortName: '繁中',
  },
}

export const getLanguageDisplayName = (locale: string) => {
  return languages[locale as keyof typeof languages].displayName
}
