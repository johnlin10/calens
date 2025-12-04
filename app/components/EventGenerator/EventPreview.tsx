'use client'

import { EventDetails } from '@/app/lib/gemini'
import styles from './eventGenerator.module.scss'
import { format } from 'date-fns'
import { useTranslations } from 'next-intl'

interface EventPreviewProps {
  event: EventDetails
  onClose: () => void
}

export default function EventPreview({ event, onClose }: EventPreviewProps) {
  const t = useTranslations('home.heroSection.eventGenerator.preview')
  const googleCalendarUrl = (() => {
    try {
      const start =
        new Date(event.start).toISOString().replace(/[-:.]/g, '').slice(0, 15) +
        'Z'
      const end =
        new Date(event.end).toISOString().replace(/[-:.]/g, '').slice(0, 15) +
        'Z'

      const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: event.title,
        dates: `${start}/${end}`,
        details: event.description || '',
        location: event.location || '',
      })
      return `https://calendar.google.com/calendar/render?${params.toString()}`
    } catch (e) {
      console.error('Date parsing error', e)
      return '#'
    }
  })()

  const downloadIcs = () => {
    try {
      const startDate = new Date(event.start)
      const endDate = new Date(event.end)

      const formatIcsDate = (d: Date) =>
        d.toISOString().replace(/[-:.]/g, '').slice(0, 15) + 'Z'

      const content = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Calens//MVP//EN',
        'BEGIN:VEVENT',
        `DTSTART:${formatIcsDate(startDate)}`,
        `DTEND:${formatIcsDate(endDate)}`,
        `SUMMARY:${event.title}`,
        `DESCRIPTION:${event.description || ''}`,
        `LOCATION:${event.location || ''}`,
        'END:VEVENT',
        'END:VCALENDAR',
      ].join('\r\n')

      const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'event.ics'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (e) {
      alert('無法產生 .ics 檔案，請檢查日期格式')
      console.error('無法產生 .ics 檔案，請檢查日期格式', e)
    }
  }

  const formatDateSafe = (dateStr: string, fmt: string) => {
    try {
      return format(new Date(dateStr), fmt)
    } catch {
      return dateStr
    }
  }

  return (
    <div className={styles.resultCardOverlay}>
      <div className={styles.resultCard}>
        <div className={styles.cardHeader}>
          <div className={styles.successBadge}>{t('title')}</div>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.cardContent}>
          <div className={styles.mainInfo}>
            <label className={styles.label}>EVENT</label>
            <h2 className={styles.eventTitle}>{event.title}</h2>
          </div>

          <div className={styles.dateTimeGroup}>
            <div className={styles.dateTimeBlock}>
              <label className={styles.label}>DATE</label>
              <div className={styles.value}>
                {formatDateSafe(event.start, 'yyyy-MM-dd')}
              </div>
            </div>
            <div className={styles.dateTimeBlock}>
              <label className={styles.label}>TIME</label>
              <div className={styles.value}>
                {formatDateSafe(event.start, 'HH:mm')} -{' '}
                {formatDateSafe(event.end, 'HH:mm')}
              </div>
            </div>
          </div>

          {event.location && (
            <div className={styles.locationBlock}>
              <label className={styles.label}>LOCATION</label>
              <div className={styles.value}>{event.location}</div>
            </div>
          )}

          <div className={styles.divider}>
            <div className={styles.cutoutLeft}></div>
            <div className={styles.dashedLine}></div>
            <div className={styles.cutoutRight}></div>
          </div>

          <div className={styles.actions}>
            <button onClick={downloadIcs} className={styles.icsBtn}>
              {t('actions.ics')}
            </button>
            <a
              href={googleCalendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.googleBtn}
            >
              <span className={styles.icon}>↗</span>
              {t('actions.googleCalendar')}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
