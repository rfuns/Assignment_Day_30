import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { api, isTokenValid } from '../api/server'

const AuthContext = createContext(null)
const KEY = 'lms_auth'

function readStored() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY))
    if (saved && isTokenValid(saved.token)) return saved
  } catch {
    /* abaikan */
  }
  localStorage.removeItem(KEY)
  return { token: null, user: null }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(readStored)

  const persist = useCallback((next) => {
    localStorage.setItem(KEY, JSON.stringify(next))
    setAuth(next)
  }, [])

  const login = useCallback(
    async (credentials) => {
      const { token, ...user } = await api.post('/auth/login', credentials)
      delete user.accessToken
      persist({ token, user })
    },
    [persist],
  )

  const register = useCallback(
    async (data) => {
      const { token } = await api.post('/auth/register', data)
      const user = await api.get('/auth/me', token)
      persist({ token, user })
    },
    [persist],
  )

  const logout = useCallback(() => {
    localStorage.removeItem(KEY)
    setAuth({ token: null, user: null })
  }, [])

  const value = useMemo(
    () => ({ ...auth, isAuthenticated: Boolean(auth.token), login, register, logout }),
    [auth, login, register, logout],
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth harus dipakai di dalam AuthProvider')
  return ctx
}
