import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

// Terpene to effect mapping based on research
const TERPENE_EFFECTS: Record<string, { positive: string[]; medical: string[]; description: string }> = {
  terpMyrcene: {
    positive: ['Relaxed', 'Sleepy', 'Calm'],
    medical: ['Insomnia', 'Anxiety', 'Chronic Pain', 'Inflammation'],
    description: 'Myrcene is known for its sedating, relaxing effects. It enhances THC absorption and is great for evening use.',
  },
  terpLimonene: {
    positive: ['Happy', 'Uplifted', 'Euphoric', 'Energetic'],
    medical: ['Depression', 'Anxiety', 'Stress'],
    description: 'Limonene elevates mood and relieves stress. Its citrusy profile provides an uplifting, energizing experience.',
  },
  terpCaryophyllene: {
    positive: ['Relaxed', 'Calm'],
    medical: ['Chronic Pain', 'Inflammation', 'Arthritis', 'Anxiety'],
    description: 'Caryophyllene is the only terpene that binds to CB2 receptors, making it powerful for pain and inflammation relief.',
  },
  terpPinene: {
    positive: ['Focused', 'Creative', 'Energetic', 'Alert'],
    medical: ['Inflammation', 'Asthma'],
    description: 'Pinene promotes alertness and memory retention. It counteracts some THC effects and aids focus.',
  },
  terpLinalool: {
    positive: ['Relaxed', 'Calm', 'Sleepy'],
    medical: ['Anxiety', 'Depression', 'Insomnia', 'Stress'],
    description: 'Linalool has calming, anti-anxiety properties. Its lavender-like aroma promotes relaxation and sleep.',
  },
  terpHumulene: {
    positive: ['Relaxed', 'Calm'],
    medical: ['Inflammation', 'Appetite Loss'],
    description: 'Humulene is an appetite suppressant with anti-inflammatory properties. Good for those avoiding the munchies.',
  },
  terpTerpinolene: {
    positive: ['Uplifted', 'Happy', 'Creative', 'Energetic'],
    medical: ['Anxiety', 'Insomnia'],
    description: 'Terpinolene provides uplifting, creative effects despite sedative properties at high doses.',
  },
  terpOcimene: {
    positive: ['Uplifted', 'Energetic'],
    medical: ['Inflammation', 'Congestion'],
    description: 'Ocimene offers sweet, herbal notes with decongestant and antiviral properties.',
  },
};

// Effect categories for analysis
const EFFECT_CATEGORIES = {
  relaxation: ['Relaxed', 'Calm', 'Sleepy', 'Tingly'],
  energy: ['Energetic', 'Uplifted', 'Creative', 'Focused', 'Talkative'],
  mood: ['Happy', 'Euphoric', 'Giggly'],
  physical: ['Hungry', 'Aroused'],
};

interface JournalEntryWithStrain {
  id: string;
  strainName: string;
  strainType: string | null;
  effectsPositive: string[];
  effectsNegative: string[];
  overallRating: number;
  moodBefore: number | null;
  moodAfter: number | null;
  energyBefore: number | null;
  energyAfter: number | null;
  symptomsBefore: string[];
  symptomsAfter: string[];
  consumedAt: Date;
  strain?: {
    terpMyrcene: number | null;
    terpLimonene: number | null;
    terpCaryophyllene: number | null;
    terpPinene: number | null;
    terpLinalool: number | null;
    terpHumulene: number | null;
    terpTerpinolene: number | null;
    terpOcimene: number | null;
    type: string;
    effects: string[];
  } | null;
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
  type: 'terpene' | 'strain_type' | 'timing' | 'effect' | 'medical';
  title: string;
  description: string;
  confidence: 'high' | 'medium' | 'low';
  icon: string;
  data?: Record<string, unknown>;
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

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Get user's journal entries with strain data
    const entries = await prisma.journalEntry.findMany({
      where: { userId },
      orderBy: { consumedAt: 'desc' },
      take: 100, // Analyze last 100 entries
    });

    if (entries.length < 2) {
      return NextResponse.json({
        insights: [],
        recommendations: [],
        terpeneScores: [],
        message: 'Log at least 2 journal entries to get personalized AI recommendations.',
        entriesAnalyzed: entries.length,
      });
    }

    // Get strain data for entries that have strainId
    const strainIds = entries.filter(e => e.strainId).map(e => e.strainId as string);
    const strains = await prisma.strain.findMany({
      where: { id: { in: strainIds } },
      select: {
        id: true,
        name: true,
        type: true,
        effects: true,
        terpMyrcene: true,
        terpLimonene: true,
        terpCaryophyllene: true,
        terpPinene: true,
        terpLinalool: true,
        terpHumulene: true,
        terpTerpinolene: true,
        terpOcimene: true,
      },
    });

    const strainMap = new Map(strains.map(s => [s.id, s]));

    // Enrich entries with strain data
    const enrichedEntries: JournalEntryWithStrain[] = entries.map(entry => ({
      ...entry,
      strain: entry.strainId ? strainMap.get(entry.strainId) || null : null,
    }));

    // Analyze terpene correlations
    const terpeneScores = analyzeTerpeneCorrelations(enrichedEntries);

    // Generate insights
    const insights = generateInsights(enrichedEntries, terpeneScores);

    // Get strain recommendations based on analysis
    const recommendations = await getStrainRecommendations(terpeneScores, enrichedEntries, userId);

    return NextResponse.json({
      insights,
      recommendations,
      terpeneScores: terpeneScores.slice(0, 5), // Top 5 terpenes
      entriesAnalyzed: entries.length,
      strainsTried: new Set(entries.map(e => e.strainName)).size,
    });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return NextResponse.json({ error: 'Failed to generate recommendations' }, { status: 500 });
  }
}

function analyzeTerpeneCorrelations(entries: JournalEntryWithStrain[]): TerpeneScore[] {
  const terpeneData: Record<string, {
    ratings: number[];
    moodChanges: number[];
    energyChanges: number[];
    effects: string[];
    symptoms: string[];
  }> = {};

  // Initialize terpene tracking
  const terpeneKeys = Object.keys(TERPENE_EFFECTS);
  terpeneKeys.forEach(key => {
    terpeneData[key] = {
      ratings: [],
      moodChanges: [],
      energyChanges: [],
      effects: [],
      symptoms: [],
    };
  });

  // Analyze each entry
  entries.forEach(entry => {
    if (!entry.strain) return;

    const strain = entry.strain;
    const moodChange = (entry.moodAfter || 3) - (entry.moodBefore || 3);
    const energyChange = (entry.energyAfter || 3) - (entry.energyBefore || 3);

    // Track data for each terpene present in the strain
    terpeneKeys.forEach(key => {
      const terpValue = strain[key as keyof typeof strain] as number | null;
      if (terpValue && terpValue > 0.1) { // Only count if terpene is significant
        terpeneData[key].ratings.push(entry.overallRating);
        terpeneData[key].moodChanges.push(moodChange);
        terpeneData[key].energyChanges.push(energyChange);
        terpeneData[key].effects.push(...entry.effectsPositive);

        // Track symptom relief
        const relievedSymptoms = entry.symptomsBefore.filter(
          s => !entry.symptomsAfter.includes(s)
        );
        terpeneData[key].symptoms.push(...relievedSymptoms);
      }
    });
  });

  // Calculate scores
  const scores: TerpeneScore[] = terpeneKeys.map(key => {
    const data = terpeneData[key];
    const count = data.ratings.length;

    if (count === 0) {
      return {
        terpene: key,
        displayName: formatTerpene(key),
        avgRating: 0,
        effectivenessScore: 0,
        moodImprovement: 0,
        energyChange: 0,
        count: 0,
        topEffects: [],
        helpsWith: [],
        description: TERPENE_EFFECTS[key].description,
      };
    }

    const avgRating = data.ratings.reduce((a, b) => a + b, 0) / count;
    const avgMood = data.moodChanges.reduce((a, b) => a + b, 0) / count;
    const avgEnergy = data.energyChanges.reduce((a, b) => a + b, 0) / count;

    // Count effect frequency
    const effectCounts: Record<string, number> = {};
    data.effects.forEach(eff => {
      effectCounts[eff] = (effectCounts[eff] || 0) + 1;
    });
    const topEffects = Object.entries(effectCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([eff]) => eff);

    // Count symptom relief frequency
    const symptomCounts: Record<string, number> = {};
    data.symptoms.forEach(sym => {
      symptomCounts[sym] = (symptomCounts[sym] || 0) + 1;
    });
    const helpsWith = Object.entries(symptomCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([sym]) => sym);

    // Calculate effectiveness score (0-100)
    const effectivenessScore = Math.min(100, Math.round(
      (avgRating / 5) * 40 + // Rating contribution
      (Math.max(0, avgMood) / 2) * 30 + // Mood improvement contribution
      (count / entries.length) * 30 // Consistency contribution
    ));

    return {
      terpene: key,
      displayName: formatTerpene(key),
      avgRating: Math.round(avgRating * 10) / 10,
      effectivenessScore,
      moodImprovement: Math.round(avgMood * 10) / 10,
      energyChange: Math.round(avgEnergy * 10) / 10,
      count,
      topEffects,
      helpsWith,
      description: TERPENE_EFFECTS[key].description,
    };
  });

  // Sort by effectiveness score
  return scores.sort((a, b) => b.effectivenessScore - a.effectivenessScore);
}

function generateInsights(entries: JournalEntryWithStrain[], terpeneScores: TerpeneScore[]): Insight[] {
  const insights: Insight[] = [];

  // Top terpene insight
  const topTerpene = terpeneScores.find(t => t.count >= 1);
  if (topTerpene && topTerpene.effectivenessScore > 30) {
    insights.push({
      type: 'terpene',
      title: `${topTerpene.displayName} Works Best For You`,
      description: `Based on ${topTerpene.count} sessions, strains high in ${topTerpene.displayName} give you an average rating of ${topTerpene.avgRating}/5 stars. ${topTerpene.description}`,
      confidence: topTerpene.count >= 10 ? 'high' : topTerpene.count >= 5 ? 'medium' : 'low',
      icon: '🧬',
      data: { terpene: topTerpene.terpene, score: topTerpene.effectivenessScore },
    });
  }

  // Mood improvement insight
  const moodBooster = terpeneScores.find(t => t.moodImprovement > 0.3 && t.count >= 1);
  if (moodBooster) {
    insights.push({
      type: 'terpene',
      title: `${moodBooster.displayName} Boosts Your Mood`,
      description: `When you consume strains with ${moodBooster.displayName}, your mood improves by +${moodBooster.moodImprovement} points on average. Look for strains with this terpene when feeling down.`,
      confidence: moodBooster.count >= 5 ? 'high' : 'medium',
      icon: '😊',
    });
  }

  // Strain type analysis
  const typeRatings: Record<string, { total: number; count: number }> = {};
  entries.forEach(entry => {
    const type = entry.strainType || entry.strain?.type;
    if (type) {
      if (!typeRatings[type]) typeRatings[type] = { total: 0, count: 0 };
      typeRatings[type].total += entry.overallRating;
      typeRatings[type].count++;
    }
  });

  const typeScores = Object.entries(typeRatings)
    .map(([type, data]) => ({ type, avg: data.total / data.count, count: data.count }))
    .filter(t => t.count >= 1)
    .sort((a, b) => b.avg - a.avg);

  if (typeScores.length > 0 && typeScores[0].avg >= 4) {
    insights.push({
      type: 'strain_type',
      title: `You Prefer ${typeScores[0].type} Strains`,
      description: `Your average rating for ${typeScores[0].type} strains is ${typeScores[0].avg.toFixed(1)}/5 across ${typeScores[0].count} sessions. Consider focusing your exploration here.`,
      confidence: typeScores[0].count >= 10 ? 'high' : 'medium',
      icon: typeScores[0].type === 'INDICA' ? '🌙' : typeScores[0].type === 'SATIVA' ? '☀️' : '🌿',
    });
  }

  // Time of day analysis
  const hourRatings: Record<string, { total: number; count: number }> = {
    morning: { total: 0, count: 0 },
    afternoon: { total: 0, count: 0 },
    evening: { total: 0, count: 0 },
    night: { total: 0, count: 0 },
  };

  entries.forEach(entry => {
    const hour = new Date(entry.consumedAt).getHours();
    let period: string;
    if (hour >= 5 && hour < 12) period = 'morning';
    else if (hour >= 12 && hour < 17) period = 'afternoon';
    else if (hour >= 17 && hour < 21) period = 'evening';
    else period = 'night';

    hourRatings[period].total += entry.overallRating;
    hourRatings[period].count++;
  });

  const bestTime = Object.entries(hourRatings)
    .filter(([, data]) => data.count >= 1)
    .sort((a, b) => (b[1].total / b[1].count) - (a[1].total / a[1].count))[0];

  if (bestTime && (bestTime[1].total / bestTime[1].count) >= 4) {
    insights.push({
      type: 'timing',
      title: `${bestTime[0].charAt(0).toUpperCase() + bestTime[0].slice(1)} Sessions Work Best`,
      description: `Your ${bestTime[0]} sessions average ${(bestTime[1].total / bestTime[1].count).toFixed(1)}/5 stars. Your body may respond better to cannabis during this time.`,
      confidence: bestTime[1].count >= 10 ? 'high' : 'medium',
      icon: bestTime[0] === 'morning' ? '🌅' : bestTime[0] === 'afternoon' ? '☀️' : bestTime[0] === 'evening' ? '🌆' : '🌙',
    });
  }

  // Most common positive effect
  const effectCounts: Record<string, number> = {};
  entries.forEach(entry => {
    entry.effectsPositive.forEach(eff => {
      effectCounts[eff] = (effectCounts[eff] || 0) + 1;
    });
  });

  const topEffect = Object.entries(effectCounts).sort((a, b) => b[1] - a[1])[0];
  if (topEffect && topEffect[1] >= 2) {
    insights.push({
      type: 'effect',
      title: `You Often Feel "${topEffect[0]}"`,
      description: `${topEffect[0]} appears in ${topEffect[1]} of your sessions (${Math.round(topEffect[1] / entries.length * 100)}%). This suggests you gravitate toward strains that produce this effect.`,
      confidence: topEffect[1] >= 10 ? 'high' : 'medium',
      icon: '✨',
    });
  }

  // Symptom relief insight
  const symptomRelief: Record<string, number> = {};
  entries.forEach(entry => {
    const relieved = entry.symptomsBefore.filter(s => !entry.symptomsAfter.includes(s));
    relieved.forEach(sym => {
      symptomRelief[sym] = (symptomRelief[sym] || 0) + 1;
    });
  });

  const topRelief = Object.entries(symptomRelief).sort((a, b) => b[1] - a[1])[0];
  if (topRelief && topRelief[1] >= 1) {
    // Find which terpene helped most with this symptom
    const helpfulTerpene = terpeneScores.find(t => t.helpsWith.includes(topRelief[0]));

    insights.push({
      type: 'medical',
      title: `Cannabis Helps Your ${topRelief[0]}`,
      description: helpfulTerpene
        ? `Your ${topRelief[0]} was relieved in ${topRelief[1]} sessions. Strains high in ${helpfulTerpene.displayName} seem most effective for this.`
        : `Cannabis helped relieve your ${topRelief[0]} in ${topRelief[1]} sessions. Keep tracking to identify the best strains for this.`,
      confidence: topRelief[1] >= 5 ? 'high' : 'medium',
      icon: '💊',
    });
  }

  return insights;
}

async function getStrainRecommendations(
  terpeneScores: TerpeneScore[],
  entries: JournalEntryWithStrain[],
  userId: string
): Promise<StrainRecommendation[]> {
  // Get user's already-tried strains
  const triedStrains = new Set(entries.map(e => e.strainName.toLowerCase()));

  // Get top performing terpenes
  const topTerpenes = terpeneScores.filter(t => t.effectivenessScore > 30).slice(0, 3);

  if (topTerpenes.length === 0) {
    // Not enough data, return popular strains
    const popularStrains = await prisma.strain.findMany({
      where: { isActive: true, rating: { gte: 4 } },
      orderBy: { reviewsCount: 'desc' },
      take: 6,
      select: {
        id: true,
        name: true,
        slug: true,
        type: true,
        effects: true,
        thcMax: true,
        terpMyrcene: true,
        terpLimonene: true,
        terpCaryophyllene: true,
        terpPinene: true,
        terpLinalool: true,
      },
    });

    return popularStrains.map(strain => ({
      id: strain.id,
      name: strain.name,
      slug: strain.slug,
      type: strain.type,
      matchScore: 70,
      matchReasons: ['Highly rated by the community'],
      predictedRating: 4.0,
      dominantTerpene: getDominantTerpene(strain),
      effects: strain.effects.slice(0, 3),
      thcMax: strain.thcMax,
    }));
  }

  // Build query for strains with top terpenes
  const terpeneFilters: Record<string, { gte: number }> = {};
  topTerpenes.forEach(t => {
    terpeneFilters[t.terpene] = { gte: 0.3 }; // At least 0.3% of this terpene
  });

  // Get strains with matching terpene profiles
  const candidateStrains = await prisma.strain.findMany({
    where: {
      isActive: true,
      OR: topTerpenes.map(t => ({ [t.terpene]: { gte: 0.2 } })),
    },
    orderBy: { rating: 'desc' },
    take: 50,
    select: {
      id: true,
      name: true,
      slug: true,
      type: true,
      effects: true,
      rating: true,
      thcMax: true,
      terpMyrcene: true,
      terpLimonene: true,
      terpCaryophyllene: true,
      terpPinene: true,
      terpLinalool: true,
      terpHumulene: true,
      terpTerpinolene: true,
      terpOcimene: true,
    },
  });

  // Score and rank strains
  const scoredStrains = candidateStrains
    .filter(strain => !triedStrains.has(strain.name.toLowerCase()))
    .map(strain => {
      let matchScore = 50; // Base score
      const matchReasons: string[] = [];

      // Score based on terpene matches
      topTerpenes.forEach(userTerp => {
        const strainTerpValue = strain[userTerp.terpene as keyof typeof strain] as number | null;
        if (strainTerpValue && strainTerpValue > 0.2) {
          matchScore += 15;
          matchReasons.push(`High in ${userTerp.displayName} (your top terpene)`);
        }
      });

      // Bonus for strain rating
      if (strain.rating && strain.rating >= 4.5) {
        matchScore += 10;
        matchReasons.push('Highly rated strain');
      }

      // Predict rating based on terpene scores
      let predictedRating = 3.5;
      let terpeneContributions = 0;
      topTerpenes.forEach(userTerp => {
        const strainTerpValue = strain[userTerp.terpene as keyof typeof strain] as number | null;
        if (strainTerpValue && strainTerpValue > 0.1) {
          predictedRating += (userTerp.avgRating - 3) * 0.3;
          terpeneContributions++;
        }
      });
      if (terpeneContributions > 0) {
        predictedRating = Math.min(5, Math.max(1, predictedRating));
      }

      return {
        id: strain.id,
        name: strain.name,
        slug: strain.slug,
        type: strain.type,
        matchScore: Math.min(100, matchScore),
        matchReasons: matchReasons.slice(0, 2),
        predictedRating: Math.round(predictedRating * 10) / 10,
        dominantTerpene: getDominantTerpene(strain),
        effects: strain.effects.slice(0, 3),
        thcMax: strain.thcMax,
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 6);

  return scoredStrains;
}

function getDominantTerpene(strain: Record<string, unknown>): string {
  const terpenes = [
    { key: 'terpMyrcene', name: 'Myrcene' },
    { key: 'terpLimonene', name: 'Limonene' },
    { key: 'terpCaryophyllene', name: 'Caryophyllene' },
    { key: 'terpPinene', name: 'Pinene' },
    { key: 'terpLinalool', name: 'Linalool' },
    { key: 'terpHumulene', name: 'Humulene' },
    { key: 'terpTerpinolene', name: 'Terpinolene' },
    { key: 'terpOcimene', name: 'Ocimene' },
  ];

  let maxValue = 0;
  let dominant = 'Unknown';

  terpenes.forEach(({ key, name }) => {
    const value = strain[key] as number | null;
    if (value && value > maxValue) {
      maxValue = value;
      dominant = name;
    }
  });

  return dominant;
}

function formatTerpene(key: string): string {
  const names: Record<string, string> = {
    terpMyrcene: 'Myrcene',
    terpLimonene: 'Limonene',
    terpCaryophyllene: 'Caryophyllene',
    terpPinene: 'Pinene',
    terpLinalool: 'Linalool',
    terpHumulene: 'Humulene',
    terpTerpinolene: 'Terpinolene',
    terpOcimene: 'Ocimene',
  };
  return names[key] || key;
}
