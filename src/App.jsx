import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/Auth/LoginPage'
import RegisterPage from './pages/Auth/RegisterPage'
import Home from './pages/Home/Home'
import NotFound from './pages/NotFound'
import PostDetail from './pages/PostDetail/PostDetail'
import Quiz from './pages/Quiz/Quiz'
import Todos from './pages/Todos/Todos'
import UserDetail from './pages/UserDetail/UserDetail'
import Users from './pages/Users/Users'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/users" element={<Users />} />
            <Route path="/users/:id" element={<UserDetail />} />
            <Route path="/todos" element={<Todos />} />
            <Route path="/quiz" element={<Quiz />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  )
}
