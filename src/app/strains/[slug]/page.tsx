import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';

type Props = {
  params: { slug: string };
};

async function getStrain(slug: string) {
  const strain = await prisma.strain.findUnique({
    where: { slug },
  });
  return strain;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const strain = await getStrain(params.slug);
  
  if (!strain) {
    return { title: 'Strain Not Found | Leefii' };
  }
  
  return {
    title: `${strain.name} - ${strain.type} Cannabis Strain | Leefii`,
    description: strain.description || `Learn about ${strain.name}, a ${strain.type.toLowerCase()} cannabis strain. THC: ${strain.thcMin}-${strain.thcMax}%. Effects: ${strain.effects?.join(', ')}.`,
    openGraph: {
      title: `${strain.name} - ${strain.type} Cannabis Strain | Leefii`,
      description: strain.description || `Learn about ${strain.name}, a ${strain.type.toLowerCase()} cannabis strain.`,
    },
  };
}

export default async function StrainPage({ params }: Props) {
  const strain = await getStrain(params.slug);
  
  if (!strain) {
    notFound();
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'SATIVA': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'INDICA': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'HYBRID': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTypeBg = (type: string) => {
    switch (type) {
      case 'SATIVA': return 'from-orange-500 to-orange-600';
      case 'INDICA': return 'from-purple-500 to-purple-600';
      case 'HYBRID': return 'from-green-500 to-green-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            <span className="text-gray-300">/</span>
            <Link href="/strains" className="text-gray-500 hover:text-gray-700">Strains</Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900">{strain.name}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <div className={`bg-gradient-to-r ${getTypeBg(strain.type)} text-white`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Image */}
            <div className="w-full md:w-64 h-64 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
              <span className="text-8xl">🌿</span>
            </div>
            
            {/* Info */}
            <div className="flex-1">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-3 ${getTypeColor(strain.type)}`}>
                {strain.type}
              </span>
              
              <h1 className="text-4xl font-bold mb-4">{strain.name}</h1>
              
              {strain.genetics && (
                <p className="text-white/80 mb-4">
                  Genetics: {strain.genetics}
                </p>
              )}
              
              {/* THC/CBD */}
              <div className="flex flex-wrap gap-4 mb-6">
                {strain.thcMax && (
                  <div className="bg-white/20 rounded-lg px-4 py-2">
                    <div className="text-white/70 text-sm">THC</div>
                    <div className="text-xl font-bold">{strain.thcMin || 0}-{strain.thcMax}%</div>
                  </div>
                )}
                {strain.cbdMax && (
                  <div className="bg-white/20 rounded-lg px-4 py-2">
                    <div className="text-white/70 text-sm">CBD</div>
                    <div className="text-xl font-bold">{strain.cbdMin || 0}-{strain.cbdMax}%</div>
                  </div>
                )}
                {strain.rating > 0 && (
                  <div className="bg-white/20 rounded-lg px-4 py-2">
                    <div className="text-white/70 text-sm">Rating</div>
                    <div className="text-xl font-bold flex items-center gap-1">
                      <span className="text-yellow-300">★</span>
                      {strain.rating.toFixed(1)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            {strain.description && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">About {strain.name}</h2>
                <p className="text-gray-600 leading-relaxed">{strain.description}</p>
              </div>
            )}

            {/* Effects */}
            {strain.effects && strain.effects.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Effects</h2>
                <div className="flex flex-wrap gap-2">
                  {strain.effects.map((effect) => (
                    <span key={effect} className="px-4 py-2 bg-green-50 text-green-700 rounded-full font-medium">
                      {effect}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Flavors */}
            {strain.flavors && strain.flavors.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Flavors</h2>
                <div className="flex flex-wrap gap-2">
                  {strain.flavors.map((flavor) => (
                    <span key={flavor} className="px-4 py-2 bg-orange-50 text-orange-700 rounded-full font-medium">
                      {flavor}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Aromas */}
            {strain.aromas && strain.aromas.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Aromas</h2>
                <div className="flex flex-wrap gap-2">
                  {strain.aromas.map((aroma) => (
                    <span key={aroma} className="px-4 py-2 bg-purple-50 text-purple-700 rounded-full font-medium">
                      {aroma}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold mb-4">Strain Info</h3>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Type</dt>
                  <dd className="font-medium">{strain.type}</dd>
                </div>
                {strain.genetics && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Genetics</dt>
                    <dd className="font-medium text-right">{strain.genetics}</dd>
                  </div>
                )}
                {strain.origin && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Origin</dt>
                    <dd className="font-medium">{strain.origin}</dd>
                  </div>
                )}
                {strain.breeder && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Breeder</dt>
                    <dd className="font-medium">{strain.breeder}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Growing Info */}
            {(strain.floweringTime || strain.difficulty) && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold mb-4">Growing Info</h3>
                <dl className="space-y-3">
                  {strain.floweringTime && (
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Flowering</dt>
                      <dd className="font-medium">{strain.floweringTime}</dd>
                    </div>
                  )}
                  {strain.difficulty && (
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Difficulty</dt>
                      <dd className="font-medium">{strain.difficulty}</dd>
                    </div>
                  )}
                  {strain.yieldIndoor && (
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Indoor Yield</dt>
                      <dd className="font-medium">{strain.yieldIndoor}</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}

            {/* CTA */}
            <div className="bg-green-50 rounded-xl p-6 border border-green-100">
              <h3 className="font-semibold text-green-900 mb-2">Find {strain.name} Near You</h3>
              <p className="text-green-700 text-sm mb-4">
                Browse dispensaries that may carry this strain.
              </p>
              <Link
                href="/dispensaries"
                className="block w-full bg-green-600 text-white text-center py-3 rounded-lg font-medium hover:bg-green-700 transition"
              >
                Find Dispensaries
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
