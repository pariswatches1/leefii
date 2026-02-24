'use client'

import { useState } from 'react'

type Frequency = 'several-daily' | 'daily' | 'few-weekly' | 'weekly' | 'rarely'
type Duration = '<3mo' | '3-6mo' | '6-12mo' | '1-3yr' | '3+yr'
type Method = 'smoking' | 'edibles' | 'concentrates' | 'mixed'
type Tolerance = 'effective' | 'somewhat' | 'significantly' | 'barely'

interface TimelinePhase {
  label: string
  days: string
  recovery: number
  description: string
  tips: string[]
}

interface Results {
  breakDays: number
  breakLabel: string
  timeline: TimelinePhase[]
  restartTips: string[]
}

const FREQUENCY_OPTIONS: { value: Frequency; label: string }[] = [
  { value: 'several-daily', label: 'Several times daily' },
  { value: 'daily', label: 'Daily' },
  { value: 'few-weekly', label: 'A few times a week' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'rarely', label: 'Rarely' },
]

const DURATION_OPTIONS: { value: Duration; label: string }[] = [
  { value: '<3mo', label: 'Less than 3 months' },
  { value: '3-6mo', label: '3-6 months' },
  { value: '6-12mo', label: '6-12 months' },
  { value: '1-3yr', label: '1-3 years' },
  { value: '3+yr', label: '3+ years' },
]

const METHOD_OPTIONS: { value: Method; label: string; icon: string }[] = [
  { value: 'smoking', label: 'Smoking / Vaping', icon: '💨' },
  { value: 'edibles', label: 'Edibles', icon: '🍪' },
  { value: 'concentrates', label: 'Concentrates', icon: '💎' },
  { value: 'mixed', label: 'Mixed Methods', icon: '🔄' },
]

const TOLERANCE_OPTIONS: { value: Tolerance; label: string; desc: string }[] = [
  {
    value: 'effective',
    label: 'Still effective',
    desc: 'I feel the effects clearly each time',
  },
  {
    value: 'somewhat',
    label: 'Somewhat reduced',
    desc: 'I need a bit more than I used to',
  },
  {
    value: 'significantly',
    label: 'Significantly reduced',
    desc: 'I need much more to feel the same effects',
  },
  {
    value: 'barely',
    label: 'Barely feel it',
    desc: 'Even large amounts have little effect',
  },
]

function calculateBreak(
  frequency: Frequency,
  duration: Duration,
  method: Method,
  tolerance: Tolerance
): Results {
  // Base days by frequency
  let baseDays: number
  switch (frequency) {
    case 'several-daily':
      baseDays = 28
      break
    case 'daily':
      baseDays = 21
      break
    case 'few-weekly':
      baseDays = 10
      break
    case 'weekly':
      baseDays = 5
      break
    case 'rarely':
      baseDays = 3
      break
  }

  // Duration modifier
  let durationMod: number
  switch (duration) {
    case '3+yr':
      durationMod = 1.3
      break
    case '1-3yr':
      durationMod = 1.15
      break
    case '6-12mo':
      durationMod = 1.0
      break
    case '3-6mo':
      durationMod = 0.85
      break
    case '<3mo':
      durationMod = 0.7
      break
  }

  // Method modifier (concentrates build tolerance faster)
  let methodMod: number
  switch (method) {
    case 'concentrates':
      methodMod = 1.2
      break
    case 'mixed':
      methodMod = 1.1
      break
    case 'smoking':
      methodMod = 1.0
      break
    case 'edibles':
      methodMod = 0.95
      break
  }

  // Tolerance modifier
  let toleranceMod: number
  switch (tolerance) {
    case 'barely':
      toleranceMod = 1.25
      break
    case 'significantly':
      toleranceMod = 1.1
      break
    case 'somewhat':
      toleranceMod = 1.0
      break
    case 'effective':
      toleranceMod = 0.8
      break
  }

  const rawDays = Math.round(baseDays * durationMod * methodMod * toleranceMod)
  const breakDays = Math.max(2, Math.min(42, rawDays))

  let breakLabel: string
  if (breakDays <= 5) breakLabel = 'Short Reset'
  else if (breakDays <= 14) breakLabel = 'Moderate Reset'
  else if (breakDays <= 28) breakLabel = 'Full Reset'
  else breakLabel = 'Extended Reset'

  // Build timeline phases
  const timeline: TimelinePhase[] = []

  if (breakDays >= 2) {
    timeline.push({
      label: 'Days 1-3',
      days: '1-3',
      recovery: 15,
      description:
        'The hardest phase. CB1 receptors begin upregulating within 48 hours. You may experience irritability, difficulty sleeping, and vivid dreams.',
      tips: [
        'Stay hydrated and drink extra water',
        'Exercise to release natural endorphins',
        'Keep busy with hobbies or social activities',
        'Avoid triggers and routines associated with consumption',
      ],
    })
  }

  if (breakDays >= 5) {
    timeline.push({
      label: 'Days 4-7',
      days: '4-7',
      recovery: 35,
      description:
        'Symptoms begin to improve noticeably. Sleep patterns start normalizing. Appetite returns to baseline. Receptor recovery is accelerating.',
      tips: [
        'Maintain a consistent sleep schedule',
        'Try meditation or deep breathing for relaxation',
        'Eat balanced meals to stabilize energy levels',
        'Notice and appreciate improvements in mental clarity',
      ],
    })
  }

  if (breakDays >= 14) {
    timeline.push({
      label: 'Week 2',
      days: '8-14',
      recovery: 65,
      description:
        'Significant CB1 receptor recovery occurs. Most withdrawal symptoms have faded. Energy levels and mood stabilize. Dreams may still be vivid.',
      tips: [
        'Reflect on your relationship with cannabis',
        'Set intentions for your consumption goals after the break',
        'Continue with exercise and healthy routines',
        'Consider journaling about the experience',
      ],
    })
  }

  if (breakDays >= 21) {
    timeline.push({
      label: 'Week 3',
      days: '15-21',
      recovery: 85,
      description:
        'Most users experience substantial receptor reset by this point. The endocannabinoid system is functioning near baseline. Mood, sleep, and cognition are normalized.',
      tips: [
        'Plan your first session back with intention',
        'Stock up on low-dose products for your return',
        'Consider setting new consumption boundaries',
        'Celebrate your discipline and commitment',
      ],
    })
  }

  if (breakDays >= 28) {
    timeline.push({
      label: 'Week 4+',
      days: '22-28+',
      recovery: 98,
      description:
        'Near-complete receptor recovery for even the heaviest users. PET imaging studies confirm CB1 density returns to near-normal levels. Your system is fully reset.',
      tips: [
        'Start back with the lowest effective dose',
        'Wait 15+ minutes between sessions to gauge effects',
        'Use this fresh start to establish mindful consumption habits',
        'Track your sessions to maintain your new baseline',
      ],
    })
  }

  const restartTips = [
    'Start with 25-50% of your pre-break dose',
    'Choose a familiar, comfortable setting for your first session',
    'Opt for a balanced strain rather than high-THC options',
    'Wait at least 15 minutes between doses to feel the full effect',
    'Have water and snacks on hand',
    'Consider micro-dosing for the first few days to find your new sweet spot',
  ]

  return { breakDays, breakLabel, timeline, restartTips }
}

export default function ToleranceBreak() {
  const [frequency, setFrequency] = useState<Frequency | null>(null)
  const [duration, setDuration] = useState<Duration | null>(null)
  const [method, setMethod] = useState<Method | null>(null)
  const [tolerance, setTolerance] = useState<Tolerance | null>(null)
  const [results, setResults] = useState<Results | null>(null)

  const canCalculate = frequency && duration && method && tolerance

  const handleCalculate = () => {
    if (!canCalculate) return
    setResults(calculateBreak(frequency, duration, method, tolerance))
  }

  const handleReset = () => {
    setFrequency(null)
    setDuration(null)
    setMethod(null)
    setTolerance(null)
    setResults(null)
  }

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {!results ? (
        <>
          {/* Frequency */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              How often do you consume cannabis?
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Select the option that best matches your current habits
            </p>
            <div className="grid sm:grid-cols-3 gap-3">
              {FREQUENCY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setFrequency(opt.value)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    frequency === opt.value
                      ? 'ring-2 ring-green-500 bg-green-50 border-green-500'
                      : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                  }`}
                >
                  <span
                    className={`font-medium ${
                      frequency === opt.value
                        ? 'text-green-700'
                        : 'text-gray-700'
                    }`}
                  >
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              How long have you been consuming regularly?
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Longer use periods require more time for full receptor recovery
            </p>
            <div className="grid sm:grid-cols-3 gap-3">
              {DURATION_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setDuration(opt.value)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    duration === opt.value
                      ? 'ring-2 ring-green-500 bg-green-50 border-green-500'
                      : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                  }`}
                >
                  <span
                    className={`font-medium ${
                      duration === opt.value
                        ? 'text-green-700'
                        : 'text-gray-700'
                    }`}
                  >
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Method */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              What is your primary consumption method?
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Concentrates and frequent vaping tend to build tolerance faster
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {METHOD_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setMethod(opt.value)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    method === opt.value
                      ? 'ring-2 ring-green-500 bg-green-50 border-green-500'
                      : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-2xl">{opt.icon}</span>
                  <span
                    className={`text-sm font-medium text-center ${
                      method === opt.value
                        ? 'text-green-700'
                        : 'text-gray-700'
                    }`}
                  >
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Tolerance Level */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              How would you describe your current tolerance?
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Be honest for the most accurate recommendation
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {TOLERANCE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setTolerance(opt.value)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    tolerance === opt.value
                      ? 'ring-2 ring-green-500 bg-green-50 border-green-500'
                      : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                  }`}
                >
                  <span
                    className={`font-medium block ${
                      tolerance === opt.value
                        ? 'text-green-700'
                        : 'text-gray-700'
                    }`}
                  >
                    {opt.label}
                  </span>
                  <span className="text-sm text-gray-500">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Calculate Button */}
          <button
            onClick={handleCalculate}
            disabled={!canCalculate}
            className={`w-full sm:w-auto rounded-lg px-6 py-3 font-semibold transition-colors ${
              canCalculate
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Calculate My T-Break
          </button>
        </>
      ) : (
        <>
          {/* Results Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 text-center">
            <h2 className="text-lg font-semibold text-gray-500 mb-2">
              Your Recommended Tolerance Break
            </h2>
            <div className="text-5xl font-bold text-green-600 mb-1">
              {results.breakDays} Days
            </div>
            <span className="inline-block bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full">
              {results.breakLabel}
            </span>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Recovery Timeline
            </h2>
            <div className="space-y-6">
              {results.timeline.map((phase, i) => (
                <div key={i} className="relative">
                  {i < results.timeline.length - 1 && (
                    <div className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-green-200" />
                  )}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-700 font-bold text-sm">
                        {phase.recovery}%
                      </span>
                    </div>
                    <div className="flex-1 pb-6">
                      <h3 className="font-bold text-gray-900 mb-1">
                        {phase.label}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {phase.description}
                      </p>
                      {/* Recovery Bar */}
                      <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${phase.recovery}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mb-2 font-medium">
                        Tips for this phase:
                      </p>
                      <ul className="space-y-1">
                        {phase.tips.map((tip, j) => (
                          <li
                            key={j}
                            className="text-sm text-gray-600 flex items-start gap-2"
                          >
                            <span className="text-green-500 mt-0.5 flex-shrink-0">
                              &#10003;
                            </span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Restart Guide */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Restart Guide — Your First Session Back
            </h2>
            <p className="text-gray-600 text-sm mb-4">
              After your break, your CB1 receptors will be significantly more
              sensitive. Follow these tips to get the most from your refreshed
              tolerance.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {results.restartTips.map((tip, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 bg-green-50 rounded-lg p-3"
                >
                  <span className="bg-green-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-sm text-gray-700">{tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recalculate */}
          <div className="text-center">
            <button
              onClick={handleReset}
              className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-6 py-3 font-semibold transition-colors"
            >
              Recalculate
            </button>
          </div>
        </>
      )}
    </section>
  )
}
