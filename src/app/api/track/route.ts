import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { eventType, dispensaryId, page } = body

    // Validate event type
    const validEvents = ['PAGE_VIEW', 'CALL_CLICK', 'DIRECTIONS_CLICK', 'WEBSITE_CLICK', 'SEARCH']
    if (!validEvents.includes(eventType)) {
      return NextResponse.json({ error: 'Invalid event type' }, { status: 400 })
    }

    // Get request metadata
    const userAgent = request.headers.get('user-agent') || undefined
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || undefined

    // Create event
    const event = await prisma.analyticsEvent.create({
      data: {
        eventType,
        dispensaryId: dispensaryId || undefined,
        page: page || undefined,
        userAgent,
        ipAddress: ip,
      }
    })

    return NextResponse.json({ success: true, eventId: event.id })
  } catch (error) {
    console.error('Error tracking event:', error)
    return NextResponse.json({ error: 'Failed to track event' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  // Get analytics summary (for admin use)
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [totalEvents, todayEvents, topDispensaries] = await Promise.all([
      prisma.analyticsEvent.count(),
      prisma.analyticsEvent.count({
        where: { createdAt: { gte: today } }
      }),
      prisma.analyticsEvent.groupBy({
        by: ['dispensaryId'],
        _count: { id: true },
        where: { dispensaryId: { not: null } },
        orderBy: { _count: { id: 'desc' } },
        take: 10
      })
    ])

    return NextResponse.json({
      totalEvents,
      todayEvents,
      topDispensaries
    })
  } catch (error) {
    console.error('Error getting analytics:', error)
    return NextResponse.json({ error: 'Failed to get analytics' }, { status: 500 })
  }
}
