'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState, useRef, useEffect } from 'react';
import { MobileNav } from '@/components/MobileNav';

export default function Header() {
  const { data: session, status } = useSession();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setShowMore(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Leefii</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-5">
            <Link href="/dispensaries" className="text-gray-600 hover:text-green-600 transition text-sm">
              Dispensaries
            </Link>
            <Link href="/doctors" className="text-gray-600 hover:text-green-600 transition text-sm">
              Doctors
            </Link>
            <Link href="/strains" className="text-gray-600 hover:text-green-600 transition text-sm">
              Strains
            </Link>
            <Link href="/deals" className="text-gray-600 hover:text-green-600 transition text-sm">
              Deals
            </Link>
            <Link href="/blog" className="text-gray-600 hover:text-green-600 transition text-sm">
              Blog
            </Link>
            <Link href="/news" className="text-gray-600 hover:text-green-600 transition text-sm">
              News
            </Link>
            {/* More dropdown */}
            <div className="relative" ref={moreRef}>
              <button
                onClick={() => setShowMore(!showMore)}
                className="text-gray-600 hover:text-green-600 transition text-sm flex items-center gap-1"
              >
                More
                <svg className={`w-3.5 h-3.5 transition-transform ${showMore ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showMore && (
                <div className="absolute top-full right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  <Link href="/laws" className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700" onClick={() => setShowMore(false)}>
                    Cannabis Laws
                  </Link>
                  <Link href="/tools" className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700" onClick={() => setShowMore(false)}>
                    Tools & Calculators
                  </Link>
                  <Link href="/delivery" className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700" onClick={() => setShowMore(false)}>
                    Delivery
                  </Link>
                  <Link href="/compare" className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700" onClick={() => setShowMore(false)}>
                    Compare
                  </Link>
                  <Link href="/marketplace" className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700" onClick={() => setShowMore(false)}>
                    Marketplace
                  </Link>
                  <Link href="/quiz" className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700" onClick={() => setShowMore(false)}>
                    Strain Quiz
                  </Link>
                  <Link href="/badges" className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700" onClick={() => setShowMore(false)}>
                    Dispensary Badges
                  </Link>
                  <Link href="/api-docs" className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700" onClick={() => setShowMore(false)}>
                    API Docs
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <Link href="/journal" className="block px-4 py-2 text-sm text-indigo-600 font-medium hover:bg-indigo-50" onClick={() => setShowMore(false)}>
                    Journal
                  </Link>
                </div>
              )}
            </div>
            <Link href="/sell" className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition text-sm">
              Sell on Leefii
            </Link>
          </div>

          {/* Right side icons */}
          <div className="flex items-center gap-2">
            {/* Mobile menu */}
            <MobileNav
              links={[
                { href: '/dispensaries', label: 'Dispensaries' },
                { href: '/doctors', label: 'Doctors' },
                { href: '/strains', label: 'Strains' },
                { href: '/deals', label: 'Deals' },
                { href: '/blog', label: 'Blog' },
                { href: '/news', label: 'News' },
                { href: '/laws', label: 'Cannabis Laws' },
                { href: '/tools', label: 'Tools' },
                { href: '/delivery', label: 'Delivery' },
                { href: '/compare', label: 'Compare' },
                { href: '/marketplace', label: 'Marketplace' },
                { href: '/quiz', label: 'Quiz' },
                { href: '/journal', label: 'Journal', badge: 'New' },
                { href: '/sell', label: 'Sell on Leefii', highlight: true },
              ]}
              className="md:hidden text-gray-600"
            />

            {/* Journal Icon */}
            <Link
              href="/journal"
              className="p-2 text-gray-500 hover:text-indigo-500 transition relative"
              aria-label="Journal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </Link>

            {/* Favorites Icon */}
            <Link
              href="/favorites"
              className="p-2 text-gray-500 hover:text-red-500 transition relative"
              aria-label="Favorites"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </Link>

            {/* Search Icon */}
            <Link href="/search" className="p-2 text-gray-500 hover:text-green-600 transition" aria-label="Search">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>

            {/* User Menu */}
            {status === 'loading' ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
            ) : session ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || 'U'}
                    </span>
                  </div>
                </button>

                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowUserMenu(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 z-20">
                      <div className="px-4 py-2 border-b">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {session.user?.name || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {session.user?.email}
                        </p>
                      </div>
                      <Link
                        href="/favorites"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setShowUserMenu(false)}
                      >
                        My Favorites
                      </Link>
                      <Link
                        href="/journal"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setShowUserMenu(false)}
                      >
                        My Journal
                      </Link>
                      {session.user?.role === 'SELLER' && (
                        <Link
                          href="/dashboard"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Seller Dashboard
                        </Link>
                      )}
                      {session.user?.role === 'ADMIN' && (
                        <Link
                          href="/admin/applications"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          signOut({ callbackUrl: '/' });
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                      >
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="text-sm font-medium text-gray-600 hover:text-green-600 transition"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
