import { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Cannabis Strains - Sativa, Indica & Hybrid | Leefii',
  description: 'Explore 2,000+ cannabis strains. Find the perfect sativa, indica, or hybrid strain based on effects, flavors, and THC/CBD content.',
  openGraph: {
    title: 'Cannabis Strains - Sativa, Indica & Hybrid | Leefii',
    description: 'Explore 2,000+ cannabis strains. Find the perfect sativa, indica, or hybrid strain based on effects, flavors, and THC/CBD content.',
  },
};

async function getStrains(type?: string, effect?: string) {
  const where: any = { isActive: true };
  
  if (type && type !== 'all') {
    where.type = type.toUpperCase();
  }
  
  if (effect) {
    where.effects = { has: effect };
  }
  
  const strains = await prisma.strain.findMany({
    where,
    orderBy: { rating: 'desc' },
    take: 100,
  });
  
  return strains;
}

async function getStrainCounts() {
  const [total, sativa, indica, hybrid] = await Promise.all([
    prisma.strain.count({ where: { isActive: true } }),
    prisma.strain.count({ where: { isActive: true, type: 'SATIVA' } }),
    prisma.strain.count({ where: { isActive: true, type: 'INDICA' } }),
    prisma.strain.count({ where: { isActive: true, type: 'HYBRID' } }),
  ]);
  
  return { total, sativa, indica, hybrid };
}

export default async function StrainsPage({
  searchParams,
}: {
  searchParams: { type?: string; effect?: string };
}) {
  const type = searchParams.type || 'all';
  const effect = searchParams.effect;
  
  const [strains, counts] = await Promise.all([
    getStrains(type, effect),
    getStrainCounts(),
  ]);

  const effects = [
    'Relaxed', 'Happy', 'Euphoric', 'Uplifted', 'Creative',
    'Energetic', 'Focused', 'Sleepy', 'Hungry', 'Talkative'
  ];

  const getTypeColor = (strainType: string) => {
    switch (strainType) {
      case 'SATIVA': return 'bg-orange-100 text-orange-700';
      case 'INDICA': return 'bg-purple-100 text-purple-700';
      case 'HYBRID': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold mb-4">Cannabis Strains</h1>
          <p className="text-green-100 text-lg mb-6">
            Explore {counts.total.toLocaleString()}+ strains to find your perfect match
          </p>
          
          {/* Stats */}
          <div className="flex flex-wrap gap-6">
            <div className="bg-white/10 rounded-lg px-4 py-2">
              <span className="text-2xl font-bold">{counts.sativa}</span>
              <span className="text-green-200 ml-2">Sativa</span>
            </div>
            <div className="bg-white/10 rounded-lg px-4 py-2">
              <span className="text-2xl font-bold">{counts.indica}</span>
              <span className="text-green-200 ml-2">Indica</span>
            </div>
            <div className="bg-white/10 rounded-lg px-4 py-2">
              <span className="text-2xl font-bold">{counts.hybrid}</span>
              <span className="text-green-200 ml-2">Hybrid</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Type Filter */}
            <div className="flex gap-2">
              <Link
                href="/strains"
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  type === 'all' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Types
              </Link>
              <Link
                href="/strains?type=sativa"
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  type === 'sativa' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Sativa
              </Link>
              <Link
                href="/strains?type=indica"
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  type === 'indica' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Indica
              </Link>
              <Link
                href="/strains?type=hybrid"
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  type === 'hybrid' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Hybrid
              </Link>
            </div>

            {/* Effects Filter */}
            <div className="flex gap-2 flex-wrap">
              <span className="text-gray-500 text-sm self-center">Effects:</span>
              {effects.slice(0, 5).map((eff) => (
                <Link
                  key={eff}
                  href={`/strains?type=${type}${effect === eff ? '' : `&effect=${eff}`}`}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                    effect === eff ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {eff}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-4 text-gray-600">
          Showing {strains.length} strains
          {type !== 'all' && ` • ${type.charAt(0).toUpperCase() + type.slice(1)}`}
          {effect && ` • ${effect}`}
        </div>

        {strains.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No strains found. Try adjusting your filters.</p>
            <Link href="/strains" className="text-green-600 hover:underline mt-2 inline-block">
              View all strains →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {strains.map((strain) => (
              <Link
                key={strain.id}
                href={`/strains/${strain.slug}`}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden group"
              >
                {/* Image placeholder */}
                <div className="h-40 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                  <span className="text-6xl">🌿</span>
                </div>
                
                <div className="p-4">
                  {/* Type badge */}
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-2 ${getTypeColor(strain.type)}`}>
                    {strain.type}
                  </span>
                  
                  {/* Name */}
                  <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition">
                    {strain.name}
                  </h3>
                  
                  {/* THC/CBD */}
                  <div className="flex gap-3 mt-2 text-sm">
                    {strain.thcMax && (
                      <span className="text-gray-600">
                        THC: {strain.thcMin || 0}-{strain.thcMax}%
                      </span>
                    )}
                    {strain.cbdMax && strain.cbdMax > 0.5 && (
                      <span className="text-gray-600">
                        CBD: {strain.cbdMax}%
                      </span>
                    )}
                  </div>
                  
                  {/* Effects */}
                  {strain.effects && strain.effects.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {strain.effects.slice(0, 3).map((eff) => (
                        <span key={eff} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {eff}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* Rating */}
                  {strain.rating > 0 && (
                    <div className="flex items-center gap-1 mt-3 text-sm">
                      <span className="text-yellow-500">★</span>
                      <span className="text-gray-700">{strain.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
