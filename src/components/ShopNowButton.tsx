'use client';

import { useState } from 'react';

interface ShopNowButtonProps {
  sellerId?: string;
  productId?: string;
  dispensaryId?: string;
  destinationUrl: string;
  buttonText?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  showIcon?: boolean;
}

export default function ShopNowButton({
  sellerId,
  productId,
  dispensaryId,
  destinationUrl,
  buttonText = 'Shop Now',
  className = '',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  showIcon = true,
}: ShopNowButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);

    try {
      // Get UTM parameters from current URL
      const currentParams = new URLSearchParams(window.location.search);

      // Track the lead
      const response = await fetch('/api/leads/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sellerId,
          productId,
          dispensaryId,
          destinationUrl,
          referrerUrl: window.location.href,
          utmSource: currentParams.get('utm_source'),
          utmMedium: currentParams.get('utm_medium'),
          utmCampaign: currentParams.get('utm_campaign'),
        }),
      });

      if (response.ok) {
        const { trackingUrl } = await response.json();
        // Open seller's website in new tab with tracking
        window.open(trackingUrl, '_blank', 'noopener,noreferrer');
      } else {
        // Fallback: direct redirect without tracking
        window.open(destinationUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      console.error('Lead tracking failed:', error);
      // Fallback: direct redirect without tracking
      window.open(destinationUrl, '_blank', 'noopener,noreferrer');
    } finally {
      setLoading(false);
    }
  };

  // Style variants
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary: 'bg-green-600 text-white hover:bg-green-700',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    outline: 'border-2 border-green-600 text-green-600 hover:bg-green-50',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-5 py-2.5 text-base gap-2',
    lg: 'px-6 py-3.5 text-lg gap-2',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Redirecting...</span>
        </>
      ) : (
        <>
          <span>{buttonText}</span>
          {showIcon && (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          )}
        </>
      )}
    </button>
  );
}

// Variant for dispensary visits
export function VisitWebsiteButton({
  dispensaryId,
  websiteUrl,
  className = '',
}: {
  dispensaryId: string;
  websiteUrl: string;
  className?: string;
}) {
  return (
    <ShopNowButton
      dispensaryId={dispensaryId}
      destinationUrl={websiteUrl}
      buttonText="Visit Website"
      variant="outline"
      className={className}
    />
  );
}

// Variant for product pages
export function BuyNowButton({
  sellerId,
  productId,
  destinationUrl,
  className = '',
}: {
  sellerId: string;
  productId: string;
  destinationUrl: string;
  className?: string;
}) {
  return (
    <ShopNowButton
      sellerId={sellerId}
      productId={productId}
      destinationUrl={destinationUrl}
      buttonText="Buy Now"
      variant="primary"
      size="lg"
      fullWidth
      className={className}
    />
  );
}
