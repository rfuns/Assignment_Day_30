import { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Button from '../Button/Button'
import styles from './Navbar.module.css'

const LINKS = [
  { to: '/', label: 'Materi', end: true },
  { to: '/users', label: 'Siswa', protected: true },
  { to: '/todos', label: 'Tugas', protected: true },
  { to: '/quiz', label: 'Kuis', protected: true },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const close = () => setOpen(false)

  const handleLogout = () => {
    logout()
    close()
    navigate('/')
  }

  return (
    <header className={styles.header}>
      <div className={styles.bar}>
        <Link to="/" className={styles.brand} onClick={close}>
          🎓 <span>MiniLMS</span>
        </Link>
        <button
          type="button"
          className={styles.toggle}
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? '✕' : '☰'}
        </button>
        <nav className={`${styles.menu} ${open ? styles.open : ''}`}>
          <ul className={styles.links}>
            {LINKS.filter((l) => !l.protected || isAuthenticated).map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.end}
                  onClick={close}
                  className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className={styles.actions}>
            {isAuthenticated ? (
              <>
                <span className={styles.user}>Hi, {user?.firstName}</span>
                <Button size="sm" variant="secondary" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button size="sm" variant="ghost" to="/login" onClick={close}>
                  Login
                </Button>
                <Button size="sm" to="/register" onClick={close}>
                  Daftar
                </Button>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}
