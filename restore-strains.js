const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function restoreStrains() {
  console.log('Starting strain restoration...');

  const backupPath = path.join(__dirname, 'strains-backup.json');
  
  if (!fs.existsSync(backupPath)) {
    console.error('Backup file not found!');
    process.exit(1);
  }

  console.log('Reading backup file...');
  const strains = JSON.parse(fs.readFileSync(backupPath, 'utf-8'));
  console.log('Found ' + strains.length + ' strains in backup');

  console.log('Clearing existing strains...');
  await prisma.strain.deleteMany({});

  const BATCH_SIZE = 100;
  let inserted = 0;

  console.log('Inserting strains...');

  for (let i = 0; i < strains.length; i += BATCH_SIZE) {
    const batch = strains.slice(i, i + BATCH_SIZE);

    const cleanedBatch = batch.map(strain => ({
      name: strain.name,
      slug: strain.slug,
      type: strain.type,
      thcMin: strain.thcMin,
      thcMax: strain.thcMax,
      cbdMin: strain.cbdMin,
      cbdMax: strain.cbdMax,
      effects: strain.effects || [],
      flavors: strain.flavors || [],
      aromas: strain.aromas || [],
      description: strain.description,
      genetics: strain.genetics,
      origin: strain.origin,
      breeder: strain.breeder,
      floweringTime: strain.floweringTime,
      difficulty: strain.difficulty,
      yieldIndoor: strain.yieldIndoor,
      yieldOutdoor: strain.yieldOutdoor,
      rating: strain.rating,
      reviewsCount: strain.reviewsCount,
      imageUrl: strain.imageUrl,
      isActive: strain.isActive ?? true,
      metaTitle: strain.metaTitle,
      metaDescription: strain.metaDescription,
    }));

    await prisma.strain.createMany({
      data: cleanedBatch,
      skipDuplicates: true,
    });

    inserted += batch.length;
    console.log('Inserted: ' + inserted + ' / ' + strains.length);
  }

  const finalCount = await prisma.strain.count();
  console.log('DONE! Total strains restored: ' + finalCount);

  await prisma.$disconnect();
}

restoreStrains().catch(console.error);