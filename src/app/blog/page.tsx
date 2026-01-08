import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import prisma from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Cannabis Blog - Guides, Tips & Education | Leefii',
  description: 'Learn about cannabis with our educational blog.',
};

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">Cannabis Blog</h1>
          <p className="text-green-100 text-lg">Guides, tips, and cannabis education</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {posts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden group">
                <div className="aspect-video relative overflow-hidden">
                  {post.imageUrl ? (
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                      <span className="text-white text-6xl">📝</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  {post.category && (
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full mb-3">{post.category}</span>
                  )}
                  <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">{post.title}</h2>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Draft'}</span>
                    <span className="text-green-600 font-medium">Read more →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p>No posts found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
