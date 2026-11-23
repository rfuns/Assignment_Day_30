import styles from './Avatar.module.css'

const COLORS = ['#2563eb', '#7c3aed', '#db2777', '#059669', '#d97706', '#0891b2']

// Menampilkan foto; bila tidak ada, inisial dengan warna berdasarkan nama.
export default function Avatar({ user, size = 48 }) {
  const name = `${user.firstName} ${user.lastName || ''}`.trim()
  const initials = name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
  const style = { width: size, height: size, fontSize: size * 0.38 }
  if (user.image) {
    return <img className={styles.avatar} style={style} src={user.image} alt={name} loading="lazy" />
  }
  return (
    <span className={styles.avatar} style={{ ...style, background: COLORS[user.id % COLORS.length] }} aria-label={name}>
      {initials}
    </span>
  )
}
