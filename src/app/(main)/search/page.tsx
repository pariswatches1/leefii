import { Metadata } from 'next'
import Link from 'next/link'
import { headers } from 'next/headers'
import prisma from '@/lib/prisma'
import { Sparkles, MapPin } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Search | Leefii',
  description: 'Search for cannabis dispensaries, strains, and cities across all 51 states on Leefii.',
  alternates: {
    canonical: 'https://leefii.com/search',
  },
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
}

type Props = {
  searchParams: { q?: string; ai?: string; lat?: string; lng?: string }
}

// Default location for development (Miami, FL)
const DEV_DEFAULT_LOCATION = { lat: 25.7617, lng: -80.1918, city: 'Miami', state: 'Florida' }

// Get location from IP address
async function getLocationFromIP(): Promise<{ lat: number; lng: number; city: string; state: string } | null> {
  try {
    const headersList = await headers()
    const forwardedFor = headersList.get('x-forwarded-for')
    const realIp = headersList.get('x-real-ip')
    const ip = forwardedFor?.split(',')[0]?.trim() || realIp || ''

    // On localhost/development, IP lookup won't work - use default
    const isLocalhost = !ip || ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.')

    // Try ipapi.co first
    try {
      const response = await fetch(
        ip ? `https://ipapi.co/${ip}/json/` : 'https://ipapi.co/json/',
        { next: { revalidate: 3600 }, headers: { 'User-Agent': 'Leefii/1.0' } }
      )
      const data = await response.json()
      if (!data.error && data.city && data.latitude && data.longitude) {
        return { lat: data.latitude, lng: data.longitude, city: data.city, state: data.region || '' }
      }
    } catch { /* continue to fallback */ }

    // Fallback to ip-api.com
    try {
      const fallbackUrl = ip
        ? `http://ip-api.com/json/${ip}?fields=city,regionName,lat,lon`
        : 'http://ip-api.com/json/?fields=city,regionName,lat,lon'
      const response = await fetch(fallbackUrl)
      const data = await response.json()
      if (data.city && data.lat && data.lon) {
        return { lat: data.lat, lng: data.lon, city: data.city, state: data.regionName || '' }
      }
    } catch { /* both failed */ }

    // Fallback to default location for development
    if (isLocalhost || process.env.NODE_ENV === 'development') {
      return DEV_DEFAULT_LOCATION
    }

    return null
  } catch {
    return null
  }
}

// Calculate distance between two points (Haversine formula)
function calculateDistance(lat1: number, lon1: number, lat2: number | null, lon2: number | null): number {
  if (lat2 === null || lon2 === null) return Infinity
  const R = 3959 // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Navigation intent patterns - for queries like "dispensaries", "doctors"
const NAV_INTENT_PATTERNS: Record<string, string[]> = {
  dispensaries: ['dispensary', 'dispensaries', 'shop', 'shops', 'store', 'stores', 'near me', 'nearby'],
  doctors: ['doctor', 'doctors', 'physician', 'clinic', 'medical card', 'mmj card'],
  strains: ['strain', 'strains'],
  deals: ['deal', 'deals', 'discount', 'sale'],
}

function detectNavIntent(query: string): string | null {
  const normalizedQuery = query.toLowerCase().trim()
  for (const [intent, patterns] of Object.entries(NAV_INTENT_PATTERNS)) {
    for (const pattern of patterns) {
      if (normalizedQuery === pattern || normalizedQuery.includes(pattern)) {
        return intent
      }
    }
  }
  return null
}

// AI search intent patterns (same as API)
const INTENT_PATTERNS: Record<string, { keywords: string[]; effects: string[]; terpenes: string[]; strainType?: string }> = {
  sleep_relaxation: {
    keywords: ['sleep', 'insomnia', 'relax', 'relaxing', 'calm', 'chill', 'wind down', 'bedtime', 'night', 'rest', 'sedating', 'couch lock'],
    effects: ['Relaxed', 'Sleepy', 'Calm'],
    terpenes: ['terpMyrcene', 'terpLinalool'],
    strainType: 'INDICA',
  },
  energy_creativity: {
    keywords: ['energy', 'energetic', 'creative', 'creativity', 'daytime', 'morning', 'productive', 'motivation', 'uplifting', 'active'],
    effects: ['Energetic', 'Creative', 'Uplifted', 'Focused'],
    terpenes: ['terpLimonene', 'terpPinene', 'terpTerpinolene'],
    strainType: 'SATIVA',
  },
  pain_relief: {
    keywords: ['pain', 'chronic pain', 'headache', 'migraine', 'inflammation', 'arthritis', 'muscle', 'back pain', 'relief'],
    effects: ['Relaxed'],
    terpenes: ['terpCaryophyllene', 'terpMyrcene'],
  },
  anxiety_stress: {
    keywords: ['anxiety', 'stress', 'anxious', 'nervous', 'panic', 'worry', 'tension', 'calm down', 'relieve stress'],
    effects: ['Relaxed', 'Calm', 'Happy'],
    terpenes: ['terpLinalool', 'terpLimonene', 'terpCaryophyllene'],
  },
  focus_productivity: {
    keywords: ['focus', 'concentration', 'productive', 'work', 'study', 'alert', 'clear headed', 'mental clarity'],
    effects: ['Focused', 'Energetic', 'Creative'],
    terpenes: ['terpPinene', 'terpLimonene'],
    strainType: 'SATIVA',
  },
  social_euphoria: {
    keywords: ['social', 'party', 'happy', 'euphoria', 'euphoric', 'giggly', 'talkative', 'fun', 'friends', 'laugh'],
    effects: ['Happy', 'Euphoric', 'Talkative', 'Giggly', 'Uplifted'],
    terpenes: ['terpLimonene', 'terpTerpinolene'],
  },
  appetite: {
    keywords: ['appetite', 'hungry', 'munchies', 'eat', 'food', 'nausea'],
    effects: ['Hungry'],
    terpenes: ['terpMyrcene'],
  },
}

const EXPLANATIONS: Record<string, string> = {
  sleep_relaxation: "I found strains known for relaxation and sleep. These are typically Indica-dominant with high Myrcene and Linalool terpenes.",
  energy_creativity: "I found uplifting strains for energy and creativity. These are typically Sativa-dominant with Limonene and Pinene terpenes.",
  pain_relief: "I found strains effective for pain relief. These have high Caryophyllene (the only terpene that binds to CB2 receptors) and Myrcene.",
  anxiety_stress: "I found calming strains for anxiety and stress relief. These have Linalool (lavender-like) and Limonene for mood elevation.",
  focus_productivity: "I found clear-headed strains for focus. These are Sativa-dominant with Pinene (promotes alertness) and Limonene.",
  social_euphoria: "I found uplifting, social strains. These have mood-boosting terpenes like Limonene that promote happiness and talkativeness.",
  appetite: "I found strains known to stimulate appetite. These typically have high Myrcene content.",
  general: "Here are the top results matching your search.",
}

function detectIntent(query: string): { intent: string; confidence: number } {
  const normalizedQuery = query.toLowerCase()
  let bestMatch = { intent: 'general', score: 0 }

  for (const [intent, patterns] of Object.entries(INTENT_PATTERNS)) {
    let score = 0
    for (const keyword of patterns.keywords) {
      if (normalizedQuery.includes(keyword)) {
        score += keyword.split(' ').length
      }
    }
    if (score > bestMatch.score) {
      bestMatch = { intent, score }
    }
  }

  return { intent: bestMatch.intent, confidence: bestMatch.score > 0 ? Math.min(1, bestMatch.score / 3) : 0 }
}

export default async function SearchPage({ searchParams }: Props) {
  // Sanitize query: ignore Google's literal placeholder from SearchAction schema
  const rawQuery = searchParams.q || ''
  const query = rawQuery === '{search_term_string}' ? '' : rawQuery
  const aiMode = searchParams.ai === '1'

  // Get user location from params or IP
  let userLat: number | null = searchParams.lat ? parseFloat(searchParams.lat) : null
  let userLng: number | null = searchParams.lng ? parseFloat(searchParams.lng) : null
  let userLocation: { city: string; state: string } | null = null

  // Try to get location from IP if not provided
  if (!userLat || !userLng) {
    const ipLocation = await getLocationFromIP()
    if (ipLocation) {
      userLat = ipLocation.lat
      userLng = ipLocation.lng
      userLocation = { city: ipLocation.city, state: ipLocation.state }
    }
  }

  let dispensaries: any[] = []
  let cities: any[] = []
  let strains: any[] = []
  let aiIntent = ''
  let aiExplanation = ''
  let aiPowered = false

  if (query.length >= 2) {
    if (aiMode) {
      // AI-powered search
      const { intent, confidence } = detectIntent(query)

      if (intent !== 'general' && confidence > 0.3) {
        aiPowered = true
        aiIntent = intent
        aiExplanation = EXPLANATIONS[intent]
        const patterns = INTENT_PATTERNS[intent]

        // Build query for AI search
        const whereClause: any = { isActive: true }

        if (patterns.strainType) {
          whereClause.type = patterns.strainType
        }

        if (patterns.terpenes.length > 0) {
          whereClause.OR = patterns.terpenes.map(terp => ({
            [terp]: { gte: 0.2 }
          }))
        }

        strains = await prisma.strain.findMany({
          where: whereClause,
          orderBy: [{ rating: 'desc' }, { reviewsCount: 'desc' }],
          take: 12,
        })

        // Score strains by match quality
        strains = strains.map(strain => {
          let matchScore = 50
          const matchReasons: string[] = []

          patterns.effects.forEach(effect => {
            if (strain.effects?.includes(effect)) {
              matchScore += 15
              matchReasons.push(`"${effect}" effect`)
            }
          })

          patterns.terpenes.forEach(terp => {
            const terpValue = strain[terp as keyof typeof strain] as number | null
            if (terpValue && terpValue > 0.3) {
              matchScore += 10
              matchReasons.push(`High ${terp.replace('terp', '')}`)
            }
          })

          if (strain.rating && strain.rating >= 4.5) matchScore += 5

          return { ...strain, matchScore: Math.min(100, matchScore), matchReasons: matchReasons.slice(0, 3) }
        }).sort((a: any, b: any) => b.matchScore - a.matchScore)

      } else {
        // Fallback to regular search with AI flag
        aiExplanation = "I couldn't detect a specific need from your query. Here are the best matches:"

        strains = await prisma.strain.findMany({
          where: {
            isActive: true,
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
            ],
          },
          orderBy: [{ rating: 'desc' }],
          take: 12,
        })
      }
    } else {
      // Regular search - check for navigation intent first
      const navIntent = detectNavIntent(query)

      if (navIntent === 'dispensaries') {
        // User wants to browse dispensaries - get nearby if we have location
        if (userLat && userLng && userLocation?.state) {
          // Get dispensaries within user's state, sorted by distance
          const rawDispensaries = await prisma.dispensary.findMany({
            where: {
              isActive: true,
              state: { name: userLocation.state },
            },
            include: { city: true, state: true },
            take: 200,
          })

          // Sort by distance
          dispensaries = rawDispensaries
            .map(d => ({
              ...d,
              distance: calculateDistance(userLat!, userLng!, d.latitude, d.longitude)
            }))
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 50)
        } else {
          // No location - show popular dispensaries
          dispensaries = await prisma.dispensary.findMany({
            where: { isActive: true },
            include: { city: true, state: true },
            take: 50,
            orderBy: [
              { isPremium: 'desc' },
              { rating: 'desc' },
              { reviewsCount: 'desc' },
            ]
          })
        }
      } else if (navIntent === 'strains') {
        // User wants to browse strains
        strains = await prisma.strain.findMany({
          where: { isActive: true },
          take: 50,
          orderBy: [
            { rating: 'desc' },
            { reviewsCount: 'desc' },
          ]
        })
      } else {
        // Standard text search - filter by state if we have location
        const stateFilter = userLocation?.state ? { state: { name: userLocation.state } } : {}

        dispensaries = await prisma.dispensary.findMany({
          where: {
            isActive: true,
            ...stateFilter,
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { address: { contains: query, mode: 'insensitive' } },
              { chainName: { contains: query, mode: 'insensitive' } },
            ]
          },
          include: { city: true, state: true },
          take: 20,
          orderBy: { rating: 'desc' }
        })

        cities = await prisma.city.findMany({
          where: { name: { contains: query, mode: 'insensitive' } },
          include: { state: true, _count: { select: { dispensaries: true } } },
          take: 10,
          orderBy: { dispensaryCount: 'desc' }
        })

        strains = await prisma.strain.findMany({
          where: {
            isActive: true,
            name: { contains: query, mode: 'insensitive' }
          },
          take: 20,
          orderBy: { name: 'asc' }
        })
      }
    }
  }

  const hasResults = dispensaries.length > 0 || cities.length > 0 || strains.length > 0

  return (
    <div>
      {/* Search Header */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {aiMode ? (
              <span className="flex items-center gap-2">
                <Sparkles className="w-8 h-8 text-lime-600" />
                AI Search
              </span>
            ) : 'Search'}
          </h1>

          <form action="/search" method="GET" className="max-w-2xl">
            <div className="flex gap-3">
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder={aiMode ? "Describe what you're looking for..." : "Search dispensaries, strains, cities..."}
                className={`flex-1 px-5 py-3 border rounded-xl text-lg focus:outline-none focus:ring-2 ${
                  aiMode
                    ? 'border-lime-300 focus:ring-lime-500 focus:border-lime-500'
                    : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                }`}
                autoComplete="off"
                autoFocus
              />
              {aiMode && <input type="hidden" name="ai" value="1" />}
              <button
                type="submit"
                className={`px-6 py-3 rounded-xl font-semibold transition-colors ${
                  aiMode
                    ? 'bg-gradient-to-r from-lime-600 to-green-600 hover:from-lime-700 hover:to-green-700 text-white'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                }`}
              >
                {aiMode ? '✨ Search' : 'Search'}
              </button>
            </div>
            <div className="mt-3 flex gap-4">
              <Link
                href={`/search?q=${encodeURIComponent(query)}`}
                className={`text-sm ${!aiMode ? 'text-primary-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Regular Search
              </Link>
              <Link
                href={`/search?q=${encodeURIComponent(query)}&ai=1`}
                className={`text-sm flex items-center gap-1 ${aiMode ? 'text-lime-600 font-medium' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Sparkles className="w-4 h-4" />
                AI Search
              </Link>
            </div>
          </form>
        </div>
      </section>

      {/* Results */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* AI Explanation */}
          {aiMode && query.length > 0 && (
            <div className="mb-6 p-4 bg-gradient-to-r from-lime-50 to-green-50 border border-lime-200 rounded-xl">
              <div className="flex items-start gap-3">
                <Sparkles className="w-6 h-6 text-lime-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-lime-800 font-medium">AI Analysis</p>
                  <p className="text-lime-700 text-sm mt-1">{aiExplanation}</p>
                </div>
              </div>
            </div>
          )}

          {query.length > 0 && !aiMode && (
            <p className="text-gray-600 mb-6">
              {hasResults
                ? `Showing results for "${query}"`
                : `No results found for "${query}"`
              }
            </p>
          )}

          {/* AI Strain Results */}
          {aiMode && strains.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-lime-600" />
                Recommended Strains
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {strains.map((strain: any) => (
                  <Link
                    key={strain.id}
                    href={`/strains/${strain.slug}`}
                    className="block p-4 bg-white border border-gray-200 rounded-xl hover:border-lime-500 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="font-semibold text-gray-900 hover:text-lime-600">{strain.name}</div>
                      {strain.matchScore && (
                        <span className="text-xs bg-lime-100 text-lime-700 px-2 py-1 rounded-full font-medium">
                          {strain.matchScore}% match
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                        strain.type === 'SATIVA' ? 'bg-yellow-100 text-yellow-800' :
                        strain.type === 'INDICA' ? 'bg-purple-100 text-purple-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {strain.type}
                      </span>
                      {strain.rating && (
                        <span className="ml-2">★ {strain.rating.toFixed(1)}</span>
                      )}
                      {strain.thcMax && <span className="ml-2">THC: {strain.thcMax}%</span>}
                    </div>
                    {strain.matchReasons && strain.matchReasons.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {strain.matchReasons.map((reason: string, i: number) => (
                          <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                            {reason}
                          </span>
                        ))}
                      </div>
                    )}
                    {strain.effects && strain.effects.length > 0 && (
                      <div className="mt-2 text-xs text-gray-500">
                        Effects: {strain.effects.slice(0, 3).join(', ')}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Regular Strains Results */}
          {!aiMode && strains.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Strains</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {strains.map((strain) => (
                  <Link
                    key={strain.id}
                    href={`/strains/${strain.slug}`}
                    className="block p-4 bg-white border border-gray-200 rounded-xl hover:border-primary-500 hover:shadow transition-all"
                  >
                    <div className="font-semibold text-gray-900 hover:text-primary-600">{strain.name}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                        strain.type === 'SATIVA' ? 'bg-yellow-100 text-yellow-800' :
                        strain.type === 'INDICA' ? 'bg-purple-100 text-purple-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {strain.type}
                      </span>
                      {strain.thcContent && <span className="ml-2">THC: {strain.thcContent}%</span>}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* City Results */}
          {!aiMode && cities.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Cities</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cities.map((city) => (
                  <Link
                    key={city.id}
                    href={`/dispensaries/${city.state.slug}/${city.slug}`}
                    className="block p-4 bg-white border border-gray-200 rounded-xl hover:border-primary-500 hover:shadow transition-all"
                  >
                    <div className="font-semibold text-gray-900">{city.name}</div>
                    <div className="text-sm text-gray-500">
                      {city.state.name} | {city._count.dispensaries} dispensaries
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Dispensary Results */}
          {!aiMode && dispensaries.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                Dispensaries
                {userLocation && (
                  <span className="text-sm font-normal text-gray-500 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    near {userLocation.city}, {userLocation.state}
                  </span>
                )}
              </h2>
              <div className="space-y-4">
                {dispensaries.map((dispensary) => (
                  <Link
                    key={dispensary.id}
                    href={`/dispensary/${dispensary.slug}`}
                    className="block p-5 bg-white border border-gray-200 rounded-xl hover:border-primary-500 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-lg font-semibold text-gray-900 hover:text-primary-600">
                          {dispensary.name}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {dispensary.address}, {dispensary.city.name}, {dispensary.state.abbreviation} {dispensary.zipCode}
                        </div>
                        {dispensary.phone && (
                          <div className="text-sm text-gray-500 mt-1">{dispensary.phone}</div>
                        )}
                        {dispensary.distance !== undefined && (
                          <div className="text-sm text-lime-600 font-medium mt-1">
                            {dispensary.distance.toFixed(1)} miles away
                          </div>
                        )}
                      </div>
                      {dispensary.rating > 0 && (
                        <div className="text-right">
                          <div className="inline-flex items-center px-2 py-1 bg-yellow-50 rounded-lg">
                            <span className="text-yellow-500">★</span>
                            <span className="ml-1 font-semibold">{dispensary.rating.toFixed(1)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {query.length > 0 && !hasResults && (
            <div className="text-center py-16 bg-gray-50 rounded-xl">
              <div className="text-5xl mb-4">{aiMode ? '🤖' : '🔍'}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600 mb-6">
                {aiMode
                  ? "Try describing what you're looking for differently, like 'something relaxing for evening' or 'energetic daytime strain'"
                  : "Try searching for a different city or dispensary name."
                }
              </p>
              {!aiMode && (
                <Link
                  href={`/search?q=${encodeURIComponent(query)}&ai=1`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-lime-600 to-green-600 text-white rounded-xl font-semibold hover:from-lime-700 hover:to-green-700 transition-colors"
                >
                  <Sparkles className="w-5 h-5" />
                  Try AI Search
                </Link>
              )}
            </div>
          )}

          {/* Empty State */}
          {query.length === 0 && (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">{aiMode ? '✨' : '🔍'}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {aiMode ? 'AI-Powered Search' : 'Search for dispensaries'}
              </h3>
              <p className="text-gray-600">
                {aiMode
                  ? "Describe what you're looking for in natural language. Example: 'something to help me sleep' or 'uplifting strain for creativity'"
                  : 'Enter a city name or dispensary to get started.'
                }
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
