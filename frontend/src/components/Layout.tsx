import { Link, Outlet } from 'react-router-dom'

export function Layout() {
  return (
    <div className="flex min-h-svh">
      <aside className="hidden w-56 shrink-0 border-r border-slate-200 bg-white md:flex md:flex-col">
        <div className="border-b border-slate-200 px-4 py-5">
          <Link
            to="/"
            className="text-lg font-semibold tracking-tight text-slate-900 transition hover:text-slate-700"
          >
            Wallet SaaS
          </Link>
          <p className="mt-1 text-xs text-slate-500">Virtual wallet</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          <Link
            to="/"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Users
          </Link>
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 md:hidden">
          <Link to="/" className="font-semibold text-slate-900">
            Wallet SaaS
          </Link>
        </header>
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
