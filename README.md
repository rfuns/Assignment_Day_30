# MiniLMS – Assignment Day 30

Aplikasi web React untuk mini Learning Management System: materi course, siswa, tugas, dan kuis, dengan autentikasi token dan protected routes.

**Repository GitHub:** https://github.com/rfuns/Assignment_Day_30.git

## Menjalankan

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # build produksi
npm run lint         # oxlint
node scripts/test-api.mjs   # uji semua endpoint mock API
```

Akun demo (data DummyJSON): username `emilys`, password `emilyspass`. Atau daftar akun baru lewat halaman **Daftar**.

## Halaman

| Route | Isi | Akses |
|---|---|---|
| `/` | Daftar materi (posts) + pencarian + **pagination** (9/halaman) | Publik |
| `/posts/:id` | Detail materi | Publik |
| `/login`, `/register` | Login & registrasi | Publik |
| `/users` | Daftar siswa, pagination, tambah siswa | **Protected** |
| `/users/:id` | Detail siswa + tugas miliknya | **Protected** |
| `/todos` | Semua tugas, filter `userId` & status, pagination | **Protected** |
| `/quiz` | Kuis dari bank quotes | **Protected** |

Mengakses halaman protected tanpa login mengalihkan ke `/login`, lalu kembali ke halaman tujuan setelah login.

## Database & API

`docs-data.json` adalah spesifikasi OpenAPI FakeStoreAPI. Data aplikasi diambil dari **DummyJSON** (https://dummyjson.com/docs), yaitu users, todos, posts, dan quotes. Saat pertama dibuka, data itu disalin sekali ke "database" di `localStorage` (`src/api/db.js`). Bila DummyJSON tidak dapat diakses, dipakai data cadangan lokal. Semua endpoint berjalan di `src/api/server.js` sebagai API tiruan di sisi klien (latensi 250 ms), sehingga perubahan seperti menambah siswa, registrasi, dan mencentang tugas tersimpan di database tersebut.

| Endpoint | Fungsi | Token |
|---|---|---|
| `GET /users` | Daftar siswa/instruktur (`page`, `per_page`) | Ya |
| `GET /users/1` | Detail 1 siswa | Ya |
| `POST /users/add` | Tambah siswa | Ya |
| `GET /todos` | Tugas (assignment) | – |
| `GET /todos?userId=1` | Tugas milik siswa tertentu | – |
| `PUT /todos/:id` | Ubah status selesai | – |
| `GET /posts`, `GET /posts/:id` | Materi (`limit`, `skip`, `q`) | – |
| `GET /quotes` | Bank soal kuis | – |
| `POST /auth/login` | Login, mengembalikan `token` / `accessToken` (JWT simulasi) | – |
| `POST /auth/register` | Registrasi, mengembalikan `id` dan `token` | – |
| `GET /auth/me` | Profil dari token | Ya |

### Endpoint registrasi & login

| Skenario | Request | Respons |
|---|---|---|
| REGISTER – successful | `{email, password}` valid | `201` `{id, token}` |
| REGISTER – unsuccessful | tanpa password / email ganda / password < 6 karakter | `400` `{message}` mis. `Missing password` |
| LOGIN – successful | email/username + password benar | `200` data user + `token` |
| LOGIN – unsuccessful | tanpa password, user tidak ada, atau password salah | `400` `{message}` mis. `user not found` |
| LIST USERS | `GET /users` dengan token | `200` `{page, per_page, total, total_pages, data}`; tanpa token `401` |
| SINGLE USER | `GET /users/:id` dengan token | `200` `{data}`; tanpa token `401`, id tidak ada `404` |

Token berbentuk `header.payload.signature` dengan `exp` 1 jam. Token kedaluwarsa atau tidak valid ditolak dengan `401`, dan sesi dihapus saat halaman dimuat ulang. Ini simulasi untuk belajar dan tidak aman untuk produksi.

## Styling

- **CSS Modules per komponen** (`Button.module.css`, `Card.module.css`, dll.). `index.css` hanya berisi design token (warna, radius, shadow, font) dan reset.
- **Dynamic styling lewat props/state:** `Button` (`variant`, `size`, `fullWidth`, `loading`), `Badge` (`color`), `Card` (`to`, `accent`), `Grid` (`min`), `Avatar` (`size`, warna dari id), `TodoItem` (gaya sesuai `completed`), bar progres (lebar dari state), menu mobile Navbar (state `open`).
- **Reusable component:** Navbar, Button, Card, Badge, Input, Grid, Container, PageHeader, Pagination, Avatar, TodoItem, Feedback (Spinner, ErrorMessage, Alert, Empty), ProtectedRoute.
- **Responsive:** pendekatan mobile-first. Grid memakai `auto-fill/minmax`, navbar menjadi hamburger di bawah 768 px, teks panjang memakai `overflow-wrap`, dan `overflow-x` disembunyikan agar tidak ada overflow horizontal.

## Daftar library

| Library | Kegunaan |
|---|---|
| [react](https://react.dev/) 19 & react-dom | Frontend framework |
| [react-router-dom](https://reactrouter.com/) | Routing, protected routes, query string untuk pagination |
| [vite](https://vite.dev/) & @vitejs/plugin-react | Bundler dan dev server (juga mendukung CSS Modules) |
| [oxlint](https://oxc.rs/docs/guide/usage/linter) | Linter |
| @types/react, @types/react-dom | Tipe untuk editor |

## Fitur tambahan di luar requirement

- Pencarian materi berdasarkan judul/tag, dengan pagination yang tersimpan di URL (`?page=2&q=love`).
- Halaman kuis interaktif dari data quotes (5 soal acak, skor, umpan balik benar/salah).
- Mengubah status tugas (centang) dan bar progres tugas per siswa.
- Filter tugas berdasarkan siswa dan status, dengan pagination.
- Form tambah siswa dan halaman detail siswa.
- Redirect kembali ke halaman tujuan setelah login, serta validasi masa berlaku token.
- Avatar inisial otomatis, state loading/error/empty dengan tombol "Coba lagi".
- Database persisten di `localStorage` dengan fallback offline.
- Skrip uji endpoint (`scripts/test-api.mjs`).
