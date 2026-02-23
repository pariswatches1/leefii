'use client'

import { useState } from 'react'
import {
  getVerificationTier,
  getVerificationMethodLabel,
  formatVerificationDate,
  type VerificationTier,
} from '@/lib/verification'

interface TrustBadgeProps {
  verificationDate: string | null
  verificationMethod?: string | null
  verifiedBy?: string | null
  menuAccuracyScore?: number | null
  isClaimed?: boolean
  size?: 'sm' | 'md' | 'lg'
  showModal?: boolean
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  )
}

function ShieldGrayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  )
}

export default function TrustBadge({
  verificationDate,
  verificationMethod,
  verifiedBy,
  menuAccuracyScore,
  isClaimed,
  size = 'md',
  showModal = false,
}: TrustBadgeProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const info = getVerificationTier(verificationDate)

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-sm gap-1.5',
    lg: 'px-3 py-1.5 text-sm gap-2',
  }

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  }

  const isVerified = info.tier !== 'unverified'
  const Icon = isVerified ? ShieldIcon : ShieldGrayIcon

  return (
    <>
      <button
        type="button"
        onClick={showModal ? () => setModalOpen(true) : undefined}
        className={`inline-flex items-center rounded-full font-medium ${info.bgClass} ${info.textClass} ${sizeClasses[size]} ${showModal ? 'cursor-pointer hover:opacity-80 transition' : 'cursor-default'}`}
      >
        <Icon className={iconSizes[size]} />
        <span>{info.label}</span>
      </button>

      {/* Modal */}
      {showModal && modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setModalOpen(false)}>
          <div className="fixed inset-0 bg-black/50" />
          <div
            className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${info.bgClass}`}>
                <Icon className={`w-5 h-5 ${info.textClass}`} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Verification Status</h3>
                <p className={`text-sm font-medium ${info.textClass}`}>{info.label}</p>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4">{info.description}</p>

            {/* Details */}
            <div className="space-y-3 mb-5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Last Verified</span>
                <span className="font-medium text-gray-900">{formatVerificationDate(verificationDate)}</span>
              </div>
              {verificationMethod && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Method</span>
                  <span className="font-medium text-gray-900">{getVerificationMethodLabel(verificationMethod)}</span>
                </div>
              )}
              {verifiedBy && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Verified By</span>
                  <span className="font-medium text-gray-900">{verifiedBy}</span>
                </div>
              )}
              {isClaimed && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Claimed</span>
                  <span className="font-medium text-blue-600">Owner Claimed</span>
                </div>
              )}
              {menuAccuracyScore != null && (
                <div className="text-sm">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-500">Menu Accuracy</span>
                    <span className="font-medium text-gray-900">{menuAccuracyScore}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        menuAccuracyScore >= 80
                          ? 'bg-green-500'
                          : menuAccuracyScore >= 50
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(0, menuAccuracyScore))}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Explanation */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">What does verification mean?</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Leefii verifies dispensaries through phone calls, in-person visits, and direct partnerships.
                A verified badge means we&apos;ve confirmed this dispensary&apos;s hours, address, and contact info are accurate.
                The fresher the verification, the more confident you can be that the info is up-to-date.
              </p>
              <div className="mt-3 space-y-1.5">
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-gray-600">Green = Verified within 24 hours</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full bg-yellow-500" />
                  <span className="text-gray-600">Yellow = Verified within 7 days</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  <span className="text-gray-600">Orange = Verified within 30 days</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full bg-gray-400" />
                  <span className="text-gray-600">Gray = Not yet verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// Lightweight server-renderable inline badge (no modal, no interactivity)
export function InlineVerificationBadge({
  verificationDate,
  size = 'sm',
}: {
  verificationDate: string | null
  size?: 'sm' | 'md'
}) {
  const info = getVerificationTier(verificationDate)
  const isVerified = info.tier !== 'unverified'

  if (!isVerified) return null

  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-xs gap-1',
    md: 'px-2 py-0.5 text-xs gap-1',
  }

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${info.bgClass} ${info.textClass} ${sizeClasses[size]}`}>
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
      <span>{info.tier === 'verified-today' ? 'Verified' : info.label}</span>
    </span>
  )
}
