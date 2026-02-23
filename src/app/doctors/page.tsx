'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocation } from '@/components/LocationDetector';

interface Doctor {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  rating: number;
  reviewsCount: number;
  isOpen: boolean | null;
  photoRef: string | null;
  distance: number;
  status: string;
  // Premium fields
  isPremium?: boolean;
  isFeatured?: boolean;
  tier?: string;
  phone?: string;
  website?: string;
  services?: string[];
  telemedicine?: boolean;
  logo?: string;
  slug?: string;
}

interface StateStat {
  abbreviation: string;
  slug: string;
  name: string;
  doctorCount: number;
}

interface DoctorStats {
  totalDoctors: number;
  stateCount: number;
  states: StateStat[];
}

export default function DoctorsPage() {
  const { location, loading: locationLoading } = useLocation();
  const [premiumDoctors, setPremiumDoctors] = useState<Doctor[]>([]);
  const [googleDoctors, setGoogleDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DoctorStats | null>(null);

  // Fetch doctor stats on mount
  useEffect(() => {
    fetch('/api/doctors/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data.totalDoctors !== undefined) {
          setStats(data);
        }
      })
      .catch(() => {
        // Stats are non-critical, silently fail
      });
  }, []);

  useEffect(() => {
    if (locationLoading) return;

    if (!location || typeof location.lat !== 'number' || typeof location.lng !== 'number') {
      setLoading(false);
      setError('Unable to detect your location. Please enable location services or try again.');
      return;
    }

    let cancelled = false;
    const lat = location.lat;
    const lng = location.lng;
    const state = location.state || '';

    async function fetchDoctors() {
      try {
        // Fetch both premium (database) and Google results in parallel
        const [premiumResponse, googleResponse] = await Promise.all([
          fetch(`/api/doctors/premium?lat=${lat}&lng=${lng}&state=${state}`),
          fetch(`/api/doctors/nearby?lat=${lat}&lng=${lng}&radius=80000`),
        ]);

        if (cancelled) return;

        const premiumData = await premiumResponse.json();
        const googleData = await googleResponse.json();

        if (premiumResponse.ok && premiumData.doctors) {
          setPremiumDoctors(premiumData.doctors);
        }

        if (googleResponse.ok && googleData.doctors) {
          setGoogleDoctors(googleData.doctors);
        }

        setError(null);
      } catch {
        if (!cancelled) {
          setError('Failed to load nearby doctors');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchDoctors();

    return () => {
      cancelled = true;
    };
  }, [location, locationLoading]);

  const allDoctors = [...premiumDoctors, ...googleDoctors];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 relative overflow-hidden">
      {/* Background blur effects */}
      <div className="absolute top-10 left-1/4 w-80 h-80 bg-blue-300/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-indigo-300/40 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <header className="relative z-10 px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/20 backdrop-blur-lg rounded-2xl px-6 py-4 border border-white/30">
            <div className="flex justify-between items-center">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-12 h-12 bg-lime-600 rounded-xl flex items-center justify-center shadow-lg shadow-lime-600/20">
                  <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z"/>
                  </svg>
                </div>
                <span className="text-3xl font-extrabold text-white">Leefii</span>
              </Link>

              <nav className="hidden md:flex items-center gap-6">
                <Link href="/dispensaries" className="text-white/80 hover:text-white transition font-medium">
                  Dispensaries
                </Link>
                <Link href="/doctors" className="text-white font-medium border-b-2 border-white pb-1">
                  Doctors
                </Link>
                <Link href="/strains" className="text-white/80 hover:text-white transition font-medium">
                  Strains
                </Link>
                <Link href="/deals" className="text-white/80 hover:text-white transition font-medium">
                  Deals
                </Link>
                <Link href="/news" className="text-white/80 hover:text-white transition font-medium">
                  News
                </Link>
                <Link href="/login" className="px-5 py-2 bg-white text-blue-600 font-semibold rounded-full hover:bg-gray-100 transition">
                  Sign In
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Medical Marijuana Card Doctors
            </h1>
            {location && (
              <p className="text-xl text-white/80">
                Showing doctors near {location.city}, {location.state}
              </p>
            )}
          </div>
          <Link
            href="/doctors/register"
            className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400 text-yellow-900 font-semibold rounded-full hover:bg-yellow-300 transition shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            List Your Practice
          </Link>
        </div>

        {/* Stats Bar */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white/20 backdrop-blur rounded-2xl p-5 border border-white/30 text-center">
              <p className="text-3xl font-bold text-white">{stats.totalDoctors.toLocaleString()}+</p>
              <p className="text-sm text-white/70 mt-1">Verified MMJ Doctors</p>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-2xl p-5 border border-white/30 text-center">
              <p className="text-3xl font-bold text-white">{stats.stateCount}</p>
              <p className="text-sm text-white/70 mt-1">States Covered</p>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-2xl p-5 border border-white/30 text-center hidden md:block">
              <p className="text-3xl font-bold text-white">24/7</p>
              <p className="text-sm text-white/70 mt-1">Telehealth Available</p>
            </div>
          </div>
        )}

        {/* Info Card */}
        <div className="bg-white/20 backdrop-blur rounded-2xl p-6 border border-white/30 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/30 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Get Your Medical Marijuana Card</h3>
              <p className="text-white/70">
                These doctors can help you obtain your medical marijuana card. Requirements vary by state.
                Click on a doctor to view their details and get in touch.
              </p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {(locationLoading || loading) && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white/20 backdrop-blur rounded-2xl p-6 border border-white/30 animate-pulse">
                <div className="h-6 bg-white/30 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-white/30 rounded w-full mb-2"></div>
                <div className="h-4 bg-white/30 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-500/20 backdrop-blur rounded-2xl p-6 border border-red-300/30 text-center">
            <p className="text-white text-lg">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-white text-red-600 font-semibold rounded-full hover:bg-gray-100 transition"
            >
              Try Again
            </button>
          </div>
        )}

        {/* No Results */}
        {!loading && !error && allDoctors.length === 0 && (
          <div className="bg-white/20 backdrop-blur rounded-2xl p-8 border border-white/30 text-center">
            <p className="text-white text-lg mb-2">No medical marijuana doctors found in your area.</p>
            <p className="text-white/70">Try searching in a larger area or check back later.</p>
          </div>
        )}

        {/* Premium Doctors Section */}
        {!loading && !error && premiumDoctors.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Featured Providers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {premiumDoctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="bg-gradient-to-br from-yellow-400/30 to-orange-400/20 backdrop-blur rounded-2xl p-6 border-2 border-yellow-300/50 hover:border-yellow-300 transition group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-white/40 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {doctor.logo ? (
                        <img src={doctor.logo} alt={doctor.name} className="w-full h-full object-cover" />
                      ) : (
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white truncate">
                          {doctor.name}
                        </h3>
                        {doctor.isFeatured && (
                          <span className="text-xs bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full font-medium">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-white/70 truncate mt-1">
                        {doctor.address}
                      </p>
                    </div>
                  </div>

                  {/* Services */}
                  {doctor.services && doctor.services.length > 0 && (
                    <div className="mt-4 flex gap-2 flex-wrap">
                      {doctor.services.slice(0, 3).map((service, i) => (
                        <span key={i} className="text-xs bg-white/20 text-white px-2 py-1 rounded-full">
                          {service}
                        </span>
                      ))}
                      {doctor.telemedicine && (
                        <span className="text-xs bg-green-500/30 text-green-100 px-2 py-1 rounded-full">
                          Telehealth
                        </span>
                      )}
                    </div>
                  )}

                  <div className="mt-4 flex items-center gap-3 flex-wrap">
                    {doctor.rating > 0 && (
                      <span className="inline-flex items-center gap-1 text-sm text-white">
                        <span className="text-yellow-300">&#9733;</span>
                        {doctor.rating.toFixed(1)}
                      </span>
                    )}
                    {doctor.distance > 0 && (
                      <span className="text-sm text-white font-medium">
                        {doctor.distance} mi away
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 pt-4 border-t border-white/20 flex gap-2">
                    {doctor.phone && (
                      <a
                        href={`tel:${doctor.phone.replace(/[^0-9]/g, '')}`}
                        className="flex-1 text-center py-2 bg-white/20 text-white rounded-lg text-sm font-medium hover:bg-white/30 transition"
                      >
                        Call Now
                      </a>
                    )}
                    {doctor.website && (
                      <a
                        href={doctor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center py-2 bg-white text-blue-600 rounded-lg text-sm font-medium hover:bg-gray-100 transition"
                      >
                        Visit Website
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Google Doctors Section */}
        {!loading && !error && googleDoctors.length > 0 && (
          <div>
            {premiumDoctors.length > 0 && (
              <h2 className="text-xl font-bold text-white/80 mb-4">More Providers Near You</h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {googleDoctors.map((doctor) => (
                <a
                  key={doctor.id}
                  href={`https://www.google.com/maps/place/?q=place_id:${doctor.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/20 backdrop-blur rounded-2xl p-6 border border-white/30 hover:bg-white/30 transition group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-white/30 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-white/40 transition">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate group-hover:text-yellow-200 transition">
                        {doctor.name}
                      </h3>
                      <p className="text-sm text-white/70 truncate mt-1">
                        {doctor.address}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-3 flex-wrap">
                    {doctor.rating > 0 && (
                      <span className="inline-flex items-center gap-1 text-sm text-white">
                        <span className="text-yellow-300">&#9733;</span>
                        {doctor.rating.toFixed(1)}
                        <span className="text-white/50">({doctor.reviewsCount})</span>
                      </span>
                    )}
                    <span className="text-sm text-white font-medium">
                      {doctor.distance} mi away
                    </span>
                  </div>

                  <div className="mt-4 flex gap-2 flex-wrap">
                    {doctor.isOpen !== null && (
                      <span className={`text-xs px-3 py-1 rounded-full ${
                        doctor.isOpen
                          ? 'bg-green-500/30 text-green-100'
                          : 'bg-red-500/30 text-red-100'
                      }`}>
                        {doctor.isOpen ? 'Open Now' : 'Closed'}
                      </span>
                    )}
                    <span className="text-xs bg-white/20 text-white px-3 py-1 rounded-full">
                      MMJ Card
                    </span>
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/20">
                    <span className="text-sm text-white/70 group-hover:text-white transition inline-flex items-center gap-1">
                      View on Google Maps
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Get Your Medical Card CTA */}
        <section className="my-12">
          <div className="bg-gradient-to-r from-green-500/30 to-emerald-500/30 backdrop-blur rounded-2xl p-8 md:p-10 border border-green-300/40 text-center">
            <div className="w-16 h-16 bg-green-500/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Get Your Medical Marijuana Card
            </h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto mb-6">
              Not sure if you qualify? Check our comprehensive guide to qualifying conditions across all legal states. Learn about requirements, costs, and the application process.
            </p>
            <Link
              href="/medical-card/qualifying-conditions"
              className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition shadow-lg text-lg"
            >
              View Qualifying Conditions
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </section>

        {/* State Selector Grid */}
        {stats && stats.states.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Browse Doctors by State
            </h2>
            <p className="text-white/70 mb-6">
              Find medical marijuana doctors in your state. Click a state to see all available providers.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {stats.states.map((s) => (
                <Link
                  key={s.abbreviation}
                  href={`/doctors/${s.slug}`}
                  className="bg-white/15 backdrop-blur rounded-xl p-4 border border-white/20 hover:bg-white/25 hover:border-white/40 transition group text-center"
                >
                  <span className="text-sm font-bold text-white/50 group-hover:text-white/70 transition">
                    {s.abbreviation}
                  </span>
                  <h3 className="font-semibold text-white text-sm mt-1 group-hover:text-yellow-200 transition truncate">
                    {s.name}
                  </h3>
                  <p className="text-xs text-white/60 mt-1">
                    {s.doctorCount} doctor{s.doctorCount !== 1 ? 's' : ''}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* SEO Text Section */}
        <section className="mb-12">
          <div className="bg-white/10 backdrop-blur rounded-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">
              Find Medical Marijuana Doctors and Get Your MMJ Card
            </h2>
            <div className="text-white/70 space-y-4 leading-relaxed">
              <p>
                Leefii is your trusted resource for finding licensed medical marijuana doctors across the United States. Whether you are seeking your first medical marijuana card or need a renewal, our directory connects you with verified physicians who specialize in cannabis evaluations. We list doctors who offer both in-person appointments and telehealth consultations, making it convenient to get the care you need from anywhere.
              </p>
              <p>
                Getting a medical marijuana card starts with an evaluation by a licensed physician. During the consultation, your doctor will review your medical history, discuss your symptoms, and determine whether cannabis therapy is appropriate for your condition. Many states now recognize a wide range of qualifying conditions, including chronic pain, anxiety, PTSD, epilepsy, cancer, and more. The process is straightforward, confidential, and typically takes less than 30 minutes.
              </p>
              <p>
                Each state has its own medical marijuana program with specific requirements, fees, and qualifying conditions. After receiving your doctor&apos;s recommendation, you will need to apply for your state medical marijuana card through your state&apos;s health department. Card costs vary by state, ranging from free to around $200 for the state registration fee, with separate doctor consultation fees typically between $100 and $300. Many doctors on Leefii offer competitive pricing and accept various payment methods.
              </p>
              <p>
                Telehealth has made getting a medical marijuana card more accessible than ever. Many of the doctors listed on Leefii offer video consultations, allowing you to complete your evaluation from the comfort of your home. This is especially beneficial for patients with mobility challenges or those living in rural areas without nearby MMJ doctors. Browse our state-by-state directory to find a qualified medical marijuana doctor near you and start your journey toward relief today.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-8 mt-12">
        <div className="bg-white/20 backdrop-blur-lg rounded-2xl px-6 py-6 border border-white/30">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-lime-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z"/>
                </svg>
              </div>
              <span className="font-semibold text-white">Leefii</span>
            </div>
            <div className="flex gap-6 text-sm text-white/70">
              <Link href="/about" className="hover:text-white transition">About</Link>
              <Link href="/contact" className="hover:text-white transition">Contact</Link>
              <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition">Terms</Link>
            </div>
            <div className="text-sm text-white/60">
              &copy; 2026 Leefii. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
