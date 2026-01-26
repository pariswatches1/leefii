import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Get all entries for this user
    const entries = await prisma.journalEntry.findMany({
      where: { userId },
      orderBy: { consumedAt: 'desc' },
    });

    if (entries.length === 0) {
      return NextResponse.json({
        totalEntries: 0,
        averageRating: 0,
        topStrains: [],
        topEffects: [],
        topMethods: [],
        moodTrend: [],
        entriesByType: [],
        recentActivity: [],
      });
    }

    // Calculate stats
    const totalEntries = entries.length;
    const averageRating = entries.reduce((sum, e) => sum + e.overallRating, 0) / entries.length;

    // Top strains by frequency
    const strainCounts: Record<string, { name: string; count: number; avgRating: number; totalRating: number }> = {};
    entries.forEach(entry => {
      if (!strainCounts[entry.strainName]) {
        strainCounts[entry.strainName] = { name: entry.strainName, count: 0, avgRating: 0, totalRating: 0 };
      }
      strainCounts[entry.strainName].count++;
      strainCounts[entry.strainName].totalRating += entry.overallRating;
    });
    Object.values(strainCounts).forEach(s => {
      s.avgRating = s.totalRating / s.count;
    });
    const topStrains = Object.values(strainCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Top positive effects
    const effectCounts: Record<string, number> = {};
    entries.forEach(entry => {
      entry.effectsPositive.forEach(effect => {
        effectCounts[effect] = (effectCounts[effect] || 0) + 1;
      });
    });
    const topEffects = Object.entries(effectCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // Top consumption methods
    const methodCounts: Record<string, number> = {};
    entries.forEach(entry => {
      methodCounts[entry.method] = (methodCounts[entry.method] || 0) + 1;
    });
    const topMethods = Object.entries(methodCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // Entries by product type
    const typeCounts: Record<string, number> = {};
    entries.forEach(entry => {
      typeCounts[entry.productType] = (typeCounts[entry.productType] || 0) + 1;
    });
    const entriesByType = Object.entries(typeCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // Mood trend (last 30 entries with mood data)
    const moodTrend = entries
      .filter(e => e.moodBefore !== null && e.moodAfter !== null)
      .slice(0, 30)
      .map(e => ({
        date: e.consumedAt,
        moodBefore: e.moodBefore,
        moodAfter: e.moodAfter,
        change: (e.moodAfter || 0) - (e.moodBefore || 0),
      }))
      .reverse();

    // Recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentActivity = entries
      .filter(e => e.consumedAt >= sevenDaysAgo)
      .slice(0, 10);

    return NextResponse.json({
      totalEntries,
      averageRating: Math.round(averageRating * 10) / 10,
      topStrains,
      topEffects,
      topMethods,
      moodTrend,
      entriesByType,
      recentActivity,
    });
  } catch (error) {
    console.error('Error fetching journal stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
