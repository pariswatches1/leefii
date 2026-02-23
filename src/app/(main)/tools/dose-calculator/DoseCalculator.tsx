'use client'

import { useState } from 'react'

type ExperienceLevel = 'beginner' | 'occasional' | 'regular' | 'heavy'
type Intensity = 'mild' | 'moderate' | 'strong' | 'very-strong'
type ProductType = 'gummy' | 'chocolate' | 'baked' | 'tincture' | 'beverage'
type WeightUnit = 'lbs' | 'kg'

interface DoseResult {
  recommendedDose: string
  minDose: number
  maxDose: number
  onsetTime: string
  duration: string
  tips: string[]
  warning: string
}

const EXPERIENCE_OPTIONS: { value: ExperienceLevel; label: string; description: string }[] = [
  { value: 'beginner', label: 'Beginner', description: 'New to edibles or rarely consume cannabis' },
  { value: 'occasional', label: 'Occasional', description: 'Use cannabis a few times per month' },
  { value: 'regular', label: 'Regular', description: 'Consume cannabis multiple times per week' },
  { value: 'heavy', label: 'Heavy', description: 'Daily consumer with high tolerance' },
]

const INTENSITY_OPTIONS: { value: Intensity; label: string; description: string }[] = [
  { value: 'mild', label: 'Mild', description: 'Subtle relaxation, minimal psychoactive effects' },
  { value: 'moderate', label: 'Moderate', description: 'Noticeable effects, functional high' },
  { value: 'strong', label: 'Strong', description: 'Strong effects, significant psychoactive experience' },
  { value: 'very-strong', label: 'Very Strong', description: 'Intense experience, for very experienced users' },
]

const PRODUCT_TYPES: { value: ProductType; label: string; onset: string; duration: string }[] = [
  { value: 'gummy', label: 'Gummy', onset: '30-60 minutes', duration: '4-6 hours' },
  { value: 'chocolate', label: 'Chocolate', onset: '30-60 minutes', duration: '4-6 hours' },
  { value: 'baked', label: 'Baked Good', onset: '45-90 minutes', duration: '6-8 hours' },
  { value: 'tincture', label: 'Tincture (Sublingual)', onset: '15-30 minutes', duration: '4-6 hours' },
  { value: 'beverage', label: 'Beverage', onset: '15-45 minutes', duration: '3-5 hours' },
]

const DOSING_CHART = [
  { range: '1 - 2.5 mg', level: 'Microdose', description: 'Minimal psychoactive effects. Good for first-timers, microdosing, and mild symptom relief.' },
  { range: '2.5 - 5 mg', level: 'Low / Beginner', description: 'Mild relief of symptoms and anxiety. Slight euphoria. Recommended starting dose for beginners.' },
  { range: '5 - 10 mg', level: 'Moderate', description: 'Stronger symptom relief. Euphoria and impaired coordination. Good for occasional users.' },
  { range: '10 - 25 mg', level: 'High', description: 'Strong euphoria. Significantly impaired coordination. For experienced consumers with higher tolerance.' },
  { range: '25 - 50 mg', level: 'Very High', description: 'Very strong effects. Only for users with high tolerance or specific medical needs.' },
  { range: '50+ mg', level: 'Extremely High', description: 'Extremely potent. Risk of adverse effects. Only for those with very high tolerance or serious medical conditions.' },
]

function calculateDose(
  experience: ExperienceLevel,
  weight: number,
  weightUnit: WeightUnit,
  intensity: Intensity,
  productType: ProductType
): DoseResult {
  const baseDoses: Record<ExperienceLevel, [number, number]> = {
    beginner: [2.5, 5],
    occasional: [5, 10],
    regular: [10, 25],
    heavy: [25, 50],
  }

  const intensityMultiplier: Record<Intensity, number> = {
    mild: 0.7,
    moderate: 1.0,
    strong: 1.3,
    'very-strong': 1.6,
  }

  const weightLbs = weightUnit === 'kg' ? weight * 2.205 : weight
  let weightMultiplier = 1.0
  if (weightLbs < 130) weightMultiplier = 0.85
  else if (weightLbs < 160) weightMultiplier = 0.95
  else if (weightLbs < 200) weightMultiplier = 1.0
  else if (weightLbs < 250) weightMultiplier = 1.1
  else weightMultiplier = 1.2

  const [baseMin, baseMax] = baseDoses[experience]
  const intMult = intensityMultiplier[intensity]

  let minDose = Math.round(baseMin * intMult * weightMultiplier * 10) / 10
  let maxDose = Math.round(baseMax * intMult * weightMultiplier * 10) / 10

  minDose = Math.max(1, minDose)
  maxDose = Math.max(minDose + 0.5, maxDose)

  const product = PRODUCT_TYPES.find((p) => p.value === productType)!

  const tips: string[] = []
  if (experience === 'beginner') {
    tips.push('Start with the lowest recommended dose and wait at least 2 hours before considering more.')
    tips.push('Have a CBD product on hand, as it may help reduce unwanted effects.')
  }
  if (productType === 'baked') {
    tips.push('Baked goods can have uneven THC distribution. Start with a small portion.')
  }
  if (productType === 'tincture') {
    tips.push('Hold tincture under your tongue for 60-90 seconds for faster absorption.')
  }
  if (productType === 'beverage') {
    tips.push('Cannabis beverages often use nano-emulsion for faster onset. Effects may hit quicker than other edibles.')
  }
  tips.push('Eat a small meal before consuming edibles to help with consistent absorption.')
  tips.push('Stay hydrated and consume in a comfortable, safe environment.')

  let warning = ''
  if (experience === 'beginner' && (intensity === 'strong' || intensity === 'very-strong')) {
    warning = 'Caution: As a beginner, starting with a strong dose is not recommended. Consider starting at a lower intensity.'
  }

  return {
    recommendedDose: `${minDose} - ${maxDose} mg THC`,
    minDose,
    maxDose,
    onsetTime: product.onset,
    duration: product.duration,
    tips,
    warning,
  }
}

export default function DoseCalculator() {
  const [experience, setExperience] = useState<ExperienceLevel | null>(null)
  const [weight, setWeight] = useState<string>('150')
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('lbs')
  const [intensity, setIntensity] = useState<Intensity | null>(null)
  const [productType, setProductType] = useState<ProductType>('gummy')
  const [result, setResult] = useState<DoseResult | null>(null)
  const [showChart, setShowChart] = useState(false)

  const handleCalculate = () => {
    if (!experience || !intensity || !weight) return
    const w = parseFloat(weight)
    if (isNaN(w) || w <= 0) return
    const dose = calculateDose(experience, w, weightUnit, intensity, productType)
    setResult(dose)
  }

  const isFormValid = experience && intensity && weight && parseFloat(weight) > 0

  return (
    <section className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Safety Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
            <div>
              <p className="font-semibold text-amber-800">Start Low, Go Slow</p>
              <p className="text-sm text-amber-700 mt-1">
                This calculator provides general guidance only and is not medical advice. Edibles affect everyone differently based on metabolism, tolerance, and other factors. Always start with a low dose and wait at least 2 hours before consuming more.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6 md:p-8">
          {/* Step 1: Experience Level */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">1. Your Experience Level</h3>
            <p className="text-sm text-gray-500 mb-4">How often do you consume cannabis?</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {EXPERIENCE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setExperience(opt.value)}
                  className={`text-left p-4 rounded-lg border-2 transition-all ${
                    experience === opt.value
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

          {/* Step 2: Body Weight */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">2. Body Weight</h3>
            <p className="text-sm text-gray-500 mb-4">Helps fine-tune your recommended dosage</p>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                min="50"
                max="500"
                className="w-32 px-4 py-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                placeholder="150"
              />
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setWeightUnit('lbs')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    weightUnit === 'lbs' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  lbs
                </button>
                <button
                  onClick={() => setWeightUnit('kg')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    weightUnit === 'kg' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  kg
                </button>
              </div>
            </div>
          </div>

          {/* Step 3: Desired Intensity */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">3. Desired Intensity</h3>
            <p className="text-sm text-gray-500 mb-4">How strong do you want the effects?</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {INTENSITY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setIntensity(opt.value)}
                  className={`text-left p-4 rounded-lg border-2 transition-all ${
                    intensity === opt.value
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

          {/* Step 4: Product Type */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">4. Product Type</h3>
            <p className="text-sm text-gray-500 mb-4">Different products have different onset times and durations</p>
            <div className="flex flex-wrap gap-2">
              {PRODUCT_TYPES.map((pt) => (
                <button
                  key={pt.value}
                  onClick={() => setProductType(pt.value)}
                  className={`px-4 py-2.5 rounded-lg border-2 text-sm font-medium transition-all ${
                    productType === pt.value
                      ? 'ring-2 ring-green-500 bg-green-50 border-green-500 text-green-800'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white'
                  }`}
                >
                  {pt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Calculate Button */}
          <button
            onClick={handleCalculate}
            disabled={!isFormValid}
            className={`w-full py-3 px-6 rounded-lg text-lg font-semibold transition-all ${
              isFormValid
                ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Calculate Recommended Dose
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="mt-8 bg-white rounded-xl shadow-sm border overflow-hidden" id="results">
            <div className="bg-green-600 text-white p-6">
              <h3 className="text-xl font-bold">Your Recommended Dose</h3>
              <div className="text-4xl font-bold mt-2">{result.recommendedDose}</div>
            </div>
            <div className="p-6 md:p-8">
              {result.warning && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-800 font-medium">{result.warning}</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">Expected Onset</div>
                  <div className="text-lg font-semibold text-gray-900">{result.onsetTime}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">Expected Duration</div>
                  <div className="text-lg font-semibold text-gray-900">{result.duration}</div>
                </div>
              </div>

              <h4 className="font-semibold text-gray-900 mb-3">Tips for Your Session</h4>
              <ul className="space-y-2 mb-6">
                {result.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    <span className="text-gray-700 text-sm">{tip}</span>
                  </li>
                ))}
              </ul>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-600">
                <strong>Disclaimer:</strong> This calculator provides general guidance only and should not replace professional medical advice.
                Individual responses to THC vary significantly. Consult a healthcare professional before using cannabis, especially if you
                take medications or have underlying health conditions.
              </div>
            </div>
          </div>
        )}

        {/* Dosing Chart */}
        <div className="mt-8">
          <button
            onClick={() => setShowChart(!showChart)}
            className="flex items-center gap-2 text-green-700 font-semibold hover:text-green-800 transition-colors mb-4"
          >
            <svg className={`w-5 h-5 transition-transform ${showChart ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
            {showChart ? 'Hide' : 'Show'} Complete Dosing Chart
          </button>

          {showChart && (
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">THC Edible Dosing Reference Chart</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Dose Range</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Level</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Effects</th>
                      </tr>
                    </thead>
                    <tbody>
                      {DOSING_CHART.map((row, i) => (
                        <tr key={i} className="border-b border-gray-100 last:border-0">
                          <td className="py-3 px-4 font-medium text-gray-900 whitespace-nowrap">{row.range}</td>
                          <td className="py-3 px-4 text-gray-700 whitespace-nowrap">{row.level}</td>
                          <td className="py-3 px-4 text-gray-600">{row.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
