'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface JournalEntry {
  id: string;
  strainName: string;
  strainType: string | null;
  productType: string;
  method: string;
  consumedAt: string;
  amount: string | null;
  duration: number | null;
  moodBefore: number | null;
  moodAfter: number | null;
  energyBefore: number | null;
  energyAfter: number | null;
  effectsPositive: string[];
  effectsNegative: string[];
  overallRating: number;
  notes: string | null;
  setting: string | null;
  activities: string[];
}

interface Stats {
  totalEntries: number;
  averageRating: number;
  topStrains: { name: string; count: number; avgRating: number }[];
  topEffects: { name: string; count: number }[];
  topMethods: { name: string; count: number }[];
  entriesByType: { name: string; count: number }[];
}

interface TerpeneScore {
  terpene: string;
  displayName: string;
  avgRating: number;
  effectivenessScore: number;
  moodImprovement: number;
  energyChange: number;
  count: number;
  topEffects: string[];
  helpsWith: string[];
  description: string;
}

interface Insight {
  type: string;
  title: string;
  description: string;
  confidence: 'high' | 'medium' | 'low';
  icon: string;
}

interface StrainRecommendation {
  id: string;
  name: string;
  slug: string;
  type: string;
  matchScore: number;
  matchReasons: string[];
  predictedRating: number;
  dominantTerpene: string;
  effects: string[];
  thcMax: number | null;
}

interface AIRecommendations {
  insights: Insight[];
  recommendations: StrainRecommendation[];
  terpeneScores: TerpeneScore[];
  entriesAnalyzed: number;
  strainsTried: number;
  message?: string;
}

const PRODUCT_TYPES = [
  { value: 'FLOWER', label: 'Flower', icon: '🌿' },
  { value: 'VAPE', label: 'Vape', icon: '💨' },
  { value: 'EDIBLE', label: 'Edible', icon: '🍪' },
  { value: 'CONCENTRATE', label: 'Concentrate', icon: '💎' },
  { value: 'TINCTURE', label: 'Tincture', icon: '💧' },
  { value: 'PRE_ROLL', label: 'Pre-Roll', icon: '🚬' },
  { value: 'TOPICAL', label: 'Topical', icon: '🧴' },
  { value: 'OTHER', label: 'Other', icon: '📦' },
];

const METHODS = [
  { value: 'SMOKE', label: 'Smoke' },
  { value: 'VAPE', label: 'Vape' },
  { value: 'EAT', label: 'Eat' },
  { value: 'SUBLINGUAL', label: 'Sublingual' },
  { value: 'TOPICAL', label: 'Topical' },
  { value: 'DAB', label: 'Dab' },
  { value: 'OTHER', label: 'Other' },
];

const POSITIVE_EFFECTS = [
  'Relaxed', 'Happy', 'Euphoric', 'Uplifted', 'Sleepy', 'Hungry', 'Creative',
  'Energetic', 'Focused', 'Talkative', 'Giggly', 'Tingly', 'Aroused'
];

const NEGATIVE_EFFECTS = [
  'Dry Mouth', 'Dry Eyes', 'Dizzy', 'Paranoid', 'Anxious', 'Headache', 'Nausea'
];

const SETTINGS = [
  { value: 'home', label: 'Home', icon: '🏠' },
  { value: 'outdoors', label: 'Outdoors', icon: '🌳' },
  { value: 'social', label: 'Social Gathering', icon: '👥' },
  { value: 'concert', label: 'Concert/Event', icon: '🎵' },
  { value: 'work', label: 'Work/Focus', icon: '💻' },
  { value: 'exercise', label: 'Exercise', icon: '🏃' },
  { value: 'other', label: 'Other', icon: '📍' },
];

const STRAIN_TYPES = [
  { value: 'SATIVA', label: 'Sativa', color: 'bg-orange-100 text-orange-700' },
  { value: 'INDICA', label: 'Indica', color: 'bg-purple-100 text-purple-700' },
  { value: 'HYBRID', label: 'Hybrid', color: 'bg-green-100 text-green-700' },
  { value: 'CBD', label: 'CBD', color: 'bg-blue-100 text-blue-700' },
];

const getTypeColor = (type: string | null) => {
  const t = STRAIN_TYPES.find(s => s.value === type);
  return t?.color || 'bg-gray-100 text-gray-700';
};

export default function JournalPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'entries' | 'insights' | 'ai'>('entries');
  const [submitting, setSubmitting] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendations | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    strainName: '',
    strainType: '',
    productType: 'FLOWER',
    method: 'SMOKE',
    amount: '',
    consumedAt: new Date().toISOString().slice(0, 16),
    duration: '',
    moodBefore: 3,
    energyBefore: 3,
    effectsPositive: [] as string[],
    effectsNegative: [] as string[],
    overallRating: 4,
    moodAfter: 3,
    energyAfter: 3,
    notes: '',
    setting: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/journal');
    } else if (status === 'authenticated') {
      fetchData();
    }
  }, [status]);

  const fetchData = async () => {
    try {
      const [entriesRes, statsRes] = await Promise.all([
        fetch('/api/journal'),
        fetch('/api/journal/stats'),
      ]);
      const entriesData = await entriesRes.json();
      const statsData = await statsRes.json();
      setEntries(entriesData.entries || []);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching journal data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAIRecommendations = async () => {
    if (aiRecommendations) return; // Already loaded
    setLoadingAI(true);
    try {
      const res = await fetch('/api/journal/recommendations');
      const data = await res.json();
      setAiRecommendations(data);
    } catch (error) {
      console.error('Error fetching AI recommendations:', error);
    } finally {
      setLoadingAI(false);
    }
  };

  // Fetch AI recommendations when tab is selected
  useEffect(() => {
    if (activeTab === 'ai' && !aiRecommendations && !loadingAI) {
      fetchAIRecommendations();
    }
  }, [activeTab]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.strainName || !formData.overallRating) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowForm(false);
        setFormData({
          strainName: '',
          strainType: '',
          productType: 'FLOWER',
          method: 'SMOKE',
          amount: '',
          consumedAt: new Date().toISOString().slice(0, 16),
          duration: '',
          moodBefore: 3,
          energyBefore: 3,
          effectsPositive: [],
          effectsNegative: [],
          overallRating: 4,
          moodAfter: 3,
          energyAfter: 3,
          notes: '',
          setting: '',
        });
        fetchData();
      }
    } catch (error) {
      console.error('Error creating entry:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this entry?')) return;

    try {
      const res = await fetch(`/api/journal/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  const toggleEffect = (effect: string, type: 'positive' | 'negative') => {
    const key = type === 'positive' ? 'effectsPositive' : 'effectsNegative';
    const current = formData[key];
    if (current.includes(effect)) {
      setFormData({ ...formData, [key]: current.filter(e => e !== effect) });
    } else {
      setFormData({ ...formData, [key]: [...current, effect] });
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading your journal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">My Cannabis Journal</h1>
              <p className="text-indigo-100">
                {entries.length === 0
                  ? 'Track your experiences and discover what works best for you'
                  : `${entries.length} session${entries.length === 1 ? '' : 's'} logged`
                }
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition flex items-center gap-2 shadow-lg"
            >
              <span className="text-xl">+</span>
              Log Session
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4 py-4">
            <button
              onClick={() => setActiveTab('entries')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                activeTab === 'entries'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Sessions ({entries.length})
            </button>
            <button
              onClick={() => setActiveTab('insights')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                activeTab === 'insights'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Insights
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition flex items-center gap-1.5 ${
                activeTab === 'ai'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 hover:from-purple-100 hover:to-pink-100'
              }`}
            >
              <span>🤖</span> AI Recommendations
            </button>
          </div>
        </div>
      </div>

      {/* Entry Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Log Session</h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  ✕
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Strain Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <span>🌿</span> What did you consume?
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Strain Name *
                    </label>
                    <input
                      type="text"
                      value={formData.strainName}
                      onChange={(e) => setFormData({ ...formData, strainName: e.target.value })}
                      placeholder="e.g., Blue Dream"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Strain Type
                    </label>
                    <select
                      value={formData.strainType}
                      onChange={(e) => setFormData({ ...formData, strainType: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Select type</option>
                      {STRAIN_TYPES.map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {PRODUCT_TYPES.map(type => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, productType: type.value })}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                          formData.productType === type.value
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <span>{type.icon}</span>
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Method
                    </label>
                    <select
                      value={formData.method}
                      onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      {METHODS.map(m => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount/Dose
                    </label>
                    <input
                      type="text"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      placeholder="e.g., 1 bowl, 10mg, 2 puffs"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Timing */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <span>⏰</span> When & Where
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.consumedAt}
                      onChange={(e) => setFormData({ ...formData, consumedAt: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="e.g., 120"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Setting
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {SETTINGS.map(s => (
                      <button
                        key={s.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, setting: s.value })}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                          formData.setting === s.value
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <span>{s.icon}</span>
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pre-Session State */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <span>📊</span> How did you feel before?
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mood: {formData.moodBefore}/5
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={formData.moodBefore}
                      onChange={(e) => setFormData({ ...formData, moodBefore: parseInt(e.target.value) })}
                      className="w-full accent-indigo-600"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>😔</span>
                      <span>😐</span>
                      <span>😊</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Energy: {formData.energyBefore}/5
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={formData.energyBefore}
                      onChange={(e) => setFormData({ ...formData, energyBefore: parseInt(e.target.value) })}
                      className="w-full accent-indigo-600"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>🔋</span>
                      <span>⚡</span>
                      <span>🚀</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Effects */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <span>✨</span> Effects experienced
                </h3>
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-2">
                    Positive Effects
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {POSITIVE_EFFECTS.map(eff => (
                      <button
                        key={eff}
                        type="button"
                        onClick={() => toggleEffect(eff, 'positive')}
                        className={`px-3 py-1.5 rounded-full text-sm transition ${
                          formData.effectsPositive.includes(eff)
                            ? 'bg-green-600 text-white'
                            : 'bg-green-50 text-green-700 hover:bg-green-100'
                        }`}
                      >
                        {eff}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-red-700 mb-2">
                    Negative Effects
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {NEGATIVE_EFFECTS.map(eff => (
                      <button
                        key={eff}
                        type="button"
                        onClick={() => toggleEffect(eff, 'negative')}
                        className={`px-3 py-1.5 rounded-full text-sm transition ${
                          formData.effectsNegative.includes(eff)
                            ? 'bg-red-600 text-white'
                            : 'bg-red-50 text-red-700 hover:bg-red-100'
                        }`}
                      >
                        {eff}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Post-Session State */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <span>🎯</span> How did you feel after?
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mood: {formData.moodAfter}/5
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={formData.moodAfter}
                      onChange={(e) => setFormData({ ...formData, moodAfter: parseInt(e.target.value) })}
                      className="w-full accent-indigo-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Energy: {formData.energyAfter}/5
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={formData.energyAfter}
                      onChange={(e) => setFormData({ ...formData, energyAfter: parseInt(e.target.value) })}
                      className="w-full accent-indigo-600"
                    />
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <span>⭐</span> Overall Rating *
                </h3>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, overallRating: star })}
                      className={`text-3xl transition ${
                        star <= formData.overallRating ? 'text-yellow-400' : 'text-gray-300'
                      } hover:scale-110`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Add any additional thoughts or observations..."
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Submit */}
              <div className="flex gap-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-6 py-3 border rounded-xl font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !formData.strainName}
                  className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'entries' && (
          entries.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📔</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Start Your Journal</h2>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Track your cannabis experiences to discover which strains, doses, and methods work best for you.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition"
              >
                Log Your First Session
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {entries.map((entry) => (
                <div key={entry.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(entry.strainType)}`}>
                          {entry.strainType || 'Unknown'}
                        </span>
                        <span className="text-gray-500 text-sm">
                          {PRODUCT_TYPES.find(p => p.value === entry.productType)?.icon}{' '}
                          {PRODUCT_TYPES.find(p => p.value === entry.productType)?.label}
                        </span>
                        <span className="text-gray-400 text-sm">
                          {new Date(entry.consumedAt).toLocaleDateString()} at{' '}
                          {new Date(entry.consumedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{entry.strainName}</h3>

                      {entry.effectsPositive.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {entry.effectsPositive.map(eff => (
                            <span key={eff} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">
                              {eff}
                            </span>
                          ))}
                        </div>
                      )}

                      {entry.effectsNegative.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {entry.effectsNegative.map(eff => (
                            <span key={eff} className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded-full">
                              {eff}
                            </span>
                          ))}
                        </div>
                      )}

                      {entry.notes && (
                        <p className="text-gray-600 text-sm mt-2">{entry.notes}</p>
                      )}

                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                        {entry.amount && <span>Dose: {entry.amount}</span>}
                        {entry.duration && <span>Duration: {entry.duration} min</span>}
                        {entry.setting && (
                          <span>
                            {SETTINGS.find(s => s.value === entry.setting)?.icon}{' '}
                            {SETTINGS.find(s => s.value === entry.setting)?.label}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 ml-4">
                      <div className="text-center">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <span
                              key={star}
                              className={star <= entry.overallRating ? 'text-yellow-400' : 'text-gray-200'}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition"
                        title="Delete entry"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {activeTab === 'insights' && (
          <div className="space-y-8">
            {stats && stats.totalEntries > 0 ? (
              <>
                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                    <div className="text-3xl font-bold text-indigo-600">{stats.totalEntries}</div>
                    <div className="text-gray-500 text-sm">Total Sessions</div>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                    <div className="text-3xl font-bold text-yellow-500">{stats.averageRating}</div>
                    <div className="text-gray-500 text-sm">Avg Rating</div>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                    <div className="text-3xl font-bold text-green-600">{stats.topStrains.length}</div>
                    <div className="text-gray-500 text-sm">Strains Tried</div>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                    <div className="text-3xl font-bold text-purple-600">{stats.topMethods.length}</div>
                    <div className="text-gray-500 text-sm">Methods Used</div>
                  </div>
                </div>

                {/* Top Strains */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold mb-4">Your Top Strains</h3>
                  <div className="space-y-3">
                    {stats.topStrains.map((strain, i) => (
                      <div key={strain.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{['🥇', '🥈', '🥉', '4️⃣', '5️⃣'][i]}</span>
                          <span className="font-medium">{strain.name}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{strain.count} session{strain.count > 1 ? 's' : ''}</span>
                          <span className="flex items-center gap-1">
                            <span className="text-yellow-400">★</span>
                            {strain.avgRating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Effects */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold mb-4">Most Experienced Effects</h3>
                  <div className="flex flex-wrap gap-2">
                    {stats.topEffects.map(effect => (
                      <div
                        key={effect.name}
                        className="px-3 py-2 bg-green-50 text-green-700 rounded-lg text-sm"
                      >
                        {effect.name} <span className="text-green-500">({effect.count})</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Consumption Methods */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold mb-4">Preferred Methods</h3>
                  <div className="space-y-2">
                    {stats.topMethods.map(method => (
                      <div key={method.name} className="flex items-center gap-3">
                        <div className="flex-1 h-8 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 rounded-full"
                            style={{ width: `${(method.count / stats.totalEntries) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-24">{method.name}</span>
                        <span className="text-sm text-gray-500 w-16 text-right">
                          {Math.round((method.count / stats.totalEntries) * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📊</div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">No Insights Yet</h2>
                <p className="text-gray-500 mb-6">
                  Log a few sessions to start seeing personalized insights and trends.
                </p>
                <button
                  onClick={() => {
                    setActiveTab('entries');
                    setShowForm(true);
                  }}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition"
                >
                  Log Your First Session
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="space-y-8">
            {loadingAI ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                <p className="mt-4 text-gray-500">Analyzing your journal data...</p>
                <p className="text-sm text-gray-400 mt-2">Finding patterns in terpenes, effects, and strains</p>
              </div>
            ) : aiRecommendations?.message ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🧬</div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Build Your Cannabis Profile</h2>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  {aiRecommendations.message}
                </p>
                <button
                  onClick={() => {
                    setActiveTab('entries');
                    setShowForm(true);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:opacity-90 transition"
                >
                  Log Your First Session
                </button>
              </div>
            ) : aiRecommendations ? (
              <>
                {/* AI Header */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">🤖</span>
                    <h2 className="text-2xl font-bold">Your Personalized Cannabis Profile</h2>
                  </div>
                  <p className="text-purple-100">
                    Based on analysis of {aiRecommendations.entriesAnalyzed} sessions across {aiRecommendations.strainsTried} strains
                  </p>
                </div>

                {/* AI Insights */}
                {aiRecommendations.insights.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <span>💡</span> Personalized Insights
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      {aiRecommendations.insights.map((insight, i) => (
                        <div
                          key={i}
                          className={`bg-white rounded-xl shadow-sm p-5 border-l-4 ${
                            insight.confidence === 'high'
                              ? 'border-l-green-500'
                              : insight.confidence === 'medium'
                              ? 'border-l-yellow-500'
                              : 'border-l-gray-300'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-2xl">{insight.icon}</span>
                            <div>
                              <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                              <span className={`inline-block mt-2 text-xs px-2 py-1 rounded-full ${
                                insight.confidence === 'high'
                                  ? 'bg-green-100 text-green-700'
                                  : insight.confidence === 'medium'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                {insight.confidence === 'high' ? 'High confidence' : insight.confidence === 'medium' ? 'Medium confidence' : 'Emerging pattern'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Terpene Profile */}
                {aiRecommendations.terpeneScores.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <span>🧬</span> Your Terpene Effectiveness Profile
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      These terpenes work best for you based on your ratings and mood improvements
                    </p>
                    <div className="space-y-4">
                      {aiRecommendations.terpeneScores.filter(t => t.count > 0).map((terp) => (
                        <div key={terp.terpene} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-lg">{terp.displayName}</span>
                              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                                {terp.count} sessions
                              </span>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-purple-600">{terp.effectivenessScore}%</div>
                              <div className="text-xs text-gray-500">effectiveness</div>
                            </div>
                          </div>

                          {/* Effectiveness Bar */}
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
                            <div
                              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
                              style={{ width: `${terp.effectivenessScore}%` }}
                            />
                          </div>

                          <p className="text-sm text-gray-600 mb-3">{terp.description}</p>

                          <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <span className="text-yellow-500">★</span>
                              <span className="text-gray-700">{terp.avgRating}/5 avg rating</span>
                            </div>
                            {terp.moodImprovement > 0 && (
                              <div className="flex items-center gap-1 text-green-600">
                                <span>↑</span>
                                <span>+{terp.moodImprovement} mood boost</span>
                              </div>
                            )}
                            {terp.topEffects.length > 0 && (
                              <div className="flex items-center gap-1">
                                <span className="text-gray-500">Effects:</span>
                                {terp.topEffects.map((eff, i) => (
                                  <span key={eff} className="text-gray-700">
                                    {eff}{i < terp.topEffects.length - 1 ? ',' : ''}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          {terp.helpsWith.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              <span className="text-xs text-gray-500">Helps with:</span>
                              {terp.helpsWith.map((symptom) => (
                                <span key={symptom} className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                                  {symptom}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Strain Recommendations */}
                {aiRecommendations.recommendations.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <span>🎯</span> Recommended Strains For You
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Based on your terpene preferences and effect patterns, you might enjoy these strains
                    </p>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {aiRecommendations.recommendations.map((strain) => (
                        <Link
                          key={strain.id}
                          href={`/strains/${strain.slug}`}
                          className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition group"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-semibold text-gray-900 group-hover:text-purple-600 transition">
                                {strain.name}
                              </h4>
                              <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                                strain.type === 'INDICA'
                                  ? 'bg-purple-100 text-purple-700'
                                  : strain.type === 'SATIVA'
                                  ? 'bg-orange-100 text-orange-700'
                                  : strain.type === 'HYBRID'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-blue-100 text-blue-700'
                              }`}>
                                {strain.type}
                              </span>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-purple-600">{strain.matchScore}%</div>
                              <div className="text-xs text-gray-500">match</div>
                            </div>
                          </div>

                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-yellow-500">★</span>
                              <span className="text-gray-600">Predicted: {strain.predictedRating}/5</span>
                            </div>

                            {strain.dominantTerpene && (
                              <div className="flex items-center gap-2">
                                <span>🧬</span>
                                <span className="text-gray-600">Dominant: {strain.dominantTerpene}</span>
                              </div>
                            )}

                            {strain.thcMax && (
                              <div className="flex items-center gap-2">
                                <span>💨</span>
                                <span className="text-gray-600">THC: up to {strain.thcMax}%</span>
                              </div>
                            )}
                          </div>

                          {strain.matchReasons.length > 0 && (
                            <div className="mt-3 pt-3 border-t">
                              {strain.matchReasons.map((reason, i) => (
                                <p key={i} className="text-xs text-green-600 flex items-center gap-1">
                                  <span>✓</span> {reason}
                                </p>
                              ))}
                            </div>
                          )}

                          {strain.effects.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-3">
                              {strain.effects.map((eff) => (
                                <span key={eff} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                  {eff}
                                </span>
                              ))}
                            </div>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Call to Action */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 text-center">
                  <h3 className="font-semibold text-gray-900 mb-2">Keep Logging to Improve Recommendations</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    The more sessions you log, the smarter your recommendations become. Our AI learns your unique preferences over time.
                  </p>
                  <button
                    onClick={() => {
                      setActiveTab('entries');
                      setShowForm(true);
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:opacity-90 transition"
                  >
                    Log Another Session
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🤖</div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">AI Recommendations</h2>
                <p className="text-gray-500 mb-6">
                  Something went wrong loading your recommendations. Please try again.
                </p>
                <button
                  onClick={() => {
                    setAiRecommendations(null);
                    fetchAIRecommendations();
                  }}
                  className="px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition"
                >
                  Retry
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
