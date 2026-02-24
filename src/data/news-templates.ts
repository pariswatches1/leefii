export interface NewsTemplate {
  slug: string
  title: string
  category: string
  tags: string[]
  states: string[]
  contentTemplate: string
  metaTitle: string
  metaDescription: string
}

export const NEWS_TEMPLATES: NewsTemplate[] = [
  {
    slug: 'state-legalizes-recreational-cannabis',
    title: '{{STATE}} Legalizes Recreational Cannabis — What to Know',
    category: 'legalization',
    tags: ['legalization', 'recreational', '{{state_lower}}'],
    states: ['{{state_slug}}'],
    metaTitle:
      '{{STATE}} Legalizes Recreational Cannabis — Key Details & Timeline | Leefii',
    metaDescription:
      '{{STATE}} has officially legalized recreational cannabis. Learn about the new law, when dispensaries open, possession limits, home grow rules, and what it means for residents.',
    contentTemplate: `<p>{{STATE}} has officially legalized recreational cannabis for adults aged 21 and older, marking a historic shift in the state's approach to marijuana policy. The new law establishes a regulated market that will allow licensed dispensaries to sell cannabis products to consumers, generate tax revenue for state programs, and begin the process of addressing past criminal enforcement.</p>

<h2>Key Provisions of the New Law</h2>
<p>Under the new legislation, adults 21 and older in {{STATE}} can legally possess up to one ounce of cannabis flower and up to five grams of cannabis concentrate. Home cultivation may be permitted depending on the final regulatory framework, with most proposals allowing up to six plants per household. Public consumption remains prohibited, and driving under the influence of cannabis carries the same penalties as alcohol-impaired driving.</p>

<p>The law creates a new regulatory body — or expands an existing one — to oversee licensing for cultivators, processors, testing laboratories, distributors, and retail dispensaries. Application windows for business licenses are expected to open within six to twelve months, with the first recreational sales projected to begin within twelve to eighteen months of the law taking effect.</p>

<h2>Tax Structure and Revenue</h2>
<p>{{STATE}} will impose an excise tax on recreational cannabis sales in addition to the standard state sales tax. Revenue is earmarked for several priorities including public education, substance abuse treatment programs, community reinvestment in areas disproportionately affected by past cannabis enforcement, and infrastructure improvements. Early revenue projections suggest the state could generate hundreds of millions of dollars annually once the market matures.</p>

<h2>Impact on Medical Cannabis Patients</h2>
<p>Existing medical cannabis patients in {{STATE}} will continue to have access to their current programs. In many states that have transitioned to recreational markets, medical patients retain advantages such as higher possession limits, lower tax rates, and access to higher-potency products. The new law includes provisions to protect the medical program during the transition period.</p>

<h2>Criminal Justice and Expungement</h2>
<p>One of the most significant aspects of the legalization effort is its criminal justice component. The law includes provisions for automatic or petition-based expungement of prior cannabis convictions for activities that are now legal. This could affect thousands of residents who have misdemeanor or felony records for cannabis possession or low-level distribution. Advocacy groups are working to ensure the expungement process is accessible and timely.</p>

<h2>What Happens Next</h2>
<p>Residents of {{STATE}} should be aware that legalization does not mean immediate access to recreational dispensaries. The regulatory framework must be finalized, licenses must be issued, and businesses must pass inspections before sales can begin. In the interim, possession within the legal limits is permitted, but purchasing from unlicensed sources remains illegal.</p>

<p>For the latest updates on {{STATE}} cannabis laws, visit our <a href="/laws/{{state_slug}}">{{STATE}} cannabis law guide</a>. To find licensed dispensaries near you, check our <a href="/dispensaries/{{state_slug}}">{{STATE}} dispensary directory</a>. Stay informed with <a href="/news">Leefii cannabis news</a> for ongoing coverage of this developing story.</p>`,
  },
  {
    slug: 'federal-cannabis-rescheduling',
    title: 'Federal Cannabis Rescheduling Approved — What It Means',
    category: 'federal',
    tags: ['federal', 'rescheduling', 'DEA', 'controlled-substances'],
    states: [],
    metaTitle:
      'Federal Cannabis Rescheduling Approved — Impact on Laws, Banking & Taxes | Leefii',
    metaDescription:
      'The federal government has approved rescheduling cannabis from Schedule I. Learn what this means for state laws, banking, taxes, research, and the industry.',
    contentTemplate: `<p>The federal government has officially approved the rescheduling of cannabis under the Controlled Substances Act, moving it from Schedule I — the most restrictive category shared with heroin and LSD — to a lower schedule. This decision represents the most significant federal cannabis policy change in over fifty years and will have far-reaching implications for the industry, patients, researchers, and state programs across the country.</p>

<h2>What Rescheduling Means</h2>
<p>Under Schedule I classification, cannabis was defined as having no accepted medical use and a high potential for abuse. Rescheduling acknowledges the growing body of evidence supporting the medical applications of cannabis and its cannabinoid compounds. The new classification recognizes cannabis as a substance with accepted medical use, reduced abuse potential compared to Schedule I drugs, and the need for continued regulatory oversight rather than outright prohibition.</p>

<p>It is important to understand that rescheduling is not the same as legalization or descheduling. Cannabis will still be a controlled substance under federal law, but the regulatory burden will be significantly reduced. This change opens doors for research, banking, and taxation that were previously closed or severely restricted.</p>

<h2>Impact on the Cannabis Industry</h2>
<p>The most immediate impact for cannabis businesses is the potential relief from Section 280E of the Internal Revenue Code. Under the previous Schedule I classification, cannabis companies could not deduct ordinary business expenses on their federal tax returns, resulting in effective tax rates that could exceed 70 percent. Rescheduling could eliminate or significantly reduce this burden, improving profitability across the industry and lowering prices for consumers.</p>

<p>Banking access is another major area of impact. While the SAFE Banking Act has been debated in Congress for years, rescheduling reduces the legal risk for financial institutions that serve cannabis businesses. Banks and credit unions that have been reluctant to open accounts for dispensaries and cultivators may now reconsider, reducing the industry's reliance on cash transactions and improving security.</p>

<h2>Research and Medical Implications</h2>
<p>Federal rescheduling dramatically expands the ability of universities and research institutions to study cannabis. Under Schedule I, researchers faced lengthy approval processes, limited access to research-grade cannabis, and significant bureaucratic barriers. The new classification streamlines the research approval process, allows more institutions to participate, and enables studies that were previously impractical or impossible to conduct.</p>

<p>For medical cannabis patients, rescheduling validates what many have known from personal experience — that cannabis has therapeutic value. It may also pave the way for FDA-approved cannabis-based medications beyond the few that currently exist, expanding treatment options for conditions ranging from chronic pain and epilepsy to PTSD and chemotherapy-induced nausea.</p>

<h2>State Laws Remain in Effect</h2>
<p>Federal rescheduling does not override state cannabis laws. States that have legalized recreational or medical cannabis will continue to operate under their existing frameworks. States that maintain prohibition can continue to do so. However, the reduced federal conflict may encourage more states to consider legalization measures and may reduce the legal uncertainty that has made some officials and businesses cautious.</p>

<h2>What Comes Next</h2>
<p>The rescheduling process involves a formal rulemaking period, public comment, and implementation timeline. Industry advocates continue to push for full descheduling, which would remove cannabis from the Controlled Substances Act entirely and allow states to regulate it similarly to alcohol. Whether Congress takes that next step remains to be seen.</p>

<p>Follow the latest federal cannabis developments on <a href="/news">Leefii cannabis news</a>. For state-specific impacts, visit our <a href="/laws">cannabis law guides</a> for every state. Understanding how federal changes affect your local market is essential — use our <a href="/dispensaries">dispensary directory</a> to find licensed retailers near you.</p>`,
  },
  {
    slug: 'election-2026-cannabis-ballot-results',
    title: 'Election 2026: Cannabis Ballot Results for Every State',
    category: 'legalization',
    tags: ['election', '2026', 'ballot', 'legalization', 'voting'],
    states: [],
    metaTitle:
      'Election 2026 Cannabis Ballot Results — State-by-State Legalization Outcomes | Leefii',
    metaDescription:
      'Complete results from the 2026 election for every cannabis ballot measure. See which states legalized recreational or medical marijuana and what comes next.',
    contentTemplate: `<p>The 2026 election cycle included cannabis-related ballot measures in several states, continuing the trend of voters directly deciding marijuana policy at the state level. From recreational legalization initiatives to medical program expansions and local option measures, this election has reshaped the cannabis landscape in significant ways.</p>

<h2>States That Voted on Recreational Legalization</h2>
<p>Multiple states placed recreational cannabis legalization on the ballot in 2026. Voter-initiated measures and legislatively referred questions gave residents the opportunity to establish regulated adult-use markets with provisions for licensing, taxation, and criminal justice reform. The results reflect the continuing shift in public opinion, with national polls consistently showing majority support for legalization across partisan lines.</p>

<p>Each measure included specific provisions for possession limits (typically one to two ounces of flower), home cultivation allowances, age restrictions (21 and older), and regulatory frameworks for licensing dispensaries, cultivators, and processors. Tax structures varied by state, with excise tax rates ranging from 10 to 20 percent in addition to standard sales taxes.</p>

<h2>Medical Cannabis Expansion Measures</h2>
<p>Several states without existing medical cannabis programs or with limited programs also had ballot measures to establish or expand patient access. These initiatives typically included provisions for qualifying conditions, patient registration systems, dispensary licensing, and caregiver designations. States that already had medical programs saw measures to add qualifying conditions, increase possession limits, or allow home cultivation for patients.</p>

<h2>Local Option and Municipal Measures</h2>
<p>Beyond statewide measures, numerous cities and counties voted on local cannabis policies. Some municipalities in legal states voted on whether to allow dispensaries to operate within their borders. Others considered zoning restrictions, local licensing caps, or additional local taxes on cannabis sales. These local measures demonstrate that even within states that have legalized, community-level decisions play a significant role in shaping access and availability.</p>

<h2>Campaign Spending and Key Supporters</h2>
<p>Cannabis ballot campaigns in 2026 attracted significant spending from both proponents and opponents. Industry groups, advocacy organizations, law enforcement associations, and public health groups all participated in shaping the public discourse. Campaign finance records show that combined spending across all cannabis ballot measures reached into the hundreds of millions, reflecting the high stakes involved for businesses, patients, and communities.</p>

<h2>What the Results Mean for National Policy</h2>
<p>Each state that legalizes or expands cannabis access adds momentum to the national movement. With a growing majority of states having some form of legal cannabis, pressure on the federal government to reform marijuana policy continues to build. The 2026 results will likely influence Congressional action on banking reform, rescheduling, and potentially broader legalization legislation.</p>

<p>For detailed breakdowns of each state's results and what they mean for local cannabis access, visit our <a href="/laws">state cannabis law pages</a>. To find dispensaries that may be opening in newly legal states, bookmark our <a href="/dispensaries">dispensary directory</a> and check back as new markets launch. Follow all post-election developments on <a href="/news">Leefii cannabis news</a>.</p>`,
  },
  {
    slug: 'state-medical-cannabis-expansion',
    title: '{{STATE}} Expands Medical Cannabis Program — New Conditions Added',
    category: 'legalization',
    tags: ['medical', 'expansion', '{{state_lower}}', 'qualifying-conditions'],
    states: ['{{state_slug}}'],
    metaTitle:
      '{{STATE}} Expands Medical Cannabis Program — New Qualifying Conditions | Leefii',
    metaDescription:
      '{{STATE}} has expanded its medical cannabis program with new qualifying conditions, increased possession limits, and improved patient access. Learn what changed.',
    contentTemplate: `<p>{{STATE}} has officially expanded its medical cannabis program, adding new qualifying conditions and improving access for patients across the state. The expansion reflects growing evidence supporting the therapeutic use of cannabis for a wider range of medical conditions and responds to advocacy from patients, physicians, and medical organizations.</p>

<h2>New Qualifying Conditions</h2>
<p>The updated program adds several conditions to the approved list for medical cannabis certification. While the specific conditions vary by state, common additions include anxiety disorders, insomnia, chronic migraines, autoimmune conditions, and opioid use disorder. These additions bring {{STATE}} more in line with states that have broader qualifying criteria and respond to clinical evidence and patient demand.</p>

<p>Patients with these newly qualifying conditions will need to obtain a certification from a licensed physician who is registered with the state's medical cannabis program. The certification process typically involves an in-person or telehealth consultation where the physician evaluates the patient's condition, reviews treatment history, and determines whether cannabis may be an appropriate therapeutic option.</p>

<h2>Changes to Possession and Purchase Limits</h2>
<p>Along with the expanded conditions, {{STATE}} has increased the amount of cannabis that registered patients can possess and purchase within a given period. These changes address a common complaint from patients who found that previous limits were insufficient for managing chronic conditions. The new limits are designed to balance patient access with regulatory oversight and are consistent with evidence-based dosing guidelines.</p>

<h2>New Dispensary Licenses</h2>
<p>To accommodate the expected increase in patient enrollment, the state is issuing additional dispensary licenses. Priority may be given to applicants in underserved areas where patients currently travel long distances to access their medicine. The expansion of retail locations is expected to reduce wait times, improve product availability, and create competition that helps keep prices accessible for patients.</p>

<h2>Home Cultivation Provisions</h2>
<p>Depending on the specific legislation, {{STATE}} may now allow registered patients to cultivate a limited number of cannabis plants at home for personal medical use. Home cultivation can significantly reduce costs for patients who rely on cannabis as a daily medication. If included, the provision typically allows three to six plants per patient, with restrictions on where plants can be grown and requirements for security measures.</p>

<h2>Impact on Patients and Caregivers</h2>
<p>The expansion is expected to benefit thousands of residents who have been managing their conditions without legal access to medical cannabis. Caregivers who assist patients with administration and procurement will also see improved access. Advocacy groups estimate that the number of registered patients in {{STATE}} could increase by 20 to 40 percent within the first year of the expansion.</p>

<p>For detailed information about {{STATE}}'s medical cannabis program, qualifying conditions, and how to get a medical card, visit our <a href="/laws/{{state_slug}}">{{STATE}} cannabis law guide</a>. To find licensed medical dispensaries near you, use our <a href="/dispensaries/{{state_slug}}">{{STATE}} dispensary directory</a>. For more updates on medical cannabis programs across the country, follow <a href="/news">Leefii cannabis news</a>.</p>`,
  },
  {
    slug: 'dispensary-opens-in-city',
    title: 'New Cannabis Dispensary Opens in {{CITY}}, {{STATE}}',
    category: 'business',
    tags: ['dispensary', 'business', '{{state_lower}}', '{{city_lower}}'],
    states: ['{{state_slug}}'],
    metaTitle:
      'New Cannabis Dispensary Opens in {{CITY}}, {{STATE}} — Location & Details | Leefii',
    metaDescription:
      'A new cannabis dispensary has opened in {{CITY}}, {{STATE}}. Find the location, hours, product selection, and what to expect when visiting.',
    contentTemplate: `<p>A new cannabis dispensary has officially opened its doors in {{CITY}}, {{STATE}}, expanding access to legal cannabis products for residents and visitors in the area. The opening marks another step in the growth of {{STATE}}'s regulated cannabis market and provides consumers with a new licensed retail option for purchasing flower, edibles, concentrates, and other cannabis products.</p>

<h2>Location and Hours</h2>
<p>The new dispensary is located in a commercial zone in {{CITY}}, selected for its accessibility and compliance with local zoning regulations that establish minimum distances from schools, churches, and other sensitive areas. Like all licensed dispensaries in {{STATE}}, the location passed a rigorous inspection process covering security systems, product storage, point-of-sale tracking, and compliance with state regulations.</p>

<p>Operating hours typically range from 9 a.m. to 9 p.m. daily, though specific hours may vary. First-time visitors should bring a valid government-issued photo ID proving they are 21 or older for recreational purchases, or their medical cannabis card and ID for medical patients. Many dispensaries offer online ordering and curbside pickup for added convenience.</p>

<h2>Product Selection</h2>
<p>The dispensary offers a full range of cannabis products sourced from licensed cultivators and processors in {{STATE}}. The menu includes dried flower in various strains (indica, sativa, and hybrid), pre-rolled joints, cannabis-infused edibles, vape cartridges, concentrates such as wax and shatter, tinctures, topicals, and accessories. All products are tested by a state-licensed laboratory for potency, pesticides, heavy metals, and microbial contaminants before reaching shelves.</p>

<p>Trained budtenders are available to guide new and experienced consumers through the selection process. They can help customers choose products based on desired effects, preferred consumption methods, experience level, and any medical needs. Many dispensaries also offer educational materials about dosing, responsible consumption, and the differences between cannabinoids like THC and CBD.</p>

<h2>Community Impact</h2>
<p>The new dispensary is expected to create between 15 and 40 local jobs, including positions for budtenders, inventory managers, security personnel, and administrative staff. Cannabis retail positions often include training in product knowledge, compliance, and customer service, providing career development opportunities in a growing industry.</p>

<p>Tax revenue generated by the dispensary will contribute to {{CITY}}'s local budget and the state's cannabis tax fund. In many jurisdictions, cannabis tax revenue supports public education, infrastructure, substance abuse treatment, and community reinvestment programs. The economic impact extends beyond the dispensary itself, as employees and customers patronize nearby businesses.</p>

<h2>Responsible Consumption Reminders</h2>
<p>{{STATE}} law requires that cannabis products be consumed in private residences. Public consumption, including in parks, sidewalks, and vehicles, is prohibited and subject to fines. Driving under the influence of cannabis is illegal and carries serious penalties. Consumers are advised to start with low doses, especially with edibles, which can take 30 to 90 minutes to produce effects.</p>

<p>To find all licensed dispensaries in {{CITY}} and throughout {{STATE}}, visit our <a href="/dispensaries/{{state_slug}}">{{STATE}} dispensary directory</a>. For information about {{STATE}} cannabis laws, possession limits, and consumption rules, see our <a href="/laws/{{state_slug}}">{{STATE}} cannabis law guide</a>. Stay updated on new dispensary openings and industry news at <a href="/news">Leefii cannabis news</a>.</p>`,
  },
]

/**
 * Get a news template by its slug.
 */
export function getTemplateBySlug(slug: string): NewsTemplate | undefined {
  return NEWS_TEMPLATES.find((t) => t.slug === slug)
}

/**
 * Get all template slugs for enumeration or routing.
 */
export function getAllTemplateSlugs(): string[] {
  return NEWS_TEMPLATES.map((t) => t.slug)
}
