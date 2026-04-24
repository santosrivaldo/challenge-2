import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AppRoutes } from './routes'

function App() {
  return (
    <BrowserRouter>
      <Toaster richColors position="top-right" closeButton />
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
