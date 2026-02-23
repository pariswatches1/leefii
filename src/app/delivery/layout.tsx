import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cannabis Delivery Near You — Order Weed Online | Leefii',
  description:
    'Find licensed cannabis delivery dispensaries near you. Order weed online from trusted dispensaries in legal states. Compare menus, delivery times, and fees. Must be 21+ with valid ID.',
  openGraph: {
    title: 'Cannabis Delivery Near You — Order Weed Online | Leefii',
    description:
      'Find licensed cannabis delivery dispensaries near you. Order weed online from trusted dispensaries in legal states. Compare menus, delivery times, and fees.',
    url: 'https://leefii.com/delivery',
    siteName: 'Leefii',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cannabis Delivery Near You — Order Weed Online | Leefii',
    description:
      'Find licensed cannabis delivery dispensaries near you. Order weed online from trusted dispensaries in legal states. Compare menus, delivery times, and fees.',
  },
  alternates: {
    canonical: 'https://leefii.com/delivery',
  },
}

export default function DeliveryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
