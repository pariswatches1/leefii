import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await prisma.newsArticle.findUnique({
    where: { slug },
  });

  if (!article) {
    return { title: 'Article Not Found | Leefii' };
  }

  return {
    title: article.metaTitle || `${article.title} | Leefii`,
    description: article.metaDescription || article.excerpt || '',
  };
}

export const revalidate = 60;

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await prisma.newsArticle.findUnique({
    where: { slug },
  });

  if (!article || !article.isPublished) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Link
            href="/news"
            className="inline-flex items-center text-green-100 hover:text-white mb-6 transition"
          >
            ← Back to News
          </Link>
          {article.category && (
            <span className="inline-block px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-full mb-4">
              {article.category}
            </span>
          )}
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{article.title}</h1>
          <div className="flex items-center gap-4 text-green-100">
            {article.publishedAt && (
              <span>
                {new Date(article.publishedAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            )}
            {article.sourceName && (
              <>
                <span>•</span>
                <span>Source: {article.sourceName}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          {article.excerpt && (
            <p className="text-xl text-gray-600 mb-8 pb-8 border-b border-gray-200">
              {article.excerpt}
            </p>
          )}
          <div
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-green-600"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* States */}
          {article.states && article.states.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Related States</h3>
              <div className="flex flex-wrap gap-2">
                {article.states.map((state) => (
                  <Link
                    key={state}
                    href={`/dispensaries?state=${encodeURIComponent(state)}`}
                    className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full hover:bg-green-200 transition"
                  >
                    {state}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Back to News */}
        <div className="mt-8 text-center">
          <Link
            href="/news"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition"
          >
            ← Back to All News
          </Link>
        </div>
      </div>
    </div>
  );
}
