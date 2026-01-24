import Link from 'next/link';
import prisma from '@/lib/prisma';

export const metadata = {
  title: 'Cannabis News | Leefii',
  description: 'Latest cannabis news and updates',
};

export default async function NewsPage() {
  const news = await prisma.newsArticle.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: 'desc' },
  });

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>Cannabis News</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>Latest updates from the cannabis industry</p>
      
      {news.length === 0 ? (
        <p>No news articles yet.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
          {news.map((article) => (
            <Link 
              key={article.id} 
              href={`/news/${article.slug}`}
              style={{ 
                display: 'block',
                border: '1px solid #ddd', 
                borderRadius: '12px', 
                overflow: 'hidden',
                textDecoration: 'none',
                color: 'inherit',
                backgroundColor: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              {article.imageUrl && (
                <img 
                  src={article.imageUrl} 
                  alt={article.title}
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                />
              )}
              <div style={{ padding: '16px' }}>
                <span style={{ 
                  backgroundColor: '#e8f5e9', 
                  color: '#2e7d32',
                  padding: '4px 12px', 
                  borderRadius: '20px', 
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  {article.category}
                </span>
                <h2 style={{ fontSize: '18px', marginTop: '12px', marginBottom: '8px' }}>
                  {article.title}
                </h2>
                <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.5' }}>
                  {article.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}