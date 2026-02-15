'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavLink {
  href: string;
  label: string;
  highlight?: boolean;
  badge?: string;
}

interface MobileNavProps {
  links: NavLink[];
  className?: string;
}

export function MobileNav({ links, className }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  return (
    <>
      {/* Hamburger / Close toggle button */}
      <button
        className={cn('p-2', className)}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Portal: render backdrop + menu on document.body to escape overflow-hidden ancestors */}
      {isOpen && createPortal(
        <>
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/30 z-[9990]"
            onClick={() => setIsOpen(false)}
          />

          {/* Slide-down menu panel */}
          <div className="fixed top-0 left-0 right-0 z-[9991] bg-white shadow-xl">
            {/* Menu header with close button */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <Link
                href="/"
                className="flex items-center gap-2"
                onClick={() => setIsOpen(false)}
              >
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">L</span>
                </div>
                <span className="text-xl font-bold text-gray-900">Leefii</span>
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-700"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Navigation links */}
            <nav className="px-4 py-3 max-h-[calc(100vh-72px)] overflow-y-auto">
              <div className="flex flex-col gap-1">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'px-4 py-3 rounded-lg text-base transition-colors',
                      link.highlight
                        ? 'bg-green-600 text-white font-semibold text-center mt-2'
                        : pathname === link.href
                          ? 'bg-green-50 text-green-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'
                    )}
                  >
                    <span className="flex items-center gap-2">
                      {link.label}
                      {link.badge && (
                        <span className="text-xs bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full">
                          {link.badge}
                        </span>
                      )}
                    </span>
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        </>,
        document.body
      )}
    </>
  );
}
