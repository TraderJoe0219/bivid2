'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  fullWidth?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  children: React.ReactNode
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const baseStyles = cn(
    // 基本スタイル
    'inline-flex items-center justify-center font-semibold rounded-elder-lg border',
    'transition-all duration-200 ease-in-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    // アクセシビリティ
    'touch-target',
    // 幅設定
    fullWidth ? 'w-full' : 'w-auto'
  )
  
  const variants = {
    primary: cn(
      'bg-elder-interactive-primary text-white border-elder-interactive-primary',
      'hover:bg-elder-interactive-hover hover:border-elder-interactive-hover',
      'focus-visible:ring-elder-interactive-primary',
      'active:bg-elder-interactive-active active:border-elder-interactive-active'
    ),
    secondary: cn(
      'bg-elder-bg-primary text-elder-text-primary border-elder-border-strong',
      'hover:bg-elder-bg-accent hover:border-elder-interactive-primary',
      'focus-visible:ring-elder-interactive-primary'
    ),
    success: cn(
      'bg-elder-success text-white border-elder-success',
      'hover:bg-green-600 hover:border-green-600',
      'focus-visible:ring-elder-success'
    ),
    warning: cn(
      'bg-elder-warning text-white border-elder-warning',
      'hover:bg-orange-600 hover:border-orange-600',
      'focus-visible:ring-elder-warning'
    ),
    danger: cn(
      'bg-elder-error text-white border-elder-error',
      'hover:bg-red-600 hover:border-red-600',
      'focus-visible:ring-elder-error'
    ),
    ghost: cn(
      'bg-transparent text-elder-interactive-primary border-transparent',
      'hover:bg-elder-bg-accent hover:text-elder-interactive-hover',
      'focus-visible:ring-elder-interactive-primary'
    )
  }
  
  const sizes = {
    sm: 'px-4 py-2 text-sm min-h-[40px] gap-2',
    md: 'px-6 py-3 text-base min-h-touch gap-2',
    lg: 'px-8 py-4 text-lg min-h-touch-lg gap-3',
    xl: 'px-10 py-5 text-xl min-h-touch-xl gap-3'
  }

  const iconSize = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7'
  }

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <Loader2 className={cn('animate-spin', iconSize[size])} />
      ) : leftIcon ? (
        <span className={iconSize[size]}>{leftIcon}</span>
      ) : null}
      
      <span>{children}</span>
      
      {!loading && rightIcon && (
        <span className={iconSize[size]}>{rightIcon}</span>
      )}
    </button>
  )
}
