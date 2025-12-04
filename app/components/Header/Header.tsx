import Link from 'next/link'
import styles from './header.module.scss'
// import {
//   SignInButton,
//   SignUpButton,
//   SignedIn,
//   SignedOut,
//   UserButton,
// } from '@clerk/nextjs'
// import Image from 'next/image'
// import { useTranslations } from 'next-intl'
import LanguageSwitch from '../LanguageSwitch/LanguageSwitch'

export default function Header() {
  // const t = useTranslations('navigation')

  return (
    <div className={styles.header}>
      <div className={styles.header_container}>
        <div className={styles.header_logo}>
          <Link href="/">
            {/* <Image src="/logo.svg" alt="Calens" width={48} height={48} /> */}
            <span>Calens</span>
          </Link>
        </div>
        {/* <div className={styles.header_navigation}>
          <ul>
            <li>
              <Link href="/">{t('home')}</Link>
            </li>
            <li>
              <Link href="/about">{t('about')}</Link>
            </li>
          </ul>
        </div> */}
        <div className={styles.header_actions}>
          <LanguageSwitch />
          {/* <div className={styles.header_actions_user}>
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <SignInButton />
              <SignUpButton />
            </SignedOut>
          </div> */}
        </div>
      </div>
    </div>
  )
}
