import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
  });

  if (!post) {
    return {
      title: 'Post Not Found | Leefii',
    };
  }

  return {
    title: post.metaTitle || `${post.title} | Leefii`,
    description: post.metaDescription || post.excerpt || '',
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
  });

  if (!post || !post.isPublished) {
    notFound();
  }

  // Increment view count
  await prisma.blogPost.update({
    where: { id: post.id },
    data: { viewCount: { increment: 1 } },
  });

  // Get related posts (same category, excluding current)
  const relatedPosts = await prisma.blogPost.findMany({
    where: {
      isPublished: true,
      category: post.category,
      id: { not: post.id },
    },
    take: 3,
    orderBy: { publishedAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Link
            href="/blog"
            className="inline-flex items-center text-green-100 hover:text-white mb-6 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>
          {post.category && (
            <span className="inline-block px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-full mb-4">
              {post.category}
            </span>
          )}
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-green-100">
            {post.authorName && (
              <span>By {post.authorName}</span>
            )}
            {post.publishedAt && (
              <>
                <span>•</span>
                <span>
                  {new Date(post.publishedAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </>
            )}
            {post.viewCount > 0 && (
              <>
                <span>•</span>
                <span>{post.viewCount.toLocaleString()} views</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="bg-white rounded-2xl shadow-sm p-8 sm:p-12">
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Article Content */}
          <div
            className="prose prose-lg prose-green max-w-none
              prose-headings:text-gray-900 prose-headings:font-bold
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:text-gray-700 prose-p:leading-relaxed
              prose-a:text-green-600 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-gray-900
              prose-ul:my-4 prose-li:text-gray-700
              prose-ol:my-4
              prose-table:border-collapse prose-table:w-full
              prose-th:bg-gray-100 prose-th:p-3 prose-th:text-left prose-th:font-semibold
              prose-td:p-3 prose-td:border-t prose-td:border-gray-200"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.slug}`}
                  className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow group"
                >
                  <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors mb-2">
                    {relatedPost.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{relatedPost.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Find the Perfect Strain</h2>
          <p className="text-green-100 mb-6">
            Browse our database of {5632}+ strains to find what works best for you.
          </p>
          <Link
            href="/strains"
            className="inline-block bg-white text-green-600 px-8 py-3 rounded-xl font-semibold hover:bg-green-50 transition-colors"
          >
            Explore Strains
          </Link>
        </div>
      </div>
    </div>
  );
}
