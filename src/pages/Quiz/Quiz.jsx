import { useMemo, useState } from 'react'
import { api } from '../../api/server'
import Button from '../../components/Button/Button'
import Card from '../../components/Card/Card'
import Container from '../../components/Container/Container'
import { ErrorMessage, Spinner } from '../../components/Feedback/Feedback'
import PageHeader from '../../components/PageHeader/PageHeader'
import { useFetch } from '../../hooks/useFetch'
import styles from './Quiz.module.css'

const QUESTIONS = 5
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5)

// Soal: "Siapa pengucap kutipan ini?" dengan 4 pilihan penulis.
function buildQuestions(quotes) {
  const authors = [...new Set(quotes.map((q) => q.author))]
  return shuffle(quotes)
    .slice(0, QUESTIONS)
    .map((q) => ({
      ...q,
      options: shuffle([q.author, ...shuffle(authors.filter((a) => a !== q.author)).slice(0, 3)]),
    }))
}

function QuizGame({ quotes, onRestart }) {
  const questions = useMemo(() => buildQuestions(quotes), [quotes])
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState(null)
  const [score, setScore] = useState(0)

  if (index >= questions.length) {
    return (
      <Card>
        <h2>Hasil kuis</h2>
        <p className={styles.score}>
          {score} / {questions.length}
        </p>
        <Button onClick={onRestart}>Main lagi</Button>
      </Card>
    )
  }

  const q = questions[index]
  const answer = (opt) => {
    if (picked) return
    setPicked(opt)
    if (opt === q.author) setScore((s) => s + 1)
  }
  const next = () => {
    setPicked(null)
    setIndex((i) => i + 1)
  }

  return (
    <Card>
      <span className={styles.step}>
        Soal {index + 1} dari {questions.length}
      </span>
      <blockquote className={styles.quote}>“{q.quote}”</blockquote>
      <div className={styles.options}>
        {q.options.map((opt) => {
          const state = !picked ? '' : opt === q.author ? styles.correct : opt === picked ? styles.wrong : styles.dim
          return (
            <button key={opt} type="button" className={`${styles.option} ${state}`} onClick={() => answer(opt)}>
              {opt}
            </button>
          )
        })}
      </div>
      {picked && <Button onClick={next}>{index + 1 === questions.length ? 'Lihat hasil' : 'Lanjut'}</Button>}
    </Card>
  )
}

export default function Quiz() {
  const [round, setRound] = useState(0)
  const { data, loading, error, reload } = useFetch(() => api.get('/quotes?limit=100'), [])

  return (
    <Container>
      <PageHeader title="Kuis" subtitle="Tebak siapa yang mengucapkan kutipan berikut." />
      {loading && <Spinner />}
      {error && <ErrorMessage error={error} onRetry={reload} />}
      {data && <QuizGame key={round} quotes={data.quotes} onRestart={() => setRound((r) => r + 1)} />}
    </Container>
  )
}
