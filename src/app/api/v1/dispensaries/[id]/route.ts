import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET',
  'X-Powered-By': 'Leefii Cannabis API',
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const include = {
      city: { select: { name: true } },
      state: { select: { name: true, slug: true, abbreviation: true } },
      BusinessHours: true,
    }

    // Try finding by id first, then by slug
    let dispensary = await prisma.dispensary.findFirst({
      where: { id, isActive: true },
      include,
    })

    if (!dispensary) {
      dispensary = await prisma.dispensary.findFirst({
        where: { slug: id, isActive: true },
        include,
      })
    }

    if (!dispensary) {
      return NextResponse.json(
        { success: false, error: 'Dispensary not found' },
        { status: 404, headers: CORS_HEADERS }
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: dispensary,
      },
      { headers: CORS_HEADERS }
    )
  } catch (error) {
    console.error('API v1 dispensary detail error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500, headers: CORS_HEADERS }
    )
  }
}
