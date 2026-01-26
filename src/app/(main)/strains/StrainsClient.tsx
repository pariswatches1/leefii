'use client';

import { useState } from 'react';
import Link from 'next/link';
import FavoriteButton from '@/components/FavoriteButton';

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
  conditions?: string[];
  rating?: number | null;
  terpMyrcene?: number | null;
  terpLimonene?: number | null;
  terpCaryophyllene?: number | null;
  terpPinene?: number | null;
  terpLinalool?: number | null;
  terpHumulene?: number | null;
  terpTerpinolene?: number | null;
  terpOcimene?: number | null;
}

interface StrainsClientProps {
  initialStrains: Strain[];
  counts: { total: number; sativa: number; indica: number; hybrid: number };
  filteredCount: number;
  initialType: string;
  initialEffect: string;
  initialTerpene?: string;
  initialCondition?: string;
}

const effects = [
  'Relaxed', 'Happy', 'Euphoric', 'Uplifted', 'Creative',
  'Energetic', 'Focused', 'Sleepy', 'Hungry', 'Talkative'
];

const terpenes = [
  { id: 'myrcene', name: 'Myrcene', color: 'bg-amber-500' },
  { id: 'limonene', name: 'Limonene', color: 'bg-yellow-400' },
  { id: 'caryophyllene', name: 'Caryophyllene', color: 'bg-orange-500' },
  { id: 'pinene', name: 'Pinene', color: 'bg-green-500' },
  { id: 'linalool', name: 'Linalool', color: 'bg-purple-500' },
  { id: 'humulene', name: 'Humulene', color: 'bg-lime-600' },
  { id: 'terpinolene', name: 'Terpinolene', color: 'bg-pink-500' },
];

const conditions = [
  { id: 'Chronic Pain', icon: '💆' },
  { id: 'Anxiety', icon: '😰' },
  { id: 'Insomnia', icon: '😴' },
  { id: 'Depression', icon: '😔' },
  { id: 'Stress', icon: '🧘' },
  { id: 'Nausea', icon: '🤢' },
  { id: 'Inflammation', icon: '🔥' },
  { id: 'Appetite Loss', icon: '🍽️' },
  { id: 'Migraines', icon: '🤕' },
  { id: 'PTSD', icon: '🧠' },
  { id: 'Arthritis', icon: '🦴' },
  { id: 'Muscle Spasms', icon: '💪' },
];

// Helper to get dominant terpene from a strain
const getDominantTerpene = (strain: Strain): { name: string; value: number; color: string } | null => {
  const terpeneValues = [
    { name: 'Myrcene', value: strain.terpMyrcene || 0, color: 'bg-amber-500' },
    { name: 'Limonene', value: strain.terpLimonene || 0, color: 'bg-yellow-400' },
    { name: 'Caryophyllene', value: strain.terpCaryophyllene || 0, color: 'bg-orange-500' },
    { name: 'Pinene', value: strain.terpPinene || 0, color: 'bg-green-500' },
    { name: 'Linalool', value: strain.terpLinalool || 0, color: 'bg-purple-500' },
    { name: 'Humulene', value: strain.terpHumulene || 0, color: 'bg-lime-600' },
    { name: 'Terpinolene', value: strain.terpTerpinolene || 0, color: 'bg-pink-500' },
    { name: 'Ocimene', value: strain.terpOcimene || 0, color: 'bg-teal-500' },
  ];

  const dominant = terpeneValues.reduce((max, t) => t.value > max.value ? t : max, terpeneValues[0]);
  return dominant.value > 0 ? dominant : null;
};

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
  initialEffect,
  initialTerpene = '',
  initialCondition = ''
}: StrainsClientProps) {
  const [strains, setStrains] = useState<Strain[]>(initialStrains);
  const [type, setType] = useState(initialType);
  const [effect, setEffect] = useState(initialEffect);
  const [terpene, setTerpene] = useState(initialTerpene);
  const [condition, setCondition] = useState(initialCondition);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentCount, setCurrentCount] = useState(filteredCount);
  const [page, setPage] = useState(1);

  const loadStrains = async (newType: string, newEffect: string, newTerpene: string = '', newCondition: string = '', reset: boolean = true) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (newType && newType !== 'all') params.set('type', newType);
      if (newEffect) params.set('effect', newEffect);
      if (newTerpene) params.set('terpene', newTerpene);
      if (newCondition) params.set('condition', newCondition);
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
      if (terpene) params.set('terpene', terpene);
      if (condition) params.set('condition', condition);
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
    const url = new URL(window.location.href);
    if (newType === 'all') {
      url.searchParams.delete('type');
    } else {
      url.searchParams.set('type', newType);
    }
    window.history.pushState({}, '', url.toString());
    loadStrains(newType, effect, terpene, condition);
  };

  const handleEffectChange = (newEffect: string) => {
    const updatedEffect = effect === newEffect ? '' : newEffect;
    setEffect(updatedEffect);
    const url = new URL(window.location.href);
    if (updatedEffect) {
      url.searchParams.set('effect', updatedEffect);
    } else {
      url.searchParams.delete('effect');
    }
    window.history.pushState({}, '', url.toString());
    loadStrains(type, updatedEffect, terpene, condition);
  };

  const handleTerpeneChange = (newTerpene: string) => {
    const updatedTerpene = terpene === newTerpene ? '' : newTerpene;
    setTerpene(updatedTerpene);
    const url = new URL(window.location.href);
    if (updatedTerpene) {
      url.searchParams.set('terpene', updatedTerpene);
    } else {
      url.searchParams.delete('terpene');
    }
    window.history.pushState({}, '', url.toString());
    loadStrains(type, effect, updatedTerpene, condition);
  };

  const handleConditionChange = (newCondition: string) => {
    const updatedCondition = condition === newCondition ? '' : newCondition;
    setCondition(updatedCondition);
    const url = new URL(window.location.href);
    if (updatedCondition) {
      url.searchParams.set('condition', updatedCondition);
    } else {
      url.searchParams.delete('condition');
    }
    window.history.pushState({}, '', url.toString());
    loadStrains(type, effect, terpene, updatedCondition);
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
          <div className="flex flex-wrap gap-2 mb-3">
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

          {/* Terpene Filter */}
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-gray-500 text-sm self-center mr-2">Terpenes:</span>
            {terpenes.map((terp) => (
              <button
                key={terp.id}
                onClick={() => handleTerpeneChange(terp.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition flex items-center gap-1 ${
                  terpene === terp.id
                    ? `${terp.color} text-white`
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${terpene === terp.id ? 'bg-white' : terp.color}`}></span>
                {terp.name}
              </button>
            ))}
          </div>

          {/* Medical Conditions Filter - Enhanced Section */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-2 items-center">
              <div className="flex items-center gap-2 mr-2">
                <span className="text-blue-600 font-semibold text-sm">May Help With:</span>
                <span className="animate-[nudge_3s_ease-in-out_infinite] text-blue-400">→</span>
              </div>
              {conditions.map((cond) => (
                <button
                  key={cond.id}
                  onClick={() => handleConditionChange(cond.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                    condition === cond.id
                      ? 'bg-blue-600 text-white shadow-md scale-105'
                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100 hover:scale-105 border border-blue-200'
                  }`}
                >
                  <span className="text-base">{cond.icon}</span>
                  {cond.id}
                </button>
              ))}
            </div>
          </div>

          {/* Keyframe animation for nudge arrow */}
          <style jsx>{`
            @keyframes nudge {
              0%, 100% { transform: translateX(0); opacity: 0.5; }
              50% { transform: translateX(4px); opacity: 1; }
            }
          `}</style>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-4 text-gray-600">
          Showing {strains.length.toLocaleString()} of {currentCount.toLocaleString()} strains
          {type !== 'all' && ` • ${type.charAt(0).toUpperCase() + type.slice(1)}`}
          {effect && ` • ${effect}`}
          {terpene && ` • ${terpene.charAt(0).toUpperCase() + terpene.slice(1)}`}
          {condition && ` • ${condition}`}
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
              onClick={() => { handleTypeChange('all'); setEffect(''); setTerpene(''); setCondition(''); }}
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
                <div key={strain.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden group relative">
                  {/* Favorite Button */}
                  <div className="absolute top-2 right-2 z-10">
                    <FavoriteButton entityType="STRAIN" entityId={strain.id} size="sm" />
                  </div>

                  <Link href={`/strains/${strain.slug}`}>
                    {/* Image */}
                    <div className="h-48 bg-gradient-to-br from-green-100 to-green-200 overflow-hidden">
                      <img
                        src="https://cdn.midjourney.com/69b327bd-36d7-4219-8bc6-ffd1da9dd44b/0_1.png"
                        alt={strain.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
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

                    {/* Dominant Terpene & Rating */}
                    <div className="flex items-center justify-between mt-3">
                      {(() => {
                        const dominant = getDominantTerpene(strain);
                        return dominant ? (
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <span className={`w-2 h-2 rounded-full ${dominant.color}`}></span>
                            {dominant.name}
                          </div>
                        ) : <div></div>;
                      })()}
                      {strain.rating && strain.rating > 0 && (
                        <div className="flex items-center gap-1 text-sm">
                          <span className="text-yellow-500">★</span>
                          <span className="text-gray-700">{strain.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  </Link>
                </div>
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
