'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import FavoriteButton from '@/components/FavoriteButton';

interface FavoriteStrain {
  id: string;
  name: string;
  slug: string;
  type: string;
  thcMin?: number | null;
  thcMax?: number | null;
  effects: string[];
  rating?: number | null;
}

interface FavoriteDispensary {
  id: string;
  name: string;
  slug: string;
  address: string;
  rating?: number | null;
  hasDelivery: boolean;
  licenseType: string;
}

interface Favorite {
  id: string;
  entityType: string;
  entityId: string;
  createdAt: string;
  entity: FavoriteStrain | FavoriteDispensary | null;
}

const getTypeColor = (strainType: string) => {
  switch (strainType) {
    case 'SATIVA': return 'bg-orange-100 text-orange-700';
    case 'INDICA': return 'bg-purple-100 text-purple-700';
    case 'HYBRID': return 'bg-green-100 text-green-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

export default function FavoritesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'strains' | 'dispensaries'>('all');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/favorites');
    } else if (status === 'authenticated') {
      fetchFavorites();
    }
  }, [status]);

  const fetchFavorites = async () => {
    try {
      const res = await fetch('/api/favorites');
      const data = await res.json();
      setFavorites(data.favorites || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFavorites = favorites.filter(fav => {
    if (activeTab === 'all') return true;
    if (activeTab === 'strains') return fav.entityType === 'STRAIN';
    if (activeTab === 'dispensaries') return fav.entityType === 'DISPENSARY';
    return true;
  });

  const strainCount = favorites.filter(f => f.entityType === 'STRAIN').length;
  const dispensaryCount = favorites.filter(f => f.entityType === 'DISPENSARY').length;

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading your favorites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold mb-2">My Favorites</h1>
          <p className="text-green-100">
            {favorites.length === 0
              ? 'Save your favorite strains and dispensaries for quick access'
              : `You have ${favorites.length} saved item${favorites.length === 1 ? '' : 's'}`
            }
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4 py-4">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                activeTab === 'all'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({favorites.length})
            </button>
            <button
              onClick={() => setActiveTab('strains')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                activeTab === 'strains'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Strains ({strainCount})
            </button>
            <button
              onClick={() => setActiveTab('dispensaries')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                activeTab === 'dispensaries'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Dispensaries ({dispensaryCount})
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredFavorites.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">
              {activeTab === 'strains' ? '🌿' : activeTab === 'dispensaries' ? '🏪' : '❤️'}
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {activeTab === 'all'
                ? 'No favorites yet'
                : `No favorite ${activeTab} yet`
              }
            </h2>
            <p className="text-gray-500 mb-6">
              {activeTab === 'strains'
                ? 'Start exploring strains and save your favorites!'
                : activeTab === 'dispensaries'
                ? 'Find dispensaries near you and save your favorites!'
                : 'Browse strains and dispensaries to save your favorites!'
              }
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/strains"
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
              >
                Browse Strains
              </Link>
              <Link
                href="/dispensaries"
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
              >
                Find Dispensaries
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFavorites.map((fav) => {
              if (fav.entityType === 'STRAIN' && fav.entity) {
                const strain = fav.entity as FavoriteStrain;
                return (
                  <div key={fav.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden group relative">
                    {/* Remove Button */}
                    <div className="absolute top-2 right-2 z-10">
                      <FavoriteButton entityType="STRAIN" entityId={strain.id} size="sm" />
                    </div>

                    <Link href={`/strains/${strain.slug}`}>
                      <div className="h-40 bg-gradient-to-br from-green-100 to-green-200 overflow-hidden">
                        <img
                          src="https://cdn.midjourney.com/69b327bd-36d7-4219-8bc6-ffd1da9dd44b/0_1.png"
                          alt={strain.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-2 ${getTypeColor(strain.type)}`}>
                          {strain.type}
                        </span>
                        <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition">
                          {strain.name}
                        </h3>
                        {strain.thcMax && (
                          <p className="text-sm text-gray-500 mt-1">
                            THC: {strain.thcMin || 0}-{strain.thcMax}%
                          </p>
                        )}
                        {strain.effects && strain.effects.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {strain.effects.slice(0, 2).map((eff) => (
                              <span key={eff} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                {eff}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </Link>
                  </div>
                );
              }

              if (fav.entityType === 'DISPENSARY' && fav.entity) {
                const dispensary = fav.entity as FavoriteDispensary;
                return (
                  <div key={fav.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden group relative">
                    <div className="absolute top-2 right-2 z-10">
                      <FavoriteButton entityType="DISPENSARY" entityId={dispensary.id} size="sm" />
                    </div>

                    <Link href={`/dispensaries/${dispensary.slug}`}>
                      <div className="h-40 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                        <span className="text-5xl">🏪</span>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            dispensary.licenseType === 'RECREATIONAL'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {dispensary.licenseType}
                          </span>
                          {dispensary.hasDelivery && (
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                              Delivery
                            </span>
                          )}
                        </div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition">
                          {dispensary.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1 truncate">
                          {dispensary.address}
                        </p>
                        {dispensary.rating && dispensary.rating > 0 && (
                          <div className="flex items-center gap-1 mt-2 text-sm">
                            <span className="text-yellow-500">★</span>
                            <span className="text-gray-700">{dispensary.rating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                    </Link>
                  </div>
                );
              }

              return null;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
