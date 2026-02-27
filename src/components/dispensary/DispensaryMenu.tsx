'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

export interface MenuProductData {
  id: string
  name: string
  brand: string | null
  category: string
  subcategory: string | null
  price: number
  originalPrice: number | null
  weight: string | null
  thcContent: string | null
  cbdContent: string | null
  strainType: string | null
  strain: string | null
  imageUrl: string | null
  isOnSale: boolean
  lastScrapedAt: string
}

const CATEGORY_EMOJIS: Record<string, string> = {
  flower: '🌿',
  edibles: '🍪',
  vapes: '💨',
  concentrates: '💎',
  'pre-rolls': '🚬',
  tinctures: '💧',
  topicals: '🧴',
}

const CATEGORY_ORDER = ['flower', 'pre-rolls', 'edibles', 'vapes', 'concentrates', 'tinctures', 'topicals']

export default function DispensaryMenu({
  products,
  dispensaryName,
  dispensarySlug,
  lastScrapedAt,
}: {
  products: MenuProductData[]
  dispensaryName: string
  dispensarySlug: string
  lastScrapedAt: string | null
}) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'name'>('price_asc')
  const [showSaleOnly, setShowSaleOnly] = useState(false)

  // Compute categories with counts
  const categories = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const p of products) {
      counts[p.category] = (counts[p.category] || 0) + 1
    }
    return CATEGORY_ORDER
      .filter((cat) => counts[cat])
      .map((cat) => ({ name: cat, count: counts[cat] }))
      .concat(
        Object.keys(counts)
          .filter((cat) => !CATEGORY_ORDER.includes(cat))
          .map((cat) => ({ name: cat, count: counts[cat] }))
      )
  }, [products])

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products
    if (activeCategory) {
      filtered = filtered.filter((p) => p.category === activeCategory)
    }
    if (showSaleOnly) {
      filtered = filtered.filter((p) => p.isOnSale)
    }
    const sorted = [...filtered]
    if (sortBy === 'price_asc') sorted.sort((a, b) => a.price - b.price)
    else if (sortBy === 'price_desc') sorted.sort((a, b) => b.price - a.price)
    else sorted.sort((a, b) => a.name.localeCompare(b.name))
    return sorted
  }, [products, activeCategory, sortBy, showSaleOnly])

  // Price stats
  const stats = useMemo(() => {
    if (filteredProducts.length === 0) return null
    const prices = filteredProducts.map((p) => p.price)
    return {
      cheapest: Math.min(...prices),
      average: prices.reduce((s, p) => s + p, 0) / prices.length,
      onSaleCount: filteredProducts.filter((p) => p.isOnSale).length,
    }
  }, [filteredProducts])

  // Freshness
  const freshness = useMemo(() => {
    if (!lastScrapedAt) return null
    const scraped = new Date(lastScrapedAt)
    const now = new Date()
    const hoursAgo = Math.floor((now.getTime() - scraped.getTime()) / (1000 * 60 * 60))
    if (hoursAgo < 1) return { label: 'Updated just now', color: 'text-green-600', bg: 'bg-green-50' }
    if (hoursAgo < 24) return { label: `Updated ${hoursAgo}h ago`, color: 'text-green-600', bg: 'bg-green-50' }
    const daysAgo = Math.floor(hoursAgo / 24)
    if (daysAgo <= 3) return { label: `Updated ${daysAgo}d ago`, color: 'text-yellow-600', bg: 'bg-yellow-50' }
    return { label: `Updated ${daysAgo}d ago`, color: 'text-orange-600', bg: 'bg-orange-50' }
  }, [lastScrapedAt])

  const saleCount = products.filter((p) => p.isOnSale).length

  return (
    <div>
      {/* Header with stats */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-gray-900">Menu &amp; Prices</h2>
          <span className="text-sm text-gray-500">
            {products.length} {products.length === 1 ? 'product' : 'products'}
          </span>
          {freshness && (
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${freshness.color} ${freshness.bg}`}>
              {freshness.label}
            </span>
          )}
        </div>
        {stats && (
          <div className="flex items-center gap-3 text-sm">
            <span className="text-green-600 font-medium">
              From ${stats.cheapest.toFixed(2)}
            </span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-500">
              Avg ${stats.average.toFixed(2)}
            </span>
          </div>
        )}
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
            activeCategory === null
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All ({products.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setActiveCategory(cat.name === activeCategory ? null : cat.name)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
              activeCategory === cat.name
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {CATEGORY_EMOJIS[cat.name] || '🌱'} {cat.name} ({cat.count})
          </button>
        ))}

        {/* Divider */}
        <div className="w-px h-6 bg-gray-300 mx-1 hidden sm:block" />

        {/* Sort dropdown */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'price_asc' | 'price_desc' | 'name')}
          className="px-3 py-1.5 border border-gray-300 rounded-full text-sm bg-white text-gray-700 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
        >
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="name">Name: A-Z</option>
        </select>

        {/* On Sale toggle */}
        {saleCount > 0 && (
          <button
            onClick={() => setShowSaleOnly(!showSaleOnly)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
              showSaleOnly
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🔥 On Sale ({saleCount})
          </button>
        )}
      </div>

      {/* Product list */}
      {filteredProducts.length > 0 ? (
        <div className="space-y-2">
          {filteredProducts.map((product) => {
            const discountPct =
              product.originalPrice && product.isOnSale && product.originalPrice > product.price
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : null

            return (
              <div
                key={product.id}
                className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                {/* Image / emoji */}
                {product.imageUrl ? (
                  <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-gray-200">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center shrink-0">
                    <span className="text-2xl">{CATEGORY_EMOJIS[product.category] || '🌱'}</span>
                  </div>
                )}

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-medium text-gray-900 text-sm leading-snug truncate">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        {product.brand && (
                          <span className="text-xs text-gray-500">{product.brand}</span>
                        )}
                        {product.weight && (
                          <span className="text-xs text-gray-400">{product.weight}</span>
                        )}
                        {product.strainType && (
                          <span className="text-xs px-1.5 py-0.5 rounded bg-gray-200 text-gray-600 capitalize">
                            {product.strainType}
                          </span>
                        )}
                        {product.thcContent && (
                          <span className="text-xs px-1.5 py-0.5 rounded bg-green-100 text-green-700">
                            THC: {product.thcContent}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right shrink-0">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base font-bold text-green-600">
                          ${product.price.toFixed(2)}
                        </span>
                        {product.originalPrice && product.isOnSale && product.originalPrice > product.price && (
                          <span className="text-xs text-gray-400 line-through">
                            ${product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      {discountPct && discountPct > 0 && (
                        <span className="text-xs text-red-500 font-medium">
                          {discountPct}% off
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-xl">
          <p className="text-gray-500 text-sm">
            {showSaleOnly
              ? 'No sale items in this category. Try turning off the sale filter.'
              : 'No products found for this category.'}
          </p>
        </div>
      )}

      {/* CTA to shop page */}
      <div className="mt-4 text-center">
        <Link
          href={`/shop?dispensary=${dispensarySlug}`}
          className="text-sm text-green-600 hover:text-green-700 font-medium"
        >
          Compare prices with other dispensaries →
        </Link>
      </div>
    </div>
  )
}
