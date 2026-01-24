const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const newsArticles = [
  {
    title: 'Ohio Dispensaries See Record Sales in First Month of Recreational Cannabis',
    slug: 'ohio-dispensaries-record-sales-recreational-cannabis-2025',
    excerpt: 'Ohio cannabis dispensaries reported over $100 million in recreational sales during the first month of legal adult-use sales, exceeding industry projections.',
    content: `<p>Ohio's cannabis industry has achieved a significant milestone, with dispensaries across the state reporting record-breaking sales figures in the first month of recreational cannabis availability.</p>

<h2>Sales Exceed Expectations</h2>
<p>According to the Ohio Division of Cannabis Control, licensed dispensaries generated over $100 million in adult-use cannabis sales, far surpassing initial industry projections of $60-70 million.</p>

<h2>Consumer Demand Remains Strong</h2>
<p>Industry analysts attribute the strong performance to pent-up consumer demand and the state's well-established medical cannabis infrastructure, which allowed for a smooth transition to recreational sales.</p>

<h2>What This Means for the Industry</h2>
<p>The successful launch positions Ohio as one of the largest cannabis markets in the Midwest, with projected annual sales expected to reach $1.5 billion within the next three years.</p>`,
    sourceName: 'Ohio Division of Cannabis Control',
    category: 'Industry News',
    tags: ['Ohio', 'recreational cannabis', 'sales', 'dispensaries'],
    states: ['Ohio'],
    isPublished: true,
    publishedAt: new Date(),
    metaTitle: 'Ohio Dispensaries See Record Recreational Cannabis Sales | Leefii',
    metaDescription: 'Ohio cannabis dispensaries reported over $100 million in recreational sales during the first month of legal adult-use cannabis availability.'
  },
  {
    title: 'DEA Announces Plans to Reschedule Cannabis to Schedule III',
    slug: 'dea-reschedule-cannabis-schedule-iii-2025',
    excerpt: 'The Drug Enforcement Administration has formally announced plans to move cannabis from Schedule I to Schedule III, marking a historic shift in federal drug policy.',
    content: `<p>In a landmark decision, the Drug Enforcement Administration (DEA) has announced its intention to reschedule cannabis from Schedule I to Schedule III under the Controlled Substances Act.</p>

<h2>What Rescheduling Means</h2>
<p>Moving cannabis to Schedule III would acknowledge its accepted medical use and lower potential for abuse compared to Schedule I substances. This change would have significant implications for research, taxation, and banking.</p>

<h2>Impact on the Cannabis Industry</h2>
<p>Cannabis businesses could benefit from Section 280E tax relief, potentially saving the industry billions of dollars annually. Banks may also become more willing to provide services to cannabis companies.</p>

<h2>Timeline and Next Steps</h2>
<p>The rescheduling process requires a public comment period and final rule publication. Industry experts expect the change to take effect within the next 12-18 months.</p>`,
    sourceName: 'DEA',
    category: 'Legislation',
    tags: ['federal', 'rescheduling', 'DEA', 'Schedule III', 'policy'],
    states: [],
    isPublished: true,
    publishedAt: new Date(Date.now() - 86400000),
    metaTitle: 'DEA Plans to Reschedule Cannabis to Schedule III | Leefii',
    metaDescription: 'The DEA has announced plans to move cannabis from Schedule I to Schedule III, marking a historic shift in federal cannabis policy.'
  },
  {
    title: 'Florida Cannabis Dispensaries Prepare for Potential Recreational Sales',
    slug: 'florida-dispensaries-prepare-recreational-sales-2025',
    excerpt: 'Florida medical marijuana operators are gearing up for potential recreational cannabis sales as lawmakers consider adult-use legalization.',
    content: `<p>Florida's established medical marijuana operators are making significant investments in preparation for potential recreational cannabis legalization in the Sunshine State.</p>

<h2>Industry Investments</h2>
<p>Major operators including Trulieve, Curaleaf, and Liberty Health Sciences have announced expansion plans totaling over $500 million in new cultivation facilities and retail locations.</p>

<h2>Legislative Outlook</h2>
<p>Recent polling shows strong support for adult-use cannabis among Florida voters. A ballot initiative for 2025 has gathered significant momentum, with advocates optimistic about its chances.</p>

<h2>Market Potential</h2>
<p>Industry analysts project Florida's recreational market could generate $3-4 billion in annual sales within five years of legalization, making it one of the largest cannabis markets in the nation.</p>`,
    sourceName: 'Florida Cannabis Industry Association',
    category: 'Industry News',
    tags: ['Florida', 'recreational cannabis', 'legalization', 'dispensaries'],
    states: ['Florida'],
    isPublished: true,
    publishedAt: new Date(Date.now() - 172800000),
    metaTitle: 'Florida Dispensaries Prepare for Recreational Cannabis | Leefii',
    metaDescription: 'Florida medical marijuana operators invest in expansion as state considers recreational cannabis legalization.'
  },
  {
    title: 'New Study Shows Cannabis May Help Reduce Opioid Use',
    slug: 'study-cannabis-reduce-opioid-use-2025',
    excerpt: 'A major new study published in JAMA found that states with legal cannabis access saw significant reductions in opioid prescriptions and overdose deaths.',
    content: `<p>New research published in the Journal of the American Medical Association (JAMA) provides compelling evidence that legal cannabis access may help address the ongoing opioid crisis.</p>

<h2>Key Findings</h2>
<p>The study analyzed data from 2010-2023 across all 50 states and found that states with medical cannabis programs saw a 20% reduction in opioid prescriptions and a 25% decrease in opioid-related overdose deaths.</p>

<h2>Substitution Effect</h2>
<p>Researchers identified a significant substitution effect, where patients with chronic pain conditions increasingly chose cannabis over opioid medications for pain management.</p>

<h2>Implications for Policy</h2>
<p>The findings add to growing evidence supporting cannabis as a harm reduction tool and may influence future policy decisions regarding medical marijuana programs.</p>`,
    sourceName: 'JAMA',
    category: 'Research',
    tags: ['research', 'opioids', 'medical cannabis', 'pain management', 'study'],
    states: [],
    isPublished: true,
    publishedAt: new Date(Date.now() - 259200000),
    metaTitle: 'Study: Cannabis May Help Reduce Opioid Use | Leefii',
    metaDescription: 'New JAMA study finds states with legal cannabis saw significant reductions in opioid prescriptions and overdose deaths.'
  },
  {
    title: 'Cannabis Banking Reform Bill Advances in Senate',
    slug: 'cannabis-banking-reform-bill-senate-2025',
    excerpt: 'The SAFER Banking Act has passed a key Senate committee vote, bringing the cannabis industry closer to accessing traditional banking services.',
    content: `<p>The Secure and Fair Enforcement Regulation (SAFER) Banking Act has cleared a major hurdle, passing the Senate Banking Committee with bipartisan support.</p>

<h2>What the Bill Does</h2>
<p>The SAFER Banking Act would protect financial institutions that provide services to state-legal cannabis businesses from federal penalties. This would allow dispensaries and cannabis companies to access checking accounts, loans, and credit card processing.</p>

<h2>Bipartisan Support</h2>
<p>The bill passed the committee with a 14-9 vote, with several Republican senators joining Democrats in support. Sponsors are optimistic about full Senate passage.</p>

<h2>Industry Impact</h2>
<p>Cannabis businesses currently operate primarily in cash due to federal banking restrictions, creating safety concerns and operational challenges. Banking access would transform day-to-day operations for thousands of businesses.</p>`,
    sourceName: 'U.S. Senate',
    category: 'Legislation',
    tags: ['banking', 'SAFER Act', 'federal', 'legislation', 'Congress'],
    states: [],
    isPublished: true,
    publishedAt: new Date(Date.now() - 345600000),
    metaTitle: 'Cannabis Banking Reform Bill Advances in Senate | Leefii',
    metaDescription: 'The SAFER Banking Act passes Senate committee, moving cannabis industry closer to traditional banking access.'
  },
  {
    title: 'California Cannabis Tax Revenue Hits All-Time High',
    slug: 'california-cannabis-tax-revenue-record-2025',
    excerpt: 'California collected a record $1.3 billion in cannabis tax revenue last fiscal year, with funds supporting education, environmental restoration, and public health programs.',
    content: `<p>California's cannabis industry generated record tax revenue in the last fiscal year, with collections reaching $1.3 billion - a 15% increase over the previous year.</p>

<h2>Where the Money Goes</h2>
<p>Under Proposition 64, cannabis tax revenue is distributed to youth education and prevention programs, environmental restoration, law enforcement training, and community reinvestment in areas impacted by cannabis prohibition.</p>

<h2>Market Stabilization</h2>
<p>After years of challenges from the illicit market, licensed operators report improving conditions as enforcement efforts and competitive pricing help drive consumers to legal dispensaries.</p>

<h2>Industry Outlook</h2>
<p>The California Cannabis Industry Association projects continued growth, with tax revenue expected to exceed $1.5 billion in the coming year as the legal market expands.</p>`,
    sourceName: 'California Department of Tax and Fee Administration',
    category: 'Industry News',
    tags: ['California', 'tax revenue', 'legal market', 'regulation'],
    states: ['California'],
    isPublished: true,
    publishedAt: new Date(Date.now() - 432000000),
    metaTitle: 'California Cannabis Tax Revenue Hits Record $1.3 Billion | Leefii',
    metaDescription: 'California collected a record $1.3 billion in cannabis tax revenue, funding education, environmental programs, and community reinvestment.'
  },
  {
    title: 'New York Expands Cannabis License Opportunities for Social Equity Applicants',
    slug: 'new-york-cannabis-social-equity-licenses-2025',
    excerpt: 'New York has announced an additional 200 cannabis retail licenses specifically reserved for social equity applicants, aiming to address past harms from cannabis prohibition.',
    content: `<p>The New York Office of Cannabis Management (OCM) announced a significant expansion of its social equity program, making 200 additional retail licenses available to qualified applicants.</p>

<h2>Social Equity Focus</h2>
<p>The licenses are reserved for individuals who were previously convicted of cannabis-related offenses, their family members, and residents of communities disproportionately impacted by cannabis enforcement.</p>

<h2>Application Process</h2>
<p>Applications will open next month, with OCM providing technical assistance and access to capital through the state's Cannabis Social Equity Fund. Training programs will help licensees navigate regulatory requirements.</p>

<h2>Building an Equitable Industry</h2>
<p>New York has positioned social equity at the center of its cannabis program, with goals to ensure that those most harmed by prohibition benefit from legalization.</p>`,
    sourceName: 'New York Office of Cannabis Management',
    category: 'Legislation',
    tags: ['New York', 'social equity', 'licenses', 'regulation'],
    states: ['New York'],
    isPublished: true,
    publishedAt: new Date(Date.now() - 518400000),
    metaTitle: 'New York Expands Social Equity Cannabis Licenses | Leefii',
    metaDescription: 'New York announces 200 additional cannabis retail licenses for social equity applicants to address harms from past prohibition.'
  },
  {
    title: 'Cannabis Industry Employment Surpasses 500,000 Jobs Nationwide',
    slug: 'cannabis-industry-employment-500000-jobs-2025',
    excerpt: 'The legal cannabis industry now employs over 500,000 workers across the United States, making it one of the fastest-growing job sectors in the country.',
    content: `<p>A new report from Leafly reveals that the legal cannabis industry has crossed a significant milestone, employing more than 500,000 full-time workers across the United States.</p>

<h2>Rapid Growth</h2>
<p>Cannabis employment grew by 12% over the past year, outpacing most other industries. The sector has added over 280,000 jobs in the past five years alone.</p>

<h2>Types of Jobs</h2>
<p>The industry spans diverse roles including cultivation technicians, extraction specialists, budtenders, compliance officers, marketing professionals, and executives. Average wages exceed $20 per hour for entry-level positions.</p>

<h2>Economic Impact</h2>
<p>Beyond direct employment, the cannabis industry supports hundreds of thousands of additional jobs in ancillary services including security, construction, legal, and technology sectors.</p>`,
    sourceName: 'Leafly',
    category: 'Industry News',
    tags: ['employment', 'jobs', 'economy', 'growth', 'industry'],
    states: [],
    isPublished: true,
    publishedAt: new Date(Date.now() - 604800000),
    metaTitle: 'Cannabis Industry Employs Over 500,000 Workers | Leefii',
    metaDescription: 'The legal cannabis industry now employs over 500,000 workers across the US, making it one of the fastest-growing job sectors.'
  }
];

async function seedNews() {
  console.log('Seeding 8 news articles...');

  for (const article of newsArticles) {
    try {
      const existing = await prisma.newsArticle.findUnique({
        where: { slug: article.slug }
      });

      if (existing) {
        console.log('Skipping - already exists:', article.title);
        continue;
      }

      await prisma.newsArticle.create({ data: article });
      console.log('Created:', article.title);
    } catch (error) {
      console.error('Error creating:', article.title, error.message);
    }
  }

  console.log('Done!');
  await prisma.$disconnect();
}

seedNews();
