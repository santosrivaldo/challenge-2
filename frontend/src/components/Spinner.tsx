import { cn } from '../lib/cn'

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-block h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900',
        className,
      )}
      role="status"
      aria-label="Loading"
    />
  )
}
