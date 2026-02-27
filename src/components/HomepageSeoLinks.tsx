import Link from 'next/link'

/**
 * Server-rendered internal linking section for the homepage.
 * Provides crawlable paths to all major page types for search engines.
 */
export default function HomepageSeoLinks() {
  return (
    <section className="bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 p-6 lg:p-8">
      <h2 className="text-lg font-bold text-gray-900 mb-6">
        Explore Cannabis on Leefii
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
        {/* Browse by State */}
        <div>
          <h3 className="text-sm font-semibold text-gray-800 mb-2">
            Popular States
          </h3>
          <ul className="space-y-1 text-sm">
            {[
              { href: '/dispensaries/california', label: 'California' },
              { href: '/dispensaries/colorado', label: 'Colorado' },
              { href: '/dispensaries/florida', label: 'Florida' },
              { href: '/dispensaries/michigan', label: 'Michigan' },
              { href: '/dispensaries/new-york', label: 'New York' },
              { href: '/dispensaries/illinois', label: 'Illinois' },
              { href: '/dispensaries/arizona', label: 'Arizona' },
              { href: '/dispensaries/oregon', label: 'Oregon' },
              { href: '/dispensaries/washington', label: 'Washington' },
              { href: '/dispensaries/new-jersey', label: 'New Jersey' },
            ].map((s) => (
              <li key={s.href}>
                <Link href={s.href} className="text-gray-700 hover:text-lime-800 transition">
                  {s.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/dispensaries" className="text-lime-700 font-medium hover:text-lime-800 transition">
                All States &rarr;
              </Link>
            </li>
          </ul>
        </div>

        {/* Browse by Strain Type */}
        <div>
          <h3 className="text-sm font-semibold text-gray-800 mb-2">
            Strain Types
          </h3>
          <ul className="space-y-1 text-sm">
            {[
              { href: '/strains/indica', label: 'Indica Strains' },
              { href: '/strains/sativa', label: 'Sativa Strains' },
              { href: '/strains/hybrid', label: 'Hybrid Strains' },
            ].map((s) => (
              <li key={s.href}>
                <Link href={s.href} className="text-gray-700 hover:text-lime-800 transition">
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>

          <h3 className="text-sm font-semibold text-gray-800 mt-4 mb-2">
            By Effect
          </h3>
          <ul className="space-y-1 text-sm">
            {[
              { href: '/strains/effects/relaxed', label: 'Relaxed' },
              { href: '/strains/effects/energetic', label: 'Energetic' },
              { href: '/strains/effects/happy', label: 'Happy' },
              { href: '/strains/effects/creative', label: 'Creative' },
              { href: '/strains/effects/sleepy', label: 'Sleepy' },
              { href: '/strains/effects/focused', label: 'Focused' },
            ].map((e) => (
              <li key={e.href}>
                <Link href={e.href} className="text-gray-700 hover:text-lime-800 transition">
                  {e.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/strains" className="text-lime-700 font-medium hover:text-lime-800 transition">
                All Strains &rarr;
              </Link>
            </li>
          </ul>
        </div>

        {/* Popular Cities */}
        <div>
          <h3 className="text-sm font-semibold text-gray-800 mb-2">
            Popular Cities
          </h3>
          <ul className="space-y-1 text-sm">
            {[
              { href: '/dispensaries/california/los-angeles', label: 'Los Angeles, CA' },
              { href: '/dispensaries/colorado/denver', label: 'Denver, CO' },
              { href: '/dispensaries/arizona/phoenix', label: 'Phoenix, AZ' },
              { href: '/dispensaries/michigan/detroit', label: 'Detroit, MI' },
              { href: '/dispensaries/illinois/chicago', label: 'Chicago, IL' },
              { href: '/dispensaries/california/san-francisco', label: 'San Francisco, CA' },
              { href: '/dispensaries/oregon/portland', label: 'Portland, OR' },
              { href: '/dispensaries/washington/seattle', label: 'Seattle, WA' },
              { href: '/dispensaries/florida/miami', label: 'Miami, FL' },
              { href: '/dispensaries/new-york/new-york-city', label: 'New York City, NY' },
            ].map((c) => (
              <li key={c.href}>
                <Link href={c.href} className="text-gray-700 hover:text-lime-800 transition">
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Delivery + Doctors */}
        <div>
          <h3 className="text-sm font-semibold text-gray-800 mb-2">
            Delivery
          </h3>
          <ul className="space-y-1 text-sm">
            {[
              { href: '/delivery/california', label: 'California Delivery' },
              { href: '/delivery/colorado', label: 'Colorado Delivery' },
              { href: '/delivery/michigan', label: 'Michigan Delivery' },
              { href: '/delivery/oregon', label: 'Oregon Delivery' },
            ].map((d) => (
              <li key={d.href}>
                <Link href={d.href} className="text-gray-700 hover:text-lime-800 transition">
                  {d.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/delivery" className="text-lime-700 font-medium hover:text-lime-800 transition">
                All Delivery &rarr;
              </Link>
            </li>
          </ul>

          <h3 className="text-sm font-semibold text-gray-800 mt-4 mb-2">
            MMJ Doctors
          </h3>
          <ul className="space-y-1 text-sm">
            {[
              { href: '/doctors/florida', label: 'Florida Doctors' },
              { href: '/doctors/california', label: 'California Doctors' },
              { href: '/doctors/new-york', label: 'New York Doctors' },
              { href: '/doctors/ohio', label: 'Ohio Doctors' },
            ].map((d) => (
              <li key={d.href}>
                <Link href={d.href} className="text-gray-700 hover:text-lime-800 transition">
                  {d.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/doctors" className="text-lime-700 font-medium hover:text-lime-800 transition">
                All Doctors &rarr;
              </Link>
            </li>
          </ul>
        </div>

        {/* Resources + Tools */}
        <div>
          <h3 className="text-sm font-semibold text-gray-800 mb-2">
            Resources
          </h3>
          <ul className="space-y-1 text-sm">
            {[
              { href: '/shop', label: 'Shop & Compare Prices' },
              { href: '/deals', label: 'Cannabis Deals' },
              { href: '/laws', label: 'Cannabis Laws by State' },
              { href: '/tools', label: 'Tools & Calculators' },
              { href: '/compare', label: 'Compare Platforms' },
              { href: '/quiz', label: 'Strain Finder Quiz' },
              { href: '/medical-card/qualifying-conditions', label: 'Medical Card Guide' },
              { href: '/blog', label: 'Cannabis Blog' },
              { href: '/news', label: 'Industry News' },
              { href: '/near-me', label: 'Dispensaries Near Me' },
            ].map((r) => (
              <li key={r.href}>
                <Link href={r.href} className="text-gray-700 hover:text-lime-800 transition">
                  {r.label}
                </Link>
              </li>
            ))}
          </ul>

          <h3 className="text-sm font-semibold text-gray-800 mt-4 mb-2">
            For Businesses
          </h3>
          <ul className="space-y-1 text-sm">
            <li>
              <Link href="/sell" className="text-gray-700 hover:text-lime-800 transition">
                Sell on Leefii
              </Link>
            </li>
            <li>
              <Link href="/badges" className="text-gray-700 hover:text-lime-800 transition">
                Dispensary Badges
              </Link>
            </li>
            <li>
              <Link href="/api-docs" className="text-gray-700 hover:text-lime-800 transition">
                Developer API
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Strains for Conditions - Additional SEO links */}
      <div className="mt-6 pt-4 border-t border-white/30">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">
          Strains by Condition
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            { href: '/strains/conditions/anxiety', label: 'Anxiety' },
            { href: '/strains/conditions/chronic-pain', label: 'Chronic Pain' },
            { href: '/strains/conditions/insomnia', label: 'Insomnia' },
            { href: '/strains/conditions/depression', label: 'Depression' },
            { href: '/strains/conditions/stress', label: 'Stress' },
            { href: '/strains/conditions/ptsd', label: 'PTSD' },
            { href: '/strains/conditions/nausea', label: 'Nausea' },
            { href: '/strains/conditions/inflammation', label: 'Inflammation' },
            { href: '/strains/conditions/arthritis', label: 'Arthritis' },
            { href: '/strains/conditions/muscle-spasms', label: 'Muscle Spasms' },
          ].map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="px-3 py-1 bg-white/30 rounded-full text-xs text-gray-700 hover:bg-white/60 hover:text-lime-800 transition"
            >
              {c.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Terpenes row */}
      <div className="mt-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">
          Browse by Terpene
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            { href: '/strains/terpene/myrcene', label: 'Myrcene' },
            { href: '/strains/terpene/limonene', label: 'Limonene' },
            { href: '/strains/terpene/caryophyllene', label: 'Caryophyllene' },
            { href: '/strains/terpene/pinene', label: 'Pinene' },
            { href: '/strains/terpene/linalool', label: 'Linalool' },
            { href: '/strains/terpene/humulene', label: 'Humulene' },
            { href: '/strains/terpene/terpinolene', label: 'Terpinolene' },
            { href: '/strains/terpene/ocimene', label: 'Ocimene' },
          ].map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="px-3 py-1 bg-white/30 rounded-full text-xs text-gray-700 hover:bg-white/60 hover:text-lime-800 transition"
            >
              {t.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
