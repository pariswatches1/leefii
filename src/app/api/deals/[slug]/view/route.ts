import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const deal = await prisma.deal.update({
      where: { slug },
      data: { viewCount: { increment: 1 } },
      select: { viewCount: true },
    })

    return NextResponse.json({ viewCount: deal.viewCount })
  } catch {
    return NextResponse.json({ error: 'Deal not found' }, { status: 404 })
  }
}
