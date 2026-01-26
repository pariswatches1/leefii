'use client';

import { useState } from 'react';
import ShopNowButton from '@/components/ShopNowButton';

interface ProductBuySectionProps {
  productId: string;
  sellerId: string;
  productName: string;
  sellerWebsite: string | null;
  sellerPhone: string | null;
  sellerName: string;
}

export default function ProductBuySection({
  productId,
  sellerId,
  productName,
  sellerWebsite,
  sellerPhone,
  sellerName,
}: ProductBuySectionProps) {
  const [showInquiry, setShowInquiry] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: `Hi, I'm interested in ${productName}. Please let me know if it's available.`,
  });

  async function handleInquirySubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          sellerId,
          ...formData,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to send inquiry');
        return;
      }

      setInquirySuccess(true);
      setShowInquiry(false);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // If seller has a website, show the Buy Now button
  if (sellerWebsite) {
    return (
      <div className="space-y-4">
        <ShopNowButton
          sellerId={sellerId}
          productId={productId}
          destinationUrl={sellerWebsite}
          buttonText="Buy Now"
          variant="primary"
          size="lg"
          fullWidth
        />
        <p className="text-center text-sm text-gray-500">
          You will be redirected to {sellerName}&apos;s website to complete your purchase
        </p>

        {/* Also show inquiry option */}
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={() => setShowInquiry(!showInquiry)}
            className="w-full text-gray-600 text-sm hover:text-green-600"
          >
            Have a question? Send an inquiry
          </button>

          {showInquiry && (
            <form onSubmit={handleInquirySubmit} className="mt-4 space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm">
                  {error}
                </div>
              )}
              <input
                type="text"
                placeholder="Your name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              />
              <input
                type="email"
                placeholder="Your email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              />
              <textarea
                placeholder="Your message"
                rows={3}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 text-white py-2 rounded-lg font-medium hover:bg-gray-800 transition disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Inquiry'}
              </button>
            </form>
          )}
        </div>

        {inquirySuccess && (
          <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg text-sm">
            Your inquiry has been sent! The seller will get back to you soon.
          </div>
        )}
      </div>
    );
  }

  // If no website, show phone contact option
  if (sellerPhone) {
    return (
      <div className="space-y-4">
        <div className="bg-gray-50 rounded-xl p-6 text-center">
          <p className="text-gray-600 mb-4">
            Contact {sellerName} directly to purchase this product
          </p>
          <a
            href={`tel:${sellerPhone}`}
            className="inline-flex items-center justify-center gap-2 w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Call {sellerPhone}
          </a>
        </div>

        {/* Also show inquiry option */}
        <div className="pt-4">
          <button
            onClick={() => setShowInquiry(!showInquiry)}
            className="w-full text-gray-600 text-sm hover:text-green-600"
          >
            Or send a written inquiry
          </button>

          {showInquiry && (
            <form onSubmit={handleInquirySubmit} className="mt-4 space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm">
                  {error}
                </div>
              )}
              <input
                type="text"
                placeholder="Your name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              />
              <input
                type="email"
                placeholder="Your email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              />
              <input
                type="tel"
                placeholder="Your phone (optional)"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              />
              <textarea
                placeholder="Your message"
                rows={3}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 text-white py-2 rounded-lg font-medium hover:bg-gray-800 transition disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Inquiry'}
              </button>
            </form>
          )}
        </div>

        {inquirySuccess && (
          <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg text-sm">
            Your inquiry has been sent! The seller will get back to you soon.
          </div>
        )}
      </div>
    );
  }

  // No website or phone, just show inquiry form
  return (
    <div className="space-y-4">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800 mb-4">
        This seller doesn&apos;t have an online store. Send them an inquiry to learn how to purchase.
      </div>

      <form onSubmit={handleInquirySubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}
        {inquirySuccess && (
          <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg text-sm">
            Your inquiry has been sent! The seller will get back to you soon.
          </div>
        )}
        <input
          type="text"
          placeholder="Your name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
        />
        <input
          type="email"
          placeholder="Your email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
        />
        <input
          type="tel"
          placeholder="Your phone (optional)"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
        />
        <textarea
          placeholder="Your message"
          rows={4}
          required
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
        />
        <button
          type="submit"
          disabled={loading || inquirySuccess}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
        >
          {loading ? 'Sending...' : inquirySuccess ? 'Inquiry Sent!' : 'Send Inquiry'}
        </button>
      </form>
    </div>
  );
}
