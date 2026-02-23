'use client'

import { useState } from 'react'
import Link from 'next/link'

type StrainType = 'indica' | 'sativa' | 'hybrid'

interface StrainRecommendation {
  name: string
  slug: string
  type: StrainType
  thc: string
  description: string
  effects: string[]
  flavors: string[]
  matchScore: number
}

interface QuizAnswers {
  effects: string[]
  timeOfDay: string
  tolerance: string
  medicalNeeds: string[]
  flavor: string
}

const EFFECT_OPTIONS = [
  { value: 'relaxed', label: 'Relaxed', icon: 'M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z' },
  { value: 'energetic', label: 'Energetic', icon: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z' },
  { value: 'creative', label: 'Creative', icon: 'M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42' },
  { value: 'sleepy', label: 'Sleepy', icon: 'M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z' },
  { value: 'happy', label: 'Happy', icon: 'M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z' },
  { value: 'focused', label: 'Focused', icon: 'M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z' },
  { value: 'euphoric', label: 'Euphoric', icon: 'M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z' },
  { value: 'hungry', label: 'Hungry', icon: 'M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0L3 16.5m15-3.379a48.474 48.474 0 0 0-6-.371c-2.032 0-4.034.126-6 .371m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.169c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 0 1 3 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 0 1 6 13.12M12.265 3.11a.375.375 0 1 1-.53 0L12 2.845l.265.265Z' },
]

const TIME_OPTIONS = [
  { value: 'morning', label: 'Morning', description: 'Wake & bake, daytime activities' },
  { value: 'afternoon', label: 'Afternoon', description: 'Midday boost, social activities' },
  { value: 'evening', label: 'Evening', description: 'After work, winding down' },
  { value: 'nighttime', label: 'Nighttime', description: 'Before bed, deep relaxation' },
]

const TOLERANCE_OPTIONS = [
  { value: 'none-low', label: 'None / Low', description: 'New to cannabis or infrequent user' },
  { value: 'medium', label: 'Medium', description: 'Use a few times per week' },
  { value: 'high', label: 'High', description: 'Daily user with solid tolerance' },
  { value: 'very-high', label: 'Very High', description: 'Heavy daily consumer' },
]

const MEDICAL_OPTIONS = [
  { value: 'pain', label: 'Pain Relief' },
  { value: 'anxiety', label: 'Anxiety' },
  { value: 'insomnia', label: 'Insomnia' },
  { value: 'depression', label: 'Depression' },
  { value: 'nausea', label: 'Nausea' },
  { value: 'none', label: 'None' },
]

const FLAVOR_OPTIONS = [
  { value: 'earthy', label: 'Earthy' },
  { value: 'citrus', label: 'Citrus' },
  { value: 'berry', label: 'Berry' },
  { value: 'pine', label: 'Pine' },
  { value: 'sweet', label: 'Sweet' },
  { value: 'no-preference', label: 'No Preference' },
]

const STRAIN_DATABASE: StrainRecommendation[] = [
  // Indicas
  { name: 'Granddaddy Purple', slug: 'granddaddy-purple', type: 'indica', thc: '17-24%', description: 'A famous indica known for its deep relaxation and dreamy euphoria. Sweet grape and berry aroma.', effects: ['relaxed', 'sleepy', 'happy', 'euphoric', 'hungry'], flavors: ['berry', 'sweet'] , matchScore: 0 },
  { name: 'Northern Lights', slug: 'northern-lights', type: 'indica', thc: '16-21%', description: 'One of the most iconic indica strains, delivering full-body relaxation and peaceful sedation.', effects: ['relaxed', 'sleepy', 'happy', 'euphoric'], flavors: ['earthy', 'pine', 'sweet'], matchScore: 0 },
  { name: 'Purple Punch', slug: 'purple-punch', type: 'indica', thc: '18-25%', description: 'A sedating indica with dessert-like grape candy flavor. Excellent for evening relaxation and sleep.', effects: ['relaxed', 'sleepy', 'happy', 'hungry'], flavors: ['berry', 'sweet'], matchScore: 0 },
  { name: 'Bubba Kush', slug: 'bubba-kush', type: 'indica', thc: '15-22%', description: 'A heavy indica that delivers tranquilizing effects with a sweet coffee and chocolate flavor profile.', effects: ['relaxed', 'sleepy', 'happy', 'hungry'], flavors: ['earthy', 'sweet'], matchScore: 0 },
  { name: 'Hindu Kush', slug: 'hindu-kush', type: 'indica', thc: '15-20%', description: 'A pure indica landrace strain from the mountains between Afghanistan and Pakistan. Deep body high.', effects: ['relaxed', 'sleepy', 'happy'], flavors: ['earthy', 'pine'], matchScore: 0 },
  // Sativas
  { name: 'Jack Herer', slug: 'jack-herer', type: 'sativa', thc: '18-24%', description: 'A legendary sativa named after the cannabis activist. Delivers clear-headed creativity and blissful energy.', effects: ['energetic', 'creative', 'happy', 'focused', 'euphoric'], flavors: ['pine', 'earthy', 'citrus'], matchScore: 0 },
  { name: 'Green Crack', slug: 'green-crack', type: 'sativa', thc: '15-25%', description: 'A sharp energy and focus strain perfect for daytime use. Tangy mango and citrus flavor.', effects: ['energetic', 'focused', 'happy', 'euphoric', 'creative'], flavors: ['citrus', 'sweet'], matchScore: 0 },
  { name: 'Sour Diesel', slug: 'sour-diesel', type: 'sativa', thc: '19-25%', description: 'A fast-acting sativa with dreamy cerebral effects and energizing properties. Pungent diesel aroma.', effects: ['energetic', 'creative', 'happy', 'euphoric', 'focused'], flavors: ['earthy', 'citrus'], matchScore: 0 },
  { name: 'Durban Poison', slug: 'durban-poison', type: 'sativa', thc: '15-25%', description: 'A pure sativa from South Africa. Sweet smell with uplifting and energetic effects, great for productivity.', effects: ['energetic', 'creative', 'focused', 'happy', 'euphoric'], flavors: ['sweet', 'earthy', 'pine'], matchScore: 0 },
  { name: 'Strawberry Cough', slug: 'strawberry-cough', type: 'sativa', thc: '15-20%', description: 'Known for its sweet strawberry aroma and uplifting effects. Great for social situations and creativity.', effects: ['happy', 'euphoric', 'energetic', 'creative'], flavors: ['berry', 'sweet'], matchScore: 0 },
  // Hybrids
  { name: 'Blue Dream', slug: 'blue-dream', type: 'hybrid', thc: '17-24%', description: 'America\'s most popular strain. A balanced hybrid offering gentle cerebral invigoration with full-body relaxation.', effects: ['happy', 'relaxed', 'creative', 'euphoric', 'energetic'], flavors: ['berry', 'sweet'], matchScore: 0 },
  { name: 'Wedding Cake', slug: 'wedding-cake', type: 'hybrid', thc: '22-27%', description: 'A potent hybrid with rich and tangy flavor. Delivers relaxation and euphoria with a touch of creativity.', effects: ['relaxed', 'happy', 'euphoric', 'creative', 'hungry'], flavors: ['sweet', 'earthy'], matchScore: 0 },
  { name: 'Gelato', slug: 'gelato', type: 'hybrid', thc: '20-25%', description: 'A dessert strain with intense flavor and balanced effects. Known for euphoria and physical relaxation.', effects: ['relaxed', 'happy', 'euphoric', 'creative'], flavors: ['sweet', 'citrus', 'berry'], matchScore: 0 },
  { name: 'OG Kush', slug: 'og-kush', type: 'hybrid', thc: '19-26%', description: 'The backbone of West Coast cannabis. A balanced hybrid with heavy euphoria and stress-melting relaxation.', effects: ['relaxed', 'happy', 'euphoric', 'hungry', 'sleepy'], flavors: ['earthy', 'pine', 'citrus'], matchScore: 0 },
  { name: 'Girl Scout Cookies', slug: 'girl-scout-cookies', type: 'hybrid', thc: '19-28%', description: 'An award-winning hybrid with sweet and earthy flavors. Full-body relaxation with cerebral euphoria.', effects: ['happy', 'euphoric', 'relaxed', 'creative', 'hungry'], flavors: ['sweet', 'earthy'], matchScore: 0 },
  { name: 'Pineapple Express', slug: 'pineapple-express', type: 'hybrid', thc: '17-24%', description: 'A tropical-flavored hybrid delivering long-lasting energetic buzz and productivity. Social and creative.', effects: ['happy', 'energetic', 'creative', 'euphoric', 'focused'], flavors: ['citrus', 'sweet', 'pine'], matchScore: 0 },
]

function getRecommendations(answers: QuizAnswers): { type: StrainType; typeExplanation: string; strains: StrainRecommendation[] } {
  // Score each strain type
  const typeScores: Record<StrainType, number> = { indica: 0, sativa: 0, hybrid: 0 }

  // Effects scoring
  const indicaEffects = ['relaxed', 'sleepy', 'hungry']
  const sativaEffects = ['energetic', 'creative', 'focused']
  const hybridEffects = ['happy', 'euphoric']

  answers.effects.forEach((effect) => {
    if (indicaEffects.includes(effect)) typeScores.indica += 3
    if (sativaEffects.includes(effect)) typeScores.sativa += 3
    if (hybridEffects.includes(effect)) { typeScores.hybrid += 2; typeScores.indica += 1; typeScores.sativa += 1 }
  })

  // Time of day scoring
  if (answers.timeOfDay === 'morning') { typeScores.sativa += 4; typeScores.hybrid += 1 }
  if (answers.timeOfDay === 'afternoon') { typeScores.sativa += 2; typeScores.hybrid += 3 }
  if (answers.timeOfDay === 'evening') { typeScores.indica += 2; typeScores.hybrid += 3 }
  if (answers.timeOfDay === 'nighttime') { typeScores.indica += 5 }

  // Medical needs scoring
  answers.medicalNeeds.forEach((need) => {
    if (need === 'pain') { typeScores.indica += 3; typeScores.hybrid += 1 }
    if (need === 'anxiety') { typeScores.indica += 2; typeScores.hybrid += 2 }
    if (need === 'insomnia') { typeScores.indica += 4 }
    if (need === 'depression') { typeScores.sativa += 3; typeScores.hybrid += 1 }
    if (need === 'nausea') { typeScores.indica += 2; typeScores.hybrid += 1 }
  })

  // Determine best type
  const sortedTypes = (Object.entries(typeScores) as [StrainType, number][]).sort(([, a], [, b]) => b - a)
  const bestType = sortedTypes[0][0]

  // Score individual strains
  const scoredStrains = STRAIN_DATABASE.map((strain) => {
    let score = 0

    // Type match
    if (strain.type === bestType) score += 10
    else if (strain.type === 'hybrid') score += 5

    // Effect matches
    answers.effects.forEach((effect) => {
      if (strain.effects.includes(effect)) score += 5
    })

    // Flavor match
    if (answers.flavor !== 'no-preference') {
      if (strain.flavors.includes(answers.flavor)) score += 3
    }

    // Time of day alignment
    if (answers.timeOfDay === 'nighttime' && strain.effects.includes('sleepy')) score += 3
    if (answers.timeOfDay === 'morning' && strain.effects.includes('energetic')) score += 3

    // Medical alignment
    answers.medicalNeeds.forEach((need) => {
      if (need === 'insomnia' && strain.effects.includes('sleepy')) score += 3
      if (need === 'pain' && strain.effects.includes('relaxed')) score += 2
      if (need === 'anxiety' && strain.effects.includes('relaxed')) score += 2
      if (need === 'depression' && (strain.effects.includes('happy') || strain.effects.includes('euphoric'))) score += 2
      if (need === 'nausea' && strain.effects.includes('hungry')) score += 2
    })

    // Tolerance scoring (prefer lower THC for low tolerance)
    const thcMax = parseInt(strain.thc.split('-')[1])
    if (answers.tolerance === 'none-low' && thcMax <= 20) score += 2
    if (answers.tolerance === 'very-high' && thcMax >= 23) score += 2

    return { ...strain, matchScore: Math.min(99, Math.round((score / 45) * 100)) }
  })

  scoredStrains.sort((a, b) => b.matchScore - a.matchScore)

  const explanations: Record<StrainType, string> = {
    indica: 'Based on your preferences for relaxation, evening use, and calming effects, indica strains are your best match. Indicas are known for their body-heavy effects, making them great for unwinding, pain relief, and sleep.',
    sativa: 'Based on your preferences for energy, creativity, and daytime use, sativa strains are your best match. Sativas are known for their uplifting cerebral effects, perfect for staying active and social.',
    hybrid: 'Based on your balanced preferences, hybrid strains are your best match. Hybrids combine the best of indica and sativa genetics, offering versatile effects that work for a variety of situations.',
  }

  return {
    type: bestType,
    typeExplanation: explanations[bestType],
    strains: scoredStrains.slice(0, 3),
  }
}

const STEPS = ['Effects', 'Time of Day', 'Tolerance', 'Medical Needs', 'Flavor']

export default function StrainFinder() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswers>({
    effects: [],
    timeOfDay: '',
    tolerance: '',
    medicalNeeds: [],
    flavor: '',
  })
  const [results, setResults] = useState<ReturnType<typeof getRecommendations> | null>(null)

  const toggleEffect = (effect: string) => {
    setAnswers((prev) => {
      const effects = prev.effects.includes(effect)
        ? prev.effects.filter((e) => e !== effect)
        : prev.effects.length < 3
          ? [...prev.effects, effect]
          : prev.effects
      return { ...prev, effects }
    })
  }

  const toggleMedical = (need: string) => {
    if (need === 'none') {
      setAnswers((prev) => ({ ...prev, medicalNeeds: ['none'] }))
      return
    }
    setAnswers((prev) => {
      const needs = prev.medicalNeeds.filter((n) => n !== 'none')
      const updated = needs.includes(need) ? needs.filter((n) => n !== need) : [...needs, need]
      return { ...prev, medicalNeeds: updated }
    })
  }

  const canProceed = () => {
    switch (step) {
      case 0: return answers.effects.length >= 1
      case 1: return answers.timeOfDay !== ''
      case 2: return answers.tolerance !== ''
      case 3: return answers.medicalNeeds.length > 0
      case 4: return answers.flavor !== ''
      default: return false
    }
  }

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1)
    } else {
      setResults(getRecommendations(answers))
    }
  }

  const handleBack = () => {
    if (step > 0) setStep(step - 1)
  }

  const handleRetake = () => {
    setStep(0)
    setAnswers({ effects: [], timeOfDay: '', tolerance: '', medicalNeeds: [], flavor: '' })
    setResults(null)
  }

  // Results view
  if (results) {
    const typeColors: Record<StrainType, string> = {
      indica: 'bg-purple-100 text-purple-800',
      sativa: 'bg-orange-100 text-orange-800',
      hybrid: 'bg-blue-100 text-blue-800',
    }

    return (
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Result Header */}
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden mb-8">
            <div className="bg-green-600 text-white p-6 md:p-8">
              <h2 className="text-sm font-medium text-green-200 uppercase tracking-wide mb-2">Your Perfect Match</h2>
              <div className="text-3xl md:text-4xl font-bold capitalize mb-3">
                {results.type} Strains
              </div>
              <p className="text-green-100 text-lg">{results.typeExplanation}</p>
            </div>
          </div>

          {/* Strain Recommendations */}
          <h3 className="text-xl font-bold text-gray-900 mb-4">Top 3 Strain Recommendations</h3>
          <div className="space-y-4 mb-8">
            {results.strains.map((strain, i) => (
              <div key={strain.slug} className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl font-bold text-gray-300">#{i + 1}</span>
                      <Link href={`/strains/${strain.slug}`} className="text-xl font-bold text-gray-900 hover:text-green-700 transition-colors">
                        {strain.name}
                      </Link>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${typeColors[strain.type]}`}>
                        {strain.type}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{strain.description}</p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {strain.effects.slice(0, 4).map((effect) => (
                        <span key={effect} className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-medium capitalize">
                          {effect}
                        </span>
                      ))}
                    </div>
                    <div className="text-sm text-gray-500">THC: {strain.thc}</div>
                  </div>
                  <div className="flex flex-col items-center sm:items-end gap-2">
                    <div className="text-center sm:text-right">
                      <div className="text-3xl font-bold text-green-600">{strain.matchScore}%</div>
                      <div className="text-xs text-gray-500">Match</div>
                    </div>
                    <Link
                      href={`/strains/${strain.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-green-700 hover:text-green-800 transition-colors"
                    >
                      View Strain
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href={`/strains/${results.type}`}
              className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded-lg px-6 py-3 font-medium transition-colors"
            >
              Browse All {results.type.charAt(0).toUpperCase() + results.type.slice(1)} Strains
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <button
              onClick={handleRetake}
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-lg px-6 py-3 font-medium transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
              </svg>
              Retake Quiz
            </button>
          </div>
        </div>
      </section>
    )
  }

  // Quiz steps view
  return (
    <section className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
            <span>Step {step + 1} of 5</span>
            <span>{STEPS[step]}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((step + 1) / 5) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            {STEPS.map((label, i) => (
              <div
                key={label}
                className={`text-xs hidden sm:block ${i <= step ? 'text-green-700 font-medium' : 'text-gray-400'}`}
              >
                {label}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6 md:p-8">
          {/* Step 1: Effects */}
          {step === 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">What effects are you looking for?</h2>
              <p className="text-gray-500 mb-6">Select 1 to 3 desired effects</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {EFFECT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => toggleEffect(opt.value)}
                    className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
                      answers.effects.includes(opt.value)
                        ? 'ring-2 ring-green-500 bg-green-50 border-green-500'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <svg className={`w-7 h-7 mb-2 ${answers.effects.includes(opt.value) ? 'text-green-600' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d={opt.icon} />
                    </svg>
                    <span className="text-sm font-medium text-gray-900">{opt.label}</span>
                  </button>
                ))}
              </div>
              {answers.effects.length === 3 && (
                <p className="text-sm text-gray-500 mt-3">Maximum of 3 effects selected</p>
              )}
            </div>
          )}

          {/* Step 2: Time of Day */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">When will you be using it?</h2>
              <p className="text-gray-500 mb-6">This helps match you with the right energy level</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {TIME_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setAnswers((prev) => ({ ...prev, timeOfDay: opt.value }))}
                    className={`text-left p-4 rounded-lg border-2 transition-all ${
                      answers.timeOfDay === opt.value
                        ? 'ring-2 ring-green-500 bg-green-50 border-green-500'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{opt.label}</div>
                    <div className="text-sm text-gray-500 mt-0.5">{opt.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Tolerance */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">What is your THC tolerance?</h2>
              <p className="text-gray-500 mb-6">Helps us recommend appropriate potency levels</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {TOLERANCE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setAnswers((prev) => ({ ...prev, tolerance: opt.value }))}
                    className={`text-left p-4 rounded-lg border-2 transition-all ${
                      answers.tolerance === opt.value
                        ? 'ring-2 ring-green-500 bg-green-50 border-green-500'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{opt.label}</div>
                    <div className="text-sm text-gray-500 mt-0.5">{opt.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Medical Needs */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Any medical needs?</h2>
              <p className="text-gray-500 mb-6">Select all that apply, or choose None</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {MEDICAL_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => toggleMedical(opt.value)}
                    className={`p-4 rounded-lg border-2 transition-all text-center ${
                      answers.medicalNeeds.includes(opt.value)
                        ? 'ring-2 ring-green-500 bg-green-50 border-green-500'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <span className="font-medium text-gray-900">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Flavor */}
          {step === 4 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Preferred flavor profile?</h2>
              <p className="text-gray-500 mb-6">Choose the flavor family that appeals to you most</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {FLAVOR_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setAnswers((prev) => ({ ...prev, flavor: opt.value }))}
                    className={`p-4 rounded-lg border-2 transition-all text-center ${
                      answers.flavor === opt.value
                        ? 'ring-2 ring-green-500 bg-green-50 border-green-500'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <span className="font-medium text-gray-900">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handleBack}
              disabled={step === 0}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                step === 0
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                canProceed()
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {step === 4 ? 'See Results' : 'Next'}
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
