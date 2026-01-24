const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  console.log('Adding news articles...');

  await prisma.newsArticle.createMany({
    data: [
      {
        title: "Federal Cannabis Legalization 2025: What the Latest Bill Means",
        slug: "federal-cannabis-legalization-2025",
        excerpt: "Congress is considering new federal cannabis legislation that could change everything.",
        content: "<p>The push for federal cannabis legalization has reached a critical point in 2025.</p>",
        category: "Legislation",
        tags: ["federal legalization", "cannabis bill"],
        imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800",
        isPublished: true
      },
      {
        title: "Cannabis Legalization by State 2025: Complete Guide",
        slug: "cannabis-legalization-by-state-2025",
        excerpt: "A state-by-state breakdown of cannabis legalization status in 2025.",
        content: "<p>Understanding cannabis laws by state can be confusing. Here is the breakdown.</p>",
        category: "Legislation",
        tags: ["state legalization", "marijuana laws"],
        imageUrl: "https://images.unsplash.com/photo-1603909223429-69bb7101f420?w=800",
        isPublished: true
      },
      {
        title: "Ohio Cannabis Dispensaries Now Open",
        slug: "ohio-cannabis-dispensaries-open",
        excerpt: "Ohio recreational cannabis market is officially open.",
        content: "<p>Ohio recreational cannabis market has officially launched.</p>",
        category: "Legislation",
        tags: ["Ohio cannabis"],
        imageUrl: "https://images.unsplash.com/photo-1587302525159-7581e18ede57?w=800",
        isPublished: true
      },
      {
        title: "Top Cannabis Stocks to Watch in 2025",
        slug: "top-cannabis-stocks-2025",
        excerpt: "Expert analysis of the top marijuana stocks for 2025.",
        content: "<p>The cannabis stock market enters 2025 with renewed optimism.</p>",
        category: "Industry",
        tags: ["cannabis stocks", "investing"],
        imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800",
        isPublished: true
      },
      {
        title: "Cannabis May Help Treat Anxiety: New Study",
        slug: "cannabis-anxiety-study-2025",
        excerpt: "New research shows cannabis may help with anxiety.",
        content: "<p>New research suggests cannabis compounds may help with anxiety.</p>",
        category: "Science",
        tags: ["cannabis anxiety", "CBD"],
        imageUrl: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800",
        isPublished: true
      },
      {
        title: "THC vs CBD: Complete Guide",
        slug: "thc-vs-cbd-guide",
        excerpt: "Understanding the difference between THC and CBD.",
        content: "<p>Understanding THC vs CBD is essential for choosing the right products.</p>",
        category: "Science",
        tags: ["THC", "CBD"],
        imageUrl: "https://images.unsplash.com/photo-1616690002179-a5c23a5f5be6?w=800",
        isPublished: true
      },
      {
        title: "How to Start a Cannabis Dispensary in 2025",
        slug: "how-to-start-dispensary-2025",
        excerpt: "Everything you need to know about opening a cannabis dispensary.",
        content: "<p>Opening a cannabis dispensary requires planning and capital.</p>",
        category: "Business",
        tags: ["dispensary", "cannabis business"],
        imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800",
        isPublished: true
      },
      {
        title: "Best Cannabis Strains for Creativity",
        slug: "best-strains-creativity",
        excerpt: "Discover strains that enhance creativity and focus.",
        content: "<p>Many artists find certain cannabis strains enhance creativity.</p>",
        category: "Culture",
        tags: ["creative strains", "sativa"],
        imageUrl: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800",
        isPublished: true
      },
      {
        title: "Top 10 Cannabis Tourism Destinations",
        slug: "cannabis-tourism-destinations",
        excerpt: "Best 420-friendly travel destinations in the US.",
        content: "<p>Cannabis tourism is a growing travel trend.</p>",
        category: "Culture",
        tags: ["cannabis tourism"],
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
        isPublished: true
      },
      {
        title: "Amazon Eyes Cannabis Industry Entry",
        slug: "amazon-cannabis-industry",
        excerpt: "Amazon signals intention to enter the cannabis market.",
        content: "<p>Amazon has signaled interest in entering the cannabis market.</p>",
        category: "Industry",
        tags: ["Amazon", "cannabis industry"],
        imageUrl: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=800",
        isPublished: true
      }
    ],
    skipDuplicates: true
  });

  const count = await prisma.newsArticle.count();
  console.log('Done! Total articles:', count);
}

seed()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
