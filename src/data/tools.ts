// ============================================================
// Interactive Cannabis Tools — Static Data
// Covers: calculators, quizzes, guides, and comparison tools
// ============================================================

export interface ToolDefinition {
  slug: string
  name: string
  shortName: string
  description: string
  icon: string
  metaTitle: string
  metaDescription: string
  intro: string
  faqs: { question: string; answer: string }[]
}

export const TOOLS: ToolDefinition[] = [
  {
    slug: 'dose-calculator',
    name: 'Edible Dosage Calculator',
    shortName: 'Dosage Calculator',
    description: 'Calculate your recommended edible dose based on experience level, body weight, and tolerance to find the perfect starting point.',
    icon: '🧮',
    metaTitle: 'Edible Dosage Calculator (2026) — Find Your Perfect Dose | Leefii',
    metaDescription: 'Free edible dosage calculator to find your ideal THC dose. Enter your weight, experience level, and tolerance for a personalized milligram recommendation.',
    intro: `<p>Finding the right edible dosage is one of the most important steps for anyone consuming cannabis-infused food, beverages, or capsules. Unlike smoking or vaping, edibles are processed through the digestive system and liver, which converts delta-9 THC into 11-hydroxy-THC — a metabolite that crosses the blood-brain barrier more efficiently and produces significantly stronger, longer-lasting effects. This is why getting your dose right matters so much.</p>
<p>Our free Edible Dosage Calculator takes into account your body weight, prior cannabis experience, current tolerance level, and the type of experience you are seeking to provide a personalized milligram recommendation. Whether you are a first-time user looking for a gentle introduction or an experienced consumer seeking precise control, this tool gives you a data-driven starting point that reduces the risk of overconsumption.</p>
<p>A common mistake with edibles is taking too much too soon. Onset time for edibles typically ranges from 30 minutes to 2 hours, and effects can last 4 to 8 hours or longer. Starting low and going slow is the golden rule. Most beginners should start between 2.5 mg and 5 mg of THC, while experienced users may be comfortable at 10 mg to 25 mg or beyond.</p>
<p>After using this calculator, explore our <a href="/strains">strain database</a> to find edible-friendly strains, browse <a href="/dispensaries">local dispensaries</a> for lab-tested edibles, or check out the latest <a href="/deals">cannabis deals</a> on edible products. For more guidance on responsible consumption, visit our <a href="/blog">cannabis blog</a> where we cover dosing strategies, edible recipes, and beginner tips.</p>`,
    faqs: [
      {
        question: 'How many milligrams of THC should a beginner take in an edible?',
        answer: 'Most experts recommend that beginners start with 2.5 mg to 5 mg of THC for their first edible experience. This low dose allows you to gauge your sensitivity without risking uncomfortable effects. Wait at least 2 hours before considering an additional dose.',
      },
      {
        question: 'Why do edibles feel stronger than smoking cannabis?',
        answer: 'When you eat an edible, your liver converts delta-9 THC into 11-hydroxy-THC, which crosses the blood-brain barrier more effectively. This metabolite produces more intense and longer-lasting psychoactive effects compared to inhaled THC, which enters the bloodstream directly through the lungs.',
      },
      {
        question: 'How long does it take for an edible to kick in?',
        answer: 'Edibles typically take between 30 minutes and 2 hours to produce noticeable effects, depending on your metabolism, whether you ate recently, and the type of edible. Sublingual products like tinctures and lozenges may work faster because they absorb through mouth tissues.',
      },
      {
        question: 'Does body weight affect how edibles work?',
        answer: 'Body weight can influence your response to edibles, though it is not the only factor. Larger individuals may require slightly higher doses, but metabolism, tolerance, and individual endocannabinoid system differences play equally important roles in determining your ideal dose.',
      },
      {
        question: 'What should I do if I take too much of an edible?',
        answer: 'If you consume too much THC, stay calm and remember that no one has ever fatally overdosed on cannabis. Find a comfortable place to rest, stay hydrated, and try chewing black peppercorns or taking CBD, which may help reduce anxiety. Effects will subside within a few hours.',
      },
    ],
  },
  {
    slug: 'law-checker',
    name: 'Cannabis Law Checker',
    shortName: 'Law Checker',
    description: 'Instantly check cannabis laws for any US state including legal status, possession limits, and whether medical or recreational use is allowed.',
    icon: '⚖️',
    metaTitle: 'Cannabis Law Checker by State (2026) — Is Weed Legal? | Leefii',
    metaDescription: 'Check cannabis laws for any US state instantly. See legal status, possession limits, medical vs recreational rules, home grow laws, and penalties. Updated for 2026.',
    intro: `<p>Cannabis laws in the United States vary dramatically from state to state, making it essential to understand the specific regulations wherever you live, travel, or purchase cannabis products. Our Cannabis Law Checker tool provides an instant snapshot of cannabis legality for any US state, covering recreational and medical status, possession limits, home cultivation rules, minimum age requirements, and potential penalties for violations.</p>
<p>As of 2026, the cannabis legal landscape continues to evolve rapidly. New states are legalizing recreational use, existing medical programs are expanding, and federal policy discussions around rescheduling continue to shape the industry. Staying informed about these changes is critical for responsible consumers, patients, and anyone in the cannabis industry. This tool is updated regularly to reflect the latest legislative changes across all 50 states and Washington D.C.</p>
<p>Understanding the difference between recreational legalization, medical-only programs, decriminalization, and full prohibition is crucial. Even in legal states, there are important rules about where you can consume, how much you can possess, and whether you can grow your own plants at home. Crossing state lines with cannabis remains federally illegal regardless of individual state laws.</p>
<p>For a deeper dive into cannabis legislation, explore our comprehensive <a href="/laws">state-by-state cannabis law guide</a> with detailed breakdowns of each jurisdiction. You can also find <a href="/dispensaries">licensed dispensaries</a> in your area, locate <a href="/deals">current deals</a> at legal retailers, or browse our <a href="/blog">blog</a> for the latest updates on cannabis policy and reform efforts nationwide.</p>`,
    faqs: [
      {
        question: 'Is cannabis legal at the federal level in the United States?',
        answer: 'Cannabis remains a Schedule I controlled substance under federal law, meaning it is technically illegal nationwide. However, the federal government has generally taken a hands-off approach in states that have legalized cannabis through their own legislation. This creates a complex patchwork of state and federal regulations.',
      },
      {
        question: 'Can I travel between states with cannabis?',
        answer: 'Transporting cannabis across state lines is a federal offense, even between two states where cannabis is legal. This applies to driving, flying, and any other mode of transportation. Always purchase cannabis in the state where you plan to consume it.',
      },
      {
        question: 'What is the difference between decriminalization and legalization?',
        answer: 'Legalization means cannabis is permitted under state law for either medical or recreational use through regulated systems. Decriminalization means possession of small amounts is no longer a criminal offense but may still result in civil fines. Decriminalized states typically do not have legal sales or dispensaries.',
      },
      {
        question: 'How often are cannabis laws updated in this tool?',
        answer: 'We review and update our cannabis law database regularly to reflect new legislation, ballot measures, and regulatory changes. Major updates are applied within days of new laws taking effect. We recommend checking back periodically, especially if you are planning travel.',
      },
      {
        question: 'Do medical cannabis cards from one state work in another state?',
        answer: 'Some states offer reciprocity and accept out-of-state medical cannabis cards, but most do not. States like Oklahoma, Maine, and Arkansas have reciprocity programs, while others require you to be a resident. Always verify reciprocity rules before traveling with or attempting to purchase medical cannabis in another state.',
      },
    ],
  },
  {
    slug: 'strain-finder',
    name: 'Strain Finder Quiz',
    shortName: 'Strain Finder',
    description: 'Take a quick interactive quiz to discover your ideal cannabis strain based on desired effects, flavor preferences, and experience level.',
    icon: '🔍',
    metaTitle: 'Strain Finder Quiz (2026) — Find Your Perfect Cannabis Strain | Leefii',
    metaDescription: 'Take our free strain finder quiz to discover your ideal cannabis strain. Answer questions about desired effects, flavors, and tolerance for personalized recommendations.',
    intro: `<p>With thousands of cannabis strains available on the market today, finding the one that matches your preferences and needs can feel overwhelming. Our Strain Finder Quiz simplifies this process by asking you a series of targeted questions about your desired effects, flavor preferences, experience level, consumption method, and the time of day you plan to use cannabis. Based on your answers, the quiz recommends strains from our comprehensive database that are most likely to deliver the experience you are looking for.</p>
<p>The quiz considers multiple factors that influence your cannabis experience. Indica-dominant strains tend to provide body-focused relaxation, while sativa-dominant strains offer more cerebral, energizing effects. Hybrid strains fall somewhere in between. Beyond indica and sativa classifications, the specific terpene and cannabinoid profiles of a strain play a major role in determining its effects, aroma, and flavor characteristics.</p>
<p>Whether you are seeking pain relief, better sleep, creative stimulation, social energy, or simply a pleasant way to unwind, the right strain makes all the difference. Our recommendations draw from real user reviews, lab-tested potency data, and terpene profiles to give you accurate, personalized suggestions rather than generic recommendations.</p>
<p>After completing the quiz, you can explore each recommended strain in detail through our <a href="/strains">strain encyclopedia</a>, compare options side by side, and find <a href="/dispensaries">nearby dispensaries</a> that carry your top picks. Looking to try something new? Check out our <a href="/strains/effects/relaxed">strains by effect</a> pages or browse the latest <a href="/deals">cannabis deals</a> to save on your next purchase.</p>`,
    faqs: [
      {
        question: 'How accurate is the Strain Finder Quiz?',
        answer: 'The quiz uses a matching algorithm based on terpene profiles, cannabinoid ratios, and reported user effects to generate recommendations. While individual experiences with cannabis can vary, our recommendations are based on aggregated data from thousands of user reviews and lab results, making them a reliable starting point.',
      },
      {
        question: 'Does the quiz recommend specific products or just strains?',
        answer: 'The quiz recommends cannabis strains, not specific branded products. Once you know which strains match your preferences, you can search our dispensary listings to find those strains available near you in the format you prefer, whether that is flower, cartridges, edibles, or concentrates.',
      },
      {
        question: 'Can I retake the quiz with different preferences?',
        answer: 'Absolutely. You can take the quiz as many times as you like with different answers to explore various strain options. Many users retake the quiz for different situations — one set of results for daytime use and another for evening relaxation, for example.',
      },
      {
        question: 'What if I have never used cannabis before — should I take this quiz?',
        answer: 'Yes, the quiz is designed for users of all experience levels, including complete beginners. Select the beginner option when asked about your experience level, and the quiz will prioritize mild, approachable strains with balanced THC/CBD ratios that are less likely to cause overwhelming effects.',
      },
      {
        question: 'How many strains does the quiz pull recommendations from?',
        answer: 'Our quiz draws from a database of hundreds of popular and widely available cannabis strains. We continuously add new strains and update existing profiles as new lab data and user reviews become available, ensuring our recommendations stay current with the evolving market.',
      },
    ],
  },
  {
    slug: 'price-compare',
    name: 'Cannabis Price Calculator',
    shortName: 'Price Calculator',
    description: 'Compare the true cost per dose across cannabis product formats including flower, edibles, concentrates, and cartridges.',
    icon: '💰',
    metaTitle: 'Cannabis Price Calculator (2026) — Compare Cost Per Dose | Leefii',
    metaDescription: 'Free cannabis price calculator to compare cost per dose across flower, edibles, concentrates, and vape cartridges. Find the most cost-effective way to consume cannabis.',
    intro: `<p>Cannabis products come in a wide range of formats and price points, making it difficult to determine which option offers the best value for your money. Our Cannabis Price Calculator helps you compare the true cost per dose across different product types — flower, edibles, concentrates, vape cartridges, tinctures, and more — so you can make informed purchasing decisions based on your consumption habits and budget.</p>
<p>The calculator goes beyond sticker price by factoring in THC or CBD content per package, the number of usable doses per product, bioavailability differences between consumption methods, and typical waste or loss during preparation. For example, a $40 eighth of flower might seem cheaper than a $50 vape cartridge, but when you factor in THC per dollar and the number of sessions each provides, the cost comparison may surprise you.</p>
<p>Understanding cost per milligram of THC or per dose is especially valuable for medical patients who consume cannabis regularly and need to manage their budgets carefully. Recreational users also benefit from this analysis when deciding between splurging on premium flower versus stocking up on cost-effective edibles or concentrates. The cannabis market offers incredible variety, and finding the best value does not always mean choosing the cheapest option.</p>
<p>Pair this calculator with our <a href="/deals">deals page</a> to find current discounts at <a href="/dispensaries">local dispensaries</a>. You can also compare prices across different retailers and explore our <a href="/strains">strain guide</a> to find affordable options that still deliver excellent quality. Visit our <a href="/blog">blog</a> for tips on stretching your cannabis budget further with smart buying strategies.</p>`,
    faqs: [
      {
        question: 'Which cannabis product format is the most cost-effective?',
        answer: 'Concentrates and distillates typically offer the lowest cost per milligram of THC, followed by flower and then edibles. However, cost-effectiveness depends on your consumption method, tolerance, and how efficiently you use each product. Our calculator helps you compare based on your specific usage patterns.',
      },
      {
        question: 'How does the calculator determine cost per dose?',
        answer: 'The calculator divides the total product cost by the number of usable doses, factoring in THC content, typical serving sizes, and bioavailability of each consumption method. Inhaled cannabis has approximately 30% bioavailability while edibles are around 10-20%, meaning you need different amounts to achieve similar effects.',
      },
      {
        question: 'Do cannabis prices vary significantly between states?',
        answer: 'Yes, cannabis prices vary widely between states due to differences in tax rates, market maturity, competition levels, and regulatory overhead. States with established markets like Colorado and Oregon tend to have lower prices, while newer markets often have higher costs that decrease over time as supply increases.',
      },
      {
        question: 'Is buying in bulk always cheaper for cannabis?',
        answer: 'Buying larger quantities typically offers a lower per-gram price, but this is not always the best strategy. Cannabis flower degrades over time if not stored properly, and purchasing more than you can use within a few weeks may result in diminished potency and flavor. Consider your consumption rate before buying bulk.',
      },
      {
        question: 'Does this calculator account for taxes?',
        answer: 'The calculator works with the price you enter, so you can input either pre-tax or post-tax amounts depending on your preference. For the most accurate comparison, we recommend entering the final out-the-door price including all state and local cannabis taxes.',
      },
    ],
  },
  {
    slug: 'terpene-guide',
    name: 'Terpene Guide',
    shortName: 'Terpene Guide',
    description: 'Explore cannabis terpenes with our interactive guide covering effects, aromas, health benefits, and which strains contain them.',
    icon: '🌿',
    metaTitle: 'Cannabis Terpene Guide (2026) — Effects, Aromas & Strains | Leefii',
    metaDescription: 'Interactive cannabis terpene guide covering all major terpenes, their effects, aromas, potential health benefits, and which strains contain the highest concentrations.',
    intro: `<p>Terpenes are aromatic compounds found in cannabis and many other plants that are responsible for the distinctive smells, flavors, and — increasingly recognized — effects of different cannabis strains. Our interactive Terpene Guide helps you understand the major terpenes found in cannabis, their unique aromas, associated effects, potential therapeutic benefits, and which strains contain the highest concentrations of each terpene.</p>
<p>For decades, cannabis consumers chose strains based solely on indica, sativa, or hybrid classifications. Modern cannabis science now recognizes that terpene profiles are far more predictive of a strain's actual effects than its genetic category alone. This concept, known as the entourage effect, describes how terpenes work synergistically with cannabinoids like THC and CBD to shape your overall experience. A high-myrcene strain will likely produce sedation regardless of whether it is labeled indica or sativa.</p>
<p>The most common cannabis terpenes include myrcene (earthy, sedating), limonene (citrus, mood-elevating), pinene (pine, alertness), caryophyllene (peppery, anti-inflammatory), linalool (floral, calming), terpinolene (fruity, uplifting), and humulene (hoppy, appetite-suppressing). Each has unique properties backed by emerging scientific research, and understanding them empowers you to choose strains more intentionally.</p>
<p>After exploring the terpene guide, visit our <a href="/strains">strain database</a> to filter by terpene profile, or take the <a href="/tools/strain-finder">Strain Finder Quiz</a> for personalized recommendations based on your preferred terpenes. Browse <a href="/dispensaries">dispensaries near you</a> for lab-tested products with detailed terpene data, and read our <a href="/blog">blog</a> for in-depth articles on how terpenes influence your cannabis experience.</p>`,
    faqs: [
      {
        question: 'What are terpenes and why do they matter in cannabis?',
        answer: 'Terpenes are aromatic compounds produced by cannabis plants that create the distinctive smell and flavor of each strain. Beyond aroma, terpenes interact with cannabinoids to influence the overall effects you experience. Understanding terpenes helps you predict how a particular strain will make you feel more accurately than indica/sativa labels alone.',
      },
      {
        question: 'What is the entourage effect?',
        answer: 'The entourage effect is the theory that cannabis compounds — including THC, CBD, and terpenes — work together synergistically to produce effects greater than any single compound alone. For example, the terpene myrcene may enhance THC absorption, while linalool may add calming effects that shape the overall experience.',
      },
      {
        question: 'Which terpene is best for anxiety relief?',
        answer: 'Linalool and myrcene are the two terpenes most commonly associated with anxiety relief. Linalool, also found in lavender, has demonstrated anxiolytic properties in research studies. Myrcene promotes relaxation and sedation. Strains high in these terpenes are often recommended for stress and anxiety management.',
      },
      {
        question: 'Can I find terpene information on dispensary product labels?',
        answer: 'Many legal dispensaries now provide terpene profiles on product labels alongside THC and CBD percentages, especially for flower and concentrate products. Lab-tested products from licensed retailers are more likely to include this data. Ask your budtender about terpene testing if the information is not displayed.',
      },
      {
        question: 'Do terpenes have effects on their own without THC?',
        answer: 'Yes, terpenes have independent biological activity even without cannabis cannabinoids. Limonene has demonstrated mood-elevating properties, pinene has anti-inflammatory effects, and linalool has anxiolytic qualities. These compounds are studied in aromatherapy and traditional medicine contexts beyond cannabis.',
      },
    ],
  },
  {
    slug: 'tolerance-break',
    name: 'Tolerance Break Calculator',
    shortName: 'T-Break Calculator',
    description: 'Calculate how long your tolerance break should be based on your current usage frequency, consumption method, and goals.',
    icon: '⏸️',
    metaTitle: 'Tolerance Break Calculator (2026) — How Long Should Your T-Break Be? | Leefii',
    metaDescription: 'Free tolerance break calculator to determine your ideal t-break duration. Enter your usage frequency, consumption method, and goals for a personalized recommendation.',
    intro: `<p>Regular cannabis use leads to tolerance buildup, meaning you need progressively more THC to achieve the same effects over time. Our Tolerance Break Calculator helps you determine the optimal duration for a cannabis tolerance break — commonly called a t-break — based on your current usage frequency, preferred consumption methods, how long you have been using cannabis regularly, and what you hope to achieve from the break.</p>
<p>Tolerance develops because your body's CB1 receptors downregulate in response to frequent THC exposure. Research shows that these receptors begin recovering within just 48 hours of abstaining from cannabis, with significant recovery occurring within 2 to 4 weeks. However, heavy daily users may benefit from longer breaks of 4 to 6 weeks to fully reset their endocannabinoid system and restore baseline sensitivity to THC.</p>
<p>The benefits of a tolerance break extend beyond just saving money on cannabis. Many users report improved mental clarity, more vivid dreams, better sleep quality after the initial adjustment period, and — most notably — a dramatically enhanced cannabis experience when they resume. That first session after a successful t-break often feels like rediscovering cannabis for the first time, with effects that are stronger, more nuanced, and more enjoyable at lower doses.</p>
<p>While on your break, explore our <a href="/strains">strain guide</a> to plan what you want to try when you return, read <a href="/blog">blog articles</a> about cannabis wellness strategies, or browse <a href="/deals">deals</a> so you can stock up for your comeback. You might also want to check our <a href="/tools/dose-calculator">dosage calculator</a> to find a lower starting dose for when your break ends, and search <a href="/dispensaries">dispensaries</a> for new products to try.</p>`,
    faqs: [
      {
        question: 'How long should a tolerance break last?',
        answer: 'The ideal t-break length depends on your usage patterns. Light users (a few times per week) may notice significant benefits from a 1 to 2 week break. Daily users typically need 2 to 4 weeks for meaningful receptor recovery. Very heavy users who consume multiple times daily may benefit from 4 to 6 weeks or longer.',
      },
      {
        question: 'What are the symptoms of cannabis withdrawal during a t-break?',
        answer: 'Common but temporary symptoms include difficulty sleeping, vivid dreams, irritability, decreased appetite, and mild anxiety. These symptoms typically peak within the first 3 to 5 days and resolve within 1 to 2 weeks. Staying hydrated, exercising, and maintaining a regular sleep schedule can help manage discomfort.',
      },
      {
        question: 'Will a 48-hour break make any difference?',
        answer: 'Even a 48-hour break allows your CB1 receptors to begin upregulating, and many users report noticeably enhanced effects after just two days of abstinence. While a longer break produces more dramatic results, short breaks can be a practical option for people who use cannabis for medical purposes.',
      },
      {
        question: 'Should I use CBD during my tolerance break?',
        answer: 'CBD does not bind to CB1 receptors the same way THC does, so using CBD products during a tolerance break should not significantly interfere with receptor recovery. Many people find that CBD helps manage withdrawal symptoms like anxiety and insomnia during their t-break without undermining the purpose of the break.',
      },
      {
        question: 'How should I resume cannabis after a tolerance break?',
        answer: 'Start with a much lower dose than your pre-break consumption level, ideally 25% to 50% of what you were using before. Your tolerance will be significantly reduced, and what was once a normal dose may now feel overwhelming. Gradually increase over several sessions until you find your new comfortable level.',
      },
    ],
  },
  {
    slug: 'grow-calculator',
    name: 'Grow Room Calculator',
    shortName: 'Grow Calculator',
    description: 'Estimate your yield, equipment costs, electricity expenses, and timeline for a home cannabis grow based on your setup.',
    icon: '🌱',
    metaTitle: 'Grow Room Calculator (2026) — Estimate Yield & Cost for Home Growing | Leefii',
    metaDescription: 'Free grow room calculator to estimate cannabis yield, equipment costs, electricity, and harvest timeline. Plan your home grow with confidence using our interactive tool.',
    intro: `<p>Home growing cannabis is legal in many states and offers significant long-term savings compared to purchasing from dispensaries, along with the satisfaction of cultivating your own supply. Our Grow Room Calculator helps you estimate expected yield, total equipment costs, ongoing electricity expenses, and your projected timeline from seed to harvest based on your specific setup, including grow space dimensions, lighting type, number of plants, growing medium, and experience level.</p>
<p>Planning a home grow involves many variables that impact both cost and outcome. Lighting is typically the largest upfront and ongoing expense — LED grow lights are more energy-efficient than HPS or MH bulbs but cost more initially. Grow medium choices range from soil (simplest for beginners) to hydroponics (faster growth, higher yields, steeper learning curve). Ventilation, nutrients, pots, and environmental controls all add to the initial investment but pay dividends across multiple harvests.</p>
<p>Yield estimation depends on lighting wattage, canopy coverage, genetics, and grower experience. A general rule of thumb is 0.5 to 1 gram per watt of light for experienced growers, though beginners should expect yields on the lower end while they develop their skills. Indoor grows typically take 3 to 5 months from seed to harvest, with autoflower varieties finishing faster than photoperiod strains.</p>
<p>Before starting your grow, check our <a href="/laws">cannabis law checker</a> to confirm home cultivation is legal in your state and learn about plant count limits. Browse our <a href="/strains">strain database</a> to find genetics suited to indoor growing, explore <a href="/dispensaries">dispensaries</a> that sell clones or seeds, and visit our <a href="/blog">blog</a> for growing guides, troubleshooting tips, and harvest techniques. You can also find <a href="/deals">deals on growing supplies</a> to help reduce your startup costs.</p>`,
    faqs: [
      {
        question: 'How much does it cost to start growing cannabis at home?',
        answer: 'A basic indoor grow setup for 1 to 4 plants typically costs between $200 and $800 for initial equipment including a grow tent, lights, ventilation, pots, soil, and nutrients. More advanced setups with LED lighting and automated controls can run $1,000 to $3,000. These costs are usually recovered within one or two successful harvests.',
      },
      {
        question: 'How much cannabis can I expect from my first home grow?',
        answer: 'First-time growers typically yield between 1 and 3 ounces per plant under standard indoor conditions. With experience, proper training techniques, and quality genetics, yields can increase to 4 to 8 ounces or more per plant. Autoflower strains generally produce smaller yields than photoperiod varieties.',
      },
      {
        question: 'How much will electricity cost for a home cannabis grow?',
        answer: 'Electricity costs depend on your lighting type, number of lights, and local utility rates. A small LED grow with one 200-watt light running 18 hours daily costs roughly $15 to $30 per month. A larger setup with 600 watts of HPS lighting might cost $50 to $100 monthly. Our calculator provides estimates based on your specific setup.',
      },
      {
        question: 'Is it legal to grow cannabis at home in my state?',
        answer: 'Home cultivation laws vary by state. Some states allow recreational home growing with plant limits (typically 4 to 12 plants), others permit it only for medical patients, and some states prohibit it entirely even where cannabis is otherwise legal. Always check your state and local laws before starting a grow.',
      },
      {
        question: 'How long does it take to grow cannabis from seed to harvest?',
        answer: 'Most indoor cannabis grows take 3 to 5 months from seed to harvest. This includes 1 to 2 weeks for germination and seedling stage, 4 to 8 weeks of vegetative growth, and 8 to 12 weeks of flowering. Autoflower strains can finish in as little as 8 to 10 weeks total from seed, making them popular for impatient growers.',
      },
    ],
  },
]

// ==================== HELPER FUNCTIONS ====================

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return TOOLS.find((tool) => tool.slug === slug)
}

export function getAllToolSlugs(): string[] {
  return TOOLS.map((tool) => tool.slug)
}

export function getAllTools(): ToolDefinition[] {
  return TOOLS
}
