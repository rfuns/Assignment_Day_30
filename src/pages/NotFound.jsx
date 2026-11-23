import Button from '../components/Button/Button'
import Container from '../components/Container/Container'
import { Empty } from '../components/Feedback/Feedback'

export default function NotFound() {
  return (
    <Container>
      <Empty>
        <h1>404</h1>
        <p>Halaman tidak ditemukan.</p>
        <Button to="/">Kembali ke beranda</Button>
      </Empty>
    </Container>
  )
}
