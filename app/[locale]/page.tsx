import { getTranslations } from 'next-intl/server'
import styles from './home.module.scss'

export default async function Home() {
  const t = await getTranslations('site_config')

  return (
    <div className={styles.homePage}>
      <main>
        <h1>{t('name')}</h1>
        <p>{t('description')}</p>
      </main>
    </div>
  )
}
