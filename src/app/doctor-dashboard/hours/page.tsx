'use client';

import { useState, useEffect } from 'react';

interface BusinessHours {
  id?: string;
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const DEFAULT_HOURS: BusinessHours[] = DAYS.map((_, index) => ({
  dayOfWeek: index,
  openTime: '09:00',
  closeTime: '17:00',
  isClosed: index === 0 || index === 6, // Closed on weekends by default
}));

export default function DoctorHoursPage() {
  const [hours, setHours] = useState<BusinessHours[]>(DEFAULT_HOURS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchHours();
  }, []);

  const fetchHours = async () => {
    try {
      const res = await fetch('/api/doctors/hours');
      if (res.ok) {
        const data = await res.json();
        if (data.hours && data.hours.length > 0) {
          // Merge with default hours in case some days are missing
          const mergedHours = DEFAULT_HOURS.map((defaultDay) => {
            const existingDay = data.hours.find((h: BusinessHours) => h.dayOfWeek === defaultDay.dayOfWeek);
            return existingDay || defaultDay;
          });
          setHours(mergedHours);
        }
      }
    } catch {
      console.error('Failed to fetch hours');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/doctors/hours', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hours }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Business hours updated successfully!' });
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.error || 'Failed to update hours' });
      }
    } catch {
      setMessage({ type: 'error', text: 'An error occurred while saving' });
    } finally {
      setSaving(false);
    }
  };

  const updateHour = (dayOfWeek: number, field: keyof BusinessHours, value: string | boolean) => {
    setHours(hours.map((h) =>
      h.dayOfWeek === dayOfWeek ? { ...h, [field]: value } : h
    ));
  };

  const copyToAllDays = (sourceDayIndex: number) => {
    const sourceHours = hours.find((h) => h.dayOfWeek === sourceDayIndex);
    if (!sourceHours) return;

    setHours(hours.map((h) => ({
      ...h,
      openTime: sourceHours.openTime,
      closeTime: sourceHours.closeTime,
    })));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Business Hours</h1>
        <p className="text-gray-600 mt-1">Set your clinic&apos;s operating hours</p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-200">
          {hours.map((day) => (
            <div key={day.dayOfWeek} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-24">
                    <span className="font-medium text-gray-900">{DAYS[day.dayOfWeek]}</span>
                  </div>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={day.isClosed}
                      onChange={(e) => updateHour(day.dayOfWeek, 'isClosed', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">Closed</span>
                  </label>

                  {!day.isClosed && (
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="time"
                        value={day.openTime}
                        onChange={(e) => updateHour(day.dayOfWeek, 'openTime', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <span className="text-gray-500">to</span>
                      <input
                        type="time"
                        value={day.closeTime}
                        onChange={(e) => updateHour(day.dayOfWeek, 'closeTime', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  )}
                </div>

                {!day.isClosed && day.dayOfWeek === 1 && ( // Only show on Monday
                  <button
                    type="button"
                    onClick={() => copyToAllDays(day.dayOfWeek)}
                    className="text-sm text-blue-600 hover:text-blue-700 whitespace-nowrap"
                  >
                    Copy to all weekdays
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Hours'}
          </button>
        </div>
      </form>
    </div>
  );
}
