import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cannabis Blog - Guides, Tips & Education | Leefii',
  description: 'Learn about cannabis with our educational blog. Strain guides, consumption tips, and everything you need to know.',
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">Cannabis Blog</h1>
          <p className="text-green-100 text-lg">
            Guides, tips, and cannabis education
          </p>
        </div>
      </div>

      {/* Coming Soon */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-white rounded-2xl shadow-sm p-12">
          <div className="text-6xl mb-6">📝</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Blog Coming Soon!</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Our team is creating helpful guides and educational content about cannabis strains, consumption methods, and more.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/strains"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition"
            >
              Explore Strains
            </Link>
            <Link
              href="/dispensaries"
              className="inline-block bg-white text-green-600 border-2 border-green-600 px-6 py-3 rounded-lg font-medium hover:bg-green-50 transition"
            >
              Find Dispensaries
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
