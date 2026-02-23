import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Reviews from '@/components/Reviews';
import FavoriteButton from '@/components/FavoriteButton';

export const revalidate = 86400;

type Props = {
  params: { slug: string };
};

async function getStrain(slug: string) {
  const strain = await prisma.strain.findUnique({
    where: { slug },
  });
  return strain;
}

async function getSimilarStrains(strain: { type: string; effects: string[]; slug: string }) {
  const similar = await prisma.strain.findMany({
    where: {
      isActive: true,
      slug: { not: strain.slug },
      type: strain.type as any,
      effects: { hasSome: strain.effects.slice(0, 3) },
    },
    orderBy: [{ rating: 'desc' }, { reviewsCount: 'desc' }],
    take: 6,
    select: {
      slug: true,
      name: true,
      type: true,
      thcMin: true,
      thcMax: true,
      rating: true,
      reviewsCount: true,
      effects: true,
    },
  });
  return similar;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const strain = await getStrain(params.slug);

  if (!strain) {
    return { title: 'Strain Not Found | Leefii' };
  }

  const thcText = strain.thcMax ? `${strain.thcMax}%` : 'N/A';
  const topEffects = strain.effects?.slice(0, 3).join(', ') || 'various effects';
  const typeLower = strain.type.toLowerCase();
  const description = `${strain.name} is a ${typeLower} strain with ${thcText} THC. Known for ${topEffects}. Find dispensaries carrying ${strain.name} near you on Leefii.`;

  return {
    title: `${strain.name} Strain — Effects, THC, Reviews | Leefii`,
    description,
    keywords: [
      strain.name,
      `${strain.name} strain`,
      `${strain.name} effects`,
      `${strain.name} THC`,
      `${typeLower} strain`,
      'cannabis strain',
      ...(strain.effects || []),
      ...(strain.flavors || []),
    ],
    openGraph: {
      title: `${strain.name} Strain — Effects, THC, Reviews | Leefii`,
      description,
      url: `https://leefii.com/strains/${strain.slug}`,
      type: 'article',
      siteName: 'Leefii',
      images: [{ url: 'https://leefii.com/og-image.png', width: 1200, height: 630, alt: `${strain.name} Strain` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${strain.name} Strain — Effects, THC, Reviews | Leefii`,
      description,
    },
    alternates: {
      canonical: `https://leefii.com/strains/${strain.slug}`,
    },
  };
}

const EFFECT_ICONS: Record<string, string> = {
  Relaxed: '😌', Energetic: '⚡', Happy: '😊', Creative: '🎨',
  Focused: '🎯', Sleepy: '😴', Hungry: '🍕', Euphoric: '🌈',
  Uplifted: '🙌', Calm: '🧘', Talkative: '💬', Giggly: '😂',
  Tingly: '✨', Aroused: '💕', Peaceful: '☮️',
};

const FLAVOR_ICONS: Record<string, string> = {
  Earthy: '🌍', Citrus: '🍋', Sweet: '🍬', Pine: '🌲', Berry: '🫐',
  Diesel: '⛽', Woody: '🪵', Floral: '🌸', Spicy: '🌶️', Herbal: '🌿',
  Tropical: '🌴', Lemon: '🍋', Grape: '🍇', Pungent: '💨', Mint: '🌱',
  Cheese: '🧀', Skunk: '🦨', Honey: '🍯', Coffee: '☕', Vanilla: '🍦',
  Blueberry: '🫐', Strawberry: '🍓', Mango: '🥭', Pineapple: '🍍',
  Orange: '🍊', Cherry: '🍒', Apple: '🍎', Banana: '🍌', Peach: '🍑',
  Chocolate: '🍫', Lavender: '💜', Rose: '🌹', Lime: '🍈', Nutty: '🥜',
  Butter: '🧈', Coconut: '🥥', Watermelon: '🍉', Grapefruit: '🍊',
  Fruity: '🍑', Creamy: '🥛', Garlic: '🧄', Ammonia: '⚗️', Chemical: '🧪',
};

const CONDITION_SLUGS: Record<string, string> = {
  'Anxiety': 'anxiety', 'Depression': 'depression', 'Stress': 'stress',
  'Chronic Pain': 'chronic-pain', 'Insomnia': 'insomnia', 'PTSD': 'ptsd',
  'Nausea': 'nausea', 'Appetite Loss': 'appetite-loss',
  'Inflammation': 'inflammation', 'Muscle Spasms': 'muscle-spasms',
  'Arthritis': 'arthritis',
};

const EFFECT_SLUGS: Record<string, string> = {
  'Relaxed': 'relaxed', 'Energetic': 'energetic', 'Happy': 'happy',
  'Creative': 'creative', 'Focused': 'focused', 'Sleepy': 'sleepy',
  'Hungry': 'hungry', 'Euphoric': 'euphoric', 'Uplifted': 'uplifted',
  'Calm': 'calm', 'Talkative': 'talkative', 'Giggly': 'giggly',
  'Tingly': 'tingly', 'Aroused': 'aroused', 'Peaceful': 'peaceful',
};

export default async function StrainPage({ params }: Props) {
  const strain = await getStrain(params.slug);

  if (!strain) {
    notFound();
  }

  const similarStrains = await getSimilarStrains(strain);

  const typeLower = strain.type.charAt(0) + strain.type.slice(1).toLowerCase();
  const typeSlug = strain.type.toLowerCase();

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'SATIVA': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'INDICA': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'HYBRID': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTypeBg = (type: string) => {
    switch (type) {
      case 'SATIVA': return 'from-orange-500 to-orange-600';
      case 'INDICA': return 'from-purple-500 to-purple-600';
      case 'HYBRID': return 'from-green-500 to-green-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const thcText = strain.thcMax ? `${strain.thcMin || 0}-${strain.thcMax}%` : 'N/A';
  const topEffects = strain.effects?.slice(0, 3).join(', ') || 'various effects';
  const quickSummary = strain.description
    || `${strain.name} is a ${typeLower.toLowerCase()} cannabis strain${strain.genetics ? ` bred from ${strain.genetics}` : ''}. With THC levels around ${thcText}, this strain is known for its ${topEffects.toLowerCase()} effects. ${strain.flavors?.length ? `It features ${strain.flavors.slice(0, 3).join(', ').toLowerCase()} flavors` : 'It offers a well-rounded flavor profile'} that cannabis enthusiasts appreciate. Whether you are a seasoned consumer or new to cannabis, ${strain.name} offers a distinctive experience worth trying.`;

  // FAQ data
  const faqs = [
    {
      question: `Is ${strain.name} good for anxiety?`,
      answer: strain.conditions?.includes('Anxiety')
        ? `Yes, ${strain.name} is commonly reported by users to help with anxiety. As a ${typeLower.toLowerCase()} strain, it may provide calming effects. Always consult a healthcare professional before using cannabis for medical purposes.`
        : `${strain.name} is not primarily known for anxiety relief, but individual experiences vary. Its ${topEffects.toLowerCase()} effects may still provide some benefit. Consult a healthcare professional for personalized advice.`,
    },
    {
      question: `What does ${strain.name} taste like?`,
      answer: strain.flavors?.length
        ? `${strain.name} features ${strain.flavors.join(', ').toLowerCase()} flavors. ${strain.aromas?.length ? `Its aroma profile includes ${strain.aromas.join(', ').toLowerCase()} notes.` : ''}`
        : `${strain.name} has a distinctive flavor profile that varies by grower and curing method.`,
    },
    {
      question: `Is ${strain.name} indica or sativa?`,
      answer: `${strain.name} is a ${typeLower.toLowerCase()} strain. ${strain.type === 'INDICA' ? 'Indica strains are typically known for relaxing, body-focused effects often preferred for evening use.' : strain.type === 'SATIVA' ? 'Sativa strains are typically known for uplifting, cerebral effects often preferred for daytime use.' : 'Hybrid strains combine characteristics of both indica and sativa, offering a balanced experience.'}`,
    },
    {
      question: `What is ${strain.name} THC percentage?`,
      answer: strain.thcMax
        ? `${strain.name} typically contains ${thcText} THC${strain.cbdMax && strain.cbdMax > 0 ? ` and ${strain.cbdMin || 0}-${strain.cbdMax}% CBD` : ''}. THC levels can vary depending on the grower, growing conditions, and harvest time.`
        : `THC levels for ${strain.name} can vary depending on the grower and growing conditions. Check with your local dispensary for specific potency information.`,
    },
    {
      question: `What are the effects of ${strain.name}?`,
      answer: strain.effects?.length
        ? `${strain.name} is known for its ${strain.effects.join(', ').toLowerCase()} effects. As a ${typeLower.toLowerCase()} strain, it ${strain.type === 'INDICA' ? 'tends toward body relaxation' : strain.type === 'SATIVA' ? 'tends toward cerebral stimulation' : 'offers a balanced experience'}. Individual effects may vary.`
        : `Effects of ${strain.name} may vary by individual. Check user reviews on Leefii for firsthand experiences.`,
    },
  ];

  // JSON-LD Schema for Product (Strain)
  const strainSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: strain.name,
    description: quickSummary.slice(0, 300),
    url: `https://leefii.com/strains/${strain.slug}`,
    image: 'https://leefii.com/og-image.png',
    dateModified: strain.updatedAt ? new Date(strain.updatedAt).toISOString() : new Date().toISOString(),
    brand: {
      '@type': 'Brand',
      name: strain.breeder || 'Unknown',
    },
    category: `${strain.type} Cannabis Strain`,
    ...(strain.rating > 0 ? {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: strain.rating,
        bestRating: 5,
        worstRating: 1,
        ratingCount: strain.reviewsCount || 1,
      },
    } : {}),
  };

  // BreadcrumbList Schema (includes type level)
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://leefii.com' },
      { '@type': 'ListItem', position: 2, name: 'Strains', item: 'https://leefii.com/strains' },
      { '@type': 'ListItem', position: 3, name: `${typeLower} Strains`, item: `https://leefii.com/strains/${typeSlug}` },
      { '@type': 'ListItem', position: 4, name: strain.name, item: `https://leefii.com/strains/${strain.slug}` },
    ],
  };

  // FAQPage Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(strainSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
              <span className="text-gray-300">/</span>
              <Link href="/strains" className="text-gray-500 hover:text-gray-700">Strains</Link>
              <span className="text-gray-300">/</span>
              <Link href={`/strains/${typeSlug}`} className="text-gray-500 hover:text-gray-700">{typeLower}</Link>
              <span className="text-gray-300">/</span>
              <span className="text-gray-900">{strain.name}</span>
            </nav>
          </div>
        </div>

        {/* Hero */}
        <div className={`bg-gradient-to-r ${getTypeBg(strain.type)} text-white`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-full md:w-64 h-64 bg-white/20 rounded-2xl overflow-hidden flex-shrink-0">
                <img
                  src="https://cdn.midjourney.com/035ba086-fb16-4b40-ac16-64c3df2ffe1a/0_1.png"
                  alt={strain.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <Link href={`/strains/${typeSlug}`} className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(strain.type)} hover:opacity-80 transition`}>
                    {strain.type}
                  </Link>
                  <FavoriteButton
                    entityType="STRAIN"
                    entityId={strain.id}
                    size="lg"
                    showText
                    className="bg-white/20 hover:bg-white/30 text-white"
                  />
                </div>

                <h1 className="text-4xl font-bold mb-4">{strain.name}</h1>

                {strain.genetics && (
                  <p className="text-white/80 mb-4">Genetics: {strain.genetics}</p>
                )}

                <div className="flex flex-wrap gap-4 mb-6">
                  {strain.thcMax && (
                    <div className="bg-white/20 rounded-lg px-4 py-2">
                      <div className="text-white/70 text-sm">THC</div>
                      <div className="text-xl font-bold">{strain.thcMin || 0}-{strain.thcMax}%</div>
                    </div>
                  )}
                  {strain.cbdMax && strain.cbdMax > 0 && (
                    <div className="bg-white/20 rounded-lg px-4 py-2">
                      <div className="text-white/70 text-sm">CBD</div>
                      <div className="text-xl font-bold">{strain.cbdMin || 0}-{strain.cbdMax}%</div>
                    </div>
                  )}
                  {strain.rating > 0 && (
                    <div className="bg-white/20 rounded-lg px-4 py-2">
                      <div className="text-white/70 text-sm">Rating</div>
                      <div className="text-xl font-bold flex items-center gap-1">
                        <span className="text-yellow-300">★</span>
                        {strain.rating.toFixed(1)}
                      </div>
                    </div>
                  )}
                  {strain.reviewsCount > 0 && (
                    <div className="bg-white/20 rounded-lg px-4 py-2">
                      <div className="text-white/70 text-sm">Reviews</div>
                      <div className="text-xl font-bold">{strain.reviewsCount}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Quick Answer Block */}
        <section aria-label="Quick Summary" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-gray-700 text-lg leading-relaxed">
            {strain.name} is a {strain.type?.toLowerCase()} cannabis strain{strain.thcMax ? ` with up to ${strain.thcMax}% THC` : ''}{strain.cbdMax && strain.cbdMax > 0.5 ? ` and ${strain.cbdMax}% CBD` : ''}. {strain.effects?.length > 0 ? `Known effects include ${strain.effects.slice(0, 3).join(', ').toLowerCase()}.` : ''} {strain.flavors?.length > 0 ? `Flavors are ${strain.flavors.slice(0, 3).join(', ').toLowerCase()}.` : ''} {strain.rating ? `Rated ${strain.rating.toFixed(1)}/5 by ${strain.reviewsCount || 0} users on Leefii.` : ''}
          </p>
        </section>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Quick Summary */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">About {strain.name}</h2>
                <p className="text-gray-600 leading-relaxed">{quickSummary}</p>
              </div>

              {/* Effects Chart */}
              {strain.effects && strain.effects.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">Effects</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {strain.effects.map((effect) => {
                      const slug = EFFECT_SLUGS[effect];
                      const icon = EFFECT_ICONS[effect] || '✨';
                      const content = (
                        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100 hover:border-green-300 transition">
                          <span className="text-2xl">{icon}</span>
                          <span className="font-medium text-green-800">{effect}</span>
                        </div>
                      );
                      return slug ? (
                        <Link key={effect} href={`/strains/effects/${slug}`}>{content}</Link>
                      ) : (
                        <div key={effect}>{content}</div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Flavors & Aromas */}
              {((strain.flavors && strain.flavors.length > 0) || (strain.aromas && strain.aromas.length > 0)) && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">Flavors & Aromas</h2>
                  {strain.flavors && strain.flavors.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Flavors</h3>
                      <div className="flex flex-wrap gap-2">
                        {strain.flavors.map((flavor) => {
                          const icon = FLAVOR_ICONS[flavor] || '🌿';
                          const flavorSlug = flavor.toLowerCase().replace(/\s+/g, '-');
                          return (
                            <Link
                              key={flavor}
                              href={`/strains/flavors/${flavorSlug}`}
                              className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-50 text-orange-700 rounded-full font-medium hover:bg-orange-100 transition"
                            >
                              <span>{icon}</span>
                              {flavor}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {strain.aromas && strain.aromas.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Aromas</h3>
                      <div className="flex flex-wrap gap-2">
                        {strain.aromas.map((aroma) => {
                          const icon = FLAVOR_ICONS[aroma] || '👃';
                          return (
                            <span key={aroma} className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-50 text-purple-700 rounded-full font-medium">
                              <span>{icon}</span>
                              {aroma}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Medical Uses */}
              {strain.conditions && strain.conditions.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">Medical Uses</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                    {strain.conditions.map((condition) => {
                      const slug = CONDITION_SLUGS[condition];
                      const content = (
                        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100 hover:border-blue-300 transition">
                          <span className="text-lg">🩺</span>
                          <span className="font-medium text-blue-800 text-sm">{condition}</span>
                        </div>
                      );
                      return slug ? (
                        <Link key={condition} href={`/strains/conditions/${slug}`}>{content}</Link>
                      ) : (
                        <div key={condition}>{content}</div>
                      );
                    })}
                  </div>
                  <p className="text-xs text-gray-400 italic">
                    Disclaimer: This information is for educational purposes only and is not intended as medical advice.
                    Cannabis has not been approved by the FDA to treat any medical condition.
                    Always consult with a qualified healthcare professional before using cannabis for medical purposes.
                  </p>
                </div>
              )}

              {/* Terpene Profile */}
              {(strain.terpMyrcene || strain.terpLimonene || strain.terpCaryophyllene ||
                strain.terpPinene || strain.terpLinalool || strain.terpHumulene ||
                strain.terpTerpinolene || strain.terpOcimene) && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="text-xl font-semibold mb-2">Terpene Profile</h2>
                  <p className="text-gray-500 text-sm mb-6">Terpenes are aromatic compounds that influence the effects and flavor of cannabis</p>
                  <div className="space-y-4">
                    {[
                      { name: 'Myrcene', value: strain.terpMyrcene, color: 'bg-amber-500', slug: 'myrcene', desc: 'Earthy, musky • Relaxing, sedating' },
                      { name: 'Limonene', value: strain.terpLimonene, color: 'bg-yellow-400', slug: 'limonene', desc: 'Citrus, lemon • Mood elevation, stress relief' },
                      { name: 'Caryophyllene', value: strain.terpCaryophyllene, color: 'bg-orange-500', slug: 'caryophyllene', desc: 'Pepper, spicy • Anti-inflammatory, pain relief' },
                      { name: 'Pinene', value: strain.terpPinene, color: 'bg-green-500', slug: 'pinene', desc: 'Pine, fresh • Alertness, memory retention' },
                      { name: 'Linalool', value: strain.terpLinalool, color: 'bg-purple-500', slug: 'linalool', desc: 'Floral, lavender • Calming, anxiety relief' },
                      { name: 'Humulene', value: strain.terpHumulene, color: 'bg-lime-600', slug: 'humulene', desc: 'Earthy, woody • Appetite suppressant' },
                      { name: 'Terpinolene', value: strain.terpTerpinolene, color: 'bg-pink-500', slug: 'terpinolene', desc: 'Floral, herbal • Uplifting, energizing' },
                      { name: 'Ocimene', value: strain.terpOcimene, color: 'bg-teal-500', slug: 'ocimene', desc: 'Sweet, herbal • Antiviral, decongestant' },
                    ].filter(t => t.value && t.value > 0).map((terp) => (
                      <Link key={terp.name} href={`/strains/terpene/${terp.slug}`} className="block hover:bg-gray-50 rounded-lg transition p-1 -m-1">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium text-gray-700">{terp.name}</span>
                          <span className="text-gray-500 text-sm">{terp.value!.toFixed(2)}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                          <div className={`${terp.color} h-2.5 rounded-full`} style={{ width: `${Math.min(terp.value! * 50, 100)}%` }}></div>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{terp.desc}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Similar Strains */}
              {similarStrains.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="text-xl font-semibold mb-4">Similar Strains</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {similarStrains.map((s) => (
                      <Link
                        key={s.slug}
                        href={`/strains/${s.slug}`}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-green-300 hover:shadow-sm transition"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900">{s.name}</h3>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getTypeColor(s.type)}`}>
                              {s.type.charAt(0) + s.type.slice(1).toLowerCase()}
                            </span>
                          </div>
                          <div className="flex gap-2 mt-1.5 text-xs">
                            {s.thcMax && (
                              <span className="text-gray-500">THC: {s.thcMin || 0}-{s.thcMax}%</span>
                            )}
                            {s.effects?.slice(0, 2).map((e) => (
                              <span key={e} className="bg-green-50 text-green-700 px-2 py-0.5 rounded-full">{e}</span>
                            ))}
                          </div>
                        </div>
                        {s.rating > 0 && (
                          <div className="text-right flex-shrink-0 ml-3">
                            <span className="text-yellow-500 font-bold">★ {s.rating.toFixed(1)}</span>
                          </div>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* FAQ Section */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
                <div className="space-y-3">
                  {faqs.map((faq, i) => (
                    <details key={i} className="border border-gray-100 rounded-lg">
                      <summary className="p-4 font-semibold cursor-pointer hover:text-green-700 text-gray-900">
                        {faq.question}
                      </summary>
                      <p className="px-4 pb-4 text-gray-600">{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </div>

              {/* Reviews */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <Reviews
                  entityType="strain"
                  entityId={strain.id}
                  entityName={strain.name}
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Info */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold mb-4">Strain Info</h3>
                <dl className="space-y-3">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Type</dt>
                    <dd className="font-medium">
                      <Link href={`/strains/${typeSlug}`} className="hover:text-green-600 transition">{strain.type}</Link>
                    </dd>
                  </div>
                  {strain.genetics && (
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Genetics</dt>
                      <dd className="font-medium text-right">{strain.genetics}</dd>
                    </div>
                  )}
                  {strain.origin && (
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Origin</dt>
                      <dd className="font-medium">{strain.origin}</dd>
                    </div>
                  )}
                  {strain.breeder && (
                    <div className="flex justify-between">
                      <dt className="text-gray-500">Breeder</dt>
                      <dd className="font-medium">{strain.breeder}</dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Growing Info */}
              {(strain.floweringTime || strain.difficulty || strain.yieldIndoor || strain.yieldOutdoor) && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="font-semibold mb-4">Growing Information</h3>
                  <dl className="space-y-3">
                    {strain.difficulty && (
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Difficulty</dt>
                        <dd className="font-medium">{strain.difficulty}</dd>
                      </div>
                    )}
                    {strain.floweringTime && (
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Flowering Time</dt>
                        <dd className="font-medium">{strain.floweringTime}</dd>
                      </div>
                    )}
                    {strain.yieldIndoor && (
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Indoor Yield</dt>
                        <dd className="font-medium">{strain.yieldIndoor}</dd>
                      </div>
                    )}
                    {strain.yieldOutdoor && (
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Outdoor Yield</dt>
                        <dd className="font-medium">{strain.yieldOutdoor}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              )}

              {/* Where to Buy CTA */}
              <div className="bg-green-50 rounded-xl p-6 border border-green-100">
                <h3 className="font-semibold text-green-900 mb-2">Find {strain.name} Near You</h3>
                <p className="text-green-700 text-sm mb-4">
                  Browse dispensaries that may carry this strain in your area.
                </p>
                <Link
                  href="/dispensaries"
                  className="block w-full bg-green-600 text-white text-center py-3 rounded-lg font-medium hover:bg-green-700 transition"
                >
                  Find Dispensaries
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
