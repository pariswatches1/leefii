const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const categories = [
  { name: 'Flower', slug: 'flower', description: 'Cannabis flower and buds', sortOrder: 1 },
  { name: 'Pre-Rolls', slug: 'pre-rolls', description: 'Pre-rolled joints and blunts', sortOrder: 2 },
  { name: 'Edibles', slug: 'edibles', description: 'Cannabis-infused food and beverages', sortOrder: 3 },
  { name: 'Concentrates', slug: 'concentrates', description: 'Dabs, wax, shatter, and oils', sortOrder: 4 },
  { name: 'Vaporizers', slug: 'vaporizers', description: 'Vape pens and cartridges', sortOrder: 5 },
  { name: 'Tinctures', slug: 'tinctures', description: 'Cannabis tinctures and drops', sortOrder: 6 },
  { name: 'Topicals', slug: 'topicals', description: 'Creams, balms, and lotions', sortOrder: 7 },
  { name: 'CBD', slug: 'cbd', description: 'CBD products', sortOrder: 8 },
  { name: 'Accessories', slug: 'accessories', description: 'Pipes, bongs, papers, and more', sortOrder: 9 },
];

async function seedCategories() {
  console.log('Seeding product categories...');

  for (const category of categories) {
    try {
      const existing = await prisma.productCategory.findUnique({
        where: { slug: category.slug }
      });

      if (existing) {
        console.log('Skipping - already exists:', category.name);
        continue;
      }

      await prisma.productCategory.create({ data: category });
      console.log('Created:', category.name);
    } catch (error) {
      console.error('Error creating:', category.name, error.message);
    }
  }

  console.log('Done!');
  await prisma.$disconnect();
}

seedCategories();
