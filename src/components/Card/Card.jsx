import { Link } from 'react-router-dom'
import styles from './Card.module.css'

// `to` menjadikan seluruh kartu bisa diklik; `accent` memberi warna garis atas secara dinamis.
export default function Card({ children, to, accent, padded = true, className = '' }) {
  const cls = [styles.card, to && styles.clickable, padded && styles.padded, className].filter(Boolean).join(' ')
  const style = accent ? { borderTopColor: accent } : undefined
  if (to) {
    return (
      <Link to={to} className={cls} style={style}>
        {children}
      </Link>
    )
  }
  return (
    <div className={cls} style={style}>
      {children}
    </div>
  )
}
