import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us | Leefii',
  description: 'Get in touch with Leefii. We are here to help with questions about dispensaries, strains, or business inquiries.',
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
