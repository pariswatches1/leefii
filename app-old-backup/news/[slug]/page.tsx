import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await prisma.newsArticle.findUnique({ where: { slug: params.slug } });
  if (!article) return { title: 'Not Found' };
  return {
    title: article.metaTitle || `${article.title} | Leefii`,
    description: article.metaDescription || article.excerpt,
  };
}

export default async function NewsArticlePage({ params }: Props) {
  const article = await prisma.newsArticle.findUnique({ where: { slug: params.slug } });
  if (!article || !article.isPublished) notFound();

  prisma.newsArticle.update({ where: { id: article.id }, data: { viewCount: { increment: 1 } } }).catch(() => {});

  const related = await prisma.newsArticle.findMany({
    where: { isPublished: true, category: article.category, id: { not: article.id } },
    take: 3,
  });

  const getColor = (cat: string) => {
    const c: any = { legislation: 'bg-blue-100 text-blue-700', industry: 'bg-purple-100 text-purple-700', science: 'bg-cyan-100 text-cyan-700', business: 'bg-amber-100 text-amber-700', culture: 'bg-green-100 text-green-700' };
    return c[cat.toLowerCase()] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Link href="/news" className="text-green-200 hover:text-white mb-4 inline-block">← Back to News</Link>
          <span className={`inline-block px-3 py-1 rounded-full text-sm mb-4 ${getColor(article.category)}`}>{article.category}</span>
          <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
          <div className="text-green-100">
            By {article.authorName} • {new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            {article.viewCount > 0 && ` • ${article.viewCount} views`}
          </div>
        </div>
      </div>

      {article.imageUrl && (
        <div className="max-w-4xl mx-auto px-4 -mt-6">
          <img src={article.imageUrl} alt={article.title} className="w-full rounded-xl shadow-lg" />
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-8">
        <article className="bg-white rounded-xl p-8 shadow-sm">
          <p className="text-xl text-gray-700 mb-6 border-l-4 border-green-500 pl-4">{article.excerpt}</p>
          
          {article.tags?.length > 0 && (
            <div className="flex gap-2 mb-6">
              {article.tags.map((tag, i) => (
                <span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">#{tag}</span>
              ))}
            </div>
          )}

          <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />
        </article>

        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map((r) => (
                <Link key={r.id} href={`/news/${r.slug}`} className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md">
                  <h3 className="font-semibold hover:text-green-600">{r.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
