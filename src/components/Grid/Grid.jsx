import styles from './Grid.module.css'

// `min` (px) menentukan lebar minimum kolom, sehingga jumlah kolom menyesuaikan layar.
export default function Grid({ children, min = 260 }) {
  return (
    <div className={styles.grid} style={{ '--min': `${min}px` }}>
      {children}
    </div>
  )
}
