const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function count() {
  const [states, cities, dispensaries, strains, blogs, news, doctors, products, deliveryCities, topStrains] = await Promise.all([
    prisma.state.count(),
    prisma.city.count({ where: { dispensaries: { some: {} } } }),
    prisma.dispensary.count({ where: { isActive: true } }),
    prisma.strain.count({ where: { isActive: true } }),
    prisma.blogPost.count({ where: { isPublished: true } }),
    prisma.newsArticle.count({ where: { isPublished: true } }),
    prisma.doctor.count({ where: { isActive: true } }),
    prisma.product.count({ where: { isAvailable: true } }),
    prisma.city.count({ where: { dispensaries: { some: { isActive: true, hasDelivery: true } } } }),
    prisma.strain.count({ where: { isActive: true, rating: { gte: 4.0 }, reviewsCount: { gte: 10 } } }),
  ]);

  const doctorStates = await prisma.doctor.findMany({ where: { isActive: true }, select: { state: true }, distinct: ['state'] });

  const staticPages = 15;
  const competitorPages = 2;
  const effectPages = 15;
  const typePages = 3;
  const typeEffectPages = 45;
  const terpenePages = 8;
  const conditionPages = 11;
  const flavorPages = 43;
  const comparisonPairs = Math.min(topStrains * (topStrains - 1) / 2, 4950);

  const total =
    staticPages + competitorPages +
    effectPages + typePages + typeEffectPages + terpenePages + conditionPages + flavorPages + comparisonPairs +
    states + cities + deliveryCities + doctorStates.length +
    dispensaries + strains + blogs + news + doctors + products;

  console.log('=== LEEFII PAGE COUNT BREAKDOWN ===\n');
  console.log('STATIC PAGES:');
  console.log('  Static pages:          ' + staticPages);
  console.log('  Competitor comparisons: ' + competitorPages);
  console.log('\nPROGRAMMATIC SEO:');
  console.log('  Effect pages:          ' + effectPages);
  console.log('  Type pages:            ' + typePages);
  console.log('  Type+Effect combos:    ' + typeEffectPages);
  console.log('  Terpene pages:         ' + terpenePages);
  console.log('  Condition pages:       ' + conditionPages);
  console.log('  Flavor pages:          ' + flavorPages);
  console.log('  Strain comparisons:    ' + comparisonPairs + ' (from ' + topStrains + ' top strains)');
  console.log('\nDYNAMIC (from database):');
  console.log('  State pages:           ' + states);
  console.log('  City pages:            ' + cities);
  console.log('  Delivery+city pages:   ' + deliveryCities);
  console.log('  Doctor+state pages:    ' + doctorStates.length);
  console.log('  Dispensary detail:     ' + dispensaries);
  console.log('  Strain detail:         ' + strains);
  console.log('  Blog posts:            ' + blogs);
  console.log('  News articles:         ' + news);
  console.log('  Doctor detail:         ' + doctors);
  console.log('  Product detail:        ' + products);
  console.log('\n================================');
  console.log('  TOTAL PAGES:           ' + total.toLocaleString());
  console.log('================================');

  await prisma.$disconnect();
}
count().catch(console.error);
