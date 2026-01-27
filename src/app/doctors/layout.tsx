import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Medical Marijuana Doctors Near You | Get Your MMJ Card | Leefii',
  description: 'Find licensed medical marijuana doctors near you. Get your MMJ card with telehealth or in-person consultations. 650+ verified physicians across all legal states.',
  keywords: [
    'medical marijuana doctors',
    'MMJ card',
    'medical marijuana card',
    'cannabis doctors near me',
    'marijuana evaluation',
    'medical cannabis prescription',
    'telehealth marijuana doctor',
    'medical marijuana certification',
  ],
  openGraph: {
    title: 'Medical Marijuana Doctors Near You | Leefii',
    description: 'Find licensed medical marijuana doctors near you. Get your MMJ card with telehealth or in-person consultations.',
    url: 'https://leefii.com/doctors',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Medical Marijuana Doctors Near You | Leefii',
    description: 'Find licensed medical marijuana doctors near you. Get your MMJ card with telehealth or in-person consultations.',
  },
  alternates: {
    canonical: 'https://leefii.com/doctors',
  },
};

export default function DoctorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
