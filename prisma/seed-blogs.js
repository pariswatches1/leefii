// seed-blogs.js - Add 30 SEO-optimized blog posts
// Run with: node prisma/seed-blogs.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const blogPosts = [
  {
    title: "Cannabis Dosing Guide: How to Find Your Perfect Amount",
    slug: "cannabis-dosing-guide-find-perfect-amount",
    excerpt: "Learn the science-backed approach to cannabis dosing. From microdosing to therapeutic levels, discover how to find your ideal cannabis dose safely.",
    content: "Complete guide to cannabis dosing covering microdosing, edibles, smoking, and therapeutic applications. Learn the start low go slow principle and factors affecting your ideal dose.",
    category: "Education",
    imageUrl: "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=800",
    isPublished: true,
    
    metaTitle: "Cannabis Dosing Guide 2025: Find Your Perfect THC & CBD Amount",
    metaDescription: "Complete cannabis dosing guide covering microdosing, edibles, smoking, and tinctures. Learn how to find your ideal dose safely."
  },
  {
    title: "How Long Does Cannabis Stay in Your System?",
    slug: "how-long-cannabis-stays-in-system-detection-guide",
    excerpt: "Understand cannabis detection windows for urine, blood, hair, and saliva tests. Learn factors that affect how long THC remains detectable.",
    content: "Comprehensive guide to cannabis detection times covering urine tests, blood tests, saliva tests, and hair tests. Learn about factors affecting detection.",
    category: "Health",
    imageUrl: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800",
    isPublished: true,
    
    metaTitle: "How Long Does Weed Stay in Your System? 2025 Detection Guide",
    metaDescription: "Complete guide to cannabis detection times for urine, blood, hair, and saliva tests."
  },
  {
    title: "Cannabis and Sleep: Can Marijuana Help You Sleep Better?",
    slug: "cannabis-sleep-marijuana-help-sleep-better",
    excerpt: "Explore the relationship between cannabis and sleep quality. Learn which strains and cannabinoids may improve sleep.",
    content: "Guide to using cannabis for sleep. Covers THC, CBD, CBN effects on sleep, best strains for insomnia, and timing recommendations.",
    category: "Health",
    imageUrl: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800",
    isPublished: true,
    
    metaTitle: "Cannabis for Sleep: Best Strains & Cannabinoids for Insomnia 2025",
    metaDescription: "Discover how cannabis affects sleep quality. Learn the best strains and cannabinoids for sleep."
  },
  {
    title: "Cooking with Cannabis: Beginner's Guide to Edibles",
    slug: "cooking-cannabis-beginners-guide-edibles-home",
    excerpt: "Master the art of making cannabis edibles at home. Learn decarboxylation, infusion methods, and dosing calculations.",
    content: "Step-by-step guide to making cannabis edibles including decarboxylation, cannabutter, dosing calculations, and beginner recipes.",
    category: "Lifestyle",
    imageUrl: "https://images.unsplash.com/photo-1606237328580-8eb3a0e1c0d4?w=800",
    isPublished: true,
    
    metaTitle: "How to Make Cannabis Edibles at Home: Complete Guide 2025",
    metaDescription: "Learn to make cannabis edibles at home with our step-by-step guide."
  },
  {
    title: "Cannabis Terpenes: Complete Guide to Aromas and Effects",
    slug: "cannabis-terpenes-explained-complete-guide-aromas-effects",
    excerpt: "Discover how terpenes shape your cannabis experience. Learn about myrcene, limonene, pinene, and more.",
    content: "Complete guide to cannabis terpenes including myrcene, limonene, pinene, linalool, and caryophyllene. Learn how they affect your experience.",
    category: "Education",
    imageUrl: "https://images.unsplash.com/photo-1503262028195-93c528f03218?w=800",
    isPublished: true,
    
    metaTitle: "Cannabis Terpenes Guide: Myrcene, Limonene, Pinene & More 2025",
    metaDescription: "Complete guide to cannabis terpenes and how they influence effects and flavors."
  },
  {
    title: "How to Store Cannabis: Maximize Freshness and Potency",
    slug: "how-store-cannabis-properly-maximize-freshness-potency",
    excerpt: "Learn professional cannabis storage techniques to preserve potency, flavor, and freshness.",
    content: "Ultimate guide to cannabis storage covering temperature, humidity, light exposure, and the best containers for long-term storage.",
    category: "Education",
    imageUrl: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800",
    isPublished: true,
    
    metaTitle: "How to Store Weed: Keep Cannabis Fresh & Potent [2025 Guide]",
    metaDescription: "Professional cannabis storage guide to preserve potency and freshness."
  },
  {
    title: "Smoking vs Vaping vs Edibles: Methods Compared",
    slug: "cannabis-consumption-methods-compared-smoking-vaping-edibles",
    excerpt: "Compare all cannabis consumption methods. Understand onset times, duration, and bioavailability.",
    content: "Complete comparison of cannabis consumption methods including smoking, vaping, edibles, tinctures, and topicals with bioavailability data.",
    category: "Education",
    imageUrl: "https://images.unsplash.com/photo-1560807707-8cc77767d783?w=800",
    isPublished: true,
    
    metaTitle: "Smoking vs Vaping vs Edibles: Cannabis Methods Compared",
    metaDescription: "Compare cannabis consumption methods with onset times and duration."
  },
  {
    title: "Cannabis for Chronic Pain: What Research Shows",
    slug: "cannabis-chronic-pain-research-shows",
    excerpt: "Examine the scientific evidence for cannabis as a pain management option.",
    content: "Evidence-based guide to cannabis for chronic pain covering research findings, best cannabinoids, dosing, and conditions that respond to treatment.",
    category: "Medical",
    imageUrl: "https://images.unsplash.com/photo-1559757175-7cb057fba93c?w=800",
    isPublished: true,
    
    metaTitle: "Cannabis for Chronic Pain: Scientific Evidence 2025",
    metaDescription: "Research-based guide to cannabis for chronic pain management."
  },
  {
    title: "How to Read Cannabis Lab Test Results (COA)",
    slug: "understanding-cannabis-lab-testing-read-coa-reports",
    excerpt: "Learn to decode Certificate of Analysis reports. Understand potency testing and contaminant screening.",
    content: "Guide to reading cannabis COA reports including cannabinoid profiles, terpene testing, contaminant screening, and red flags to watch for.",
    category: "Education",
    imageUrl: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800",
    isPublished: true,
    
    metaTitle: "How to Read Cannabis COA Lab Reports: Complete Guide 2025",
    metaDescription: "Learn to read cannabis Certificate of Analysis reports."
  },
  {
    title: "Cannabis Tolerance Breaks: How to Reset Your Tolerance",
    slug: "cannabis-tolerance-breaks-reset-tolerance",
    excerpt: "Learn the science behind cannabis tolerance and how to effectively reset it.",
    content: "Complete guide to cannabis tolerance breaks covering how tolerance develops, optimal break length, what to expect, and tips for success.",
    category: "Health",
    imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800",
    isPublished: true,
    
    metaTitle: "Cannabis Tolerance Break Guide: How to Reset THC Tolerance",
    metaDescription: "Complete guide to cannabis tolerance breaks and how to reset."
  },
  {
    title: "Growing Cannabis at Home: Legal States and Requirements",
    slug: "growing-cannabis-home-legal-states-basic-requirements",
    excerpt: "Understand where home cannabis cultivation is legal and what you need to get started.",
    content: "Beginner's overview of home cannabis growing covering legal states, plant limits, equipment needed, and space requirements.",
    category: "Cultivation",
    imageUrl: "https://images.unsplash.com/photo-1589484030071-a5a808b9b2e6?w=800",
    isPublished: true,
    
    metaTitle: "How to Grow Cannabis at Home: Legal States & Requirements 2025",
    metaDescription: "Complete guide to legal home cannabis growing."
  },
  {
    title: "Cannabis and Anxiety: Benefits, Risks, and Best Strains",
    slug: "cannabis-anxiety-benefits-risks-best-strains",
    excerpt: "Explore the relationship between cannabis and anxiety. Learn which strains may help.",
    content: "Comprehensive guide to cannabis and anxiety covering THC vs CBD effects, best strains for anxious users, and tips for consumption.",
    category: "Health",
    imageUrl: "https://images.unsplash.com/photo-1493836512294-502baa1986e2?w=800",
    isPublished: true,
    
    metaTitle: "Cannabis for Anxiety: Best Strains & Tips 2025",
    metaDescription: "Comprehensive guide to cannabis and anxiety."
  },
  {
    title: "What is Live Resin? Guide to This Premium Extract",
    slug: "what-is-live-resin-complete-guide-premium-extract",
    excerpt: "Discover what makes live resin special and why it commands premium prices.",
    content: "Complete guide to live resin covering the extraction process, terpene preservation, types, consumption methods, and storage tips.",
    category: "Product Guides",
    imageUrl: "https://images.unsplash.com/photo-1603909223429-69bb7101f420?w=800",
    isPublished: true,
    
    metaTitle: "What is Live Resin? Complete Guide to This Cannabis Concentrate",
    metaDescription: "Learn what live resin is and why it's premium."
  },
  {
    title: "Cannabis and Driving: Laws and Safety",
    slug: "cannabis-driving-laws-impairment-detection",
    excerpt: "Understand cannabis DUI laws, how marijuana affects driving, and detection methods.",
    content: "Essential information about cannabis and driving covering impairment effects, DUI laws, detection methods, and how long to wait before driving.",
    category: "Legal",
    imageUrl: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800",
    isPublished: true,
    
    metaTitle: "Cannabis DUI Laws: Driving High & Penalties 2025",
    metaDescription: "Complete guide to cannabis and driving laws."
  },
  {
    title: "Cannabis Concentrates: Shatter, Wax, Budder Explained",
    slug: "cannabis-concentrate-types-shatter-wax-budder",
    excerpt: "Navigate the world of cannabis concentrates. Learn the differences between types.",
    content: "Guide to cannabis concentrate types including shatter, wax, budder, crumble, sauce, diamonds, rosin, and hash.",
    category: "Product Guides",
    imageUrl: "https://images.unsplash.com/photo-1616690002178-6631ab3a1f53?w=800",
    isPublished: true,
    
    metaTitle: "Cannabis Concentrates Guide: Shatter vs Wax vs Budder",
    metaDescription: "Complete guide to cannabis concentrate types."
  },
  {
    title: "The Endocannabinoid System Explained",
    slug: "understanding-endocannabinoid-system-cannabis-works-body",
    excerpt: "Learn about the endocannabinoid system and how cannabis interacts with your body.",
    content: "Educational guide to the endocannabinoid system covering CB1 and CB2 receptors, endocannabinoids, and how cannabis works in your body.",
    category: "Science",
    imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800",
    isPublished: true,
    
    metaTitle: "Endocannabinoid System Explained: How Cannabis Works",
    metaDescription: "Learn how the endocannabinoid system works."
  },
  {
    title: "Best Cannabis Strains for Focus and Productivity",
    slug: "cannabis-strains-focus-productivity-top-recommendations",
    excerpt: "Discover cannabis strains that may enhance focus and productivity.",
    content: "Guide to cannabis strains for focus including energizing sativas, optimal terpene profiles, and microdosing strategies.",
    category: "Strain Guides",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
    isPublished: true,
    
    metaTitle: "Best Cannabis Strains for Focus & Productivity 2025",
    metaDescription: "Discover the best cannabis strains for focus."
  },
  {
    title: "First Time at a Dispensary: Complete Guide",
    slug: "first-time-dispensary-complete-guide-new-customers",
    excerpt: "Prepare for your first dispensary visit with confidence.",
    content: "Complete guide for first-time dispensary visitors covering what to bring, what to expect, how to talk to budtenders, and tips.",
    category: "Guides",
    imageUrl: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800",
    isPublished: true,
    
    metaTitle: "First Time at a Dispensary: Beginner's Guide 2025",
    metaDescription: "Complete guide for first-time dispensary visitors."
  },
  {
    title: "Cannabis and Alcohol: Interactions and Safety",
    slug: "cannabis-alcohol-interactions-risks-safety",
    excerpt: "Understand the risks of mixing cannabis and alcohol.",
    content: "Guide to mixing cannabis and alcohol covering crossfading effects, enhanced impairment, greening out, and harm reduction strategies.",
    category: "Health",
    imageUrl: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800",
    isPublished: true,
    
    metaTitle: "Cannabis and Alcohol: Risks of Mixing & Safety 2025",
    metaDescription: "Understand risks of mixing cannabis and alcohol."
  },
  {
    title: "Where is Weed Legal? Cannabis Legalization Map 2025",
    slug: "cannabis-legalization-map-where-weed-legal-2025",
    excerpt: "Current cannabis legalization status across all 50 states.",
    content: "Complete guide to cannabis legalization by state covering recreational, medical, CBD-only, and prohibited states.",
    category: "Legal",
    imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800",
    isPublished: true,
    
    metaTitle: "Where is Marijuana Legal? Cannabis Legalization Map 2025",
    metaDescription: "Complete guide to cannabis legalization by state."
  },
  {
    title: "Cannabis for Seniors: Benefits and Safety Guide",
    slug: "cannabis-seniors-benefits-safety-getting-started",
    excerpt: "Guide for older adults considering cannabis for health and wellness.",
    content: "Comprehensive guide to cannabis for seniors covering potential benefits, drug interactions, safety considerations, and getting started.",
    category: "Medical",
    imageUrl: "https://images.unsplash.com/photo-1447005497901-b3e9ee359928?w=800",
    isPublished: true,
    
    metaTitle: "Cannabis for Seniors: Benefits & Safety Guide 2025",
    metaDescription: "Complete guide to cannabis for older adults."
  },
  {
    title: "How to Sober Up From Weed: Tips When Too High",
    slug: "how-sober-up-cannabis-tips-too-high",
    excerpt: "Find relief when you've consumed too much cannabis.",
    content: "Evidence-based techniques to feel better when too high including CBD, black pepper, grounding exercises, and what to avoid.",
    category: "Health",
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800",
    isPublished: true,
    
    metaTitle: "How to Sober Up From Weed: 8 Ways to Stop Being Too High",
    metaDescription: "Learn techniques to reduce cannabis intensity."
  },
  {
    title: "Medical Marijuana Qualifying Conditions by State",
    slug: "medical-marijuana-qualifying-conditions-state",
    excerpt: "Comprehensive list of qualifying conditions for medical cannabis in each state.",
    content: "Guide to medical marijuana qualifying conditions covering common conditions, state variations, and how to get a medical card.",
    category: "Medical",
    imageUrl: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800",
    isPublished: true,
    
    metaTitle: "Medical Marijuana Qualifying Conditions by State 2025",
    metaDescription: "Complete guide to medical cannabis qualifying conditions."
  },
  {
    title: "CBD for Dogs and Cats: Pet Cannabis Guide",
    slug: "cannabis-pets-cbd-dogs-cats",
    excerpt: "Learn about CBD products for pets and safety considerations.",
    content: "Guide to CBD for pets covering potential benefits, safety, dosing guidelines, and how to choose quality pet CBD products.",
    category: "Health",
    imageUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800",
    isPublished: true,
    
    metaTitle: "CBD for Dogs and Cats: Pet Cannabis Guide 2025",
    metaDescription: "Complete guide to CBD for pets."
  },
  {
    title: "Cannabis Industry Jobs and Careers Guide",
    slug: "cannabis-industry-jobs-career-opportunities-legal-marijuana",
    excerpt: "Explore career paths in the cannabis industry with salaries and requirements.",
    content: "Guide to cannabis industry careers from budtender to executive covering salaries, requirements, and how to get started.",
    category: "Industry",
    imageUrl: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800",
    isPublished: true,
    
    metaTitle: "Cannabis Industry Jobs: Salaries & Career Guide 2025",
    metaDescription: "Explore cannabis industry careers."
  },
  {
    title: "Delta-8 THC: What You Need to Know",
    slug: "delta-8-thc-explained-what-you-need-know",
    excerpt: "Understand Delta-8 THC, its effects, legal status, and safety considerations.",
    content: "Complete guide to Delta-8 THC covering how it differs from Delta-9, effects, legal status, safety concerns, and drug testing.",
    category: "Education",
    imageUrl: "https://images.unsplash.com/photo-1603909223429-69bb7101f420?w=800",
    isPublished: true,
    
    metaTitle: "What is Delta-8 THC? Effects, Legality & Safety Guide 2025",
    metaDescription: "Complete guide to Delta-8 THC."
  },
  {
    title: "Cannabis Seed Banks: How to Buy Seeds Legally",
    slug: "cannabis-seed-banks-buy-seeds-legally",
    excerpt: "Guide to purchasing cannabis seeds from reputable seed banks.",
    content: "Complete guide to buying cannabis seeds covering legality, reputable seed banks, seed types, and germination tips.",
    category: "Cultivation",
    imageUrl: "https://images.unsplash.com/photo-1589484030071-a5a808b9b2e6?w=800",
    isPublished: true,
    
    metaTitle: "How to Buy Cannabis Seeds Legally: Seed Bank Guide 2025",
    metaDescription: "Guide to purchasing cannabis seeds legally."
  },
  {
    title: "Cannabis Strains for Creativity and Inspiration",
    slug: "cannabis-strains-creativity-inspiration-artists",
    excerpt: "Discover strains known for boosting creativity and artistic inspiration.",
    content: "Guide to creative cannabis strains covering how cannabis affects creativity, best strains for artists, and consumption tips.",
    category: "Strain Guides",
    imageUrl: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800",
    isPublished: true,
    
    metaTitle: "Best Cannabis Strains for Creativity 2025",
    metaDescription: "Discover strains that boost creativity."
  },
  {
    title: "Cannabis Dispensary Etiquette: Do's and Don'ts",
    slug: "cannabis-dispensary-etiquette-dos-donts",
    excerpt: "Learn proper dispensary etiquette to have the best experience.",
    content: "Guide to dispensary etiquette covering what to do, what to avoid, and how to get the best service from budtenders.",
    category: "Guides",
    imageUrl: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800",
    isPublished: true,
    
    metaTitle: "Dispensary Etiquette: Do's and Don'ts Guide 2025",
    metaDescription: "Learn proper dispensary etiquette."
  },
  {
    title: "THCA vs THC: Understanding the Difference",
    slug: "thca-vs-thc-understanding-difference",
    excerpt: "Learn the difference between THCA and THC and why it matters.",
    content: "Educational guide to THCA vs THC covering chemical differences, effects, decarboxylation, and product applications.",
    category: "Education",
    imageUrl: "https://images.unsplash.com/photo-1616690002178-6631ab3a1f53?w=800",
    isPublished: true,
    
    metaTitle: "THCA vs THC: What's the Difference? Complete Guide 2025",
    metaDescription: "Understand the difference between THCA and THC."
  }
];

async function seedBlogs() {
  console.log('🌱 Seeding 30 blog posts to NewsArticle table...\n');
  
  let created = 0;
  let skipped = 0;
  
  for (const post of blogPosts) {
    try {
      const existing = await prisma.newsArticle.findUnique({
        where: { slug: post.slug }
      });
      
      if (existing) {
        console.log(`⏭️  Skipped (exists): ${post.title.substring(0, 50)}...`);
        skipped++;
        continue;
      }
      
      await prisma.newsArticle.create({
        data: {
          ...post,
          publishedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
      
      console.log(`✅ Created: ${post.title.substring(0, 50)}...`);
      created++;
    } catch (error) {
      console.log(`❌ Error: ${post.title.substring(0, 30)}... - ${error.message}`);
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('🎉 BLOG SEEDING COMPLETE!');
  console.log('='.repeat(50));
  console.log(`\n📊 Summary:`);
  console.log(`   Created: ${created}`);
  console.log(`   Skipped: ${skipped}`);
  console.log(`   Total: ${blogPosts.length}\n`);
}

seedBlogs()
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
