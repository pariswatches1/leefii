'use client';

import { useState, useEffect } from 'react';

export default function AgeVerification() {
  const [verified, setVerified] = useState<boolean | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Check if already verified
    const isVerified = localStorage.getItem('leefii_age_verified');
    if (isVerified === 'true') {
      setVerified(true);
    } else {
      setVerified(false);
      setShowModal(true);
    }
  }, []);

  const handleVerify = () => {
    localStorage.setItem('leefii_age_verified', 'true');
    localStorage.setItem('leefii_age_verified_date', new Date().toISOString());
    setVerified(true);
    setShowModal(false);
  };

  const handleExit = () => {
    window.location.href = 'https://www.google.com';
  };

  // Don't render anything until we check localStorage (prevents flash)
  if (verified === null) return null;

  // Already verified
  if (verified) return null;

  // Show modal
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center">
            <span className="text-white font-bold text-3xl">L</span>
          </div>
        </div>

        {/* Age Badge */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-green-700 font-bold text-2xl">21+</span>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Age Verification Required
        </h2>

        <p className="text-gray-600 mb-6 leading-relaxed">
          This website contains information about cannabis products.
          You must be at least 21 years of age to enter this site.
        </p>

        <p className="text-sm text-gray-500 mb-6">
          By entering, you confirm that you are of legal age to view cannabis-related
          content in your jurisdiction and agree to our{' '}
          <a href="/terms" className="text-green-600 hover:underline">Terms of Service</a>
          {' '}and{' '}
          <a href="/privacy" className="text-green-600 hover:underline">Privacy Policy</a>.
        </p>

        <div className="space-y-3">
          <button
            onClick={handleVerify}
            className="w-full bg-green-600 text-white py-3.5 rounded-xl font-semibold
              hover:bg-green-700 transition-colors text-lg"
          >
            I am 21 or older — Enter
          </button>

          <button
            onClick={handleExit}
            className="w-full bg-gray-100 text-gray-600 py-3.5 rounded-xl font-medium
              hover:bg-gray-200 transition-colors"
          >
            I am under 21 — Exit
          </button>
        </div>

        <p className="mt-6 text-xs text-gray-400">
          Leefii does not sell cannabis products directly. We connect consumers
          with licensed dispensaries and retailers.
        </p>
      </div>
    </div>
  );
}
