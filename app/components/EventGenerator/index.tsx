'use client'

import { useActionState, useState, useEffect } from 'react'
import { generateEvent, GenerateEventResult } from '@/app/actions/generateEvent'
import EventInput from './EventInput'
import EventPreview from './EventPreview'
import styles from './eventGenerator.module.scss'

const initialState: GenerateEventResult = {
  success: false,
}

export default function EventGenerator() {
  const [state, formAction, isPending] = useActionState(
    generateEvent,
    initialState
  )
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    if (state.success && state.data) {
      // 使用 setTimeout 來避免直接在 render 期間觸發 state update 導致的警告，
      // 雖然在此場景下 useEffect 依賴項改變觸發是正常的，但為了符合 lint 規則與最佳實踐。
      const timer = setTimeout(() => setShowPreview(true), 0)
      return () => clearTimeout(timer)
    }
  }, [state.success, state.data])

  const handleClosePreview = () => {
    setShowPreview(false)
  }

  // const testEvents = [
  //   {
  //     title: '聖誕節交換禮物',
  //     start: '2025-12-24T12:10:00',
  //     end: '2025-12-24T15:30:00',
  //     location: '2324',
  //     isAllDay: false,
  //     description:
  //       '系學會誠摯邀請大家與一年級學弟妹們一起舉行聖誕節交換禮物。活動當天將準備午餐供大家享用。有興趣的同學請填寫表單。',
  //   },
  //   {
  //     title: '聖誕節交換禮物',
  //     start: '2025-12-24T12:10:00',
  //     end: '2025-12-24T15:30:00',
  //     location: '2324',
  //     isAllDay: false,
  //     description:
  //       '系學會誠摯邀請大家與一年級學弟妹們一起舉行聖誕節交換禮物。活動當天將準備午餐供大家享用。有興趣的同學請填寫表單。',
  //   },
  //   {
  //     title: '聖誕節交換禮物',
  //     start: '2025-12-24T12:10:00',
  //     end: '2025-12-24T15:30:00',
  //     location: '2324',
  //     isAllDay: false,
  //     description:
  //       '系學會誠摯邀請大家與一年級學弟妹們一起舉行聖誕節交換禮物。活動當天將準備午餐供大家享用。有興趣的同學請填寫表單。',
  //   },
  // ]

  return (
    <div className={styles.container}>
      <form action={formAction}>
        <EventInput disabled={isPending} />
      </form>

      {state.error && (
        <div
          style={{
            color: '#ff6b6b',
            padding: '1rem',
            background: 'rgba(255,0,0,0.1)',
            borderRadius: '8px',
            marginTop: '1rem',
          }}
        >
          ⚠️ {state.error}
        </div>
      )}

      {showPreview && state.data && (
        <EventPreview events={state.data} onClose={handleClosePreview} />
      )}

      {/* <EventPreview events={testEvents} onClose={handleClosePreview} /> */}
    </div>
  )
}
