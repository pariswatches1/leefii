'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Strain {
  id: string;
  name: string;
  slug: string;
  type: string;
  thcMin?: number | null;
  thcMax?: number | null;
  cbdMin?: number | null;
  cbdMax?: number | null;
  effects: string[];
  rating?: number | null;
}

interface StrainsClientProps {
  initialStrains: Strain[];
  counts: { total: number; sativa: number; indica: number; hybrid: number };
  filteredCount: number;
  initialType: string;
  initialEffect: string;
}

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

export default function StrainsClient({ 
  initialStrains, 
  counts, 
  filteredCount,
  initialType, 
  initialEffect 
}: StrainsClientProps) {
  const [strains, setStrains] = useState<Strain[]>(initialStrains);
  const [type, setType] = useState(initialType);
  const [effect, setEffect] = useState(initialEffect);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentCount, setCurrentCount] = useState(filteredCount);
  const [page, setPage] = useState(1);

  const loadStrains = async (newType: string, newEffect: string, reset: boolean = true) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (newType && newType !== 'all') params.set('type', newType);
      if (newEffect) params.set('effect', newEffect);
      params.set('take', '48');
      params.set('skip', '0');

      const res = await fetch(`/api/strains?${params.toString()}`);
      const data = await res.json();
      
      setStrains(data.strains);
      setCurrentCount(data.total);
      setPage(1);
    } catch (error) {
      console.error('Error loading strains:', error);
    }
    setLoading(false);
  };

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const params = new URLSearchParams();
      if (type && type !== 'all') params.set('type', type);
      if (effect) params.set('effect', effect);
      params.set('take', '48');
      params.set('skip', String(strains.length));

      const res = await fetch(`/api/strains?${params.toString()}`);
      const data = await res.json();
      
      setStrains([...strains, ...data.strains]);
      setPage(page + 1);
    } catch (error) {
      console.error('Error loading more strains:', error);
    }
    setLoadingMore(false);
  };

  const handleTypeChange = (newType: string) => {
    setType(newType);
    // Update URL without reload
    const url = new URL(window.location.href);
    if (newType === 'all') {
      url.searchParams.delete('type');
    } else {
      url.searchParams.set('type', newType);
    }
    window.history.pushState({}, '', url.toString());
    loadStrains(newType, effect);
  };

  const handleEffectChange = (newEffect: string) => {
    const updatedEffect = effect === newEffect ? '' : newEffect;
    setEffect(updatedEffect);
    // Update URL without reload
    const url = new URL(window.location.href);
    if (updatedEffect) {
      url.searchParams.set('effect', updatedEffect);
    } else {
      url.searchParams.delete('effect');
    }
    window.history.pushState({}, '', url.toString());
    loadStrains(type, updatedEffect);
  };

  const hasMore = strains.length < currentCount;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold mb-4">Cannabis Strains</h1>
          <p className="text-green-100 text-lg mb-8">
            Explore {counts.total.toLocaleString()}+ strains to find your perfect match
          </p>
          
          {/* Stats */}
          <div className="flex flex-wrap gap-6">
            <div className="bg-white/10 rounded-lg px-4 py-3">
              <span className="text-2xl font-bold">{counts.sativa.toLocaleString()}</span>
              <span className="text-green-200 ml-2">Sativa</span>
            </div>
            <div className="bg-white/10 rounded-lg px-4 py-3">
              <span className="text-2xl font-bold">{counts.indica.toLocaleString()}</span>
              <span className="text-green-200 ml-2">Indica</span>
            </div>
            <div className="bg-white/10 rounded-lg px-4 py-3">
              <span className="text-2xl font-bold">{counts.hybrid.toLocaleString()}</span>
              <span className="text-green-200 ml-2">Hybrid</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Type Filter */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => handleTypeChange('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                type === 'all' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => handleTypeChange('sativa')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                type === 'sativa' 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Sativa
            </button>
            <button
              onClick={() => handleTypeChange('indica')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                type === 'indica' 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Indica
            </button>
            <button
              onClick={() => handleTypeChange('hybrid')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                type === 'hybrid' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Hybrid
            </button>
          </div>
          
          {/* Effects Filter */}
          <div className="flex flex-wrap gap-2">
            <span className="text-gray-500 text-sm self-center mr-2">Effects:</span>
            {effects.map((eff) => (
              <button
                key={eff}
                onClick={() => handleEffectChange(eff)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                  effect === eff 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {eff}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-4 text-gray-600">
          Showing {strains.length.toLocaleString()} of {currentCount.toLocaleString()} strains
          {type !== 'all' && ` • ${type.charAt(0).toUpperCase() + type.slice(1)}`}
          {effect && ` • ${effect}`}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading strains...</p>
          </div>
        ) : strains.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No strains found. Try adjusting your filters.</p>
            <button 
              onClick={() => { handleTypeChange('all'); setEffect(''); }}
              className="mt-4 text-green-600 hover:underline"
            >
              View all strains →
            </button>
          </div>
        ) : (
          <>
            {/* Strain Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {strains.map((strain) => (
                <Link
                  key={strain.id}
                  href={`/strains/${strain.slug}`}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden group"
                >
                  {/* Image placeholder */}
                  <div className="h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
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
                      {strain.thcMax && strain.thcMax > 0 && (
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
                    {strain.rating && strain.rating > 0 && (
                      <div className="flex items-center gap-1 mt-3 text-sm">
                        <span className="text-yellow-500">★</span>
                        <span className="text-gray-700">{strain.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center mt-8">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="px-8 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingMore ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                      Loading...
                    </span>
                  ) : (
                    `Load More (${(currentCount - strains.length).toLocaleString()} remaining)`
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
