const { PrismaClient } = require('@prisma/client')
const p = new PrismaClient()

async function main() {
  const strains = await p.strain.findMany({
    where: { isActive: true },
    select: { conditions: true, flavors: true, effects: true }
  })

  const conditions = new Set()
  const flavors = new Set()
  const effects = new Set()
  strains.forEach(s => {
    s.conditions?.forEach(c => conditions.add(c))
    s.flavors?.forEach(f => flavors.add(f))
    s.effects?.forEach(e => effects.add(e))
  })

  console.log('CONDITIONS (' + conditions.size + '):', [...conditions].sort().join(', '))
  console.log('')
  console.log('FLAVORS (' + flavors.size + '):', [...flavors].sort().join(', '))
  console.log('')
  console.log('EFFECTS (' + effects.size + '):', [...effects].sort().join(', '))

  const withTerp = await p.strain.count({ where: { isActive: true, terpMyrcene: { not: null } } })
  console.log('')
  console.log('Strains with terpene data:', withTerp)

  const indica = await p.strain.count({ where: { isActive: true, type: 'INDICA' } })
  const sativa = await p.strain.count({ where: { isActive: true, type: 'SATIVA' } })
  const hybrid = await p.strain.count({ where: { isActive: true, type: 'HYBRID' } })
  const cbd = await p.strain.count({ where: { isActive: true, type: 'CBD' } })
  console.log('Type counts - Indica:', indica, 'Sativa:', sativa, 'Hybrid:', hybrid, 'CBD:', cbd)

  const condCounts = {}
  strains.forEach(s => s.conditions?.forEach(c => { condCounts[c] = (condCounts[c] || 0) + 1 }))
  const sorted = Object.entries(condCounts).sort((a, b) => b[1] - a[1])
  console.log('')
  console.log('Top conditions with counts:')
  sorted.forEach(([c, n]) => console.log('  ' + c + ': ' + n))

  // Flavor counts
  const flavCounts = {}
  strains.forEach(s => s.flavors?.forEach(f => { flavCounts[f] = (flavCounts[f] || 0) + 1 }))
  const sortedFlav = Object.entries(flavCounts).sort((a, b) => b[1] - a[1])
  console.log('')
  console.log('Top flavors with counts:')
  sortedFlav.slice(0, 20).forEach(([f, n]) => console.log('  ' + f + ': ' + n))

  // Dispensary delivery data
  const withDelivery = await p.dispensary.count({ where: { isActive: true, hasDelivery: true } })
  const totalDisp = await p.dispensary.count({ where: { isActive: true } })
  console.log('')
  console.log('Dispensaries with delivery:', withDelivery, '/', totalDisp)

  await p.$disconnect()
}

main()
