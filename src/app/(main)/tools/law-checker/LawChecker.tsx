'use client'

import { useState } from 'react'
import Link from 'next/link'

type LegalStatus = 'legal' | 'medical' | 'decriminalized' | 'illegal'

interface StateInfo {
  name: string
  slug: string
  status: LegalStatus
  recreational: boolean
  medical: boolean
  possession: string
  homeGrow: string
  notes: string
}

const STATE_DATA: Record<string, StateInfo> = {
  AL: { name: 'Alabama', slug: 'alabama', status: 'medical', recreational: false, medical: true, possession: 'Up to 70 daily doses (varies by form)', homeGrow: 'No', notes: 'Medical program launched in 2023. Limited qualifying conditions. No smokable flower allowed.' },
  AK: { name: 'Alaska', slug: 'alaska', status: 'legal', recreational: true, medical: true, possession: 'Up to 1 oz', homeGrow: 'Yes, up to 6 plants (3 mature)', notes: 'Recreational legal since 2015. Adults 21+ may purchase and possess.' },
  AZ: { name: 'Arizona', slug: 'arizona', status: 'legal', recreational: true, medical: true, possession: 'Up to 1 oz (5g concentrate)', homeGrow: 'Yes, up to 6 plants per person (12 per household)', notes: 'Prop 207 legalized recreational use in 2020. Robust medical program since 2010.' },
  AR: { name: 'Arkansas', slug: 'arkansas', status: 'medical', recreational: false, medical: true, possession: '2.5 oz per 14-day period (medical)', homeGrow: 'No', notes: 'Medical program since 2016. Recreational measure failed in 2022.' },
  CA: { name: 'California', slug: 'california', status: 'legal', recreational: true, medical: true, possession: 'Up to 1 oz (8g concentrate)', homeGrow: 'Yes, up to 6 plants per household', notes: 'First state to legalize medical cannabis (1996). Recreational legal since 2016. Largest cannabis market in the US.' },
  CO: { name: 'Colorado', slug: 'colorado', status: 'legal', recreational: true, medical: true, possession: 'Up to 2 oz', homeGrow: 'Yes, up to 6 plants (3 mature)', notes: 'First state to legalize recreational cannabis (2012). Mature market with extensive dispensary network.' },
  CT: { name: 'Connecticut', slug: 'connecticut', status: 'legal', recreational: true, medical: true, possession: 'Up to 1.5 oz', homeGrow: 'Yes, up to 3 mature and 3 immature plants (starting 2024)', notes: 'Recreational sales began January 2023. Social equity provisions in licensing.' },
  DE: { name: 'Delaware', slug: 'delaware', status: 'legal', recreational: true, medical: true, possession: 'Up to 1 oz', homeGrow: 'No', notes: 'Recreational legalized in 2023 via legislature. No home cultivation allowed.' },
  DC: { name: 'Washington D.C.', slug: 'washington-dc', status: 'legal', recreational: true, medical: true, possession: 'Up to 2 oz', homeGrow: 'Yes, up to 6 plants (3 mature)', notes: 'Initiative 71 legalized possession in 2014. No commercial recreational sales due to congressional interference. Gift economy exists.' },
  FL: { name: 'Florida', slug: 'florida', status: 'medical', recreational: false, medical: true, possession: '2.5 oz per 35-day period (medical)', homeGrow: 'No', notes: 'Large medical program with 800,000+ patients. Recreational amendment narrowly failed in 2024 (57%, needed 60%).' },
  GA: { name: 'Georgia', slug: 'georgia', status: 'decriminalized', recreational: false, medical: false, possession: 'Up to 1 oz (misdemeanor, some cities decriminalized)', homeGrow: 'No', notes: 'Low-THC oil (under 5% THC) allowed for certain medical conditions. Possession of small amounts decriminalized in Atlanta and other cities.' },
  HI: { name: 'Hawaii', slug: 'hawaii', status: 'medical', recreational: false, medical: true, possession: 'Up to 4 oz (medical)', homeGrow: 'Yes, up to 10 plants (medical patients)', notes: 'Medical program since 2000. Recreational legalization efforts ongoing.' },
  ID: { name: 'Idaho', slug: 'idaho', status: 'illegal', recreational: false, medical: false, possession: 'Any amount is illegal (up to 3 oz is misdemeanor)', homeGrow: 'No', notes: 'One of the strictest cannabis states. No medical or recreational program. Possession is a misdemeanor for small amounts.' },
  IL: { name: 'Illinois', slug: 'illinois', status: 'legal', recreational: true, medical: true, possession: 'Up to 30g (residents), 15g (visitors)', homeGrow: 'Medical patients only, up to 5 plants', notes: 'First state to legalize recreational via legislature (2019). Strong social equity program. High tax rates on recreational purchases.' },
  IN: { name: 'Indiana', slug: 'indiana', status: 'illegal', recreational: false, medical: false, possession: 'Any amount is illegal (up to 30g is misdemeanor)', homeGrow: 'No', notes: 'No medical or recreational program. CBD oil with less than 0.3% THC is legal.' },
  IA: { name: 'Iowa', slug: 'iowa', status: 'medical', recreational: false, medical: true, possession: '4.5g of THC per 90-day period (medical)', homeGrow: 'No', notes: 'Very limited medical program. Only 5 dispensaries statewide. Low THC caps.' },
  KS: { name: 'Kansas', slug: 'kansas', status: 'illegal', recreational: false, medical: false, possession: 'Any amount is illegal', homeGrow: 'No', notes: 'No medical or recreational program. Possession of any amount is a misdemeanor for first offense.' },
  KY: { name: 'Kentucky', slug: 'kentucky', status: 'medical', recreational: false, medical: true, possession: 'Medical program rules still being finalized', homeGrow: 'No', notes: 'Medical cannabis signed into law in 2023. Dispensaries expected to open by 2025. Limited qualifying conditions.' },
  LA: { name: 'Louisiana', slug: 'louisiana', status: 'medical', recreational: false, medical: true, possession: 'Up to 2.5 oz per 14-day period (medical)', homeGrow: 'No', notes: 'Medical program expanded in 2022 to include smokable flower. Possession of up to 14g decriminalized.' },
  ME: { name: 'Maine', slug: 'maine', status: 'legal', recreational: true, medical: true, possession: 'Up to 2.5 oz', homeGrow: 'Yes, up to 3 mature and 12 immature plants', notes: 'Recreational legal since 2016. Sales began in 2020. Home cultivation allowed.' },
  MD: { name: 'Maryland', slug: 'maryland', status: 'legal', recreational: true, medical: true, possession: 'Up to 1.5 oz', homeGrow: 'Yes, up to 2 plants per person (4 per household)', notes: 'Recreational legalized by voter referendum in 2022. Sales began July 2023. Strong social equity provisions.' },
  MA: { name: 'Massachusetts', slug: 'massachusetts', status: 'legal', recreational: true, medical: true, possession: 'Up to 1 oz (public), 10 oz (home)', homeGrow: 'Yes, up to 6 plants per person (12 per household)', notes: 'Recreational legal since 2016. Mature market with social equity licensing.' },
  MI: { name: 'Michigan', slug: 'michigan', status: 'legal', recreational: true, medical: true, possession: 'Up to 2.5 oz (public), 10 oz (home)', homeGrow: 'Yes, up to 12 plants', notes: 'Recreational legal since 2018. One of the largest cannabis markets. Competitive pricing.' },
  MN: { name: 'Minnesota', slug: 'minnesota', status: 'legal', recreational: true, medical: true, possession: 'Up to 2 oz (flower), 8g concentrate', homeGrow: 'Yes, up to 8 plants (4 mature)', notes: 'Recreational legalized in 2023. Retail sales expected to begin in 2025. Existing medical program.' },
  MS: { name: 'Mississippi', slug: 'mississippi', status: 'medical', recreational: false, medical: true, possession: 'Up to 3.5 oz per month (medical)', homeGrow: 'No', notes: 'Medical program launched in 2022 after court challenges. Limited dispensary locations.' },
  MO: { name: 'Missouri', slug: 'missouri', status: 'legal', recreational: true, medical: true, possession: 'Up to 3 oz', homeGrow: 'Yes, up to 6 flowering, 6 non-flowering, and 6 seedlings', notes: 'Amendment 3 legalized recreational in 2022. Expungement provisions included. Growing market.' },
  MT: { name: 'Montana', slug: 'montana', status: 'legal', recreational: true, medical: true, possession: 'Up to 1 oz', homeGrow: 'Yes, up to 2 mature and 2 seedlings', notes: 'Recreational legal since 2021. Medical program since 2004.' },
  NE: { name: 'Nebraska', slug: 'nebraska', status: 'decriminalized', recreational: false, medical: false, possession: 'Up to 1 oz (civil infraction, first offense)', homeGrow: 'No', notes: 'Small amounts decriminalized since 1978. Medical initiative passed in 2024 but faces legal challenges. No dispensaries yet.' },
  NV: { name: 'Nevada', slug: 'nevada', status: 'legal', recreational: true, medical: true, possession: 'Up to 1 oz (flower) or 3.5g concentrate', homeGrow: 'Yes, up to 6 plants (if 25+ miles from dispensary)', notes: 'Recreational legal since 2017. Las Vegas tourism drives significant sales. Consumption lounges available.' },
  NH: { name: 'New Hampshire', slug: 'new-hampshire', status: 'decriminalized', recreational: false, medical: true, possession: 'Up to 0.75 oz (decriminalized)', homeGrow: 'No', notes: 'Possession decriminalized. Therapeutic cannabis program for medical patients. Recreational legalization under consideration.' },
  NJ: { name: 'New Jersey', slug: 'new-jersey', status: 'legal', recreational: true, medical: true, possession: 'Up to 1 oz', homeGrow: 'No', notes: 'Recreational legal since 2021. No home cultivation. Social equity licensing emphasis.' },
  NM: { name: 'New Mexico', slug: 'new-mexico', status: 'legal', recreational: true, medical: true, possession: 'Up to 2 oz', homeGrow: 'Yes, up to 6 mature and 6 immature plants', notes: 'Cannabis Regulation Act legalized recreational in 2021. Sales began April 2022.' },
  NY: { name: 'New York', slug: 'new-york', status: 'legal', recreational: true, medical: true, possession: 'Up to 3 oz (flower), 24g concentrate', homeGrow: 'Yes, up to 3 mature and 3 immature plants (when regulations finalized)', notes: 'MRTA legalized recreational in 2021. Retail rollout has been slow due to licensing challenges. Social equity focused.' },
  NC: { name: 'North Carolina', slug: 'north-carolina', status: 'decriminalized', recreational: false, medical: false, possession: 'Up to 0.5 oz (misdemeanor)', homeGrow: 'No', notes: 'Possession of small amounts is a misdemeanor. Medical cannabis legislation pending. Hemp-derived products widely available.' },
  ND: { name: 'North Dakota', slug: 'north-dakota', status: 'medical', recreational: false, medical: true, possession: 'Up to 2.5 oz per 30 days (medical)', homeGrow: 'No', notes: 'Medical program since 2016. Recreational measure failed on ballot twice.' },
  OH: { name: 'Ohio', slug: 'ohio', status: 'legal', recreational: true, medical: true, possession: 'Up to 2.5 oz', homeGrow: 'Yes, up to 6 plants per person (12 per household)', notes: 'Issue 2 legalized recreational in November 2023. Retail sales began 2024. Established medical program.' },
  OK: { name: 'Oklahoma', slug: 'oklahoma', status: 'medical', recreational: false, medical: true, possession: 'Up to 3 oz on person (medical)', homeGrow: 'Yes, up to 6 mature and 6 seedling plants (medical)', notes: 'One of the most open medical programs in the US. Easy to obtain card. Recreational measure failed in 2023.' },
  OR: { name: 'Oregon', slug: 'oregon', status: 'legal', recreational: true, medical: true, possession: 'Up to 1 oz (public), 8 oz (home)', homeGrow: 'Yes, up to 4 plants per household', notes: 'Recreational legal since 2015. Psilocybin also legalized. Oversupply has driven down prices.' },
  PA: { name: 'Pennsylvania', slug: 'pennsylvania', status: 'medical', recreational: false, medical: true, possession: 'Up to 30-day supply (medical)', homeGrow: 'No', notes: 'Large medical program with 400,000+ patients. Recreational legalization actively debated in legislature.' },
  RI: { name: 'Rhode Island', slug: 'rhode-island', status: 'legal', recreational: true, medical: true, possession: 'Up to 1 oz', homeGrow: 'Yes, up to 3 mature and 3 immature plants', notes: 'Recreational legalized in 2022. Sales began December 2022.' },
  SC: { name: 'South Carolina', slug: 'south-carolina', status: 'illegal', recreational: false, medical: false, possession: 'Any amount is illegal (up to 1 oz is misdemeanor)', homeGrow: 'No', notes: 'No medical or recreational program. Limited CBD access. Possession is a misdemeanor for first offense.' },
  SD: { name: 'South Dakota', slug: 'south-dakota', status: 'medical', recreational: false, medical: true, possession: 'Up to 3 oz (medical)', homeGrow: 'Yes, up to 3 plants (medical, if 50+ miles from dispensary)', notes: 'Medical program active. Recreational amendment passed by voters in 2020 but struck down by courts. New initiative possible.' },
  TN: { name: 'Tennessee', slug: 'tennessee', status: 'illegal', recreational: false, medical: false, possession: 'Any amount is illegal (up to 0.5 oz is misdemeanor)', homeGrow: 'No', notes: 'No medical or recreational program. Some cities have decriminalized small amounts locally.' },
  TX: { name: 'Texas', slug: 'texas', status: 'medical', recreational: false, medical: true, possession: 'Low-THC only (up to 1% THC for medical)', homeGrow: 'No', notes: 'Compassionate Use Program is very limited (low-THC oil only). Restrictive qualifying conditions. Possession of regular cannabis remains illegal.' },
  UT: { name: 'Utah', slug: 'utah', status: 'medical', recreational: false, medical: true, possession: 'Up to 113g unprocessed flower (medical)', homeGrow: 'No (only if 100+ miles from dispensary, by petition)', notes: 'Medical cannabis since 2018. State-run dispensary model. Conservative program.' },
  VT: { name: 'Vermont', slug: 'vermont', status: 'legal', recreational: true, medical: true, possession: 'Up to 1 oz', homeGrow: 'Yes, up to 2 mature and 4 immature plants', notes: 'First state to legalize via legislature (2018, possession only). Retail sales began in 2022.' },
  VA: { name: 'Virginia', slug: 'virginia', status: 'legal', recreational: true, medical: true, possession: 'Up to 1 oz', homeGrow: 'Yes, up to 4 plants per household', notes: 'Possession and home cultivation legal since 2021. Retail sales timeline uncertain due to political changes.' },
  WA: { name: 'Washington', slug: 'washington', status: 'legal', recreational: true, medical: true, possession: 'Up to 1 oz', homeGrow: 'Medical patients only, up to 4 plants (6 with authorization)', notes: 'Recreational legal since 2012 (Initiative 502). Mature market with extensive dispensary network. No recreational home grow.' },
  WV: { name: 'West Virginia', slug: 'west-virginia', status: 'medical', recreational: false, medical: true, possession: 'Up to 30-day supply (medical)', homeGrow: 'No', notes: 'Medical program launched in 2021. Limited dispensary availability. Growing patient count.' },
  WI: { name: 'Wisconsin', slug: 'wisconsin', status: 'decriminalized', recreational: false, medical: false, possession: 'Up to 25g (first offense, varies by municipality)', homeGrow: 'No', notes: 'No statewide medical or recreational program. Madison, Milwaukee, and other cities have locally decriminalized. Governor supports legalization.' },
  WY: { name: 'Wyoming', slug: 'wyoming', status: 'illegal', recreational: false, medical: false, possession: 'Up to 3 oz is misdemeanor', homeGrow: 'No', notes: 'No medical or recreational program. Among the strictest states for cannabis. Possession is a misdemeanor.' },
}

const STATUS_CONFIG: Record<LegalStatus, { label: string; badge: string; color: string }> = {
  legal: { label: 'Fully Legal', badge: 'bg-green-100 text-green-800 border-green-200', color: 'text-green-700' },
  medical: { label: 'Medical Only', badge: 'bg-yellow-100 text-yellow-800 border-yellow-200', color: 'text-yellow-700' },
  decriminalized: { label: 'Decriminalized', badge: 'bg-orange-100 text-orange-800 border-orange-200', color: 'text-orange-700' },
  illegal: { label: 'Illegal', badge: 'bg-red-100 text-red-800 border-red-200', color: 'text-red-700' },
}

const STATE_ABBREVIATIONS = Object.keys(STATE_DATA).sort((a, b) => STATE_DATA[a].name.localeCompare(STATE_DATA[b].name))

export default function LawChecker() {
  const [selectedState, setSelectedState] = useState<string>('')

  const stateInfo = selectedState ? STATE_DATA[selectedState] : null
  const statusConfig = stateInfo ? STATUS_CONFIG[stateInfo.status] : null

  return (
    <section className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm border p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Check Your State</h2>
          <p className="text-gray-500 mb-6">Select a state to see its cannabis laws and regulations.</p>

          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full sm:w-96 px-4 py-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white"
          >
            <option value="">-- Select a State --</option>
            {STATE_ABBREVIATIONS.map((abbr) => (
              <option key={abbr} value={abbr}>
                {STATE_DATA[abbr].name}
              </option>
            ))}
          </select>
        </div>

        {stateInfo && statusConfig && (
          <div className="mt-8 bg-white rounded-xl shadow-sm border overflow-hidden">
            {/* State Header */}
            <div className="p-6 md:p-8 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                <h3 className="text-2xl font-bold text-gray-900">{stateInfo.name}</h3>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${statusConfig.badge}`}>
                  {statusConfig.label}
                </span>
              </div>
              <p className="text-gray-600 mt-2">{stateInfo.notes}</p>
            </div>

            {/* Details Grid */}
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Recreational */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">Recreational Use</div>
                  <div className={`text-lg font-semibold ${stateInfo.recreational ? 'text-green-700' : 'text-red-600'}`}>
                    {stateInfo.recreational ? 'Legal' : 'Not Legal'}
                  </div>
                </div>

                {/* Medical */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">Medical Cannabis</div>
                  <div className={`text-lg font-semibold ${stateInfo.medical ? 'text-green-700' : 'text-red-600'}`}>
                    {stateInfo.medical ? 'Available' : 'Not Available'}
                  </div>
                </div>

                {/* Possession Limit */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">Possession Limit</div>
                  <div className="text-lg font-semibold text-gray-900">{stateInfo.possession}</div>
                </div>

                {/* Home Grow */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">Home Cultivation</div>
                  <div className={`text-lg font-semibold ${stateInfo.homeGrow.startsWith('Yes') ? 'text-green-700' : 'text-red-600'}`}>
                    {stateInfo.homeGrow}
                  </div>
                </div>
              </div>

              {/* Links */}
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={`/laws/${stateInfo.slug}`}
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded-lg px-6 py-3 font-medium transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                  </svg>
                  Full {stateInfo.name} Cannabis Law Guide
                </Link>
                <Link
                  href={`/dispensaries/${stateInfo.slug}`}
                  className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg px-6 py-3 font-medium transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
                  </svg>
                  Find Dispensaries
                </Link>
                {stateInfo.medical && (
                  <Link
                    href={`/doctors/${stateInfo.slug}`}
                    className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg px-6 py-3 font-medium transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                    Find Doctors
                  </Link>
                )}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="border-t border-gray-100 p-6 md:p-8 bg-gray-50">
              <p className="text-sm text-gray-500">
                <strong>Note:</strong> Cannabis laws change frequently. This information is for general reference only and was
                last reviewed in early 2026. Always verify current laws with official state resources before making any decisions.
                Municipal laws may differ from state laws.
              </p>
            </div>
          </div>
        )}

        {/* State Count Summary */}
        {!selectedState && (
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm border p-5 text-center">
              <div className="text-3xl font-bold text-green-700">
                {Object.values(STATE_DATA).filter((s) => s.status === 'legal').length}
              </div>
              <div className="text-sm text-gray-500 mt-1">Fully Legal</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border p-5 text-center">
              <div className="text-3xl font-bold text-yellow-600">
                {Object.values(STATE_DATA).filter((s) => s.status === 'medical').length}
              </div>
              <div className="text-sm text-gray-500 mt-1">Medical Only</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border p-5 text-center">
              <div className="text-3xl font-bold text-orange-600">
                {Object.values(STATE_DATA).filter((s) => s.status === 'decriminalized').length}
              </div>
              <div className="text-sm text-gray-500 mt-1">Decriminalized</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border p-5 text-center">
              <div className="text-3xl font-bold text-red-600">
                {Object.values(STATE_DATA).filter((s) => s.status === 'illegal').length}
              </div>
              <div className="text-sm text-gray-500 mt-1">Illegal</div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
