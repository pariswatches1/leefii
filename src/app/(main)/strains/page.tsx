import { prisma } from '@/lib/prisma';
import { Metadata } from 'next';
import StrainsClient from './StrainsClient';

export const metadata: Metadata = {
  title: 'Cannabis Strains - Sativa, Indica & Hybrid | Leefii',
  description: 'Explore 6,000+ cannabis strains. Find the perfect sativa, indica, or hybrid strain based on effects, flavors, and THC/CBD content.',
};

async function getInitialData(type: string, effect: string) {
  const where: any = { isActive: true };
  
  if (type && type !== 'all') {
    where.type = type.toUpperCase();
  }
  
  if (effect) {
    where.effects = { has: effect };
  }

  const [strains, total, sativa, indica, hybrid] = await Promise.all([
    prisma.strain.findMany({
      where,
      orderBy: { rating: 'desc' },
      take: 48,
    }),
    prisma.strain.count({ where: { isActive: true } }),
    prisma.strain.count({ where: { isActive: true, type: 'SATIVA' } }),
    prisma.strain.count({ where: { isActive: true, type: 'INDICA' } }),
    prisma.strain.count({ where: { isActive: true, type: 'HYBRID' } }),
  ]);

  // Get filtered count
  const filteredCount = await prisma.strain.count({ where });

  return { 
    strains, 
    counts: { total, sativa, indica, hybrid },
    filteredCount 
  };
}

export default async function StrainsPage({
  searchParams,
}: {
  searchParams: { type?: string; effect?: string };
}) {
  const type = searchParams.type || 'all';
  const effect = searchParams.effect || '';

  const { strains, counts, filteredCount } = await getInitialData(type, effect);

  return (
    <StrainsClient 
      initialStrains={strains} 
      counts={counts} 
      filteredCount={filteredCount}
      initialType={type} 
      initialEffect={effect} 
    />
  );
}
