'use client'

import { useState } from 'react'
import Link from 'next/link'

type ProductType = 'flower' | 'edibles' | 'concentrates' | 'vapes' | 'pre-rolls'

interface ProductConfig {
  label: string
  icon: string
  unitLabel: string
  unitSuffix: string
  avgPriceRange: [number, number]
  avgUnit: string
  defaultThc: number
  doseMg: number
  doseLabel: string
}

const PRODUCT_CONFIGS: Record<ProductType, ProductConfig> = {
  flower: {
    label: 'Flower',
    icon: '🌿',
    unitLabel: 'Quantity',
    unitSuffix: 'grams',
    avgPriceRange: [8, 15],
    avgUnit: 'per gram',
    defaultThc: 20,
    doseMg: 50,
    doseLabel: '~0.25g session',
  },
  edibles: {
    label: 'Edibles',
    icon: '🍪',
    unitLabel: 'Total THC',
    unitSuffix: 'mg total',
    avgPriceRange: [15, 25],
    avgUnit: 'per 100mg',
    defaultThc: 100,
    doseMg: 10,
    doseLabel: '10mg dose',
  },
  concentrates: {
    label: 'Concentrates',
    icon: '💎',
    unitLabel: 'Quantity',
    unitSuffix: 'grams',
    avgPriceRange: [25, 60],
    avgUnit: 'per gram',
    defaultThc: 75,
    doseMg: 25,
    doseLabel: '~0.03g dab',
  },
  vapes: {
    label: 'Vapes',
    icon: '💨',
    unitLabel: 'Cartridge size',
    unitSuffix: 'ml',
    avgPriceRange: [25, 50],
    avgUnit: 'per 0.5g cart',
    defaultThc: 85,
    doseMg: 5,
    doseLabel: '~3-second draw',
  },
  'pre-rolls': {
    label: 'Pre-rolls',
    icon: '🚬',
    unitLabel: 'Count',
    unitSuffix: 'units',
    avgPriceRange: [5, 15],
    avgUnit: 'each',
    defaultThc: 20,
    doseMg: 100,
    doseLabel: '1 pre-roll',
  },
}

interface Results {
  costPerGram: number | null
  costPerMgThc: number
  costPerDose: number
  totalThcMg: number
  valueRating: 'Great Value' | 'Fair' | 'Overpriced'
  ratingColor: string
}

export default function PriceCompare() {
  const [productType, setProductType] = useState<ProductType>('flower')
  const [price, setPrice] = useState('')
  const [quantity, setQuantity] = useState('')
  const [thc, setThc] = useState('')
  const [results, setResults] = useState<Results | null>(null)
  const [showRef, setShowRef] = useState(false)

  const config = PRODUCT_CONFIGS[productType]

  const calculate = () => {
    const p = parseFloat(price)
    const q = parseFloat(quantity)
    const t = parseFloat(thc) || config.defaultThc

    if (!p || p <= 0 || !q || q <= 0) return

    let totalThcMg: number
    let costPerGram: number | null = null
    let costPerMgThc: number
    let costPerDose: number

    if (productType === 'flower') {
      totalThcMg = q * (t / 100) * 1000
      costPerGram = p / q
      costPerMgThc = p / totalThcMg
      costPerDose = (config.doseMg * costPerMgThc)
    } else if (productType === 'edibles') {
      totalThcMg = q
      costPerMgThc = p / totalThcMg
      costPerDose = config.doseMg * costPerMgThc
    } else if (productType === 'concentrates') {
      totalThcMg = q * (t / 100) * 1000
      costPerGram = p / q
      costPerMgThc = p / totalThcMg
      costPerDose = config.doseMg * costPerMgThc
    } else if (productType === 'vapes') {
      totalThcMg = q * (t / 100) * 1000
      costPerGram = p / q
      costPerMgThc = p / totalThcMg
      costPerDose = config.doseMg * costPerMgThc
    } else {
      // pre-rolls
      totalThcMg = q * 0.75 * (t / 100) * 1000
      costPerGram = null
      costPerMgThc = p / totalThcMg
      costPerDose = p / q
    }

    // Determine value rating based on cost per mg THC
    let valueRating: Results['valueRating']
    let ratingColor: string

    if (costPerMgThc <= 0.04) {
      valueRating = 'Great Value'
      ratingColor = 'text-green-600 bg-green-50 border-green-200'
    } else if (costPerMgThc <= 0.08) {
      valueRating = 'Fair'
      ratingColor = 'text-yellow-600 bg-yellow-50 border-yellow-200'
    } else {
      valueRating = 'Overpriced'
      ratingColor = 'text-red-600 bg-red-50 border-red-200'
    }

    setResults({
      costPerGram,
      costPerMgThc,
      costPerDose,
      totalThcMg,
      valueRating,
      ratingColor,
    })
  }

  const handleProductChange = (type: ProductType) => {
    setProductType(type)
    setResults(null)
    setPrice('')
    setQuantity('')
    setThc('')
  }

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Product Type Selector */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Select Product Type
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {(Object.entries(PRODUCT_CONFIGS) as [ProductType, ProductConfig][]).map(
            ([key, cfg]) => (
              <button
                key={key}
                onClick={() => handleProductChange(key)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  productType === key
                    ? 'ring-2 ring-green-500 bg-green-50 border-green-500'
                    : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                }`}
              >
                <span className="text-2xl">{cfg.icon}</span>
                <span
                  className={`text-sm font-medium ${
                    productType === key ? 'text-green-700' : 'text-gray-700'
                  }`}
                >
                  {cfg.label}
                </span>
              </button>
            )
          )}
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Enter Product Details
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price ($)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                $
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {config.unitLabel} ({config.unitSuffix})
            </label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder={
                productType === 'edibles'
                  ? '100'
                  : productType === 'pre-rolls'
                    ? '1'
                    : '1.0'
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {productType === 'edibles' ? 'N/A (entered above)' : 'THC %'}
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={thc}
              onChange={(e) => setThc(e.target.value)}
              placeholder={`${config.defaultThc}`}
              disabled={productType === 'edibles'}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none disabled:bg-gray-100 disabled:text-gray-400"
            />
          </div>
        </div>
        <button
          onClick={calculate}
          className="mt-6 w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white rounded-lg px-6 py-3 font-semibold transition-colors"
        >
          Calculate Value
        </button>
      </div>

      {/* Results */}
      {results && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Your Results
            </h2>
            <span
              className={`px-4 py-1.5 rounded-full text-sm font-bold border ${results.ratingColor}`}
            >
              {results.valueRating}
            </span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {results.costPerGram !== null && (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">Cost per Gram</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${results.costPerGram.toFixed(2)}
                </p>
              </div>
            )}
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Cost per mg THC</p>
              <p className="text-2xl font-bold text-gray-900">
                ${results.costPerMgThc.toFixed(3)}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">
                Cost per Dose
              </p>
              <p className="text-2xl font-bold text-gray-900">
                ${results.costPerDose.toFixed(2)}
              </p>
              <p className="text-xs text-gray-400 mt-1">{config.doseLabel}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Total THC</p>
              <p className="text-2xl font-bold text-gray-900">
                {results.totalThcMg.toFixed(0)} mg
              </p>
            </div>
          </div>

          {/* Comparison bar */}
          <div className="border-t border-gray-100 pt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">
              vs. Average Market Price ({config.avgUnit})
            </p>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-gray-100 rounded-full h-3 relative">
                <div
                  className="absolute left-0 top-0 h-full bg-green-200 rounded-full"
                  style={{
                    width: '100%',
                  }}
                />
                {results.costPerGram !== null && (
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-green-600 rounded-full border-2 border-white shadow"
                    style={{
                      left: `${Math.min(Math.max(((results.costPerGram - config.avgPriceRange[0]) / (config.avgPriceRange[1] - config.avgPriceRange[0])) * 100, 0), 100)}%`,
                    }}
                  />
                )}
              </div>
              <span className="text-sm text-gray-500 whitespace-nowrap">
                ${config.avgPriceRange[0]}-${config.avgPriceRange[1]}{' '}
                {config.avgUnit}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Average Price Reference */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Average Market Prices (2026)
          </h2>
          <button
            onClick={() => setShowRef(!showRef)}
            className="text-sm text-green-600 hover:text-green-700 font-medium"
          >
            {showRef ? 'Hide' : 'Show'} Reference Chart
          </button>
        </div>
        {showRef && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 pr-4 font-semibold text-gray-700">
                    Product
                  </th>
                  <th className="text-left py-3 pr-4 font-semibold text-gray-700">
                    Avg Price Range
                  </th>
                  <th className="text-left py-3 pr-4 font-semibold text-gray-700">
                    Typical THC
                  </th>
                  <th className="text-left py-3 font-semibold text-gray-700">
                    Dose Size
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-3 pr-4">🌿 Flower</td>
                  <td className="py-3 pr-4">$8-15 / gram</td>
                  <td className="py-3 pr-4">15-30%</td>
                  <td className="py-3">~0.25g</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4">🍪 Edibles</td>
                  <td className="py-3 pr-4">$15-25 / 100mg</td>
                  <td className="py-3 pr-4">5-10mg / dose</td>
                  <td className="py-3">1 piece (10mg)</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4">💎 Concentrates</td>
                  <td className="py-3 pr-4">$25-60 / gram</td>
                  <td className="py-3 pr-4">60-90%</td>
                  <td className="py-3">~0.03g dab</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4">💨 Vapes</td>
                  <td className="py-3 pr-4">$25-50 / 0.5g cart</td>
                  <td className="py-3 pr-4">70-95%</td>
                  <td className="py-3">3-sec draw (~5mg)</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4">🚬 Pre-rolls</td>
                  <td className="py-3 pr-4">$5-15 each</td>
                  <td className="py-3 pr-4">15-30%</td>
                  <td className="py-3">1 pre-roll</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-2">Find Deals Near You</h2>
        <p className="text-green-100 mb-6 max-w-lg mx-auto">
          Now that you know what a fair price looks like, browse current
          dispensary deals and save even more.
        </p>
        <Link
          href="/deals"
          className="inline-block bg-white text-green-700 hover:bg-green-50 rounded-lg px-6 py-3 font-semibold transition-colors"
        >
          Browse Deals
        </Link>
      </div>
    </section>
  )
}
