import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { neon } from '@neondatabase/serverless'

export const dynamic = 'force-dynamic'
export const maxDuration = 300 // 5 minutes max

// Neon source database (read-only — our collection database)
const NEON_DATABASE_URL =
  'postgresql://neondb_owner:npg_aC3PyOx6iXuT@ep-young-mud-ailipb7s-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require'

const sql = neon(NEON_DATABASE_URL)

// Admin key to protect this endpoint
const SYNC_SECRET = process.env.ADMIN_SETUP_KEY || 'leefii-admin-setup-2026'

/**
 * POST /api/admin/sync-neon
 *
 * Syncs data from the Neon collection database into the production database.
 * Protected by ADMIN_SETUP_KEY.
 *
 * Body: { secret, step: 'check' | 'dispensaries' | 'products', offset?: number }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { secret, step = 'check', offset = 0 } = body

    if (secret !== SYNC_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // ────────────────────────────────
    // STEP: CHECK
    // ────────────────────────────────
    if (step === 'check') {
      const [prodDisp, prodProducts] = await Promise.all([
        prisma.dispensary.count(),
        prisma.menuProduct.count(),
      ])

      // Check Neon counts
      const neonProducts = await sql`SELECT COUNT(*)::int as count FROM "MenuProduct"`
      const neonDisp = await sql`SELECT COUNT(*)::int as count FROM "Dispensary"`

      return NextResponse.json({
        status: 'ready',
        production: { dispensaries: prodDisp, menuProducts: prodProducts },
        neon: {
          dispensaries: neonDisp[0]?.count ?? 0,
          menuProducts: neonProducts[0]?.count ?? 0,
        },
        steps: [
          'POST with step="dispensaries" — syncs dispensary websites',
          'POST with step="products" offset=0 — syncs products (2000/batch)',
        ],
      })
    }

    // ────────────────────────────────
    // STEP: DISPENSARIES — sync website URLs
    // ────────────────────────────────
    if (step === 'dispensaries') {
      const rows = await sql`
        SELECT slug, website
        FROM "Dispensary"
        WHERE website IS NOT NULL AND website != ''
      `

      let updated = 0
      for (const row of rows) {
        try {
          await prisma.dispensary.update({
            where: { slug: row.slug },
            data: { website: row.website },
          })
          updated++
        } catch {
          // Dispensary may not exist in production — skip
        }
      }

      return NextResponse.json({
        status: 'done',
        step: 'dispensaries',
        total: rows.length,
        updated,
        message: `Updated ${updated}/${rows.length} dispensary websites.`,
      })
    }

    // ────────────────────────────────
    // STEP: PRODUCTS — batch sync MenuProducts
    // ────────────────────────────────
    if (step === 'products') {
      const BATCH = 2000

      const rows = await sql`
        SELECT
          mp.name, mp.category, mp.subcategory,
          mp.brand, mp.strain, mp."strainType",
          mp.price, mp."originalPrice",
          mp.weight, mp."thcContent", mp."cbdContent", mp."imageUrl",
          mp."isOnSale", mp."sourcePlatform", mp."lastScrapedAt",
          mp."isActive",
          d.slug AS "dispensarySlug"
        FROM "MenuProduct" mp
        JOIN "Dispensary" d ON mp."dispensaryId" = d.id
        ORDER BY mp.id
        OFFSET ${offset}
        LIMIT ${BATCH}
      `

      if (rows.length === 0) {
        const total = await prisma.menuProduct.count()
        return NextResponse.json({
          status: 'complete',
          totalInProduction: total,
          message: `Sync complete! ${total} products in production.`,
        })
      }

      // Map dispensary slugs → production IDs
      const slugs = [...new Set(rows.map((r) => r.dispensarySlug as string))]
      const dispensaries = await prisma.dispensary.findMany({
        where: { slug: { in: slugs } },
        select: { id: true, slug: true },
      })
      const slugToId = new Map(dispensaries.map((d) => [d.slug, d.id]))

      let inserted = 0
      let skipped = 0

      // Process in chunks of 200
      for (let i = 0; i < rows.length; i += 200) {
        const chunk = rows.slice(i, i + 200)
        const valid = chunk.filter((r) => slugToId.has(r.dispensarySlug as string))
        skipped += chunk.length - valid.length

        if (valid.length === 0) continue

        try {
          const result = await prisma.menuProduct.createMany({
            data: valid.map((r) => ({
              dispensaryId: slugToId.get(r.dispensarySlug as string)!,
              name: String(r.name),
              category: String(r.category),
              subcategory: r.subcategory ? String(r.subcategory) : null,
              brand: r.brand ? String(r.brand) : null,
              strain: r.strain ? String(r.strain) : null,
              strainType: r.strainType ? String(r.strainType) : null,
              price: parseFloat(String(r.price)),
              originalPrice: r.originalPrice
                ? parseFloat(String(r.originalPrice))
                : null,
              weight: r.weight ? String(r.weight) : null,
              thcContent: r.thcContent ? String(r.thcContent) : null,
              cbdContent: r.cbdContent ? String(r.cbdContent) : null,
              imageUrl: r.imageUrl ? String(r.imageUrl) : null,
              isOnSale: Boolean(r.isOnSale),
              sourcePlatform: r.sourcePlatform
                ? String(r.sourcePlatform)
                : null,
              lastScrapedAt: r.lastScrapedAt
                ? new Date(String(r.lastScrapedAt))
                : new Date(),
              isActive: r.isActive !== false,
            })),
            skipDuplicates: true,
          })
          inserted += result.count
        } catch (err) {
          console.error(`Chunk error at offset ${offset + i}:`, err)
          skipped += valid.length
        }
      }

      const hasMore = rows.length === BATCH
      const nextOffset = offset + rows.length

      return NextResponse.json({
        status: hasMore ? 'in_progress' : 'complete',
        step: 'products',
        batch: { offset, fetched: rows.length, inserted, skipped },
        nextOffset: hasMore ? nextOffset : null,
        message: hasMore
          ? `Batch done: ${inserted} inserted, ${skipped} skipped. Next: offset=${nextOffset}`
          : `Final batch: ${inserted} inserted. Sync complete!`,
      })
    }

    return NextResponse.json(
      { error: 'Invalid step. Use: check, dispensaries, products' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Sync error:', error)
    return NextResponse.json(
      { error: 'Sync failed', details: String(error) },
      { status: 500 }
    )
  }
}
