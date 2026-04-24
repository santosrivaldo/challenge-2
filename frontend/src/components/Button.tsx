import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../lib/cn'
import { Spinner } from './Spinner'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'
type ButtonSize = 'sm' | 'md'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  children: ReactNode
  /** When set, renders a React Router link styled as a button. */
  to?: string
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-slate-900 text-white hover:bg-slate-800 disabled:bg-slate-400',
  secondary:
    'border border-slate-200 bg-white text-slate-900 hover:bg-slate-50',
  danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300',
  ghost: 'text-slate-700 hover:bg-slate-100',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
}

export function Button({
  to,
  variant = 'primary',
  size = 'md',
  loading,
  disabled,
  className,
  children,
  type,
  ...props
}: ButtonProps) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed',
    variantStyles[variant],
    sizeStyles[size],
    className,
  )

  if (to) {
    return (
      <Link
        to={to}
        className={cn(
          classes,
          (disabled || loading) && 'pointer-events-none opacity-50',
        )}
        aria-disabled={disabled || loading ? true : undefined}
      >
        {children}
      </Link>
    )
  }

  return (
    <button
      type={type ?? 'button'}
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <Spinner
          className={cn(
            'h-4 w-4 border-2',
            variant === 'primary' || variant === 'danger'
              ? 'border-white/30 border-t-white'
              : '',
          )}
        />
      )}
      {children}
    </button>
  )
}
