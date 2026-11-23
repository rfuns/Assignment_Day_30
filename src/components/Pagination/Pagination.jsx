import Button from '../Button/Button'
import styles from './Pagination.module.css'

// Menampilkan: Prev, nomor halaman (dengan elipsis), Next.
function pageList(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = new Set([1, total, current, current - 1, current + 1])
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b)
  const out = []
  sorted.forEach((p, i) => {
    if (i && p - sorted[i - 1] > 1) out.push('…')
    out.push(p)
  })
  return out
}

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null
  return (
    <nav className={styles.nav} aria-label="Pagination">
      <Button size="sm" variant="secondary" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        ← Prev
      </Button>
      <div className={styles.pages}>
        {pageList(page, totalPages).map((p, i) =>
          p === '…' ? (
            <span key={`gap-${i}`} className={styles.gap}>…</span>
          ) : (
            <Button
              key={p}
              size="sm"
              variant={p === page ? 'primary' : 'ghost'}
              aria-current={p === page ? 'page' : undefined}
              onClick={() => onChange(p)}
            >
              {p}
            </Button>
          ),
        )}
      </div>
      <Button size="sm" variant="secondary" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
        Next →
      </Button>
    </nav>
  )
}
