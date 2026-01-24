// Run this script to make a user an admin
// Usage: node prisma/make-admin.js your-email@example.com

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function makeAdmin() {
  const email = process.argv[2];

  if (!email) {
    console.log('Usage: node prisma/make-admin.js your-email@example.com');
    process.exit(1);
  }

  try {
    const user = await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' },
    });

    console.log(`✅ Success! User ${user.email} is now an ADMIN`);
    console.log(`\nYou can now access:`);
    console.log(`  - /admin/applications - Review seller applications`);
    console.log(`  - /admin/sellers - Manage active sellers`);
  } catch (error) {
    if (error.code === 'P2025') {
      console.error(`❌ Error: No user found with email "${email}"`);
      console.log('\nMake sure you have registered an account first.');
    } else {
      console.error('Error:', error.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}

makeAdmin();
