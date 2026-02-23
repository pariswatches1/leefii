import { STATE_LAWS } from '@/data/cannabis-laws'
import { NextResponse } from 'next/server'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET',
  'X-Powered-By': 'Leefii Cannabis API',
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ state: string }> }
) {
  try {
    const { state } = await params
    const slug = state.toLowerCase()

    const lawData = STATE_LAWS[slug]

    if (!lawData) {
      return NextResponse.json(
        { success: false, error: 'State not found' },
        { status: 404, headers: CORS_HEADERS }
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          slug: lawData.slug,
          name: lawData.name,
          abbreviation: lawData.abbreviation,
          status: lawData.status,
          statusLabel: lawData.statusLabel,
          statusDescription: lawData.statusDescription,
          possessionLimit: lawData.possessionLimit,
          purchaseLimit: lawData.purchaseLimit,
          homeGrow: lawData.homeGrow,
          minimumAge: lawData.minimumAge,
          taxRate: lawData.taxRate,
          deliveryAllowed: lawData.deliveryAllowed,
          medical: lawData.medical,
          consumptionRules: lawData.consumptionRules,
          recentChanges: lawData.recentChanges,
          ballotWatch: lawData.ballotWatch,
          lastUpdated: lawData.lastUpdated,
        },
      },
      { headers: CORS_HEADERS }
    )
  } catch (error) {
    console.error('API v1 laws error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500, headers: CORS_HEADERS }
    )
  }
}
