import styles from './Badge.module.css'

const COLORS = {
  blue: ['#dbeafe', '#1d4ed8'],
  green: ['#dcfce7', '#15803d'],
  amber: ['#fef3c7', '#b45309'],
  red: ['#fee2e2', '#b91c1c'],
  purple: ['#ede9fe', '#6d28d9'],
  gray: ['#f1f5f9', '#475569'],
}

export default function Badge({ children, color = 'blue' }) {
  const [bg, fg] = COLORS[color] || COLORS.blue
  return (
    <span className={styles.badge} style={{ background: bg, color: fg }}>
      {children}
    </span>
  )
}
