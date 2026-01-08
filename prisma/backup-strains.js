const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function backupStrains() {
  console.log('🔄 Starting backup of current strains...\n');

  try {
    // Get all current strains
    const strains = await prisma.strain.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        type: true,
        thcContent: true,
        cbdContent: true,
        description: true,
        effects: true,
        flavors: true,
        medicalUses: true,
        negatives: true,
        growDifficulty: true,
        floweringTime: true,
        yield: true,
        genetics: true,
        breeder: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    console.log(`✅ Found ${strains.length} strains in database\n`);

    // Create backup filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = `strains-backup-${timestamp}.json`;

    // Save to JSON file
    fs.writeFileSync(backupFile, JSON.stringify(strains, null, 2));
    
    console.log(`✅ Backup saved to: ${backupFile}`);
    console.log(`📁 File size: ${(fs.statSync(backupFile).size / 1024).toFixed(2)} KB`);
    console.log('\n✅ Backup complete! You can now safely run the seed script.');
    console.log('   If anything goes wrong, you have this backup to restore from.\n');

  } catch (error) {
    console.error('❌ Error creating backup:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

backupStrains();
