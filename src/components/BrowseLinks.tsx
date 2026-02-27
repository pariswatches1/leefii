import Link from 'next/link'

export interface LinkGroup {
  title: string
  links: { href: string; label: string }[]
}

/**
 * Reusable internal linking component.
 * Renders organized groups of internal links for SEO cross-linking.
 * Use on detail pages (dispensary, strain, blog) to create crawl paths.
 */
export default function BrowseLinks({
  groups,
  className = '',
}: {
  groups: LinkGroup[]
  className?: string
}) {
  return (
    <section className={`${className}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <div key={group.title}>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              {group.title}
            </h3>
            <ul className="space-y-1">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-green-600 transition"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
