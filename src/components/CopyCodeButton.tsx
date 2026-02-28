'use client'

import { useState, useCallback } from 'react'

interface CopyCodeButtonProps {
  code: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function CopyCodeButton({ code, className = '', size = 'md' }: CopyCodeButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = code
      textArea.style.position = 'fixed'
      textArea.style.opacity = '0'
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }, [code])

  const sizeClasses = {
    sm: 'text-sm px-3 py-2',
    md: 'text-base px-4 py-3',
    lg: 'text-lg px-5 py-4',
  }

  const buttonSizeClasses = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-5 py-2.5',
  }

  return (
    <div className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-3 ${className}`}>
      {/* Code display */}
      <div
        className={`flex-1 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl font-mono font-bold text-gray-900 text-center tracking-wider ${sizeClasses[size]}`}
      >
        {code}
      </div>

      {/* Copy button */}
      <button
        onClick={handleCopy}
        className={`inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 whitespace-nowrap ${buttonSizeClasses[size]} ${
          copied
            ? 'bg-green-100 text-green-700 border-2 border-green-300'
            : 'bg-green-600 text-white hover:bg-green-700 border-2 border-green-600 hover:border-green-700'
        }`}
      >
        {copied ? (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Copied!
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            Copy Code
          </>
        )}
      </button>
    </div>
  )
}
