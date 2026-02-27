import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * POST /api/admin/seed-deals
 *
 * Generates realistic deals from existing dispensary data.
 * Creates a mix of deal types tied to actual dispensaries, states, and cities.
 */

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// Deal templates — each dispensary gets a random subset
const DEAL_TEMPLATES = [
  // First-time patient deals
  {
    titleFn: (name: string) => `${name} — 20% Off First Visit`,
    description: 'New patients receive 20% off their entire first purchase. Valid ID required. Cannot be combined with other offers.',
    discountType: 'percentage',
    discountValue: 20,
    isOngoing: true,
    terms: 'First-time patients only. Must present valid ID. One-time use.',
  },
  {
    titleFn: (name: string) => `${name} — $25 Off for New Customers`,
    description: 'Get $25 off your first order of $100 or more at this location.',
    discountType: 'dollar',
    discountValue: 25,
    isOngoing: true,
    minPurchase: 100,
    terms: 'First-time customers only. Minimum $100 purchase required.',
  },
  // Veteran discounts
  {
    titleFn: (name: string) => `${name} — 15% Military & Veteran Discount`,
    description: 'Active military and veterans save 15% on every visit. Thank you for your service.',
    discountType: 'percentage',
    discountValue: 15,
    isOngoing: true,
    terms: 'Must present valid military ID or proof of service.',
  },
  // Senior discounts
  {
    titleFn: (name: string) => `${name} — 10% Senior Discount (55+)`,
    description: 'Patients aged 55 and older receive 10% off every purchase.',
    discountType: 'percentage',
    discountValue: 10,
    isOngoing: true,
    terms: 'Must be 55+ years old. Valid ID required.',
  },
  // Daily specials
  {
    titleFn: (name: string) => `${name} — Monday Flower Deals`,
    description: 'Every Monday, save 15% on all flower products including eighths, quarters, and ounces.',
    discountType: 'percentage',
    discountValue: 15,
    isOngoing: true,
    terms: 'Valid on Mondays only. Applies to flower products.',
  },
  {
    titleFn: (name: string) => `${name} — Wednesday Wax Day`,
    description: 'All concentrates 20% off every Wednesday. Includes shatter, wax, live resin, and rosin.',
    discountType: 'percentage',
    discountValue: 20,
    isOngoing: true,
    terms: 'Valid on Wednesdays only. Applies to concentrate products.',
  },
  // BOGO
  {
    titleFn: (name: string) => `${name} — Buy 1 Get 1 50% Off Edibles`,
    description: 'Purchase any edible and get a second one of equal or lesser value at half price.',
    discountType: 'BOGO',
    discountValue: 50,
    isOngoing: true,
    terms: 'Second item must be of equal or lesser value. While supplies last.',
  },
  // Happy hour
  {
    titleFn: (name: string) => `${name} — Happy Hour 4-7PM`,
    description: 'Visit during happy hour and receive 10% off your entire purchase. Available daily.',
    discountType: 'percentage',
    discountValue: 10,
    isOngoing: true,
    terms: 'Valid daily 4:00 PM - 7:00 PM local time. In-store only.',
  },
  // Bulk
  {
    titleFn: (name: string) => `${name} — Ounce Special`,
    description: 'Save $30 when you purchase a full ounce of select flower strains.',
    discountType: 'dollar',
    discountValue: 30,
    isOngoing: true,
    terms: 'Select strains only. While supplies last.',
  },
  // Time-limited seasonal
  {
    titleFn: (name: string) => `${name} — Spring Sale: 25% Off Vapes`,
    description: 'Celebrate spring with 25% off all vape cartridges and disposables this month.',
    discountType: 'percentage',
    discountValue: 25,
    isOngoing: false,
    terms: 'Valid through end of month. Applies to all vape products.',
  },
  // Loyalty
  {
    titleFn: (name: string) => `${name} — Loyalty Points: Double Points Week`,
    description: 'Earn double loyalty points on every purchase this week. Points redeemable for discounts.',
    discountType: 'percentage',
    discountValue: 0,
    isOngoing: false,
    terms: 'Must be enrolled in loyalty program. Points expire after 12 months.',
  },
  // Delivery special
  {
    titleFn: (name: string) => `${name} — Free Delivery on Orders $75+`,
    description: 'Order $75 or more and get free delivery to your door. No promo code needed.',
    discountType: 'dollar',
    discountValue: 0,
    isOngoing: true,
    minPurchase: 75,
    terms: 'Delivery available in service area only. Minimum $75 order.',
  },
  // Pre-roll deal
  {
    titleFn: (name: string) => `${name} — Pre-Roll Friday: Buy 3 Get 1 Free`,
    description: 'Every Friday, buy any 3 pre-rolls and get a 4th one free.',
    discountType: 'BOGO',
    discountValue: 0,
    isOngoing: true,
    terms: 'Valid on Fridays only. Free pre-roll of equal or lesser value.',
  },
]

export async function POST() {
  try {
    // Fetch dispensaries with their city and state info
    const dispensaries = await prisma.dispensary.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        slug: true,
        chainName: true,
        city: { select: { name: true, slug: true } },
        state: { select: { name: true, slug: true } },
        hasDelivery: true,
      },
    })

    if (dispensaries.length === 0) {
      return NextResponse.json(
        { error: 'No active dispensaries found to generate deals from' },
        { status: 400 }
      )
    }

    // Clear existing seeded deals
    await prisma.deal.deleteMany({})

    const deals: Array<{
      title: string
      slug: string
      description: string
      discountType: string
      discountValue: number
      code: string | null
      dispensaryName: string
      dispensarySlug: string
      chainName: string | null
      stateSlug: string
      citySlug: string
      startDate: Date
      endDate: Date | null
      isOngoing: boolean
      terms: string
      minPurchase: number | null
      isActive: boolean
      isFeatured: boolean
    }> = []

    const usedSlugs = new Set<string>()
    const now = new Date()

    for (const disp of dispensaries) {
      // Each dispensary gets 2-5 random deals
      const numDeals = 2 + Math.floor(Math.random() * 4)
      const shuffled = [...DEAL_TEMPLATES].sort(() => Math.random() - 0.5)
      const selected = shuffled.slice(0, numDeals)

      // Skip delivery deals for non-delivery dispensaries
      const filtered = selected.filter((tpl) => {
        if (tpl.titleFn('').includes('Delivery') && !disp.hasDelivery) return false
        return true
      })

      for (const tpl of filtered) {
        const title = tpl.titleFn(disp.name)
        let slug = slugify(title)

        // Ensure unique slug
        let counter = 0
        while (usedSlugs.has(slug)) {
          counter++
          slug = slugify(title) + '-' + counter
        }
        usedSlugs.add(slug)

        // Time-limited deals get end dates 14-45 days from now
        const isTimeLimited = !tpl.isOngoing
        const endDate = isTimeLimited
          ? new Date(now.getTime() + (14 + Math.floor(Math.random() * 31)) * 86400000)
          : null

        deals.push({
          title,
          slug,
          description: tpl.description,
          discountType: tpl.discountType,
          discountValue: tpl.discountValue,
          code: null,
          dispensaryName: disp.name,
          dispensarySlug: disp.slug,
          chainName: disp.chainName,
          stateSlug: disp.state.slug,
          citySlug: disp.city.slug,
          startDate: now,
          endDate,
          isOngoing: tpl.isOngoing,
          terms: tpl.terms,
          minPurchase: tpl.minPurchase ?? null,
          isActive: true,
          isFeatured: false,
        })
      }
    }

    // Mark ~12 random deals as featured
    const featuredIndices = new Set<number>()
    while (featuredIndices.size < Math.min(12, deals.length)) {
      featuredIndices.add(Math.floor(Math.random() * deals.length))
    }
    featuredIndices.forEach((i) => {
      deals[i].isFeatured = true
    })

    // Batch insert
    const result = await prisma.deal.createMany({ data: deals })

    return NextResponse.json({
      success: true,
      message: `Seeded ${result.count} deals from ${dispensaries.length} dispensaries`,
      stats: {
        dispensaries: dispensaries.length,
        dealsCreated: result.count,
        featured: featuredIndices.size,
        ongoing: deals.filter((d) => d.isOngoing).length,
        timeLimited: deals.filter((d) => !d.isOngoing).length,
      },
    })
  } catch (error) {
    console.error('[seed-deals] Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to seed deals' },
      { status: 500 }
    )
  }
}
