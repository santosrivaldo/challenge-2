import type { ReactNode } from 'react'
import { cn } from '../lib/cn'

type CardProps = {
  children: ReactNode
  className?: string
  title?: string
  description?: string
}

export function Card({ children, className, title, description }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow',
        className,
      )}
    >
      {(title || description) && (
        <div className="mb-4">
          {title && (
            <h2 className="text-lg font-semibold tracking-tight text-slate-900">
              {title}
            </h2>
          )}
          {description && (
            <p className="mt-1 text-sm text-slate-600">{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  )
}
