import { useState } from 'react'
import { api } from '../../api/server'
import Button from '../../components/Button/Button'
import Container from '../../components/Container/Container'
import { Empty, ErrorMessage, Spinner } from '../../components/Feedback/Feedback'
import Input from '../../components/Input/Input'
import PageHeader from '../../components/PageHeader/PageHeader'
import Pagination from '../../components/Pagination/Pagination'
import TodoItem from '../../components/TodoItem/TodoItem'
import { useFetch } from '../../hooks/useFetch'
import styles from './Todos.module.css'

const PAGE_SIZE = 10

export default function Todos() {
  const [userId, setUserId] = useState('')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)

  // Ambil semua todo milik filter userId, status & pagination dilakukan di klien.
  const { data, loading, error, reload } = useFetch(
    () => api.get(`/todos?limit=500${userId ? `&userId=${userId}` : ''}`),
    [userId],
  )

  const filtered = (data?.todos || []).filter((t) =>
    status === 'all' ? true : status === 'done' ? t.completed : !t.completed,
  )
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const current = Math.min(page, totalPages)
  const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)

  const toggle = async (todo) => {
    await api.put(`/todos/${todo.id}`, { completed: !todo.completed })
    reload()
  }

  return (
    <Container>
      <PageHeader title="Tugas" subtitle={data ? `${filtered.length} tugas ditampilkan` : undefined} />
      <div className={styles.filters}>
        <Input
          label="Filter ID siswa"
          type="number"
          min="1"
          placeholder="mis. 1"
          value={userId}
          onChange={(e) => {
            setUserId(e.target.value)
            setPage(1)
          }}
        />
        <div className={styles.statusGroup} role="group" aria-label="Filter status">
          {[['all', 'Semua'], ['open', 'Belum'], ['done', 'Selesai']].map(([value, label]) => (
            <Button
              key={value}
              size="sm"
              variant={status === value ? 'primary' : 'secondary'}
              onClick={() => {
                setStatus(value)
                setPage(1)
              }}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {loading && <Spinner />}
      {error && <ErrorMessage error={error} onRetry={reload} />}
      {data && !filtered.length && !loading && <Empty>Tidak ada tugas.</Empty>}
      <ul className={styles.list}>
        {visible.map((t) => (
          <TodoItem key={t.id} todo={t} onToggle={toggle} showUser />
        ))}
      </ul>
      <Pagination page={current} totalPages={totalPages} onChange={setPage} />
    </Container>
  )
}
