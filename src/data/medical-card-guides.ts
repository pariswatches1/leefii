export interface MedicalCardGuide {
  slug: string
  stateName: string
  abbreviation: string
  hasMedicalProgram: boolean
  applicationUrl: string
  processingTime: string
  renewalPeriod: string
  renewalCost: string
  minAge: string
  telehealth: boolean
  steps: { title: string; description: string }[]
  tips: string[]
  intro: string
}

export const MEDICAL_CARD_GUIDES: Record<string, MedicalCardGuide> = {
  alabama: {
    slug: 'alabama',
    stateName: 'Alabama',
    abbreviation: 'AL',
    hasMedicalProgram: true,
    applicationUrl: 'https://amipc.alabama.gov/',
    processingTime: '30 business days',
    renewalPeriod: 'Annual',
    renewalCost: '$65',
    minAge: '19 (minors with caregiver)',
    telehealth: false,
    steps: [
      { title: 'Confirm Your Qualifying Condition', description: 'Review the list of qualifying conditions established by the Alabama Medical Cannabis Commission. Conditions include cancer, chronic pain, epilepsy, HIV/AIDS, PTSD, Crohn\'s disease, depression, anxiety, autism, and sickle cell anemia. Gather any existing medical records that document your diagnosis.' },
      { title: 'Schedule a Physician Evaluation', description: 'Find a licensed Alabama physician registered with the Alabama Medical Cannabis Commission. Schedule an in-person appointment to discuss your condition and how medical cannabis may help. The physician must have an established relationship with you or review your medical history thoroughly.' },
      { title: 'Obtain a Physician Certification', description: 'If the physician determines you qualify, they will issue a written certification and enter your information into the state registry. The certification confirms your qualifying condition and recommends medical cannabis as a treatment option.' },
      { title: 'Submit Your State Application', description: 'Register online through the Alabama Medical Cannabis Commission patient portal. Upload your physician certification, provide a valid Alabama ID or proof of residency, and pay the $65 state registration fee. Complete all required forms accurately.' },
      { title: 'Receive Your Medical Cannabis Card', description: 'After processing, which typically takes up to 30 business days, you will receive your Alabama medical cannabis card. This card allows you to purchase approved cannabis products from licensed dispensaries throughout the state.' },
      { title: 'Visit a Licensed Dispensary', description: 'Bring your medical cannabis card and a valid photo ID to any licensed Alabama dispensary. Note that Alabama only permits non-smokable forms such as tablets, capsules, tinctures, patches, topicals, and nebulizer products.' }
    ],
    tips: [
      'Alabama does not allow smokable cannabis flower — only tablets, capsules, tinctures, patches, topicals, and nebulizer forms are permitted.',
      'Ensure your physician is registered with the Alabama Medical Cannabis Commission before scheduling your appointment.',
      'Keep copies of all medical records documenting your qualifying condition to streamline the application process.',
      'The minimum age for patients in Alabama is 19, though minors may qualify with a registered caregiver.',
      'Start the process early as Alabama\'s 30-day processing time is longer than most states.'
    ],
    intro: 'Getting a medical marijuana card in Alabama requires navigating the state\'s carefully regulated medical cannabis program, established under the Darren Wesley "Ato" Hall Compassion Act signed into law in 2021. Alabama\'s program is one of the newer medical cannabis systems in the United States, with dispensary sales beginning in 2024 after several years of regulatory development. The program is overseen by the Alabama Medical Cannabis Commission, which manages patient registration, physician certifications, and dispensary licensing across the state.\n\nAlabama\'s medical cannabis program is notable for its restrictions on product forms. Unlike many other states, Alabama does not permit patients to smoke cannabis flower. Instead, the program limits approved products to non-smokable forms including tablets, capsules, tinctures, transdermal patches, topical creams, and nebulizer-compatible formulations. This approach reflects the state legislature\'s emphasis on treating medical cannabis as a pharmaceutical product rather than a traditional herbal remedy.\n\nTo qualify for the program, patients must be at least 19 years old and have a documented qualifying condition. The qualifying conditions list includes cancer, chronic pain, epilepsy and seizure disorders, HIV/AIDS, PTSD, Crohn\'s disease, depression, anxiety disorders, autism spectrum disorder, and sickle cell anemia. Patients under 19 may participate through the caregiver program with parental consent and physician approval.\n\nThe application process begins with a physician evaluation. Alabama requires that the certifying physician be registered with the Medical Cannabis Commission and have either an established patient-physician relationship or conduct a thorough review of the patient\'s medical history. Telehealth evaluations are currently not accepted for initial certifications. Once certified, patients register through the state portal and pay the $65 registration fee. Processing times average approximately 30 business days, making it advisable to begin the process well in advance of when you plan to make your first purchase.'
  },
  alaska: {
    slug: 'alaska',
    stateName: 'Alaska',
    abbreviation: 'AK',
    hasMedicalProgram: true,
    applicationUrl: 'https://health.alaska.gov/dph/VitalStats/Pages/marijuana.aspx',
    processingTime: '30 days',
    renewalPeriod: 'Annual',
    renewalCost: '$25',
    minAge: '18 (minors with parent/guardian)',
    telehealth: false,
    steps: [
      { title: 'Verify Your Qualifying Condition', description: 'Alaska\'s medical marijuana program covers conditions including cancer, glaucoma, HIV/AIDS, chronic pain producing cachexia or wasting syndrome, seizures, severe nausea, and multiple sclerosis. Review your medical records and confirm your condition is on the qualifying list.' },
      { title: 'Visit a Licensed Physician', description: 'Schedule an appointment with a licensed Alaska physician. The doctor will evaluate your condition and determine whether medical cannabis is an appropriate treatment. The physician must conduct a physical examination as part of the evaluation.' },
      { title: 'Obtain a Physician Statement', description: 'If approved, the physician will complete the official physician statement form, documenting your qualifying condition and recommending medical cannabis. This form is required for your state application.' },
      { title: 'Complete the Patient Application', description: 'Download and complete the Alaska Medical Marijuana Registry patient application form. You will need your physician statement, a copy of your Alaska ID or proof of residency, and the $25 registration fee. Submit the application to the Alaska Department of Health.' },
      { title: 'Receive Your Registry Card', description: 'Processing takes approximately 30 days. Once approved, you will receive your Alaska medical marijuana registry identification card, allowing you to purchase from licensed dispensaries or cultivate plants for personal use.' }
    ],
    tips: [
      'Alaska also has recreational cannabis for adults 21 and older, but a medical card provides benefits such as higher possession limits and potential tax savings.',
      'Medical patients in Alaska are allowed to grow up to six plants for personal use.',
      'Keep your physician statement current — you will need an updated one for annual renewal.',
      'Telehealth evaluations are generally not accepted; plan for an in-person visit with your physician.'
    ],
    intro: 'Obtaining a medical marijuana card in Alaska provides patients with distinct advantages even though the state legalized recreational cannabis for adults 21 and older in 2014. Medical cardholders in Alaska benefit from higher possession limits, the ability to grow plants for personal medical use, and access to medical-specific products at licensed dispensaries. The Alaska medical marijuana registry is managed by the Department of Health, Bureau of Vital Statistics, which oversees patient registration and card issuance.\n\nAlaska\'s medical cannabis program was established well before recreational legalization, providing a framework for patients with qualifying conditions to access cannabis therapeutically. The qualifying conditions include cancer, glaucoma, HIV/AIDS, conditions producing cachexia or wasting syndrome, chronic pain, seizures including epilepsy, severe and persistent nausea, and multiple sclerosis with muscle spasms. These conditions must be documented by a licensed physician through an in-person evaluation.\n\nThe application process in Alaska is straightforward but requires patience due to the 30-day processing period. Patients begin by visiting a licensed physician who can certify their qualifying condition. Alaska requires an in-person physical examination as part of this process, meaning telehealth evaluations are generally not accepted for medical marijuana certifications. Once the physician provides the required statement, patients submit their application along with a copy of their Alaska identification and the $25 registration fee.\n\nAlaska\'s medical program is particularly appealing because of the low registration cost at just $25 annually, making it one of the most affordable medical marijuana cards in the nation. Medical patients 18 and older may apply, while minors can qualify with parental or guardian consent. Once registered, patients can purchase from any licensed dispensary across the state and may also cultivate up to six plants at their private residence for personal medical use.'
  },
  arizona: {
    slug: 'arizona',
    stateName: 'Arizona',
    abbreviation: 'AZ',
    hasMedicalProgram: true,
    applicationUrl: 'https://azdhs.gov/licensing/medical-marijuana/index.php',
    processingTime: '10 business days',
    renewalPeriod: 'Every 2 years',
    renewalCost: '$150',
    minAge: '18 (minors with caregiver)',
    telehealth: true,
    steps: [
      { title: 'Confirm Your Qualifying Condition', description: 'Arizona recognizes conditions including cancer, chronic pain, PTSD, Crohn\'s disease, epilepsy, HIV/AIDS, glaucoma, hepatitis C, ALS, and agitation of Alzheimer\'s disease. Ensure you have medical documentation supporting your diagnosis.' },
      { title: 'Get a Physician Certification', description: 'Schedule an evaluation with a licensed Arizona physician. Telehealth evaluations are accepted in Arizona, making it convenient to consult with a certifying doctor from home. The physician will review your medical history and examine you to determine eligibility.' },
      { title: 'Register Online with ADHS', description: 'Create an account on the Arizona Department of Health Services Medical Marijuana Program portal. Upload your physician certification, passport-style photo, proof of Arizona residency, and government-issued photo ID.' },
      { title: 'Pay the Application Fee', description: 'Submit the $150 application fee for a two-year card. Patients on SNAP benefits may qualify for a reduced fee of $75. Payment is processed online during application submission.' },
      { title: 'Receive Your Card', description: 'Arizona processes applications within approximately 10 business days. Your medical marijuana card will be mailed to your registered address. You can then visit any licensed dispensary in the state to purchase cannabis products.' }
    ],
    tips: [
      'Arizona issues two-year cards, saving you from annual renewals and effectively reducing the yearly cost to $75.',
      'Telehealth physician evaluations are accepted, making the process more convenient for patients across the state.',
      'Medical cardholders in Arizona benefit from higher possession limits and tax exemptions compared to recreational buyers.',
      'SNAP benefit recipients can apply for a reduced application fee of $75 instead of $150.',
      'Arizona accepts valid out-of-state medical marijuana cards for dispensary purchases by visiting patients.'
    ],
    intro: 'Arizona offers one of the more established and patient-friendly medical marijuana programs in the United States, having been in operation since 2010 under Proposition 203. Even after the legalization of recreational cannabis through Proposition 207 in 2020, the medical program remains highly valuable for patients due to significant advantages including tax exemptions, higher purchase and possession limits, and access to higher-potency products. The program is administered by the Arizona Department of Health Services, which manages the online application portal and processes patient registrations.\n\nOne of Arizona\'s most appealing features for medical cannabis patients is the two-year card duration. While many states require annual renewals, Arizona issues medical marijuana cards that are valid for a full two years, effectively reducing the annual cost to approximately $75. This longer duration saves patients both time and money by cutting the number of required physician evaluations and application submissions in half.\n\nArizona also embraces telehealth evaluations for medical marijuana certifications, allowing patients to consult with licensed physicians from the comfort of their homes. This is particularly beneficial for patients in rural areas of the state who may not have easy access to a certifying physician nearby. The telehealth option has made the process considerably more accessible since its implementation.\n\nThe qualifying conditions list covers a range of chronic and debilitating conditions including cancer, chronic pain that is not adequately managed by standard treatments, PTSD, Crohn\'s disease, epilepsy and seizure disorders, HIV/AIDS, glaucoma, hepatitis C, amyotrophic lateral sclerosis, and agitation associated with Alzheimer\'s disease. Patients must be at least 18 years old to apply independently, though minors may participate through a designated caregiver with parental consent. Processing times are efficient at approximately 10 business days, and the state offers reduced fees for patients receiving SNAP benefits.'
  },
  arkansas: {
    slug: 'arkansas',
    stateName: 'Arkansas',
    abbreviation: 'AR',
    hasMedicalProgram: true,
    applicationUrl: 'https://www.healthy.arkansas.gov/programs-services/topics/medical-marijuana',
    processingTime: '14 days',
    renewalPeriod: 'Annual',
    renewalCost: '$50',
    minAge: '18 (minors with caregiver)',
    telehealth: true,
    steps: [
      { title: 'Review Qualifying Conditions', description: 'Arkansas recognizes cancer, glaucoma, HIV/AIDS, hepatitis C, ALS, Tourette syndrome, Crohn\'s disease, PTSD, severe arthritis, chronic pain, and seizure disorders as qualifying conditions. Collect medical records that document your diagnosis.' },
      { title: 'Schedule a Physician Evaluation', description: 'Find a physician licensed in Arkansas who is willing to certify patients for medical marijuana. Telehealth evaluations are accepted. The physician must review your medical history and provide a written certification if you qualify.' },
      { title: 'Apply Through the State Portal', description: 'Submit your application through the Arkansas Department of Health online patient registry. Upload your physician certification, a valid Arkansas driver\'s license or state ID, and a passport-style photograph.' },
      { title: 'Pay the Registration Fee', description: 'Pay the $50 state registration fee online. There is no reduced fee program currently available in Arkansas.' },
      { title: 'Receive Your Card and Visit a Dispensary', description: 'Applications are typically processed within 14 days. Once approved, your card will be mailed to you, and you can purchase up to 2.5 ounces of cannabis every 14 days from any licensed Arkansas dispensary.' }
    ],
    tips: [
      'Arkansas does not allow home cultivation — all cannabis must be purchased from licensed dispensaries.',
      'Keep your physician certification on file, as you will need an updated one for annual renewal.',
      'Telehealth consultations are an option and can simplify the evaluation process.',
      'A recreational ballot measure failed in 2024, so the medical card remains the only legal path to cannabis in Arkansas.'
    ],
    intro: 'The Arkansas medical marijuana program was established through the Arkansas Medical Marijuana Amendment, approved by voters in 2016, making it one of the Southern states at the forefront of medical cannabis access. The program is managed by the Arkansas Department of Health, which oversees patient registration, physician certifications, and compliance with state regulations. Since its launch, the program has grown steadily, with dispensaries operating across the state serving thousands of registered patients.\n\nArkansas maintains a medical-only cannabis framework, as a recreational legalization ballot measure failed to pass in 2024. This means the medical marijuana card is the only legal pathway to purchase and possess cannabis in the state. Patients who qualify can purchase up to 2.5 ounces of cannabis every 14 days from licensed dispensaries, which offer a range of products including flower, edibles, tinctures, topicals, and concentrates.\n\nThe qualifying conditions for the Arkansas medical marijuana program span a wide range of chronic and serious medical conditions. These include cancer, glaucoma, positive status for HIV/AIDS, hepatitis C, amyotrophic lateral sclerosis, Tourette syndrome, Crohn\'s disease, ulcerative colitis, PTSD, severe arthritis, fibromyalgia, chronic pain, and seizure disorders including epilepsy. Physicians may also certify patients with other conditions that produce chronic pain, nausea, seizures, or muscle spasms.\n\nThe application process is streamlined through the Arkansas Department of Health\'s online portal. Patients must first obtain a physician certification from a licensed Arkansas doctor, which can now be done through telehealth appointments. The state registration fee is $50 annually, and applications are typically processed within 14 days. Home cultivation is not permitted under the Arkansas program, meaning all medical cannabis must be obtained from state-licensed dispensary locations. Minors can participate in the program through a designated caregiver with appropriate parental authorization.'
  },
  california: {
    slug: 'california',
    stateName: 'California',
    abbreviation: 'CA',
    hasMedicalProgram: true,
    applicationUrl: 'https://www.cdph.ca.gov/Programs/CHSI/Pages/MMICP-Landing.aspx',
    processingTime: '7-10 business days',
    renewalPeriod: 'Annual',
    renewalCost: '$50-$100 (varies by county)',
    minAge: '18 (minors with caregiver)',
    telehealth: true,
    steps: [
      { title: 'Determine Your Eligibility', description: 'California recognizes a broad range of qualifying conditions including cancer, AIDS, glaucoma, chronic pain, seizures, severe nausea, arthritis, migraines, and any other chronic or persistent medical condition that substantially limits your ability to conduct major life activities. California has one of the most inclusive qualifying conditions lists in the nation.' },
      { title: 'Get a Physician Recommendation', description: 'Consult with a licensed California physician, either in person or via telehealth. California widely accepts telehealth evaluations for medical marijuana recommendations. The physician will evaluate your condition and, if appropriate, issue a written recommendation for medical cannabis.' },
      { title: 'Apply for the MMIC (Optional)', description: 'California offers a voluntary Medical Marijuana Identification Card (MMIC) through county health departments. While the physician recommendation alone allows purchases, the MMIC provides tax exemptions on medical purchases. Apply at your county health department with your physician recommendation, valid California ID, and the application fee.' },
      { title: 'Pay the Application Fee', description: 'The MMIC fee varies by county, typically ranging from $50 to $100. Medi-Cal recipients may qualify for reduced fees. If you are only obtaining a physician recommendation without the MMIC, there is no state fee — only the physician evaluation cost.' },
      { title: 'Receive Your Card or Recommendation', description: 'If applying for the MMIC, processing takes 7 to 10 business days through your county health department. With a physician recommendation only, you can visit dispensaries immediately after your evaluation.' }
    ],
    tips: [
      'In California, a physician recommendation alone is sufficient to purchase medical cannabis — the state MMIC card is optional but provides sales tax exemptions.',
      'Since recreational cannabis is legal for adults 21+, the primary benefit of a medical card is the tax savings, which can be substantial given California\'s high cannabis tax rates.',
      'Telehealth evaluations are widely available and accepted throughout California.',
      'Medical patients 18-20 years old need a medical card since recreational sales require being 21+.',
      'California accepts almost any debilitating condition as qualifying, giving physicians broad discretion.'
    ],
    intro: 'California is the birthplace of the modern medical marijuana movement, having passed the Compassionate Use Act (Proposition 215) in 1996, making it the first state in the nation to legalize medical cannabis. The state\'s medical program has evolved significantly over nearly three decades and continues to offer meaningful benefits to patients even after recreational legalization under Proposition 64 in 2016. The program is administered at the county level, with the California Department of Public Health overseeing the Medical Marijuana Identification Card program.\n\nOne of the most distinctive aspects of California\'s medical cannabis framework is its two-tier system. Patients can either obtain a simple physician recommendation, which allows them to purchase medical cannabis from dispensaries, or they can apply for the optional state-issued Medical Marijuana Identification Card (MMIC) through their county health department. The MMIC provides additional benefits, most notably an exemption from the state sales and use tax on medical cannabis purchases, which can result in significant savings given California\'s combined cannabis tax rates that can exceed 25 percent in some jurisdictions.\n\nCalifornia has one of the most inclusive qualifying conditions lists in the country. Beyond the standard list of cancer, AIDS, glaucoma, chronic pain, seizures, and severe nausea, California allows physicians to recommend medical cannabis for any chronic or persistent medical condition that substantially limits a patient\'s ability to conduct one or more major life activities. This broad definition gives physicians significant discretion in determining patient eligibility.\n\nThe application process in California is designed for accessibility. Telehealth physician evaluations are widely accepted throughout the state, and hundreds of physicians specialize in medical cannabis certifications. The physician evaluation typically costs between $40 and $150 depending on the provider, and patients can begin purchasing immediately after receiving their recommendation. For patients who choose to apply for the optional MMIC, county health departments process applications within 7 to 10 business days.'
  },
  colorado: {
    slug: 'colorado',
    stateName: 'Colorado',
    abbreviation: 'CO',
    hasMedicalProgram: true,
    applicationUrl: 'https://cdphe.colorado.gov/medical-marijuana-registry',
    processingTime: '1-3 business days',
    renewalPeriod: 'Annual',
    renewalCost: '$15',
    minAge: '18 (minors with 2 physicians)',
    telehealth: true,
    steps: [
      { title: 'Verify Your Qualifying Condition', description: 'Colorado recognizes cancer, glaucoma, HIV/AIDS, cachexia, chronic pain, chronic nervous system disorders, seizures, severe nausea, PTSD, and autism as qualifying conditions. Gather relevant medical records documenting your diagnosis.' },
      { title: 'Consult a Licensed Physician', description: 'Visit a physician licensed in Colorado who can certify your condition. Telehealth appointments are accepted. The physician will review your records and, if you qualify, submit the physician certification directly to the state registry electronically.' },
      { title: 'Register Online', description: 'Create an account on the Colorado Medical Marijuana Registry website. Your physician\'s certification should appear in the system once submitted. Complete your patient application, upload your Colorado ID, and provide a passport-style photo.' },
      { title: 'Pay the $15 State Fee', description: 'Colorado charges just $15 for the annual medical marijuana card, making it one of the most affordable programs in the nation. Payment is processed online during registration.' },
      { title: 'Receive Your Registry Card', description: 'Colorado processes applications quickly, typically within 1 to 3 business days. You will receive an electronic confirmation that you can use immediately, with the physical card arriving by mail shortly after.' }
    ],
    tips: [
      'At $15, Colorado has one of the lowest medical card fees in the nation.',
      'Medical cardholders enjoy tax savings, higher possession limits, and the ability to grow more plants than recreational users.',
      'Colorado processes applications in just 1 to 3 business days — among the fastest in the country.',
      'Physicians submit certifications electronically, streamlining the process significantly.',
      'Patients under 18 require certifications from two physicians.'
    ],
    intro: 'Colorado pioneered legal recreational cannabis in 2012, but the state\'s medical marijuana program, established under Amendment 20 in 2000, continues to provide significant advantages for registered patients. The Colorado Medical Marijuana Registry, administered by the Colorado Department of Public Health and Environment, offers patients benefits that make the affordable $15 annual card well worth obtaining. Medical cardholders enjoy substantial tax savings, higher possession and purchase limits, expanded home cultivation rights, and access to medical-grade products.\n\nThe financial incentive alone makes Colorado\'s medical card compelling. Recreational cannabis purchases in Colorado are subject to a 15 percent excise tax plus a 15 percent special sales tax, along with applicable local taxes that can push the total tax burden above 30 percent in some municipalities. Medical marijuana purchases, by contrast, are only subject to the standard 2.9 percent state sales tax, resulting in savings that quickly offset the minimal annual card cost.\n\nColorado\'s qualifying conditions include cancer, glaucoma, HIV/AIDS, cachexia or severe weight loss, chronic pain, chronic nervous system disorders, seizures including epilepsy, severe nausea, post-traumatic stress disorder, and autism spectrum disorder. The state allows physicians significant flexibility in certifying patients whose conditions cause severe pain, nausea, seizures, or persistent muscle spasms.\n\nThe application process in Colorado is remarkably efficient. Physicians submit certifications electronically directly to the state registry, eliminating the need for patients to handle paper documents. After the physician certification is in the system, patients complete their online application, upload identification, and pay the $15 fee. Processing typically takes just 1 to 3 business days, and patients receive an electronic confirmation they can use at dispensaries while awaiting their physical card. Telehealth evaluations are fully accepted, adding further convenience to an already streamlined process.'
  },
  connecticut: {
    slug: 'connecticut',
    stateName: 'Connecticut',
    abbreviation: 'CT',
    hasMedicalProgram: true,
    applicationUrl: 'https://portal.ct.gov/DCP/Medical-Marijuana-Program/Medical-Marijuana-Program',
    processingTime: '30 days',
    renewalPeriod: 'Annual',
    renewalCost: 'No state fee',
    minAge: '18 (minors with caregiver)',
    telehealth: true,
    steps: [
      { title: 'Confirm Your Qualifying Condition', description: 'Connecticut covers a wide range of conditions including cancer, glaucoma, HIV/AIDS, Parkinson\'s disease, multiple sclerosis, PTSD, epilepsy, chronic pain, Crohn\'s disease, and sickle cell disease. The state has expanded its conditions list multiple times since the program\'s inception.' },
      { title: 'See a Certifying Physician', description: 'Schedule an appointment with a Connecticut-licensed physician who is registered with the state\'s medical marijuana program. Telehealth evaluations are accepted. The physician will review your medical history and determine whether medical cannabis is an appropriate treatment.' },
      { title: 'Physician Registers You in the System', description: 'Once certified, your physician will enter your information directly into the Connecticut Department of Consumer Protection\'s electronic registration system. This eliminates the need for paper applications.' },
      { title: 'Complete Patient Registration', description: 'After your physician submits the certification, log into the patient portal to complete your registration. Upload your Connecticut ID and any required documentation. There is no state registration fee for patients.' },
      { title: 'Receive Your Certificate and Purchase', description: 'Processing takes up to 30 days. Once approved, you will receive your registration certificate allowing purchases at licensed dispensaries throughout Connecticut.' }
    ],
    tips: [
      'Connecticut does not charge a state registration fee for medical marijuana patients.',
      'Medical patients benefit from no sales tax on cannabis purchases, unlike the 6.35 percent tax plus potency surcharges on recreational purchases.',
      'The list of qualifying conditions in Connecticut is one of the most extensive in New England.',
      'Telehealth evaluations are accepted, making the process accessible across the state.'
    ],
    intro: 'Connecticut\'s medical marijuana program was established in 2012 and has steadily expanded to become one of the more comprehensive medical cannabis systems in the northeastern United States. Even after recreational cannabis became available in 2023, the medical program remains highly beneficial for patients due to significant tax advantages and expanded access. The program is administered by the Connecticut Department of Consumer Protection, which oversees patient registration, physician certifications, and dispensary operations.\n\nOne of the standout features of Connecticut\'s medical marijuana program is that there is no state registration fee for patients. This makes it one of the most cost-effective medical cannabis programs to join in the nation, as the only expense is the physician evaluation itself. Additionally, medical marijuana purchases in Connecticut are exempt from the state sales tax and the THC potency-based surcharges that apply to recreational purchases, resulting in meaningful savings for regular patients.\n\nConnecticut\'s qualifying conditions list has been expanded multiple times since the program launched and now covers cancer, glaucoma, HIV/AIDS, Parkinson\'s disease, multiple sclerosis, post-traumatic stress disorder, epilepsy and seizure disorders, chronic pain, Crohn\'s disease, sickle cell disease, cerebral palsy, cystic fibrosis, severe psoriasis, and several other debilitating conditions. The expansive list ensures that patients with a wide range of medical needs can access therapeutic cannabis.\n\nThe registration process in Connecticut is physician-driven and largely electronic. After a certifying physician evaluates the patient and determines eligibility, the physician enters the patient\'s information directly into the state\'s electronic registry system. Patients then complete their portion of the registration online through the patient portal. Telehealth evaluations are accepted, providing convenience especially for patients with mobility limitations or those in underserved areas of the state. Processing times are approximately 30 days from submission to approval.'
  },
  delaware: {
    slug: 'delaware',
    stateName: 'Delaware',
    abbreviation: 'DE',
    hasMedicalProgram: true,
    applicationUrl: 'https://dhss.delaware.gov/dhss/dph/hsp/medmarhome.html',
    processingTime: '45 days',
    renewalPeriod: 'Annual',
    renewalCost: '$50',
    minAge: '18 (minors with caregiver)',
    telehealth: true,
    steps: [
      { title: 'Review Qualifying Conditions', description: 'Delaware covers conditions including cancer, HIV/AIDS, PTSD, seizure disorders, ALS, chronic pain, autism, terminal illness, and intractable nausea. Gather your medical documentation supporting your diagnosis.' },
      { title: 'Obtain a Physician Certification', description: 'Visit a Delaware-licensed physician who can certify your qualifying condition. Telehealth evaluations are accepted. The physician must have an established relationship with you or conduct a comprehensive evaluation of your medical history.' },
      { title: 'Submit Your Application', description: 'Apply through the Delaware Division of Public Health. Submit the completed application form along with your physician certification, Delaware ID, proof of residency, and a passport-style photo.' },
      { title: 'Pay the $50 Registration Fee', description: 'Include the $50 state registration fee with your application. There may be reduced fees available for patients on government assistance programs.' },
      { title: 'Receive Your Registry ID Card', description: 'Delaware processes applications within approximately 45 days. Once approved, you will receive your registry identification card authorizing purchases at licensed compassion centers.' }
    ],
    tips: [
      'Delaware accepts valid out-of-state medical marijuana cards for visiting patients.',
      'Medical card benefits in Delaware include tax savings and higher purchase limits compared to recreational buyers.',
      'Plan ahead for the 45-day processing window, which is longer than most states.',
      'Maintain your established physician relationship for smoother annual renewals.'
    ],
    intro: 'Delaware established its medical marijuana program through the Delaware Medical Marijuana Act, signed into law in 2011, making it one of the earlier East Coast states to provide legal medical cannabis access. The program has matured steadily and operates alongside recreational cannabis, which was legalized through legislation signed in 2023. The Delaware Division of Public Health administers the medical marijuana registry, managing patient registrations and overseeing the compassion centers that serve as the state\'s dispensaries.\n\nDelaware\'s medical marijuana program offers meaningful benefits over recreational access, particularly in terms of tax savings and purchase limits. Medical patients are exempt from certain taxes that apply to recreational purchases, and medical cardholders may access higher-potency products and larger purchase quantities. These advantages make the medical card worthwhile for patients with ongoing therapeutic needs.\n\nThe qualifying conditions for Delaware\'s program include cancer, HIV/AIDS, post-traumatic stress disorder, decompensated cirrhosis, seizure disorders including epilepsy, amyotrophic lateral sclerosis, chronic debilitating pain, autism spectrum disorder, terminal illness with a life expectancy under one year, and intractable nausea. The program has expanded its conditions list over the years to serve a broader patient population.\n\nThe registration process requires a physician certification from a licensed Delaware doctor who has evaluated the patient and confirmed a qualifying condition. Telehealth evaluations are accepted, adding convenience to the process. After obtaining the physician certification, patients submit their application to the Division of Public Health with required documentation and the $50 annual registration fee. Processing takes approximately 45 days, so patients are encouraged to plan ahead. Delaware also accepts visiting patients with valid out-of-state medical marijuana cards, providing reciprocity that many neighboring states do not offer.'
  },
  florida: {
    slug: 'florida',
    stateName: 'Florida',
    abbreviation: 'FL',
    hasMedicalProgram: true,
    applicationUrl: 'https://knowthefactsmmj.com/patients/',
    processingTime: '5-10 business days',
    renewalPeriod: 'Annual',
    renewalCost: '$75',
    minAge: '18 (minors with caregiver and 2 physicians)',
    telehealth: true,
    steps: [
      { title: 'Verify Your Qualifying Condition', description: 'Florida recognizes cancer, epilepsy, glaucoma, HIV/AIDS, PTSD, ALS, Crohn\'s disease, Parkinson\'s disease, multiple sclerosis, chronic nonmalignant pain, and terminal conditions. You may also qualify with conditions of the same kind or class as those listed, as determined by a qualified physician.' },
      { title: 'Visit a Qualified Physician', description: 'Schedule an evaluation with a physician who is certified by the Florida Department of Health to recommend medical marijuana. Telehealth follow-ups are accepted, though initial evaluations typically require an in-person visit. The physician must enter your information into the Medical Marijuana Use Registry.' },
      { title: 'Apply Online with the DOH', description: 'After your physician enters your certification, apply for your Medical Marijuana Use Registry Identification Card through the Florida Department of Health website. Upload your Florida ID or driver\'s license, proof of residency, a passport-style photo, and proof of Florida residency.' },
      { title: 'Pay the $75 Application Fee', description: 'Submit the $75 state application fee online. This fee is nonrefundable. Patients who can demonstrate financial hardship may apply for a fee waiver.' },
      { title: 'Receive Your MMUR Card', description: 'Florida processes applications within 5 to 10 business days. Once approved, you can use your temporary approval email to make purchases while your physical card is mailed. You can then visit any of the hundreds of licensed dispensaries across Florida.' }
    ],
    tips: [
      'Florida has over 800,000 registered medical marijuana patients, making it one of the largest medical programs in the country.',
      'The state has hundreds of dispensaries, so access is generally convenient regardless of your location.',
      'Florida allows both smokable flower and other product forms for medical patients.',
      'Initial physician evaluations typically require in-person visits, though follow-ups may be done via telehealth.',
      'A recreational ballot measure narrowly failed in 2024, so the medical card remains the only legal access pathway in Florida.'
    ],
    intro: 'Florida\'s medical marijuana program is one of the largest and most active in the United States, serving over 800,000 registered patients through hundreds of licensed dispensaries statewide. Established through Amendment 2, which was overwhelmingly approved by voters in 2016 with 71 percent support, the program has grown rapidly to become a cornerstone of legal cannabis access in the Southeast. The Florida Department of Health administers the Medical Marijuana Use Registry (MMUR), which manages patient certifications, physician registrations, and regulatory compliance.\n\nFlorida operates under a medical-only framework, as a recreational legalization ballot measure (Amendment 3) narrowly failed in November 2024, receiving 56 percent support but falling short of the required 60 percent supermajority. This means the medical marijuana card is currently the only legal pathway to purchase and possess cannabis in Florida. Given the failed recreational initiative, the medical program\'s importance to Florida patients cannot be overstated.\n\nThe qualifying conditions for Florida\'s program include cancer, epilepsy, glaucoma, HIV/AIDS, post-traumatic stress disorder, amyotrophic lateral sclerosis, Crohn\'s disease, Parkinson\'s disease, multiple sclerosis, chronic nonmalignant pain caused by or originating from a qualifying condition, and terminal conditions diagnosed by a physician other than the certifying physician. Physicians also have some discretion to certify patients with conditions comparable to those on the official list.\n\nThe application process begins with an evaluation by a Florida Department of Health-certified physician. Physicians must complete specific training and registration to participate in the program. After evaluation, the physician enters the patient\'s certification into the MMUR system, and the patient completes their application online. The $75 application fee is submitted during online registration, and processing typically takes 5 to 10 business days. Patients receive temporary approval via email that allows dispensary purchases while awaiting the physical card.'
  },
  georgia: {
    slug: 'georgia',
    stateName: 'Georgia',
    abbreviation: 'GA',
    hasMedicalProgram: true,
    applicationUrl: 'https://ltgov.georgia.gov/low-thc-oil-registry',
    processingTime: '15 business days',
    renewalPeriod: 'Every 2 years',
    renewalCost: '$25',
    minAge: '18 (minors with caregiver)',
    telehealth: false,
    steps: [
      { title: 'Confirm Your Qualifying Condition', description: 'Georgia\'s program covers end-stage cancer, ALS, seizure disorders, multiple sclerosis, Crohn\'s disease, mitochondrial disease, Parkinson\'s disease, sickle cell disease, PTSD, intractable pain, autism, epidermolysis bullosa, Alzheimer\'s, AIDS, Tourette syndrome, and peripheral neuropathy. Note this is a low-THC oil program only.' },
      { title: 'Visit an Approved Physician', description: 'Consult with a physician licensed in Georgia who can certify your condition for the Low-THC Oil Registry. In-person evaluations are required. The physician must document that conventional treatments have been ineffective or caused intolerable side effects.' },
      { title: 'Register for the Low-THC Oil Card', description: 'After receiving your physician certification, register through the Georgia Low-THC Oil Registry managed by the Georgia Access to Medical Cannabis Commission. Submit your application, physician certification, Georgia ID, and required documentation.' },
      { title: 'Pay the $25 Registration Fee', description: 'Submit the $25 registration fee with your application. The card is valid for two years.' },
      { title: 'Receive Your Registry Card', description: 'Processing takes approximately 15 business days. Once approved, you receive your Low-THC Oil Registry card, which allows you to purchase low-THC cannabis oil products (under 5 percent THC) from licensed dispensaries.' }
    ],
    tips: [
      'Georgia\'s program only permits low-THC cannabis oil with under 5 percent THC — smokable flower is not allowed.',
      'The program is more restrictive than most other state medical programs.',
      'Dispensaries in Georgia only opened in 2024 after years of regulatory delays.',
      'Keep all medical documentation thorough, as the program requires evidence that conventional treatments have been ineffective.'
    ],
    intro: 'Georgia\'s medical cannabis program operates under Haleigh\'s Hope Act, originally passed in 2015, which allows patients with qualifying conditions to possess and use low-THC cannabis oil containing no more than 5 percent THC by weight. This makes Georgia\'s program one of the most restrictive in the nation, as it does not permit smokable cannabis flower, edibles, concentrates, or other standard cannabis products found in most state medical programs. The Georgia Access to Medical Cannabis Commission oversees the program, including licensing of production facilities and dispensaries.\n\nThe program experienced significant delays in implementation, with the first licensed dispensaries not opening until 2024, nearly a decade after the original legislation was signed. Product availability remains more limited compared to fully developed medical programs in other states, though the selection of low-THC oil products has been expanding as more production licenses become active.\n\nGeorgia\'s qualifying conditions list includes end-stage cancer, amyotrophic lateral sclerosis, seizure disorders including epilepsy, multiple sclerosis, Crohn\'s disease, mitochondrial disease, Parkinson\'s disease, sickle cell disease, post-traumatic stress disorder, intractable pain, autism spectrum disorder, epidermolysis bullosa, Alzheimer\'s disease, AIDS, Tourette syndrome, and peripheral neuropathy. To qualify, patients must demonstrate that conventional treatments have been ineffective or have produced intolerable side effects.\n\nThe registration process requires an in-person physician evaluation from a Georgia-licensed doctor who certifies the patient\'s qualifying condition. Telehealth evaluations are not accepted for the initial certification. After obtaining the physician certification, patients register through the Low-THC Oil Registry and pay the $25 registration fee, which covers a two-year card. Processing takes approximately 15 business days. While the program\'s restrictions are significant, it provides a legal pathway for patients with severe conditions to access cannabis-based therapeutics in a state where recreational cannabis remains illegal.'
  },
  hawaii: {
    slug: 'hawaii',
    stateName: 'Hawaii',
    abbreviation: 'HI',
    hasMedicalProgram: true,
    applicationUrl: 'https://health.hawaii.gov/medicalcannabis/',
    processingTime: '20 business days',
    renewalPeriod: 'Annual',
    renewalCost: '$38.50',
    minAge: '18 (minors with caregiver)',
    telehealth: true,
    steps: [
      { title: 'Verify Your Qualifying Condition', description: 'Hawaii recognizes cancer, glaucoma, HIV/AIDS, epilepsy, PTSD, chronic pain, Crohn\'s disease, ALS, multiple sclerosis, and lupus. Gather medical records documenting your diagnosis from your treating physician.' },
      { title: 'Schedule a Physician Evaluation', description: 'Consult with a Hawaii-licensed physician registered with the state\'s medical cannabis program. Telehealth evaluations are accepted for certifications. The physician will review your medical history and determine whether medical cannabis is appropriate.' },
      { title: 'Physician Submits Certification', description: 'If you qualify, the physician will submit your certification electronically through the Hawaii Department of Health\'s patient registration system.' },
      { title: 'Complete Your Patient Registration', description: 'Register online through the Hawaii Department of Health Medical Cannabis Registry. Upload your Hawaii state ID, provide personal information, and pay the $38.50 registration fee.' },
      { title: 'Receive Your 329 Card', description: 'Processing takes approximately 20 business days. Once approved, you receive your 329 registration card allowing purchases at licensed dispensaries across all Hawaiian islands.' }
    ],
    tips: [
      'Hawaii recently legalized recreational cannabis, but medical cardholders still benefit from tax savings and potentially higher limits.',
      'The $38.50 annual fee is moderate compared to many state programs.',
      'Medical patients can grow up to 6 plants for personal medical use in addition to dispensary purchases.',
      'Telehealth evaluations are accepted, which is especially helpful for patients on neighbor islands with limited physician access.'
    ],
    intro: 'Hawaii\'s medical marijuana program was established in 2000, making it one of the earliest state medical cannabis programs in the nation. The program has undergone significant evolution over the years, transitioning from a patient-grow-only model to a fully regulated dispensary system with licensed facilities across the Hawaiian islands. The Hawaii Department of Health oversees the program through the Office of Medical Cannabis Control and Regulation, managing patient registrations, physician certifications, and dispensary licensing.\n\nWith the recent passage of recreational cannabis legislation in 2024, Hawaii joined the growing number of states permitting adult-use cannabis. However, the medical program continues to provide distinct advantages for qualifying patients, including potential tax savings on purchases, possible higher possession and purchase limits, and the preservation of the patient cultivation privilege that allows medical cardholders to grow up to six cannabis plants for personal use at their private residence.\n\nHawaii\'s qualifying conditions include cancer, glaucoma, HIV/AIDS, epilepsy and seizure disorders, post-traumatic stress disorder, chronic pain, Crohn\'s disease, amyotrophic lateral sclerosis, multiple sclerosis, and lupus. The conditions list has been periodically updated to address the medical needs of the state\'s patient population. Physicians with established patient-physician relationships have some discretion in certifying patients with conditions that produce chronic pain or other debilitating symptoms.\n\nThe application process involves obtaining a certification from a registered Hawaii physician, which can now be done via telehealth. This is particularly valuable for patients living on neighbor islands where access to certifying physicians may be limited. After the physician submits the certification electronically, patients complete their registration online and pay the $38.50 annual fee. Processing takes approximately 20 business days, after which patients receive their 329 registration card.'
  },
  illinois: {
    slug: 'illinois',
    stateName: 'Illinois',
    abbreviation: 'IL',
    hasMedicalProgram: true,
    applicationUrl: 'https://dph.illinois.gov/topics-services/prevention-wellness/medical-cannabis.html',
    processingTime: '30 days',
    renewalPeriod: '1-3 years (patient choice)',
    renewalCost: '$50-$100',
    minAge: '18 (minors with caregiver)',
    telehealth: true,
    steps: [
      { title: 'Confirm Your Qualifying Condition', description: 'Illinois recognizes over 40 qualifying conditions including cancer, HIV/AIDS, PTSD, seizure disorders, Crohn\'s disease, chronic pain, migraines, fibromyalgia, autism, and anorexia nervosa. Review the complete list on the Illinois Department of Public Health website.' },
      { title: 'Obtain a Physician Certification', description: 'Visit a physician licensed in Illinois to evaluate your condition. Telehealth consultations are accepted. The physician must review your medical records and provide a written certification recommending medical cannabis for your qualifying condition.' },
      { title: 'Register Online', description: 'Apply through the Illinois Department of Public Health medical cannabis patient portal. Upload your physician certification, Illinois ID or driver\'s license, passport-style photo, and proof of Illinois residency.' },
      { title: 'Choose Your Card Duration and Pay', description: 'Illinois offers 1-year ($50), 2-year ($75), or 3-year ($100) card options. Choose the duration that best fits your needs and submit payment online.' },
      { title: 'Receive Your Medical Cannabis Card', description: 'Processing takes approximately 30 days. You will receive a provisional approval that allows dispensary purchases while your physical card is being produced and mailed.' }
    ],
    tips: [
      'Illinois offers multi-year card options up to 3 years, reducing the hassle and cost of frequent renewals.',
      'Medical patients pay significantly less tax compared to recreational buyers, who face rates up to 25 percent based on THC content.',
      'Medical patients can grow up to 5 plants at home, while recreational users cannot.',
      'Illinois recognizes over 40 qualifying conditions, one of the broadest lists in the country.',
      'Provisional approval allows immediate dispensary access while your physical card is processed.'
    ],
    intro: 'Illinois made history in 2019 as the first state to legalize recreational cannabis through legislative action with the Cannabis Regulation and Tax Act. However, the state\'s medical cannabis program, which began under the Compassionate Use of Medical Cannabis Program Act in 2013, continues to provide substantial benefits that make registration worthwhile for qualifying patients. The program is administered by the Illinois Department of Public Health and has been significantly expanded and streamlined since its inception.\n\nThe tax advantage for medical cannabis patients in Illinois is particularly significant. Recreational cannabis purchases are subject to a tiered tax structure based on THC content, ranging from 10 percent for products under 35 percent THC to 25 percent for products above 35 percent THC, plus state and local sales taxes that can push the effective rate above 30 percent. Medical cannabis patients pay only the standard 1 percent sales tax on their purchases, creating substantial savings for regular consumers.\n\nIllinois recognizes one of the most extensive lists of qualifying conditions in the United States, with over 40 approved conditions. These include cancer, HIV/AIDS, post-traumatic stress disorder, seizure disorders, Crohn\'s disease, chronic pain, migraines, fibromyalgia, autism spectrum disorder, anorexia nervosa, spinal cord disease, Tourette syndrome, and many others. Additionally, medical patients are permitted to grow up to 5 plants at home, a privilege not extended to recreational consumers.\n\nThe application process is straightforward and begins with a physician certification from a licensed Illinois doctor. Telehealth evaluations are accepted, making the process accessible regardless of location. Illinois offers flexible card duration options at 1-year, 2-year, or 3-year intervals, allowing patients to choose the plan that best fits their needs and budget. Processing takes approximately 30 days, though provisional approval enables dispensary purchases while the physical card is being prepared.'
  },
  iowa: {
    slug: 'iowa',
    stateName: 'Iowa',
    abbreviation: 'IA',
    hasMedicalProgram: true,
    applicationUrl: 'https://idph.iowa.gov/medical-cannabidiol',
    processingTime: '30 days',
    renewalPeriod: 'Every 2 years',
    renewalCost: '$100',
    minAge: '18 (minors with caregiver)',
    telehealth: false,
    steps: [
      { title: 'Verify Your Qualifying Condition', description: 'Iowa covers cancer, seizures, Crohn\'s disease, HIV/AIDS, ALS, Parkinson\'s disease, multiple sclerosis, PTSD, chronic pain, and terminal illness. Prepare medical documentation of your diagnosis.' },
      { title: 'Visit a Certifying Physician', description: 'Schedule an in-person appointment with an Iowa-licensed physician. The physician must be registered with the Iowa Department of Health to certify medical cannabidiol patients. Telehealth is not accepted for certifications.' },
      { title: 'Obtain Physician Certification', description: 'If the physician determines you qualify, they will submit your certification to the Iowa Medical Cannabidiol Board. The certification must include the qualifying condition and the physician\'s recommendation.' },
      { title: 'Complete Patient Registration', description: 'Register through the Iowa Department of Health medical cannabidiol patient portal. Upload your Iowa ID, physician certification confirmation, and pay the $100 biennial registration fee.' },
      { title: 'Receive Your Registration Card', description: 'Processing takes approximately 30 days. Once approved, you receive your medical cannabidiol patient card valid for two years, allowing purchases at Iowa\'s licensed dispensaries.' }
    ],
    tips: [
      'Iowa\'s program is labeled as medical cannabidiol rather than medical marijuana, reflecting its more restricted approach.',
      'The program limits total THC to 4.5 grams per 90-day period.',
      'Iowa does not allow smokable cannabis flower — only processed products are available.',
      'The $100 fee covers two years, effectively costing $50 per year.'
    ],
    intro: 'Iowa\'s medical cannabidiol program was established in 2014 and has been gradually expanded over the years, though it remains one of the more restrictive medical cannabis programs in the United States. The program is administered by the Iowa Department of Health and Human Services through the Medical Cannabidiol Program, and it uses the term "medical cannabidiol" rather than "medical marijuana" to reflect the program\'s focus on controlled, pharmaceutical-grade cannabis products. Iowa\'s program does not permit smokable flower and places strict limits on total THC content.\n\nThe most significant restriction in Iowa\'s program is the THC cap of 4.5 grams of total THC per 90-day period. This limit applies across all products purchased and was increased from the original 3 percent THC cap after persistent advocacy from patients and physicians. While this is more restrictive than most state programs, it still provides meaningful access to medical cannabis for patients with qualifying conditions who have not found relief through conventional treatments.\n\nIowa\'s qualifying conditions include cancer, seizures including epilepsy, Crohn\'s disease, HIV/AIDS, amyotrophic lateral sclerosis, Parkinson\'s disease, multiple sclerosis, post-traumatic stress disorder, chronic pain, and terminal illness with a probable life expectancy of under one year. The state has periodically added conditions to this list in response to patient advocacy and medical evidence.\n\nThe registration process requires an in-person evaluation with an Iowa-licensed physician registered with the state program. Telehealth evaluations are not accepted for medical cannabidiol certifications, requiring patients to visit a physician in person. After certification, patients register through the state portal and pay the $100 biennial fee, which covers a two-year registration period. Processing takes approximately 30 days. Iowa operates a limited number of dispensary locations, so patients should verify the nearest dispensary to their residence before beginning the application process.'
  },
  louisiana: {
    slug: 'louisiana',
    stateName: 'Louisiana',
    abbreviation: 'LA',
    hasMedicalProgram: true,
    applicationUrl: 'https://ldh.la.gov/page/medical-marijuana',
    processingTime: 'Immediate (with physician recommendation)',
    renewalPeriod: 'Annual',
    renewalCost: '$150-$200 (physician fee)',
    minAge: '18 (minors with caregiver)',
    telehealth: true,
    steps: [
      { title: 'Review Qualifying Conditions', description: 'Louisiana covers cancer, HIV/AIDS, epilepsy, PTSD, Crohn\'s disease, muscular dystrophy, chronic pain, autism, glaucoma, and Parkinson\'s disease. The state has significantly expanded its qualifying conditions over the years.' },
      { title: 'Find a Recommending Physician', description: 'Schedule an evaluation with a Louisiana-licensed physician authorized to recommend medical marijuana. Telehealth evaluations are accepted. The physician will assess your condition and medical history.' },
      { title: 'Receive Your Recommendation', description: 'Louisiana operates on a recommendation system rather than a state-issued card. If you qualify, the physician provides a recommendation that is entered into the state prescription monitoring program. There is no separate state registration required.' },
      { title: 'Visit a Licensed Pharmacy', description: 'With your physician recommendation, you can immediately visit one of Louisiana\'s licensed medical marijuana pharmacies. Bring a valid photo ID and your physician\'s recommendation information. Louisiana dispenses medical cannabis through pharmacies rather than traditional dispensaries.' },
      { title: 'Purchase Your Medicine', description: 'Louisiana\'s licensed pharmacies offer a range of products including smokable flower (legalized in 2022), tinctures, capsules, topicals, gummies, and other formulations. Your pharmacist can help guide product selection.' }
    ],
    tips: [
      'Louisiana uses a recommendation system with no separate state registration or card required, making access faster than most states.',
      'Medical cannabis in Louisiana is dispensed through licensed pharmacies, not dispensaries.',
      'Smokable flower has been available since 2022, expanding product options significantly.',
      'Telehealth evaluations are accepted, simplifying the process considerably.',
      'The primary cost is the physician evaluation fee, typically $150 to $200, as there is no state card fee.'
    ],
    intro: 'Louisiana\'s medical marijuana program has undergone a remarkable transformation since its establishment in 2015, evolving from one of the most restrictive programs in the nation to a relatively accessible system that now includes smokable cannabis flower. The program is unique in that it operates through licensed pharmacies rather than traditional dispensaries, reflecting Louisiana\'s original vision of treating medical cannabis as a pharmaceutical product. The Louisiana Department of Health oversees the program in coordination with the Louisiana Board of Pharmacy.\n\nOne of the most significant advantages of Louisiana\'s system is its recommendation-based model, which eliminates the need for a separate state registration card and associated fees. When a qualified physician recommends medical cannabis, the recommendation is entered into the state prescription monitoring system, and the patient can immediately visit a licensed pharmacy to make purchases. This means there is no state application to complete, no registration fee to pay, and no waiting period for card processing — making it one of the fastest access pathways in the country.\n\nLouisiana\'s qualifying conditions have been substantially expanded since the program\'s early years. The current list includes cancer, HIV/AIDS, epilepsy and seizure disorders, post-traumatic stress disorder, Crohn\'s disease, muscular dystrophy, chronic pain, autism spectrum disorder, glaucoma, Parkinson\'s disease, intractable pain, and several other conditions. The expansion of the conditions list has opened access to a much larger patient population than the original program served.\n\nThe addition of smokable cannabis flower in 2022 was a major milestone for Louisiana\'s program, as the original legislation only permitted non-smokable forms. Today, licensed pharmacies offer a comprehensive selection of products including flower, tinctures, capsules, topicals, gummy formulations, metered-dose inhalers, and transdermal patches. Telehealth evaluations are accepted for physician recommendations, and the typical physician consultation fee ranges from $150 to $200. While recreational cannabis remains illegal in Louisiana, possession of small amounts under 14 grams has been decriminalized.'
  },
  maine: {
    slug: 'maine',
    stateName: 'Maine',
    abbreviation: 'ME',
    hasMedicalProgram: true,
    applicationUrl: 'https://www.maine.gov/dafs/ocp/medical-use-of-cannabis',
    processingTime: '30 days',
    renewalPeriod: 'Annual',
    renewalCost: '$25',
    minAge: '18 (minors with caregiver)',
    telehealth: true,
    steps: [
      { title: 'Verify Your Qualifying Condition', description: 'Maine recognizes cancer, HIV/AIDS, epilepsy, PTSD, chronic pain, Crohn\'s disease, ALS, hepatitis C, glaucoma, and any other condition certified by a physician as debilitating. Maine gives physicians broad discretion in certifying patients.' },
      { title: 'Consult a Physician', description: 'Schedule an evaluation with a Maine-licensed physician. Telehealth evaluations are accepted. The physician will review your medical history, evaluate your condition, and determine whether medical cannabis would be beneficial.' },
      { title: 'Obtain a Written Certification', description: 'If approved, the physician provides a written certification documenting your qualifying condition and recommending medical cannabis. This certification is required for your state application.' },
      { title: 'Apply for Your Patient Card', description: 'Submit your application to the Maine Office of Cannabis Policy. Include your physician certification, Maine ID, and the $25 registration fee. Applications can be submitted online or by mail.' },
      { title: 'Receive Your Registration Card', description: 'Processing takes approximately 30 days. Once approved, you receive your Maine medical cannabis registration card, allowing purchases from licensed dispensaries and caregiver operations throughout the state.' }
    ],
    tips: [
      'Maine gives physicians broad discretion to certify any condition they deem debilitating, making it one of the most accessible programs.',
      'At $25 annually, Maine has one of the lowest medical card fees in the country.',
      'Medical patients can choose between licensed dispensaries and registered caregiver operations for their purchases.',
      'Maine\'s robust caregiver program provides an alternative to dispensary purchases with often competitive pricing.'
    ],
    intro: 'Maine established its medical marijuana program through a voter initiative in 1999, making it one of the earliest medical cannabis states in the nation. The program has evolved significantly since then and now operates alongside a regulated recreational market that launched in 2020. The Maine Office of Cannabis Policy administers both the medical and adult-use programs, ensuring consistent regulatory oversight across the state\'s cannabis industry.\n\nMaine\'s medical program stands out for its accessibility and physician discretion. While the state maintains a standard list of qualifying conditions including cancer, HIV/AIDS, epilepsy, PTSD, chronic pain, Crohn\'s disease, ALS, hepatitis C, and glaucoma, physicians are also empowered to certify any patient with a condition they determine to be debilitating and potentially benefited by medical cannabis. This broad physician discretion means that patients with conditions not explicitly listed may still qualify if their doctor believes cannabis would be therapeutically beneficial.\n\nAnother distinctive feature of Maine\'s medical cannabis landscape is its thriving caregiver system. Registered caregivers can grow cannabis for and supply it to their registered patients, providing an alternative to dispensary purchases that often features competitive pricing and a more personalized experience. Patients can register with up to one caregiver while also maintaining the ability to purchase from licensed dispensaries, giving them flexibility in how they obtain their medicine.\n\nThe application process is straightforward and affordable. After obtaining a physician certification, patients submit their application to the Office of Cannabis Policy with a $25 registration fee — one of the lowest in the nation. Processing takes approximately 30 days. Medical card benefits over recreational access include potential tax savings, as medical purchases may be exempt from certain excise taxes that apply to adult-use sales. Telehealth evaluations are accepted, and the annual renewal process follows the same physician-certification-plus-state-application structure as the initial registration.'
  },
  maryland: {
    slug: 'maryland',
    stateName: 'Maryland',
    abbreviation: 'MD',
    hasMedicalProgram: true,
    applicationUrl: 'https://mmcc.maryland.gov/',
    processingTime: 'Same day (online approval)',
    renewalPeriod: 'Annual',
    renewalCost: 'Free',
    minAge: '18 (minors with caregiver)',
    telehealth: true,
    steps: [
      { title: 'Review Qualifying Conditions', description: 'Maryland allows physicians to certify patients with any condition they believe would benefit from medical cannabis. Common conditions include chronic pain, PTSD, seizure disorders, glaucoma, anorexia, cachexia, severe nausea, and severe pain. There is no restrictive qualifying conditions list.' },
      { title: 'Register as a Patient', description: 'Create a patient account on the Maryland Cannabis Administration (formerly MMCC) online portal. This step can be completed before your physician evaluation. Provide your Maryland ID and personal information.' },
      { title: 'Get a Physician Certification', description: 'Schedule an evaluation with a registered Maryland cannabis physician. Telehealth evaluations are widely accepted. The physician will enter your certification directly into the state system after your appointment.' },
      { title: 'Receive Instant Approval', description: 'Once your physician submits the certification, your patient account is activated immediately. There is no state registration fee. You can visit a licensed dispensary the same day as your physician appointment.' },
      { title: 'Visit a Dispensary', description: 'Bring your Maryland ID to any licensed dispensary. Your status will be verified electronically through the state system. Medical patients benefit from tax exemptions not available to recreational buyers.' }
    ],
    tips: [
      'Maryland charges no state fee for medical cannabis registration, making it completely free aside from the physician evaluation.',
      'Approval is essentially instant once the physician submits the certification electronically.',
      'Medical patients are exempt from the 9 percent sales tax applied to recreational purchases.',
      'Maryland has no restrictive conditions list — physicians can certify any condition they believe warrants medical cannabis.',
      'Telehealth evaluations are widely available and accepted.'
    ],
    intro: 'Maryland\'s medical cannabis program is one of the most patient-friendly systems in the United States, featuring free registration, instant approval after physician certification, and no restrictive qualifying conditions list. The program has been operating since 2017 and transitioned to oversight by the Maryland Cannabis Administration when recreational cannabis sales launched in July 2023. Despite the availability of recreational cannabis, the medical program offers compelling benefits that make registration worthwhile for qualifying patients.\n\nThe most notable advantage of Maryland\'s medical program is the complete absence of a state registration fee. Patients pay nothing to the state to register and maintain their medical cannabis status. This makes the total cost of obtaining a medical card limited to the physician evaluation fee, which typically ranges from $100 to $200 depending on the provider. Combined with same-day approval processing, Maryland offers one of the lowest barriers to medical cannabis access in the country.\n\nMaryland does not maintain a restrictive list of qualifying conditions. Instead, the state empowers physicians to certify any patient they believe would benefit therapeutically from medical cannabis. This physician-discretion model ensures that patients with a wide range of conditions — from chronic pain and PTSD to anxiety, insomnia, and other debilitating symptoms — can access medical cannabis without navigating a bureaucratic list of approved diagnoses. Common conditions include chronic pain, PTSD, seizure disorders, glaucoma, anorexia, cachexia, severe nausea, and persistent muscle spasms.\n\nThe financial incentive for medical patients is significant. Recreational cannabis purchases in Maryland are subject to a 9 percent sales tax, while medical purchases are tax-exempt. For regular consumers, these savings accumulate quickly and far exceed the cost of the initial physician evaluation within the first year. The registration process is entirely electronic, with physicians submitting certifications directly to the state system. Patients receive instant approval and can visit a dispensary the same day as their physician appointment.'
  },
  massachusetts: {
    slug: 'massachusetts',
    stateName: 'Massachusetts',
    abbreviation: 'MA',
    hasMedicalProgram: true,
    applicationUrl: 'https://www.mass.gov/medical-use-of-marijuana-program',
    processingTime: '1-3 business days',
    renewalPeriod: 'Annual',
    renewalCost: '$50',
    minAge: '18 (minors with caregiver)',
    telehealth: true,
    steps: [
      { title: 'Review Qualifying Conditions', description: 'Massachusetts covers cancer, glaucoma, HIV/AIDS, hepatitis C, ALS, Crohn\'s disease, Parkinson\'s disease, multiple sclerosis, and PTSD. Physicians may also certify patients with other debilitating conditions on a case-by-case basis.' },
      { title: 'Register in the Virtual Gateway', description: 'Create a patient account in the Massachusetts Cannabis Control Commission\'s virtual patient portal. This must be done before your physician evaluation so the doctor can link the certification to your account.' },
      { title: 'Obtain a Physician Certification', description: 'Schedule an appointment with a registered Massachusetts healthcare provider. Telehealth evaluations are accepted. The provider will evaluate your condition and, if you qualify, submit a certification to the state system.' },
      { title: 'Complete Your Application and Pay', description: 'Log back into the virtual gateway to complete your application after the physician has submitted the certification. Pay the $50 state registration fee online. Financial hardship waivers may be available.' },
      { title: 'Receive Your Temporary Card', description: 'Massachusetts typically processes applications within 1 to 3 business days. You will receive a temporary electronic card that can be used at dispensaries while your permanent card is mailed to you.' }
    ],
    tips: [
      'Massachusetts processes applications quickly, typically in 1 to 3 business days.',
      'Medical patients save on taxes — recreational purchases are subject to a combined tax rate exceeding 20 percent.',
      'Register in the patient portal before your physician appointment to streamline the process.',
      'Financial hardship waivers may be available for the state registration fee.',
      'Medical patients can cultivate up to 6 plants per person at home.'
    ],
    intro: 'Massachusetts has operated a medical marijuana program since 2012, predating the state\'s recreational legalization in 2016. The program is administered by the Cannabis Control Commission and continues to offer significant benefits for patients even with widespread recreational availability. The combination of meaningful tax savings, faster processing times, and dedicated medical dispensary access makes the Massachusetts medical card a valuable option for patients with qualifying conditions.\n\nThe financial case for a medical card in Massachusetts is compelling. Recreational cannabis purchases are subject to a 10.75 percent excise tax, a 6.25 percent state sales tax, and up to 3 percent in local option taxes, resulting in a combined rate that can exceed 20 percent. Medical cannabis purchases are exempt from these taxes, creating substantial annual savings for regular consumers that far outweigh the $50 registration fee. Medical patients also receive access to higher-potency products and potentially larger quantities.\n\nMassachusetts\' qualifying conditions include cancer, glaucoma, HIV/AIDS, hepatitis C, amyotrophic lateral sclerosis, Crohn\'s disease, Parkinson\'s disease, multiple sclerosis, and post-traumatic stress disorder. Additionally, physicians have the authority to certify patients with other debilitating conditions they determine would benefit from medical cannabis, providing flexibility beyond the explicit conditions list.\n\nThe registration process in Massachusetts is efficient and largely electronic. Patients first create an account in the Cannabis Control Commission\'s virtual patient portal, then visit a registered healthcare provider for evaluation and certification. After the physician submits the certification, the patient completes the application and pays the $50 fee online. Processing typically takes just 1 to 3 business days, and patients receive a temporary electronic card that enables immediate dispensary access while the permanent card is printed and mailed. Telehealth evaluations are widely accepted throughout the state.'
  },
  michigan: {
    slug: 'michigan',
    stateName: 'Michigan',
    abbreviation: 'MI',
    hasMedicalProgram: true,
    applicationUrl: 'https://www.michigan.gov/lara/bureau-list/bmmr',
    processingTime: '20 business days',
    renewalPeriod: 'Every 2 years',
    renewalCost: '$40',
    minAge: '18 (minors with caregiver)',
    telehealth: true,
    steps: [
      { title: 'Confirm Your Qualifying Condition', description: 'Michigan covers cancer, glaucoma, HIV/AIDS, hepatitis C, ALS, Crohn\'s disease, PTSD, chronic pain, seizures, and severe nausea. Medical records documenting your condition are required for the physician evaluation.' },
      { title: 'Get a Physician Certification', description: 'Schedule an evaluation with a Michigan-licensed physician. Telehealth evaluations are accepted. The physician must have a bona fide physician-patient relationship and complete the state\'s physician certification form.' },
      { title: 'Apply Online', description: 'Submit your application through the Michigan Marijuana Regulatory Agency online portal. Upload your physician certification, Michigan ID, and any required documentation.' },
      { title: 'Pay the $40 Registration Fee', description: 'The registration fee covers a two-year card period, making the effective annual cost just $20 — one of the lowest in the nation.' },
      { title: 'Receive Your Card', description: 'Processing takes approximately 20 business days. Once approved, your medical marijuana card is mailed to your address on file and is valid for two years.' }
    ],
    tips: [
      'Michigan issues two-year cards, and at $40 per two years the effective annual cost is just $20.',
      'Medical patients save significantly on taxes — recreational purchases carry a 10 percent excise tax plus 6 percent sales tax.',
      'Medical patients can grow up to 12 plants at home.',
      'Telehealth evaluations streamline the certification process.'
    ],
    intro: 'Michigan\'s medical marijuana program was established by voter initiative in 2008 and has grown into one of the largest medical cannabis programs in the Midwest. The program is administered by the Michigan Marijuana Regulatory Agency under the Department of Licensing and Regulatory Affairs. Even after recreational legalization through Proposal 1 in 2018, the medical program maintains significant advantages for qualifying patients, including major tax savings and expanded cultivation rights.\n\nThe financial benefits of a Michigan medical card are substantial. Recreational cannabis purchases are subject to a 10 percent excise tax plus the standard 6 percent state sales tax, for a combined rate of 16 percent before local taxes. Medical cannabis purchases are exempt from the excise tax and subject to a reduced tax rate, resulting in meaningful savings for regular consumers. Additionally, medical patients are permitted to grow up to 12 plants at home, compared to more limited home cultivation allowances for recreational consumers.\n\nMichigan\'s qualifying conditions include cancer, glaucoma, HIV/AIDS, hepatitis C, amyotrophic lateral sclerosis, Crohn\'s disease, post-traumatic stress disorder, chronic pain, seizure conditions including epilepsy, and severe and chronic nausea. These conditions must be documented through medical records and certified by a licensed Michigan physician during an evaluation.\n\nThe application process begins with a physician certification, which can be obtained through telehealth. After certification, patients submit their application through the Michigan Marijuana Regulatory Agency\'s online portal and pay the $40 registration fee. This fee covers a full two-year card period, making the effective annual cost just $20 — among the lowest in the nation. Processing takes approximately 20 business days. Michigan\'s combination of affordable registration, significant tax savings, generous home cultivation limits, and a mature dispensary market with competitive pricing makes it one of the more advantageous medical cannabis programs for patients.'
  },
  minnesota: {
    slug: 'minnesota',
    stateName: 'Minnesota',
    abbreviation: 'MN',
    hasMedicalProgram: true,
    applicationUrl: 'https://www.health.state.mn.us/people/cannabis/patients/index.html',
    processingTime: '15-30 days',
    renewalPeriod: 'Annual',
    renewalCost: 'Varies by provider',
    minAge: '18 (minors with caregiver)',
    telehealth: true,
    steps: [
      { title: 'Verify Your Qualifying Condition', description: 'Minnesota covers cancer, glaucoma, HIV/AIDS, Tourette syndrome, ALS, seizures, chronic pain, PTSD, autism, and sleep apnea. The state has one of the broader qualifying conditions lists and periodically adds new conditions.' },
      { title: 'Consult a Healthcare Provider', description: 'Schedule an evaluation with a Minnesota healthcare provider who can certify you for the medical cannabis program. Telehealth evaluations are accepted. Both physicians and advanced practice providers may certify patients.' },
      { title: 'Provider Submits Certification', description: 'Your healthcare provider will enter your certification into the Minnesota Department of Health system. They will specify your qualifying condition and recommended forms of cannabis.' },
      { title: 'Complete Patient Enrollment', description: 'After your provider submits the certification, enroll through the Minnesota medical cannabis patient portal. Upload your Minnesota ID and complete the registration process.' },
      { title: 'Receive Your Patient Card', description: 'Processing takes 15 to 30 days. Once approved, you can purchase from licensed dispensaries. Medical patients may benefit from certain advantages over the new recreational market.' }
    ],
    tips: [
      'Minnesota recently legalized recreational cannabis, but medical patients continue to receive benefits including potential tax savings.',
      'Both physicians and advanced practice providers can certify patients, expanding access to evaluations.',
      'Minnesota has been progressively adding qualifying conditions to its list.',
      'Telehealth evaluations are accepted for certifications.'
    ],
    intro: 'Minnesota\'s medical cannabis program was established in 2014 and has undergone significant expansion since its inception. Originally one of the most restrictive programs in the country, limiting patients to non-smokable forms and a short list of qualifying conditions, the program has evolved considerably. The passage of recreational legalization through HF 100 in 2023, with retail sales beginning in 2025, has created a new landscape, but the medical program continues to offer advantages that make registration valuable for qualifying patients.\n\nThe Minnesota medical cannabis program is administered by the Minnesota Department of Health through the Office of Medical Cannabis. The program allows both physicians and advanced practice registered nurses to certify patients, which is less common among state programs and provides greater access to evaluations. This is particularly beneficial in rural areas of the state where specialist physicians may be less accessible.\n\nMinnesota\'s qualifying conditions have expanded substantially over the years and now include cancer, glaucoma, HIV/AIDS, Tourette syndrome, amyotrophic lateral sclerosis, seizure disorders, chronic pain, post-traumatic stress disorder, autism spectrum disorder, sleep apnea, chronic motor or vocal tic disorder, and several other conditions. The state periodically reviews petitions to add new qualifying conditions and has been responsive to patient and medical community input.\n\nThe enrollment process begins with an evaluation by a registered healthcare provider, which can be conducted via telehealth. After the provider submits the certification electronically, patients complete their enrollment through the state portal. Processing takes 15 to 30 days. With recreational sales now operational in Minnesota, medical patients benefit from potentially lower tax rates, access to medical-specific products, and the ability to purchase from the established medical dispensary network alongside the emerging recreational market.'
  },
  mississippi: {
    slug: 'mississippi',
    stateName: 'Mississippi',
    abbreviation: 'MS',
    hasMedicalProgram: true,
    applicationUrl: 'https://www.mmcp.ms.gov/',
    processingTime: '30 days',
    renewalPeriod: 'Annual',
    renewalCost: '$25',
    minAge: '18 (minors with caregiver)',
    telehealth: false,
    steps: [
      { title: 'Confirm Your Qualifying Condition', description: 'Mississippi recognizes cancer, epilepsy, PTSD, chronic pain, HIV/AIDS, ALS, Crohn\'s disease, Parkinson\'s, multiple sclerosis, sickle cell disease, and spinal cord injury among its qualifying conditions.' },
      { title: 'Visit a Certified Physician', description: 'Schedule an in-person evaluation with a Mississippi-licensed physician who is registered with the Mississippi Medical Cannabis Program. The physician must have an established patient relationship or conduct a comprehensive review.' },
      { title: 'Obtain Physician Certification', description: 'The physician will certify your qualifying condition and submit the certification to the Mississippi Department of Health. The certification must include the recommended daily dosage amount.' },
      { title: 'Apply Through the State Portal', description: 'Complete your application online through the Mississippi Medical Cannabis Program portal. Upload your Mississippi ID, physician certification, and pay the $25 registration fee.' },
      { title: 'Receive Your Patient Card', description: 'Processing takes approximately 30 days. Once approved, you receive your medical cannabis card allowing purchases of up to 3 ounces per month from licensed dispensaries.' }
    ],
    tips: [
      'Mississippi has a $25 annual registration fee, making it one of the more affordable programs in the South.',
      'Patients are limited to 3 ounces of cannabis per month.',
      'The program is medical-only, as recreational cannabis is not legal in Mississippi.',
      'Over 100 dispensary licenses have been issued, providing growing access across the state.'
    ],
    intro: 'Mississippi\'s medical cannabis program was established through the Mississippi Medical Cannabis Act, signed into law in February 2022, following years of advocacy and a complex legislative journey that included a voter-approved initiative that was initially struck down on procedural grounds. The program is administered by the Mississippi Department of Health and became fully operational in 2023, making it one of the newer medical cannabis programs in the Southeast.\n\nThe Mississippi Medical Cannabis Program represents a significant step forward for patients in a state that had no prior legal cannabis access. The program permits qualifying patients to purchase up to 3 ounces of cannabis per month from licensed dispensaries, with a range of product forms available including smokable flower, edibles, tinctures, topicals, and concentrates. Over 100 dispensary licenses have been issued, and the retail network continues to expand across the state.\n\nMississippi\'s qualifying conditions include cancer, epilepsy and seizure disorders, post-traumatic stress disorder, chronic pain, HIV/AIDS, amyotrophic lateral sclerosis, Crohn\'s disease, Parkinson\'s disease, multiple sclerosis, sickle cell disease, spinal cord injury, and several other serious medical conditions. Physicians must determine that the patient has a qualifying condition and that the potential benefits of medical cannabis outweigh the risks.\n\nThe registration process requires an in-person physician evaluation from a Mississippi-licensed doctor registered with the program. After certification, patients apply through the state portal and pay the $25 annual registration fee, which is among the lowest in the nation. Processing takes approximately 30 days. Mississippi\'s program is relatively new but growing rapidly, with increasing patient enrollment and expanding dispensary access across the state. Recreational cannabis remains illegal in Mississippi, making the medical card the exclusive legal pathway to cannabis access.'
  },
  missouri: {
    slug: 'missouri',
    stateName: 'Missouri',
    abbreviation: 'MO',
    hasMedicalProgram: true,
    applicationUrl: 'https://cannabis.mo.gov/patients-caregivers',
    processingTime: '30 days',
    renewalPeriod: 'Annual',
    renewalCost: '$25',
    minAge: '18 (minors with caregiver)',
    telehealth: true,
    steps: [
      { title: 'Review Qualifying Conditions', description: 'Missouri recognizes cancer, epilepsy, HIV/AIDS, PTSD, chronic pain, migraines, and any debilitating condition certified by a physician. The broad physician-discretion clause makes Missouri\'s program highly accessible.' },
      { title: 'Get a Physician Certification', description: 'Schedule an evaluation with a Missouri-licensed physician. Telehealth evaluations are accepted. The physician will review your medical history and provide a certification if you have a qualifying condition.' },
      { title: 'Apply Through the DHSS Portal', description: 'Submit your application through the Missouri Department of Health and Senior Services cannabis portal. Upload your physician certification, Missouri ID, and proof of residency.' },
      { title: 'Pay the $25 Annual Fee', description: 'Submit the $25 state registration fee with your application. Processing is done online.' },
      { title: 'Receive Your Card', description: 'Applications are processed within 30 days. Once approved, you receive your Missouri medical marijuana card allowing purchases from licensed dispensaries throughout the state.' }
    ],
    tips: [
      'Missouri allows physicians to certify any debilitating condition, not just those on a set list.',
      'Medical patients in Missouri save on taxes — recreational purchases carry a 6 percent excise tax.',
      'Medical patients can grow up to 6 flowering plants at home.',
      'The $25 annual fee is among the most affordable in the country.',
      'Telehealth evaluations make the process convenient statewide.'
    ],
    intro: 'Missouri\'s medical cannabis program was established through Amendment 2, approved by voters in 2018, and has grown into one of the more accessible and well-regarded programs in the Midwest. The program is administered by the Missouri Department of Health and Senior Services, Division of Cannabis Regulation. Following the passage of Amendment 3 in 2022, which legalized recreational cannabis, the medical program continues to provide significant benefits including tax exemptions and home cultivation rights.\n\nOne of Missouri\'s most patient-friendly features is the broad qualifying conditions framework. While the program explicitly lists conditions including cancer, epilepsy, HIV/AIDS, PTSD, chronic pain, and migraines, it also includes a catch-all provision allowing physicians to certify any chronic, debilitating, or other medical condition that would reasonably benefit from medical cannabis. This physician-discretion model ensures that patients with a wide range of conditions can access the program without being limited to a narrow list.\n\nThe financial benefits of maintaining a medical card in Missouri are noteworthy. Recreational cannabis purchases are subject to a 6 percent excise tax in addition to standard state and local sales taxes, while medical purchases are exempt from the excise tax. Medical patients can also grow up to 6 flowering plants, 6 non-flowering plants, and 6 clones at home, providing an additional avenue for cost savings. The annual registration fee is just $25, making Missouri one of the most affordable medical cannabis programs in the nation.\n\nThe application process is streamlined and efficient. Patients obtain a physician certification through an in-person or telehealth evaluation, then submit their application through the state portal with the $25 fee. Processing takes approximately 30 days. Missouri also implemented an automatic expungement program for past cannabis offenses as part of Amendment 3, reflecting the state\'s progressive approach to cannabis policy reform.'
  },
  montana: {
    slug: 'montana',
    stateName: 'Montana',
    abbreviation: 'MT',
    hasMedicalProgram: true,
    applicationUrl: 'https://dphhs.mt.gov/marijuana',
    processingTime: '30 days',
    renewalPeriod: 'Annual',
    renewalCost: '$25',
    minAge: '18 (minors with caregiver)',
    telehealth: true,
    steps: [
      { title: 'Verify Your Qualifying Condition', description: 'Montana recognizes cancer, glaucoma, HIV/AIDS, chronic pain, epilepsy, PTSD, Crohn\'s disease, and peripheral neuropathy. Gather your medical records documenting your diagnosis.' },
      { title: 'Consult a Licensed Physician', description: 'Schedule an evaluation with a Montana-licensed physician. Telehealth evaluations are accepted. The physician will review your medical history and determine whether you qualify for a medical marijuana card.' },
      { title: 'Submit Your Application', description: 'Apply through the Montana Department of Public Health and Human Services. Include your physician certification, Montana ID, and the $25 registration fee.' },
      { title: 'Receive Your Card', description: 'Processing takes approximately 30 days. Once approved, your Montana medical marijuana card allows purchases at licensed dispensaries and home cultivation for personal medical use.' }
    ],
    tips: [
      'Montana has recreational cannabis, but medical patients benefit from significant tax savings — recreational carries a 20 percent excise tax.',
      'Medical patients can grow 2 mature plants and 2 seedlings at home.',
      'The $25 annual fee is very affordable.',
      'Telehealth evaluations are accepted for certifications.'
    ],
    intro: 'Montana\'s medical marijuana program was established through Initiative 148 in 2004 and has been through significant legislative changes over the years. The program is administered by the Montana Department of Public Health and Human Services. With recreational cannabis legalized through Initiative I-190 in 2020 and sales starting in January 2022, the medical program remains valuable due to the significant tax differential between medical and recreational purchases.\n\nThe tax savings for medical patients in Montana are among the most compelling in the country. Recreational cannabis is subject to a 20 percent excise tax, while medical purchases are exempt from this tax. For regular consumers, this exemption easily justifies the $25 annual registration fee many times over, making the medical card an economically sound investment for qualifying patients.\n\nMontana\'s qualifying conditions include cancer, glaucoma, HIV/AIDS, chronic pain that produces cachexia, wasting, or persistent pain, epilepsy and seizure disorders, post-traumatic stress disorder, Crohn\'s disease, peripheral neuropathy, and conditions producing severe chronic pain, severe nausea, or seizures. The list has been expanded over the years to address a broader range of medical needs.\n\nThe application process is straightforward. After obtaining a physician certification through an in-person or telehealth evaluation, patients submit their application to the Department of Public Health and Human Services along with the $25 registration fee. Processing takes approximately 30 days. Medical patients also retain the right to cultivate up to 2 mature plants and 2 seedlings per person for personal medical use at their private residence, providing an additional pathway to affordable access. Montana\'s dispensary network is well-established throughout the state, with many former medical-only dispensaries now serving both medical and recreational customers.'
  },
  nevada: {
    slug: 'nevada',
    stateName: 'Nevada',
    abbreviation: 'NV',
    hasMedicalProgram: true,
    applicationUrl: 'https://dpbh.nv.gov/Reg/MME-MedicalMarijuana/',
    processingTime: '1-5 business days',
    renewalPeriod: 'Annual',
    renewalCost: '$50',
    minAge: '18 (minors with caregiver)',
    telehealth: true,
    steps: [
      { title: 'Confirm Your Qualifying Condition', description: 'Nevada covers cancer, glaucoma, HIV/AIDS, PTSD, cachexia, chronic pain, seizures, severe nausea, and muscle spasms. Prepare your medical documentation.' },
      { title: 'Get a Physician Recommendation', description: 'Visit a Nevada-licensed physician for an evaluation. Telehealth appointments are accepted. The physician will review your condition and, if you qualify, provide a written recommendation.' },
      { title: 'Apply Online', description: 'Submit your application through the Nevada Division of Public and Behavioral Health online portal. Upload your physician recommendation, Nevada ID, and a passport-style photo.' },
      { title: 'Pay the $50 Annual Fee', description: 'Submit the $50 state registration fee online with your application.' },
      { title: 'Receive Your Card', description: 'Nevada processes applications quickly, typically within 1 to 5 business days. Your card will be mailed to your registered address. Medical patients can purchase from any dispensary in the state.' }
    ],
    tips: [
      'Nevada accepts out-of-state medical marijuana cards for dispensary purchases, a rarity among recreational states.',
      'Medical patients save on taxes compared to the combined recreational tax rate exceeding 25 percent.',
      'Nevada processes applications rapidly, often within just a few business days.',
      'Telehealth evaluations are widely available, especially in the Las Vegas and Reno areas.',
      'Medical patients may access higher potency products and larger quantities.'
    ],
    intro: 'Nevada\'s medical marijuana program was established through a voter initiative in 2000 and has matured into a well-regulated system that operates alongside one of the nation\'s most prominent recreational cannabis markets, particularly in Las Vegas. The program is administered by the Nevada Division of Public and Behavioral Health, which manages patient registrations and oversees compliance. Despite widespread recreational availability, the medical card offers significant advantages that make it worthwhile for qualifying patients.\n\nNevada stands out among recreational states for accepting valid out-of-state medical marijuana cards for dispensary purchases. This reciprocity provision allows visiting patients from other states to purchase medical cannabis from Nevada dispensaries using their home state\'s card, though they must follow Nevada\'s purchase limits and regulations. This makes Nevada one of the most accommodating states for medical cannabis patients who travel.\n\nThe tax savings for medical cardholders in Nevada are substantial. Recreational cannabis is subject to a 10 percent excise tax plus a 15 percent wholesale tax that is passed through to consumers, on top of standard sales tax, pushing the total tax burden above 25 percent. Medical purchases are taxed at significantly lower rates, creating meaningful savings especially for the Las Vegas market where prices tend to be higher. Medical patients may also access higher possession limits and different product formulations.\n\nNevada\'s qualifying conditions include cancer, glaucoma, HIV/AIDS, PTSD, cachexia, chronic pain, seizures, severe nausea, and persistent muscle spasms. The application process is efficient, with processing times of just 1 to 5 business days — among the fastest in the country. Telehealth evaluations are widely available, and the $50 annual registration fee is moderate. Medical card benefits are particularly valuable in Nevada\'s tourist-heavy market, where recreational prices and taxes tend to run higher than average.'
  },
  'new-hampshire': {
    slug: 'new-hampshire',
    stateName: 'New Hampshire',
    abbreviation: 'NH',
    hasMedicalProgram: true,
    applicationUrl: 'https://www.dhhs.nh.gov/programs-services/medicinal-and-therapeutic-cannabis',
    processingTime: '15 business days',
    renewalPeriod: 'Annual',
    renewalCost: '$50',
    minAge: '18 (minors with caregiver)',
    telehealth: true,
    steps: [
      { title: 'Review Qualifying Conditions', description: 'New Hampshire covers cancer, chronic pain, HIV/AIDS, hepatitis C, ALS, PTSD, multiple sclerosis, Crohn\'s disease, epilepsy, and lupus among its qualifying conditions.' },
      { title: 'Obtain a Physician Certification', description: 'Visit a New Hampshire-licensed provider for an evaluation. Telehealth consultations are accepted. The provider will review your records and certify your qualifying condition if appropriate.' },
      { title: 'Apply to the Therapeutic Cannabis Program', description: 'Submit your application to the New Hampshire Department of Health and Human Services Therapeutic Cannabis Program. Include your provider certification, New Hampshire ID, and the $50 registration fee.' },
      { title: 'Receive Your Registry Card', description: 'Processing takes approximately 15 business days. Once approved, your card allows purchases at New Hampshire\'s licensed Alternative Treatment Centers.' }
    ],
    tips: [
      'New Hampshire uses the term "therapeutic cannabis" for its program rather than medical marijuana.',
      'The state offers limited reciprocity for visiting patients from other states.',
      'Cannabis is dispensed from Alternative Treatment Centers rather than traditional dispensaries.',
      'Recreational cannabis remains illegal in New Hampshire, making the medical card essential for legal access.',
      'Telehealth evaluations are accepted for provider certifications.'
    ],
    intro: 'New Hampshire\'s Therapeutic Cannabis Program was established in 2013 and provides the only legal pathway to cannabis access in the state, as recreational cannabis has not been legalized despite ongoing legislative efforts. The program is administered by the New Hampshire Department of Health and Human Services and uses the term "therapeutic cannabis" rather than medical marijuana, reflecting the state\'s pharmaceutical approach to the program. Cannabis is dispensed from licensed Alternative Treatment Centers rather than traditional dispensaries.\n\nBecause recreational cannabis is not available in New Hampshire, the therapeutic cannabis card is essential for any resident seeking legal access to cannabis products. This distinguishes New Hampshire from neighboring states like Massachusetts, Vermont, and Maine, where recreational cannabis is freely available to adults 21 and older. The medical card remains the sole legal option for New Hampshire residents, though small-amount possession has been decriminalized.\n\nNew Hampshire\'s qualifying conditions include cancer, chronic pain, HIV/AIDS, hepatitis C, amyotrophic lateral sclerosis, post-traumatic stress disorder, multiple sclerosis, Crohn\'s disease, epilepsy and seizure disorders, lupus, Parkinson\'s disease, and several other conditions. The state also offers limited reciprocity for visiting patients from other states, allowing temporary access to Alternative Treatment Centers with a valid out-of-state medical marijuana card.\n\nThe application process requires a provider certification from a New Hampshire-licensed physician or advanced practice registered nurse. Telehealth evaluations are accepted, adding convenience to the process. After obtaining the certification, patients submit their application with the $50 annual registration fee. Processing takes approximately 15 business days. New Hampshire operates a limited number of Alternative Treatment Centers across the state, so patients should verify the nearest location and its hours before completing the registration process.'
  },
  'new-jersey': {
    slug: 'new-jersey',
    stateName: 'New Jersey',
    abbreviation: 'NJ',
    hasMedicalProgram: true,
    applicationUrl: 'https://njmmp.nj.gov/',
    processingTime: '30 days',
    renewalPeriod: 'Every 2 years',
    renewalCost: '$100',
    minAge: '18 (minors with caregiver)',
    telehealth: true,
    steps: [
      { title: 'Verify Your Qualifying Condition', description: 'New Jersey covers cancer, HIV/AIDS, ALS, multiple sclerosis, PTSD, seizure disorders, chronic pain, anxiety, migraines, and Tourette syndrome. The state also allows physician discretion for other conditions.' },
      { title: 'Register as a Patient', description: 'Create a patient account on the New Jersey Medical Marijuana Program portal before your physician appointment. This registration initiates your application process.' },
      { title: 'Obtain a Physician Certification', description: 'Schedule an evaluation with a registered New Jersey physician. Telehealth evaluations are accepted. The physician will review your condition and submit a certification to the state system.' },
      { title: 'Complete Application and Pay', description: 'Finalize your application in the NJMMP portal after the physician certification is submitted. Pay the $100 registration fee, which covers a two-year card period.' },
      { title: 'Receive Your Card', description: 'Processing takes approximately 30 days. Once approved, your medical marijuana card is valid for two years and allows purchases at any licensed dispensary across New Jersey.' }
    ],
    tips: [
      'New Jersey issues two-year cards, making the effective annual cost $50.',
      'Medical patients are exempt from the 6.625 percent sales tax on cannabis purchases.',
      'Anxiety and migraines are qualifying conditions, making the program more accessible than many states.',
      'Register in the patient portal before your physician appointment to speed up the process.',
      'Telehealth evaluations are widely available throughout New Jersey.'
    ],
    intro: 'New Jersey\'s medical marijuana program was established in 2010 under the Compassionate Use Medical Marijuana Act and has expanded significantly over the years. The program is administered by the New Jersey Cannabis Regulatory Commission, which also oversees the recreational market that launched in April 2022 following voter approval of Public Question 1 in 2020. The medical program offers substantial advantages over recreational purchasing, making registration worthwhile for qualifying patients.\n\nNew Jersey\'s medical card provides meaningful tax savings. Recreational cannabis purchases are subject to the state\'s 6.625 percent sales tax plus potential local taxes of up to 2 percent, while medical marijuana purchases are completely tax-exempt. Over the course of a year, these savings can significantly exceed the registration cost, particularly for patients who purchase regularly. The two-year card period further reduces the effective annual cost to $50.\n\nThe qualifying conditions for New Jersey\'s program are relatively accessible compared to many states. In addition to standard conditions like cancer, HIV/AIDS, ALS, multiple sclerosis, and PTSD, New Jersey includes anxiety, migraines, and chronic pain on its qualifying conditions list. The state has progressively expanded the conditions list and provides physicians some discretion to certify patients with other debilitating conditions that would benefit from medical cannabis.\n\nThe application process begins with creating a patient account on the NJMMP portal, followed by a physician evaluation and certification. Telehealth evaluations are widely available and accepted. After the physician submits the certification, patients complete their application and pay the $100 fee for a two-year card. Processing takes approximately 30 days. New Jersey has a growing number of licensed dispensaries across the state, with many now operating as dual medical-recreational facilities to serve both patient populations.'
  },
  'new-mexico': {
    slug: 'new-mexico',
    stateName: 'New Mexico',
    abbreviation: 'NM',
    hasMedicalProgram: true,
    applicationUrl: 'https://www.nmhealth.org/about/mcp/',
    processingTime: '30 days',
    renewalPeriod: 'Annual (3-year card option)',
    renewalCost: 'Free',
    minAge: '18 (minors with caregiver)',
    telehealth: true,
    steps: [
      { title: 'Review Qualifying Conditions', description: 'New Mexico covers cancer, epilepsy, PTSD, HIV/AIDS, chronic pain, Crohn\'s disease, multiple sclerosis, spinal cord injury, and patients receiving hospice care. The list has been expanded over the years.' },
      { title: 'Get a Provider Certification', description: 'Consult with a New Mexico-licensed healthcare provider. Telehealth evaluations are accepted. The provider will review your medical history and certify your qualifying condition.' },
      { title: 'Apply Online', description: 'Submit your application through the New Mexico Department of Health Medical Cannabis Program portal. Upload your provider certification and New Mexico ID. There is no registration fee.' },
      { title: 'Receive Your Card', description: 'Processing takes approximately 30 days. New Mexico offers card durations of 1 year or 3 years. Medical patients benefit from tax exemptions on cannabis purchases.' }
    ],
    tips: [
      'New Mexico charges no registration fee for medical cannabis patients.',
      'Medical purchases are exempt from the excise tax that applies to recreational sales.',
      'Three-year card options are available, reducing the hassle of annual renewals.',
      'Telehealth evaluations are accepted, and many providers offer affordable consultations.',
      'Medical patients can grow up to 12 plants at home for personal use.'
    ],
    intro: 'New Mexico\'s medical cannabis program was established through the Lynn and Erin Compassionate Use Act in 2007, creating one of the earlier medical marijuana systems in the western United States. The program is administered by the New Mexico Department of Health, Medical Cannabis Program, and has served as the foundation for the state\'s cannabis infrastructure. With recreational legalization through the Cannabis Regulation Act in 2021 and sales beginning in April 2022, the medical program continues to offer distinct advantages for qualifying patients.\n\nOne of New Mexico\'s most patient-friendly features is that there is no state registration fee for medical cannabis cards. This zero-cost registration, combined with the availability of multi-year card options extending up to three years, makes New Mexico one of the most accessible and affordable medical cannabis programs in the nation. Patients only pay for the physician evaluation, with no ongoing state fees.\n\nThe tax benefit for medical patients is significant. Recreational cannabis purchases in New Mexico are subject to a 12 percent excise tax that is scheduled to increase to 18 percent by 2030, plus applicable local and gross receipts taxes. Medical purchases are exempt from the cannabis excise tax, generating meaningful savings for regular patients. Additionally, medical patients retain the right to cultivate up to 6 mature and 6 immature plants at home for personal medical use.\n\nNew Mexico\'s qualifying conditions include cancer, epilepsy, post-traumatic stress disorder, HIV/AIDS, chronic pain, Crohn\'s disease, multiple sclerosis, spinal cord injury, and patients receiving hospice care. The application process requires a provider certification, which can be obtained through telehealth. After submission, processing takes approximately 30 days. New Mexico\'s cannabis market has grown rapidly since recreational legalization, providing patients with an extensive network of dispensaries and a wide selection of products.'
  },
  'new-york': {
    slug: 'new-york',
    stateName: 'New York',
    abbreviation: 'NY',
    hasMedicalProgram: true,
    applicationUrl: 'https://cannabis.ny.gov/medical',
    processingTime: '7-10 business days',
    renewalPeriod: 'Annual',
    renewalCost: '$50',
    minAge: '18 (minors with caregiver)',
    telehealth: true,
    steps: [
      { title: 'Verify Your Qualifying Condition', description: 'New York covers cancer, HIV/AIDS, ALS, Parkinson\'s, multiple sclerosis, epilepsy, chronic pain, PTSD, neuropathy, and any condition a physician deems appropriate. New York gives physicians broad discretion in certifying patients.' },
      { title: 'Consult a Registered Practitioner', description: 'Schedule an evaluation with a practitioner registered with the New York Office of Cannabis Management. Telehealth evaluations are widely accepted. The practitioner will review your condition and determine if medical cannabis would be beneficial.' },
      { title: 'Practitioner Issues Certification', description: 'The practitioner will enter your certification into the state health commerce system, including recommended dosing and forms of cannabis.' },
      { title: 'Register with the State', description: 'Complete your patient registration through the New York Office of Cannabis Management portal. Upload your New York ID and pay the $50 registration fee.' },
      { title: 'Receive Your Registration', description: 'Processing takes 7 to 10 business days. Once approved, you receive your medical cannabis certification allowing purchases at registered dispensaries across New York.' }
    ],
    tips: [
      'New York allows physicians to certify any condition they deem appropriate, making it very accessible.',
      'Medical patients benefit from tax savings as the recreational market develops with its tiered tax structure.',
      'Telehealth evaluations are widely available and accepted throughout the state.',
      'Medical patients can cultivate up to 3 mature and 3 immature plants at home.',
      'The program has been significantly modernized since the Office of Cannabis Management took over administration.'
    ],
    intro: 'New York\'s medical cannabis program was established through the Compassionate Care Act in 2014 and has undergone dramatic modernization following the passage of the Marijuana Regulation and Taxation Act (MRTA) in 2021, which legalized recreational cannabis. The program is now administered by the New York Office of Cannabis Management, which oversees both the medical and adult-use markets. The medical program has been significantly expanded and streamlined, making it more accessible and beneficial for qualifying patients.\n\nNew York\'s approach to qualifying conditions is among the most progressive in the nation. While the program maintains a standard list including cancer, HIV/AIDS, ALS, Parkinson\'s disease, multiple sclerosis, epilepsy, chronic pain, PTSD, and neuropathy, it also empowers physicians to certify any condition they determine would benefit from medical cannabis treatment. This physician-discretion model eliminates the barrier of a restrictive conditions list and ensures broad patient access.\n\nThe medical card provides meaningful benefits as New York\'s recreational market continues to develop. Medical purchases are subject to lower tax rates compared to the recreational tax structure, which includes a 9 percent excise tax, 4 percent state sales tax, and up to 4 percent in local taxes. Medical patients also have access to the established network of registered dispensaries, which have been operating longer and often have more consistent supply than newer recreational retailers. Home cultivation of up to 3 mature and 3 immature plants is also permitted for medical patients.\n\nThe registration process is efficient, with telehealth evaluations widely available and a processing time of 7 to 10 business days. After a registered practitioner submits the certification, patients complete their registration online and pay the $50 fee. The certification specifies recommended forms and dosing, providing patients with guidance for their dispensary purchases.'
  },
  'north-dakota': {
    slug: 'north-dakota',
    stateName: 'North Dakota',
    abbreviation: 'ND',
    hasMedicalProgram: true,
    applicationUrl: 'https://www.health.nd.gov/mm',
    processingTime: '30 days',
    renewalPeriod: 'Annual',
    renewalCost: '$50',
    minAge: '19 (minors with caregiver)',
    telehealth: true,
    steps: [
      { title: 'Review Qualifying Conditions', description: 'North Dakota covers cancer, HIV/AIDS, ALS, PTSD, epilepsy, Crohn\'s disease, chronic pain, terminal illness, Tourette syndrome, and fibromyalgia.' },
      { title: 'Obtain a Physician Certification', description: 'Visit a North Dakota-licensed physician for an evaluation. Telehealth appointments are accepted. The physician will certify your qualifying condition and enter the information into the state system.' },
      { title: 'Apply Through the State Portal', description: 'Submit your application through the North Dakota Department of Health medical marijuana portal. Upload your physician certification, North Dakota ID, and pay the $50 annual fee.' },
      { title: 'Receive Your Patient Card', description: 'Processing takes approximately 30 days. Your card allows purchases of up to 2.5 ounces per 30-day period from licensed dispensaries.' }
    ],
    tips: [
      'North Dakota accepts out-of-state medical cards for up to 30 days, a valuable reciprocity provision.',
      'The minimum age is 19, matching North Dakota\'s age of majority.',
      'Recreational cannabis is not legal in North Dakota, making the medical card essential.',
      'Telehealth evaluations are accepted for physician certifications.'
    ],
    intro: 'North Dakota\'s medical cannabis program was established through the North Dakota Compassionate Care Act, approved by voters in November 2016 with 64 percent support. The program is administered by the North Dakota Department of Health, Division of Medical Marijuana, and provides the only legal pathway to cannabis access in the state, as a recreational legalization measure was defeated in 2018. The program has grown steadily and now serves thousands of registered patients through a network of licensed dispensaries.\n\nNorth Dakota\'s program is notable for its reciprocity provision, which accepts valid out-of-state medical marijuana cards for up to 30 days. This means visiting patients from other states can purchase medical cannabis from North Dakota dispensaries using their home state\'s card, subject to North Dakota\'s purchase limits and regulations. This reciprocity is valuable for patients traveling to or through the state.\n\nThe qualifying conditions include cancer, HIV/AIDS, amyotrophic lateral sclerosis, post-traumatic stress disorder, epilepsy and seizure disorders, Crohn\'s disease, chronic pain, terminal illness, Tourette syndrome, and fibromyalgia. The conditions list has been expanded since the program\'s inception to serve a broader patient population. Patients can purchase up to 2.5 ounces per 30-day period from licensed dispensaries.\n\nThe registration process requires a physician certification from a North Dakota-licensed doctor, which can be obtained through telehealth. The minimum age for patients is 19, consistent with North Dakota\'s legal age of majority, though minors can participate through a designated caregiver program. After certification, patients apply through the state portal and pay the $50 annual fee. Processing takes approximately 30 days. Home cultivation is not permitted under the North Dakota program.'
  },
  ohio: {
    slug: 'ohio',
    stateName: 'Ohio',
    abbreviation: 'OH',
    hasMedicalProgram: true,
    applicationUrl: 'https://www.medicalmarijuana.ohio.gov/',
    processingTime: '7-10 business days',
    renewalPeriod: 'Annual',
    renewalCost: '$50',
    minAge: '18 (minors with caregiver)',
    telehealth: true,
    steps: [
      { title: 'Confirm Your Qualifying Condition', description: 'Ohio recognizes cancer, HIV/AIDS, PTSD, epilepsy, chronic pain, fibromyalgia, Crohn\'s disease, multiple sclerosis, Parkinson\'s, and sickle cell anemia among many other conditions.' },
      { title: 'Visit a Certified Physician', description: 'Schedule an appointment with an Ohio-licensed physician who is Certificate to Recommend (CTR) certified. Telehealth evaluations are accepted. The physician will evaluate your condition and issue a recommendation.' },
      { title: 'Register with the State Board of Pharmacy', description: 'Create a patient account on the Ohio Board of Pharmacy\'s medical marijuana registry. Your physician\'s recommendation will be linked to your account.' },
      { title: 'Pay the $50 Registration Fee', description: 'Submit the $50 annual registration fee through the online portal.' },
      { title: 'Receive Your Card', description: 'Ohio processes applications within 7 to 10 business days. Once approved, you can purchase from licensed dispensaries across the state. Medical patients benefit from tax savings compared to the recreational market.' }
    ],
    tips: [
      'Ohio recently legalized recreational cannabis, but medical patients save significantly on the 10 percent excise tax.',
      'Ohio has an extensive list of qualifying conditions including fibromyalgia and chronic pain.',
      'Medical patients can grow up to 6 plants at home.',
      'Processing is efficient at 7 to 10 business days.',
      'Telehealth evaluations are widely accepted.'
    ],
    intro: 'Ohio\'s medical marijuana program was established through House Bill 523 in 2016 and began serving patients in 2019 after a regulatory development period. The program is jointly administered by the Ohio Board of Pharmacy, which manages the patient registry and dispensary operations, and the Ohio Department of Commerce, which oversees cultivation and processing licenses. With recreational cannabis legalized through Issue 2 in November 2023 and sales beginning in 2024, the medical program continues to provide valuable benefits for qualifying patients.\n\nThe tax advantage for medical cardholders in Ohio is straightforward and significant. Recreational cannabis purchases are subject to a 10 percent excise tax on top of standard state and local sales taxes, while medical purchases are exempt from the excise tax. This creates immediate savings for patients who purchase regularly, making the $50 annual registration fee a worthwhile investment.\n\nOhio\'s qualifying conditions list is one of the more extensive in the country, covering cancer, HIV/AIDS, post-traumatic stress disorder, epilepsy and seizure disorders, chronic pain, fibromyalgia, Crohn\'s disease, multiple sclerosis, Parkinson\'s disease, sickle cell anemia, Tourette syndrome, traumatic brain injury, hepatitis C, inflammatory bowel disease, and several other conditions. Medical patients are also permitted to grow up to 6 plants per person at home.\n\nThe registration process begins with an evaluation by a physician who holds a Certificate to Recommend. Telehealth evaluations are widely accepted, making the process accessible across the state. After the physician submits the recommendation, patients register through the Ohio Board of Pharmacy portal and pay the $50 fee. Processing typically takes 7 to 10 business days, and approved patients can purchase from any licensed dispensary in the state.'
  },
  oklahoma: {
    slug: 'oklahoma',
    stateName: 'Oklahoma',
    abbreviation: 'OK',
    hasMedicalProgram: true,
    applicationUrl: 'https://omma.ok.gov/',
    processingTime: '14 business days',
    renewalPeriod: 'Every 2 years',
    renewalCost: '$100 ($20 for veterans/disabled)',
    minAge: '18 (minors with caregiver)',
    telehealth: true,
    steps: [
      { title: 'Get a Physician Recommendation', description: 'Oklahoma has no qualifying conditions list — any condition recommended by a physician qualifies. Schedule an evaluation with any Oklahoma-licensed physician. Telehealth evaluations are accepted. The physician will provide a signed recommendation form.' },
      { title: 'Apply Through OMMA', description: 'Submit your application through the Oklahoma Medical Marijuana Authority online portal. Upload your physician recommendation, Oklahoma ID, a passport-style photo, and proof of Oklahoma residency.' },
      { title: 'Pay the Registration Fee', description: 'Pay the $100 registration fee, which covers a two-year card. Veterans, those on disability, and SSI recipients qualify for a reduced fee of $20.' },
      { title: 'Receive Your Patient License', description: 'Processing takes approximately 14 business days. Your patient license allows purchases at any licensed dispensary in Oklahoma and permits home cultivation of up to 6 mature plants.' }
    ],
    tips: [
      'Oklahoma has no qualifying conditions list — any physician-recommended condition qualifies, making it the most accessible program in the nation.',
      'Veterans and disability recipients pay only $20 for a two-year card.',
      'Oklahoma patients can grow 6 mature and 6 seedling plants at home.',
      'Out-of-state patients can obtain temporary 30-day licenses for $100.',
      'Oklahoma has one of the largest numbers of dispensaries per capita in the country.'
    ],
    intro: 'Oklahoma\'s medical marijuana program, established through State Question 788 in 2018, is widely regarded as the most accessible and least restrictive medical cannabis program in the United States. The program is administered by the Oklahoma Medical Marijuana Authority (OMMA) and has grown explosively since its inception, with over 380,000 licensed patients and thousands of licensed businesses. What sets Oklahoma apart is the complete absence of a qualifying conditions list — any condition recommended by a licensed physician qualifies for a medical marijuana card.\n\nThis open-ended physician-discretion model means that Oklahoma patients do not need to navigate a restrictive list of approved conditions. If a doctor determines that medical cannabis would be beneficial for a patient\'s condition, that recommendation is sufficient for card approval. This approach has resulted in one of the highest per-capita medical marijuana patient rates in the nation and has made Oklahoma a model for accessible medical cannabis programs.\n\nOklahoma also stands out for its generous cultivation rights, allowing patients to grow up to 6 mature plants, 6 seedling plants, and possess up to 3 ounces on their person and 8 ounces at home. The state has also developed the largest dispensary market per capita in the country, providing patients with extensive choice and competitive pricing. A recreational legalization ballot measure (SQ 820) failed in March 2023, meaning the medical card remains the only legal pathway to cannabis in Oklahoma.\n\nThe application process is straightforward and affordable. After obtaining a physician recommendation through an in-person or telehealth evaluation, patients apply through the OMMA portal and pay the $100 fee for a two-year card. Veterans, individuals on disability, and SSI recipients qualify for a significantly reduced fee of just $20. Processing takes approximately 14 business days. Oklahoma also offers temporary 30-day licenses for out-of-state patients at $100, providing reciprocity for visiting patients. The combination of open qualification, affordable fees, generous limits, and robust market competition makes Oklahoma\'s program uniquely accessible.'
  },
  oregon: {
    slug: 'oregon',
    stateName: 'Oregon',
    abbreviation: 'OR',
    hasMedicalProgram: true,
    applicationUrl: 'https://www.oregon.gov/oha/ph/diseasesconditions/chronicdisease/medicalmarijuanaprogram/pages/index.aspx',
    processingTime: '30 days',
    renewalPeriod: 'Annual',
    renewalCost: '$200 ($60 SNAP)',
    minAge: '18 (minors with caregiver)',
    telehealth: true,
    steps: [
      { title: 'Review Qualifying Conditions', description: 'Oregon covers cancer, glaucoma, HIV/AIDS, PTSD, epilepsy, chronic pain, cachexia, severe nausea, and Alzheimer\'s disease.' },
      { title: 'Obtain a Physician Certification', description: 'Visit an Oregon-licensed physician for an evaluation. Telehealth is accepted. The physician must document your qualifying condition and provide the attending physician statement.' },
      { title: 'Apply to the OMMP', description: 'Submit your application to the Oregon Medical Marijuana Program through the Oregon Health Authority. Include your physician statement, Oregon ID, and the $200 registration fee ($60 for SNAP recipients).' },
      { title: 'Receive Your Card', description: 'Processing takes approximately 30 days. Your OMMP card allows you to purchase medical cannabis tax-free and grow plants at home.' }
    ],
    tips: [
      'Medical purchases in Oregon are tax-free, while recreational purchases face a 17 percent state tax plus local taxes.',
      'SNAP recipients pay only $60 instead of the standard $200 fee.',
      'Medical patients can grow up to 4 plants per household.',
      'Oregon has one of the most mature cannabis markets in the nation with competitive pricing.'
    ],
    intro: 'Oregon\'s medical marijuana program is one of the longest-running in the United States, established through the Oregon Medical Marijuana Act in 1998. The program is administered by the Oregon Health Authority through the Oregon Medical Marijuana Program (OMMP) and has served as a model for other states developing their medical cannabis frameworks. With recreational legalization through Measure 91 in 2014, the medical program remains valuable primarily due to its significant tax exemption.\n\nThe tax benefit for Oregon medical cardholders is the program\'s most compelling advantage. Recreational cannabis purchases are subject to a 17 percent state tax plus up to 3 percent in local option taxes, while medical marijuana purchases by OMMP cardholders are completely tax-exempt. For regular consumers, this tax exemption can save hundreds or even thousands of dollars annually, making the registration fee a sound investment despite being one of the higher state fees at $200.\n\nOregon\'s qualifying conditions include cancer, glaucoma, HIV/AIDS, post-traumatic stress disorder, epilepsy and seizure disorders, chronic pain resulting in substantial functional limitations, cachexia, severe nausea, and Alzheimer\'s disease. The conditions must be documented by an attending physician through a comprehensive evaluation.\n\nThe application process requires a physician statement from a licensed Oregon doctor, obtainable through telehealth. Patients submit their application to the OMMP with the $200 fee, though SNAP benefit recipients qualify for a reduced fee of $60. Processing takes approximately 30 days. Medical patients can also designate a grower to cultivate plants on their behalf, providing an alternative access pathway beyond dispensary purchases.'
  },
  pennsylvania: {
    slug: 'pennsylvania',
    stateName: 'Pennsylvania',
    abbreviation: 'PA',
    hasMedicalProgram: true,
    applicationUrl: 'https://www.health.pa.gov/topics/programs/Medical%20Marijuana/Pages/Medical%20Marijuana.aspx',
    processingTime: '1-3 weeks',
    renewalPeriod: 'Annual',
    renewalCost: '$50',
    minAge: '18 (minors with caregiver)',
    telehealth: true,
    steps: [
      { title: 'Verify Your Qualifying Condition', description: 'Pennsylvania covers over 20 conditions including cancer, epilepsy, PTSD, chronic pain, HIV/AIDS, ALS, Parkinson\'s, multiple sclerosis, Crohn\'s disease, anxiety, opioid use disorder, and autism. The state has one of the broader conditions lists.' },
      { title: 'Register with the DOH', description: 'Create a patient account on the Pennsylvania Department of Health medical marijuana registry. This must be done before your physician appointment.' },
      { title: 'See an Approved Practitioner', description: 'Schedule an evaluation with a Pennsylvania-registered practitioner. Telehealth evaluations are accepted. The practitioner will certify your condition and enter it into the state system.' },
      { title: 'Pay the $50 Registration Fee', description: 'Complete your registration online and pay the $50 annual state fee.' },
      { title: 'Receive Your Medical Marijuana ID Card', description: 'Processing takes 1 to 3 weeks. Once approved, you receive your ID card allowing purchases at licensed dispensaries across Pennsylvania.' }
    ],
    tips: [
      'Pennsylvania includes anxiety and opioid use disorder as qualifying conditions, making the program accessible.',
      'The medical card is the only legal pathway to cannabis in Pennsylvania as recreational use is not yet legal.',
      'Dry leaf flower is available for vaporization, though smoking is not permitted.',
      'Over 400,000 patients are registered in the program.',
      'Register on the state portal before your physician appointment to streamline the process.'
    ],
    intro: 'Pennsylvania\'s medical marijuana program was established through Act 16 in 2016 and has grown into one of the largest medical cannabis programs on the East Coast, serving over 400,000 registered patients. The program is administered by the Pennsylvania Department of Health and operates through a network of licensed grower/processors and dispensaries. Recreational cannabis remains illegal in Pennsylvania, though legislative efforts continue, making the medical card the only legal pathway to cannabis access in the state.\n\nPennsylvania\'s qualifying conditions list is among the most extensive in the nation, covering over 20 conditions. These include cancer, epilepsy, PTSD, chronic pain, HIV/AIDS, amyotrophic lateral sclerosis, Parkinson\'s disease, multiple sclerosis, Crohn\'s disease, anxiety disorders, opioid use disorder, autism spectrum disorder, fibromyalgia, inflammatory bowel disease, neuropathies, and several other serious conditions. The inclusion of anxiety and opioid use disorder makes the program more accessible than many states.\n\nPennsylvania\'s program has evolved since its launch, with the addition of dry leaf cannabis for vaporization being a significant expansion from the original forms that were limited to pills, oils, tinctures, and topicals. However, smoking cannabis flower remains prohibited under the program — patients must vaporize dry leaf products rather than smoking them. The available product range now includes dry leaf, concentrates, tinctures, capsules, topicals, and other formulations.\n\nThe application process begins with creating an account on the state registry portal, followed by an evaluation with a registered practitioner. Telehealth evaluations are widely accepted. After the practitioner submits the certification, patients pay the $50 annual fee and receive their ID card within 1 to 3 weeks. Pennsylvania\'s program benefits from a well-established dispensary network with locations across the state, competitive pricing, and a diverse product selection.'
  },
  'rhode-island': {
    slug: 'rhode-island',
    stateName: 'Rhode Island',
    abbreviation: 'RI',
    hasMedicalProgram: true,
    applicationUrl: 'https://dbr.ri.gov/office-cannabis-regulation',
    processingTime: '30 days',
    renewalPeriod: 'Annual',
    renewalCost: '$50',
    minAge: '18 (minors with caregiver)',
    telehealth: true,
    steps: [
      { title: 'Confirm Qualifying Condition', description: 'Rhode Island covers cancer, HIV/AIDS, hepatitis C, PTSD, chronic pain, severe nausea, seizures, cachexia, and Crohn\'s disease.' },
      { title: 'Obtain a Practitioner Certification', description: 'Consult a Rhode Island-licensed practitioner for an evaluation. Telehealth is accepted. The practitioner will review your records and provide a written certification.' },
      { title: 'Submit Your Application', description: 'Apply through the Rhode Island Office of Cannabis Regulation. Include your practitioner certification, Rhode Island ID, and the $50 registration fee.' },
      { title: 'Receive Your Card', description: 'Processing takes approximately 30 days. Your card authorizes purchases at licensed compassion centers and retail dispensaries.' }
    ],
    tips: [
      'Medical patients in Rhode Island are exempt from the excise and sales taxes that apply to recreational purchases.',
      'The combined recreational tax rate exceeds 20 percent, making the medical card valuable for regular consumers.',
      'Medical patients can grow up to 6 plants at home.',
      'Telehealth evaluations are accepted for certifications.'
    ],
    intro: 'Rhode Island\'s medical marijuana program was established through the Edward O. Hawkins and Thomas C. Slater Medical Marijuana Act in 2006, making it one of the earlier medical cannabis states in New England. The program is now administered by the Rhode Island Office of Cannabis Regulation, which also oversees the recreational market that launched in December 2022. The medical program offers compelling tax advantages that make registration worthwhile for qualifying patients.\n\nThe tax savings for medical patients in Rhode Island are significant. Recreational cannabis purchases are subject to a 10 percent excise tax, the 7 percent state sales tax, and up to 4 percent in local option taxes, resulting in a combined rate that can exceed 20 percent. Medical cannabis purchases are exempt from these taxes, creating substantial annual savings for regular consumers.\n\nRhode Island\'s qualifying conditions include cancer, HIV/AIDS, hepatitis C, post-traumatic stress disorder, chronic pain associated with a debilitating condition, severe nausea, seizures, cachexia, and Crohn\'s disease. The state has expanded its conditions list over the years to address additional patient needs.\n\nThe application process requires a practitioner certification from a Rhode Island-licensed provider, obtainable through telehealth. After certification, patients submit their application with the $50 fee and receive their card within approximately 30 days. Medical patients also retain the right to cultivate up to 6 plants at home for personal medical use, providing an additional pathway to affordable access alongside dispensary purchases.'
  },
  'south-dakota': {
    slug: 'south-dakota',
    stateName: 'South Dakota',
    abbreviation: 'SD',
    hasMedicalProgram: true,
    applicationUrl: 'https://doh.sd.gov/medical-cannabis/',
    processingTime: '30 days',
    renewalPeriod: 'Annual',
    renewalCost: '$50',
    minAge: '18 (minors with caregiver)',
    telehealth: false,
    steps: [
      { title: 'Review Qualifying Conditions', description: 'South Dakota covers cancer, epilepsy, HIV/AIDS, PTSD, ALS, Crohn\'s disease, chronic pain, multiple sclerosis, cachexia, and severe nausea.' },
      { title: 'Visit a Licensed Physician', description: 'Schedule an in-person appointment with a South Dakota-licensed physician. The physician must conduct a physical examination and review your medical history to determine eligibility.' },
      { title: 'Apply Through the DOH Portal', description: 'Submit your application through the South Dakota Department of Health medical cannabis portal. Upload your physician certification, South Dakota ID, and pay the $50 registration fee.' },
      { title: 'Receive Your Registry Card', description: 'Processing takes approximately 30 days. Your card allows purchases from licensed dispensaries. Patients living 50 or more miles from a dispensary may grow up to 3 plants at home.' }
    ],
    tips: [
      'Recreational cannabis is not legal in South Dakota — the medical card is the only legal pathway.',
      'Patients more than 50 miles from a dispensary can grow up to 3 plants at home.',
      'South Dakota accepts out-of-state medical cards for purchases.',
      'In-person physician evaluations are required; telehealth is not accepted.'
    ],
    intro: 'South Dakota\'s medical cannabis program was established through Initiated Measure 26, approved by voters in November 2020 with 70 percent support. The program is administered by the South Dakota Department of Health and provides the only legal pathway to cannabis access in the state. Notably, South Dakota voters also approved Amendment A to legalize recreational cannabis in the same election, but the amendment was challenged and struck down by the state Supreme Court in 2021, leaving only the medical program in effect.\n\nThe South Dakota medical cannabis program allows qualifying patients to purchase up to 3 ounces per transaction from licensed dispensaries. The program also includes a unique provision for patients who live 50 or more miles from a licensed dispensary, permitting them to cultivate up to 3 cannabis plants at home for personal medical use. This accommodation addresses the access challenges in South Dakota\'s rural areas.\n\nSouth Dakota\'s qualifying conditions include cancer, epilepsy and seizure disorders, HIV/AIDS, post-traumatic stress disorder, amyotrophic lateral sclerosis, Crohn\'s disease, chronic debilitating pain, multiple sclerosis, cachexia or wasting syndrome, and severe nausea. The program serves as the exclusive legal cannabis access pathway in the state.\n\nThe application process requires an in-person physician evaluation — telehealth certifications are not accepted. After the physician certifies the qualifying condition, patients apply through the state portal and pay the $50 annual registration fee. Processing takes approximately 30 days. South Dakota offers reciprocity for out-of-state medical marijuana patients, accepting valid cards from other states for dispensary purchases.'
  },
  utah: {
    slug: 'utah',
    stateName: 'Utah',
    abbreviation: 'UT',
    hasMedicalProgram: true,
    applicationUrl: 'https://medicalcannabis.utah.gov/',
    processingTime: '15 business days',
    renewalPeriod: 'Annual (6-month option available)',
    renewalCost: '$15',
    minAge: '18 (minors with caregiver)',
    telehealth: true,
    steps: [
      { title: 'Review Qualifying Conditions', description: 'Utah covers cancer, HIV/AIDS, ALS, epilepsy, PTSD, Crohn\'s disease, chronic pain, Alzheimer\'s, terminal illness, and rare conditions. Physicians may also recommend cannabis for other conditions on a case-by-case basis.' },
      { title: 'Consult a Qualified Medical Provider', description: 'Schedule an evaluation with a Utah-licensed medical provider registered with the state program. Telehealth evaluations are accepted. The provider will assess your condition and enter the recommendation into the Electronic Verification System.' },
      { title: 'Register with the State', description: 'Complete your registration through the Utah Department of Health and Human Services medical cannabis portal. Upload your Utah ID and pay the $15 registration fee.' },
      { title: 'Receive Your Patient Card', description: 'Processing takes approximately 15 business days. Your card allows purchases at licensed medical cannabis pharmacies. Utah also offers temporary visitor cards valid for 21 days.' }
    ],
    tips: [
      'Utah has the lowest registration fee in the nation at just $15.',
      'Cannabis is dispensed through pharmacies rather than dispensaries in Utah.',
      'Utah does not permit smokable flower — only tablets, capsules, oils, topicals, and gelatinous cubes are available.',
      'Temporary visitor cards are available for out-of-state patients for 21 days.',
      'Telehealth evaluations are accepted for certifications.'
    ],
    intro: 'Utah\'s medical cannabis program was established through the Utah Medical Cannabis Act in 2018, which was the legislature\'s modification of Proposition 2 (the voter-approved Utah Medical Cannabis Initiative). The program is administered by the Utah Department of Health and Human Services through the Center for Medical Cannabis and reflects the state\'s conservative approach with tighter restrictions on product forms and dispensing methods compared to most state programs.\n\nUtah\'s program is unique in several ways. At just $15, the state registration fee is the lowest in the nation. Cannabis is dispensed through licensed medical cannabis pharmacies rather than traditional dispensaries, emphasizing the pharmaceutical nature of the program. And the available product forms are limited to tablets, capsules, concentrated oils, topical preparations, and gelatinous cubes — smokable cannabis flower is not permitted, and vaporizable forms are restricted.\n\nThe qualifying conditions include cancer, HIV/AIDS, amyotrophic lateral sclerosis, epilepsy and seizure disorders, post-traumatic stress disorder, Crohn\'s disease and ulcerative colitis, chronic pain lasting longer than two weeks, Alzheimer\'s disease, terminal illness with a life expectancy of less than six months, and rare conditions or conditions of a similar nature. Physicians have some discretion to recommend cannabis for conditions not explicitly listed if they believe it would benefit the patient.\n\nThe registration process involves a provider evaluation, which can be conducted via telehealth. After the provider enters the recommendation into the Electronic Verification System, patients complete their registration and pay the $15 fee. Processing takes approximately 15 business days. Utah also accommodates visitors through a temporary patient card program valid for 21 days, allowing out-of-state patients to access cannabis pharmacies while visiting. This reciprocity provision makes Utah more accessible for traveling patients.'
  },
  vermont: {
    slug: 'vermont',
    stateName: 'Vermont',
    abbreviation: 'VT',
    hasMedicalProgram: true,
    applicationUrl: 'https://cannabis.vermont.gov/medical',
    processingTime: '30 days',
    renewalPeriod: 'Annual',
    renewalCost: '$50',
    minAge: '18 (minors with caregiver)',
    telehealth: true,
    steps: [
      { title: 'Confirm Your Qualifying Condition', description: 'Vermont covers cancer, HIV/AIDS, multiple sclerosis, PTSD, chronic pain, Crohn\'s disease, seizures, and Parkinson\'s disease.' },
      { title: 'Get a Healthcare Provider Certification', description: 'Visit a Vermont-licensed healthcare provider. Telehealth is accepted. The provider will evaluate your condition and provide the required certification documentation.' },
      { title: 'Submit Your Application', description: 'Apply through the Vermont Cannabis Control Board medical program portal. Include your provider certification, Vermont ID, and the $50 registration fee.' },
      { title: 'Receive Your Registry Card', description: 'Processing takes approximately 30 days. Your card allows purchases at licensed dispensaries and home cultivation of up to 2 mature plants.' }
    ],
    tips: [
      'Medical patients in Vermont are exempt from the 14 percent excise tax on recreational purchases.',
      'Vermont was the first state to legalize recreational cannabis through its legislature in 2018.',
      'Medical patients can grow 2 mature and 4 immature plants at home.',
      'Telehealth evaluations are accepted for provider certifications.'
    ],
    intro: 'Vermont\'s medical marijuana program was established in 2004 and has evolved alongside the state\'s broader cannabis legalization journey. Vermont made history in 2018 as the first state to legalize recreational cannabis through its legislature rather than a ballot initiative, though it was initially limited to possession and home cultivation only, with commercial sales beginning in 2022. The program is now administered by the Vermont Cannabis Control Board, which oversees both the medical and adult-use markets.\n\nThe primary benefit of Vermont\'s medical card is the tax exemption on cannabis purchases. Recreational cannabis is subject to a 14 percent excise tax in addition to the standard 6 percent state sales tax, resulting in a combined tax rate of 20 percent. Medical purchases are exempt from the excise tax, creating meaningful savings for patients who purchase regularly. This tax differential makes the $50 annual registration fee a worthwhile investment for most medical consumers.\n\nVermont\'s qualifying conditions include cancer, HIV/AIDS, multiple sclerosis, post-traumatic stress disorder, chronic pain, Crohn\'s disease, seizure disorders including epilepsy, and Parkinson\'s disease. The conditions list is focused on serious medical conditions that have demonstrated responsiveness to cannabis-based treatments.\n\nThe application process requires a healthcare provider certification, obtainable through telehealth. After certification, patients submit their application through the Cannabis Control Board portal with the $50 fee. Processing takes approximately 30 days. Medical patients can also cultivate up to 2 mature plants and 4 immature plants at their household for personal medical use, providing a cultivation pathway alongside dispensary purchases.'
  },
  virginia: {
    slug: 'virginia',
    stateName: 'Virginia',
    abbreviation: 'VA',
    hasMedicalProgram: true,
    applicationUrl: 'https://www.cca.virginia.gov/',
    processingTime: '30 days',
    renewalPeriod: 'Annual',
    renewalCost: '$150-$250 (physician fee)',
    minAge: '18 (minors with caregiver)',
    telehealth: true,
    steps: [
      { title: 'Determine Eligibility', description: 'Virginia has no restrictive qualifying conditions list — any condition where a physician determines cannabis would benefit the patient qualifies. This includes chronic pain, anxiety, PTSD, insomnia, and virtually any medical condition.' },
      { title: 'Consult a Registered Practitioner', description: 'Schedule an evaluation with a Virginia-licensed practitioner registered with the Board of Pharmacy. Telehealth evaluations are widely accepted. The practitioner will issue a written certification if appropriate.' },
      { title: 'Register with the Board of Pharmacy', description: 'After receiving your practitioner certification, register through the Virginia Board of Pharmacy patient portal. There is no state registration fee — the only cost is the practitioner evaluation.' },
      { title: 'Receive Your Certification and Purchase', description: 'Once registered, you can visit licensed cannabis dispensaries across Virginia. The Virginia Cannabis Control Authority oversees the expanding retail market.' }
    ],
    tips: [
      'Virginia has no qualifying conditions list — any condition recommended by a physician qualifies.',
      'There is no state registration fee; the only cost is the physician evaluation.',
      'Telehealth evaluations are widely available and accepted.',
      'Medical patients benefit from tax savings compared to the 21 percent recreational excise tax.',
      'Virginia\'s recreational market launched in 2024, but medical benefits remain compelling.'
    ],
    intro: 'Virginia\'s medical cannabis program was established in 2018 and has expanded significantly, operating alongside the recreational market that launched retail sales in 2024. The program is overseen by the Virginia Cannabis Control Authority and the Board of Pharmacy, which manages patient registrations. Virginia\'s medical program stands out for its accessibility, with no restrictive qualifying conditions list and no state registration fee, making it one of the easiest programs to join in the country.\n\nVirginia\'s physician-discretion model means that any condition where a practitioner determines cannabis would benefit the patient qualifies for medical certification. This includes common conditions such as chronic pain, anxiety, insomnia, PTSD, depression, and essentially any medical condition. There is no state-mandated list of approved conditions to navigate, removing a significant barrier that exists in many other state programs.\n\nThe financial benefits of a medical card in Virginia are notable. Recreational cannabis purchases are subject to a 21 percent excise tax, while medical purchases are taxed at lower rates. Given this significant tax differential, the cost of the physician evaluation is quickly recouped through savings on medical cannabis purchases. Medical patients can also grow up to 4 plants per household for personal use.\n\nThe registration process is streamlined. After a telehealth or in-person evaluation with a registered practitioner, the certification is entered into the state system and the patient registers through the Board of Pharmacy portal. There is no state fee — only the practitioner evaluation cost, which typically ranges from $150 to $250 depending on the provider. Processing takes approximately 30 days, after which patients can purchase from licensed dispensaries operated by the Virginia Cannabis Control Authority\'s network of permitted retailers.'
  },
  washington: {
    slug: 'washington',
    stateName: 'Washington',
    abbreviation: 'WA',
    hasMedicalProgram: true,
    applicationUrl: 'https://doh.wa.gov/you-and-your-family/cannabis/medical-cannabis',
    processingTime: 'Immediate (dispensary authorization)',
    renewalPeriod: 'Annual',
    renewalCost: 'Varies (database fee)',
    minAge: '18 (minors with caregiver)',
    telehealth: true,
    steps: [
      { title: 'Verify Your Qualifying Condition', description: 'Washington covers cancer, HIV/AIDS, multiple sclerosis, epilepsy, Crohn\'s disease, hepatitis C, chronic pain, PTSD, glaucoma, and intractable pain. Medical records documenting your condition are required.' },
      { title: 'Get a Healthcare Provider Authorization', description: 'Consult a Washington-licensed healthcare provider. Telehealth evaluations are accepted. The provider will issue an authorization that allows you to purchase medical cannabis.' },
      { title: 'Optional: Enter the Medical Cannabis Database', description: 'For additional benefits, you can register in the Washington Medical Cannabis Patient Database at a participating dispensary. This provides a recognition card that grants tax exemptions and higher purchase limits. There is a database entry fee.' },
      { title: 'Purchase Medical Cannabis', description: 'With just a provider authorization, you can purchase from licensed cannabis retailers. Registering in the database provides additional tax exemptions and higher possession limits, plus authorization to grow up to 15 plants.' }
    ],
    tips: [
      'Washington has a two-tier system: a provider authorization allows purchases, while database registration provides tax exemptions and higher limits.',
      'The recreational tax in Washington is 37 percent, making the medical tax exemption extremely valuable.',
      'Database-registered patients can grow up to 15 plants at home.',
      'Provider authorizations are valid immediately; no waiting period for purchases.',
      'Telehealth evaluations are accepted for provider authorizations.'
    ],
    intro: 'Washington state was one of the first two states to legalize recreational cannabis in 2012 through Initiative 502, and its medical cannabis program has been integrated into the broader regulatory framework administered by the Washington State Liquor and Cannabis Board. The medical program operates alongside the recreational market through a system of provider authorizations and an optional patient database that provides additional benefits.\n\nWashington\'s medical cannabis system is structured in two tiers. The first tier requires only a healthcare provider authorization, which allows the patient to purchase cannabis from any licensed retailer. The second tier involves registering in the Medical Cannabis Patient Database, which provides significant additional benefits including exemption from the state\'s 37 percent excise tax on cannabis, higher possession and purchase limits, and the ability to grow up to 15 plants at home with provider authorization. Given Washington\'s exceptionally high 37 percent recreational tax rate, the tax exemption alone represents enormous savings for regular consumers.\n\nWashington\'s qualifying conditions include cancer, HIV/AIDS, multiple sclerosis, epilepsy and seizure disorders, Crohn\'s disease, hepatitis C, chronic renal failure, intractable pain, glaucoma, post-traumatic stress disorder, and traumatic brain injury among others. The state requires a bona fide healthcare provider-patient relationship for authorization.\n\nThe process begins with a healthcare provider evaluation, which can be conducted via telehealth. The provider authorization is effective immediately, allowing same-day dispensary purchases. For patients who wish to receive the full range of medical benefits, database registration is completed at a participating dispensary and provides the recognition card. This two-tier approach gives patients flexibility in choosing the level of program participation that best suits their needs.'
  },
  'west-virginia': {
    slug: 'west-virginia',
    stateName: 'West Virginia',
    abbreviation: 'WV',
    hasMedicalProgram: true,
    applicationUrl: 'https://dhhr.wv.gov/bph/Pages/Medical-Cannabis.aspx',
    processingTime: '30 days',
    renewalPeriod: 'Annual',
    renewalCost: '$50',
    minAge: '18 (minors with caregiver)',
    telehealth: true,
    steps: [
      { title: 'Review Qualifying Conditions', description: 'West Virginia covers cancer, HIV/AIDS, ALS, PTSD, Crohn\'s disease, epilepsy, chronic pain, multiple sclerosis, Parkinson\'s, Huntington\'s disease, and terminal illness.' },
      { title: 'Consult a Certified Physician', description: 'Schedule an evaluation with a West Virginia physician certified by the Bureau for Public Health to recommend medical cannabis. Telehealth evaluations are accepted.' },
      { title: 'Apply Through the State Portal', description: 'Submit your application through the West Virginia medical cannabis patient portal. Upload your physician certification, West Virginia ID, and pay the $50 registration fee.' },
      { title: 'Receive Your Patient Card', description: 'Processing takes approximately 30 days. Your card allows purchases from licensed dispensaries. Note that smokable flower is not permitted — dry leaf vaporization only.' }
    ],
    tips: [
      'West Virginia does not allow smokable flower — only dry leaf for vaporization and other processed forms.',
      'The program launched dispensary sales in 2024 after significant implementation delays.',
      'Recreational cannabis is not legal, making the medical card the only access pathway.',
      'Telehealth evaluations are accepted for physician certifications.',
      'Home cultivation is not permitted under the West Virginia program.'
    ],
    intro: 'West Virginia\'s medical cannabis program was established through the Medical Cannabis Act, signed into law in 2017, though implementation was significantly delayed with dispensary sales not beginning until 2024. The program is administered by the West Virginia Department of Health through the Bureau for Public Health, Office of Medical Cannabis. Recreational cannabis is not legal in West Virginia, making the medical card the sole legal pathway to cannabis access in the state.\n\nThe West Virginia program is notable for its restrictions on product forms. Like a few other conservative medical states, West Virginia does not permit patients to smoke cannabis flower. Instead, dry leaf cannabis is available for vaporization only, and other approved forms include pills, oils, tinctures, topical preparations, dermal patches, and suppositories. This pharmaceutical-oriented approach reflects the state\'s cautious stance on medical cannabis.\n\nWest Virginia\'s qualifying conditions include cancer, HIV/AIDS, amyotrophic lateral sclerosis, post-traumatic stress disorder, Crohn\'s disease, epilepsy and seizure disorders, chronic pain, multiple sclerosis, Parkinson\'s disease, Huntington\'s disease, intractable seizures, neuropathies, and terminal illness. The conditions list covers a range of serious medical needs.\n\nThe application process requires a certification from a physician registered with the state\'s medical cannabis program, which can be obtained through telehealth. Patients apply through the state portal and pay the $50 annual registration fee. Processing takes approximately 30 days. The dispensary network in West Virginia is still expanding following the 2024 launch, so patients should verify the nearest dispensary location and product availability before completing their registration. Home cultivation is not permitted under the program.'
  },
  'washington-dc': {
    slug: 'washington-dc',
    stateName: 'Washington, D.C.',
    abbreviation: 'DC',
    hasMedicalProgram: true,
    applicationUrl: 'https://dchealth.dc.gov/marijuana',
    processingTime: '30 days',
    renewalPeriod: 'Every 2 years',
    renewalCost: 'Free',
    minAge: '18 (minors with caregiver)',
    telehealth: true,
    steps: [
      { title: 'Determine Eligibility', description: 'Washington, D.C. has an open qualifying conditions policy — any condition recommended by a physician qualifies. This makes D.C.\'s program one of the most accessible in the nation.' },
      { title: 'Consult a Licensed Physician', description: 'Schedule an evaluation with a D.C.-licensed physician. Telehealth evaluations are accepted. The physician will review your condition and provide a recommendation.' },
      { title: 'Apply Through DC Health', description: 'Submit your application through the DC Health medical cannabis program portal. Upload your physician recommendation, D.C. ID or proof of residency, and a passport-style photo. There is no registration fee.' },
      { title: 'Receive Your Patient Card', description: 'Processing takes approximately 30 days. Your medical cannabis card allows purchases at licensed dispensaries in D.C., which is the only way to legally purchase cannabis since there is no commercial recreational market.' }
    ],
    tips: [
      'D.C. has no qualifying conditions list — any physician-recommended condition qualifies.',
      'Registration is completely free — no state fee.',
      'D.C. has no commercial recreational cannabis sales due to a congressional spending restriction, making the medical card the only way to legally purchase.',
      'D.C. accepts out-of-state medical marijuana cards for purchases.',
      'Telehealth evaluations are accepted for certifications.'
    ],
    intro: 'Washington, D.C.\'s medical marijuana program was established through the Legalization of Marijuana for Medical Treatment Initiative of 1998 (Initiative 59), though congressional interference delayed implementation until 2010. The program is administered by DC Health (the D.C. Department of Health) and provides the only pathway to legally purchase cannabis in the District, as there is no commercial recreational market despite the legalization of personal possession and home cultivation under Initiative 71 in 2014.\n\nThe absence of commercial recreational cannabis sales in D.C. makes the medical card particularly important. While Initiative 71 allows adults 21 and older to possess up to 2 ounces and grow up to 6 plants at home, it does not authorize commercial sales. A congressional spending rider has blocked D.C. from establishing a taxed and regulated recreational retail system, creating an unusual situation where possession is legal but purchasing from a store requires a medical card. This has led to a "gifting economy" that operates in a legal gray area.\n\nD.C.\'s medical program is notable for its accessibility. There is no restrictive qualifying conditions list — any condition recommended by a physician qualifies for medical cannabis registration. Additionally, there is no state registration fee, making D.C. one of only a few jurisdictions where medical cannabis registration costs patients nothing beyond the physician evaluation. D.C. also accepts valid out-of-state medical marijuana cards for dispensary purchases.\n\nThe application process requires a physician recommendation, obtainable through telehealth. Patients submit their application through the DC Health portal at no cost and receive their card within approximately 30 days. The card is valid for two years, further reducing the administrative burden. D.C.\'s licensed dispensaries offer a range of products including flower, edibles, concentrates, tinctures, and topicals, providing comprehensive access for registered patients.'
  },
}

// ==================== HELPER FUNCTIONS ====================

export function getMedicalCardGuide(slug: string): MedicalCardGuide | undefined {
  return MEDICAL_CARD_GUIDES[slug]
}

export function getAllMedicalCardGuideSlugs(): string[] {
  return Object.keys(MEDICAL_CARD_GUIDES)
}

export function getMedicalStatesCount(): number {
  return Object.keys(MEDICAL_CARD_GUIDES).length
}
