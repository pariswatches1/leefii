import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{ state: string; city: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { state, city } = await params;
  const cityName = city.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const stateName = state.toUpperCase();
  
  return {
    title: `Cannabis Dispensaries in ${cityName}, ${stateName} | Leefii`,
    description: `Find the best cannabis dispensaries in ${cityName}, ${stateName}. Browse reviews, menus, and deals from licensed dispensaries near you.`,
  };
}

export default async function CityPage({ params }: PageProps) {
  const { state, city } = await params;
  
  const cityName = city.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const stateUpper = state.toUpperCase();

  const dispensaries = await prisma.dispensary.findMany({
    where: {
      state: stateUpper,
      city: {
        equals: cityName,
        mode: 'insensitive',
      },
    },
    include: {
      BusinessHours: true,
    },
    orderBy: {
      rating: 'desc',
    },
  });

  if (dispensaries.length === 0) {
    notFound();
  }

  const stateNames: Record<string, string> = {
    'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
    'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
    'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
    'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
    'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri',
    'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey',
    'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio',
    'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
    'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
    'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming',
    'DC': 'District of Columbia'
  };

  const fullStateName = stateNames[stateUpper] || stateUpper;

  // Helper function to check if currently open
  const isOpenNow = (businessHours: { dayOfWeek: string; openTime: string; closeTime: string }[] | undefined) => {
    if (!businessHours || businessHours.length === 0) return null;
    
    const now = new Date();
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = days[now.getDay()];
    
    const todayHours = businessHours.find(h => h.dayOfWeek.toLowerCase() === today);
    if (!todayHours) return false;
    
    const currentTime = now.getHours() * 100 + now.getMinutes();
    const openTime = parseInt(todayHours.openTime.replace(':', ''));
    const closeTime = parseInt(todayHours.closeTime.replace(':', ''));
    
    return currentTime >= openTime && currentTime <= closeTime;
  };

  const openNowCount = dispensaries.filter(d => isOpenNow(d.BusinessHours)).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Leefii</span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/dispensaries" className="text-gray-600 hover:text-gray-900">Browse</Link>
              <Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/dispensaries" className="text-green-600 hover:underline">Dispensaries</Link>
            <span className="text-gray-400">/</span>
            <Link href={`/dispensaries/${state}`} className="text-green-600 hover:underline">{fullStateName}</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">{cityName}</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-4">
            Cannabis Dispensaries in {cityName}, {stateUpper}
          </h1>
          <p className="text-green-100 text-lg mb-6">
            Find licensed dispensaries, compare products, and discover deals near you.
          </p>
          <div className="flex gap-6">
            <div className="bg-white/20 rounded-lg px-4 py-2">
              <div className="text-2xl font-bold">{dispensaries.length}</div>
              <div className="text-green-100 text-sm">Dispensaries</div>
            </div>
            {openNowCount > 0 && (
              <div className="bg-white/20 rounded-lg px-4 py-2">
                <div className="text-2xl font-bold">{openNowCount}</div>
                <div className="text-green-100 text-sm">Open Now</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dispensary List */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid gap-6">
          {dispensaries.map((dispensary) => {
            const openStatus = isOpenNow(dispensary.BusinessHours);
            
            return (
              <div key={dispensary.id} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl font-semibold text-gray-900">{dispensary.name}</h2>
                      {openStatus !== null && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          openStatus ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {openStatus ? 'Open' : 'Closed'}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-2">{dispensary.address}</p>
                    {dispensary.phone && (
                      <p className="text-gray-500 text-sm mb-3">{dispensary.phone}</p>
                    )}
                    <div className="flex items-center gap-4">
                      {dispensary.rating && (
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500">★</span>
                          <span className="font-medium">{dispensary.rating.toFixed(1)}</span>
                          {dispensary.reviewCount && (
                            <span className="text-gray-400 text-sm">({dispensary.reviewCount} reviews)</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {dispensary.website && (
                      <a
                        href={dispensary.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition text-center"
                      >
                        Visit Website
                      </a>
                    )}
                    {dispensary.phone && (
                      <a
                        href={`tel:${dispensary.phone}`}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition text-center"
                      >
                        Call
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <span className="text-white font-bold">Leefii</span>
            </div>
            <p className="text-sm">© 2026 Leefii. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
