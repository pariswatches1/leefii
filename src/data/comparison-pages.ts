// ============================================================
// Comparison Pages — Static Data
// Category comparisons, platform comparisons, and top strain pairs
// ============================================================

import { COMP_BATCH1 } from './_comp-batch1'
import { COMP_BATCH2 } from './_comp-batch2'
import { COMP_PLATFORMS } from './_comp-platforms'

// ==================== TYPES ====================

export interface ComparisonSection {
  heading: string
  content: string
}

export interface ComparisonFaq {
  question: string
  answer: string
}

export interface CategoryComparison {
  slug: string
  titleA: string
  titleB: string
  pageTitle: string
  metaTitle: string
  metaDescription: string
  intro: string
  comparisonTable: { label: string; valueA: string; valueB: string }[]
  sections: ComparisonSection[]
  verdict: string
  faqs: ComparisonFaq[]
}

export interface PlatformComparison {
  slug: string
  platformA: string
  platformB: string
  pageTitle: string
  metaTitle: string
  metaDescription: string
  intro: string
  comparisonTable: { label: string; valueA: string; valueB: string; winner?: 'a' | 'b' | 'tie' }[]
  sections: ComparisonSection[]
  verdict: string
  faqs: ComparisonFaq[]
}

// ==================== TOP STRAIN PAIRS ====================

export const TOP_STRAIN_PAIRS: string[] = [
  'blue-dream-vs-og-kush',
  'sour-diesel-vs-jack-herer',
  'girl-scout-cookies-vs-wedding-cake',
  'northern-lights-vs-granddaddy-purple',
  'gorilla-glue-vs-green-crack',
  'white-widow-vs-ak-47',
  'gelato-vs-runtz',
  'purple-haze-vs-super-lemon-haze',
  'blue-dream-vs-sour-diesel',
  'og-kush-vs-granddaddy-purple',
  'wedding-cake-vs-gelato',
  'jack-herer-vs-green-crack',
  'northern-lights-vs-blue-dream',
  'girl-scout-cookies-vs-gelato',
  'runtz-vs-wedding-cake',
  'ak-47-vs-sour-diesel',
  'purple-haze-vs-northern-lights',
  'og-kush-vs-girl-scout-cookies',
  'blue-dream-vs-gorilla-glue',
  'white-widow-vs-northern-lights',
]

// ==================== CATEGORY COMPARISONS ====================

export const CATEGORY_COMPARISONS: CategoryComparison[] = [
  // --- 1. Indica vs Sativa ---
  {
    slug: 'indica-vs-sativa',
    titleA: 'Indica',
    titleB: 'Sativa',
    pageTitle: 'Indica vs Sativa: What\'s the Difference?',
    metaTitle: 'Indica vs Sativa: Key Differences Explained (2026 Guide) | Leefii',
    metaDescription: 'Indica vs sativa — what is the real difference? Compare effects, THC levels, plant traits, terpenes, and medical uses. Find the right type for you on Leefii.',
    intro: `<p>The indica vs sativa debate is one of the oldest conversations in cannabis culture, and it remains one of the most common questions new consumers ask when they walk into a <a href="/dispensaries">dispensary</a> for the first time. For decades, the cannabis community has relied on these two classifications to describe the expected effects of different strains: indica for relaxation and body highs, sativa for energy and cerebral stimulation. While modern cannabis science has revealed that the actual chemical profile of a strain — its cannabinoids and terpenes — matters far more than its indica or sativa label, the distinction still serves as a useful starting point for consumers navigating thousands of available strains.</p>
<p>Indica strains trace their heritage to the Hindu Kush mountain region of Central Asia, where they adapted to harsh climates by growing short and bushy with broad, dark leaves. Sativa strains originated in equatorial regions like Southeast Asia, Central America, and Africa, developing tall, lanky structures with narrow leaves to thrive in warm, humid conditions. These physical differences remain consistent even as the effects vary widely within each category.</p>
<p>Today, the vast majority of cannabis available at dispensaries is technically hybrid — some combination of indica and sativa genetics. Pure landrace strains are increasingly rare. However, strains labeled as indica-dominant or sativa-dominant still tend to cluster around certain effect profiles, making the classification useful for guiding your choices. In this guide, we break down the real differences between <a href="/strains/indica">indica</a> and <a href="/strains/sativa">sativa</a>, help you understand what actually drives a strain's effects, and give you practical advice for choosing the right cannabis for your needs.</p>`,
    comparisonTable: [
      { label: 'Primary Effects', valueA: 'Body relaxation, sedation, couchlock', valueB: 'Cerebral stimulation, energy, creativity' },
      { label: 'THC Range', valueA: '15–25%', valueB: '18–28%' },
      { label: 'CBD Range', valueA: '0.5–2%', valueB: '0.1–1%' },
      { label: 'Best For', valueA: 'Evening use, sleep, pain relief', valueB: 'Daytime use, socializing, focus' },
      { label: 'Body vs Mind High', valueA: 'Predominantly body', valueB: 'Predominantly mind' },
      { label: 'Flower Time', valueA: '8–9 weeks', valueB: '10–14 weeks' },
      { label: 'Plant Height', valueA: '2–4 feet (short, bushy)', valueB: '5–12 feet (tall, lanky)' },
      { label: 'Dominant Terpenes', valueA: 'Myrcene, linalool, caryophyllene', valueB: 'Limonene, pinene, terpinolene' },
      { label: 'Leaf Shape', valueA: 'Broad, wide fingers', valueB: 'Narrow, thin fingers' },
      { label: 'Origin Region', valueA: 'Central Asia (Hindu Kush)', valueB: 'Equatorial (SE Asia, Africa)' },
      { label: 'Appetite Stimulation', valueA: 'Strong', valueB: 'Moderate' },
      { label: 'Anxiety Risk', valueA: 'Low (calming)', valueB: 'Moderate (stimulating)' },
    ],
    sections: [
      {
        heading: 'What Is Indica?',
        content: `<p><a href="/strains/indica">Indica strains</a> are historically associated with deep physical relaxation, sedation, and a heavy body high that many consumers describe as "melting into the couch." The classic indica experience involves a warm, full-body sensation that eases muscle tension, reduces pain, and gradually leads toward sleepiness. This makes indica strains particularly popular among evening users, people dealing with chronic pain, and anyone who wants to wind down after a stressful day.</p>
<p>From a botanical perspective, indica plants are compact and bushy, typically growing between two and four feet tall. They have broad, dark-green leaves and dense, tightly packed buds covered in sticky trichomes. Indica strains flower relatively quickly — usually eight to nine weeks — making them favorites among cultivators. The dominant terpenes in indica strains tend to be myrcene (earthy, musky, with sedative properties), linalool (floral, calming), and caryophyllene (peppery, anti-inflammatory).</p>
<p>Popular indica strains include Northern Lights, Granddaddy Purple, Bubba Kush, and Purple Punch. Medical cannabis patients frequently choose indica strains for conditions like insomnia, chronic pain, muscle spasms, and anxiety. If you are looking for strains that help you sleep, check our <a href="/strains?effect=sleepy">sleepy strains page</a> for recommendations.</p>`,
      },
      {
        heading: 'What Is Sativa?',
        content: `<p><a href="/strains/sativa">Sativa strains</a> deliver an uplifting, cerebral high characterized by enhanced creativity, energy, focus, and sociability. The classic sativa experience is often described as a "head high" — a stimulating mental buzz that makes colors brighter, music richer, and conversations more engaging. Sativa strains are the preferred choice for daytime use, outdoor activities, creative projects, and social events.</p>
<p>Botanically, sativa plants are tall and slender, sometimes reaching heights of twelve feet or more when grown outdoors. They have narrow, light-green leaves and airy, elongated buds. Sativas take significantly longer to flower than indicas — often ten to fourteen weeks — which can make them more challenging to cultivate. The terpene profiles of sativa strains lean toward limonene (citrusy, mood-elevating), pinene (piney, alertness-enhancing), and terpinolene (floral, energizing).</p>
<p>Iconic sativa strains include Sour Diesel, Jack Herer, Durban Poison, and Green Crack. Medical patients choose sativas for depression, fatigue, ADHD, and mood disorders. However, sativas can sometimes trigger anxiety or racing thoughts in sensitive users, especially at higher doses. If energizing strains interest you, browse our <a href="/strains?effect=energetic">energetic strains collection</a>.</p>`,
      },
      {
        heading: 'Does the Indica/Sativa Label Really Matter?',
        content: `<p>Modern cannabis research has complicated the simple indica-vs-sativa framework. Scientists like Dr. Ethan Russo have argued that the chemical composition of a strain — specifically its cannabinoid ratios and terpene profiles — is a far better predictor of effects than its indica or sativa classification. Two strains labeled "indica" can produce wildly different experiences if their terpene and cannabinoid profiles differ significantly.</p>
<p>The reason is straightforward: after decades of crossbreeding, nearly every commercial strain is a genetic hybrid. The "indica" or "sativa" label on a dispensary shelf often reflects the breeder's marketing decision or the plant's physical growth characteristics rather than a guarantee of specific effects. A myrcene-dominant "sativa" might actually feel more sedating than a limonene-dominant "indica."</p>
<p>That said, the classification remains useful as a general guideline. Strains marketed as indica still tend to have higher myrcene content and more body-focused effects. Sativa-labeled strains generally feature more uplifting terpenes. The key is to treat indica and sativa as starting points, not definitive predictors. For the most accurate strain selection, pay attention to terpene profiles and cannabinoid percentages — data you can find on every <a href="/strains">strain page on Leefii</a>.</p>`,
      },
      {
        heading: 'How to Choose Between Indica and Sativa',
        content: `<p>Choosing between indica and sativa depends on your goals, the time of day, your tolerance level, and your personal chemistry. Here is a practical framework:</p>
<p><strong>Choose Indica if:</strong> You want to relax after work, ease physical pain, improve sleep, reduce muscle tension, or enjoy a calm evening at home. Indica is also a solid choice if you are prone to anxiety, since the calming effects are less likely to trigger racing thoughts.</p>
<p><strong>Choose Sativa if:</strong> You want daytime energy, creative inspiration, social stimulation, or a mood boost. Sativa works well before exercise, outdoor adventures, creative work, or social gatherings. Be mindful of dosing if you are anxiety-prone.</p>
<p><strong>Consider <a href="/strains/hybrid">Hybrid</a> if:</strong> You want balanced effects, or if pure indica is too sedating and pure sativa is too stimulating. Hybrids let you fine-tune your experience by choosing indica-dominant, sativa-dominant, or balanced options.</p>
<p>Ultimately, the best approach is to experiment with small doses, pay attention to how specific strains affect you personally, and use tools like <a href="/strains">Leefii's strain finder</a> to compare terpene profiles, effects, and user reviews before making a purchase at your local <a href="/dispensaries">dispensary</a>.</p>`,
      },
    ],
    verdict: `<p>Neither indica nor sativa is objectively "better" — each serves different purposes. If you need relaxation, pain relief, and sleep support, <a href="/strains/indica">indica strains</a> are your best bet. If you want energy, creativity, and an uplifting mood, <a href="/strains/sativa">sativa strains</a> are the way to go. And if you want something in between, <a href="/strains/hybrid">hybrids</a> offer the best of both worlds.</p>
<p>Remember that individual results vary. Your body chemistry, tolerance, and even your current mood influence how a strain affects you. Start with low doses, read user reviews on <a href="/strains">Leefii</a>, and do not be afraid to experiment until you find your ideal strain.</p>`,
    faqs: [
      { question: 'Is indica or sativa better for anxiety?', answer: 'Indica is generally considered better for anxiety because its calming, body-focused effects help quiet racing thoughts. High-THC sativas can sometimes increase anxiety in sensitive users. However, a low-dose sativa with limonene may also help with mood-related anxiety. Consider CBD-rich strains for anxiety as well.' },
      { question: 'Can you mix indica and sativa?', answer: 'Yes, many people combine indica and sativa strains — this is essentially what hybrid strains are. Mixing can give you balanced effects. Some users smoke sativa during the day and indica at night. There is no health risk in combining them.' },
      { question: 'Does indica make you sleepy and sativa make you hyper?', answer: 'Not always. While indica-labeled strains tend to be more sedating and sativa-labeled strains tend to be more energizing, the actual effects depend on the specific terpene and cannabinoid profile of each strain. Some indicas are mildly relaxing without causing sleep, and some sativas are gentle without being overstimulating.' },
      { question: 'Why do dispensaries still use indica and sativa labels?', answer: 'Despite scientific debate, indica and sativa labels remain the most familiar classification system for consumers. They provide a quick, approximate guide to expected effects. Most dispensaries supplement these labels with terpene data and staff recommendations for more accurate strain selection.' },
      { question: 'What is the strongest indica strain?', answer: 'Potency varies by grower and batch, but consistently high-THC indica strains include Godfather OG, Purple Punch, and Granddaddy Purple, which can test above 30% THC. Check <a href="/strains/indica">Leefii\'s indica strain page</a> for current ratings and THC data from real dispensary menus.' },
    ],
  },

  // --- 2. Indica vs Hybrid ---
  {
    slug: 'indica-vs-hybrid',
    titleA: 'Indica',
    titleB: 'Hybrid',
    pageTitle: 'Indica vs Hybrid: Which Is Right for You?',
    metaTitle: 'Indica vs Hybrid: Differences, Effects & How to Choose (2026) | Leefii',
    metaDescription: 'Indica vs hybrid cannabis — which should you choose? Compare effects, THC levels, medical uses, and terpenes. Practical guide to picking the right strain type.',
    intro: `<p>Choosing between indica and hybrid cannabis is one of the most common decisions facing dispensary shoppers. If you have ever stood in front of a display case wondering whether to grab the pure indica or the hybrid on the next shelf, you are not alone. Both categories offer relaxing effects, but they differ in important ways that can significantly impact your experience. Understanding these differences will help you make smarter purchases and find strains that consistently match your expectations.</p>
<p><a href="/strains/indica">Indica strains</a> are the traditional choice for full-body relaxation, heavy sedation, and nighttime use. They tend to deliver a strong "body high" that melts away tension and pain while gradually pulling you toward sleep. Pure indicas are predictable in this regard — when you pick up an indica flower, you have a good idea of what to expect.</p>
<p><a href="/strains/hybrid">Hybrid strains</a> combine genetics from both indica and sativa parents, creating a spectrum of effects that range from indica-dominant (relaxing with some mental clarity) to sativa-dominant (energizing with some body relaxation) to balanced (equal parts head and body). This flexibility is the hybrid's greatest strength — and its greatest complication. Two strains both labeled "hybrid" can feel completely different depending on their specific genetics and terpene profiles.</p>
<p>In this guide, we compare indica and hybrid strains across every dimension that matters: effects, potency, medical applications, terpenes, and practical use cases. Whether you are a first-time buyer or an experienced consumer looking to refine your preferences, this comparison will help you navigate the <a href="/dispensaries">dispensary</a> with confidence.</p>`,
    comparisonTable: [
      { label: 'Primary Effects', valueA: 'Deep body relaxation, sedation', valueB: 'Varies — can be relaxing, balanced, or uplifting' },
      { label: 'THC Range', valueA: '15–25%', valueB: '15–30%' },
      { label: 'CBD Range', valueA: '0.5–2%', valueB: '0.1–2%' },
      { label: 'Best Time of Day', valueA: 'Evening / nighttime', valueB: 'Any time (depends on dominance)' },
      { label: 'Body vs Mind High', valueA: '80% body, 20% mind', valueB: '40–60% body, 40–60% mind (varies)' },
      { label: 'Predictability', valueA: 'High — consistent sedating effects', valueB: 'Moderate — depends on specific genetics' },
      { label: 'Sleep Aid', valueA: 'Excellent', valueB: 'Good (indica-dominant) to moderate (balanced)' },
      { label: 'Pain Relief', valueA: 'Strong full-body relief', valueB: 'Moderate to strong (depends on blend)' },
      { label: 'Creativity', valueA: 'Low — too sedating for creative work', valueB: 'Moderate to high (sativa-dominant hybrids)' },
      { label: 'Anxiety Risk', valueA: 'Low', valueB: 'Low to moderate' },
      { label: 'Strain Variety', valueA: 'Moderate', valueB: 'Very high — most strains are hybrids' },
      { label: 'Beginner Friendly', valueA: 'Yes (predictable)', valueB: 'Yes (wide range of options)' },
    ],
    sections: [
      {
        heading: 'Understanding Pure Indica Effects',
        content: `<p>Pure <a href="/strains/indica">indica strains</a> deliver effects that are almost entirely focused on the body. When you consume a true indica, you can expect a wave of warmth and heaviness that begins in your limbs and gradually spreads throughout your entire body. Muscle tension dissolves, chronic aches diminish, and a profound sense of physical calm takes over. Many users describe the peak indica experience as "couchlock" — a pleasant state of deep relaxation where getting up from the sofa feels entirely optional.</p>
<p>The mental effects of indica are subdued compared to sativas. Instead of racing, creative thoughts, indica produces a quiet, contemplative headspace. Your mind slows down, worries recede, and a gentle contentment settles in. This mental calm is exactly why indica strains are so effective for insomnia and anxiety — they essentially turn down the volume on both physical discomfort and mental chatter.</p>
<p>The downside of pure indica is its limited versatility. These strains are poorly suited for daytime activities, social events, or anything requiring sustained mental energy. If you consume a potent indica before a dinner party or creative project, you may find yourself struggling to stay engaged. Indica is a specialist — it excels at relaxation and sleep but offers little in terms of stimulation or productivity.</p>`,
      },
      {
        heading: 'The Versatility of Hybrid Strains',
        content: `<p><a href="/strains/hybrid">Hybrid strains</a> are the Swiss army knives of the cannabis world. By blending indica and sativa genetics, breeders have created strains that offer customized effect profiles for virtually any situation. This is why hybrids dominate dispensary menus — the majority of strains available today are some form of hybrid, even if they lean heavily indica or sativa.</p>
<p><strong>Indica-dominant hybrids</strong> (such as Girl Scout Cookies, Wedding Cake, and Gelato) deliver strong body relaxation paired with mild cerebral stimulation. You get the physical relief of an indica without the complete mental shutdown. These are excellent for evening use when you want to relax but still hold a conversation or watch a movie.</p>
<p><strong>Balanced hybrids</strong> (such as Blue Dream and Gorilla Glue) provide equal parts body and mind effects. They offer moderate relaxation and moderate mental stimulation simultaneously — a versatile experience that works for many situations.</p>
<p><strong>Sativa-dominant hybrids</strong> (such as Sour Diesel and Jack Herer crossed with indica genetics) lean toward cerebral effects with just enough body relaxation to keep you grounded and comfortable. These work well for daytime use when you want energy and focus without jitters.</p>`,
      },
      {
        heading: 'Medical Uses Compared',
        content: `<p>Both indica and hybrid strains have significant medical applications, but they serve different patient needs. Pure indica strains are the top recommendation from <a href="/doctors">cannabis doctors</a> for conditions where sedation and deep relaxation are therapeutic goals: chronic pain, insomnia, muscle spasms, fibromyalgia, and severe anxiety. The heavy body effects provide powerful symptomatic relief that many patients prefer over pharmaceutical alternatives.</p>
<p>Hybrids offer broader medical versatility. Indica-dominant hybrids serve chronic pain patients who need relief during waking hours without complete sedation. Balanced hybrids work well for depression patients who benefit from both mood elevation and physical relaxation. Sativa-dominant hybrids help patients with fatigue, ADHD, and appetite loss while still providing enough body effects to ease any underlying physical discomfort.</p>
<p>For patients managing multiple symptoms — say, pain combined with depression — hybrids often provide more comprehensive relief than a pure indica or sativa alone. Consult the <a href="/laws">cannabis laws in your state</a> to understand medical program availability, and use <a href="/doctors">Leefii's doctor directory</a> to find a qualified physician who can recommend specific strains for your condition.</p>`,
      },
      {
        heading: 'How to Choose Between Indica and Hybrid',
        content: `<p>The decision between indica and hybrid comes down to one core question: <strong>do you want a specialist or a generalist?</strong></p>
<p><strong>Choose pure indica if:</strong> Your primary goal is sleep, deep pain relief, or maximum sedation. You are consuming in the evening with no plans to be active or social. You prefer predictable, consistent effects. You have used cannabis before and know that heavy body highs work well for you.</p>
<p><strong>Choose a hybrid if:</strong> You want more flexibility in when and how you consume. You want relaxation without total sedation. You are looking for pain relief during the day. You want some mental stimulation alongside body effects. You are a beginner exploring your preferences — hybrids give you a wider range of experiences to sample.</p>
<p>When shopping at a <a href="/dispensaries">dispensary</a>, pay attention to whether a hybrid is described as indica-dominant, balanced, or sativa-dominant. This tells you which direction the effects will lean. Also check the terpene profile on <a href="/strains">Leefii's strain pages</a> — high myrcene suggests more sedation regardless of the label, while high limonene suggests more uplift.</p>`,
      },
    ],
    verdict: `<p>For dedicated evening relaxation and sleep, pure <a href="/strains/indica">indica</a> remains the gold standard. Its effects are reliable, strong, and perfectly suited for winding down. But if you want a cannabis experience that adapts to different times and situations, <a href="/strains/hybrid">hybrid strains</a> offer unmatched flexibility. Most regular consumers keep both in their rotation — indica for bedtime, hybrids for everything else.</p>
<p>Browse indica and hybrid strains on <a href="/strains">Leefii</a> to compare terpene profiles, read user reviews, and find options available at <a href="/dispensaries">dispensaries near you</a>.</p>`,
    faqs: [
      { question: 'Is hybrid stronger than indica?', answer: 'Not necessarily. Potency depends on THC percentage, not strain type. Some hybrids exceed 30% THC, while some indicas sit at 15%. However, hybrids may feel more "complex" because they combine body and mind effects simultaneously.' },
      { question: 'Can a hybrid feel exactly like an indica?', answer: 'Yes. An indica-dominant hybrid with heavy myrcene content can feel virtually identical to a pure indica. The distinction is genetic — the hybrid has some sativa parentage — but the experienced effects may be indistinguishable.' },
      { question: 'Are hybrids better for beginners?', answer: 'Hybrids can be a great starting point because they offer balanced effects that are less extreme than pure indicas or sativas. A balanced hybrid with moderate THC (15-18%) lets you experience cannabis without overwhelming sedation or stimulation.' },
      { question: 'Why do most dispensaries sell more hybrids than indicas?', answer: 'Breeding trends favor hybrids because they combine desirable traits from both parents — indica\'s resin production and yield with sativa\'s unique terpene profiles and effects. The result is that most modern cultivars are technically hybrids, even when marketed as indica or sativa.' },
      { question: 'What hybrid strains feel the most like indica?', answer: 'Indica-dominant hybrids like Girl Scout Cookies, Granddaddy Purple crosses, Wedding Cake, and Ice Cream Cake deliver strong indica-like body effects with a slight cerebral edge. Check <a href="/strains/hybrid">Leefii\'s hybrid strain page</a> to filter by indica-dominant options.' },
    ],
  },
  ...COMP_BATCH1,
  ...COMP_BATCH2,
]

// ==================== PLATFORM COMPARISONS ====================

export const PLATFORM_COMPARISONS: PlatformComparison[] = [...COMP_PLATFORMS]

// ==================== HELPER FUNCTIONS ====================

export function getCategoryComparisonBySlug(slug: string): CategoryComparison | undefined {
  return CATEGORY_COMPARISONS.find((c) => c.slug === slug)
}

export function getPlatformComparisonBySlug(slug: string): PlatformComparison | undefined {
  return PLATFORM_COMPARISONS.find((c) => c.slug === slug)
}

export function getAllCategoryComparisonSlugs(): string[] {
  return CATEGORY_COMPARISONS.map((c) => c.slug)
}

export function getAllPlatformComparisonSlugs(): string[] {
  return PLATFORM_COMPARISONS.map((c) => c.slug)
}

export function getComparisonBySlug(
  slug: string
): { type: 'category' | 'platform'; data: CategoryComparison | PlatformComparison } | undefined {
  const category = getCategoryComparisonBySlug(slug)
  if (category) return { type: 'category', data: category }
  const platform = getPlatformComparisonBySlug(slug)
  if (platform) return { type: 'platform', data: platform }
  return undefined
}
