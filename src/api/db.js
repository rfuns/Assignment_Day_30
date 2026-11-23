// "Database" aplikasi: disimpan di localStorage, di-seed sekali dari DummyJSON
// (users, todos, posts, quotes). Bila DummyJSON tidak bisa diakses, dipakai data lokal.
const STORAGE_KEY = 'lms_db_v1'
const BASE = 'https://dummyjson.com'

let cache = null
let loading = null

function fallbackSeed() {
  const first = ['Aisyah', 'Budi', 'Citra', 'Dimas', 'Eka', 'Farhan', 'Gita', 'Hana', 'Indra', 'Jihan', 'Kevin', 'Laras']
  const last = ['Putri', 'Santoso', 'Lestari', 'Pratama', 'Wijaya', 'Hakim', 'Sari', 'Nugraha']
  const users = first.map((f, i) => ({
    id: i + 1,
    firstName: f,
    lastName: last[i % last.length],
    email: `${f.toLowerCase()}@example.com`,
    username: f.toLowerCase(),
    password: `${f.toLowerCase()}123`,
    image: '',
    role: i === 0 ? 'admin' : i < 3 ? 'instructor' : 'student',
    age: 18 + i,
    phone: `+62 812 000 ${1000 + i}`,
  }))
  const tags = ['react', 'javascript', 'css', 'career', 'tips']
  const posts = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    title: `Materi ${i + 1}: Dasar-dasar Pemrograman Web`,
    body: 'Materi ini membahas konsep dasar pengembangan web modern, mulai dari struktur HTML, styling CSS, hingga interaksi dengan JavaScript dan React. Pelajari langkah demi langkah dan kerjakan latihan di setiap akhir bab.',
    tags: [tags[i % 5], tags[(i + 2) % 5]],
    reactions: { likes: 10 + i * 3, dislikes: i % 4 },
    views: 100 + i * 17,
    userId: (i % users.length) + 1,
  }))
  const todos = Array.from({ length: 40 }, (_, i) => ({
    id: i + 1,
    todo: `Kerjakan tugas latihan nomor ${i + 1}`,
    completed: i % 3 === 0,
    userId: (i % users.length) + 1,
  }))
  const quotes = Array.from({ length: 24 }, (_, i) => ({
    id: i + 1,
    quote: `Belajar sedikit setiap hari lebih baik daripada banyak sekali (#${i + 1}).`,
    author: `${first[i % first.length]} ${last[i % last.length]}`,
  }))
  return { users, posts, todos, quotes }
}

async function fetchList(path, key) {
  const res = await fetch(`${BASE}${path}`)
  if (!res.ok) throw new Error(`Gagal memuat ${path}`)
  return (await res.json())[key]
}

async function seed() {
  try {
    const [users, posts, todos, quotes] = await Promise.all([
      fetchList('/users?limit=60&select=firstName,lastName,email,username,password,image,role,age,phone', 'users'),
      fetchList('/posts?limit=150&select=title,body,tags,reactions,views,userId', 'posts'),
      fetchList('/todos?limit=150', 'todos'),
      fetchList('/quotes?limit=100', 'quotes'),
    ])
    return { users, posts, todos, quotes }
  } catch {
    return fallbackSeed()
  }
}

export function getDb() {
  if (cache) return Promise.resolve(cache)
  if (!loading) {
    loading = (async () => {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        try {
          cache = JSON.parse(stored)
          return cache
        } catch {
          /* data rusak, seed ulang */
        }
      }
      cache = await seed()
      saveDb()
      return cache
    })()
  }
  return loading
}

export function saveDb() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cache))
}

export function resetDb() {
  localStorage.removeItem(STORAGE_KEY)
  cache = null
  loading = null
}
