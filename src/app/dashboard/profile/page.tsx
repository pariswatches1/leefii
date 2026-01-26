'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface SellerProfile {
  id: string;
  businessName: string;
  slug: string;
  logo: string | null;
  banner: string | null;
  description: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  licenseNumber: string | null;
  subscriptionTier: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profile, setProfile] = useState<SellerProfile | null>(null);
  const [uploading, setUploading] = useState<'logo' | 'banner' | null>(null);

  const [formData, setFormData] = useState({
    businessName: '',
    description: '',
    phone: '',
    email: '',
    website: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    licenseNumber: '',
    logo: '',
    banner: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const response = await fetch('/api/dashboard/profile');
      const data = await response.json();

      if (data.id) {
        setProfile(data);
        setFormData({
          businessName: data.businessName || '',
          description: data.description || '',
          phone: data.phone || '',
          email: data.email || '',
          website: data.website || '',
          address: data.address || '',
          city: data.city || '',
          state: data.state || '',
          zipCode: data.zipCode || '',
          licenseNumber: data.licenseNumber || '',
          logo: data.logo || '',
          banner: data.banner || '',
        });
      }
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
    setSuccess('');
  }

  async function handleFileUpload(field: 'logo' | 'banner', file: File) {
    setUploading(field);
    setError('');
    try {
      const uploadData = new FormData();
      uploadData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to upload image');
        return;
      }

      setFormData({ ...formData, [field]: data.url });
    } catch {
      setError('Failed to upload image');
    } finally {
      setUploading(null);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const response = await fetch('/api/dashboard/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to update profile');
        setSaving(false);
        return;
      }

      setSuccess('Profile updated successfully!');
      setProfile(data);
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Profile not found</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Business Profile</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage your store profile and business information
        </p>
      </div>

      {/* Subscription Tier Banner */}
      <div className={`mb-6 p-4 rounded-lg ${
        profile.subscriptionTier === 'PREMIUM' ? 'bg-purple-50 border border-purple-200' :
        profile.subscriptionTier === 'STANDARD' ? 'bg-blue-50 border border-blue-200' :
        'bg-gray-50 border border-gray-200'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">
              {profile.subscriptionTier} Plan
            </p>
            <p className="text-sm text-gray-600">
              {profile.subscriptionTier === 'BASIC' && 'Up to 10 products'}
              {profile.subscriptionTier === 'STANDARD' && 'Up to 50 products'}
              {profile.subscriptionTier === 'PREMIUM' && 'Unlimited products + Featured listings'}
            </p>
          </div>
          {profile.subscriptionTier !== 'PREMIUM' && (
            <a
              href="/pricing"
              className="text-green-600 text-sm font-medium hover:underline"
            >
              Upgrade Plan
            </a>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm">
        {/* Header with banner and logo */}
        <div className="relative">
          {/* Banner */}
          <div className="h-32 bg-gray-100 rounded-t-xl overflow-hidden relative">
            {formData.banner && (
              <img
                src={formData.banner}
                alt="Banner"
                className="w-full h-full object-cover"
              />
            )}
            <label className="absolute bottom-2 right-2 cursor-pointer bg-white/80 backdrop-blur rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-white transition">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload('banner', file);
                }}
                disabled={uploading !== null}
              />
              {uploading === 'banner' ? 'Uploading...' : 'Change Banner'}
            </label>
          </div>

          {/* Logo */}
          <div className="absolute -bottom-10 left-6">
            <div className="w-24 h-24 bg-white rounded-xl shadow-lg overflow-hidden border-4 border-white">
              {formData.logo ? (
                <img
                  src={formData.logo}
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-green-100 flex items-center justify-center">
                  <span className="text-2xl font-bold text-green-600">
                    {formData.businessName?.[0] || 'L'}
                  </span>
                </div>
              )}
            </div>
            <label className="absolute -bottom-1 -right-1 cursor-pointer w-8 h-8 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700 transition shadow-lg">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload('logo', file);
                }}
                disabled={uploading !== null}
              />
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </label>
          </div>
        </div>

        <div className="p-6 pt-14">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
              {success}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {/* Business Name */}
            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
                Business Name *
              </label>
              <input
                id="businessName"
                name="businessName"
                type="text"
                required
                value={formData.businessName}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Store URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Store URL
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  leefii.com/shop/
                </span>
                <input
                  type="text"
                  value={profile.slug}
                  disabled
                  className="block w-full px-3 py-2 border border-gray-300 rounded-r-lg bg-gray-50 text-gray-500"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Business Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Website */}
            <div className="md:col-span-2">
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                Website URL
              </label>
              <input
                id="website"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://your-website.com"
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Buyers will be redirected to this website when they click &quot;Buy Now&quot; on your products
              </p>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                About Your Business
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell customers about your business..."
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Address Section */}
            <div className="md:col-span-2 border-t pt-6 mt-2">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Business Address</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address
                  </label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    id="state"
                    name="state"
                    type="text"
                    value={formData.state}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code
                  </label>
                  <input
                    id="zipCode"
                    name="zipCode"
                    type="text"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    License Number
                  </label>
                  <input
                    id="licenseNumber"
                    name="licenseNumber"
                    type="text"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex gap-4 border-t pt-6">
            <button
              type="submit"
              disabled={saving}
              className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <a
              href={`/shop/${profile.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition inline-flex items-center gap-2"
            >
              View Store
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </form>
    </div>
  );
}
