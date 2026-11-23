import styles from './Container.module.css'

export default function Container({ children, narrow = false }) {
  return <div className={`${styles.container} ${narrow ? styles.narrow : ''}`}>{children}</div>
}
