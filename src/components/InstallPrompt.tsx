'use client'

import { useState, useEffect } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

declare function gtag(...args: any[]): void

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    const standalone = window.matchMedia('(display-mode: standalone)').matches
      || (window.navigator as any).standalone === true
    setIsStandalone(standalone)

    const ios = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase())
    setIsIOS(ios)

    // Wait for age verification to be dismissed before showing install prompt
    const waitForAgeVerification = () => {
      const isVerified = localStorage.getItem('leefii_age_verified')
      return isVerified === 'true'
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      // Show after 5 seconds, but only after age verification is done
      const checkAndShow = () => {
        if (waitForAgeVerification()) {
          setShowPrompt(true)
        } else {
          // Re-check every 2 seconds until age verification is done
          setTimeout(checkAndShow, 2000)
        }
      }
      setTimeout(checkAndShow, 5000)
    }

    window.addEventListener('beforeinstallprompt', handler)

    if (ios && !standalone) {
      const dismissed = localStorage.getItem('leefii-install-dismissed')
      if (!dismissed) {
        const checkAndShow = () => {
          if (waitForAgeVerification()) {
            setShowPrompt(true)
          } else {
            setTimeout(checkAndShow, 2000)
          }
        }
        setTimeout(checkAndShow, 5000)
      }
    }

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setShowPrompt(false)
        if (typeof gtag !== 'undefined') {
          gtag('event', 'pwa_install', { method: 'prompt' })
        }
      }
      setDeferredPrompt(null)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('leefii-install-dismissed', Date.now().toString())
  }

  if (isStandalone || !showPrompt) return null

  return (
    <div
      className="fixed bottom-4 left-4 right-4 z-[9998] md:left-auto md:right-4 md:max-w-sm"
      style={{ touchAction: 'manipulation' }}
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-sm">Add Leefii to Home Screen</h3>
            <p className="text-xs text-gray-500 mt-1">
              {isIOS
                ? 'Tap the Share button, then "Add to Home Screen" for quick access.'
                : 'Install Leefii for quick access to dispensaries, strains, and deals.'}
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 flex-shrink-0 p-2 -m-1"
            aria-label="Dismiss"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {!isIOS && deferredPrompt && (
          <button
            onClick={handleInstall}
            className="mt-3 w-full py-3 bg-green-600 text-white rounded-xl text-sm font-semibold
              hover:bg-green-700 active:bg-green-800 transition-colors select-none"
            style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
          >
            Install App
          </button>
        )}

        {isIOS && (
          <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-xl">
            <svg className="w-5 h-5 flex-shrink-0 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span>Tap the <strong>Share</strong> button below, then <strong>&quot;Add to Home Screen&quot;</strong></span>
          </div>
        )}
      </div>
    </div>
  )
}
