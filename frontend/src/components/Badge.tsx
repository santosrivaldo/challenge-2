import type { ReactNode } from 'react'
import { cn } from '../lib/cn'

type BadgeVariant = 'credit' | 'debit' | 'neutral'

const styles: Record<BadgeVariant, string> = {
  credit: 'bg-emerald-50 text-emerald-800 ring-emerald-600/20',
  debit: 'bg-red-50 text-red-800 ring-red-600/20',
  neutral: 'bg-slate-100 text-slate-700 ring-slate-500/10',
}

export function Badge({
  variant = 'neutral',
  children,
  className,
}: {
  variant?: BadgeVariant
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset',
        styles[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
