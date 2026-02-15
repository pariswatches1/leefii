import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const secret = request.headers.get('authorization')?.replace('Bearer ', '')
  if (!secret || secret !== process.env.INDEXNOW_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const key = process.env.INDEXNOW_KEY
  if (!key) {
    return NextResponse.json({ error: 'INDEXNOW_KEY not configured' }, { status: 500 })
  }

  let body: { urls: string[] }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (!body.urls || !Array.isArray(body.urls) || body.urls.length === 0) {
    return NextResponse.json({ error: 'urls array is required' }, { status: 400 })
  }

  const host = 'leefii.com'
  const keyLocation = `https://${host}/${key}.txt`

  // Submit in batches of 10,000 (IndexNow limit)
  const batchSize = 10000
  const results: { batch: number; status: number; count: number }[] = []

  for (let i = 0; i < body.urls.length; i += batchSize) {
    const batch = body.urls.slice(i, i + batchSize)
    const batchNum = Math.floor(i / batchSize) + 1

    const response = await fetch('https://api.indexnow.org/IndexNow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host,
        key,
        keyLocation,
        urlList: batch,
      }),
    })

    results.push({ batch: batchNum, status: response.status, count: batch.length })
  }

  return NextResponse.json({
    success: true,
    totalUrls: body.urls.length,
    batches: results,
  })
}
