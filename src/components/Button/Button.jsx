import { Link } from 'react-router-dom'
import styles from './Button.module.css'

// Props mengatur styling: variant, size, fullWidth, loading. Jika `to` diberikan, dirender sebagai Link.
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  to,
  type = 'button',
  ...rest
}) {
  const className = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.full,
    loading && styles.loading,
  ]
    .filter(Boolean)
    .join(' ')

  if (to) {
    return (
      <Link to={to} className={className} {...rest}>
        {children}
      </Link>
    )
  }
  return (
    <button type={type} className={className} disabled={disabled || loading} {...rest}>
      {loading ? 'Memproses...' : children}
    </button>
  )
}
