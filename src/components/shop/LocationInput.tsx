'use client'

import { useState } from 'react'

interface LocationInputProps {
  zip: string
  setZip: (zip: string) => void
  radius: number
  setRadius: (radius: number) => void
  onSearch: (zip: string) => void
  loading?: boolean
}

export default function LocationInput({
  zip,
  setZip,
  radius,
  setRadius,
  onSearch,
  loading = false,
}: LocationInputProps) {
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = zip.trim()
    if (!/^\d{5}$/.test(trimmed)) {
      setError('Please enter a valid 5-digit ZIP code')
      return
    }
    setError('')
    onSearch(trimmed)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-6">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={zip}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 5)
              setZip(val)
              if (error) setError('')
            }}
            placeholder="Enter ZIP code (e.g., 90210)"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-base"
            maxLength={5}
            inputMode="numeric"
            aria-label="ZIP code"
          />
        </div>
        <select
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white text-gray-700"
          aria-label="Search radius"
        >
          <option value={5}>5 miles</option>
          <option value={10}>10 miles</option>
          <option value={25}>25 miles</option>
          <option value={50}>50 miles</option>
        </select>
        <button
          type="submit"
          disabled={zip.length !== 5 || loading}
          className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[120px]"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Searching...
            </>
          ) : (
            'Search'
          )}
        </button>
      </form>
      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  )
}
