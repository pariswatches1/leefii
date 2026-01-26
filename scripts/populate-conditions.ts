import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Map effects and terpenes to medical conditions
const effectToConditions: Record<string, string[]> = {
  'Relaxed': ['Stress', 'Anxiety', 'Muscle Spasms'],
  'Sleepy': ['Insomnia', 'Stress'],
  'Happy': ['Depression', 'Stress'],
  'Euphoric': ['Depression', 'Stress', 'PTSD'],
  'Uplifted': ['Depression', 'Stress'],
  'Focused': ['PTSD', 'Depression'],
  'Energetic': ['Depression', 'Appetite Loss'],
  'Creative': ['Depression', 'Stress'],
  'Hungry': ['Appetite Loss', 'Nausea'],
  'Talkative': ['Depression', 'Stress'],
};

// Terpene to condition mapping based on research
const terpeneToConditions: Record<string, string[]> = {
  'myrcene': ['Chronic Pain', 'Insomnia', 'Inflammation', 'Muscle Spasms'],
  'limonene': ['Anxiety', 'Depression', 'Stress', 'Nausea'],
  'caryophyllene': ['Chronic Pain', 'Inflammation', 'Arthritis', 'Anxiety'],
  'pinene': ['Inflammation', 'Anxiety', 'Chronic Pain'],
  'linalool': ['Anxiety', 'Insomnia', 'Stress', 'Depression'],
  'humulene': ['Inflammation', 'Appetite Loss'],
  'terpinolene': ['Anxiety', 'Insomnia'],
  'ocimene': ['Inflammation'],
};

// Type to condition tendencies
const typeToConditions: Record<string, string[]> = {
  'INDICA': ['Chronic Pain', 'Insomnia', 'Muscle Spasms', 'Anxiety'],
  'SATIVA': ['Depression', 'Stress', 'Appetite Loss', 'PTSD'],
  'HYBRID': ['Chronic Pain', 'Stress', 'Anxiety', 'Depression'],
  'CBD': ['Chronic Pain', 'Inflammation', 'Anxiety', 'Arthritis'],
};

async function populateConditions() {
  console.log('Fetching strains...');

  const strains = await prisma.strain.findMany({
    where: { isActive: true },
  });

  console.log(`Processing ${strains.length} strains...`);

  let updated = 0;

  for (const strain of strains) {
    const conditionsSet = new Set<string>();

    // Add conditions based on effects
    for (const effect of strain.effects) {
      const conditions = effectToConditions[effect];
      if (conditions) {
        conditions.forEach(c => conditionsSet.add(c));
      }
    }

    // Add conditions based on dominant terpenes
    const terpenes = [
      { name: 'myrcene', value: strain.terpMyrcene || 0 },
      { name: 'limonene', value: strain.terpLimonene || 0 },
      { name: 'caryophyllene', value: strain.terpCaryophyllene || 0 },
      { name: 'pinene', value: strain.terpPinene || 0 },
      { name: 'linalool', value: strain.terpLinalool || 0 },
      { name: 'humulene', value: strain.terpHumulene || 0 },
      { name: 'terpinolene', value: strain.terpTerpinolene || 0 },
      { name: 'ocimene', value: strain.terpOcimene || 0 },
    ];

    // Get top 3 terpenes
    const topTerpenes = terpenes
      .filter(t => t.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 3);

    for (const terp of topTerpenes) {
      const conditions = terpeneToConditions[terp.name];
      if (conditions) {
        conditions.forEach(c => conditionsSet.add(c));
      }
    }

    // Add conditions based on type
    const typeConditions = typeToConditions[strain.type];
    if (typeConditions) {
      // Add 2 random conditions from type
      const shuffled = typeConditions.sort(() => Math.random() - 0.5);
      shuffled.slice(0, 2).forEach(c => conditionsSet.add(c));
    }

    // Limit to 5-8 conditions per strain
    const finalConditions = Array.from(conditionsSet).slice(0, Math.floor(Math.random() * 4) + 5);

    if (finalConditions.length > 0) {
      await prisma.strain.update({
        where: { id: strain.id },
        data: { conditions: finalConditions },
      });
      updated++;

      if (updated % 100 === 0) {
        console.log(`Updated ${updated} strains...`);
      }
    }
  }

  console.log(`\nCompleted! Updated ${updated} strains with medical conditions.`);

  // Show sample
  const samples = await prisma.strain.findMany({
    where: { conditions: { isEmpty: false } },
    take: 5,
    select: { name: true, type: true, conditions: true },
  });

  console.log('\nSample strains with conditions:');
  samples.forEach(s => {
    console.log(`- ${s.name} (${s.type}): ${s.conditions.join(', ')}`);
  });
}

populateConditions()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
