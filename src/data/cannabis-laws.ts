// Cannabis law data for all 50 US states + DC
// Last comprehensive review: February 2026
// Individual state entries have their own lastUpdated dates

export type LegalStatus = 'recreational' | 'medical' | 'decriminalized' | 'illegal'

export interface MedicalProgram {
  hasProgram: boolean
  cardCost: string
  qualifyingConditions: string[]
  reciprocity: string
}

export interface StateLawData {
  slug: string
  name: string
  abbreviation: string
  status: LegalStatus
  statusLabel: string
  statusDescription: string
  possessionLimit: string
  purchaseLimit: string
  homeGrow: string
  minimumAge: number
  taxRate: string
  deliveryAllowed: string
  medical: MedicalProgram
  consumptionRules: string
  recentChanges: string[]
  ballotWatch: string | null
  lastUpdated: string
}

export const STATE_LAWS: Record<string, StateLawData> = {
  alabama: {
    slug: 'alabama',
    name: 'Alabama',
    abbreviation: 'AL',
    status: 'medical',
    statusLabel: 'Medical Only',
    statusDescription:
      'Medical cannabis is legal in Alabama under the Darren Wesley "Ato" Hall Compassion Act, signed in 2021. Patients with qualifying conditions and a valid medical marijuana card can purchase cannabis from licensed dispensaries. Recreational use remains illegal. The medical program began dispensary sales in 2024.',
    possessionLimit: '70 daily dosages (medical only)',
    purchaseLimit: '70 daily dosages per 30 days',
    homeGrow: 'Not allowed',
    minimumAge: 19,
    taxRate: '9% state tax on medical',
    deliveryAllowed: 'No',
    medical: {
      hasProgram: true,
      cardCost: '$65 state registration fee',
      qualifyingConditions: ['Cancer', 'Chronic pain', 'Epilepsy', 'HIV/AIDS', 'PTSD', 'Crohn\'s disease', 'Depression', 'Anxiety', 'Autism', 'Sickle cell anemia'],
      reciprocity: 'No reciprocity',
    },
    consumptionRules: 'Smoking cannabis flower is prohibited. Only non-smokable forms (tablets, capsules, tinctures, patches, topicals, nebulizers) are permitted. No public consumption.',
    recentChanges: ['First medical dispensaries opened in 2024', 'Program expansion under review for additional qualifying conditions'],
    ballotWatch: null,
    lastUpdated: '2026-01-15',
  },
  alaska: {
    slug: 'alaska',
    name: 'Alaska',
    abbreviation: 'AK',
    status: 'recreational',
    statusLabel: 'Recreational & Medical',
    statusDescription:
      'Cannabis is legal for both recreational and medical use in Alaska. Adults 21 and older can possess up to 1 ounce and grow up to 6 plants at home. Alaska was one of the first states to legalize recreational cannabis in 2014 through Ballot Measure 2.',
    possessionLimit: '1 oz (28g) in public',
    purchaseLimit: '1 oz flower or equivalent',
    homeGrow: '6 plants per adult (3 mature), 12 per household',
    minimumAge: 21,
    taxRate: '$50 per oz wholesale excise tax',
    deliveryAllowed: 'Yes (licensed delivery)',
    medical: {
      hasProgram: true,
      cardCost: '$25 registration fee',
      qualifyingConditions: ['Cancer', 'Glaucoma', 'HIV/AIDS', 'Chronic pain', 'Seizures', 'Nausea', 'Cachexia', 'Multiple sclerosis'],
      reciprocity: 'No reciprocity',
    },
    consumptionRules: 'No public consumption. Permitted in private residences and licensed consumption areas. DUI laws apply with no per se THC limit.',
    recentChanges: ['Cannabis cafe licenses expanded in 2025', 'On-site consumption lounges operating in Anchorage and Fairbanks'],
    ballotWatch: null,
    lastUpdated: '2026-01-15',
  },
  arizona: {
    slug: 'arizona',
    name: 'Arizona',
    abbreviation: 'AZ',
    status: 'recreational',
    statusLabel: 'Recreational & Medical',
    statusDescription:
      'Cannabis is legal for recreational and medical use in Arizona. Proposition 207 passed in 2020, allowing adults 21+ to possess up to 1 ounce and grow up to 6 plants at home. Medical patients have had access since 2010 under Proposition 203.',
    possessionLimit: '1 oz (28g), up to 5g concentrate',
    purchaseLimit: '1 oz flower or 5g concentrate',
    homeGrow: '6 plants per person, 12 per household',
    minimumAge: 21,
    taxRate: '16% excise tax on recreational',
    deliveryAllowed: 'Yes',
    medical: {
      hasProgram: true,
      cardCost: '$150 (2-year card)',
      qualifyingConditions: ['Cancer', 'Chronic pain', 'PTSD', 'Crohn\'s disease', 'Epilepsy', 'HIV/AIDS', 'Glaucoma', 'Hepatitis C', 'ALS', 'Agitation of Alzheimer\'s'],
      reciprocity: 'Visiting patients accepted with valid out-of-state card',
    },
    consumptionRules: 'No public consumption. Private residences only. Landlords may prohibit use. DUI laws strictly enforced.',
    recentChanges: ['Social equity licensing expanded in 2025', 'Testing standards updated for edibles'],
    ballotWatch: null,
    lastUpdated: '2026-01-15',
  },
  arkansas: {
    slug: 'arkansas',
    name: 'Arkansas',
    abbreviation: 'AR',
    status: 'medical',
    statusLabel: 'Medical Only',
    statusDescription:
      'Medical cannabis is legal in Arkansas under the Arkansas Medical Marijuana Amendment, passed in 2016. Patients with qualifying conditions can purchase up to 2.5 ounces every 14 days from licensed dispensaries. Recreational cannabis remains illegal.',
    possessionLimit: '2.5 oz per 14 days (medical)',
    purchaseLimit: '2.5 oz per 14-day period',
    homeGrow: 'Not allowed',
    minimumAge: 18,
    taxRate: '6.5% state + 4% privilege tax on medical',
    deliveryAllowed: 'No',
    medical: {
      hasProgram: true,
      cardCost: '$50 state fee',
      qualifyingConditions: ['Cancer', 'Glaucoma', 'HIV/AIDS', 'Hepatitis C', 'ALS', 'Tourette syndrome', 'Crohn\'s disease', 'PTSD', 'Severe arthritis', 'Chronic pain', 'Seizure disorders'],
      reciprocity: 'No reciprocity',
    },
    consumptionRules: 'No public consumption. Only in private residences. Smoking, vaporizing, edibles, tinctures, and topicals allowed.',
    recentChanges: ['Recreational ballot measure failed in 2024', 'Additional dispensary licenses issued in 2025'],
    ballotWatch: 'Potential recreational ballot measure for 2026',
    lastUpdated: '2026-01-15',
  },
  california: {
    slug: 'california',
    name: 'California',
    abbreviation: 'CA',
    status: 'recreational',
    statusLabel: 'Recreational & Medical',
    statusDescription:
      'Cannabis is fully legal in California for both recreational and medical use. Proposition 64 legalized recreational use in 2016 for adults 21+. California has the largest legal cannabis market in the US with over 1,000 licensed dispensaries statewide.',
    possessionLimit: '1 oz (28.5g) flower, 8g concentrate',
    purchaseLimit: '1 oz flower or 8g concentrate per transaction',
    homeGrow: '6 plants per household (personal use)',
    minimumAge: 21,
    taxRate: '15% excise + up to 10% local tax',
    deliveryAllowed: 'Yes (statewide delivery permitted)',
    medical: {
      hasProgram: true,
      cardCost: 'Varies by county ($50-$100 typical)',
      qualifyingConditions: ['Cancer', 'AIDS', 'Glaucoma', 'Chronic pain', 'Seizures', 'Severe nausea', 'Arthritis', 'Migraines', 'Any debilitating condition'],
      reciprocity: 'No formal reciprocity (recreational available to all 21+)',
    },
    consumptionRules: 'No public consumption or smoking where tobacco is prohibited. Licensed consumption lounges available in some cities. No consumption while driving.',
    recentChanges: ['Cannabis cafe legislation expanded in 2025', 'Tax reform reduced excise tax burden on cultivators', 'Amsterdam-style coffee shops authorized in select cities'],
    ballotWatch: null,
    lastUpdated: '2026-02-01',
  },
  colorado: {
    slug: 'colorado',
    name: 'Colorado',
    abbreviation: 'CO',
    status: 'recreational',
    statusLabel: 'Recreational & Medical',
    statusDescription:
      'Cannabis is legal for recreational and medical use in Colorado. Amendment 64 made Colorado one of the first two states to legalize recreational cannabis in 2012. Adults 21+ can possess up to 2 ounces and purchase from hundreds of licensed dispensaries.',
    possessionLimit: '2 oz (56g)',
    purchaseLimit: '1 oz per transaction for recreational',
    homeGrow: '6 plants per person (3 mature), 12 per household',
    minimumAge: 21,
    taxRate: '15% excise + 15% special sales tax',
    deliveryAllowed: 'Yes (licensed delivery)',
    medical: {
      hasProgram: true,
      cardCost: '$15 state fee',
      qualifyingConditions: ['Cancer', 'Glaucoma', 'HIV/AIDS', 'Cachexia', 'Chronic pain', 'Chronic nervous system disorders', 'Seizures', 'Severe nausea', 'PTSD', 'Autism'],
      reciprocity: 'No reciprocity (recreational available to all 21+)',
    },
    consumptionRules: 'No public consumption. Private residences and licensed consumption lounges only. DUI limit of 5 nanograms THC per ml blood.',
    recentChanges: ['Hospitality consumption licenses expanded', 'Potency caps for concentrates under legislative review'],
    ballotWatch: null,
    lastUpdated: '2026-01-15',
  },
  connecticut: {
    slug: 'connecticut',
    name: 'Connecticut',
    abbreviation: 'CT',
    status: 'recreational',
    statusLabel: 'Recreational & Medical',
    statusDescription:
      'Cannabis is legal for recreational and medical use in Connecticut. The legislature legalized adult-use cannabis in 2021 with retail sales beginning in January 2023. Adults 21+ can possess up to 1.5 ounces in public and purchase from licensed retailers.',
    possessionLimit: '1.5 oz in public, 5 oz at home',
    purchaseLimit: '1.5 oz per transaction',
    homeGrow: 'Up to 3 mature plants and 3 immature plants per adult (starting 2025)',
    minimumAge: 21,
    taxRate: '6.35% sales tax + varying THC potency taxes',
    deliveryAllowed: 'Yes (licensed delivery)',
    medical: {
      hasProgram: true,
      cardCost: 'No state fee (physician certification required)',
      qualifyingConditions: ['Cancer', 'Glaucoma', 'HIV/AIDS', 'Parkinson\'s', 'Multiple sclerosis', 'PTSD', 'Epilepsy', 'Chronic pain', 'Crohn\'s disease', 'Sickle cell disease'],
      reciprocity: 'Temporary registration for out-of-state patients',
    },
    consumptionRules: 'No public consumption. Private residences only. Smoking prohibited in multi-unit housing common areas.',
    recentChanges: ['Home cultivation legalized in 2025', 'Social equity licensing program launched', 'Additional retail licenses approved'],
    ballotWatch: null,
    lastUpdated: '2026-01-15',
  },
  delaware: {
    slug: 'delaware',
    name: 'Delaware',
    abbreviation: 'DE',
    status: 'recreational',
    statusLabel: 'Recreational & Medical',
    statusDescription:
      'Cannabis is legal for recreational and medical use in Delaware. The legislature passed HB 1 and HB 2 in 2023, legalizing adult-use cannabis. Adults 21+ can possess up to 1 ounce. Retail sales are being phased in through a regulated licensing system.',
    possessionLimit: '1 oz (28g)',
    purchaseLimit: '1 oz per transaction',
    homeGrow: 'Not allowed',
    minimumAge: 21,
    taxRate: '15% excise tax on recreational',
    deliveryAllowed: 'To be determined by regulation',
    medical: {
      hasProgram: true,
      cardCost: '$50 state fee',
      qualifyingConditions: ['Cancer', 'HIV/AIDS', 'PTSD', 'Seizure disorders', 'ALS', 'Chronic pain', 'Autism', 'Terminal illness', 'Intractable nausea'],
      reciprocity: 'Visiting patients accepted with valid card',
    },
    consumptionRules: 'No public consumption. Private residences only. Penalties for public consumption are civil fines.',
    recentChanges: ['Recreational cannabis signed into law in 2023', 'First recreational dispensary licenses issued in 2024', 'Retail sales ongoing expansion'],
    ballotWatch: null,
    lastUpdated: '2026-01-15',
  },
  florida: {
    slug: 'florida',
    name: 'Florida',
    abbreviation: 'FL',
    status: 'medical',
    statusLabel: 'Medical Only',
    statusDescription:
      'Medical cannabis is legal in Florida under Amendment 2, passed in 2016. Over 800,000 patients are registered in the medical program. A recreational legalization ballot measure (Amendment 3) narrowly failed in 2024, receiving 56% but needing 60% to pass.',
    possessionLimit: '2.5 oz smokable flower per 35 days (medical)',
    purchaseLimit: 'Doctor-determined amount, 2.5 oz smokable per 35 days',
    homeGrow: 'Not allowed',
    minimumAge: 18,
    taxRate: 'No additional cannabis tax on medical',
    deliveryAllowed: 'Yes (medical delivery available)',
    medical: {
      hasProgram: true,
      cardCost: '$75 state fee + physician evaluation ($150-$250)',
      qualifyingConditions: ['Cancer', 'Epilepsy', 'Glaucoma', 'HIV/AIDS', 'PTSD', 'ALS', 'Crohn\'s disease', 'Parkinson\'s', 'Multiple sclerosis', 'Chronic pain', 'Terminal conditions'],
      reciprocity: 'No reciprocity',
    },
    consumptionRules: 'No public consumption. Medical patients only in private residences. Smoking flower was legalized in 2019 for medical patients.',
    recentChanges: ['Amendment 3 (recreational) failed in November 2024 with 56% support', 'Vertical integration model continues', 'Over 800,000 registered patients'],
    ballotWatch: 'New recreational ballot initiative may be filed for 2026',
    lastUpdated: '2026-01-15',
  },
  georgia: {
    slug: 'georgia',
    name: 'Georgia',
    abbreviation: 'GA',
    status: 'medical',
    statusLabel: 'Medical Only (Limited)',
    statusDescription:
      'Georgia has a very limited medical cannabis program under Haleigh\'s Hope Act (2015). Only low-THC cannabis oil (under 5% THC) is permitted for qualifying patients. There are no recreational sales and the program does not allow smokable flower.',
    possessionLimit: '20 fl oz low-THC oil (under 5% THC)',
    purchaseLimit: 'As prescribed, low-THC oil only',
    homeGrow: 'Not allowed',
    minimumAge: 18,
    taxRate: '7% excise tax on low-THC oil',
    deliveryAllowed: 'Yes (medical low-THC oil delivery)',
    medical: {
      hasProgram: true,
      cardCost: '$25 registration card fee',
      qualifyingConditions: ['Cancer (end stage)', 'ALS', 'Seizure disorders', 'Multiple sclerosis', 'Crohn\'s disease', 'Mitochondrial disease', 'Parkinson\'s', 'Sickle cell disease', 'PTSD', 'Intractable pain', 'Autism'],
      reciprocity: 'No reciprocity',
    },
    consumptionRules: 'Low-THC oil only. No smokable flower. No public consumption. Product must be in original packaging.',
    recentChanges: ['First dispensaries opened in 2024 after years of delays', 'Production licenses finally activated', 'Limited product availability'],
    ballotWatch: null,
    lastUpdated: '2026-01-15',
  },
  hawaii: {
    slug: 'hawaii',
    name: 'Hawaii',
    abbreviation: 'HI',
    status: 'recreational',
    statusLabel: 'Recreational & Medical',
    statusDescription:
      'Cannabis is legal for recreational and medical use in Hawaii. The legislature passed legalization in 2024, making Hawaii the first state to legalize recreational cannabis through legislative action in the Pacific region. Adults 21+ can possess and purchase from licensed dispensaries.',
    possessionLimit: '1 oz (28g)',
    purchaseLimit: '1 oz per transaction',
    homeGrow: 'Up to 6 plants per person for personal use',
    minimumAge: 21,
    taxRate: '14% excise tax on recreational',
    deliveryAllowed: 'Yes',
    medical: {
      hasProgram: true,
      cardCost: '$38.50 state fee',
      qualifyingConditions: ['Cancer', 'Glaucoma', 'HIV/AIDS', 'Epilepsy', 'PTSD', 'Chronic pain', 'Crohn\'s disease', 'ALS', 'Multiple sclerosis', 'Lupus'],
      reciprocity: 'No reciprocity',
    },
    consumptionRules: 'No public consumption. Private residences only. Prohibited in rental units if landlord restricts. No consumption on beaches or parks.',
    recentChanges: ['Recreational legalization signed in 2024', 'Retail sales implementation began in 2025', 'Licensing framework established'],
    ballotWatch: null,
    lastUpdated: '2026-01-15',
  },
  idaho: {
    slug: 'idaho',
    name: 'Idaho',
    abbreviation: 'ID',
    status: 'illegal',
    statusLabel: 'Fully Illegal',
    statusDescription:
      'Cannabis remains fully illegal in Idaho for both recreational and medical use. Idaho is one of the few states with no medical marijuana program and no CBD exceptions. Possession of any amount is a misdemeanor, and the state constitution was amended in 2024 to prohibit legalization without a two-thirds legislative vote.',
    possessionLimit: 'Illegal — any amount is a misdemeanor',
    purchaseLimit: 'Illegal',
    homeGrow: 'Illegal',
    minimumAge: 0,
    taxRate: 'N/A',
    deliveryAllowed: 'No',
    medical: {
      hasProgram: false,
      cardCost: 'N/A',
      qualifyingConditions: [],
      reciprocity: 'No — out-of-state cards not recognized',
    },
    consumptionRules: 'All cannabis possession and use is illegal. Penalties include up to 1 year in jail and $1,000 fine for possession under 3 oz.',
    recentChanges: ['Constitutional amendment in 2024 requires two-thirds legislative supermajority to legalize', 'Multiple legalization initiatives have been blocked'],
    ballotWatch: null,
    lastUpdated: '2026-01-15',
  },
  illinois: {
    slug: 'illinois',
    name: 'Illinois',
    abbreviation: 'IL',
    status: 'recreational',
    statusLabel: 'Recreational & Medical',
    statusDescription:
      'Cannabis is legal for recreational and medical use in Illinois. The Cannabis Regulation and Tax Act made Illinois the first state to legalize recreational cannabis through legislative action in 2019, with sales starting January 2020. Adults 21+ can purchase from licensed dispensaries.',
    possessionLimit: '30g flower, 5g concentrate, 500mg THC edibles (residents)',
    purchaseLimit: '30g flower per transaction (residents), 15g (non-residents)',
    homeGrow: '5 plants per household (medical patients only)',
    minimumAge: 21,
    taxRate: '6.25-25% based on THC content + 7% cultivation tax',
    deliveryAllowed: 'Yes (licensed delivery)',
    medical: {
      hasProgram: true,
      cardCost: '$50-$100 (1-3 year cards)',
      qualifyingConditions: ['Cancer', 'HIV/AIDS', 'PTSD', 'Seizure disorders', 'Crohn\'s disease', 'Chronic pain', 'Migraines', 'Fibromyalgia', 'Autism', 'Anorexia nervosa'],
      reciprocity: 'No reciprocity (recreational available to non-residents at lower limits)',
    },
    consumptionRules: 'No public consumption. Private residences only. Licensed consumption lounges under development. No consumption near schools or in vehicles.',
    recentChanges: ['Social equity licensing program expanded', 'Consumption lounge regulations finalized', 'Additional craft grow licenses issued'],
    ballotWatch: null,
    lastUpdated: '2026-01-15',
  },
  indiana: {
    slug: 'indiana',
    name: 'Indiana',
    abbreviation: 'IN',
    status: 'illegal',
    statusLabel: 'Illegal (CBD Oil Exempt)',
    statusDescription:
      'Cannabis is illegal in Indiana for both recreational and medical use. Only CBD oil with less than 0.3% THC is legal under federal hemp guidelines. Possession of any amount of marijuana is a misdemeanor. Indiana has no medical marijuana program.',
    possessionLimit: 'Illegal — under 30g is misdemeanor',
    purchaseLimit: 'Illegal',
    homeGrow: 'Illegal',
    minimumAge: 0,
    taxRate: 'N/A',
    deliveryAllowed: 'No',
    medical: {
      hasProgram: false,
      cardCost: 'N/A',
      qualifyingConditions: [],
      reciprocity: 'No',
    },
    consumptionRules: 'All cannabis use is illegal. Possession under 30g is a Class B misdemeanor. CBD oil under 0.3% THC is the only exemption.',
    recentChanges: ['Medical cannabis bills introduced but have not advanced in the legislature', 'CBD oil regulations clarified'],
    ballotWatch: 'Medical cannabis legislation may be introduced in 2026 session',
    lastUpdated: '2026-01-15',
  },
  iowa: {
    slug: 'iowa',
    name: 'Iowa',
    abbreviation: 'IA',
    status: 'medical',
    statusLabel: 'Medical Only (Limited)',
    statusDescription:
      'Iowa has a limited medical cannabidiol program established in 2014. Patients with qualifying conditions can obtain medical CBD products with up to 4.5g total THC over a 90-day period. The program is restricted and does not allow smokable flower.',
    possessionLimit: '4.5g total THC per 90 days (medical)',
    purchaseLimit: '4.5g total THC per 90-day period',
    homeGrow: 'Not allowed',
    minimumAge: 18,
    taxRate: '6% state sales tax on medical products',
    deliveryAllowed: 'No',
    medical: {
      hasProgram: true,
      cardCost: '$100 biennial registration',
      qualifyingConditions: ['Cancer', 'Seizures', 'Crohn\'s disease', 'HIV/AIDS', 'ALS', 'Parkinson\'s', 'Multiple sclerosis', 'PTSD', 'Chronic pain', 'Terminal illness'],
      reciprocity: 'No reciprocity',
    },
    consumptionRules: 'Medical cannabidiol products only. No smokable flower. No public consumption. Products must be from licensed dispensaries.',
    recentChanges: ['THC cap increased to 4.5g per 90 days', 'Additional qualifying conditions considered'],
    ballotWatch: null,
    lastUpdated: '2026-01-15',
  },
  kansas: {
    slug: 'kansas',
    name: 'Kansas',
    abbreviation: 'KS',
    status: 'illegal',
    statusLabel: 'Illegal',
    statusDescription:
      'Cannabis is illegal in Kansas for both recreational and medical use. There is no medical marijuana program. Possession of any amount is a misdemeanor for first offense. Some legislative efforts for medical cannabis have been introduced but not passed.',
    possessionLimit: 'Illegal — any amount is criminal offense',
    purchaseLimit: 'Illegal',
    homeGrow: 'Illegal',
    minimumAge: 0,
    taxRate: 'N/A',
    deliveryAllowed: 'No',
    medical: {
      hasProgram: false,
      cardCost: 'N/A',
      qualifyingConditions: [],
      reciprocity: 'No',
    },
    consumptionRules: 'All cannabis use is illegal. First offense possession is a Class B misdemeanor (up to 6 months jail, $1,000 fine).',
    recentChanges: ['Medical cannabis bill passed Senate committee but stalled in 2024', 'Decriminalization efforts ongoing'],
    ballotWatch: 'Medical cannabis legislation may advance in 2026',
    lastUpdated: '2026-01-15',
  },
  kentucky: {
    slug: 'kentucky',
    name: 'Kentucky',
    abbreviation: 'KY',
    status: 'medical',
    statusLabel: 'Medical Only',
    statusDescription:
      'Medical cannabis is legal in Kentucky under SB 47, signed by the governor in 2023. The medical program is being implemented with dispensary sales expected to begin in 2025. Patients with qualifying conditions will be able to purchase from licensed dispensaries.',
    possessionLimit: 'Program amounts (TBD by regulation)',
    purchaseLimit: 'To be determined by program regulations',
    homeGrow: 'Not allowed',
    minimumAge: 18,
    taxRate: 'To be determined',
    deliveryAllowed: 'No',
    medical: {
      hasProgram: true,
      cardCost: 'To be determined by regulation',
      qualifyingConditions: ['Cancer', 'Chronic pain', 'Epilepsy', 'Multiple sclerosis', 'PTSD', 'Chronic nausea', 'Any condition recommended by physician'],
      reciprocity: 'No reciprocity',
    },
    consumptionRules: 'Medical only. No smokable flower initially (vapor, edibles, topicals). No public consumption.',
    recentChanges: ['SB 47 signed in 2023, effective January 2025', 'Licensing framework established', 'Dispensary applications being processed'],
    ballotWatch: null,
    lastUpdated: '2026-01-15',
  },
  louisiana: {
    slug: 'louisiana',
    name: 'Louisiana',
    abbreviation: 'LA',
    status: 'medical',
    statusLabel: 'Medical Only',
    statusDescription:
      'Medical cannabis is legal in Louisiana through a program established in 2015. The program has been significantly expanded, with smokable flower legalized in 2022. Patients with qualifying conditions can purchase from licensed pharmacies. Recreational use remains illegal but possession is decriminalized.',
    possessionLimit: '2.5 oz per 14 days (medical)',
    purchaseLimit: '2.5 oz flower per 14 days',
    homeGrow: 'Not allowed',
    minimumAge: 18,
    taxRate: 'Standard pharmacy pricing (no cannabis-specific tax)',
    deliveryAllowed: 'No',
    medical: {
      hasProgram: true,
      cardCost: 'Physician recommendation required ($150-$200 typical)',
      qualifyingConditions: ['Cancer', 'HIV/AIDS', 'Epilepsy', 'PTSD', 'Crohn\'s disease', 'Muscular dystrophy', 'Chronic pain', 'Autism', 'Glaucoma', 'Parkinson\'s'],
      reciprocity: 'No reciprocity',
    },
    consumptionRules: 'Medical patients only. No public consumption. Smokable flower allowed since 2022. Possession under 14g is decriminalized (no jail, fine only).',
    recentChanges: ['Smokable flower legalized in 2022', 'Decriminalization of small amounts enacted', 'Additional pharmacy licenses issued'],
    ballotWatch: null,
    lastUpdated: '2026-01-15',
  },
  maine: {
    slug: 'maine',
    name: 'Maine',
    abbreviation: 'ME',
    status: 'recreational',
    statusLabel: 'Recreational & Medical',
    statusDescription:
      'Cannabis is legal for recreational and medical use in Maine. Question 1 legalized recreational cannabis in 2016, with retail sales starting in 2020. Adults 21+ can possess up to 2.5 ounces and grow up to 3 mature plants at home.',
    possessionLimit: '2.5 oz (71g)',
    purchaseLimit: '2.5 oz per transaction',
    homeGrow: '3 mature plants, 12 immature, unlimited seedlings',
    minimumAge: 21,
    taxRate: '10% excise tax on recreational',
    deliveryAllowed: 'Yes (licensed delivery)',
    medical: {
      hasProgram: true,
      cardCost: '$25 state fee (caregiver $25)',
      qualifyingConditions: ['Cancer', 'HIV/AIDS', 'Epilepsy', 'PTSD', 'Chronic pain', 'Crohn\'s disease', 'ALS', 'Hepatitis C', 'Glaucoma', 'Any condition certified by physician'],
      reciprocity: 'No formal reciprocity (recreational available to all 21+)',
    },
    consumptionRules: 'No public consumption. Private residences only. No consumption in vehicles. Smoking restrictions apply where tobacco is prohibited.',
    recentChanges: ['Social consumption establishments under consideration', 'Craft cultivation tier expanded'],
    ballotWatch: null,
    lastUpdated: '2026-01-15',
  },
  maryland: {
    slug: 'maryland',
    name: 'Maryland',
    abbreviation: 'MD',
    status: 'recreational',
    statusLabel: 'Recreational & Medical',
    statusDescription:
      'Cannabis is legal for recreational and medical use in Maryland. Question 4 was approved by voters in 2022, with recreational sales beginning July 2023. Adults 21+ can possess up to 1.5 ounces and grow 2 plants at home.',
    possessionLimit: '1.5 oz personal use, 12g concentrate',
    purchaseLimit: '1.5 oz flower per transaction',
    homeGrow: '2 plants per person',
    minimumAge: 21,
    taxRate: '9% sales tax on recreational',
    deliveryAllowed: 'Yes',
    medical: {
      hasProgram: true,
      cardCost: 'Free registration (physician certification required)',
      qualifyingConditions: ['Chronic pain', 'PTSD', 'Seizure disorders', 'Glaucoma', 'Anorexia', 'Cachexia', 'Severe nausea', 'Severe pain', 'Any condition certified by physician'],
      reciprocity: 'No reciprocity (recreational available to all 21+)',
    },
    consumptionRules: 'No public consumption. Private residences only. Prohibited in workplaces and near schools.',
    recentChanges: ['Recreational sales launched July 2023', 'Social equity licensing program active', 'Home cultivation allowed starting 2023'],
    ballotWatch: null,
    lastUpdated: '2026-01-15',
  },
  massachusetts: {
    slug: 'massachusetts',
    name: 'Massachusetts',
    abbreviation: 'MA',
    status: 'recreational',
    statusLabel: 'Recreational & Medical',
    statusDescription:
      'Cannabis is legal for recreational and medical use in Massachusetts. Question 4 legalized recreational use in 2016, with retail sales beginning in 2018. Adults 21+ can possess up to 1 ounce in public and grow up to 6 plants per person at home.',
    possessionLimit: '1 oz in public, 10 oz at home',
    purchaseLimit: '1 oz flower or 5g concentrate',
    homeGrow: '6 plants per person, 12 per household',
    minimumAge: 21,
    taxRate: '10.75% excise + 6.25% sales tax + up to 3% local',
    deliveryAllowed: 'Yes (licensed delivery)',
    medical: {
      hasProgram: true,
      cardCost: '$50 state fee',
      qualifyingConditions: ['Cancer', 'Glaucoma', 'HIV/AIDS', 'Hepatitis C', 'ALS', 'Crohn\'s disease', 'Parkinson\'s', 'Multiple sclerosis', 'PTSD'],
      reciprocity: 'No reciprocity (recreational available to all 21+)',
    },
    consumptionRules: 'No public consumption. Private residences only. Cannabis cafes under licensed pilot program. No consumption where tobacco smoking is prohibited.',
    recentChanges: ['Cannabis cafe licenses issued', 'Social equity programs expanded', 'Delivery licensing streamlined'],
    ballotWatch: null,
    lastUpdated: '2026-01-15',
  },
  michigan: {
    slug: 'michigan',
    name: 'Michigan',
    abbreviation: 'MI',
    status: 'recreational',
    statusLabel: 'Recreational & Medical',
    statusDescription:
      'Cannabis is legal for recreational and medical use in Michigan. Proposal 1 legalized recreational cannabis in 2018. Adults 21+ can possess up to 2.5 ounces in public and grow up to 12 plants at home. Michigan has one of the most robust cannabis markets in the Midwest.',
    possessionLimit: '2.5 oz in public, 10 oz at home',
    purchaseLimit: '2.5 oz per transaction',
    homeGrow: '12 plants per household',
    minimumAge: 21,
    taxRate: '10% excise + 6% sales tax on recreational',
    deliveryAllowed: 'Yes',
    medical: {
      hasProgram: true,
      cardCost: '$40 state fee',
      qualifyingConditions: ['Cancer', 'Glaucoma', 'HIV/AIDS', 'Hepatitis C', 'ALS', 'Crohn\'s disease', 'PTSD', 'Chronic pain', 'Seizures', 'Severe nausea'],
      reciprocity: 'No reciprocity (recreational available to all 21+)',
    },
    consumptionRules: 'No public consumption. Private residences only. Consumption lounges under local control. No use while driving.',
    recentChanges: ['Consumption lounge regulations adopted', 'Social equity licensing expanded', 'Interstate commerce pilot under discussion'],
    ballotWatch: null,
    lastUpdated: '2026-01-15',
  },
  minnesota: {
    slug: 'minnesota',
    name: 'Minnesota',
    abbreviation: 'MN',
    status: 'recreational',
    statusLabel: 'Recreational & Medical',
    statusDescription:
      'Cannabis is legal for recreational and medical use in Minnesota. The legislature passed HF 100 in 2023, legalizing adult-use cannabis. Adults 21+ can possess up to 2 ounces in public and grow up to 8 plants at home (4 mature). Retail sales began in 2025.',
    possessionLimit: '2 oz in public, 2 lbs at home',
    purchaseLimit: '2 oz flower per transaction',
    homeGrow: '8 plants per household (4 mature)',
    minimumAge: 21,
    taxRate: '10% gross receipts tax on recreational',
    deliveryAllowed: 'Yes (licensed delivery)',
    medical: {
      hasProgram: true,
      cardCost: 'Varies by provider',
      qualifyingConditions: ['Cancer', 'Glaucoma', 'HIV/AIDS', 'Tourette syndrome', 'ALS', 'Seizures', 'Chronic pain', 'PTSD', 'Autism', 'Sleep apnea'],
      reciprocity: 'No reciprocity (recreational available to all 21+)',
    },
    consumptionRules: 'No public consumption. Private residences only. Lower-potency edibles widely available. No consumption in vehicles.',
    recentChanges: ['Recreational legalization signed 2023', 'Office of Cannabis Management established', 'First recreational retail licenses issued 2025'],
    ballotWatch: null,
    lastUpdated: '2026-01-15',
  },
  mississippi: {
    slug: 'mississippi',
    name: 'Mississippi',
    abbreviation: 'MS',
    status: 'medical',
    statusLabel: 'Medical Only',
    statusDescription:
      'Medical cannabis is legal in Mississippi under the Mississippi Medical Cannabis Act, signed in 2022. Patients with qualifying conditions can purchase up to 3 ounces per month from licensed dispensaries. Recreational use remains illegal.',
    possessionLimit: '3 oz per month (medical)',
    purchaseLimit: '3 oz per 30-day period',
    homeGrow: 'Not allowed',
    minimumAge: 18,
    taxRate: '7% state sales tax on medical',
    deliveryAllowed: 'No',
    medical: {
      hasProgram: true,
      cardCost: '$25 state fee',
      qualifyingConditions: ['Cancer', 'Epilepsy', 'PTSD', 'Chronic pain', 'HIV/AIDS', 'ALS', 'Crohn\'s disease', 'Parkinson\'s', 'Multiple sclerosis', 'Sickle cell disease', 'Spinal cord injury'],
      reciprocity: 'No reciprocity',
    },
    consumptionRules: 'Medical patients only. No public consumption. Smokable flower and other forms permitted.',
    recentChanges: ['Medical cannabis program fully operational since 2023', 'Over 100 dispensary licenses issued', 'Patient enrollment growing rapidly'],
    ballotWatch: null,
    lastUpdated: '2026-01-15',
  },
  missouri: {
    slug: 'missouri',
    name: 'Missouri',
    abbreviation: 'MO',
    status: 'recreational',
    statusLabel: 'Recreational & Medical',
    statusDescription:
      'Cannabis is legal for recreational and medical use in Missouri. Amendment 3 legalized recreational cannabis in 2022, with sales beginning in February 2023. Adults 21+ can possess up to 3 ounces and purchase from licensed dispensaries. Missouri also features automatic expungement of past cannabis offenses.',
    possessionLimit: '3 oz on person',
    purchaseLimit: '3 oz per transaction',
    homeGrow: '6 flowering plants, 6 non-flowering, 6 clones per household',
    minimumAge: 21,
    taxRate: '6% excise tax on recreational',
    deliveryAllowed: 'Yes',
    medical: {
      hasProgram: true,
      cardCost: '$25 state fee (annual)',
      qualifyingConditions: ['Cancer', 'Epilepsy', 'HIV/AIDS', 'PTSD', 'Chronic pain', 'Migraines', 'Any debilitating condition certified by physician'],
      reciprocity: 'No reciprocity (recreational available to all 21+)',
    },
    consumptionRules: 'No public consumption. Private residences and licensed consumption areas. No consumption in vehicles.',
    recentChanges: ['Recreational sales launched February 2023', 'Automatic expungement of past offenses implemented', 'Micro-license tier created for small operators'],
    ballotWatch: null,
    lastUpdated: '2026-01-15',
  },
  montana: {
    slug: 'montana',
    name: 'Montana',
    abbreviation: 'MT',
    status: 'recreational',
    statusLabel: 'Recreational & Medical',
    statusDescription:
      'Cannabis is legal for recreational and medical use in Montana. Initiative I-190 legalized recreational cannabis in 2020, with sales starting January 2022. Adults 21+ can possess up to 1 ounce and purchase from licensed dispensaries.',
    possessionLimit: '1 oz (28g)',
    purchaseLimit: '1 oz per transaction',
    homeGrow: '2 mature plants, 2 seedlings per person',
    minimumAge: 21,
    taxRate: '20% excise tax on recreational',
    deliveryAllowed: 'Yes',
    medical: {
      hasProgram: true,
      cardCost: '$25 state fee',
      qualifyingConditions: ['Cancer', 'Glaucoma', 'HIV/AIDS', 'Chronic pain', 'Epilepsy', 'PTSD', 'Crohn\'s disease', 'Peripheral neuropathy'],
      reciprocity: 'No reciprocity (recreational available to all 21+)',
    },
    consumptionRules: 'No public consumption. Private residences only. Local jurisdictions may restrict sales and consumption.',
    recentChanges: ['Recreational tax revenue allocated to conservation and infrastructure', 'Additional licensee categories added'],
    ballotWatch: null,
    lastUpdated: '2026-01-15',
  },
  nebraska: {
    slug: 'nebraska',
    name: 'Nebraska',
    abbreviation: 'NE',
    status: 'medical',
    statusLabel: 'Medical Only (New Program)',
    statusDescription:
      'Medical cannabis was approved by Nebraska voters in November 2024 through Initiatives 437 and 438. The program is being established with regulations under development. Recreational cannabis remains illegal. Possession of small amounts is decriminalized to an infraction.',
    possessionLimit: 'Program amounts TBD (small amounts decriminalized)',
    purchaseLimit: 'To be determined by regulation',
    homeGrow: 'To be determined',
    minimumAge: 18,
    taxRate: 'To be determined',
    deliveryAllowed: 'To be determined',
    medical: {
      hasProgram: true,
      cardCost: 'To be determined by regulation',
      qualifyingConditions: ['Cancer', 'Epilepsy', 'PTSD', 'Chronic pain', 'Conditions approved by Nebraska Medical Cannabis Commission'],
      reciprocity: 'To be determined',
    },
    consumptionRules: 'Medical program under development. Possession of 1 oz or less is an infraction (no jail). Recreational use remains illegal.',
    recentChanges: ['Voters approved Initiatives 437 and 438 in November 2024', 'Nebraska Medical Cannabis Commission being established', 'Regulations in development for 2025-2026'],
    ballotWatch: null,
    lastUpdated: '2026-01-15',
  },
  nevada: {
    slug: 'nevada',
    name: 'Nevada',
    abbreviation: 'NV',
    status: 'recreational',
    statusLabel: 'Recreational & Medical',
    statusDescription:
      'Cannabis is legal for recreational and medical use in Nevada. Question 2 legalized recreational cannabis in 2016, with sales starting July 2017. Adults 21+ can possess up to 1 ounce and purchase from licensed dispensaries. Nevada, particularly Las Vegas, is a major cannabis tourism destination.',
    possessionLimit: '1 oz flower or 1/8 oz concentrate',
    purchaseLimit: '1 oz flower or 1/8 oz concentrate',
    homeGrow: '6 plants per person (only if 25+ miles from dispensary)',
    minimumAge: 21,
    taxRate: '10% excise + 15% wholesale tax on recreational',
    deliveryAllowed: 'Yes',
    medical: {
      hasProgram: true,
      cardCost: '$50 state fee (1-year card)',
      qualifyingConditions: ['Cancer', 'Glaucoma', 'HIV/AIDS', 'PTSD', 'Cachexia', 'Chronic pain', 'Seizures', 'Severe nausea', 'Muscle spasms'],
      reciprocity: 'Accepts out-of-state cards for dispensary purchases',
    },
    consumptionRules: 'No public consumption (including the Las Vegas Strip). Licensed consumption lounges opening. Hotels may designate smoking areas. DUI laws enforced.',
    recentChanges: ['Consumption lounges opened in Las Vegas', 'Social equity licensing program expanded', 'Cannabis event licensing created'],
    ballotWatch: null,
    lastUpdated: '2026-01-15',
  },
  'new-hampshire': {
    slug: 'new-hampshire',
    name: 'New Hampshire',
    abbreviation: 'NH',
    status: 'medical',
    statusLabel: 'Medical Only',
    statusDescription:
      'Medical cannabis is legal in New Hampshire since 2013. Patients with qualifying conditions can obtain cannabis from licensed Alternative Treatment Centers. Recreational cannabis remains illegal despite ongoing legislative efforts. Possession has been decriminalized for small amounts.',
    possessionLimit: '2 oz per purchase (medical only)',
    purchaseLimit: '2 oz per transaction (medical)',
    homeGrow: 'Not allowed',
    minimumAge: 18,
    taxRate: 'No additional cannabis tax on medical',
    deliveryAllowed: 'No',
    medical: {
      hasProgram: true,
      cardCost: '$50 state fee (annual)',
      qualifyingConditions: ['Cancer', 'Chronic pain', 'HIV/AIDS', 'Hepatitis C', 'ALS', 'PTSD', 'Multiple sclerosis', 'Crohn\'s disease', 'Epilepsy', 'Lupus'],
      reciprocity: 'Limited reciprocity for visiting patients',
    },
    consumptionRules: 'Medical patients only. No public consumption. Possession of 3/4 oz or less decriminalized (civil fine). No smoking in public places.',
    recentChanges: ['Recreational legalization bills passed the House but stalled in Senate', 'Decriminalization of small amounts in effect', 'Program expansion ongoing'],
    ballotWatch: 'Legislative recreational legalization expected to be reintroduced in 2026',
    lastUpdated: '2026-01-15',
  },
  'new-jersey': {
    slug: 'new-jersey',
    name: 'New Jersey',
    abbreviation: 'NJ',
    status: 'recreational',
    statusLabel: 'Recreational & Medical',
    statusDescription:
      'Cannabis is legal for recreational and medical use in New Jersey. Public Question 1 legalized recreational cannabis in 2020, with sales beginning April 2022. Adults 21+ can purchase up to 1 ounce from licensed dispensaries across the state.',
    possessionLimit: '6 oz (170g)',
    purchaseLimit: '1 oz per transaction',
    homeGrow: 'Not allowed',
    minimumAge: 21,
    taxRate: '6.625% sales tax + up to 2% local',
    deliveryAllowed: 'Yes (licensed delivery)',
    medical: {
      hasProgram: true,
      cardCost: '$100 state fee (2-year card)',
      qualifyingConditions: ['Cancer', 'HIV/AIDS', 'ALS', 'Multiple sclerosis', 'PTSD', 'Seizure disorders', 'Chronic pain', 'Anxiety', 'Migraines', 'Tourette syndrome'],
      reciprocity: 'No reciprocity (recreational available to all 21+)',
    },
    consumptionRules: 'No public consumption. Private residences only. Prohibited in vehicles and near schools. No consumption in public parks.',
    recentChanges: ['Market expansion with new dispensary licenses', 'Social equity licensing program active', 'Delivery services launched'],
    ballotWatch: null,
    lastUpdated: '2026-01-15',
  },
  'new-mexico': {
    slug: 'new-mexico',
    name: 'New Mexico',
    abbreviation: 'NM',
    status: 'recreational',
    statusLabel: 'Recreational & Medical',
    statusDescription:
      'Cannabis is legal for recreational and medical use in New Mexico. The Cannabis Regulation Act was signed in 2021, with recreational sales starting April 2022. Adults 21+ can possess up to 2 ounces and grow up to 12 plants at home.',
    possessionLimit: '2 oz (56g)',
    purchaseLimit: '2 oz per transaction',
    homeGrow: '6 mature plants, 6 immature (12 total per person)',
    minimumAge: 21,
    taxRate: '12% excise tax on recreational (increasing to 18% by 2030)',
    deliveryAllowed: 'Yes',
    medical: {
      hasProgram: true,
      cardCost: 'Free registration',
      qualifyingConditions: ['Cancer', 'Epilepsy', 'PTSD', 'HIV/AIDS', 'Chronic pain', 'Crohn\'s disease', 'Multiple sclerosis', 'Spinal cord injury', 'Hospice care patients'],
      reciprocity: 'No reciprocity (recreational available to all 21+)',
    },
    consumptionRules: 'No public consumption. Licensed cannabis consumption areas permitted. Private residences. No consumption in vehicles.',
    recentChanges: ['Rapid market growth since 2022 launch', 'Additional micro-business licenses issued', 'Cannabis consumption area regulations finalized'],
    ballotWatch: null,
    lastUpdated: '2026-01-15',
  },
  'new-york': {
    slug: 'new-york',
    name: 'New York',
    abbreviation: 'NY',
    status: 'recreational',
    statusLabel: 'Recreational & Medical',
    statusDescription:
      'Cannabis is legal for recreational and medical use in New York. The Marijuana Regulation and Taxation Act (MRTA) was signed in 2021. Adults 21+ can possess up to 3 ounces of flower and grow up to 6 plants at home. The legal market has been gradually expanding.',
    possessionLimit: '3 oz flower, 24g concentrate',
    purchaseLimit: '3 oz flower per transaction',
    homeGrow: '3 mature plants, 3 immature per person (6 per household)',
    minimumAge: 21,
    taxRate: '9% excise + 4% sales tax + up to 4% local',
    deliveryAllowed: 'Yes (licensed delivery)',
    medical: {
      hasProgram: true,
      cardCost: '$50 state fee',
      qualifyingConditions: ['Cancer', 'HIV/AIDS', 'ALS', 'Parkinson\'s', 'Multiple sclerosis', 'Epilepsy', 'Chronic pain', 'PTSD', 'Neuropathy', 'Any condition physician deems appropriate'],
      reciprocity: 'No reciprocity (recreational available to all 21+)',
    },
    consumptionRules: 'Can consume wherever tobacco smoking is allowed (unique in the US). No consumption in vehicles, schools, or workplaces. Cannabis lounges under development.',
    recentChanges: ['Legal market expanding with new licensed dispensaries', 'CAURD social equity licenses issued', 'Illicit market enforcement increased', 'Home grow effective 2025'],
    ballotWatch: null,
    lastUpdated: '2026-01-15',
  },
  'north-carolina': {
    slug: 'north-carolina',
    name: 'North Carolina',
    abbreviation: 'NC',
    status: 'illegal',
    statusLabel: 'Illegal (Decriminalized)',
    statusDescription:
      'Cannabis is illegal in North Carolina for recreational and medical use. Possession of 0.5 ounce or less is decriminalized as a misdemeanor with a maximum $200 fine and no jail time. There is no medical marijuana program, though hemp-derived products are available.',
    possessionLimit: 'Illegal — under 0.5 oz is misdemeanor (no jail)',
    purchaseLimit: 'Illegal',
    homeGrow: 'Illegal',
    minimumAge: 0,
    taxRate: 'N/A',
    deliveryAllowed: 'No',
    medical: {
      hasProgram: false,
      cardCost: 'N/A',
      qualifyingConditions: [],
      reciprocity: 'No',
    },
    consumptionRules: 'All cannabis use is illegal. Possession under 0.5 oz is decriminalized (fine only, no jail). Larger amounts carry escalating penalties.',
    recentChanges: ['Medical cannabis bills introduced but have not advanced', 'Hemp-derived Delta-8 products widely available', 'Continued legislative discussion'],
    ballotWatch: 'Medical cannabis legislation possible in 2026 session',
    lastUpdated: '2026-01-15',
  },
  'north-dakota': {
    slug: 'north-dakota',
    name: 'North Dakota',
    abbreviation: 'ND',
    status: 'medical',
    statusLabel: 'Medical Only',
    statusDescription:
      'Medical cannabis is legal in North Dakota under the North Dakota Compassionate Care Act, passed by voters in 2016. Patients with qualifying conditions can purchase from licensed dispensaries. A recreational legalization measure was defeated in 2018.',
    possessionLimit: '2.5 oz per 30 days (medical)',
    purchaseLimit: '2.5 oz per 30-day period',
    homeGrow: 'Not allowed',
    minimumAge: 19,
    taxRate: '5% state tax on medical',
    deliveryAllowed: 'No',
    medical: {
      hasProgram: true,
      cardCost: '$50 state fee (annual)',
      qualifyingConditions: ['Cancer', 'HIV/AIDS', 'ALS', 'PTSD', 'Epilepsy', 'Crohn\'s disease', 'Chronic pain', 'Terminal illness', 'Tourette syndrome', 'Fibromyalgia'],
      reciprocity: 'Accepts out-of-state cards for up to 30 days',
    },
    consumptionRules: 'Medical patients only. No public consumption. No smokable flower restrictions. Products from licensed dispensaries only.',
    recentChanges: ['Recreational measure defeated in 2018', 'Program expansion with additional qualifying conditions', 'More dispensary locations opened'],
    ballotWatch: null,
    lastUpdated: '2026-01-15',
  },
  ohio: {
    slug: 'ohio',
    name: 'Ohio',
    abbreviation: 'OH',
    status: 'recreational',
    statusLabel: 'Recreational & Medical',
    statusDescription:
      'Cannabis is legal for recreational and medical use in Ohio. Issue 2 legalized recreational cannabis in November 2023, making Ohio the 24th state to do so. Adults 21+ can possess up to 2.5 ounces and grow up to 6 plants at home. Recreational sales began in 2024.',
    possessionLimit: '2.5 oz flower, 15g concentrate',
    purchaseLimit: '2.5 oz per transaction',
    homeGrow: '6 plants per person, 12 per household',
    minimumAge: 21,
    taxRate: '10% excise tax on recreational',
    deliveryAllowed: 'Yes',
    medical: {
      hasProgram: true,
      cardCost: '$50 state fee',
      qualifyingConditions: ['Cancer', 'HIV/AIDS', 'PTSD', 'Epilepsy', 'Chronic pain', 'Fibromyalgia', 'Crohn\'s disease', 'Multiple sclerosis', 'Parkinson\'s', 'Sickle cell anemia'],
      reciprocity: 'No reciprocity (recreational available to all 21+)',
    },
    consumptionRules: 'No public consumption. Private residences only. No consumption in vehicles or near schools. Local jurisdictions may opt out of retail sales.',
    recentChanges: ['Issue 2 passed November 2023', 'Recreational sales began 2024', 'Division of Cannabis Control established', 'Home cultivation allowed'],
    ballotWatch: null,
    lastUpdated: '2026-01-15',
  },
  oklahoma: {
    slug: 'oklahoma',
    name: 'Oklahoma',
    abbreviation: 'OK',
    status: 'medical',
    statusLabel: 'Medical Only',
    statusDescription:
      'Medical cannabis is legal in Oklahoma under State Question 788, passed in 2018. Oklahoma has one of the most accessible medical programs in the country with over 380,000 licensed patients. A recreational ballot measure (SQ 820) failed in March 2023.',
    possessionLimit: '3 oz on person, 8 oz at home (medical)',
    purchaseLimit: '3 oz per transaction (medical)',
    homeGrow: '6 mature, 6 seedlings per patient',
    minimumAge: 18,
    taxRate: '7% excise tax on medical',
    deliveryAllowed: 'Yes (medical delivery)',
    medical: {
      hasProgram: true,
      cardCost: '$100 state fee ($20 for veterans, disabled, SSI)',
      qualifyingConditions: ['Any condition recommended by physician — Oklahoma has no restricted conditions list'],
      reciprocity: 'Temporary 30-day licenses available for out-of-state patients ($100)',
    },
    consumptionRules: 'Medical patients only. No public consumption. Smokable flower and all forms allowed. Cannot consume in vehicles or public places.',
    recentChanges: ['SQ 820 (recreational) failed March 2023', 'Market consolidation with many businesses closing', 'Stricter enforcement of license requirements'],
    ballotWatch: 'Potential new recreational initiative for 2026',
    lastUpdated: '2026-01-15',
  },
  oregon: {
    slug: 'oregon',
    name: 'Oregon',
    abbreviation: 'OR',
    status: 'recreational',
    statusLabel: 'Recreational & Medical',
    statusDescription:
      'Cannabis is legal for recreational and medical use in Oregon. Measure 91 legalized recreational cannabis in 2014, with sales starting 2015. Oregon is known for its mature, well-regulated cannabis market with competitive pricing and a strong craft cultivation culture.',
    possessionLimit: '1 oz in public, 8 oz at home',
    purchaseLimit: '1 oz flower, 5g concentrates, 1000mg edibles',
    homeGrow: '4 plants per household',
    minimumAge: 21,
    taxRate: '17% state tax + up to 3% local on recreational',
    deliveryAllowed: 'Yes',
    medical: {
      hasProgram: true,
      cardCost: '$200 state fee ($60 for SNAP recipients)',
      qualifyingConditions: ['Cancer', 'Glaucoma', 'HIV/AIDS', 'PTSD', 'Epilepsy', 'Chronic pain', 'Cachexia', 'Severe nausea', 'Alzheimer\'s'],
      reciprocity: 'No reciprocity (recreational available to all 21+)',
    },
    consumptionRules: 'No public consumption. Private residences only. No consumption in vehicles. Banned in public parks and federal lands.',
    recentChanges: ['Psilocybin therapy program launched alongside cannabis', 'Market maturation with price stabilization', 'Interstate commerce discussions ongoing'],
    ballotWatch: null,
    lastUpdated: '2026-01-15',
  },
  pennsylvania: {
    slug: 'pennsylvania',
    name: 'Pennsylvania',
    abbreviation: 'PA',
    status: 'medical',
    statusLabel: 'Medical Only',
    statusDescription:
      'Medical cannabis is legal in Pennsylvania under Act 16, signed in 2016. The program serves over 400,000 patients through licensed grower/processor operations and dispensaries. Recreational cannabis remains illegal, though legislative efforts continue.',
    possessionLimit: '30-day supply as determined by physician',
    purchaseLimit: 'Physician-determined 30-day supply',
    homeGrow: 'Not allowed',
    minimumAge: 18,
    taxRate: '5% gross receipts tax on grower/processors',
    deliveryAllowed: 'No',
    medical: {
      hasProgram: true,
      cardCost: '$50 state fee (annual)',
      qualifyingConditions: ['Cancer', 'Epilepsy', 'PTSD', 'Chronic pain', 'HIV/AIDS', 'ALS', 'Parkinson\'s', 'Multiple sclerosis', 'Crohn\'s disease', 'Anxiety', 'Opioid use disorder', 'Autism'],
      reciprocity: 'No reciprocity',
    },
    consumptionRules: 'Medical patients only. No smokable flower (dry leaf vaporization permitted). No public consumption. Edibles, tinctures, topicals, concentrates available.',
    recentChanges: ['Dry leaf flower vaporization added as approved form', 'Additional qualifying conditions added', 'Governor voiced support for recreational legalization'],
    ballotWatch: 'Recreational legalization legislation actively being debated in 2025-2026',
    lastUpdated: '2026-01-15',
  },
  'rhode-island': {
    slug: 'rhode-island',
    name: 'Rhode Island',
    abbreviation: 'RI',
    status: 'recreational',
    statusLabel: 'Recreational & Medical',
    statusDescription:
      'Cannabis is legal for recreational and medical use in Rhode Island. The Cannabis Act was signed in May 2022, with recreational sales starting December 2022. Adults 21+ can possess up to 1 ounce in public and grow up to 6 plants at home.',
    possessionLimit: '1 oz in public, 10 oz at home',
    purchaseLimit: '1 oz per transaction',
    homeGrow: '3 mature plants, 3 immature (6 total per person)',
    minimumAge: 21,
    taxRate: '10% excise + 7% sales tax + up to 4% local',
    deliveryAllowed: 'Yes (licensed delivery)',
    medical: {
      hasProgram: true,
      cardCost: '$50 state fee',
      qualifyingConditions: ['Cancer', 'HIV/AIDS', 'Hepatitis C', 'PTSD', 'Chronic pain', 'Severe nausea', 'Seizures', 'Cachexia', 'Crohn\'s disease'],
      reciprocity: 'No reciprocity (recreational available to all 21+)',
    },
    consumptionRules: 'No public consumption. Private residences only. No consumption where tobacco is prohibited. Cannabis cafes under consideration.',
    recentChanges: ['Recreational sales launched December 2022', 'Social equity licensing program active', 'Additional retail licenses issued'],
    ballotWatch: null,
    lastUpdated: '2026-01-15',
  },
  'south-carolina': {
    slug: 'south-carolina',
    name: 'South Carolina',
    abbreviation: 'SC',
    status: 'illegal',
    statusLabel: 'Illegal',
    statusDescription:
      'Cannabis is illegal in South Carolina for both recreational and medical use. There is no medical marijuana program. Possession of any amount is a criminal offense. A limited compassionate care bill has been debated but not passed.',
    possessionLimit: 'Illegal — first offense misdemeanor',
    purchaseLimit: 'Illegal',
    homeGrow: 'Illegal',
    minimumAge: 0,
    taxRate: 'N/A',
    deliveryAllowed: 'No',
    medical: {
      hasProgram: false,
      cardCost: 'N/A',
      qualifyingConditions: [],
      reciprocity: 'No',
    },
    consumptionRules: 'All cannabis use is illegal. First offense possession under 1 oz is a misdemeanor (up to 30 days jail, $100-$200 fine).',
    recentChanges: ['Compassionate Care Act debated in legislature but not passed', 'Hemp-derived CBD products legally available'],
    ballotWatch: 'Compassionate care legislation may advance in 2026',
    lastUpdated: '2026-01-15',
  },
  'south-dakota': {
    slug: 'south-dakota',
    name: 'South Dakota',
    abbreviation: 'SD',
    status: 'medical',
    statusLabel: 'Medical Only',
    statusDescription:
      'Medical cannabis is legal in South Dakota under Initiated Measure 26, passed in 2020. Patients can possess up to 3 ounces. A recreational ballot measure (Amendment A) was approved by voters in 2020 but struck down by the state Supreme Court.',
    possessionLimit: '3 oz per purchase (medical)',
    purchaseLimit: '3 oz per transaction (medical)',
    homeGrow: '3 plants per patient (only if 50+ miles from dispensary)',
    minimumAge: 18,
    taxRate: '4.5% state sales tax on medical',
    deliveryAllowed: 'No',
    medical: {
      hasProgram: true,
      cardCost: '$50 state fee',
      qualifyingConditions: ['Cancer', 'Epilepsy', 'HIV/AIDS', 'PTSD', 'ALS', 'Crohn\'s disease', 'Chronic pain', 'Multiple sclerosis', 'Cachexia', 'Severe nausea'],
      reciprocity: 'Accepts out-of-state cards for purchase',
    },
    consumptionRules: 'Medical patients only. No public consumption. Products from licensed dispensaries only.',
    recentChanges: ['Amendment A (recreational) struck down by state Supreme Court in 2021', 'Medical program fully operational', 'Recreational legalization efforts continue'],
    ballotWatch: 'Recreational ballot initiative possible for 2026',
    lastUpdated: '2026-01-15',
  },
  tennessee: {
    slug: 'tennessee',
    name: 'Tennessee',
    abbreviation: 'TN',
    status: 'illegal',
    statusLabel: 'Illegal',
    statusDescription:
      'Cannabis is illegal in Tennessee for both recreational and medical use. There is no medical marijuana program. Possession of under 0.5 ounce is a misdemeanor. Limited hemp-derived CBD oil is available. Legislative efforts for medical cannabis have stalled.',
    possessionLimit: 'Illegal — under 0.5 oz is misdemeanor',
    purchaseLimit: 'Illegal',
    homeGrow: 'Illegal',
    minimumAge: 0,
    taxRate: 'N/A',
    deliveryAllowed: 'No',
    medical: {
      hasProgram: false,
      cardCost: 'N/A',
      qualifyingConditions: [],
      reciprocity: 'No',
    },
    consumptionRules: 'All cannabis use is illegal. Possession of 0.5 oz or less is a Class A misdemeanor (up to 11 months, 29 days jail, $2,500 fine).',
    recentChanges: ['Medical cannabis bills introduced but not advanced', 'Hemp-derived products regulated', 'Continued prohibition stance'],
    ballotWatch: null,
    lastUpdated: '2026-01-15',
  },
  texas: {
    slug: 'texas',
    name: 'Texas',
    abbreviation: 'TX',
    status: 'medical',
    statusLabel: 'Medical Only (Very Limited)',
    statusDescription:
      'Texas has a very limited medical cannabis program under the Compassionate Use Program (2015). Only low-THC cannabis (under 1% THC) is available for patients with qualifying conditions. The program has been gradually expanded but remains one of the most restrictive in the nation.',
    possessionLimit: 'As prescribed, low-THC only (under 1% THC)',
    purchaseLimit: 'Physician-determined amount',
    homeGrow: 'Not allowed',
    minimumAge: 18,
    taxRate: 'No additional cannabis tax',
    deliveryAllowed: 'Yes (from licensed dispensaries)',
    medical: {
      hasProgram: true,
      cardCost: 'Physician registration fee varies ($150-$300)',
      qualifyingConditions: ['Epilepsy', 'Multiple sclerosis', 'Spasticity', 'ALS', 'Autism', 'Terminal cancer', 'Incurable neurodegenerative disease', 'PTSD', 'All forms of cancer (added 2021)'],
      reciprocity: 'No reciprocity',
    },
    consumptionRules: 'Compassionate Use patients only. Low-THC products only. No smokable flower. No public consumption.',
    recentChanges: ['THC cap raised to 1% in 2023', 'PTSD and cancer added as qualifying conditions', 'Expansion legislation debated annually'],
    ballotWatch: 'Program expansion legislation expected in 2027 session',
    lastUpdated: '2026-01-15',
  },
  utah: {
    slug: 'utah',
    name: 'Utah',
    abbreviation: 'UT',
    status: 'medical',
    statusLabel: 'Medical Only',
    statusDescription:
      'Medical cannabis is legal in Utah under the Utah Medical Cannabis Act, passed in 2018 (Proposition 2 as modified by the legislature). Patients with qualifying conditions can purchase from licensed pharmacies. The program is tightly regulated with specific product forms allowed.',
    possessionLimit: 'As prescribed (30-day supply)',
    purchaseLimit: 'Physician-determined 30-day supply',
    homeGrow: 'Not allowed',
    minimumAge: 18,
    taxRate: 'State pharmacy pricing',
    deliveryAllowed: 'Yes (from licensed pharmacies)',
    medical: {
      hasProgram: true,
      cardCost: '$15 state fee',
      qualifyingConditions: ['Cancer', 'HIV/AIDS', 'ALS', 'Epilepsy', 'PTSD', 'Crohn\'s disease', 'Chronic pain', 'Alzheimer\'s', 'Terminal illness', 'Rare conditions'],
      reciprocity: 'Temporary card available for visitors (21 days)',
    },
    consumptionRules: 'Medical patients only. No smokable flower. Tablets, capsules, concentrated oils, topicals, and gelatinous cubes only. No public consumption.',
    recentChanges: ['Additional product forms approved', 'Pharmacy locations expanded', 'Electronic verification system improved'],
    ballotWatch: null,
    lastUpdated: '2026-01-15',
  },
  vermont: {
    slug: 'vermont',
    name: 'Vermont',
    abbreviation: 'VT',
    status: 'recreational',
    statusLabel: 'Recreational & Medical',
    statusDescription:
      'Cannabis is legal for recreational and medical use in Vermont. Vermont became the first state to legalize recreational cannabis through its legislature in 2018 (possession and home grow). Commercial sales began in 2022 under a regulated retail system.',
    possessionLimit: '1 oz (28g)',
    purchaseLimit: '1 oz per transaction',
    homeGrow: '2 mature plants, 4 immature per household',
    minimumAge: 21,
    taxRate: '14% excise tax on recreational',
    deliveryAllowed: 'Yes',
    medical: {
      hasProgram: true,
      cardCost: '$50 state fee',
      qualifyingConditions: ['Cancer', 'HIV/AIDS', 'Multiple sclerosis', 'PTSD', 'Chronic pain', 'Crohn\'s disease', 'Seizures', 'Parkinson\'s'],
      reciprocity: 'No reciprocity (recreational available to all 21+)',
    },
    consumptionRules: 'No public consumption. Private residences only. Same restrictions as tobacco smoking in terms of location.',
    recentChanges: ['Retail sales system maturing', 'Additional retail licenses issued', 'Social equity considerations added to licensing'],
    ballotWatch: null,
    lastUpdated: '2026-01-15',
  },
  virginia: {
    slug: 'virginia',
    name: 'Virginia',
    abbreviation: 'VA',
    status: 'recreational',
    statusLabel: 'Recreational & Medical',
    statusDescription:
      'Cannabis is legal for recreational and medical use in Virginia. The legislature legalized adult-use possession in 2021, with retail sales launching in 2024. Adults 21+ can possess up to 1 ounce and grow up to 4 plants at home. The market is still developing.',
    possessionLimit: '1 oz (28g)',
    purchaseLimit: '1 oz per transaction',
    homeGrow: '4 plants per household',
    minimumAge: 21,
    taxRate: '21% excise tax on recreational',
    deliveryAllowed: 'Yes',
    medical: {
      hasProgram: true,
      cardCost: 'Physician certification ($150-$250 typical)',
      qualifyingConditions: ['Any condition where physician determines cannabis would benefit the patient'],
      reciprocity: 'No reciprocity (recreational available to all 21+)',
    },
    consumptionRules: 'No public consumption. Private residences only. Cannabis use prohibited in vehicles and near school grounds.',
    recentChanges: ['Retail sales launched in 2024', 'Virginia Cannabis Control Authority regulating market', 'Additional retail licenses being issued'],
    ballotWatch: null,
    lastUpdated: '2026-01-15',
  },
  washington: {
    slug: 'washington',
    name: 'Washington',
    abbreviation: 'WA',
    status: 'recreational',
    statusLabel: 'Recreational & Medical',
    statusDescription:
      'Cannabis is legal for recreational and medical use in Washington state. Initiative 502 made Washington one of the first two states to legalize recreational cannabis in 2012. Adults 21+ can purchase up to 1 ounce from over 500 licensed retail stores statewide.',
    possessionLimit: '1 oz flower, 7g concentrate, 16 oz edibles/liquid',
    purchaseLimit: '1 oz flower or equivalent',
    homeGrow: 'Medical patients only (15 plants with authorization)',
    minimumAge: 21,
    taxRate: '37% excise tax on recreational',
    deliveryAllowed: 'Yes (licensed delivery since 2024)',
    medical: {
      hasProgram: true,
      cardCost: 'Database registration fee varies',
      qualifyingConditions: ['Cancer', 'HIV/AIDS', 'Multiple sclerosis', 'Epilepsy', 'Crohn\'s disease', 'Hepatitis C', 'Chronic pain', 'PTSD', 'Glaucoma', 'Intractable pain'],
      reciprocity: 'No reciprocity (recreational available to all 21+)',
    },
    consumptionRules: 'No public consumption (civil infraction, $100 fine). Private residences only. DUI laws enforced with 5 ng/ml THC per se limit.',
    recentChanges: ['Delivery services launched in 2024', 'Social equity program expanded', 'Cannabis research licensing created'],
    ballotWatch: null,
    lastUpdated: '2026-01-15',
  },
  'washington-dc': {
    slug: 'washington-dc',
    name: 'Washington, D.C.',
    abbreviation: 'DC',
    status: 'recreational',
    statusLabel: 'Recreational (Limited Commercial)',
    statusDescription:
      'Cannabis is legal for personal use in Washington, D.C. under Initiative 71 (2014). Adults 21+ can possess up to 2 ounces and grow up to 6 plants at home. However, there is no commercial recreational retail due to a congressional spending rider blocking D.C. from taxing and regulating sales.',
    possessionLimit: '2 oz (56g)',
    purchaseLimit: 'No commercial recreational sales (gifting economy exists)',
    homeGrow: '6 plants per person (3 mature)',
    minimumAge: 21,
    taxRate: 'N/A (no legal commercial recreational sales)',
    deliveryAllowed: 'Medical only',
    medical: {
      hasProgram: true,
      cardCost: 'Free registration',
      qualifyingConditions: ['Any condition recommended by physician'],
      reciprocity: 'Accepts out-of-state medical cards',
    },
    consumptionRules: 'No public consumption. Private residences only. Possession is legal but commercial sales are blocked by Congress.',
    recentChanges: ['Congressional rider continues to block commercial sales regulation', 'Medical program expanded', 'Gifting economy persists as workaround'],
    ballotWatch: 'Ongoing efforts to lift congressional restriction on D.C. cannabis regulation',
    lastUpdated: '2026-01-15',
  },
  'west-virginia': {
    slug: 'west-virginia',
    name: 'West Virginia',
    abbreviation: 'WV',
    status: 'medical',
    statusLabel: 'Medical Only',
    statusDescription:
      'Medical cannabis is legal in West Virginia under the Medical Cannabis Act, signed in 2017. The program launched dispensary sales in 2024 after significant delays. Patients with qualifying conditions can obtain cannabis products from licensed dispensaries.',
    possessionLimit: '30-day supply as prescribed',
    purchaseLimit: 'Physician-determined 30-day supply',
    homeGrow: 'Not allowed',
    minimumAge: 18,
    taxRate: 'Standard pharmacy pricing',
    deliveryAllowed: 'No',
    medical: {
      hasProgram: true,
      cardCost: '$50 state fee',
      qualifyingConditions: ['Cancer', 'HIV/AIDS', 'ALS', 'PTSD', 'Crohn\'s disease', 'Epilepsy', 'Chronic pain', 'Multiple sclerosis', 'Parkinson\'s', 'Huntington\'s disease', 'Terminal illness'],
      reciprocity: 'No reciprocity',
    },
    consumptionRules: 'Medical patients only. No smokable flower (dry leaf vaporization only). No public consumption. Products from licensed dispensaries only.',
    recentChanges: ['First dispensary sales began in 2024 after multi-year delay', 'Program slowly expanding with additional licenses', 'Product form regulations evolving'],
    ballotWatch: null,
    lastUpdated: '2026-01-15',
  },
  wisconsin: {
    slug: 'wisconsin',
    name: 'Wisconsin',
    abbreviation: 'WI',
    status: 'illegal',
    statusLabel: 'Illegal (CBD Only)',
    statusDescription:
      'Cannabis is illegal in Wisconsin for both recreational and medical use. Only CBD oil is permitted under Lydia\'s Law for patients with seizure disorders. Possession of any amount of marijuana is a misdemeanor for first offense. Legislative efforts for reform have been ongoing.',
    possessionLimit: 'Illegal — first offense misdemeanor',
    purchaseLimit: 'Illegal',
    homeGrow: 'Illegal',
    minimumAge: 0,
    taxRate: 'N/A',
    deliveryAllowed: 'No',
    medical: {
      hasProgram: false,
      cardCost: 'N/A',
      qualifyingConditions: [],
      reciprocity: 'No',
    },
    consumptionRules: 'All cannabis use is illegal. First offense possession is a misdemeanor (up to 6 months jail, $1,000 fine). CBD oil permitted for seizure disorders only.',
    recentChanges: ['Governor has repeatedly proposed legalization in budget', 'Republican legislature has blocked reform efforts', 'Local municipalities have reduced penalties'],
    ballotWatch: 'Governor expected to include legalization in 2026 budget proposal',
    lastUpdated: '2026-01-15',
  },
  wyoming: {
    slug: 'wyoming',
    name: 'Wyoming',
    abbreviation: 'WY',
    status: 'illegal',
    statusLabel: 'Illegal',
    statusDescription:
      'Cannabis is illegal in Wyoming for both recreational and medical use. There is no medical marijuana program. Possession of 3 ounces or less is a misdemeanor. Wyoming has among the strictest cannabis laws in the nation with limited reform momentum.',
    possessionLimit: 'Illegal — under 3 oz is misdemeanor',
    purchaseLimit: 'Illegal',
    homeGrow: 'Illegal',
    minimumAge: 0,
    taxRate: 'N/A',
    deliveryAllowed: 'No',
    medical: {
      hasProgram: false,
      cardCost: 'N/A',
      qualifyingConditions: [],
      reciprocity: 'No',
    },
    consumptionRules: 'All cannabis use is illegal. Possession under 3 oz is a misdemeanor (up to 12 months jail, $1,000 fine). No exceptions for medical use.',
    recentChanges: ['Limited medical cannabis bills introduced but not advanced', 'No significant reform momentum'],
    ballotWatch: null,
    lastUpdated: '2026-01-15',
  },
}

// ==================== HELPER FUNCTIONS ====================

export function getStateLawBySlug(slug: string): StateLawData | undefined {
  return STATE_LAWS[slug]
}

export function getAllStateLaws(): StateLawData[] {
  return Object.values(STATE_LAWS)
}

export function getRecreationalStates(): StateLawData[] {
  return Object.values(STATE_LAWS).filter((s) => s.status === 'recreational')
}

export function getMedicalOnlyStates(): StateLawData[] {
  return Object.values(STATE_LAWS).filter((s) => s.status === 'medical')
}

export function getIllegalStates(): StateLawData[] {
  return Object.values(STATE_LAWS).filter((s) => s.status === 'illegal' || s.status === 'decriminalized')
}

export function getStateLawSlugs(): string[] {
  return Object.keys(STATE_LAWS)
}

// ==================== DYNAMIC FAQ GENERATION ====================

export function generateStateFaq(
  law: StateLawData,
  dispensaryCount: number,
  doctorCount: number
): Array<{ q: string; a: string }> {
  const faqs: Array<{ q: string; a: string }> = []

  // Q1: Is weed legal?
  faqs.push({
    q: `Is weed legal in ${law.name}?`,
    a: law.status === 'recreational'
      ? `Yes, cannabis is legal for both recreational and medical use in ${law.name}. Adults ${law.minimumAge}+ can purchase from licensed dispensaries with a valid ID.`
      : law.status === 'medical'
      ? `Cannabis is legal for medical use only in ${law.name}. Patients with qualifying conditions and a valid medical marijuana card can purchase from licensed dispensaries.`
      : `Cannabis is currently illegal in ${law.name} for both recreational and medical use. Possession of any amount may result in criminal penalties.`,
  })

  // Q2: Home grow
  faqs.push({
    q: `Can I grow weed at home in ${law.name}?`,
    a: law.homeGrow.toLowerCase().includes('not allowed') || law.homeGrow.toLowerCase().includes('illegal')
      ? `No, home cultivation of cannabis is not allowed in ${law.name}. All cannabis must be purchased from licensed dispensaries${law.medical.hasProgram ? ' (for medical patients)' : ''}.`
      : `Yes, home cultivation is permitted in ${law.name}. The limit is ${law.homeGrow}. Plants must be kept in a secure, enclosed area not visible to the public.`,
  })

  // Q3: How much can I carry?
  faqs.push({
    q: `How much weed can I carry in ${law.name}?`,
    a: law.status === 'illegal'
      ? `Cannabis possession is illegal in ${law.name}. ${law.possessionLimit}.`
      : `In ${law.name}, the possession limit is ${law.possessionLimit}. Carrying more than the legal amount can result in fines or criminal charges.`,
  })

  // Q4: Medical card
  faqs.push({
    q: `Do I need a medical card in ${law.name}?`,
    a: law.status === 'recreational'
      ? `No, adults ${law.minimumAge}+ can purchase recreational cannabis in ${law.name} without a medical card. However, medical patients may benefit from higher purchase limits, lower taxes, and access to higher-potency products.`
      : law.medical.hasProgram
      ? `Yes, you need a medical marijuana card to purchase cannabis in ${law.name}. The card costs ${law.medical.cardCost}. Qualifying conditions include: ${law.medical.qualifyingConditions.slice(0, 5).join(', ')}, and more.`
      : `${law.name} does not have a medical marijuana program, so no medical cards are issued.`,
  })

  // Q5: Delivery
  faqs.push({
    q: `Can I get weed delivered in ${law.name}?`,
    a: law.deliveryAllowed.toLowerCase().startsWith('yes')
      ? `Yes, cannabis delivery is available in ${law.name}. ${dispensaryCount > 0 ? `Browse ${dispensaryCount} dispensaries on Leefii to find delivery options near you.` : 'Check licensed dispensaries for delivery availability.'}`
      : law.deliveryAllowed.toLowerCase().startsWith('no')
      ? `Cannabis delivery is not currently available in ${law.name}. You must visit a licensed dispensary in person to purchase.`
      : `Delivery in ${law.name}: ${law.deliveryAllowed}.`,
  })

  // Q6: Tax
  faqs.push({
    q: `What is the cannabis tax in ${law.name}?`,
    a: law.taxRate === 'N/A'
      ? `There is no cannabis tax in ${law.name} because cannabis sales are not legal.`
      : `The cannabis tax in ${law.name} is ${law.taxRate}. Medical patients may pay lower tax rates in some cases.`,
  })

  // Q7: Where to smoke
  faqs.push({
    q: `Where can I smoke weed in ${law.name}?`,
    a: law.status === 'illegal'
      ? `Cannabis consumption is illegal everywhere in ${law.name}. There are no legal locations for cannabis use.`
      : `${law.consumptionRules} Cannabis consumption is also always prohibited on federal property regardless of state law.`,
  })

  // Q8: Edibles
  faqs.push({
    q: `Can I buy edibles in ${law.name}?`,
    a: law.status === 'recreational'
      ? `Yes, cannabis edibles are available for purchase at licensed dispensaries in ${law.name}. Edibles are typically sold in packages with clearly labeled THC content per serving.`
      : law.medical.hasProgram
      ? `Medical patients in ${law.name} can purchase edibles from licensed dispensaries with a valid medical card, subject to program regulations.`
      : `Cannabis edibles are not legally available in ${law.name}.`,
  })

  // Q9: Dispensary count (conditional)
  if (dispensaryCount > 0) {
    faqs.push({
      q: `How many dispensaries are in ${law.name}?`,
      a: `There are ${dispensaryCount} licensed cannabis dispensaries in ${law.name} listed on Leefii. Browse all dispensaries to compare ratings, hours, and services.`,
    })
  }

  // Q10: Doctors (conditional)
  if (doctorCount > 0 && law.medical.hasProgram) {
    faqs.push({
      q: `How do I get a medical marijuana card in ${law.name}?`,
      a: `To get a medical marijuana card in ${law.name}, you need to be evaluated by a qualified physician. The card costs ${law.medical.cardCost}. Qualifying conditions include ${law.medical.qualifyingConditions.slice(0, 3).join(', ')}, and more. Leefii lists ${doctorCount} MMJ doctors in ${law.name} to help you get started.`,
    })
  }

  return faqs
}
