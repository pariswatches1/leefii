'use client';

import { Mic, MicOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VoiceSearchButtonProps {
  isListening: boolean;
  isSupported: boolean;
  onStart: () => void;
  onStop: () => void;
  className?: string;
}

/**
 * Voice search button with Web Speech API integration
 * Shows "Coming soon" tooltip if not supported
 */
export function VoiceSearchButton({
  isListening,
  isSupported,
  onStart,
  onStop,
  className,
}: VoiceSearchButtonProps) {
  const handleClick = () => {
    if (!isSupported) return;
    if (isListening) {
      onStop();
    } else {
      onStart();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!isSupported}
      className={cn(
        'p-2 rounded-full transition-all duration-200',
        'hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2',
        isListening && 'bg-red-100 hover:bg-red-200',
        !isSupported && 'opacity-50 cursor-not-allowed',
        className
      )}
      title={
        !isSupported
          ? 'Voice search not supported in this browser'
          : isListening
          ? 'Stop listening'
          : 'Search by voice'
      }
      aria-label={isListening ? 'Stop voice search' : 'Start voice search'}
    >
      {isListening ? (
        <MicOff className="w-5 h-5 text-red-600 animate-pulse" />
      ) : (
        <Mic
          className={cn(
            'w-5 h-5',
            isSupported ? 'text-gray-500 hover:text-gray-700' : 'text-gray-400'
          )}
        />
      )}
    </button>
  );
}
