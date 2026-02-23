'use client'

import { useState } from 'react'
import Image from 'next/image'

interface Badge {
  type: string
  name: string
  alt: string
  qualified: boolean
}

interface BadgeEmbedProps {
  dispensarySlug: string
  dispensaryName: string
  badges: Badge[]
}

type TabType = 'html' | 'wordpress' | 'shopify'
type SizeType = 'sm' | 'md' | 'lg'

const sizeConfig: Record<SizeType, { width: number; height: number; label: string; suffix: string }> = {
  sm: { width: 120, height: 40, label: 'Small', suffix: 'sm' },
  md: { width: 180, height: 60, label: 'Medium', suffix: 'md' },
  lg: { width: 240, height: 80, label: 'Large', suffix: 'lg' },
}

function getEmbedCode(
  tab: TabType,
  badgeType: string,
  alt: string,
  slug: string,
  size: SizeType,
): string {
  const { width, height, suffix } = sizeConfig[size]
  const imgSrc = `https://leefii.com/badges/${badgeType}-${suffix}.svg`
  const profileUrl = `https://leefii.com/dispensary/${slug}`

  if (tab === 'html') {
    return `<a href="${profileUrl}" target="_blank" rel="noopener">\n  <img src="${imgSrc}" alt="${alt}" width="${width}" height="${height}" />\n</a>`
  }

  if (tab === 'wordpress') {
    return `<!-- Add this to a Custom HTML widget or block -->\n<a href="${profileUrl}" target="_blank" rel="noopener">\n  <img src="${imgSrc}" alt="${alt}" width="${width}" height="${height}" />\n</a>`
  }

  // Shopify Liquid
  return `{% comment %}Add this to your Shopify theme{% endcomment %}\n<a href="${profileUrl}" target="_blank" rel="noopener">\n  <img src="${imgSrc}" alt="${alt}" width="${width}" height="${height}" loading="lazy" />\n</a>`
}

export default function BadgeEmbed({ dispensarySlug, dispensaryName, badges }: BadgeEmbedProps) {
  const [activeTab, setActiveTab] = useState<TabType>('html')
  const [selectedSize, setSelectedSize] = useState<SizeType>('md')
  const [copiedBadge, setCopiedBadge] = useState<string | null>(null)

  const tabs: { key: TabType; label: string }[] = [
    { key: 'html', label: 'HTML' },
    { key: 'wordpress', label: 'WordPress' },
    { key: 'shopify', label: 'Shopify' },
  ]

  const sizes: SizeType[] = ['sm', 'md', 'lg']

  const handleCopy = async (code: string, badgeType: string) => {
    try {
      await navigator.clipboard.writeText(code)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = code
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
    setCopiedBadge(badgeType)
    setTimeout(() => setCopiedBadge(null), 2000)
  }

  return (
    <div className="space-y-8">
      {badges.map((badge) => {
        const code = getEmbedCode(activeTab, badge.type, badge.alt, dispensarySlug, selectedSize)
        const { suffix } = sizeConfig[selectedSize]
        const svgPath = `/badges/${badge.type}-${suffix}.svg`

        return (
          <div
            key={badge.type}
            className={`bg-white rounded-xl shadow-sm border p-6 ${
              badge.qualified ? 'border-green-200' : 'border-gray-200 opacity-75'
            }`}
          >
            {/* Badge Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Image
                  src={`/badges/${badge.type}-md.svg`}
                  alt={badge.alt}
                  width={180}
                  height={60}
                  className="rounded"
                />
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{badge.name}</h3>
                  {badge.qualified ? (
                    <span className="inline-flex items-center text-sm text-green-700 font-medium">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Qualified
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-sm text-gray-500 font-medium">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      Not Yet Qualified
                    </span>
                  )}
                </div>
              </div>
            </div>

            {badge.qualified ? (
              <>
                {/* Size Selector */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm text-gray-500 font-medium">Size:</span>
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        selectedSize === size
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {sizeConfig[size].label}
                    </button>
                  ))}
                </div>

                {/* Tab Switcher */}
                <div className="flex border-b mb-4">
                  {tabs.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`px-4 py-2 text-sm font-medium transition-colors -mb-px ${
                        activeTab === tab.key
                          ? 'border-b-2 border-green-500 text-green-700'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Code Block */}
                <div className="relative">
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                    <code>{code}</code>
                  </pre>
                  <button
                    onClick={() => handleCopy(code, badge.type)}
                    className={`absolute top-2 right-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      copiedBadge === badge.type
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                    }`}
                  >
                    {copiedBadge === badge.type ? 'Copied!' : 'Copy'}
                  </button>
                </div>

                {/* Badge Preview at Selected Size */}
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-2">Preview at {sizeConfig[selectedSize].label} size:</p>
                  <Image
                    src={svgPath}
                    alt={badge.alt}
                    width={sizeConfig[selectedSize].width}
                    height={sizeConfig[selectedSize].height}
                  />
                </div>
              </>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  {badge.type === 'verified-dispensary' && (
                    <>To earn this badge, your dispensary must complete the Leefii verification process. <a href="/sell" className="text-green-600 hover:text-green-700 font-medium">Claim your listing</a> to get started.</>
                  )}
                  {badge.type === 'top-rated' && (
                    <>This badge requires a rating of 4.5 stars or higher on Leefii. Encourage your customers to leave reviews to boost your rating.</>
                  )}
                  {badge.type === 'verified-delivery' && (
                    <>This badge is for dispensaries with a confirmed delivery service. Update your listing to include delivery if you offer it.</>
                  )}
                  {badge.type === 'city-choice' && (
                    <>This badge is awarded to the highest-rated verified dispensary in each city. Continue improving your rating and reviews to earn this distinction.</>
                  )}
                </p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
