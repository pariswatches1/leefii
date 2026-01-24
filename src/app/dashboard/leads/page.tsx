import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export const metadata = {
  title: 'Lead Analytics',
  description: 'Track your leads and referral performance',
};

export default async function LeadsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login?callbackUrl=/dashboard/leads');
  }

  // Get seller profile
  const sellerProfile = await prisma.sellerProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!sellerProfile) {
    redirect('/sell/apply');
  }

  // Get lead statistics
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [
    totalLeads,
    last30DaysLeads,
    last7DaysLeads,
    convertedLeads,
    recentLeads,
    payoutSettings,
    leadsByDay,
  ] = await Promise.all([
    // Total leads all time
    prisma.leadReferral.count({
      where: { sellerId: sellerProfile.id },
    }),
    // Leads in last 30 days
    prisma.leadReferral.count({
      where: {
        sellerId: sellerProfile.id,
        clickedAt: { gte: thirtyDaysAgo },
      },
    }),
    // Leads in last 7 days
    prisma.leadReferral.count({
      where: {
        sellerId: sellerProfile.id,
        clickedAt: { gte: sevenDaysAgo },
      },
    }),
    // Converted leads
    prisma.leadReferral.count({
      where: {
        sellerId: sellerProfile.id,
        status: 'CONVERTED',
      },
    }),
    // Recent leads
    prisma.leadReferral.findMany({
      where: { sellerId: sellerProfile.id },
      orderBy: { clickedAt: 'desc' },
      take: 20,
      include: {
        product: {
          select: { name: true, slug: true },
        },
      },
    }),
    // Payout settings
    prisma.sellerPayoutSettings.findUnique({
      where: { sellerId: sellerProfile.id },
    }),
    // Leads grouped by day (last 7 days)
    prisma.leadReferral.groupBy({
      by: ['clickedAt'],
      where: {
        sellerId: sellerProfile.id,
        clickedAt: { gte: sevenDaysAgo },
      },
      _count: true,
    }),
  ]);

  const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : '0';
  const pendingPayout = payoutSettings?.pendingPayout?.toString() || '0';
  const totalPaid = payoutSettings?.totalPaid?.toString() || '0';

  const statusColors: Record<string, string> = {
    CLICKED: 'bg-blue-100 text-blue-700',
    LANDED: 'bg-yellow-100 text-yellow-700',
    CONVERTED: 'bg-green-100 text-green-700',
    EXPIRED: 'bg-gray-100 text-gray-500',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Lead Analytics</h1>
        <p className="text-gray-600 mt-1">
          Track visitors referred to your website from Leefii
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="text-sm text-gray-500 mb-1">Total Leads</div>
          <div className="text-3xl font-bold text-gray-900">{totalLeads}</div>
          <div className="text-xs text-gray-400 mt-1">All time</div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="text-sm text-gray-500 mb-1">Last 30 Days</div>
          <div className="text-3xl font-bold text-green-600">{last30DaysLeads}</div>
          <div className="text-xs text-gray-400 mt-1">
            {last7DaysLeads} in last 7 days
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="text-sm text-gray-500 mb-1">Conversion Rate</div>
          <div className="text-3xl font-bold text-blue-600">{conversionRate}%</div>
          <div className="text-xs text-gray-400 mt-1">
            {convertedLeads} converted
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm">
          <div className="text-sm text-gray-500 mb-1">Pending Payout</div>
          <div className="text-3xl font-bold text-gray-900">
            ${parseFloat(pendingPayout).toFixed(2)}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            ${parseFloat(totalPaid).toFixed(2)} total paid
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-5">
        <h3 className="font-semibold text-green-800 mb-2">How Lead Tracking Works</h3>
        <div className="text-sm text-green-700 space-y-1">
          <p>1. Visitors discover your products or profile on Leefii</p>
          <p>2. When they click "Shop Now", they're redirected to your website</p>
          <p>3. We track each referral and you earn commission per lead</p>
          <p>4. Payouts are processed monthly (minimum $50)</p>
        </div>
      </div>

      {/* Recent Leads Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Recent Leads</h2>
        </div>

        {recentLeads.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-left text-sm text-gray-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Product</th>
                  <th className="px-5 py-3 font-medium">Source</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentLeads.map((lead) => (
                  <tr key={lead.id} className="text-sm">
                    <td className="px-5 py-3 text-gray-900">
                      {new Date(lead.clickedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-5 py-3 text-gray-700">
                      {lead.product?.name || 'Direct visit'}
                    </td>
                    <td className="px-5 py-3 text-gray-500 max-w-xs truncate">
                      {lead.referrerUrl ? new URL(lead.referrerUrl).pathname : '-'}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${
                          statusColors[lead.status] || 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {lead.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-5 py-12 text-center text-gray-500">
            <div className="text-4xl mb-3">📊</div>
            <p className="font-medium">No leads yet</p>
            <p className="text-sm mt-1">
              Leads will appear here when visitors click through to your website
            </p>
          </div>
        )}
      </div>

      {/* Payout Information */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Payout Settings</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Commission Structure</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <span className="font-medium">Rate:</span>{' '}
                ${payoutSettings?.commissionRate?.toString() || '2.00'} per lead
              </p>
              <p>
                <span className="font-medium">Minimum payout:</span>{' '}
                ${payoutSettings?.minimumPayout?.toString() || '50.00'}
              </p>
              <p>
                <span className="font-medium">Payout method:</span>{' '}
                {payoutSettings?.payoutMethod || 'Not configured'}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Need to update settings?</h3>
            <p className="text-sm text-gray-600 mb-3">
              Contact support to update your payout method or commission structure.
            </p>
            <a
              href="mailto:support@leefii.com?subject=Payout Settings Update"
              className="inline-block text-sm text-green-600 hover:underline"
            >
              Contact Support →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
