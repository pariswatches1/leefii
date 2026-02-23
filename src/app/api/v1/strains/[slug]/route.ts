import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET',
  'X-Powered-By': 'Leefii Cannabis API',
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const strain = await prisma.strain.findFirst({
      where: {
        slug,
        isActive: true,
      },
    })

    if (!strain) {
      return NextResponse.json(
        { success: false, error: 'Strain not found' },
        { status: 404, headers: CORS_HEADERS }
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          slug: strain.slug,
          name: strain.name,
          type: strain.type,
          thcMin: strain.thcMin,
          thcMax: strain.thcMax,
          cbdMin: strain.cbdMin,
          cbdMax: strain.cbdMax,
          effects: strain.effects,
          flavors: strain.flavors,
          aromas: strain.aromas,
          conditions: strain.conditions,
          description: strain.description,
          genetics: strain.genetics,
          origin: strain.origin,
          breeder: strain.breeder,
          floweringTime: strain.floweringTime,
          difficulty: strain.difficulty,
          yieldIndoor: strain.yieldIndoor,
          yieldOutdoor: strain.yieldOutdoor,
          rating: strain.rating,
          reviewsCount: strain.reviewsCount,
          imageUrl: strain.imageUrl,
          terpenes: {
            myrcene: strain.terpMyrcene,
            limonene: strain.terpLimonene,
            caryophyllene: strain.terpCaryophyllene,
            pinene: strain.terpPinene,
            linalool: strain.terpLinalool,
            humulene: strain.terpHumulene,
            terpinolene: strain.terpTerpinolene,
            ocimene: strain.terpOcimene,
          },
        },
      },
      { headers: CORS_HEADERS }
    )
  } catch (error) {
    console.error('API v1 strain detail error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500, headers: CORS_HEADERS }
    )
  }
}
