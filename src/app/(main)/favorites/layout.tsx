import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Favorites',
  description: 'View your saved dispensaries and strains on Leefii.',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export default function FavoritesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
