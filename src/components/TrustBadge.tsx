'use client'

import { useState } from 'react'
import VerificationModal from './VerificationModal'

type TrustBadgeProps = {
  verificationDate: string | null
  verificationMethod: string | null
  verificationStatus: string
  verifiedBy: string | null
  isClaimed: boolean
  claimedDate?: string | null
  menuAccuracyScore?: number | null
  inaccuracyReportsCount?: number | null
  lastReportedInaccuracy?: string | null
  communityConfirmations?: number | null
  size: 'full' | 'mini'
}

type BadgeColor = 'green' | 'amber' | 'orange' | 'gray'

function getVerificationState(verificationDate: string | null): { level: 'today' | 'week' | 'month' | 'unverified'; color: BadgeColor; label: string } {
  if (!verificationDate) {
    return { level: 'unverified', color: 'gray', label: 'Unverified' }
  }

  const date = new Date(verificationDate)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

  if (diffHours < 24) {
    const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    return { level: 'today', color: 'green', label: `Verified today at ${time}` }
  }

  if (diffDays < 7) {
    const daysText = diffDays === 1 ? '1 day ago' : `${diffDays} days ago`
    return { level: 'week', color: 'amber', label: `Verified ${daysText}` }
  }

  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    const weeksText = weeks === 1 ? '1 week ago' : `${weeks} weeks ago`
    return { level: 'month', color: 'orange', label: `Verified ${weeksText}` }
  }

  return { level: 'unverified', color: 'gray', label: 'Unverified' }
}

function formatMethod(method: string | null): string {
  if (!method) return 'Unknown'
  const map: Record<string, string> = {
    PHONE_CALL: 'Phone Call',
    EMAIL: 'Email',
    IN_PERSON: 'In Person',
    WEBSITE_CHECK: 'Website Check',
    POS_SYNC: 'POS Sync',
    SELF_REPORTED: 'Self Reported',
  }
  return map[method] || method
}

const badgeStyles = {
  green: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-200',
    dot: 'bg-green-500',
  },
  amber: {
    bg: 'bg-amber-100',
    text: 'text-amber-800',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
  },
  orange: {
    bg: 'bg-orange-100',
    text: 'text-orange-800',
    border: 'border-orange-200',
    dot: 'bg-orange-500',
  },
  gray: {
    bg: 'bg-gray-100',
    text: 'text-gray-600',
    border: 'border-gray-200',
    dot: 'bg-gray-400',
  },
}

export default function TrustBadge({
  verificationDate,
  verificationMethod,
  verificationStatus,
  verifiedBy,
  isClaimed,
  claimedDate,
  menuAccuracyScore,
  inaccuracyReportsCount,
  lastReportedInaccuracy,
  communityConfirmations,
  size,
}: TrustBadgeProps) {
  const [showModal, setShowModal] = useState(false)
  const state = getVerificationState(verificationDate)
  const styles = badgeStyles[state.color]
  const showCheckmark = state.level === 'today' || state.level === 'week'

  if (size === 'mini') {
    const shortLabel = state.level === 'unverified'
      ? 'Unverified'
      : state.level === 'today'
        ? 'Verified today'
        : (() => {
          const date = new Date(verificationDate!)
          const diffDays = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24))
          return diffDays < 7 ? `Verified ${diffDays}d ago` : `Verified ${Math.floor(diffDays / 7)}w ago`
        })()

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${styles.bg} ${styles.text}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
        {shortLabel}
      </span>
    )
  }

  const isCommunityVerified = communityConfirmations != null && communityConfirmations >= 10

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors hover:opacity-80 ${styles.bg} ${styles.text} ${styles.border}`}
      >
        {showCheckmark && (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
        <span className={`w-2 h-2 rounded-full ${styles.dot}`} />
        {state.label}
      </button>

      {isCommunityVerified && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
          </svg>
          Community Verified
        </span>
      )}

      {showModal && (
        <VerificationModal
          verificationDate={verificationDate}
          verificationMethod={verificationMethod}
          verificationStatus={verificationStatus}
          verifiedBy={verifiedBy}
          isClaimed={isClaimed}
          claimedDate={claimedDate}
          menuAccuracyScore={menuAccuracyScore}
          inaccuracyReportsCount={inaccuracyReportsCount}
          lastReportedInaccuracy={lastReportedInaccuracy}
          state={state}
          formatMethod={formatMethod}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}

export { getVerificationState, formatMethod, badgeStyles }
