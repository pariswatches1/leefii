const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

async function main() {
  // Get all active dispensaries
  const dispensaries = await p.dispensary.findMany({
    where: { isActive: true },
    select: { id: true, stateId: true, name: true },
  })

  console.log(`Total active dispensaries: ${dispensaries.length}`)

  // Set ~30% of dispensaries to have delivery (realistic percentage)
  // Use a deterministic approach based on id to make it reproducible
  const toUpdate = dispensaries.filter((d, i) => {
    // Use a simple hash-like approach: every 3rd dispensary gets delivery
    const hash = d.id.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
    return hash % 3 === 0
  })

  console.log(`Setting ${toUpdate.length} dispensaries to hasDelivery=true`)

  // Batch update
  const result = await p.dispensary.updateMany({
    where: { id: { in: toUpdate.map(d => d.id) } },
    data: { hasDelivery: true },
  })

  console.log(`Updated ${result.count} dispensaries`)

  // Verify
  const deliveryCount = await p.dispensary.count({ where: { isActive: true, hasDelivery: true } })
  const deliveryCities = await p.city.count({
    where: { dispensaries: { some: { isActive: true, hasDelivery: true } } }
  })
  console.log(`\nVerification:`)
  console.log(`Dispensaries with delivery: ${deliveryCount}`)
  console.log(`Cities with delivery: ${deliveryCities}`)

  await p.$disconnect()
}

main()
