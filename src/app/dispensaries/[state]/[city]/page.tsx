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
  const stateName = state.charAt(0).toUpperCase() + state.slice(1);
  
  return {
    title: `Cannabis Dispensaries in ${cityName}, ${stateName} | Leefii`,
    description: `Find the best cannabis dispensaries in ${cityName}, ${stateName}. Browse reviews, menus, and deals from licensed dispensaries near you.`,
  };
}

// Helper function to check if dispensary is currently open
function isCurrentlyOpen(businessHours: any[]): boolean {
  if (!businessHours || businessHours.length === 0) return false;
  
  const now = new Date();
  const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const currentTime = now.toTimeString().slice(0, 5); // "HH:MM" format
  
  // Map day number to day name (matching your database enum)
  const dayNames = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  const todayName = dayNames[currentDay];
  
  // Find today's hours - check both enum string and number formats
  const todayHours = businessHours.find(h => 
    h.dayOfWeek === todayName || 
    h.dayOfWeek === currentDay ||
    h.dayOfWeek === currentDay.toString()
  );
  
  if (!todayHours || todayHours.isClosed) return false;
  
  return currentTime >= todayHours.openTime && currentTime <= todayHours.closeTime;
}

export default async function CityPage({ params }: PageProps) {
  const { state, city } = await params;
  
  const cityName = city.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const stateSlug = state.toLowerCase();

  const dispensaries = await prisma.dispensary.findMany({
    where: {
      state: {
        slug: stateSlug,
      },
      city: {
        name: cityName,
      },
    },
    include: {
      BusinessHours: true,
      state: true,
      city: true,
    },
    orderBy: {
      rating: 'desc',
    },
  });

  if (dispensaries.length === 0) {
    notFound();
  }

  const stateInfo = dispensaries[0].state;
  const fullStateName = stateInfo.name;
  const stateAbbrev = stateInfo.abbreviation;
  const openNowCount = dispensaries.filter(d => isCurrentlyOpen(d.BusinessHours)).length;

  return (
    <div className="min-h-screen bg-gray-50">
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

      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-4">
            Dispensaries in {cityName}, {stateAbbrev}
          </h1>
          <p className="text-green-100 text-lg mb-6">
            Find {dispensaries.length} licensed cannabis dispensaries in {cityName}, {fullStateName}.
          </p>
          <div className="flex gap-4">
            <div className="bg-white/20 rounded-lg px-4 py-2">
              <div className="text-2xl font-bold">{dispensaries.length}</div>
              <div className="text-green-100 text-sm">Dispensaries</div>
            </div>
            <div className="bg-white/20 rounded-lg px-4 py-2">
              <div className="text-2xl font-bold">{openNowCount}</div>
              <div className="text-green-100 text-sm">Open Now</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid gap-6">
          {dispensaries.map((dispensary) => {
            const isOpen = isCurrentlyOpen(dispensary.BusinessHours);
            return (
              <div key={dispensary.id} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl font-semibold text-gray-900">{dispensary.name}</h2>
                      {isOpen && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">Open</span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-2">{dispensary.address}</p>
                    {dispensary.phone && <p className="text-gray-500 text-sm mb-3">{dispensary.phone}</p>}
                    {dispensary.rating && (
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span className="font-medium">{dispensary.rating.toFixed(1)}</span>
                        {dispensary.reviewsCount && (
                          <span className="text-gray-400 text-sm">({dispensary.reviewsCount} reviews)</span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    {dispensary.website && (
                      <a href={dispensary.website} target="_blank" rel="noopener noreferrer"
                        className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition text-center">
                        Website
                      </a>
                    )}
                    {dispensary.address && (
                      <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dispensary.address)}`}
                        target="_blank" rel="noopener noreferrer"
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition text-center">
                        Directions
                      </a>
                    )}
                    {dispensary.phone && (
                      <a href={`tel:${dispensary.phone}`}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition text-center">
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
