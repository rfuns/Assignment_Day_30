// Mock REST API di sisi klien. Meniru perilaku DummyJSON + endpoint auth bergaya ReqRes.
import { getDb, saveDb } from './db'

export class ApiError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

const LATENCY = 250
const TOKEN_TTL = 60 * 60 // detik
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

const b64 = (obj) =>
  btoa(JSON.stringify(obj)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
const unb64 = (str) => JSON.parse(atob(str.replace(/-/g, '+').replace(/_/g, '/')))

// Token JWT simulasi (header.payload.signature), bukan untuk keamanan nyata.
export function createToken(user) {
  const iat = Math.floor(Date.now() / 1000)
  const payload = { sub: user.id, email: user.email, role: user.role, iat, exp: iat + TOKEN_TTL }
  return `${b64({ alg: 'HS256', typ: 'JWT' })}.${b64(payload)}.${b64({ s: `sig-${user.id}-${iat}` })}`
}

export function decodeToken(token) {
  try {
    return unb64(token.split('.')[1])
  } catch {
    return null
  }
}

export function isTokenValid(token) {
  const p = token && decodeToken(token)
  return Boolean(p && p.exp > Date.now() / 1000)
}

const publicUser = ({ password: _password, ...rest }) => rest

function requireAuth(db, token) {
  if (!token) throw new ApiError(401, 'Missing token')
  const payload = isTokenValid(token) ? decodeToken(token) : null
  if (!payload || !db.users.some((u) => u.id === payload.sub)) {
    throw new ApiError(401, 'Invalid or expired token')
  }
  return payload
}

const clamp = (v, min, max, def) => {
  const n = Number(v)
  return Number.isFinite(n) ? Math.min(Math.max(n, min), max) : def
}

const routes = []
const route = (method, pattern, handler) =>
  routes.push({ method, regex: new RegExp(`^${pattern}$`), handler })

// ---------- AUTH ----------
function loginHandler({ body, db }) {
  const identity = body.email || body.username
  if (!identity) throw new ApiError(400, 'Missing email or username')
  if (!body.password) throw new ApiError(400, 'Missing password')
  const user = db.users.find(
    (u) => u.email.toLowerCase() === identity.toLowerCase() || u.username.toLowerCase() === identity.toLowerCase(),
  )
  if (!user) throw new ApiError(400, 'user not found')
  if (user.password !== body.password) throw new ApiError(400, 'Invalid credentials')
  const token = createToken(user)
  return { ...publicUser(user), token, accessToken: token }
}
route('POST', '/auth/login', loginHandler)

route('POST', '/auth/register', ({ body, db }) => {
  if (!body.email) throw new ApiError(400, 'Missing email or username')
  if (!body.password) throw new ApiError(400, 'Missing password')
  if (body.password.length < 6) throw new ApiError(400, 'Password must be at least 6 characters')
  if (db.users.some((u) => u.email.toLowerCase() === body.email.toLowerCase())) {
    throw new ApiError(400, 'Email already registered')
  }
  const id = Math.max(0, ...db.users.map((u) => u.id)) + 1
  const user = {
    id,
    firstName: body.firstName || body.email.split('@')[0],
    lastName: body.lastName || '',
    email: body.email,
    username: body.username || body.email.split('@')[0],
    password: body.password,
    image: '',
    role: 'student',
    age: null,
    phone: '',
  }
  db.users.push(user)
  saveDb()
  return { id, token: createToken(user) }
})

route('GET', '/auth/me', ({ db, token }) => {
  const payload = requireAuth(db, token)
  return publicUser(db.users.find((u) => u.id === payload.sub))
})

// ---------- USERS (dilindungi token) ----------
route('GET', '/users', ({ db, query, token }) => {
  requireAuth(db, token)
  const perPage = clamp(query.per_page, 1, 100, 8)
  const total = db.users.length
  const totalPages = Math.max(1, Math.ceil(total / perPage))
  const page = clamp(query.page, 1, totalPages, 1)
  const data = db.users.slice((page - 1) * perPage, page * perPage).map(publicUser)
  return { page, per_page: perPage, total, total_pages: totalPages, data }
})

route('POST', '/users/add', ({ body, db, token }) => {
  requireAuth(db, token)
  if (!body.firstName || !body.email) throw new ApiError(400, 'firstName and email are required')
  if (db.users.some((u) => u.email.toLowerCase() === body.email.toLowerCase())) {
    throw new ApiError(400, 'Email already registered')
  }
  const user = {
    id: Math.max(0, ...db.users.map((u) => u.id)) + 1,
    firstName: body.firstName,
    lastName: body.lastName || '',
    email: body.email,
    username: body.username || body.email.split('@')[0],
    password: body.password || 'changeme123',
    image: '',
    role: body.role || 'student',
    age: body.age ? Number(body.age) : null,
    phone: body.phone || '',
  }
  db.users.push(user)
  saveDb()
  return publicUser(user)
})

route('GET', '/users/(\\d+)', ({ db, params, token }) => {
  requireAuth(db, token)
  const user = db.users.find((u) => u.id === Number(params[0]))
  if (!user) throw new ApiError(404, 'User not found')
  return { data: publicUser(user) }
})

// ---------- TODOS (assignment) ----------
route('GET', '/todos', ({ db, query }) => {
  let list = db.todos
  if (query.userId) list = list.filter((t) => t.userId === Number(query.userId))
  const total = list.length
  const limit = clamp(query.limit, 1, 500, 30)
  const skip = clamp(query.skip, 0, total, 0)
  return { todos: list.slice(skip, skip + limit), total, skip, limit }
})

route('PUT', '/todos/(\\d+)', ({ db, params, body }) => {
  const todo = db.todos.find((t) => t.id === Number(params[0]))
  if (!todo) throw new ApiError(404, 'Todo not found')
  todo.completed = Boolean(body.completed)
  saveDb()
  return todo
})

// ---------- POSTS (materi) ----------
route('GET', '/posts', ({ db, query }) => {
  let list = db.posts
  if (query.q) {
    const q = query.q.toLowerCase()
    list = list.filter((p) => p.title.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q)))
  }
  const total = list.length
  const limit = clamp(query.limit, 1, 100, 9)
  const skip = clamp(query.skip, 0, total, 0)
  return { posts: list.slice(skip, skip + limit), total, skip, limit }
})

route('GET', '/posts/(\\d+)', ({ db, params }) => {
  const post = db.posts.find((p) => p.id === Number(params[0]))
  if (!post) throw new ApiError(404, 'Post not found')
  return post
})

// ---------- QUOTES (bank soal kuis) ----------
route('GET', '/quotes', ({ db, query }) => {
  const total = db.quotes.length
  const limit = clamp(query.limit, 1, 500, 30)
  const skip = clamp(query.skip, 0, total, 0)
  return { quotes: db.quotes.slice(skip, skip + limit), total, skip, limit }
})

// ---------- DISPATCHER ----------
export async function request(method, url, { body = {}, token = null } = {}) {
  await wait(LATENCY)
  const db = await getDb()
  const [path, qs = ''] = url.split('?')
  const query = Object.fromEntries(new URLSearchParams(qs))
  for (const r of routes) {
    const m = r.method === method && path.match(r.regex)
    if (m) return structuredClone(r.handler({ db, body, query, token, params: m.slice(1) }))
  }
  throw new ApiError(404, `Endpoint ${method} ${path} not found`)
}

export const api = {
  get: (url, token) => request('GET', url, { token }),
  post: (url, body, token) => request('POST', url, { body, token }),
  put: (url, body, token) => request('PUT', url, { body, token }),
}
