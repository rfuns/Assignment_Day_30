import { useId } from 'react'
import styles from './Input.module.css'

export default function Input({ label, error, ...rest }) {
  const id = useId()
  return (
    <div className={styles.field}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <input id={id} className={`${styles.input} ${error ? styles.invalid : ''}`} {...rest} />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  )
}
