const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateBlogImage() {
  try {
    const result = await prisma.blogPost.update({
      where: {
        slug: 'cannabis-strains-focus-productivity-top-recommendations',
      },
      data: {
        imageUrl: 'https://cdn.midjourney.com/fa2478b7-0239-4a79-bf81-1191fb6ee78d/0_1.png',
      },
    });

    console.log('✅ Updated blog post image:', result.title);
    console.log('   New image URL:', result.imageUrl);
  } catch (error) {
    console.error('Error updating blog post:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

updateBlogImage();
