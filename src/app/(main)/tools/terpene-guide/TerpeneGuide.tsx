'use client'

import { useState } from 'react'
import Link from 'next/link'

interface TerpeneData {
  name: string
  slug: string
  emoji: string
  primaryEffect: string
  aroma: string
  description: string
  effects: string[]
  strains: { name: string; slug: string }[]
  boilingPoint: string
  alsoFoundIn: string[]
}

const TERPENES: TerpeneData[] = [
  {
    name: 'Myrcene',
    slug: 'myrcene',
    emoji: '🥭',
    primaryEffect: 'Relaxing & Sedating',
    aroma: 'Earthy, musky, herbal with hints of tropical fruit',
    description:
      'Myrcene is the most abundant terpene found in cannabis and is responsible for the earthy, musky aroma common in many indica-leaning strains. It is known for its sedating and deeply relaxing effects, making it a go-to for evening use and sleep support. Research suggests myrcene may enhance the ability of cannabinoids to cross the blood-brain barrier.',
    effects: ['Relaxing', 'Sedating', 'Muscle relaxant', 'Anti-inflammatory'],
    strains: [
      { name: 'Blue Dream', slug: 'blue-dream' },
      { name: 'OG Kush', slug: 'og-kush' },
      { name: 'Granddaddy Purple', slug: 'granddaddy-purple' },
      { name: 'Grape Ape', slug: 'grape-ape' },
    ],
    boilingPoint: '334°F (168°C)',
    alsoFoundIn: ['Mangoes', 'Hops', 'Thyme', 'Lemongrass'],
  },
  {
    name: 'Limonene',
    slug: 'limonene',
    emoji: '🍋',
    primaryEffect: 'Uplifting & Stress Relief',
    aroma: 'Bright citrus, lemon zest, orange peel',
    description:
      'Limonene delivers the unmistakable citrus scent found in many popular cannabis strains. It is associated with elevated mood, stress relief, and a general sense of well-being. Studies have explored its potential as an anxiolytic and antidepressant compound, and it may also support the absorption of other terpenes through the skin and mucous membranes.',
    effects: ['Uplifting', 'Stress relief', 'Mood elevation', 'Anti-anxiety'],
    strains: [
      { name: 'Super Lemon Haze', slug: 'super-lemon-haze' },
      { name: 'Durban Poison', slug: 'durban-poison' },
      { name: 'Wedding Cake', slug: 'wedding-cake' },
      { name: 'Do-Si-Dos', slug: 'do-si-dos' },
    ],
    boilingPoint: '349°F (176°C)',
    alsoFoundIn: ['Lemons', 'Oranges', 'Juniper', 'Peppermint'],
  },
  {
    name: 'Caryophyllene',
    slug: 'caryophyllene',
    emoji: '🌶️',
    primaryEffect: 'Anti-inflammatory & Pain Relief',
    aroma: 'Peppery, spicy, warm with woody undertones',
    description:
      'Beta-caryophyllene is unique among terpenes because it directly binds to CB2 receptors in the endocannabinoid system, giving it properties similar to cannabinoids. It delivers a warm, peppery aroma and is prized for its anti-inflammatory and analgesic properties. This makes it particularly relevant for consumers seeking pain relief without heavy sedation.',
    effects: ['Anti-inflammatory', 'Pain relief', 'Stress reduction', 'Gastrointestinal support'],
    strains: [
      { name: 'GSC (Girl Scout Cookies)', slug: 'gsc' },
      { name: 'Bubba Kush', slug: 'bubba-kush' },
      { name: 'Chemdog', slug: 'chemdog' },
      { name: 'Original Glue', slug: 'original-glue' },
    ],
    boilingPoint: '266°F (130°C)',
    alsoFoundIn: ['Black pepper', 'Cloves', 'Cinnamon', 'Oregano'],
  },
  {
    name: 'Pinene',
    slug: 'pinene',
    emoji: '🌲',
    primaryEffect: 'Alertness & Memory',
    aroma: 'Fresh pine, crisp forest air, faintly herbal',
    description:
      'Alpha-pinene is the most widely occurring terpene in nature and is responsible for the familiar scent of pine forests. In cannabis, it promotes alertness, mental clarity, and may help counteract some of the short-term memory impairment associated with THC. It also acts as a bronchodilator, opening airways for easier breathing.',
    effects: ['Alertness', 'Memory retention', 'Bronchodilator', 'Anti-inflammatory'],
    strains: [
      { name: 'Jack Herer', slug: 'jack-herer' },
      { name: 'Blue Dream', slug: 'blue-dream' },
      { name: 'Snoop Dogg OG', slug: 'snoop-dogg-og' },
      { name: 'Critical Mass', slug: 'critical-mass' },
    ],
    boilingPoint: '311°F (155°C)',
    alsoFoundIn: ['Pine needles', 'Rosemary', 'Basil', 'Dill'],
  },
  {
    name: 'Linalool',
    slug: 'linalool',
    emoji: '💐',
    primaryEffect: 'Calming & Anxiety Relief',
    aroma: 'Floral, lavender, sweet with spicy undertones',
    description:
      'Linalool is the terpene that gives lavender its signature calming scent, and it plays a similar role in cannabis. It has been studied extensively for its anxiolytic, sedative, and anticonvulsant properties. Strains high in linalool are often recommended for consumers dealing with anxiety, insomnia, or chronic stress.',
    effects: ['Calming', 'Anxiety relief', 'Sedative', 'Anticonvulsant'],
    strains: [
      { name: 'Lavender', slug: 'lavender' },
      { name: 'Amnesia Haze', slug: 'amnesia-haze' },
      { name: 'Zkittlez', slug: 'zkittlez' },
      { name: 'Do-Si-Dos', slug: 'do-si-dos' },
    ],
    boilingPoint: '388°F (198°C)',
    alsoFoundIn: ['Lavender', 'Birch bark', 'Coriander', 'Sweet basil'],
  },
  {
    name: 'Humulene',
    slug: 'humulene',
    emoji: '🍺',
    primaryEffect: 'Appetite Suppression & Anti-inflammatory',
    aroma: 'Earthy, woody, subtly spicy',
    description:
      'Humulene is the terpene that gives hops their characteristic earthy, woody aroma, and it is found in many cannabis cultivars alongside caryophyllene. Unlike most cannabis compounds, humulene may suppress appetite rather than stimulate it. It also shows strong anti-inflammatory and antibacterial properties in preclinical studies.',
    effects: ['Appetite suppression', 'Anti-inflammatory', 'Antibacterial', 'Pain relief'],
    strains: [
      { name: 'White Widow', slug: 'white-widow' },
      { name: 'Headband', slug: 'headband' },
      { name: 'Sour Diesel', slug: 'sour-diesel' },
      { name: 'Skywalker OG', slug: 'skywalker-og' },
    ],
    boilingPoint: '388°F (198°C)',
    alsoFoundIn: ['Hops', 'Coriander', 'Ginseng', 'Sage'],
  },
  {
    name: 'Terpinolene',
    slug: 'terpinolene',
    emoji: '🌸',
    primaryEffect: 'Uplifting & Antioxidant',
    aroma: 'Floral, herbal, slightly piney and citrusy',
    description:
      'Terpinolene is less common as a dominant terpene but appears frequently in smaller amounts across many strains. It has a complex, multifaceted aroma that is floral, herbal, and subtly piney. Research suggests it carries antioxidant, anti-cancer, and mildly sedative properties. Strains dominant in terpinolene tend to deliver uplifting, creative effects.',
    effects: ['Uplifting', 'Antioxidant', 'Mildly sedative', 'Creative'],
    strains: [
      { name: 'Dutch Treat', slug: 'dutch-treat' },
      { name: 'Jack Herer', slug: 'jack-herer' },
      { name: 'Golden Pineapple', slug: 'golden-pineapple' },
      { name: 'XJ-13', slug: 'xj-13' },
    ],
    boilingPoint: '365°F (185°C)',
    alsoFoundIn: ['Nutmeg', 'Tea tree', 'Cumin', 'Lilac'],
  },
  {
    name: 'Ocimene',
    slug: 'ocimene',
    emoji: '🌿',
    primaryEffect: 'Decongestant & Anti-fungal',
    aroma: 'Sweet, herbal, woody with tropical notes',
    description:
      'Ocimene contributes a sweet, herbaceous aroma to cannabis and is found in many tropical and floral plant species. It has been studied for its decongestant, antiviral, and antifungal properties. While less commonly discussed than other terpenes, ocimene plays a supporting role in the entourage effect and appears in numerous popular strains.',
    effects: ['Decongestant', 'Anti-fungal', 'Antiviral', 'Anti-inflammatory'],
    strains: [
      { name: 'Clementine', slug: 'clementine' },
      { name: 'Strawberry Cough', slug: 'strawberry-cough' },
      { name: 'Golden Goat', slug: 'golden-goat' },
      { name: 'Space Queen', slug: 'space-queen' },
    ],
    boilingPoint: '122°F (50°C)',
    alsoFoundIn: ['Mint', 'Parsley', 'Orchids', 'Kumquats'],
  },
]

export default function TerpeneGuide() {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [compareMode, setCompareMode] = useState(false)
  const [compareSlots, setCompareSlots] = useState<[string | null, string | null]>([null, null])

  const handleCardClick = (slug: string) => {
    if (compareMode) {
      handleCompareSelect(slug)
      return
    }
    setExpanded(expanded === slug ? null : slug)
  }

  const handleCompareSelect = (slug: string) => {
    if (compareSlots[0] === slug) {
      setCompareSlots([null, compareSlots[1]])
    } else if (compareSlots[1] === slug) {
      setCompareSlots([compareSlots[0], null])
    } else if (!compareSlots[0]) {
      setCompareSlots([slug, compareSlots[1]])
    } else if (!compareSlots[1]) {
      setCompareSlots([compareSlots[0], slug])
    } else {
      setCompareSlots([slug, compareSlots[1]])
    }
  }

  const toggleCompare = () => {
    setCompareMode(!compareMode)
    setCompareSlots([null, null])
    setExpanded(null)
  }

  const compareA = TERPENES.find((t) => t.slug === compareSlots[0])
  const compareB = TERPENES.find((t) => t.slug === compareSlots[1])

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* What Are Terpenes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-3">
          What Are Terpenes?
        </h2>
        <p className="text-gray-600 leading-relaxed">
          Terpenes are naturally occurring aromatic compounds produced by
          cannabis and thousands of other plants. They are responsible for the
          unique scent and flavor of each strain, from citrus and pine to
          lavender and pepper. Beyond aroma, terpenes influence the effects of
          cannabis through the entourage effect, working synergistically with
          cannabinoids like THC and CBD to shape your experience. Understanding
          terpene profiles helps you predict how a strain will make you feel
          far more accurately than indica or sativa labels alone.
        </p>
      </div>

      {/* Compare Mode Toggle */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {compareMode ? 'Select Two Terpenes to Compare' : 'Explore Terpenes'}
        </h2>
        <button
          onClick={toggleCompare}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            compareMode
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-white border border-gray-300 text-gray-700 hover:border-green-500 hover:text-green-600'
          }`}
        >
          {compareMode ? 'Exit Compare' : 'Compare Terpenes'}
        </button>
      </div>

      {/* Terpene Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {TERPENES.map((terp) => {
          const isExpanded = expanded === terp.slug
          const isSelected =
            compareSlots[0] === terp.slug || compareSlots[1] === terp.slug

          return (
            <div key={terp.slug} className="flex flex-col">
              <button
                onClick={() => handleCardClick(terp.slug)}
                className={`bg-white rounded-xl shadow-sm border-2 p-5 text-left transition-all hover:shadow-md flex-1 ${
                  isSelected
                    ? 'ring-2 ring-green-500 bg-green-50 border-green-500'
                    : isExpanded
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <span className="text-3xl block mb-2">{terp.emoji}</span>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {terp.name}
                </h3>
                <p className="text-sm text-gray-500">{terp.primaryEffect}</p>
                {compareMode && isSelected && (
                  <span className="inline-block mt-2 text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">
                    Selected
                  </span>
                )}
              </button>
            </div>
          )
        })}
      </div>

      {/* Expanded Detail */}
      {expanded && !compareMode && (
        <TerpeneDetail
          terpene={TERPENES.find((t) => t.slug === expanded)!}
          onClose={() => setExpanded(null)}
        />
      )}

      {/* Comparison View */}
      {compareMode && compareA && compareB && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="bg-green-50 border-b border-green-200 px-6 py-4">
            <h3 className="text-lg font-bold text-gray-900">
              {compareA.name} vs. {compareB.name}
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-4 font-semibold text-gray-500 w-1/4">
                    Property
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-900 w-[37.5%]">
                    {compareA.emoji} {compareA.name}
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-900 w-[37.5%]">
                    {compareB.emoji} {compareB.name}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="p-4 text-gray-500 font-medium">Aroma</td>
                  <td className="p-4 text-gray-700">{compareA.aroma}</td>
                  <td className="p-4 text-gray-700">{compareB.aroma}</td>
                </tr>
                <tr>
                  <td className="p-4 text-gray-500 font-medium">
                    Primary Effect
                  </td>
                  <td className="p-4 text-gray-700">
                    {compareA.primaryEffect}
                  </td>
                  <td className="p-4 text-gray-700">
                    {compareB.primaryEffect}
                  </td>
                </tr>
                <tr>
                  <td className="p-4 text-gray-500 font-medium">Effects</td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {compareA.effects.map((e) => (
                        <span
                          key={e}
                          className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full"
                        >
                          {e}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {compareB.effects.map((e) => (
                        <span
                          key={e}
                          className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full"
                        >
                          {e}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="p-4 text-gray-500 font-medium">
                    Boiling Point
                  </td>
                  <td className="p-4 text-gray-700">
                    {compareA.boilingPoint}
                  </td>
                  <td className="p-4 text-gray-700">
                    {compareB.boilingPoint}
                  </td>
                </tr>
                <tr>
                  <td className="p-4 text-gray-500 font-medium">
                    Also Found In
                  </td>
                  <td className="p-4 text-gray-700">
                    {compareA.alsoFoundIn.join(', ')}
                  </td>
                  <td className="p-4 text-gray-700">
                    {compareB.alsoFoundIn.join(', ')}
                  </td>
                </tr>
                <tr>
                  <td className="p-4 text-gray-500 font-medium">
                    Top Strains
                  </td>
                  <td className="p-4">
                    {compareA.strains.map((s) => (
                      <Link
                        key={s.slug}
                        href={`/strains/${s.slug}`}
                        className="block text-green-600 hover:text-green-800 hover:underline text-sm"
                      >
                        {s.name}
                      </Link>
                    ))}
                  </td>
                  <td className="p-4">
                    {compareB.strains.map((s) => (
                      <Link
                        key={s.slug}
                        href={`/strains/${s.slug}`}
                        className="block text-green-600 hover:text-green-800 hover:underline text-sm"
                      >
                        {s.name}
                      </Link>
                    ))}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {compareMode && (!compareA || !compareB) && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center mb-8">
          <p className="text-green-700">
            {!compareA && !compareB
              ? 'Select two terpenes from the grid above to compare them side by side.'
              : 'Select one more terpene to see the comparison.'}
          </p>
        </div>
      )}
    </section>
  )
}

function TerpeneDetail({
  terpene,
  onClose,
}: {
  terpene: TerpeneData
  onClose: () => void
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-green-200 p-6 mb-8">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{terpene.emoji}</span>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              {terpene.name}
            </h3>
            <p className="text-green-600 font-medium">
              {terpene.primaryEffect}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 p-1"
          aria-label="Close detail"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <p className="text-gray-600 mb-6 leading-relaxed">
        {terpene.description}
      </p>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Aroma Profile
          </h4>
          <p className="text-gray-700">{terpene.aroma}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Boiling Point
          </h4>
          <p className="text-gray-700">{terpene.boilingPoint}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Effects
          </h4>
          <div className="flex flex-wrap gap-2">
            {terpene.effects.map((effect) => (
              <span
                key={effect}
                className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full"
              >
                {effect}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Also Found In
          </h4>
          <div className="flex flex-wrap gap-2">
            {terpene.alsoFoundIn.map((item) => (
              <span
                key={item}
                className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-100">
        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Strains High in {terpene.name}
        </h4>
        <div className="flex flex-wrap gap-2">
          {terpene.strains.map((strain) => (
            <Link
              key={strain.slug}
              href={`/strains/${strain.slug}`}
              className="text-sm bg-white border border-gray-200 text-green-600 hover:border-green-500 hover:bg-green-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              {strain.name}
            </Link>
          ))}
        </div>
        <Link
          href={`/strains/terpene/${terpene.slug}`}
          className="inline-block mt-4 text-sm text-green-600 hover:text-green-700 font-medium"
        >
          View all {terpene.name} strains &rarr;
        </Link>
      </div>
    </div>
  )
}
