import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// Intent categories the AI can detect
type SearchIntent =
  | 'sleep_relaxation'
  | 'energy_creativity'
  | 'pain_relief'
  | 'anxiety_stress'
  | 'focus_productivity'
  | 'social_euphoria'
  | 'appetite'
  | 'general';

// Keywords and patterns for intent detection
const INTENT_PATTERNS: Record<SearchIntent, { keywords: string[]; effects: string[]; terpenes: string[]; strainType?: string }> = {
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
  general: {
    keywords: [],
    effects: [],
    terpenes: [],
  },
};

// Detect user intent from natural language query
function detectIntent(query: string): { intent: SearchIntent; confidence: number; matchedKeywords: string[] } {
  const normalizedQuery = query.toLowerCase();
  let bestMatch: { intent: SearchIntent; score: number; keywords: string[] } = {
    intent: 'general',
    score: 0,
    keywords: []
  };

  for (const [intent, patterns] of Object.entries(INTENT_PATTERNS)) {
    if (intent === 'general') continue;

    const matchedKeywords: string[] = [];
    let score = 0;

    for (const keyword of patterns.keywords) {
      if (normalizedQuery.includes(keyword)) {
        matchedKeywords.push(keyword);
        // Longer keywords are more specific, give them more weight
        score += keyword.split(' ').length;
      }
    }

    if (score > bestMatch.score) {
      bestMatch = { intent: intent as SearchIntent, score, keywords: matchedKeywords };
    }
  }

  // Calculate confidence (0-1)
  const confidence = bestMatch.score > 0 ? Math.min(1, bestMatch.score / 3) : 0;

  return {
    intent: bestMatch.intent,
    confidence,
    matchedKeywords: bestMatch.keywords,
  };
}

// Build explanation for why these results were returned
function buildExplanation(intent: SearchIntent, matchedKeywords: string[]): string {
  const explanations: Record<SearchIntent, string> = {
    sleep_relaxation: "I found strains known for relaxation and sleep. These are typically Indica-dominant with high Myrcene and Linalool terpenes.",
    energy_creativity: "I found uplifting strains for energy and creativity. These are typically Sativa-dominant with Limonene and Pinene terpenes.",
    pain_relief: "I found strains effective for pain relief. These have high Caryophyllene (the only terpene that binds to CB2 receptors) and Myrcene.",
    anxiety_stress: "I found calming strains for anxiety and stress relief. These have Linalool (lavender-like) and Limonene for mood elevation.",
    focus_productivity: "I found clear-headed strains for focus. These are Sativa-dominant with Pinene (promotes alertness) and Limonene.",
    social_euphoria: "I found uplifting, social strains. These have mood-boosting terpenes like Limonene that promote happiness and talkativeness.",
    appetite: "I found strains known to stimulate appetite. These typically have high Myrcene content.",
    general: "Here are the top results matching your search.",
  };

  return explanations[intent];
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';

    if (!query || query.length < 2) {
      return NextResponse.json({
        error: 'Query too short',
        results: [],
      }, { status: 400 });
    }

    // Detect intent from natural language
    const { intent, confidence, matchedKeywords } = detectIntent(query);
    const patterns = INTENT_PATTERNS[intent];

    // Build the database query based on intent
    let strains;

    if (intent !== 'general' && confidence > 0.3) {
      // AI-powered search based on intent
      const whereClause: any = {
        isActive: true,
      };

      // Filter by strain type if specified
      if (patterns.strainType) {
        whereClause.type = patterns.strainType;
      }

      // Build terpene filters - strains should have at least one of the recommended terpenes
      if (patterns.terpenes.length > 0) {
        whereClause.OR = patterns.terpenes.map(terp => ({
          [terp]: { gte: 0.2 }
        }));
      }

      strains = await prisma.strain.findMany({
        where: whereClause,
        orderBy: [
          { rating: 'desc' },
          { reviewsCount: 'desc' },
        ],
        take: 12,
        select: {
          id: true,
          name: true,
          slug: true,
          type: true,
          effects: true,
          rating: true,
          reviewsCount: true,
          thcMax: true,
          cbdMax: true,
          description: true,
          terpMyrcene: true,
          terpLimonene: true,
          terpCaryophyllene: true,
          terpPinene: true,
          terpLinalool: true,
        },
      });

      // Score and sort results by how well they match the intent
      strains = strains.map(strain => {
        let matchScore = 50; // Base score
        const matchReasons: string[] = [];

        // Check effect matches
        const strainEffects = strain.effects || [];
        patterns.effects.forEach(effect => {
          if (strainEffects.includes(effect)) {
            matchScore += 15;
            matchReasons.push(`Produces "${effect}" effect`);
          }
        });

        // Check terpene matches
        patterns.terpenes.forEach(terp => {
          const terpValue = strain[terp as keyof typeof strain] as number | null;
          if (terpValue && terpValue > 0.3) {
            matchScore += 10;
            const terpName = terp.replace('terp', '');
            matchReasons.push(`High in ${terpName}`);
          }
        });

        // Bonus for high rating
        if (strain.rating && strain.rating >= 4.5) {
          matchScore += 5;
        }

        return {
          ...strain,
          matchScore: Math.min(100, matchScore),
          matchReasons: matchReasons.slice(0, 3),
        };
      }).sort((a, b) => b.matchScore - a.matchScore);

    } else {
      // Fallback to keyword search
      strains = await prisma.strain.findMany({
        where: {
          isActive: true,
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        orderBy: [
          { rating: 'desc' },
          { reviewsCount: 'desc' },
        ],
        take: 12,
        select: {
          id: true,
          name: true,
          slug: true,
          type: true,
          effects: true,
          rating: true,
          reviewsCount: true,
          thcMax: true,
          cbdMax: true,
          description: true,
        },
      });

      strains = strains.map(strain => ({
        ...strain,
        matchScore: 70,
        matchReasons: ['Matches your search'],
      }));
    }

    // Build response
    const explanation = buildExplanation(intent, matchedKeywords);

    return NextResponse.json({
      query,
      intent,
      confidence,
      explanation,
      results: strains,
      totalResults: strains.length,
      aiPowered: intent !== 'general' && confidence > 0.3,
    });

  } catch (error) {
    console.error('AI Search error:', error);
    return NextResponse.json({
      error: 'Search failed',
      results: [],
    }, { status: 500 });
  }
}
