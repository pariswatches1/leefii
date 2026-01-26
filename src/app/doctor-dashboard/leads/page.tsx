import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export default async function DoctorLeadsPage() {
  const session = await auth();

  const doctor = await prisma.doctor.findUnique({
    where: { email: session?.user?.email! },
  });

  if (!doctor) {
    return null;
  }

  // Get all leads with pagination
  const leads = await prisma.doctorLead.findMany({
    where: { doctorId: doctor.id },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  // Get stats
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const startOfLastMonth = new Date(startOfMonth);
  startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1);

  const [thisMonthLeads, lastMonthLeads] = await Promise.all([
    prisma.doctorLead.count({
      where: {
        doctorId: doctor.id,
        createdAt: { gte: startOfMonth },
      },
    }),
    prisma.doctorLead.count({
      where: {
        doctorId: doctor.id,
        createdAt: { gte: startOfLastMonth, lt: startOfMonth },
      },
    }),
  ]);

  const percentChange = lastMonthLeads > 0
    ? Math.round(((thisMonthLeads - lastMonthLeads) / lastMonthLeads) * 100)
    : 0;

  const leadTypeLabels: Record<string, string> = {
    WEBSITE_CLICK: 'Website Click',
    PHONE_CLICK: 'Phone Click',
    DIRECTIONS_CLICK: 'Directions Click',
    FORM_SUBMIT: 'Form Submission',
  };

  const leadTypeColors: Record<string, { bg: string; text: string }> = {
    WEBSITE_CLICK: { bg: 'bg-green-100', text: 'text-green-700' },
    PHONE_CLICK: { bg: 'bg-purple-100', text: 'text-purple-700' },
    DIRECTIONS_CLICK: { bg: 'bg-orange-100', text: 'text-orange-700' },
    FORM_SUBMIT: { bg: 'bg-blue-100', text: 'text-blue-700' },
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Lead Activity</h1>
        <p className="text-gray-600 mt-1">Track how patients are engaging with your listing</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-600">This Month</p>
          <p className="text-3xl font-bold text-gray-900">{thisMonthLeads}</p>
          {percentChange !== 0 && (
            <p className={`text-sm mt-1 ${percentChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {percentChange > 0 ? '+' : ''}{percentChange}% vs last month
            </p>
          )}
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-600">Last Month</p>
          <p className="text-3xl font-bold text-gray-900">{lastMonthLeads}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-600">All Time</p>
          <p className="text-3xl font-bold text-gray-900">{leads.length}</p>
        </div>
      </div>

      {/* Leads List */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        </div>

        {leads.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">No activity yet</p>
            <p className="text-sm text-gray-400 mt-1">Leads will appear here when patients interact with your listing</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {leads.map((lead) => (
              <div key={lead.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      leadTypeColors[lead.type]?.bg || 'bg-gray-100'
                    }`}>
                      <svg className={`w-5 h-5 ${leadTypeColors[lead.type]?.text || 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {lead.type === 'WEBSITE_CLICK' ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        ) : lead.type === 'PHONE_CLICK' ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        ) : lead.type === 'DIRECTIONS_CLICK' ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        )}
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {leadTypeLabels[lead.type] || lead.type}
                      </p>
                      {lead.referrerUrl && (
                        <p className="text-sm text-gray-500">
                          From: {lead.referrerUrl}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      {new Date(lead.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(lead.createdAt).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
