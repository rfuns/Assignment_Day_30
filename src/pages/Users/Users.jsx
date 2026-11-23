import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api } from '../../api/server'
import Avatar from '../../components/Avatar/Avatar'
import Badge from '../../components/Badge/Badge'
import Button from '../../components/Button/Button'
import Card from '../../components/Card/Card'
import Container from '../../components/Container/Container'
import { Alert, ErrorMessage, Spinner } from '../../components/Feedback/Feedback'
import Grid from '../../components/Grid/Grid'
import Input from '../../components/Input/Input'
import PageHeader from '../../components/PageHeader/PageHeader'
import Pagination from '../../components/Pagination/Pagination'
import { useAuth } from '../../context/AuthContext'
import { useFetch } from '../../hooks/useFetch'
import { ROLE_COLOR } from '../../utils/roleColor'
import styles from './Users.module.css'

const PER_PAGE = 8

const EMPTY = { firstName: '', lastName: '', email: '' }

function AddUserForm({ token, onAdded }) {
  const [form, setForm] = useState(EMPTY)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post('/users/add', form, token)
      setForm(EMPTY)
      onAdded()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  return (
    <Card className={styles.formCard}>
      <form className={styles.form} onSubmit={onSubmit}>
        <Input label="Nama depan" name="firstName" value={form.firstName} onChange={onChange} />
        <Input label="Nama belakang" name="lastName" value={form.lastName} onChange={onChange} />
        <Input label="Email" name="email" type="email" value={form.email} onChange={onChange} />
        <Button type="submit" loading={loading}>
          Simpan
        </Button>
      </form>
      {error && <Alert>{error}</Alert>}
    </Card>
  )
}

export default function Users() {
  const { token } = useAuth()
  const [params, setParams] = useSearchParams()
  const page = Math.max(1, Number(params.get('page')) || 1)
  const [showForm, setShowForm] = useState(false)
  const { data, loading, error, reload } = useFetch(
    () => api.get(`/users?page=${page}&per_page=${PER_PAGE}`, token),
    [page, token],
  )

  return (
    <Container>
      <PageHeader title="Daftar Siswa" subtitle={data ? `${data.total} pengguna terdaftar` : undefined}>
        <Button variant={showForm ? 'secondary' : 'primary'} onClick={() => setShowForm((s) => !s)}>
          {showForm ? 'Tutup' : '+ Tambah siswa'}
        </Button>
      </PageHeader>

      {showForm && (
        <AddUserForm
          token={token}
          onAdded={() => {
            setShowForm(false)
            setParams({})
            reload()
          }}
        />
      )}

      {loading && <Spinner />}
      {error && <ErrorMessage error={error} onRetry={reload} />}
      {data && !loading && (
        <Grid min={250}>
          {data.data.map((u) => (
            <Card key={u.id} to={`/users/${u.id}`}>
              <div className={styles.row}>
                <Avatar user={u} />
                <div className={styles.info}>
                  <strong className={styles.name}>
                    {u.firstName} {u.lastName}
                  </strong>
                  <span className={styles.muted}>@{u.username}</span>
                </div>
              </div>
              <span className={styles.muted}>{u.email}</span>
              <div>
                <Badge color={ROLE_COLOR[u.role] || 'gray'}>{u.role}</Badge>
              </div>
            </Card>
          ))}
        </Grid>
      )}
      {data && (
        <Pagination
          page={data.page}
          totalPages={data.total_pages}
          onChange={(p) => setParams(p > 1 ? { page: p } : {})}
        />
      )}
    </Container>
  )
}
