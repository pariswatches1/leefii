'use client';

import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SEARCH_CONFIG } from '@/lib/search/search-config';

interface AIModeToggleProps {
  isEnabled: boolean;
  onToggle: () => void;
  className?: string;
}

/**
 * AI Mode toggle button
 * Currently UI-only - actual AI functionality will be added after approval
 */
export function AIModeToggle({
  isEnabled,
  onToggle,
  className,
}: AIModeToggleProps) {
  // AI mode is disabled at config level until approved
  const isAvailable = SEARCH_CONFIG.aiMode.enabled;

  return (
    <button
      type="button"
      onClick={isAvailable ? onToggle : undefined}
      disabled={!isAvailable}
      className={cn(
        'flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2',
        isEnabled && isAvailable
          ? 'bg-purple-500 text-white hover:bg-purple-600'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
        !isAvailable && 'opacity-50 cursor-not-allowed',
        className
      )}
      title={
        !isAvailable
          ? 'AI Mode coming soon'
          : isEnabled
          ? 'AI Mode enabled - click to disable'
          : 'Enable AI Mode for smart answers'
      }
      aria-label={isEnabled ? 'Disable AI Mode' : 'Enable AI Mode'}
      aria-pressed={isEnabled}
    >
      <Sparkles className={cn('w-3.5 h-3.5', isEnabled && isAvailable && 'animate-pulse')} />
      <span>AI</span>
    </button>
  );
}
