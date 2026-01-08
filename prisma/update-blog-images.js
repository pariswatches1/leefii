const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const imageUpdates = [
  {
    slug: 'best-indica-strains-for-sleep-and-insomnia',
    imageUrl: 'https://images.unsplash.com/photo-1603909223429-69bb7101f420?w=800&q=80',
  },
  {
    slug: 'best-cannabis-strains-for-anxiety-relief',
    imageUrl: 'https://images.unsplash.com/photo-1536819114556-1e10f967fb61?w=800&q=80',
  },
  {
    slug: 'best-sativa-strains-for-energy-and-focus',
    imageUrl: 'https://images.unsplash.com/photo-1589484274218-2f31bdf41912?w=800&q=80',
  },
  {
    slug: 'indica-vs-sativa-complete-guide-for-beginners',
    imageUrl: 'https://images.unsplash.com/photo-1503262028195-93c528f03218?w=800&q=80',
  },
  {
    slug: 'best-cannabis-strains-for-chronic-pain-management',
    imageUrl: 'https://images.unsplash.com/photo-1587302525159-7581e18ede57?w=800&q=80',
  },
];

async function updateImages() {
  console.log('🖼️  Updating blog post images...\n');

  for (const update of imageUpdates) {
    try {
      await prisma.blogPost.update({
        where: { slug: update.slug },
        data: { imageUrl: update.imageUrl },
      });
      console.log(`✅ Updated: ${update.slug}`);
    } catch (error) {
      console.error(`❌ Error updating ${update.slug}:`, error.message);
    }
  }

  console.log('\n🎉 Image update complete!');
}

updateImages()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
