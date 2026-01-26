import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Generate SEO-optimized meta title
function generateMetaTitle(strain: {
  name: string;
  type: string;
  thcMax: number | null;
  effects: string[];
}): string {
  const typeLabel = strain.type === 'SATIVA' ? 'Sativa'
    : strain.type === 'INDICA' ? 'Indica'
    : strain.type === 'HYBRID' ? 'Hybrid'
    : 'CBD';

  const thcPart = strain.thcMax ? ` | ${strain.thcMax}% THC` : '';
  const effectPart = strain.effects.length > 0 ? ` - ${strain.effects[0]}` : '';

  // Keep under 60 characters for optimal SEO
  let title = `${strain.name} Strain${effectPart} | ${typeLabel}${thcPart}`;

  if (title.length > 60) {
    title = `${strain.name} Strain | ${typeLabel}${thcPart}`;
  }

  if (title.length > 60) {
    title = `${strain.name} ${typeLabel} Strain | Leefii`;
  }

  return title;
}

// Generate SEO-optimized meta description
function generateMetaDescription(strain: {
  name: string;
  type: string;
  thcMin: number | null;
  thcMax: number | null;
  cbdMin: number | null;
  cbdMax: number | null;
  effects: string[];
  flavors: string[];
  conditions: string[];
  genetics: string | null;
  description: string | null;
}): string {
  const typeLabel = strain.type === 'SATIVA' ? 'sativa'
    : strain.type === 'INDICA' ? 'indica'
    : strain.type === 'HYBRID' ? 'hybrid'
    : 'CBD';

  // Build THC/CBD info
  let potencyInfo = '';
  if (strain.thcMin && strain.thcMax) {
    potencyInfo = `${strain.thcMin}-${strain.thcMax}% THC`;
  } else if (strain.thcMax) {
    potencyInfo = `up to ${strain.thcMax}% THC`;
  }
  if (strain.cbdMax && strain.cbdMax > 0.5) {
    potencyInfo += potencyInfo ? `, ${strain.cbdMax}% CBD` : `${strain.cbdMax}% CBD`;
  }

  // Build effects string
  const topEffects = strain.effects.slice(0, 3).join(', ');

  // Build flavors string
  const topFlavors = strain.flavors.slice(0, 2).join(' & ');

  // Build medical uses
  const topConditions = strain.conditions.slice(0, 2).join(' and ');

  // Create description variants and pick the best one
  let desc = '';

  if (strain.description && strain.description.length > 50) {
    // Use first sentence of existing description if it's good
    const firstSentence = strain.description.split(/[.!?]/)[0].trim();
    if (firstSentence.length > 30 && firstSentence.length < 140) {
      desc = firstSentence + '.';
    }
  }

  if (!desc) {
    // Generate new description
    const parts: string[] = [];

    parts.push(`${strain.name} is a ${typeLabel} cannabis strain`);

    if (strain.genetics) {
      parts[0] += ` (${strain.genetics})`;
    }

    if (potencyInfo) {
      parts.push(`with ${potencyInfo}`);
    }

    if (topEffects) {
      parts.push(`Known for ${topEffects.toLowerCase()} effects`);
    }

    if (topFlavors) {
      parts.push(`featuring ${topFlavors.toLowerCase()} flavors`);
    }

    if (topConditions) {
      parts.push(`May help with ${topConditions.toLowerCase()}`);
    }

    desc = parts.join('. ') + '. Find reviews, THC levels & where to buy.';
  }

  // Ensure it's between 150-160 characters for optimal SEO
  if (desc.length > 160) {
    desc = desc.substring(0, 157) + '...';
  } else if (desc.length < 120) {
    desc += ' Read reviews, effects, and find dispensaries on Leefii.';
  }

  return desc;
}

async function main() {
  console.log('🌿 Starting SEO generation for all strains...\n');

  // Get all strains
  const strains = await prisma.strain.findMany({
    select: {
      id: true,
      name: true,
      type: true,
      thcMin: true,
      thcMax: true,
      cbdMin: true,
      cbdMax: true,
      effects: true,
      flavors: true,
      conditions: true,
      genetics: true,
      description: true,
      metaTitle: true,
      metaDescription: true,
    },
  });

  console.log(`Found ${strains.length} strains to process.\n`);

  let updated = 0;
  let skipped = 0;
  let errors = 0;

  for (const strain of strains) {
    try {
      const newMetaTitle = generateMetaTitle(strain);
      const newMetaDescription = generateMetaDescription(strain);

      // Only update if SEO is missing or we want to regenerate all
      const needsUpdate = !strain.metaTitle || !strain.metaDescription ||
                          strain.metaTitle === '' || strain.metaDescription === '';

      if (needsUpdate) {
        await prisma.strain.update({
          where: { id: strain.id },
          data: {
            metaTitle: newMetaTitle,
            metaDescription: newMetaDescription,
          },
        });

        console.log(`✅ ${strain.name}`);
        console.log(`   Title: ${newMetaTitle}`);
        console.log(`   Desc: ${newMetaDescription.substring(0, 80)}...`);
        console.log('');
        updated++;
      } else {
        skipped++;
      }
    } catch (error) {
      console.error(`❌ Error updating ${strain.name}:`, error);
      errors++;
    }
  }

  console.log('\n📊 Summary:');
  console.log(`   ✅ Updated: ${updated}`);
  console.log(`   ⏭️  Skipped (already has SEO): ${skipped}`);
  console.log(`   ❌ Errors: ${errors}`);
  console.log('\nDone! 🎉');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
