'use client';

import { useState, useRef, useEffect } from 'react';

type ShareVariant = 'full' | 'inline' | 'compact';

interface ShareButtonsProps {
  url: string;
  title: string;
  variant?: ShareVariant;
  heading?: string;
  dark?: boolean;
  className?: string;
}

/* ─── SVG Icons ─── */
const XIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const FacebookIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const WhatsAppIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

const TelegramIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);

const RedditIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0C5.373 0 0 5.373 0 12c0 6.627 5.373 12 12 12s12-5.373 12-12c0-6.627-5.373-12-12-12zm6.066 13.26c.028.213.042.43.042.647 0 3.3-3.84 5.977-8.578 5.977-4.738 0-8.578-2.677-8.578-5.977 0-.217.014-.434.042-.647A2.01 2.01 0 0 1 .07 11.5a2.016 2.016 0 0 1 3.274-1.572c1.507-1.09 3.59-1.796 5.907-1.885l.99-4.657a.336.336 0 0 1 .399-.27l3.29.696a1.424 1.424 0 0 1 2.697.631 1.424 1.424 0 0 1-1.42 1.424c-.748 0-1.368-.58-1.42-1.317l-2.932-.621-.878 4.133c2.283.103 4.33.81 5.814 1.888a2.016 2.016 0 0 1 3.274 1.572 2.01 2.01 0 0 1-.926 1.693zM8.049 13.088a1.424 1.424 0 1 0 0 2.848 1.424 1.424 0 0 0 0-2.848zm7.902 0a1.424 1.424 0 1 0 0 2.848 1.424 1.424 0 0 0 0-2.848zm-1.03 3.79a.334.334 0 0 1-.472.473 4.5 4.5 0 0 1-2.449.69 4.5 4.5 0 0 1-2.449-.69.334.334 0 1 1 .472-.472 3.84 3.84 0 0 0 1.977.585 3.84 3.84 0 0 0 1.977-.585.334.334 0 0 1 .472-.001h-.028z" />
  </svg>
);

const LinkedInIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const EmailIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const CopyIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
  </svg>
);

const CheckIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const ShareIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
  </svg>
);

/* ─── Share targets ─── */
function getShareTargets(url: string, title: string) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return [
    {
      name: 'X',
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: XIcon,
      color: 'bg-gray-900 hover:bg-gray-800',
      darkColor: 'bg-white/20 hover:bg-white/30',
    },
    {
      name: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: FacebookIcon,
      color: 'bg-[#1877F2] hover:bg-[#166FE5]',
      darkColor: 'bg-white/20 hover:bg-white/30',
    },
    {
      name: 'WhatsApp',
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      icon: WhatsAppIcon,
      color: 'bg-[#25D366] hover:bg-[#20BD5A]',
      darkColor: 'bg-white/20 hover:bg-white/30',
    },
    {
      name: 'Telegram',
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      icon: TelegramIcon,
      color: 'bg-[#0088cc] hover:bg-[#0077b3]',
      darkColor: 'bg-white/20 hover:bg-white/30',
    },
    {
      name: 'Reddit',
      href: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
      icon: RedditIcon,
      color: 'bg-[#FF4500] hover:bg-[#E03D00]',
      darkColor: 'bg-white/20 hover:bg-white/30',
    },
    {
      name: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: LinkedInIcon,
      color: 'bg-[#0A66C2] hover:bg-[#0958A8]',
      darkColor: 'bg-white/20 hover:bg-white/30',
    },
    {
      name: 'Email',
      href: `mailto:?subject=${encodedTitle}&body=Check%20this%20out:%20${encodedUrl}`,
      icon: EmailIcon,
      color: 'bg-gray-500 hover:bg-gray-600',
      darkColor: 'bg-white/20 hover:bg-white/30',
      isEmail: true,
    },
  ];
}

/* ─── Copy Link Button (shared logic) ─── */
function CopyLinkButton({
  url,
  variant,
  dark,
}: {
  url: string;
  variant: ShareVariant;
  dark?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = url;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (variant === 'full') {
    return (
      <button
        onClick={handleCopy}
        className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
          copied
            ? 'bg-green-100 text-green-700'
            : dark
              ? 'bg-white/20 hover:bg-white/30 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
        title="Copy link"
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
        {copied ? 'Copied!' : 'Copy Link'}
      </button>
    );
  }

  // inline & compact
  return (
    <button
      onClick={handleCopy}
      className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
        copied
          ? 'bg-green-100 text-green-700'
          : dark
            ? 'bg-white/20 hover:bg-white/30 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
      title={copied ? 'Copied!' : 'Copy link'}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
    </button>
  );
}

/* ─── Full Variant ─── */
function FullShare({ url, title, heading, dark }: ShareButtonsProps) {
  const targets = getShareTargets(url, title);

  return (
    <div className={dark ? '' : 'mt-6 pt-6 border-t border-gray-200'}>
      {heading && (
        <h3
          className={`text-sm font-semibold uppercase tracking-wide mb-4 ${
            dark ? 'text-white/70' : 'text-gray-500'
          }`}
        >
          {heading}
        </h3>
      )}
      <div className="flex flex-wrap gap-2">
        {targets.map((t) => (
          <a
            key={t.name}
            href={t.href}
            target={t.isEmail ? undefined : '_blank'}
            rel={t.isEmail ? undefined : 'noopener noreferrer'}
            className={`inline-flex items-center gap-2 px-4 py-2 text-white text-sm font-medium rounded-lg transition-colors ${
              dark ? t.darkColor : t.color
            }`}
          >
            <t.icon />
            {t.name}
          </a>
        ))}
        <CopyLinkButton url={url} variant="full" dark={dark} />
      </div>
    </div>
  );
}

/* ─── Inline Variant ─── */
function InlineShare({ url, title, heading, dark }: ShareButtonsProps) {
  const targets = getShareTargets(url, title);

  return (
    <div className="mt-4">
      {heading && (
        <div
          className={`text-xs font-medium mb-2 ${
            dark ? 'text-white/60' : 'text-gray-500'
          }`}
        >
          {heading}
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {targets.map((t) => (
          <a
            key={t.name}
            href={t.href}
            target={t.isEmail ? undefined : '_blank'}
            rel={t.isEmail ? undefined : 'noopener noreferrer'}
            className={`w-9 h-9 rounded-full flex items-center justify-center text-white transition-colors ${
              dark ? t.darkColor : t.color
            }`}
            title={`Share on ${t.name}`}
          >
            <t.icon />
          </a>
        ))}
        <CopyLinkButton url={url} variant="inline" dark={dark} />
      </div>
    </div>
  );
}

/* ─── Compact Variant ─── */
function CompactShare({ url, title, dark }: ShareButtonsProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const targets = getShareTargets(url, title);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
          dark
            ? 'bg-white/20 hover:bg-white/30 text-white'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
        }`}
        title="Share this page"
      >
        <ShareIcon />
        Share
      </button>

      {open && (
        <div className="absolute z-50 mt-2 left-0 bg-white rounded-xl shadow-lg border border-gray-200 p-3 min-w-[200px]">
          <div className="grid grid-cols-4 gap-2 mb-2">
            {targets.map((t) => (
              <a
                key={t.name}
                href={t.href}
                target={t.isEmail ? undefined : '_blank'}
                rel={t.isEmail ? undefined : 'noopener noreferrer'}
                onClick={() => setOpen(false)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-white transition-colors ${t.color}`}
                title={t.name}
              >
                <t.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
          <CopyLinkButton url={url} variant="full" />
        </div>
      )}
    </div>
  );
}

/* ─── Main Export ─── */
export default function ShareButtons({
  url,
  title,
  variant = 'full',
  heading,
  dark = false,
  className,
}: ShareButtonsProps) {
  const props = { url, title, heading, dark, className };

  return (
    <div className={className}>
      {variant === 'full' && <FullShare {...props} />}
      {variant === 'inline' && <InlineShare {...props} />}
      {variant === 'compact' && <CompactShare {...props} />}
    </div>
  );
}
