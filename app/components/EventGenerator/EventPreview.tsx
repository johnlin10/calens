'use client'

import { EventDetails } from '@/app/lib/gemini'
import styles from './eventGenerator.module.scss'
import { format } from 'date-fns'
import { useTranslations } from 'next-intl'
import { useState, useRef } from 'react'
import {
  CalendarDays,
  CalendarPlus,
  Clock,
  Download,
  X,
  AlignLeft,
  MapPin,
} from 'lucide-react'

// 父元件 Props
interface EventPreviewProps {
  events: EventDetails[]
  onClose: () => void
}

// 子元件 Props
interface EventCardProps {
  event: EventDetails
  index: number
  t: (key: string) => string
}

// --- 子元件：單一事件卡片 ---
function EventCard({ event, index, t }: EventCardProps) {
  // 日期格式化輔助函式
  const formatDateSafe = (dateStr: string, fmt: string) => {
    try {
      return format(new Date(dateStr), fmt)
    } catch {
      return dateStr
    }
  }

  // Google Calendar URL 生成邏輯
  const googleCalendarUrl = (() => {
    try {
      const startDate = new Date(event.start)
      const endDate = event.end
        ? new Date(event.end)
        : new Date(startDate.getTime() + 60 * 60 * 1000)

      const formatGCalDate = (d: Date) =>
        d.toISOString().replace(/[-:.]/g, '').slice(0, 15) + 'Z'
      const formatAllDay = (d: Date) =>
        d.toISOString().split('T')[0].replace(/-/g, '')

      let datesParam = ''

      if (event.isAllDay) {
        const nextDay = new Date(startDate)
        nextDay.setDate(nextDay.getDate() + 1)
        datesParam = `${formatAllDay(startDate)}/${formatAllDay(nextDay)}`
      } else {
        datesParam = `${formatGCalDate(startDate)}/${formatGCalDate(endDate)}`
      }

      const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: event.title,
        dates: datesParam,
        details: event.description || '',
        location: event.location || '',
      })
      return `https://calendar.google.com/calendar/render?${params.toString()}`
    } catch (e) {
      console.error('Date parsing error', e)
      return '#'
    }
  })()

  // ICS 下載邏輯
  const downloadIcs = () => {
    try {
      const startDate = new Date(event.start)
      const endDate = event.end
        ? new Date(event.end)
        : new Date(startDate.getTime() + 60 * 60 * 1000)

      const formatIcsDate = (d: Date) =>
        d.toISOString().replace(/[-:.]/g, '').slice(0, 15) + 'Z'
      const formatIcsAllDay = (d: Date) =>
        d.toISOString().split('T')[0].replace(/-/g, '')

      let dtStart = ''
      let dtEnd = ''

      if (event.isAllDay) {
        const nextDay = new Date(startDate)
        nextDay.setDate(nextDay.getDate() + 1)
        dtStart = `DTSTART;VALUE=DATE:${formatIcsAllDay(startDate)}`
        dtEnd = `DTEND;VALUE=DATE:${formatIcsAllDay(nextDay)}`
      } else {
        dtStart = `DTSTART:${formatIcsDate(startDate)}`
        dtEnd = `DTEND:${formatIcsDate(endDate)}`
      }

      const content = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Calens//MVP//EN',
        'BEGIN:VEVENT',
        dtStart,
        dtEnd,
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
      link.download = `${event.title}.ics`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (e) {
      alert('無法產生 .ics 檔案，請檢查日期格式')
      console.error('無法產生 .ics 檔案，請檢查日期格式', e)
    }
  }

  return (
    <div className={styles.resultCard}>
      <div className={styles.cardContent}>
        {/* 卡片上半部 */}
        <div className={styles.topSection}>
          <div className={styles.headerRow}>
            <label className={styles.label}>
              {t('card.header.label')} {String(index + 1).padStart(2, '0')}
            </label>
          </div>
          <h2 className={styles.eventTitle}>{event.title}</h2>

          <div className={styles.dateTimeGroup}>
            <div className={styles.dateTimeBlock}>
              <div className={styles.iconLabel}>
                <span className={styles.icon}>
                  <CalendarDays size={14} />
                </span>
                <label className={styles.label}>{t('card.date')}</label>
              </div>
              <div className={styles.value}>
                {formatDateSafe(event.start, 'yyyy-MM-dd')}
              </div>
            </div>

            <div className={styles.dateTimeBlock}>
              <div className={styles.iconLabel}>
                <span className={styles.icon}>
                  <Clock size={14} />
                </span>
                <label className={styles.label}>{t('card.time')}</label>
              </div>
              <div className={styles.value}>
                {event.isAllDay ? (
                  'All Day'
                ) : (
                  <>
                    {formatDateSafe(event.start, 'HH:mm')}
                    {event.end &&
                      formatDateSafe(event.start, 'HH:mm') !==
                        formatDateSafe(event.end, 'HH:mm') &&
                      ` - ${formatDateSafe(event.end, 'HH:mm')}`}
                  </>
                )}
              </div>
            </div>
          </div>

          {event.location && (
            <div className={styles.locationBlock}>
              <div className={styles.iconLabel}>
                <span className={styles.icon}>
                  <MapPin size={14} />
                </span>
                <label className={styles.label}>{t('card.location')}</label>
              </div>
              <div className={styles.locationContent}>
                <div className={styles.bar}></div>
                <div className={styles.value}>{event.location}</div>
              </div>
            </div>
          )}

          {event.description && (
            <div className={styles.descriptionBlock}>
              <div className={styles.iconLabel}>
                <span className={styles.icon}>
                  <AlignLeft size={14} />
                </span>
                <label className={styles.label}>{t('card.description')}</label>
              </div>
              <div className={styles.value}>{event.description}</div>
            </div>
          )}
        </div>

        {/* 分隔線區域 */}
        <div className={styles.divider}>
          <div className={styles.dashedLine}></div>
        </div>

        {/* 卡片下半部：按鈕 */}
        <div className={styles.bottomSection}>
          <div className={styles.actions}>
            <button onClick={downloadIcs} className={styles.icsBtn}>
              <span className={styles.icon}>
                <Download />
              </span>
              {t('card.actions.ics')}
            </button>
            <a
              href={googleCalendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.googleBtn}
            >
              <span className={styles.icon}>
                <CalendarPlus />
              </span>
              {t('card.actions.googleCalendar')}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- 主元件：Carousel 容器 ---
export default function EventPreview({ events, onClose }: EventPreviewProps) {
  const t = useTranslations('home.heroSection.eventGenerator.preview')
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // 滾動到指定卡片索引
  const scrollToCard = (index: number) => {
    if (scrollContainerRef.current) {
      const width = scrollContainerRef.current.offsetWidth
      scrollContainerRef.current.scrollTo({
        left: index * width,
        behavior: 'smooth',
      })
      // 注意：我們不在此直接 setCurrentIndex，而是依賴 onScroll 事件來更新狀態，
      // 這樣可以保持手動滾動和按鈕導航的狀態同步。
      // 但為了按鈕反應即時性，也可以同時設定，onScroll 會再確認一次。
      setCurrentIndex(index)
    }
  }

  const handlePrev = () => {
    const newIndex = Math.max(0, currentIndex - 1)
    scrollToCard(newIndex)
  }

  const handleNext = () => {
    const newIndex = Math.min(events.length - 1, currentIndex + 1)
    scrollToCard(newIndex)
  }

  // 處理滾動事件，更新 currentIndex
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const width = scrollContainerRef.current.offsetWidth
      const scrollLeft = scrollContainerRef.current.scrollLeft
      // 計算當前顯示的是第幾張卡片（四捨五入）
      const newIndex = Math.round(scrollLeft / width)

      // 只有當索引改變時才更新狀態
      if (
        newIndex !== currentIndex &&
        newIndex >= 0 &&
        newIndex < events.length
      ) {
        setCurrentIndex(newIndex)
      }
    }
  }

  return (
    <div className={styles.resultCardOverlay}>
      <div className={styles.carouselContainer}>
        {/* 頂部 Header */}
        <div className={styles.carouselHeader}>
          {events.length > 0 && (
            <div className={styles.multiEventBadge}>
              {t('multiEventBadge.found')} {events.length}{' '}
              {t('multiEventBadge.events')}
            </div>
          )}
          <button className={styles.closeButtonOverlay} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* 卡片顯示區 - 改為可滾動容器 */}
        <div
          className={styles.cardDisplayArea}
          ref={scrollContainerRef}
          onScroll={handleScroll}
        >
          {events.map((evt, idx) => (
            <div key={idx} className={styles.cardWrapper}>
              <EventCard event={evt} index={idx} t={t} />
            </div>
          ))}
        </div>

        {/* 底部導航 */}
        {events.length > 1 && (
          <div className={styles.navigationControls}>
            <button
              className={styles.navBtn}
              onClick={handlePrev}
              disabled={currentIndex === 0}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            <div className={styles.dots}>
              {events.map((_, idx) => (
                <div
                  key={idx}
                  className={`${styles.dot} ${
                    idx === currentIndex ? styles.active : ''
                  }`}
                  onClick={() => scrollToCard(idx)}
                  style={{ cursor: 'pointer' }}
                />
              ))}
            </div>

            <button
              className={styles.navBtn}
              onClick={handleNext}
              disabled={currentIndex === events.length - 1}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
