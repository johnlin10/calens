import styles from './pageContainer.module.scss'

interface PageContainerProps {
  children: React.ReactNode
  className?: string
  maxWidth?: number
  fullWidth?: boolean
}

export default function PageContainer({
  children,
  className,
  maxWidth = 720,
  fullWidth = false,
}: PageContainerProps) {
  return (
    <div className={`${styles.page_container} ${className}`}>
      <div
        className={styles.page_container_content}
        style={{ maxWidth: fullWidth ? '100%' : maxWidth }}
      >
        {children}
      </div>
    </div>
  )
}
