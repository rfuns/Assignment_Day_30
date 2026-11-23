import { useParams } from 'react-router-dom'
import { api } from '../../api/server'
import Badge from '../../components/Badge/Badge'
import Button from '../../components/Button/Button'
import Card from '../../components/Card/Card'
import Container from '../../components/Container/Container'
import { ErrorMessage, Spinner } from '../../components/Feedback/Feedback'
import { useFetch } from '../../hooks/useFetch'
import { tagColor } from '../../utils/tagColor'
import styles from './PostDetail.module.css'

export default function PostDetail() {
  const { id } = useParams()
  const { data: post, loading, error, reload } = useFetch(() => api.get(`/posts/${id}`), [id])

  return (
    <Container>
      <div className={styles.back}>
        <Button to="/" variant="ghost" size="sm">
          ← Kembali ke materi
        </Button>
      </div>
      {loading && <Spinner />}
      {error && (
        <ErrorMessage error={error} onRetry={error.status === 404 ? undefined : reload} />
      )}
      {post && (
        <Card padded={false}>
          <article className={styles.article}>
            <h1 className={styles.title}>{post.title}</h1>
            <div className={styles.tags}>
              {post.tags.map((t) => (
                <Badge key={t} color={tagColor(t)}>
                  {t}
                </Badge>
              ))}
            </div>
            <p className={styles.body}>{post.body}</p>
            <dl className={styles.stats}>
              <div><dt>Dilihat</dt><dd>{post.views}</dd></div>
              <div><dt>Suka</dt><dd>{post.reactions.likes}</dd></div>
              <div><dt>Tidak suka</dt><dd>{post.reactions.dislikes}</dd></div>
              <div><dt>ID Pengajar</dt><dd>{post.userId}</dd></div>
            </dl>
          </article>
        </Card>
      )}
    </Container>
  )
}
