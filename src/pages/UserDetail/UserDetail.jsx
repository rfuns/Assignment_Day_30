import { useParams } from 'react-router-dom'
import { api } from '../../api/server'
import Avatar from '../../components/Avatar/Avatar'
import Badge from '../../components/Badge/Badge'
import Button from '../../components/Button/Button'
import Card from '../../components/Card/Card'
import Container from '../../components/Container/Container'
import { Empty, ErrorMessage, Spinner } from '../../components/Feedback/Feedback'
import TodoItem from '../../components/TodoItem/TodoItem'
import { useAuth } from '../../context/AuthContext'
import { useFetch } from '../../hooks/useFetch'
import { ROLE_COLOR } from '../../utils/roleColor'
import styles from './UserDetail.module.css'

export default function UserDetail() {
  const { id } = useParams()
  const { token } = useAuth()
  const user = useFetch(() => api.get(`/users/${id}`, token).then((r) => r.data), [id, token])
  const todos = useFetch(() => api.get(`/todos?userId=${id}`), [id])

  const toggle = async (todo) => {
    await api.put(`/todos/${todo.id}`, { completed: !todo.completed })
    todos.reload()
  }

  const u = user.data
  const list = todos.data?.todos || []
  const done = list.filter((t) => t.completed).length
  const percent = list.length ? Math.round((done / list.length) * 100) : 0

  return (
    <Container>
      <div className={styles.back}>
        <Button to="/users" variant="ghost" size="sm">
          ← Kembali ke siswa
        </Button>
      </div>
      {user.loading && <Spinner />}
      {user.error && <ErrorMessage error={user.error} onRetry={user.error.status === 404 ? undefined : user.reload} />}
      {u && (
        <>
          <Card>
            <div className={styles.profile}>
              <Avatar user={u} size={80} />
              <div className={styles.details}>
                <h1 className={styles.name}>
                  {u.firstName} {u.lastName}
                </h1>
                <Badge color={ROLE_COLOR[u.role] || 'gray'}>{u.role}</Badge>
                <dl className={styles.list}>
                  <div><dt>Username</dt><dd>@{u.username}</dd></div>
                  <div><dt>Email</dt><dd>{u.email}</dd></div>
                  <div><dt>Telepon</dt><dd>{u.phone || '-'}</dd></div>
                  <div><dt>Umur</dt><dd>{u.age ?? '-'}</dd></div>
                </dl>
              </div>
            </div>
          </Card>

          <h2 className={styles.section}>Tugas siswa</h2>
          <div className={styles.progress} aria-label={`Progres ${percent}%`}>
            <div className={styles.bar} style={{ width: `${percent}%` }} />
          </div>
          <p className={styles.progressText}>
            {done} dari {list.length} tugas selesai ({percent}%)
          </p>
          {todos.loading && <Spinner />}
          {todos.error && <ErrorMessage error={todos.error} onRetry={todos.reload} />}
          {todos.data && !list.length && <Empty>Siswa ini belum memiliki tugas.</Empty>}
          <ul className={styles.todos}>
            {list.map((t) => (
              <TodoItem key={t.id} todo={t} onToggle={toggle} />
            ))}
          </ul>
        </>
      )}
    </Container>
  )
}
