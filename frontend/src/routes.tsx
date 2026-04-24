import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { UsersPage } from './pages/UsersPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<UsersPage />} />
      </Route>
    </Routes>
  )
}
