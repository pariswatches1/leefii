// Verification tier system — computed dynamically from verificationDate
// No cron needed: the display tier is always derived from elapsed time

export type VerificationTier = 'verified-today' | 'verified-week' | 'verified-month' | 'unverified'

export interface VerificationInfo {
  tier: VerificationTier
  label: string
  description: string
  bgClass: string
  textClass: string
  borderClass: string
  dotClass: string
}

const VERIFICATION_METHOD_LABELS: Record<string, string> = {
  PHONE_CALL: 'Phone Call',
  EMAIL: 'Email Confirmation',
  IN_PERSON: 'In-Person Visit',
  WEBSITE_CHECK: 'Website Check',
  POS_SYNC: 'POS System Sync',
  SELF_REPORTED: 'Self-Reported',
}

export function getVerificationMethodLabel(method: string | null | undefined): string {
  if (!method) return 'Unknown'
  return VERIFICATION_METHOD_LABELS[method] || method
}

export function getVerificationTier(verificationDate: Date | string | null | undefined): VerificationInfo {
  if (!verificationDate) {
    return {
      tier: 'unverified',
      label: 'Unverified',
      description: 'This dispensary has not been verified yet.',
      bgClass: 'bg-gray-100',
      textClass: 'text-gray-600',
      borderClass: 'border-l-gray-300',
      dotClass: 'bg-gray-400',
    }
  }

  const date = typeof verificationDate === 'string' ? new Date(verificationDate) : verificationDate
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = diffMs / (1000 * 60 * 60)
  const diffDays = diffMs / (1000 * 60 * 60 * 24)

  if (diffHours <= 24) {
    const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    return {
      tier: 'verified-today',
      label: `Verified today at ${timeStr}`,
      description: 'This dispensary was verified within the last 24 hours. Menu and info are highly accurate.',
      bgClass: 'bg-green-100',
      textClass: 'text-green-700',
      borderClass: 'border-l-green-400',
      dotClass: 'bg-green-500',
    }
  }

  if (diffDays <= 7) {
    const days = Math.floor(diffDays)
    return {
      tier: 'verified-week',
      label: `Verified ${days} day${days === 1 ? '' : 's'} ago`,
      description: 'This dispensary was verified within the last week. Info is likely current.',
      bgClass: 'bg-yellow-100',
      textClass: 'text-yellow-700',
      borderClass: 'border-l-yellow-400',
      dotClass: 'bg-yellow-500',
    }
  }

  if (diffDays <= 30) {
    const weeks = Math.floor(diffDays / 7)
    return {
      tier: 'verified-month',
      label: `Verified ${weeks} week${weeks === 1 ? '' : 's'} ago`,
      description: 'This dispensary was verified within the last month. Some details may have changed.',
      bgClass: 'bg-orange-100',
      textClass: 'text-orange-700',
      borderClass: 'border-l-orange-400',
      dotClass: 'bg-orange-500',
    }
  }

  // Older than 30 days — treat as unverified
  return {
    tier: 'unverified',
    label: 'Unverified',
    description: 'This dispensary has not been recently verified. Info may be outdated.',
    bgClass: 'bg-gray-100',
    textClass: 'text-gray-600',
    borderClass: 'border-l-gray-300',
    dotClass: 'bg-gray-400',
  }
}

export function formatVerificationDate(date: Date | string | null | undefined): string {
  if (!date) return 'Never'
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}
