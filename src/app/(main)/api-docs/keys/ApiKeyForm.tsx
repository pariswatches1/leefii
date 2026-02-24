'use client'

import { useState } from 'react'

const USE_CASES = [
  'Personal Project',
  'Commercial App',
  'Research',
  'Education',
  'Other',
]

function generateMockKey(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let key = 'lf_live_'
  for (let i = 0; i < 32; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return key
}

export default function ApiKeyForm() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [useCase, setUseCase] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [copied, setCopied] = useState(false)

  const canSubmit = email.trim() && name.trim() && useCase && agreed

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    const key = generateMockKey()
    setApiKey(key)
    setSubmitted(true)
  }

  function handleCopy() {
    navigator.clipboard.writeText(apiKey).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  if (submitted) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Your API Key is Ready</h3>
          <p className="text-gray-600">
            Welcome, {name}! Copy your API key below and keep it safe. Do not share it publicly.
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Your API Key</label>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
              {apiKey}
            </code>
            <button
              onClick={handleCopy}
              className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium whitespace-nowrap"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-gray-900 mb-2">Next Steps</h4>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 text-sm">
            <li>Add the API key to your request headers as <code className="bg-gray-200 px-1.5 py-0.5 rounded font-mono text-xs">X-API-Key: {apiKey.slice(0, 16)}...</code></li>
            <li>Make your first request to <code className="bg-gray-200 px-1.5 py-0.5 rounded font-mono text-xs">https://leefii.com/api/v1/strains</code></li>
            <li>Check out the <a href="/api-docs/quickstart" className="text-green-600 hover:underline">Quick Start Guide</a> for detailed examples</li>
            <li>Add the required &quot;Powered by Leefii&quot; attribution to your public pages</li>
          </ol>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
          <strong>Important:</strong> Store this key securely. Do not commit it to public repositories or expose it
          in client-side code. If compromised, you can regenerate a new key from your dashboard.
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-8">
      <div className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Developer"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@example.com"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
            required
          />
        </div>

        <div>
          <label htmlFor="useCase" className="block text-sm font-medium text-gray-700 mb-1">
            Use Case
          </label>
          <select
            id="useCase"
            value={useCase}
            onChange={(e) => setUseCase(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors bg-white"
            required
          >
            <option value="">Select a use case...</option>
            {USE_CASES.map((uc) => (
              <option key={uc} value={uc}>{uc}</option>
            ))}
          </select>
        </div>

        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="agree"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
          />
          <label htmlFor="agree" className="text-sm text-gray-600">
            I agree to the <a href="/api-docs#terms" className="text-green-600 hover:underline">API Terms of Use</a>,
            including the attribution requirement for the free tier and rate limit policies.
          </label>
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
            canSubmit
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          Generate Free API Key
        </button>
      </div>
    </form>
  )
}
