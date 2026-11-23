import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import Button from '../../components/Button/Button'
import Card from '../../components/Card/Card'
import Container from '../../components/Container/Container'
import { Alert } from '../../components/Feedback/Feedback'
import Input from '../../components/Input/Input'
import { useAuth } from '../../context/AuthContext'
import styles from './Auth.module.css'

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const from = location.state?.from?.pathname || '/'

  if (isAuthenticated) return <Navigate to={from} replace />

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      // Field "email" menerima email atau username.
      await login({ email: form.email.trim(), password: form.password })
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container narrow>
      <div className={styles.wrap}>
        <Card>
          <h1 className={styles.title}>Login</h1>
          {location.state?.from && <Alert type="success">Silakan login untuk membuka halaman tersebut.</Alert>}
          <form className={styles.form} onSubmit={onSubmit}>
            <Input label="Email atau username" name="email" value={form.email} onChange={onChange} autoComplete="username" />
            <Input label="Password" name="password" type="password" value={form.password} onChange={onChange} autoComplete="current-password" />
            {error && <Alert>{error}</Alert>}
            <Button type="submit" fullWidth loading={loading}>
              Login
            </Button>
          </form>
          <p className={styles.hint}>
            Belum punya akun? <Link to="/register">Daftar</Link>
          </p>
          <p className={styles.hint}>
            Demo: username <code>emilys</code> / password <code>emilyspass</code> (data DummyJSON). Jika memakai data cadangan: <code>aisyah</code> / <code>aisyah123</code>.
          </p>
        </Card>
      </div>
    </Container>
  )
}
