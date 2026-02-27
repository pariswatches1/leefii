import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Cannabis Journal',
  description: 'Track your cannabis experiences, strains, and effects with Leefii Journal.',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export default function JournalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
