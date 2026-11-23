import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api } from '../../api/server'
import Badge from '../../components/Badge/Badge'
import Card from '../../components/Card/Card'
import Container from '../../components/Container/Container'
import { Empty, ErrorMessage, Spinner } from '../../components/Feedback/Feedback'
import Grid from '../../components/Grid/Grid'
import Input from '../../components/Input/Input'
import PageHeader from '../../components/PageHeader/PageHeader'
import Pagination from '../../components/Pagination/Pagination'
import { useFetch } from '../../hooks/useFetch'
import { tagColor } from '../../utils/tagColor'
import styles from './Home.module.css'

const PAGE_SIZE = 9

export default function Home() {
  const [params, setParams] = useSearchParams()
  const page = Math.max(1, Number(params.get('page')) || 1)
  const q = params.get('q') || ''
  const [search, setSearch] = useState(q)

  const { data, loading, error, reload } = useFetch(
    () => api.get(`/posts?limit=${PAGE_SIZE}&skip=${(page - 1) * PAGE_SIZE}&q=${encodeURIComponent(q)}`),
    [page, q],
  )

  const update = (next) => setParams(Object.fromEntries(Object.entries(next).filter(([, v]) => v && v !== 1)))
  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 1

  return (
    <>
      <section className={styles.hero}>
        <Container>
          <h1 className={styles.heroTitle}>Belajar Web Development dengan MiniLMS</h1>
          <p className={styles.heroText}>
            Jelajahi materi course, kerjakan tugas, dan uji pemahamanmu lewat kuis. Login untuk membuka fitur lengkap.
          </p>
        </Container>
      </section>

      <Container>
        <PageHeader title="Daftar Materi" subtitle={data ? `${data.total} materi tersedia` : 'Memuat materi...'} />
        <form
          className={styles.search}
          onSubmit={(e) => {
            e.preventDefault()
            update({ q: search.trim() })
          }}
        >
          <Input
            aria-label="Cari materi"
            placeholder="Cari judul atau tag, mis. love, history..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>

        {loading && <Spinner label="Memuat materi..." />}
        {error && <ErrorMessage error={error} onRetry={reload} />}
        {data && !data.posts.length && <Empty>Materi tidak ditemukan.</Empty>}
        {data && !loading && (
          <Grid min={300}>
            {data.posts.map((post) => (
              <Card key={post.id} to={`/posts/${post.id}`}>
                <h3 className={styles.cardTitle}>{post.title}</h3>
                <p className={styles.excerpt}>{post.body}</p>
                <div className={styles.tags}>
                  {post.tags.map((t) => (
                    <Badge key={t} color={tagColor(t)}>
                      {t}
                    </Badge>
                  ))}
                </div>
                <div className={styles.meta}>
                  <span>👁 {post.views}</span>
                  <span>👍 {post.reactions.likes}</span>
                </div>
              </Card>
            ))}
          </Grid>
        )}
        <Pagination page={page} totalPages={totalPages} onChange={(p) => update({ q, page: p })} />
      </Container>
    </>
  )
}
