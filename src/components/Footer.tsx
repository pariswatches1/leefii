'use client';

import Link from 'next/link';
import { useState } from 'react';

/* ─── Accordion for mobile ─── */
function FooterAccordion({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="group lg:open">
      <summary className="flex items-center justify-between cursor-pointer lg:cursor-default py-3 lg:py-0 border-b border-white/30 lg:border-0">
        <h3 className="text-gray-900 font-semibold text-sm uppercase tracking-wide">{title}</h3>
        <svg
          className="w-5 h-5 text-gray-700 group-open:rotate-180 transition-transform lg:hidden"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </summary>
      <div className="mt-3 lg:mt-4">{children}</div>
    </details>
  );
}

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-gradient-to-br from-lime-400 via-green-400 to-emerald-500 text-gray-700">
      {/* ─── Section 1: Newsletter + Social ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-10">
          {/* Logo + Tagline */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 mb-2">
              <div className="w-9 h-9 bg-lime-700 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
                </svg>
              </div>
              <span className="text-gray-900 text-xl font-bold">Leefii</span>
            </Link>
            <p className="text-sm text-gray-800/70 max-w-[200px]">Find cannabis dispensaries, strains &amp; deals near you.</p>
          </div>

          {/* Newsletter */}
          <div className="flex-1 max-w-md">
            <h3 className="text-gray-900 font-semibold text-sm uppercase tracking-wide mb-2">Stay in the loop</h3>
            {subscribed ? (
              <p className="text-lime-800 font-semibold text-sm">Thanks for subscribing!</p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@address.com"
                  required
                  className="flex-1 bg-white/30 backdrop-blur border border-white/40 rounded-l-lg px-4 py-2.5 text-sm text-gray-900 placeholder-gray-600 focus:outline-none focus:border-lime-700"
                />
                <button
                  type="submit"
                  className="bg-lime-700 hover:bg-lime-800 text-white font-semibold px-5 py-2.5 rounded-r-lg text-sm transition whitespace-nowrap"
                >
                  Sign Up
                </button>
              </form>
            )}
            <p className="text-xs text-gray-800/60 mt-2">
              Cannabis news, deals, and strain guides. No spam.
            </p>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="text-gray-900 font-semibold text-sm uppercase tracking-wide mb-3">Follow Us</h3>
            <div className="flex flex-wrap items-center gap-3">
              <a href="https://x.com/leefii" target="_blank" rel="noopener noreferrer" title="X (Twitter)" className="text-gray-700 hover:text-gray-900 transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </a>
              <a href="https://facebook.com/leefii" target="_blank" rel="noopener noreferrer" title="Facebook" className="text-gray-700 hover:text-gray-900 transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
              </a>
              <a href="https://instagram.com/leefii" target="_blank" rel="noopener noreferrer" title="Instagram" className="text-gray-700 hover:text-gray-900 transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
              </a>
              <a href="https://youtube.com/@leefii" target="_blank" rel="noopener noreferrer" title="YouTube" className="text-gray-700 hover:text-gray-900 transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
              </a>
              <a href="https://reddit.com/r/leefii" target="_blank" rel="noopener noreferrer" title="Reddit" className="text-gray-700 hover:text-gray-900 transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12c0 6.627 5.373 12 12 12s12-5.373 12-12c0-6.627-5.373-12-12-12zm6.066 13.26c.028.213.042.43.042.647 0 3.3-3.84 5.977-8.578 5.977-4.738 0-8.578-2.677-8.578-5.977 0-.217.014-.434.042-.647A2.01 2.01 0 0 1 .07 11.5a2.016 2.016 0 0 1 3.274-1.572c1.507-1.09 3.59-1.796 5.907-1.885l.99-4.657a.336.336 0 0 1 .399-.27l3.29.696a1.424 1.424 0 0 1 2.697.631 1.424 1.424 0 0 1-1.42 1.424c-.748 0-1.368-.58-1.42-1.317l-2.932-.621-.878 4.133c2.283.103 4.33.81 5.814 1.888a2.016 2.016 0 0 1 3.274 1.572 2.01 2.01 0 0 1-.926 1.693zM8.049 13.088a1.424 1.424 0 1 0 0 2.848 1.424 1.424 0 0 0 0-2.848zm7.902 0a1.424 1.424 0 1 0 0 2.848 1.424 1.424 0 0 0 0-2.848zm-1.03 3.79a.334.334 0 0 1-.472.473 4.5 4.5 0 0 1-2.449.69 4.5 4.5 0 0 1-2.449-.69.334.334 0 1 1 .472-.472 3.84 3.84 0 0 0 1.977.585 3.84 3.84 0 0 0 1.977-.585.334.334 0 0 1 .472-.001h-.028z" /></svg>
              </a>
              <a href="https://linkedin.com/company/leefii" target="_blank" rel="noopener noreferrer" title="LinkedIn" className="text-gray-700 hover:text-gray-900 transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
              </a>
              <a href="https://t.me/leefii" target="_blank" rel="noopener noreferrer" title="Telegram" className="text-gray-700 hover:text-gray-900 transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" /></svg>
              </a>
              <a href="https://wa.me/leefii" target="_blank" rel="noopener noreferrer" title="WhatsApp" className="text-gray-700 hover:text-gray-900 transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
              </a>
              <a href="mailto:hello@leefii.com" title="Email" className="text-gray-700 hover:text-gray-900 transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </a>
            </div>
          </div>
        </div>

        <hr className="border-white/30 mb-8" />

        {/* ─── Section 2: Link Columns ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 mb-10">
          {/* Column 1: Explore */}
          <FooterAccordion title="Explore">
            <ul className="space-y-2.5">
              <li><Link href="/dispensaries" className="text-sm hover:text-gray-900 transition">Dispensaries</Link></li>
              <li><Link href="/strains" className="text-sm hover:text-gray-900 transition">Strains</Link></li>
              <li><Link href="/deals" className="text-sm hover:text-gray-900 transition">Deals</Link></li>
              <li><Link href="/shop" className="text-sm hover:text-gray-900 transition">Shop</Link></li>
              <li><Link href="/delivery" className="text-sm hover:text-gray-900 transition">Delivery</Link></li>
              <li><Link href="/doctors" className="text-sm hover:text-gray-900 transition">Doctors</Link></li>
              <li><Link href="/marketplace" className="text-sm hover:text-gray-900 transition">Marketplace</Link></li>
              <li><Link href="/near-me" className="text-sm hover:text-gray-900 transition">Near Me</Link></li>
            </ul>
          </FooterAccordion>

          {/* Column 2: Resources */}
          <FooterAccordion title="Resources">
            <ul className="space-y-2.5">
              <li><Link href="/blog" className="text-sm hover:text-gray-900 transition">Blog</Link></li>
              <li><Link href="/news" className="text-sm hover:text-gray-900 transition">News</Link></li>
              <li><Link href="/laws" className="text-sm hover:text-gray-900 transition">Cannabis Laws</Link></li>
              <li><Link href="/tools" className="text-sm hover:text-gray-900 transition">Tools</Link></li>
              <li><Link href="/quiz" className="text-sm hover:text-gray-900 transition">Strain Quiz</Link></li>
              <li><Link href="/compare" className="text-sm hover:text-gray-900 transition">Comparisons</Link></li>
              <li><Link href="/medical-card/qualifying-conditions" className="text-sm hover:text-gray-900 transition">Medical Cards</Link></li>
            </ul>
          </FooterAccordion>

          {/* Column 3: Popular Cities (dispensary links) */}
          <FooterAccordion title="Dispensaries In">
            <ul className="space-y-2.5">
              <li><Link href="/dispensaries/california/los-angeles" className="text-sm hover:text-gray-900 transition">Los Angeles</Link></li>
              <li><Link href="/dispensaries/colorado/denver" className="text-sm hover:text-gray-900 transition">Denver</Link></li>
              <li><Link href="/dispensaries/california/san-francisco" className="text-sm hover:text-gray-900 transition">San Francisco</Link></li>
              <li><Link href="/dispensaries/arizona/phoenix" className="text-sm hover:text-gray-900 transition">Phoenix</Link></li>
              <li><Link href="/dispensaries/illinois/chicago" className="text-sm hover:text-gray-900 transition">Chicago</Link></li>
              <li><Link href="/dispensaries/michigan/detroit" className="text-sm hover:text-gray-900 transition">Detroit</Link></li>
              <li><Link href="/dispensaries/oregon/portland" className="text-sm hover:text-gray-900 transition">Portland</Link></li>
              <li><Link href="/dispensaries/washington/seattle" className="text-sm hover:text-gray-900 transition">Seattle</Link></li>
            </ul>
          </FooterAccordion>

          {/* Column 4: Popular States */}
          <FooterAccordion title="Popular States">
            <ul className="space-y-2.5">
              <li><Link href="/dispensaries/california" className="text-sm hover:text-gray-900 transition">California</Link></li>
              <li><Link href="/dispensaries/colorado" className="text-sm hover:text-gray-900 transition">Colorado</Link></li>
              <li><Link href="/dispensaries/florida" className="text-sm hover:text-gray-900 transition">Florida</Link></li>
              <li><Link href="/dispensaries/michigan" className="text-sm hover:text-gray-900 transition">Michigan</Link></li>
              <li><Link href="/dispensaries/new-york" className="text-sm hover:text-gray-900 transition">New York</Link></li>
              <li><Link href="/dispensaries/illinois" className="text-sm hover:text-gray-900 transition">Illinois</Link></li>
              <li><Link href="/dispensaries/arizona" className="text-sm hover:text-gray-900 transition">Arizona</Link></li>
              <li><Link href="/dispensaries/oregon" className="text-sm hover:text-gray-900 transition">Oregon</Link></li>
              <li><Link href="/dispensaries/washington" className="text-sm hover:text-gray-900 transition">Washington</Link></li>
              <li><Link href="/dispensaries/new-jersey" className="text-sm hover:text-gray-900 transition">New Jersey</Link></li>
            </ul>
          </FooterAccordion>
        </div>

        {/* ─── Section 3: Business CTAs ─── */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <Link
            href="/sell"
            className="flex-1 bg-white/20 backdrop-blur border border-white/40 rounded-xl px-6 py-4 hover:bg-white/40 transition group"
          >
            <div className="font-semibold text-gray-900 text-sm group-hover:text-lime-800 transition">List Your Dispensary</div>
            <div className="text-xs text-gray-700 mt-1">Get found by thousands of cannabis consumers on Leefii</div>
          </Link>
          <Link
            href="/doctors/register"
            className="flex-1 bg-white/20 backdrop-blur border border-white/40 rounded-xl px-6 py-4 hover:bg-white/40 transition group"
          >
            <div className="font-semibold text-gray-900 text-sm group-hover:text-lime-800 transition">Register as an MMJ Doctor</div>
            <div className="text-xs text-gray-700 mt-1">Connect with patients seeking medical marijuana certifications</div>
          </Link>
        </div>

        {/* ─── Medical Disclaimer ─── */}
        <div className="bg-white/20 border border-white/30 rounded-lg px-4 py-3 mb-8">
          <p className="text-xs text-gray-800/70 italic leading-relaxed">
            * Statements made on this website have not been evaluated by the U.S. Food and Drug Administration. Information provided by Leefii is not a substitute for individual medical advice. Cannabis products are not intended to diagnose, treat, cure, or prevent any disease. Consult your doctor before using cannabis products. You must be 21 years or older, or a qualifying medical patient, to purchase cannabis. Check your state and local laws for specific regulations.
          </p>
        </div>

        <hr className="border-white/30 mb-6" />

        {/* ─── Section 4: Bottom Bar ─── */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-lime-700 rounded-md flex items-center justify-center">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
              </svg>
            </div>
            <span className="text-sm text-gray-800/70">© {new Date().getFullYear()} Leefii. All rights reserved.</span>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-xs">
            <Link href="/about" className="text-gray-700 hover:text-gray-900 transition">About</Link>
            <Link href="/contact" className="text-gray-700 hover:text-gray-900 transition">Contact</Link>
            <Link href="/privacy" className="text-gray-700 hover:text-gray-900 transition">Privacy Policy</Link>
            <Link href="/terms" className="text-gray-700 hover:text-gray-900 transition">Terms of Use</Link>
            <Link href="/api-docs" className="text-gray-700 hover:text-gray-900 transition">API</Link>
            <Link href="/how-we-verify" className="text-gray-700 hover:text-gray-900 transition">How We Verify</Link>
          </div>

          <div className="text-xs text-gray-800/60 text-center md:text-right">
            Must be 21+ to use this site.
          </div>
        </div>
      </div>
    </footer>
  );
}
