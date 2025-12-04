'use client'

import { ChangeEvent, useState } from 'react'
import styles from './eventGenerator.module.scss'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

interface EventInputProps {
  disabled?: boolean
}

export default function EventInput({ disabled }: EventInputProps) {
  const t = useTranslations('home.heroSection.eventGenerator.form')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [eventGeneratorMode, setEventGeneratorMode] = useState<
    'text' | 'image'
  >('text')

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setImagePreview(null)
    }
  }

  return (
    <div className={styles.input_form}>
      <div className={styles.tabs}>
        <button
          type="button"
          className={`${styles.tab} ${
            eventGeneratorMode === 'text' ? styles.active : ''
          }`}
          onClick={() => setEventGeneratorMode('text')}
        >
          {t('modeSelector.textMode')}
        </button>
        <button
          type="button"
          className={`${styles.tab} ${
            eventGeneratorMode === 'image' ? styles.active : ''
          }`}
          onClick={() => setEventGeneratorMode('image')}
        >
          {t('modeSelector.imageMode')}
        </button>
      </div>

      <div className={styles.contentArea}>
        {eventGeneratorMode === 'text' && (
          <textarea
            name="text"
            className={styles.textarea}
            placeholder={t('textareaPlaceholder')}
            disabled={disabled}
          />
        )}
        {eventGeneratorMode === 'image' && (
          <div className={styles.image_upload}>
            <label htmlFor="image-upload" className={styles.uploadLabel}>
              <div className={styles.uploadIcon}>📁</div>
              <span>
                {imagePreview
                  ? t('imageUpload.replace')
                  : t('imageUpload.upload')}
              </span>
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={disabled}
              className={styles.fileInput}
            />
            {imagePreview && (
              <div className={styles.previewContainer}>
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className={styles.previewImage}
                />
                <input type="hidden" name="image" value={imagePreview} />
              </div>
            )}
          </div>
        )}
      </div>

      <button
        type="submit"
        className={styles.submit_button}
        disabled={disabled}
      >
        {disabled ? t('submit.buttonLoading') : t('submit.button')}
      </button>
    </div>
  )
}
