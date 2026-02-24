// One-time script to seed all 50 US states + DC into the database
// Run: node prisma/seed-all-states.js

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const ALL_STATES = [
  { name: 'Alabama', slug: 'alabama', abbreviation: 'AL', status: 'medical' },
  { name: 'Alaska', slug: 'alaska', abbreviation: 'AK', status: 'recreational' },
  { name: 'Arizona', slug: 'arizona', abbreviation: 'AZ', status: 'recreational' },
  { name: 'Arkansas', slug: 'arkansas', abbreviation: 'AR', status: 'medical' },
  { name: 'California', slug: 'california', abbreviation: 'CA', status: 'recreational' },
  { name: 'Colorado', slug: 'colorado', abbreviation: 'CO', status: 'recreational' },
  { name: 'Connecticut', slug: 'connecticut', abbreviation: 'CT', status: 'recreational' },
  { name: 'Delaware', slug: 'delaware', abbreviation: 'DE', status: 'recreational' },
  { name: 'Florida', slug: 'florida', abbreviation: 'FL', status: 'medical' },
  { name: 'Georgia', slug: 'georgia', abbreviation: 'GA', status: 'medical' },
  { name: 'Hawaii', slug: 'hawaii', abbreviation: 'HI', status: 'recreational' },
  { name: 'Idaho', slug: 'idaho', abbreviation: 'ID', status: 'illegal' },
  { name: 'Illinois', slug: 'illinois', abbreviation: 'IL', status: 'recreational' },
  { name: 'Indiana', slug: 'indiana', abbreviation: 'IN', status: 'illegal' },
  { name: 'Iowa', slug: 'iowa', abbreviation: 'IA', status: 'medical' },
  { name: 'Kansas', slug: 'kansas', abbreviation: 'KS', status: 'illegal' },
  { name: 'Kentucky', slug: 'kentucky', abbreviation: 'KY', status: 'medical' },
  { name: 'Louisiana', slug: 'louisiana', abbreviation: 'LA', status: 'medical' },
  { name: 'Maine', slug: 'maine', abbreviation: 'ME', status: 'recreational' },
  { name: 'Maryland', slug: 'maryland', abbreviation: 'MD', status: 'recreational' },
  { name: 'Massachusetts', slug: 'massachusetts', abbreviation: 'MA', status: 'recreational' },
  { name: 'Michigan', slug: 'michigan', abbreviation: 'MI', status: 'recreational' },
  { name: 'Minnesota', slug: 'minnesota', abbreviation: 'MN', status: 'recreational' },
  { name: 'Mississippi', slug: 'mississippi', abbreviation: 'MS', status: 'medical' },
  { name: 'Missouri', slug: 'missouri', abbreviation: 'MO', status: 'recreational' },
  { name: 'Montana', slug: 'montana', abbreviation: 'MT', status: 'recreational' },
  { name: 'Nebraska', slug: 'nebraska', abbreviation: 'NE', status: 'medical' },
  { name: 'Nevada', slug: 'nevada', abbreviation: 'NV', status: 'recreational' },
  { name: 'New Hampshire', slug: 'new-hampshire', abbreviation: 'NH', status: 'medical' },
  { name: 'New Jersey', slug: 'new-jersey', abbreviation: 'NJ', status: 'recreational' },
  { name: 'New Mexico', slug: 'new-mexico', abbreviation: 'NM', status: 'recreational' },
  { name: 'New York', slug: 'new-york', abbreviation: 'NY', status: 'recreational' },
  { name: 'North Carolina', slug: 'north-carolina', abbreviation: 'NC', status: 'illegal' },
  { name: 'North Dakota', slug: 'north-dakota', abbreviation: 'ND', status: 'medical' },
  { name: 'Ohio', slug: 'ohio', abbreviation: 'OH', status: 'recreational' },
  { name: 'Oklahoma', slug: 'oklahoma', abbreviation: 'OK', status: 'medical' },
  { name: 'Oregon', slug: 'oregon', abbreviation: 'OR', status: 'recreational' },
  { name: 'Pennsylvania', slug: 'pennsylvania', abbreviation: 'PA', status: 'medical' },
  { name: 'Rhode Island', slug: 'rhode-island', abbreviation: 'RI', status: 'recreational' },
  { name: 'South Carolina', slug: 'south-carolina', abbreviation: 'SC', status: 'illegal' },
  { name: 'South Dakota', slug: 'south-dakota', abbreviation: 'SD', status: 'medical' },
  { name: 'Tennessee', slug: 'tennessee', abbreviation: 'TN', status: 'illegal' },
  { name: 'Texas', slug: 'texas', abbreviation: 'TX', status: 'medical' },
  { name: 'Utah', slug: 'utah', abbreviation: 'UT', status: 'medical' },
  { name: 'Vermont', slug: 'vermont', abbreviation: 'VT', status: 'recreational' },
  { name: 'Virginia', slug: 'virginia', abbreviation: 'VA', status: 'recreational' },
  { name: 'Washington', slug: 'washington', abbreviation: 'WA', status: 'recreational' },
  { name: 'Washington, D.C.', slug: 'washington-dc', abbreviation: 'DC', status: 'recreational' },
  { name: 'West Virginia', slug: 'west-virginia', abbreviation: 'WV', status: 'medical' },
  { name: 'Wisconsin', slug: 'wisconsin', abbreviation: 'WI', status: 'illegal' },
  { name: 'Wyoming', slug: 'wyoming', abbreviation: 'WY', status: 'illegal' },
]

async function main() {
  console.log('Seeding all 51 states...\n')

  let created = 0
  let updated = 0

  for (const s of ALL_STATES) {
    const isLegal = s.status === 'recreational' || s.status === 'medical'
    const medicalOnly = s.status === 'medical'

    const statusLabel = s.status === 'recreational'
      ? 'Recreational & Medical'
      : s.status === 'medical'
        ? 'Medical Only'
        : 'Not Yet Legal'

    const lawSummary = isLegal
      ? `${s.name} has legalized ${medicalOnly ? 'medical' : 'recreational and medical'} cannabis. Licensed dispensaries operate under state regulation.`
      : `Cannabis is not yet legal for recreational or medical use in ${s.name}. Laws may change — check back for updates.`

    const description = isLegal
      ? `Find licensed cannabis dispensaries in ${s.name}. Browse verified ${medicalOnly ? 'medical' : 'recreational and medical'} dispensaries with real-time menus, hours, and reviews on Leefii.`
      : `Cannabis dispensary information for ${s.name}. Stay updated on ${s.name}'s cannabis laws and find dispensaries when they become available.`

    const metaTitle = `Cannabis Dispensaries in ${s.name} (${s.abbreviation}) | Leefii`
    const metaDescription = isLegal
      ? `Find verified cannabis dispensaries in ${s.name}. Compare menus, prices, ratings, and delivery options at ${medicalOnly ? 'medical' : 'recreational & medical'} dispensaries near you.`
      : `${s.name} cannabis dispensary directory. Get the latest on ${s.name}'s cannabis laws and find dispensaries as they become available.`

    const result = await prisma.state.upsert({
      where: { abbreviation: s.abbreviation },
      update: {
        isLegal,
        medicalOnly,
        // Only update lawSummary/description/meta if they're currently null
      },
      create: {
        name: s.name,
        slug: s.slug,
        abbreviation: s.abbreviation,
        isLegal,
        medicalOnly,
        lawSummary,
        description,
        metaTitle,
        metaDescription,
      },
    })

    // Check if it was created or updated by seeing if updatedAt is very recent
    const existing = await prisma.state.findUnique({ where: { abbreviation: s.abbreviation } })
    if (existing) {
      // Update fields that are null
      const updates = {}
      if (!existing.lawSummary) updates.lawSummary = lawSummary
      if (!existing.description) updates.description = description
      if (!existing.metaTitle) updates.metaTitle = metaTitle
      if (!existing.metaDescription) updates.metaDescription = metaDescription

      if (Object.keys(updates).length > 0) {
        await prisma.state.update({ where: { id: existing.id }, data: updates })
      }
    }

    console.log(`  ${result.id ? '✓' : '✗'} ${s.abbreviation} - ${s.name} (${statusLabel})`)
  }

  const total = await prisma.state.count()
  console.log(`\nDone! Total states in DB: ${total}`)

  process.exit(0)
}

main().catch((e) => {
  console.error('Seed failed:', e)
  process.exit(1)
})
