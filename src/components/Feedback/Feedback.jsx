import Button from '../Button/Button'
import styles from './Feedback.module.css'

export function Spinner({ label = 'Memuat...' }) {
  return (
    <div className={styles.center} role="status">
      <span className={styles.spinner} />
      <span>{label}</span>
    </div>
  )
}

export function ErrorMessage({ error, onRetry }) {
  return (
    <div className={`${styles.center} ${styles.error}`} role="alert">
      <strong>Terjadi kesalahan</strong>
      <span>{error?.message || 'Tidak diketahui'}</span>
      {onRetry && (
        <Button size="sm" variant="secondary" onClick={onRetry}>
          Coba lagi
        </Button>
      )}
    </div>
  )
}

export function Alert({ children, type = 'error' }) {
  return (
    <div className={`${styles.alert} ${styles[type]}`} role={type === 'error' ? 'alert' : 'status'}>
      {children}
    </div>
  )
}

export function Empty({ children }) {
  return <div className={styles.center}>{children}</div>
}
