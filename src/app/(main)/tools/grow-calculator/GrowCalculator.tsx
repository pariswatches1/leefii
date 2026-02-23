'use client'

import { useState } from 'react'

type GrowType = 'indoor' | 'outdoor'
type LightType = 'led' | 'hps' | 'cfl' | 'fluorescent'
type Climate = 'cool' | 'temperate' | 'warm' | 'hot'
type Medium = 'soil' | 'coco' | 'hydro'
type StrainType = 'indica' | 'sativa' | 'hybrid' | 'auto'

interface Results {
  yieldPerPlant: [number, number]
  totalYield: [number, number]
  recommendedWattage: number | null
  monthlyElectricity: number | null
  timelineWeeks: [number, number]
  waterPerDay: number
  potSize: string
  tips: string[]
}

const LIGHT_OPTIONS: { value: LightType; label: string; icon: string }[] = [
  { value: 'led', label: 'LED', icon: '💡' },
  { value: 'hps', label: 'HPS', icon: '🔆' },
  { value: 'cfl', label: 'CFL', icon: '💡' },
  { value: 'fluorescent', label: 'Fluorescent', icon: '📏' },
]

const CLIMATE_OPTIONS: { value: Climate; label: string; icon: string }[] = [
  { value: 'cool', label: 'Cool', icon: '🌧️' },
  { value: 'temperate', label: 'Temperate', icon: '🌤️' },
  { value: 'warm', label: 'Warm', icon: '☀️' },
  { value: 'hot', label: 'Hot', icon: '🔥' },
]

const MEDIUM_OPTIONS: { value: Medium; label: string; icon: string }[] = [
  { value: 'soil', label: 'Soil', icon: '🪴' },
  { value: 'coco', label: 'Coco Coir', icon: '🥥' },
  { value: 'hydro', label: 'Hydroponics', icon: '💧' },
]

const STRAIN_OPTIONS: { value: StrainType; label: string }[] = [
  { value: 'indica', label: 'Indica' },
  { value: 'sativa', label: 'Sativa' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'auto', label: 'Auto-flower' },
]

function calculate(
  growType: GrowType,
  light: LightType | null,
  climate: Climate | null,
  medium: Medium,
  strain: StrainType,
  plants: number,
  lengthFt: number,
  widthFt: number,
  heightFt: number,
  areaFt: number
): Results {
  let baseYieldLow: number
  let baseYieldHigh: number
  let recommendedWattage: number | null = null
  let monthlyElectricity: number | null = null
  let timelineWeeksLow: number
  let timelineWeeksHigh: number

  if (growType === 'indoor') {
    const area = lengthFt * widthFt
    // Wattage per sq ft
    let wattsPerSqFt: number
    let gramsPerWatt: [number, number]

    switch (light) {
      case 'led':
        wattsPerSqFt = 32
        gramsPerWatt = [1, 2]
        break
      case 'hps':
        wattsPerSqFt = 50
        gramsPerWatt = [0.5, 1]
        break
      case 'cfl':
        wattsPerSqFt = 60
        gramsPerWatt = [0.25, 0.5]
        break
      case 'fluorescent':
      default:
        wattsPerSqFt = 40
        gramsPerWatt = [0.25, 0.5]
        break
    }

    recommendedWattage = Math.round(area * wattsPerSqFt)
    const totalWatts = recommendedWattage

    // Yield per plant based on wattage and grams per watt
    const wattsPerPlant = plants > 0 ? totalWatts / plants : totalWatts
    baseYieldLow = wattsPerPlant * gramsPerWatt[0]
    baseYieldHigh = wattsPerPlant * gramsPerWatt[1]

    // Cap at reasonable per-plant maximums for indoor
    baseYieldLow = Math.min(baseYieldLow, 200)
    baseYieldHigh = Math.min(baseYieldHigh, 500)

    // Electricity: 18hr veg for ~4 weeks, 12hr flower for ~8 weeks
    // Average 15 hrs/day over full cycle
    const dailyKwh = (totalWatts * 15) / 1000
    const monthlyCost = dailyKwh * 30 * 0.13 // $0.13/kWh avg
    monthlyElectricity = Math.round(monthlyCost)

    // Timeline
    switch (strain) {
      case 'auto':
        timelineWeeksLow = 8
        timelineWeeksHigh = 10
        break
      case 'indica':
        timelineWeeksLow = 12
        timelineWeeksHigh = 16
        break
      case 'sativa':
        timelineWeeksLow = 16
        timelineWeeksHigh = 24
        break
      case 'hybrid':
      default:
        timelineWeeksLow = 14
        timelineWeeksHigh = 20
        break
    }
  } else {
    // Outdoor
    let climateMultiplier: number
    switch (climate) {
      case 'hot':
        climateMultiplier = 1.2
        break
      case 'warm':
        climateMultiplier = 1.0
        break
      case 'temperate':
        climateMultiplier = 0.75
        break
      case 'cool':
      default:
        climateMultiplier = 0.5
        break
    }

    baseYieldLow = 200 * climateMultiplier
    baseYieldHigh = 800 * climateMultiplier

    // Timeline (outdoor is generally longer due to natural photoperiod)
    switch (strain) {
      case 'auto':
        timelineWeeksLow = 10
        timelineWeeksHigh = 12
        break
      case 'indica':
        timelineWeeksLow = 16
        timelineWeeksHigh = 20
        break
      case 'sativa':
        timelineWeeksLow = 20
        timelineWeeksHigh = 28
        break
      case 'hybrid':
      default:
        timelineWeeksLow = 18
        timelineWeeksHigh = 24
        break
    }
  }

  // Medium modifier
  let mediumMod: number
  switch (medium) {
    case 'hydro':
      mediumMod = 1.2
      break
    case 'coco':
      mediumMod = 1.1
      break
    case 'soil':
    default:
      mediumMod = 1.0
      break
  }

  // Strain yield modifier
  let strainYieldMod: number
  switch (strain) {
    case 'sativa':
      strainYieldMod = 1.1
      break
    case 'indica':
      strainYieldMod = 0.95
      break
    case 'auto':
      strainYieldMod = 0.7
      break
    case 'hybrid':
    default:
      strainYieldMod = 1.0
      break
  }

  const finalYieldLow = Math.round(
    baseYieldLow * mediumMod * strainYieldMod
  )
  const finalYieldHigh = Math.round(
    baseYieldHigh * mediumMod * strainYieldMod
  )

  // Water estimate (liters per plant per day during flowering)
  let waterPerDay: number
  if (medium === 'hydro') {
    waterPerDay = plants * 3.5
  } else if (medium === 'coco') {
    waterPerDay = plants * 2.5
  } else {
    waterPerDay = plants * 1.5
  }
  if (growType === 'outdoor' && (climate === 'hot' || climate === 'warm')) {
    waterPerDay *= 1.3
  }

  // Pot size recommendation
  let potSize: string
  if (growType === 'outdoor') {
    potSize = strain === 'auto' ? '5-7 gallon' : '10-20 gallon'
  } else {
    potSize = strain === 'auto' ? '3-5 gallon' : '5-7 gallon'
  }
  if (medium === 'hydro') potSize = 'N/A (reservoir system)'

  // Tips
  const tips: string[] = []

  if (growType === 'indoor') {
    if (light === 'led') {
      tips.push(
        'Keep LED lights 18-24 inches from canopy during flowering to prevent light burn'
      )
    }
    if (light === 'hps') {
      tips.push(
        'Ensure adequate ventilation since HPS lights generate significant heat'
      )
    }
    if (heightFt < 6) {
      tips.push(
        'With limited height, use training techniques like LST or SCROG to keep plants short'
      )
    }
    tips.push(
      'Maintain relative humidity at 40-50% during flowering to prevent mold'
    )
  } else {
    if (climate === 'cool') {
      tips.push(
        'Choose fast-finishing indica or auto-flower strains for cooler climates'
      )
    }
    if (climate === 'hot') {
      tips.push(
        'Provide afternoon shade and mulch the soil to prevent roots from overheating'
      )
    }
    tips.push(
      'Start plants indoors under lights before transplanting outside after last frost'
    )
  }

  if (medium === 'hydro') {
    tips.push('Monitor pH daily and maintain it between 5.5 and 6.5')
  }
  if (medium === 'coco') {
    tips.push(
      'Water coco coir more frequently than soil as it dries faster, but feed with every watering'
    )
  }
  if (strain === 'auto') {
    tips.push(
      'Auto-flowers cannot be cloned effectively, so plan your seed count accordingly'
    )
  }
  if (strain === 'sativa') {
    tips.push(
      'Sativas stretch significantly during early flowering, so switch to 12/12 light cycle while plants are still small'
    )
  }

  return {
    yieldPerPlant: [finalYieldLow, finalYieldHigh],
    totalYield: [finalYieldLow * plants, finalYieldHigh * plants],
    recommendedWattage,
    monthlyElectricity,
    timelineWeeks: [timelineWeeksLow, timelineWeeksHigh],
    waterPerDay: Math.round(waterPerDay * 10) / 10,
    potSize,
    tips: tips.slice(0, 5),
  }
}

export default function GrowCalculator() {
  const [growType, setGrowType] = useState<GrowType>('indoor')
  const [light, setLight] = useState<LightType>('led')
  const [climate, setClimate] = useState<Climate>('warm')
  const [medium, setMedium] = useState<Medium>('soil')
  const [strain, setStrain] = useState<StrainType>('hybrid')
  const [plants, setPlants] = useState('4')
  const [length, setLength] = useState('4')
  const [width, setWidth] = useState('4')
  const [height, setHeight] = useState('7')
  const [area, setArea] = useState('100')
  const [results, setResults] = useState<Results | null>(null)

  const handleCalculate = () => {
    const p = parseInt(plants) || 1
    const l = parseFloat(length) || 4
    const w = parseFloat(width) || 4
    const h = parseFloat(height) || 7
    const a = parseFloat(area) || 100

    setResults(
      calculate(
        growType,
        growType === 'indoor' ? light : null,
        growType === 'outdoor' ? climate : null,
        medium,
        strain,
        p,
        l,
        w,
        h,
        a
      )
    )
  }

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Grow Type */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Grow Type
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => {
              setGrowType('indoor')
              setResults(null)
            }}
            className={`flex flex-col items-center gap-2 p-5 rounded-xl border-2 transition-all ${
              growType === 'indoor'
                ? 'ring-2 ring-green-500 bg-green-50 border-green-500'
                : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
            }`}
          >
            <span className="text-3xl">🏠</span>
            <span
              className={`font-semibold ${
                growType === 'indoor' ? 'text-green-700' : 'text-gray-700'
              }`}
            >
              Indoor
            </span>
          </button>
          <button
            onClick={() => {
              setGrowType('outdoor')
              setResults(null)
            }}
            className={`flex flex-col items-center gap-2 p-5 rounded-xl border-2 transition-all ${
              growType === 'outdoor'
                ? 'ring-2 ring-green-500 bg-green-50 border-green-500'
                : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
            }`}
          >
            <span className="text-3xl">🌳</span>
            <span
              className={`font-semibold ${
                growType === 'outdoor' ? 'text-green-700' : 'text-gray-700'
              }`}
            >
              Outdoor
            </span>
          </button>
        </div>
      </div>

      {/* Space & Environment */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {growType === 'indoor'
            ? 'Space Dimensions & Lighting'
            : 'Space & Climate'}
        </h2>

        {growType === 'indoor' ? (
          <>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Length (ft)
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Width (ft)
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Height (ft)
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Lighting Type
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {LIGHT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setLight(opt.value)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${
                      light === opt.value
                        ? 'ring-2 ring-green-500 bg-green-50 border-green-500'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <span className="text-xl">{opt.icon}</span>
                    <span
                      className={`text-sm font-medium ${
                        light === opt.value
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
          </>
        ) : (
          <>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grow Area (sq ft)
              </label>
              <input
                type="number"
                min="1"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full sm:w-48 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Climate</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {CLIMATE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setClimate(opt.value)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${
                      climate === opt.value
                        ? 'ring-2 ring-green-500 bg-green-50 border-green-500'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <span className="text-xl">{opt.icon}</span>
                    <span
                      className={`text-sm font-medium ${
                        climate === opt.value
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
          </>
        )}
      </div>

      {/* Growing Details */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Growing Details
        </h2>

        <div className="grid sm:grid-cols-3 gap-6">
          {/* Plants */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Plants
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={plants}
              onChange={(e) => setPlants(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            />
          </div>

          {/* Medium */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">
              Growing Medium
            </p>
            <div className="space-y-2">
              {MEDIUM_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setMedium(opt.value)}
                  className={`w-full flex items-center gap-2 p-2.5 rounded-lg border-2 text-left transition-all ${
                    medium === opt.value
                      ? 'ring-2 ring-green-500 bg-green-50 border-green-500'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <span>{opt.icon}</span>
                  <span
                    className={`text-sm font-medium ${
                      medium === opt.value
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

          {/* Strain */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">
              Strain Type
            </p>
            <div className="space-y-2">
              {STRAIN_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setStrain(opt.value)}
                  className={`w-full p-2.5 rounded-lg border-2 text-left transition-all ${
                    strain === opt.value
                      ? 'ring-2 ring-green-500 bg-green-50 border-green-500'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <span
                    className={`text-sm font-medium ${
                      strain === opt.value
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
        </div>

        <button
          onClick={handleCalculate}
          className="mt-6 w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white rounded-lg px-6 py-3 font-semibold transition-colors"
        >
          Calculate Grow Estimates
        </button>
      </div>

      {/* Results */}
      {results && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Your Grow Estimates
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Yield per Plant</p>
              <p className="text-2xl font-bold text-gray-900">
                {results.yieldPerPlant[0]}-{results.yieldPerPlant[1]}g
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">
                Total Yield ({plants} plants)
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {results.totalYield[0].toLocaleString()}-
                {results.totalYield[1].toLocaleString()}g
              </p>
              <p className="text-xs text-gray-400 mt-1">
                ({(results.totalYield[0] / 28.35).toFixed(0)}-
                {(results.totalYield[1] / 28.35).toFixed(0)} oz)
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Grow Timeline</p>
              <p className="text-2xl font-bold text-gray-900">
                {results.timelineWeeks[0]}-{results.timelineWeeks[1]} weeks
              </p>
            </div>
            {results.recommendedWattage !== null && (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">
                  Recommended Wattage
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {results.recommendedWattage}W
                </p>
              </div>
            )}
            {results.monthlyElectricity !== null && (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">
                  Est. Monthly Electricity
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  ${results.monthlyElectricity}/mo
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Based on $0.13/kWh avg
                </p>
              </div>
            )}
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Water Usage</p>
              <p className="text-2xl font-bold text-gray-900">
                ~{results.waterPerDay}L/day
              </p>
              <p className="text-xs text-gray-400 mt-1">During flowering</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Pot Size</p>
              <p className="text-2xl font-bold text-gray-900">
                {results.potSize}
              </p>
            </div>
          </div>

          {/* Tips */}
          {results.tips.length > 0 && (
            <div className="border-t border-gray-100 pt-6">
              <h3 className="font-semibold text-gray-900 mb-3">
                Tips for Maximizing Your Yield
              </h3>
              <ul className="space-y-2">
                {results.tips.map((tip, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-gray-600"
                  >
                    <span className="bg-green-100 text-green-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {i + 1}
                    </span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
