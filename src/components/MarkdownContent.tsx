'use client'

import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'

interface MarkdownContentProps {
  content: string
  className?: string
}

export function MarkdownContent({ content, className }: MarkdownContentProps) {
  return (
    <div
      className={cn(
        'prose prose-lg max-w-none',
        'prose-headings:text-elder-text-primary',
        'prose-p:text-elder-text-primary prose-p:leading-relaxed',
        'prose-a:text-elder-interactive-primary hover:prose-a:text-elder-interactive-hover',
        'prose-strong:text-elder-text-primary',
        'prose-ul:text-elder-text-primary prose-ol:text-elder-text-primary',
        'prose-li:text-elder-text-primary',
        'prose-blockquote:border-elder-interactive-primary prose-blockquote:text-elder-text-muted',
        'prose-code:bg-elder-bg-secondary prose-code:text-elder-text-primary prose-code:rounded prose-code:px-2 prose-code:py-1',
        'prose-pre:bg-elder-bg-secondary prose-pre:border prose-pre:border-elder-border-medium',
        'prose-table:border-elder-border-medium',
        'prose-th:border-elder-border-medium prose-th:bg-elder-bg-accent',
        'prose-td:border-elder-border-medium',
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children, ...props }) => (
            <h1
              className="text-4xl font-bold mb-8 pb-4 border-b border-elder-border-medium"
              {...props}
            >
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2
              className="text-3xl font-semibold mt-8 mb-6"
              {...props}
            >
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3
              className="text-2xl font-semibold mt-6 mb-4"
              {...props}
            >
              {children}
            </h3>
          ),
          h4: ({ children, ...props }) => (
            <h4
              className="text-xl font-semibold mt-4 mb-3"
              {...props}
            >
              {children}
            </h4>
          ),
          p: ({ children, ...props }) => (
            <p
              className="mb-4 text-base leading-7"
              {...props}
            >
              {children}
            </p>
          ),
          ul: ({ children, ...props }) => (
            <ul
              className="mb-4 ml-6 list-disc space-y-2"
              {...props}
            >
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol
              className="mb-4 ml-6 list-decimal space-y-2"
              {...props}
            >
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => (
            <li
              className="text-base leading-6"
              {...props}
            >
              {children}
            </li>
          ),
          a: ({ children, href, ...props }) => (
            <a
              href={href}
              className="font-medium underline decoration-2 underline-offset-2 transition-colors hover:no-underline"
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
              {...props}
            >
              {children}
            </a>
          ),
          blockquote: ({ children, ...props }) => (
            <blockquote
              className="border-l-4 pl-6 py-2 my-6 italic"
              {...props}
            >
              {children}
            </blockquote>
          ),
          code: ({ children, className, ...props }) => {
            const isInline = !className?.includes('language-')

            if (isInline) {
              return (
                <code
                  className="text-sm font-mono"
                  {...props}
                >
                  {children}
                </code>
              )
            }

            return (
              <code
                className={cn('block text-sm font-mono p-4 rounded-elder overflow-x-auto', className)}
                {...props}
              >
                {children}
              </code>
            )
          },
          table: ({ children, ...props }) => (
            <div className="overflow-x-auto my-6">
              <table
                className="min-w-full border-collapse rounded-elder overflow-hidden"
                {...props}
              >
                {children}
              </table>
            </div>
          ),
          th: ({ children, ...props }) => (
            <th
              className="px-4 py-3 text-left font-semibold"
              {...props}
            >
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td
              className="px-4 py-3"
              {...props}
            >
              {children}
            </td>
          ),
          hr: ({ ...props }) => (
            <hr
              className="my-8 border-elder-border-medium"
              {...props}
            />
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}