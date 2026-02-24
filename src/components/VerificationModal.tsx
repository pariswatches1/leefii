'use client'

import { useEffect } from 'react'
import Link from 'next/link'

type VerificationState = {
  level: 'today' | 'week' | 'month' | 'unverified'
  color: string
  label: string
}

type VerificationModalProps = {
  verificationDate: string | null
  verificationMethod: string | null
  verificationStatus: string
  verifiedBy: string | null
  isClaimed: boolean
  claimedDate?: string | null
  menuAccuracyScore?: number | null
  inaccuracyReportsCount?: number | null
  lastReportedInaccuracy?: string | null
  state: VerificationState
  formatMethod: (method: string | null) => string
  onClose: () => void
}

const statusDescriptions: Record<string, string> = {
  today: 'This dispensary was verified within the last 24 hours. Menu, hours, and contact information are confirmed accurate.',
  week: 'This dispensary was verified within the past week. Information should be current.',
  month: 'This listing was verified over a week ago. Some details may have changed since then.',
  unverified: "This dispensary hasn't been verified yet. Information may not be current.",
}

export default function VerificationModal({
  verificationDate,
  verificationMethod,
  verifiedBy,
  isClaimed,
  claimedDate,
  menuAccuracyScore,
  inaccuracyReportsCount,
  lastReportedInaccuracy,
  state,
  formatMethod,
  onClose,
}: VerificationModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [onClose])

  const formattedDate = verificationDate
    ? new Date(verificationDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  const formattedTime = verificationDate
    ? new Date(verificationDate).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      })
    : null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="fixed inset-0 bg-black/50" />
      <div
        className="relative bg-white rounded-xl shadow-lg max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Verification Details</h3>
        <p className="text-sm text-gray-500 mb-4">{statusDescriptions[state.level]}</p>

        {/* Status indicator */}
        <div className="space-y-4">
          {/* Verification info */}
          {verificationDate ? (
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Last Verified</span>
                <span className="text-sm font-medium text-gray-900">{formattedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Time</span>
                <span className="text-sm font-medium text-gray-900">{formattedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Method</span>
                <span className="text-sm font-medium text-gray-900">{formatMethod(verificationMethod)}</span>
              </div>
              {verifiedBy && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Verified By</span>
                  <span className="text-sm font-medium text-gray-900">{verifiedBy}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500">No verification data available yet.</p>
              <p className="text-xs text-gray-400 mt-1">We&apos;re working on verifying all dispensaries.</p>
            </div>
          )}

          {/* Menu accuracy score */}
          {menuAccuracyScore != null && (
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-500">Menu Accuracy</span>
                <span className="text-sm font-medium text-gray-900">{menuAccuracyScore}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    menuAccuracyScore >= 80 ? 'bg-green-500' : menuAccuracyScore >= 50 ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${menuAccuracyScore}%` }}
                />
              </div>
            </div>
          )}

          {/* Inaccuracy reports */}
          {inaccuracyReportsCount != null && inaccuracyReportsCount > 0 && (
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Inaccuracy Reports (30 days)</span>
              <span className="text-sm font-medium text-gray-900">{inaccuracyReportsCount}</span>
            </div>
          )}

          {/* Claimed status */}
          {isClaimed && (
            <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-green-700">Claimed by owner</span>
              {claimedDate && (
                <span className="text-xs text-gray-400">
                  {new Date(claimedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
              )}
            </div>
          )}

          {/* Learn more link */}
          <div className="pt-3 mt-3 border-t border-gray-100 text-center">
            <Link
              href="/how-we-verify"
              className="text-sm text-green-600 hover:text-green-700 hover:underline font-medium"
              onClick={() => onClose()}
            >
              Learn how we verify dispensaries →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
