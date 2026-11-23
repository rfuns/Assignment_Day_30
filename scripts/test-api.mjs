// Uji cepat endpoint mock API: `node scripts/test-api.mjs`
const store = new Map()
globalThis.localStorage = {
  getItem: (k) => store.get(k) ?? null,
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
}
const { api } = await import('../src/api/server.js')

let failed = 0
const check = async (name, fn, expectStatus) => {
  try {
    const r = await fn()
    const ok = expectStatus === undefined
    console.log(ok ? 'PASS' : 'FAIL', name, ok ? '' : `(expected error ${expectStatus})`)
    if (!ok) failed++
    return r
  } catch (e) {
    const ok = e.status === expectStatus
    console.log(ok ? 'PASS' : 'FAIL', name, `-> ${e.status} ${e.message}`)
    if (!ok) failed++
  }
}

const reg = await check('REGISTER success', () => api.post('/auth/register', { email: 'tes@x.com', password: 'secret1' }))
await check('REGISTER unsuccessful (missing password)', () => api.post('/auth/register', { email: 'a@b.com' }), 400)
await check('REGISTER unsuccessful (duplicate)', () => api.post('/auth/register', { email: 'tes@x.com', password: 'secret1' }), 400)
const login = await check('LOGIN success', () => api.post('/auth/login', { email: 'tes@x.com', password: 'secret1' }))
await check('LOGIN unsuccessful (missing password)', () => api.post('/auth/login', { email: 'tes@x.com' }), 400)
await check('LOGIN unsuccessful (wrong password)', () => api.post('/auth/login', { email: 'tes@x.com', password: 'nope' }), 400)
await check('LIST USERS without token', () => api.get('/users'), 401)
const list = await check('LIST USERS with token', () => api.get('/users?page=1&per_page=5', login.token))
await check('SINGLE USER without token', () => api.get('/users/1'), 401)
await check('SINGLE USER with token', () => api.get('/users/1', login.token))
await check('SINGLE USER not found', () => api.get('/users/99999', login.token), 404)
await check('POST /users/add', () => api.post('/users/add', { firstName: 'Baru', email: 'baru@x.com' }, login.token))
await check('GET /todos?userId=1', () => api.get('/todos?userId=1'))
await check('GET /posts', () => api.get('/posts?limit=9'))
await check('GET /quotes', () => api.get('/quotes'))
console.log('register id:', reg?.id, '| list total:', list?.total, '| failed:', failed)
process.exit(failed ? 1 : 0)
