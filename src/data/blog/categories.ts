export interface BlogCategory {
  slug: string
  name: string
  description: string
  icon: string
  intro: string
}

export interface BlogArticle {
  slug: string
  title: string
  excerpt: string
  category: string
  tags: string[]
  authorName: string
  readingTime: number
  publishedAt: string
  metaTitle: string
  metaDescription: string
  content: string
  relatedSlugs: string[]
}

export const BLOG_CATEGORIES: Record<string, BlogCategory> = {
  'strain-guides': {
    slug: 'strain-guides',
    name: 'Strain Guides',
    description: 'Expert guides to cannabis strains, including indica, sativa, and hybrid varieties with detailed profiles and recommendations.',
    icon: '🌿',
    intro: 'Navigating the world of cannabis strains can feel overwhelming, especially with thousands of cultivars available across dispensaries nationwide. Our strain guides are designed to cut through the confusion and help you find the perfect match for your needs, whether you are a first-time consumer or a seasoned enthusiast looking to expand your horizons. Each guide breaks down the essential characteristics of popular strains, including their cannabinoid profiles, terpene compositions, expected effects, and ideal use cases. We cover the three primary categories of cannabis strains: indica varieties known for their relaxing body effects, sativa strains prized for uplifting cerebral stimulation, and hybrid cultivars that blend qualities from both parent types. Understanding these distinctions is the first step toward making informed purchasing decisions at your local dispensary. Beyond simple categorization, our guides explore the nuanced differences between strains within each category, examining factors like THC and CBD ratios, dominant terpenes such as myrcene, limonene, and pinene, and the unique lineage that gives each strain its distinctive character. Whether you are seeking relief from specific symptoms, looking for the perfect social strain, or simply want to understand what makes a particular cultivar special, our comprehensive strain guides provide the knowledge you need to choose with confidence.',
  },
  'medical-cannabis': {
    slug: 'medical-cannabis',
    name: 'Medical Cannabis',
    description: 'Research-backed information on using cannabis for medical conditions, symptom management, and therapeutic applications.',
    icon: '🏥',
    intro: 'Medical cannabis has emerged as a significant area of interest for patients, healthcare providers, and researchers worldwide. As more states establish medical marijuana programs and clinical research continues to expand, understanding the therapeutic potential of cannabis has never been more important. Our medical cannabis articles provide evidence-based information about how cannabinoids interact with the body, which conditions may benefit from cannabis-based treatments, and how to work effectively with healthcare providers to incorporate medical marijuana into a comprehensive wellness plan. We examine the endocannabinoid system and its role in regulating pain perception, mood, appetite, immune function, and sleep, providing the scientific foundation needed to understand why cannabis can be effective for certain conditions. Our coverage includes detailed explorations of conditions commonly treated with medical cannabis, including chronic pain, anxiety disorders, epilepsy, multiple sclerosis, and chemotherapy-related symptoms. Each article references current clinical research and presents balanced perspectives on both the benefits and limitations of cannabis-based therapies. We also address practical considerations such as obtaining a medical marijuana card, understanding dosing protocols, choosing between CBD-dominant and THC-dominant products, and navigating the sometimes complex relationship between state medical marijuana programs and federal regulations. Whether you are a patient exploring cannabis as a treatment option or a caregiver seeking reliable information, our medical cannabis resources are built to inform and empower.',
  },
  'growing': {
    slug: 'growing',
    name: 'Growing Cannabis',
    description: 'Comprehensive cultivation guides for indoor and outdoor cannabis growing, from seed selection to harvest techniques.',
    icon: '🌱',
    intro: 'Growing your own cannabis is one of the most rewarding experiences available to enthusiasts in states where home cultivation is permitted. Whether you are setting up your first indoor grow tent or planning an ambitious outdoor garden, understanding the fundamentals of cannabis cultivation is essential for producing high-quality flower. Our growing guides cover every stage of the plant lifecycle, from selecting the right seeds or clones to harvesting, drying, and curing your final product. We provide practical, actionable advice on topics including grow room setup, lighting systems, nutrient management, soil composition, watering schedules, and pest prevention. Indoor growing offers precise environmental control and year-round production capability, while outdoor cultivation harnesses the full power of natural sunlight and can yield impressive harvests with lower startup costs. Our articles address both approaches in detail, helping you choose the method that best fits your space, budget, and experience level. We also explore advanced techniques such as low-stress training, screen of green setups, hydroponics, and organic living soil methods that can dramatically improve your yields and flower quality. Proper environmental management including temperature, humidity, and airflow control is covered extensively, along with guidance on identifying and addressing common issues like nutrient deficiencies, mold, and pest infestations. From your very first seed to a perfectly cured jar of homegrown flower, our cultivation resources provide the knowledge foundation needed to grow cannabis successfully and sustainably.',
  },
  'legalization': {
    slug: 'legalization',
    name: 'Legalization & Laws',
    description: 'Up-to-date coverage of cannabis legalization efforts, state laws, regulations, and policy developments across the United States.',
    icon: '⚖️',
    intro: 'The legal landscape of cannabis in the United States is evolving rapidly, with new states passing medical and recreational marijuana legislation each year. Staying informed about current laws, proposed legislation, and regulatory changes is essential for consumers, patients, business operators, and advocates alike. Our legalization and laws section provides comprehensive, regularly updated coverage of cannabis policy developments at both the state and federal level, helping you understand your rights and responsibilities wherever you are. We track the progress of legalization efforts across all fifty states, covering everything from ballot initiatives and legislative votes to the implementation details that affect how dispensaries operate, where you can consume, and how much you can possess. Federal cannabis policy remains a critical area of concern, and our articles examine ongoing efforts toward federal decriminalization, banking reform through legislation like the SAFE Banking Act, and the potential for comprehensive federal legalization. Understanding the intersection of state and federal law is particularly important for medical patients who travel between states, business owners navigating complex compliance requirements, and employees concerned about workplace drug testing policies. Our coverage also extends to international cannabis policy developments that may influence domestic trends. Whether you need to know the specific possession limits in your state, want to understand how new legislation might affect your medical marijuana access, or are following the broader trajectory of cannabis reform in America, our legalization and laws resources keep you informed with clear, accurate, and timely analysis.',
  },
  'edibles': {
    slug: 'edibles',
    name: 'Edibles & Dosing',
    description: 'Guides to cannabis edibles, proper dosing, cooking with cannabis, and understanding different edible products available at dispensaries.',
    icon: '🍪',
    intro: 'Cannabis edibles represent one of the fastest-growing segments of the legal marijuana market, offering a smoke-free consumption method that appeals to both new and experienced consumers. From precisely dosed gummies and chocolates to infused beverages and savory snacks, the variety of edible products available at dispensaries today is remarkable. However, edibles also present unique challenges around dosing, onset timing, and duration of effects that every consumer should understand before diving in. Our edibles and dosing guides provide the essential knowledge needed to enjoy cannabis-infused products safely and effectively. We cover the science behind how edibles are metabolized differently than inhaled cannabis, explaining why effects can take thirty minutes to two hours to onset and why the experience often feels more intense and longer-lasting. Proper dosing is the cornerstone of a positive edible experience, and our articles offer detailed guidance on starting low, going slow, and finding the optimal dose for your individual tolerance and goals. We explore the differences between THC-dominant, CBD-dominant, and balanced ratio edibles, and discuss how various cannabinoid and terpene profiles affect the edible experience. For those interested in making their own infused products at home, we provide step-by-step guides to decarboxylation, butter and oil infusion techniques, and recipe ideas that allow precise control over dosing and ingredients. Understanding concepts like milligram dosing, serving sizes, and the distinction between total package potency and per-serving potency is critical for making informed choices at the dispensary counter, and our guides break down these concepts in accessible, practical terms.',
  },
  'consumption': {
    slug: 'consumption',
    name: 'Consumption Methods',
    description: 'Explore different ways to consume cannabis including smoking, vaporizing, tinctures, topicals, and concentrates.',
    icon: '💨',
    intro: 'The way you consume cannabis has a profound impact on the speed of onset, intensity, duration, and overall character of your experience. Today, consumers have more options than ever before, ranging from traditional smoking methods to advanced vaporizer technology, sublingual tinctures, transdermal patches, and highly potent concentrates. Our consumption methods guides help you understand the advantages, disadvantages, and best practices associated with each approach, empowering you to choose the method that best aligns with your preferences, health considerations, and desired effects. Smoking remains the most widely recognized consumption method, but vaporization has gained significant popularity as a potentially less harmful alternative that preserves terpene flavors and allows precise temperature control. Concentrates including wax, shatter, live resin, and rosin offer extremely potent experiences for consumers with higher tolerance levels, while tinctures and capsules provide discreet, precisely dosed options ideal for medical patients. Topical products such as creams, balms, and transdermal patches deliver localized relief without producing psychoactive effects, making them popular for pain and inflammation management. Our articles examine the bioavailability and pharmacokinetics of each method, explaining how different routes of administration affect cannabinoid absorption rates and the resulting experience. We also cover essential accessories, proper technique, and safety considerations for each consumption method, ensuring you have the complete picture before making your choice. Whether you are exploring alternatives to smoking, curious about dabbing concentrates, or looking for the most discreet way to medicate throughout the day, our consumption method guides offer thorough, practical information.',
  },
  'industry': {
    slug: 'industry',
    name: 'Cannabis Industry',
    description: 'Business insights, market trends, investment analysis, and career opportunities in the rapidly growing cannabis industry.',
    icon: '📊',
    intro: 'The cannabis industry is one of the most dynamic and rapidly expanding sectors in the American economy, generating billions in annual revenue and creating hundreds of thousands of jobs across cultivation, manufacturing, retail, technology, and professional services. Understanding the forces shaping this industry is valuable whether you are considering a career in cannabis, evaluating business opportunities, or simply want to grasp the economic impact of legalization on communities across the country. Our cannabis industry articles provide informed analysis of market trends, business developments, regulatory impacts, and the evolving competitive landscape. We cover the major publicly traded cannabis companies, emerging multi-state operators, and the small businesses that form the backbone of local cannabis economies. Topics include licensing and compliance challenges, the ongoing impact of federal prohibition on banking and interstate commerce, social equity programs designed to address the disproportionate impact of past cannabis enforcement, and the technological innovations transforming cultivation, extraction, and retail operations. Our industry coverage also examines career pathways within the cannabis space, from budtender and cultivation technician roles to executive positions in compliance, marketing, and operations management. The cannabis industry faces unique challenges including complex regulatory frameworks, limited access to traditional financial services, and intense competition in mature markets, but it also offers extraordinary opportunities for entrepreneurs and professionals who understand the landscape. Whether you are tracking industry consolidation trends, researching market entry strategies, or exploring workforce development initiatives, our cannabis industry resources deliver the insights needed to navigate this exciting and evolving sector.',
  },
  'science': {
    slug: 'science',
    name: 'Cannabis Science',
    description: 'Deep dives into cannabinoid research, the endocannabinoid system, terpene science, and the latest clinical studies.',
    icon: '🔬',
    intro: 'The science of cannabis is advancing at a remarkable pace as researchers around the world work to understand the complex chemistry of the plant and its interactions with the human body. At the center of this research is the endocannabinoid system, a vast network of receptors and signaling molecules that plays a crucial role in maintaining physiological balance across nearly every organ system. Our cannabis science articles translate the latest research findings into accessible, informative content that helps consumers and patients make evidence-based decisions about their cannabis use. We explore the pharmacology of major cannabinoids including THC, CBD, CBG, CBN, and THCV, examining how each compound interacts with cannabinoid receptors and other molecular targets to produce its distinctive effects. The entourage effect, which describes how cannabinoids, terpenes, and flavonoids work synergistically to modulate the overall cannabis experience, is a recurring theme in our coverage. Terpene science receives particular attention, as these aromatic compounds contribute not only to the flavor and aroma of different strains but also to their therapeutic properties. We cover terpenes like myrcene, limonene, linalool, caryophyllene, and pinene in detail, explaining their individual effects and how they interact with cannabinoids. Our science section also examines research methodologies, clinical trial design, and the challenges researchers face when studying a substance that remains federally scheduled. From the molecular mechanisms of pain relief to the neurochemistry of the cannabis high, our science articles provide the depth of understanding needed to appreciate why cannabis affects people the way it does and where the research is heading next.',
  },
  'culture': {
    slug: 'culture',
    name: 'Cannabis Culture',
    description: 'Exploring the cultural impact of cannabis including history, social movements, lifestyle, events, and the community.',
    icon: '🎵',
    intro: 'Cannabis culture encompasses a rich tapestry of history, art, music, social movements, and community traditions that have evolved over thousands of years and continue to shape the way people relate to this remarkable plant. From ancient medicinal use in China and India to the counterculture revolution of the 1960s and the modern legalization movement, cannabis has been intertwined with human civilization in profound and often surprising ways. Our cannabis culture articles explore this heritage while examining how contemporary culture is being shaped by the mainstreaming of legal cannabis. We cover the artists, musicians, activists, and entrepreneurs who have contributed to cannabis culture, as well as the events, festivals, and social spaces where the community gathers. The social justice dimensions of cannabis culture are a critical part of our coverage, including the disproportionate impact of prohibition-era enforcement on communities of color and the ongoing efforts to build a more equitable legal industry through expungement programs, social equity licensing, and community reinvestment initiatives. We also examine how cannabis is represented in film, television, literature, and digital media, and how shifting cultural attitudes are transforming public perception of cannabis consumers. Lifestyle content including cannabis tourism, consumption lounge culture, cannabis-friendly dining experiences, and pairing guides for different activities rounds out our cultural coverage. Whether you are interested in the historical roots of cannabis use, the vibrant community that has grown around legalization, or the cultural conversations shaping the future of cannabis in America, our culture section offers thoughtful, engaging perspectives on what it means to be part of the cannabis community today.',
  },
}

export function getCategoryBySlug(slug: string): BlogCategory | undefined {
  return BLOG_CATEGORIES[slug]
}

export function getAllCategorySlugs(): string[] {
  return Object.keys(BLOG_CATEGORIES)
}

export function getAllCategories(): BlogCategory[] {
  return Object.values(BLOG_CATEGORIES)
}
