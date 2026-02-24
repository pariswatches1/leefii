import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const revalidate = 3600

export async function GET() {
  try {
    // Get total active doctor count
    const totalDoctors = await prisma.doctor.count({
      where: { isActive: true },
    })

    // Get doctors grouped by state abbreviation with counts
    const stateDoctorCounts = await prisma.doctor.groupBy({
      by: ['state'],
      where: { isActive: true, state: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    })

    // Get state records to map abbreviation -> slug + name
    const states = await prisma.state.findMany({
      select: { abbreviation: true, slug: true, name: true },
    })
    const stateMap: Record<string, { slug: string; name: string }> = {}
    for (const s of states) {
      stateMap[s.abbreviation] = { slug: s.slug, name: s.name }
    }

    // Build state stats array
    const stateStats = stateDoctorCounts
      .filter((g) => g.state && stateMap[g.state])
      .map((g) => ({
        abbreviation: g.state!,
        slug: stateMap[g.state!].slug,
        name: stateMap[g.state!].name,
        doctorCount: g._count.id,
      }))

    return NextResponse.json({
      totalDoctors,
      stateCount: stateStats.length,
      states: stateStats,
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to load doctor stats' },
      { status: 500 }
    )
  }
}
