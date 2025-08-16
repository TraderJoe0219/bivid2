'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'hover' | 'interactive'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  children: React.ReactNode
}

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}, ref) => {
  const variants = {
    default: 'card',
    hover: 'card-hover',
    interactive: 'card-interactive'
  }

  const sizes = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }

  return (
    <div
      ref={ref}
      className={cn(
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(({
  className,
  children,
  ...props
}, ref) => (
  <div
    ref={ref}
    className={cn('space-y-1.5', className)}
    {...props}
  >
    {children}
  </div>
))

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(({
  className,
  children,
  ...props
}, ref) => (
  <div
    ref={ref}
    className={cn('space-y-4', className)}
    {...props}
  >
    {children}
  </div>
))

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(({
  className,
  children,
  ...props
}, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center space-x-2', className)}
    {...props}
  >
    {children}
  </div>
))

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(({
  className,
  as: Component = 'h3',
  children,
  ...props
}, ref) => (
  <Component
    ref={ref}
    className={cn(
      'text-heading font-semibold leading-none tracking-tight text-elder-text-primary',
      className
    )}
    {...props}
  >
    {children}
  </Component>
))

const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(({
  className,
  children,
  ...props
}, ref) => (
  <p
    ref={ref}
    className={cn('text-base text-elder-text-muted leading-relaxed', className)}
    {...props}
  >
    {children}
  </p>
))

Card.displayName = 'Card'
CardHeader.displayName = 'CardHeader'
CardContent.displayName = 'CardContent'
CardFooter.displayName = 'CardFooter'
CardTitle.displayName = 'CardTitle'
CardDescription.displayName = 'CardDescription'

export {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription
}