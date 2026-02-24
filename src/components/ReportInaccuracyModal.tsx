'use client'

import { useEffect, useState } from 'react'

type ReportInaccuracyModalProps = {
  dispensaryId: string
  dispensaryName: string
  preselectedCategory?: string
  onClose: () => void
}

const CATEGORY_OPTIONS = [
  { value: 'WRONG_HOURS', label: 'Wrong Hours' },
  { value: 'WRONG_PHONE', label: 'Wrong Phone Number' },
  { value: 'WRONG_ADDRESS', label: 'Wrong Address' },
  { value: 'WRONG_MENU', label: 'Wrong Menu / Products' },
  { value: 'PERMANENTLY_CLOSED', label: 'Permanently Closed' },
  { value: 'OTHER', label: 'Other' },
]

export default function ReportInaccuracyModal({
  dispensaryId,
  dispensaryName,
  preselectedCategory,
  onClose,
}: ReportInaccuracyModalProps) {
  const [category, setCategory] = useState(preselectedCategory || '')
  const [description, setDescription] = useState('')
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [onClose])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!category) {
      setError('Please select a category')
      return
    }
    if (description.length < 10) {
      setError('Please provide at least 10 characters of detail')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dispensaryId,
          category,
          description,
          email: email || undefined,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to submit report')
      }

      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="fixed inset-0 bg-black/50" />
      <div
        className="relative bg-white rounded-xl shadow-lg max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {submitted ? (
          /* Thank You State */
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Thank you for helping keep Leefii accurate!
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              We take every report seriously. Our team will review and update this listing within 24 hours.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-green-700">
                Your report helps thousands of patients find accurate dispensary information.
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          /* Report Form */
          <>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Report Inaccuracy</h3>
            <p className="text-sm text-gray-500 mb-4">
              Help us keep <span className="font-medium">{dispensaryName}</span> listing accurate
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  What&apos;s wrong? <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select a category...</option>
                  {CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Details <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please describe what's incorrect..."
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                />
                <p className="text-xs text-gray-400 mt-1">Minimum 10 characters</p>
              </div>

              {/* Email (optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your email <span className="text-gray-400">(optional)</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <p className="text-xs text-gray-400 mt-1">We&apos;ll notify you when we fix it</p>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
