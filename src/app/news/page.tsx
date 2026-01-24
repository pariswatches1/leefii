import { Metadata } from 'next';
import Link from 'next/link';
import prisma from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Cannabis News & Updates | Leefii',
  description: 'Stay updated with the latest cannabis industry news, legislation updates, and market trends.',
};

// Revalidate every 60 seconds to show new articles
export const revalidate = 60;

export default async function NewsPage() {
  const articles = await prisma.newsArticle.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">Cannabis News</h1>
          <p className="text-green-100 text-lg">
            Latest updates from the cannabis industry
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {articles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/news/${article.slug}`}
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden group"
              >
                <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                  <span className="text-white text-6xl">📰</span>
                </div>
                <div className="p-6">
                  {article.category && (
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full mb-3">
                      {article.category}
                    </span>
                  )}
                  <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors line-clamp-2">
                    {article.title}
                  </h2>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      {article.publishedAt
                        ? new Date(article.publishedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : 'Draft'}
                    </span>
                    <span className="text-green-600 font-medium">Read more →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-sm p-12 max-w-md mx-auto">
              <div className="text-6xl mb-6">📰</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">News Coming Soon!</h2>
              <p className="text-gray-600 mb-8">
                We&apos;re building a comprehensive cannabis news section with the latest industry updates.
              </p>
              <Link
                href="/dispensaries"
                className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition"
              >
                Browse Dispensaries
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
