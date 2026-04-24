import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { TransactionsPage } from './pages/TransactionsPage'
import { UserDetailPage } from './pages/UserDetailPage'
import { UsersPage } from './pages/UsersPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<UsersPage />} />
        <Route path="/users/:id" element={<UserDetailPage />} />
        <Route
          path="/users/:id/transactions"
          element={<TransactionsPage />}
        />
      </Route>
    </Routes>
  )
}
