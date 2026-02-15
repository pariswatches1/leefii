/**
 * Bulk submit all sitemap URLs to IndexNow for instant indexing.
 *
 * Usage:
 *   INDEXNOW_KEY=your-key npx tsx scripts/submit-indexnow.ts
 *
 * Or set INDEXNOW_KEY in your .env file and run:
 *   npx tsx scripts/submit-indexnow.ts
 */

const SITEMAP_URL = 'https://leefii.com/sitemap.xml'
const INDEXNOW_API = 'https://api.indexnow.org/IndexNow'
const HOST = 'leefii.com'
const BATCH_SIZE = 10000

async function main() {
  const key = process.env.INDEXNOW_KEY
  if (!key) {
    console.error('Error: INDEXNOW_KEY environment variable is required')
    console.error('Usage: INDEXNOW_KEY=your-key npx tsx scripts/submit-indexnow.ts')
    process.exit(1)
  }

  console.log('Fetching sitemap from', SITEMAP_URL, '...')
  const response = await fetch(SITEMAP_URL)
  if (!response.ok) {
    console.error(`Failed to fetch sitemap: ${response.status} ${response.statusText}`)
    process.exit(1)
  }

  const xml = await response.text()

  // Extract all <loc> URLs from sitemap XML
  const urls: string[] = []
  const locRegex = /<loc>(.*?)<\/loc>/g
  let match
  while ((match = locRegex.exec(xml)) !== null) {
    urls.push(match[1])
  }

  console.log(`Found ${urls.length} URLs in sitemap\n`)

  if (urls.length === 0) {
    console.log('No URLs to submit.')
    return
  }

  const keyLocation = `https://${HOST}/${key}.txt`

  // Submit in batches
  const totalBatches = Math.ceil(urls.length / BATCH_SIZE)
  let submitted = 0

  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    const batch = urls.slice(i, i + BATCH_SIZE)
    const batchNum = Math.floor(i / BATCH_SIZE) + 1

    console.log(`Submitting batch ${batchNum}/${totalBatches} (${batch.length} URLs)...`)

    const res = await fetch(INDEXNOW_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: HOST,
        key,
        keyLocation,
        urlList: batch,
      }),
    })

    submitted += batch.length

    if (res.ok || res.status === 202) {
      console.log(`  Batch ${batchNum}: ${res.status} OK (${submitted}/${urls.length} submitted)`)
    } else {
      const text = await res.text().catch(() => '')
      console.error(`  Batch ${batchNum}: ${res.status} ${res.statusText}`)
      if (text) console.error(`  Response: ${text}`)
    }

    // Small delay between batches to be polite
    if (i + BATCH_SIZE < urls.length) {
      await new Promise((r) => setTimeout(r, 1000))
    }
  }

  console.log(`\nDone! Submitted ${submitted} URLs to IndexNow.`)
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
