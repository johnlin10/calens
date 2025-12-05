import { getTranslations } from 'next-intl/server'
import styles from './home.module.scss'
import PageContainer from '../components/PageContainer/PageContainer'
import EventGenerator from '../components/EventGenerator'

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home' })

  return (
    <PageContainer className={styles.homePage} fullWidth>
      <section className={styles.heroSection}>
        <div className={styles.heroSectionContent}>
          <div className={styles.badge}>{t('heroSection.badge')}</div>
          <div className={styles.titleGroup}>
            <h1>{t('heroSection.title1')}</h1>
            <h1>{t('heroSection.title2')}</h1>
          </div>
          <div className={styles.descriptionGroup}>
            <p>{t('heroSection.description')}</p>
            <p className={styles.subDescription}>
              {t('heroSection.description2')}
            </p>
          </div>
          {/* <div className={styles.buttonGroup}>
            <button className={styles.primaryBtn}>
              {t('heroSection.buttons.start')} {'->'}
            </button>
            <button className={styles.secondaryBtn}>
              {t('heroSection.buttons.learnMore')}
            </button>
          </div> */}
        </div>

        <div className={styles.eventGeneratorContainer}>
          <EventGenerator />
        </div>
      </section>
    </PageContainer>
  )
}
