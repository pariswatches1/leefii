'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  reportId: string;
  dispensaryName: string;
}

export default function ReportActions({ reportId, dispensaryName }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleAction(action: 'resolve' | 'dismiss') {
    const actionLabel = action === 'resolve' ? 'resolve' : 'dismiss';
    if (!confirm(`${action === 'resolve' ? 'Resolve' : 'Dismiss'} this report for ${dispensaryName}?`)) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/reports/${reportId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: actionLabel }),
      });

      if (response.ok) {
        router.refresh();
      } else {
        const data = await response.json();
        alert(data.error || 'Something went wrong');
      }
    } catch {
      alert('Something went wrong');
    }
    setLoading(false);
  }

  return (
    <div className="mt-4 pt-3 border-t border-gray-200 flex gap-3">
      <button
        onClick={() => handleAction('resolve')}
        disabled={loading}
        className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-green-700 transition disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Resolve'}
      </button>
      <button
        onClick={() => handleAction('dismiss')}
        disabled={loading}
        className="border border-gray-300 text-gray-600 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition disabled:opacity-50"
      >
        Dismiss
      </button>
    </div>
  );
}
