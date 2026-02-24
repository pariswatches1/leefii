'use client'

import { useState } from 'react'
import ReportInaccuracyModal from './ReportInaccuracyModal'

type ReportInaccuracyButtonProps = {
  dispensaryId: string
  dispensaryName: string
  variant: 'inline' | 'floating'
  preselectedCategory?: string
}

export default function ReportInaccuracyButton({
  dispensaryId,
  dispensaryName,
  variant,
  preselectedCategory,
}: ReportInaccuracyButtonProps) {
  const [showModal, setShowModal] = useState(false)

  if (variant === 'floating') {
    return (
      <>
        <button
          onClick={() => setShowModal(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-full shadow-lg hover:shadow-xl hover:border-red-300 transition-all text-sm font-medium text-gray-700 hover:text-red-600"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          See something wrong?
        </button>

        {showModal && (
          <ReportInaccuracyModal
            dispensaryId={dispensaryId}
            dispensaryName={dispensaryName}
            preselectedCategory={preselectedCategory}
            onClose={() => setShowModal(false)}
          />
        )}
      </>
    )
  }

  // Inline variant
  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
        </svg>
        Report an issue
      </button>

      {showModal && (
        <ReportInaccuracyModal
          dispensaryId={dispensaryId}
          dispensaryName={dispensaryName}
          preselectedCategory={preselectedCategory}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}
