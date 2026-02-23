export interface NewsCategory {
  slug: string
  name: string
  description: string
  metaTitle: string
  metaDescription: string
  badgeColor: string
  intro: string
  faqs: { question: string; answer: string }[]
}

export const NEWS_CATEGORIES: NewsCategory[] = [
  {
    slug: 'legalization',
    name: 'Legalization',
    description: 'Law changes, ballot results, and new states legalizing',
    metaTitle: 'Cannabis Legalization News — Law Changes & Ballot Results | Leefii',
    metaDescription: 'Track cannabis legalization across the United States. State-by-state law changes, ballot measure results, and legislative updates on recreational and medical marijuana.',
    badgeColor: 'bg-green-100 text-green-700',
    intro: '<p>Cannabis legalization in the United States continues to reshape state and federal policy at an unprecedented pace. What began with Colorado and Washington becoming the first states to approve recreational adult-use cannabis in 2012 has expanded into a national movement, with a growing majority of states now permitting some form of legal cannabis access. Each legislative session and election cycle brings new ballot measures, gubernatorial signings, and regulatory frameworks that change the landscape for millions of Americans.</p><p>Tracking legalization news is essential for consumers, patients, business owners, and advocates alike. New laws affect everything from personal possession limits and home cultivation rights to licensing structures for dispensaries and delivery services. When a state moves from medical-only to full adult-use legalization, the shift creates entirely new markets, tax revenue streams, and employment opportunities. Conversely, regulatory setbacks or vetoed bills can delay progress for years.</p><p>Leefii\'s legalization news section compiles the most important developments from statehouses, courtrooms, and ballot boxes across the country. We cover new bills as they are introduced, track their progress through committee and floor votes, and report on the final outcomes. Our coverage extends to local ordinances, county-level opt-out decisions, and interstate compacts that are beginning to shape regional cannabis policy. Whether you are monitoring your home state or following national trends, this page provides a comprehensive and timely resource for understanding how cannabis law is evolving in the United States.</p>',
    faqs: [
      {
        question: 'How many states have legalized recreational cannabis?',
        answer: 'As of early 2026, 24 states plus the District of Columbia have legalized recreational adult-use cannabis. Several additional states have active ballot measures or legislative proposals that could expand this number in the near future.',
      },
      {
        question: 'What is the difference between decriminalization and legalization?',
        answer: 'Decriminalization reduces or eliminates criminal penalties for possession of small amounts of cannabis, but does not create a legal market for sales. Legalization establishes a regulated system where adults can legally purchase, possess, and in many cases cultivate cannabis, typically with licensed dispensaries and state oversight.',
      },
      {
        question: 'How do cannabis ballot measures work?',
        answer: 'Ballot measures allow voters to directly approve or reject proposed cannabis laws during elections. Advocates typically gather signatures to qualify the measure for the ballot, and if a majority of voters approve it, the measure becomes law. The specific requirements for signature gathering and approval thresholds vary by state.',
      },
      {
        question: 'Can a state legalize cannabis if it is still federally illegal?',
        answer: 'Yes. States have the authority to set their own cannabis policies under the Tenth Amendment. While cannabis remains classified as a Schedule I substance under federal law, the federal government has generally allowed states to implement their own legalization frameworks without direct interference, though federal prohibition still creates challenges for banking and interstate commerce.',
      },
      {
        question: 'What happens after a state legalizes cannabis?',
        answer: 'After legalization passes, there is typically an implementation period of 12 to 24 months during which the state establishes regulatory agencies, creates licensing frameworks, develops testing and safety standards, and begins accepting applications from businesses. Actual retail sales usually begin well after the law takes effect.',
      },
    ],
  },
  {
    slug: 'federal',
    name: 'Federal',
    description: 'DEA scheduling, congressional bills, and federal policy',
    metaTitle: 'Federal Cannabis News — DEA, Rescheduling & Congressional Bills | Leefii',
    metaDescription: 'Follow federal cannabis policy including DEA rescheduling updates, congressional bills like the SAFE Banking Act, and executive branch actions affecting marijuana regulation.',
    badgeColor: 'bg-blue-100 text-blue-700',
    intro: '<p>Federal cannabis policy sits at the intersection of law enforcement, public health, banking regulation, and civil rights. Despite widespread legalization at the state level, cannabis remains classified under the federal Controlled Substances Act, creating a complex legal environment that affects every participant in the industry. Congressional action, DEA scheduling decisions, and executive orders all play critical roles in determining the future of cannabis in America.</p><p>The most closely watched federal developments include the ongoing rescheduling process, which could move cannabis from Schedule I to a lower classification, significantly reducing regulatory burdens and opening new avenues for medical research. Congressional bills such as banking reform proposals aim to give cannabis businesses access to traditional financial services, while broader legalization bills seek to end federal prohibition entirely. Each of these tracks proceeds through different agencies and legislative bodies, making it important to follow multiple threads simultaneously.</p><p>Leefii\'s federal news coverage provides clear, concise reporting on the actions of Congress, the DEA, the FDA, the Department of Justice, and the White House as they relate to cannabis policy. We track bill introductions, committee votes, floor debates, and final outcomes. We also cover federal enforcement trends, interstate commerce discussions, and the regulatory guidance that shapes how state-legal markets operate within the broader federal framework. Whether you are a business owner concerned about banking access, a patient awaiting expanded research, or a citizen following the legislative process, this section keeps you informed about the decisions that affect cannabis at the highest level of government.</p>',
    faqs: [
      {
        question: 'Is cannabis legal at the federal level?',
        answer: 'No. Cannabis remains a Schedule I controlled substance under federal law, classified alongside heroin and LSD. However, the federal government has largely allowed states to implement their own legalization programs, and ongoing rescheduling efforts could change its federal classification.',
      },
      {
        question: 'What is the SAFE Banking Act?',
        answer: 'The SAFE Banking Act is a proposed federal bill that would allow banks and financial institutions to provide services to state-legal cannabis businesses without fear of federal penalties. Currently, many cannabis businesses operate on a cash-only basis because banks are reluctant to serve them due to federal prohibition.',
      },
      {
        question: 'What does rescheduling cannabis mean?',
        answer: 'Rescheduling refers to moving cannabis from its current Schedule I classification to a different schedule under the Controlled Substances Act. Moving to Schedule III, for example, would acknowledge medical uses, reduce certain regulatory burdens, and potentially allow cannabis businesses to take standard tax deductions currently denied under IRS code 280E.',
      },
      {
        question: 'How does federal law affect state-legal cannabis businesses?',
        answer: 'Federal prohibition creates significant challenges for state-legal businesses, including limited access to banking and financial services, inability to deduct ordinary business expenses on federal taxes, restrictions on interstate commerce, and the theoretical risk of federal enforcement. These issues persist even in states with fully legalized markets.',
      },
      {
        question: 'Can the president legalize cannabis by executive order?',
        answer: 'The president cannot unilaterally legalize cannabis. While executive orders can direct federal agencies to deprioritize enforcement or initiate rescheduling reviews, full legalization requires an act of Congress to amend or repeal the Controlled Substances Act as it applies to cannabis.',
      },
    ],
  },
  {
    slug: 'business',
    name: 'Business',
    description: 'Industry M&A, dispensary openings, and market reports',
    metaTitle: 'Cannabis Business News — Industry M&A, Market Reports | Leefii',
    metaDescription: 'Cannabis industry business news covering mergers and acquisitions, dispensary openings, market analysis, stock performance, and revenue reports from the legal marijuana sector.',
    badgeColor: 'bg-amber-100 text-amber-700',
    intro: '<p>The legal cannabis industry has grown into a multi-billion dollar sector spanning cultivation, manufacturing, retail, technology, and ancillary services. From publicly traded multi-state operators to single-location craft dispensaries, the business landscape is evolving rapidly as new markets open and existing ones mature. Understanding the financial and operational dynamics of this industry is critical for investors, entrepreneurs, job seekers, and anyone interested in the economic impact of cannabis legalization.</p><p>Cannabis business news covers a broad spectrum of topics including corporate mergers and acquisitions, initial public offerings, quarterly earnings reports, and market share analyses. Dispensary openings in newly legal states generate significant local interest, while large-scale cultivation expansions and processing facility investments signal broader industry confidence. Regulatory developments, licensing decisions, and tax policy changes also have direct and measurable impacts on business performance and market viability.</p><p>Leefii\'s business news section delivers coverage of the deals, data, and strategies shaping the cannabis economy. We report on the financial performance of major operators, track dispensary licensing and opening timelines across all legal states, and analyze market trends including pricing, consumer preferences, and product category growth. Our coverage also extends to ancillary businesses in areas like technology, compliance software, packaging, and professional services that support the broader cannabis supply chain. Whether you are evaluating investment opportunities, planning a business launch, or tracking the competitive landscape, this section provides the market intelligence you need to make informed decisions.</p>',
    faqs: [
      {
        question: 'How large is the legal cannabis industry?',
        answer: 'The legal U.S. cannabis industry generates over $30 billion in annual revenue as of 2025, with projections for continued growth as additional states legalize and existing markets mature. The global legal cannabis market is estimated to exceed $50 billion when including international markets.',
      },
      {
        question: 'What are multi-state operators (MSOs)?',
        answer: 'Multi-state operators are cannabis companies that hold licenses and operate in multiple states. These companies typically run vertically integrated businesses including cultivation, processing, and retail dispensaries across several legal markets. Major MSOs include Curaleaf, Trulieve, Green Thumb Industries, and Columbia Care.',
      },
      {
        question: 'Can cannabis companies be listed on U.S. stock exchanges?',
        answer: 'Due to federal prohibition, most plant-touching cannabis companies cannot list on major U.S. exchanges like the NYSE or NASDAQ. Many trade on the Canadian Securities Exchange or over-the-counter markets. Some ancillary companies that do not directly handle cannabis are listed on U.S. exchanges.',
      },
      {
        question: 'What is Section 280E and how does it affect cannabis businesses?',
        answer: 'Section 280E of the Internal Revenue Code prohibits businesses trafficking in Schedule I or II controlled substances from deducting ordinary business expenses on federal taxes. This means cannabis companies often face effective tax rates of 50% or higher, significantly impacting profitability. Rescheduling to Schedule III would eliminate this burden.',
      },
      {
        question: 'How do social equity programs work in cannabis licensing?',
        answer: 'Social equity programs are designed to ensure that communities disproportionately affected by cannabis prohibition have opportunities in the legal industry. These programs may offer priority licensing, reduced fees, technical assistance, and access to capital for qualifying applicants. Requirements and program structures vary significantly by state and municipality.',
      },
    ],
  },
  {
    slug: 'science',
    name: 'Science',
    description: 'Medical research, clinical trials, and cannabis studies',
    metaTitle: 'Cannabis Science News — Medical Research & Clinical Trials | Leefii',
    metaDescription: 'Latest cannabis science and medical research news including clinical trials, peer-reviewed studies, cannabinoid research, terpene science, and therapeutic discoveries.',
    badgeColor: 'bg-purple-100 text-purple-700',
    intro: '<p>Cannabis science has entered a new era of rigorous investigation as legalization opens doors for researchers that were previously closed by regulatory barriers. Clinical trials, peer-reviewed studies, and laboratory research are expanding our understanding of how cannabinoids, terpenes, and other plant compounds interact with the human body. From chronic pain management to neurological disorders, the medical potential of cannabis is being explored with increasing scientific precision and institutional support.</p><p>The research landscape encompasses a wide range of disciplines including pharmacology, neuroscience, oncology, psychiatry, and agricultural science. Studies examining the endocannabinoid system have revealed complex biological pathways that influence pain perception, inflammation, mood regulation, appetite, and immune function. Meanwhile, clinical trials are testing specific cannabinoid formulations for conditions ranging from epilepsy and multiple sclerosis to anxiety disorders and cancer-related symptoms, generating data that informs both medical practice and regulatory decisions.</p><p>Leefii\'s science news section covers the most significant research developments in cannabis medicine and plant science. We report on newly published studies, ongoing clinical trials, FDA-related research milestones, and breakthroughs in cannabinoid pharmacology. Our coverage also includes agricultural research on cultivation techniques, genetic analysis of cannabis strains, and the evolving science of terpene profiles and their therapeutic contributions. We aim to make complex scientific findings accessible and relevant, helping readers understand how research is shaping the future of cannabis-based medicine and the broader understanding of this plant. Whether you are a patient exploring treatment options, a healthcare provider seeking evidence-based information, or a researcher tracking the field, this section keeps you connected to the science driving cannabis forward.</p>',
    faqs: [
      {
        question: 'What is the endocannabinoid system?',
        answer: 'The endocannabinoid system (ECS) is a biological signaling network found throughout the human body that plays a role in regulating pain, mood, appetite, immune function, and sleep. It consists of endocannabinoids produced by the body, cannabinoid receptors (CB1 and CB2), and enzymes that break down endocannabinoids. Plant cannabinoids like THC and CBD interact with this system.',
      },
      {
        question: 'What FDA-approved cannabis-based medications exist?',
        answer: 'The FDA has approved Epidiolex, a CBD-based medication for treating severe forms of epilepsy, and Marinol and Syndros, which contain synthetic THC (dronabinol) for chemotherapy-induced nausea and AIDS-related weight loss. Cesamet, containing synthetic nabilone, is also approved for chemotherapy nausea.',
      },
      {
        question: 'How does CBD differ from THC in medical research?',
        answer: 'CBD (cannabidiol) and THC (tetrahydrocannabinol) are both cannabinoids but have different pharmacological profiles. THC is the primary psychoactive compound and is studied for pain relief, nausea reduction, and appetite stimulation. CBD is non-psychoactive and is researched for anti-inflammatory, anti-anxiety, and anti-seizure properties. Both interact with the endocannabinoid system but through different mechanisms.',
      },
      {
        question: 'Why has cannabis research been limited historically?',
        answer: 'Cannabis research has been constrained by its Schedule I classification, which requires researchers to obtain special federal licenses and, until recently, limited them to cannabis supplied by a single federally authorized facility at the University of Mississippi. This created significant bureaucratic hurdles, restricted the variety and quality of research material, and limited funding opportunities.',
      },
      {
        question: 'What are terpenes and why do they matter in cannabis science?',
        answer: 'Terpenes are aromatic compounds found in cannabis and many other plants that contribute to flavor and scent. Research suggests they may also have therapeutic effects and influence how cannabinoids work through what is known as the entourage effect. Common cannabis terpenes include myrcene, limonene, linalool, and pinene, each associated with different potential benefits such as relaxation, mood elevation, or anti-inflammatory properties.',
      },
    ],
  },
  {
    slug: 'culture',
    name: 'Culture',
    description: '420 events, lifestyle, celebrities, and community',
    metaTitle: 'Cannabis Culture News — Events, Lifestyle & Community | Leefii',
    metaDescription: 'Cannabis culture news covering 420 events, lifestyle trends, celebrity involvement, community activism, and the social side of the legal marijuana movement.',
    badgeColor: 'bg-pink-100 text-pink-700',
    intro: '<p>Cannabis culture encompasses far more than consumption — it is a vibrant and evolving community built around shared values of advocacy, creativity, wellness, and social connection. From major events like Cannabis Cup competitions and 420 celebrations to the growing presence of cannabis in mainstream entertainment, food, fitness, and fashion, the cultural dimension of legalization is transforming how society views and engages with the plant. Understanding cannabis culture means following the people, events, and trends that are defining this new era.</p><p>The cultural landscape of cannabis is remarkably diverse. It includes advocacy organizations fighting for criminal justice reform and expungement of prior convictions, artists and musicians who draw creative inspiration from the plant, entrepreneurs launching cannabis-infused dining experiences and wellness retreats, and everyday consumers who incorporate cannabis into their health and lifestyle routines. Social media, podcasts, and digital content creation have amplified these voices, creating thriving online communities alongside in-person gatherings and festivals.</p><p>Leefii\'s culture news section covers the people, events, and social trends shaping cannabis culture across the United States. We report on major industry events and competitions, highlight community activism and social equity initiatives, track celebrity involvement and mainstream media representation, and explore emerging lifestyle trends from cannabis tourism to infused cuisine. Our coverage recognizes that the normalization of cannabis is driven not only by laws and commerce but by the everyday experiences of the millions of Americans who have made it a part of their lives. Whether you are looking for upcoming events in your area, following cultural conversations around cannabis, or simply curious about how the community is evolving, this section connects you to the human side of the cannabis movement.</p>',
    faqs: [
      {
        question: 'What is 420 and why is it significant in cannabis culture?',
        answer: '420 refers to April 20th (4/20), widely recognized as an unofficial cannabis holiday. The term originated in the 1970s with a group of California high school students who used "4:20" as a code for meeting to consume cannabis. Today, 420 events range from large public rallies and festivals to community gatherings and retail promotions across legal states.',
      },
      {
        question: 'What are cannabis industry events and competitions?',
        answer: 'Cannabis industry events include trade shows, conferences, and product competitions where cultivators, processors, and brands showcase their offerings. Notable events include the Cannabis Cup, Emerald Cup, MJBizCon, and Hall of Flowers. These events feature product judging, educational seminars, networking opportunities, and vendor exhibitions.',
      },
      {
        question: 'How is cannabis influencing the food and beverage industry?',
        answer: 'Cannabis-infused dining experiences, edibles brands, and non-alcoholic cannabis beverages are creating new categories in the food and beverage space. Infused dinner events featuring multi-course meals paired with specific strains have gained popularity in legal states. Cannabis beverages including seltzers, teas, and mocktails are one of the fastest-growing product categories in the industry.',
      },
      {
        question: 'What is cannabis tourism?',
        answer: 'Cannabis tourism refers to travel specifically motivated by legal cannabis access. Popular destinations include Colorado, California, Oregon, and Nevada, where visitors can explore dispensaries, attend consumption lounges, join guided tours of cultivation facilities, and participate in cannabis-focused events and experiences. Some hotels and accommodations now offer cannabis-friendly policies.',
      },
      {
        question: 'How are social equity and justice connected to cannabis culture?',
        answer: 'Social equity and criminal justice reform are deeply intertwined with cannabis culture. Advocacy groups work to expunge prior cannabis convictions, support communities harmed by prohibition, and ensure diverse participation in the legal industry. Many cultural events and organizations center these issues, recognizing that the history of cannabis enforcement has disproportionately affected communities of color.',
      },
    ],
  },
]

export function getNewsCategoryBySlug(slug: string): NewsCategory | undefined {
  return NEWS_CATEGORIES.find((cat) => cat.slug === slug)
}

export function getAllNewsCategorySlugs(): string[] {
  return NEWS_CATEGORIES.map((cat) => cat.slug)
}
