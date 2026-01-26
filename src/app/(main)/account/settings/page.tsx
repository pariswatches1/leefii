'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || '',
        email: session.user.email || '',
      });
    }
  }, [session]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to update profile');
        return;
      }

      // Update the session
      await update({ name: formData.name });
      setSuccess('Profile updated successfully!');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    await signOut({ callbackUrl: '/' });
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-500 mt-1">
          Manage your account preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h2>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Display Name
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Email cannot be changed
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Become a Seller */}
        <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-xl p-6 text-white">
          <h2 className="text-lg font-semibold mb-2">Become a Seller</h2>
          <p className="text-green-100 mb-4">
            Start selling your products on Leefii and reach thousands of customers.
          </p>
          <a
            href="/sell/apply"
            className="inline-block bg-white text-green-600 px-6 py-2 rounded-lg font-medium hover:bg-green-50 transition"
          >
            Apply Now
          </a>
        </div>

        {/* Account Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Actions</h2>

          <div className="space-y-4">
            <button
              onClick={handleSignOut}
              className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition flex items-center gap-3"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>

        {/* Privacy Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Privacy & Data</h2>
          <p className="text-sm text-gray-600 mb-4">
            We respect your privacy. Your personal data is used only to improve your
            experience on Leefii.
          </p>
          <div className="space-y-3">
            <a href="/privacy" className="text-green-600 hover:underline text-sm block">
              View Privacy Policy →
            </a>
            <a href="/terms" className="text-green-600 hover:underline text-sm block">
              View Terms of Service →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
