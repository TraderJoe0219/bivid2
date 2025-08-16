'use client'

import React, { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { AlertCircle, Eye, EyeOff } from 'lucide-react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  variant?: 'default' | 'search'
  size?: 'sm' | 'md' | 'lg'
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  className,
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  variant = 'default',
  size = 'md',
  type = 'text',
  id,
  required,
  disabled,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
  const [showPassword, setShowPassword] = React.useState(false)
  const isPasswordType = type === 'password'

  const inputSizes = {
    sm: 'px-3 py-2 text-sm min-h-[40px]',
    md: 'px-4 py-3 text-base min-h-touch',
    lg: 'px-5 py-4 text-lg min-h-touch-lg'
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  const inputClasses = cn(
    // 基本スタイル
    'w-full rounded-elder border transition-all duration-200',
    'bg-elder-bg-primary placeholder-elder-text-muted',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-elder-interactive-primary focus-visible:ring-offset-1',
    'disabled:bg-elder-bg-secondary disabled:text-elder-text-muted disabled:cursor-not-allowed',
    // サイズ
    inputSizes[size],
    // エラー状態
    error 
      ? 'border-elder-error focus-visible:border-elder-error focus-visible:ring-elder-error text-elder-text-primary'
      : 'border-elder-border-medium focus-visible:border-elder-interactive-primary text-elder-text-primary',
    // アイコンがある場合のパディング調整
    leftIcon && 'pl-10',
    (rightIcon || isPasswordType) && 'pr-10',
    className
  )

  const containerClasses = cn(
    'space-y-2',
    disabled && 'opacity-60'
  )

  const actualType = isPasswordType && showPassword ? 'text' : type

  return (
    <div className={containerClasses}>
      {label && (
        <label 
          htmlFor={inputId}
          className={cn(
            'block font-medium text-elder-text-primary',
            size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base',
            required && 'after:content-["*"] after:ml-1 after:text-elder-error'
          )}
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className={cn(
            'absolute left-3 top-1/2 transform -translate-y-1/2 text-elder-text-muted',
            iconSizes[size]
          )}>
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          id={inputId}
          type={actualType}
          className={inputClasses}
          disabled={disabled}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? `${inputId}-error` : 
            helperText ? `${inputId}-helper` : undefined
          }
          {...props}
        />
        
        {(rightIcon || isPasswordType) && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {isPasswordType ? (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={cn(
                  'text-elder-text-muted hover:text-elder-text-primary transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-elder-interactive-primary focus-visible:ring-offset-1 rounded',
                  iconSizes[size]
                )}
                aria-label={showPassword ? 'パスワードを隠す' : 'パスワードを表示'}
              >
                {showPassword ? <EyeOff className={iconSizes[size]} /> : <Eye className={iconSizes[size]} />}
              </button>
            ) : (
              <span className={cn('text-elder-text-muted', iconSizes[size])}>
                {rightIcon}
              </span>
            )}
          </div>
        )}
      </div>
      
      {error && (
        <div className="flex items-center gap-1" id={`${inputId}-error`} role="alert">
          <AlertCircle className="w-4 h-4 text-elder-error flex-shrink-0" />
          <p className="text-sm text-elder-error">{error}</p>
        </div>
      )}
      
      {helperText && !error && (
        <p className="text-sm text-elder-text-muted" id={`${inputId}-helper`}>
          {helperText}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'
