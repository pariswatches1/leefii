import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Not Found | Leefii',
  description: 'The page you are looking for could not be found.',
}

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <div className="text-8xl font-bold text-green-600 mb-4">404</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition"
          >
            Go Home
          </Link>
          <Link
            href="/dispensaries"
            className="px-6 py-3 bg-gray-100 text-gray-900 rounded-xl font-semibold hover:bg-gray-200 transition"
          >
            Find Dispensaries
          </Link>
          <Link
            href="/strains"
            className="px-6 py-3 bg-gray-100 text-gray-900 rounded-xl font-semibold hover:bg-gray-200 transition"
          >
            Explore Strains
          </Link>
        </div>
        
        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">Popular pages:</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/dispensaries/california" className="text-green-600 hover:underline">California Dispensaries</Link>
            <Link href="/dispensaries/colorado" className="text-green-600 hover:underline">Colorado Dispensaries</Link>
            <Link href="/dispensaries/florida" className="text-green-600 hover:underline">Florida Dispensaries</Link>
            <Link href="/strains" className="text-green-600 hover:underline">All Strains</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
