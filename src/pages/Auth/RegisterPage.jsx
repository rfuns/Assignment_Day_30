import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import Button from '../../components/Button/Button'
import Card from '../../components/Card/Card'
import Container from '../../components/Container/Container'
import { Alert } from '../../components/Feedback/Feedback'
import Input from '../../components/Input/Input'
import { useAuth } from '../../context/AuthContext'
import styles from './Auth.module.css'

export default function RegisterPage() {
  const { register, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ firstName: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) return <Navigate to="/" replace />

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register({ ...form, email: form.email.trim() })
      navigate('/', { replace: true })
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
          <h1 className={styles.title}>Daftar</h1>
          <form className={styles.form} onSubmit={onSubmit}>
            <Input label="Nama depan" name="firstName" value={form.firstName} onChange={onChange} />
            <Input label="Email" name="email" value={form.email} onChange={onChange} autoComplete="email" />
            <Input label="Password (min. 6 karakter)" name="password" type="password" value={form.password} onChange={onChange} autoComplete="new-password" />
            {error && <Alert>{error}</Alert>}
            <Button type="submit" fullWidth loading={loading}>
              Buat akun
            </Button>
          </form>
          <p className={styles.hint}>
            Sudah punya akun? <Link to="/login">Login</Link>
          </p>
        </Card>
      </div>
    </Container>
  )
}
