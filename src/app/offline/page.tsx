import Link from 'next/link'

export const metadata = {
  title: 'Offline | Leefii',
  description: 'You are currently offline. Reconnect to browse dispensaries, strains, and deals.',
}

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636a9 9 0 010 12.728M5.636 5.636a9 9 0 000 12.728M15.536 8.464a5 5 0 010 7.072M8.464 8.464a5 5 0 000 7.072M12 12h.01" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">You&apos;re Offline</h1>
        <p className="text-gray-600 mb-8">
          No internet connection. Some features may be unavailable. Previously visited pages may still work.
        </p>
        <div className="space-y-3">
          <Link href="/" className="block bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition">
            Try Again
          </Link>
          <Link href="/dispensaries" className="block border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition">
            Browse Cached Dispensaries
          </Link>
        </div>
      </div>
    </div>
  )
}
