import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import ReportActions from './ReportActions';

export default async function AdminReportsPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/login?callbackUrl=/admin/reports');
  }

  const reports = await prisma.inaccuracyReport.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      dispensary: {
        select: { name: true, slug: true },
      },
    },
  });

  const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    UNDER_REVIEW: 'bg-blue-100 text-blue-700',
    RESOLVED: 'bg-green-100 text-green-700',
    DISMISSED: 'bg-gray-100 text-gray-600',
  };

  const categoryLabels: Record<string, string> = {
    WRONG_HOURS: 'Wrong Hours',
    WRONG_PHONE: 'Wrong Phone',
    WRONG_ADDRESS: 'Wrong Address',
    WRONG_MENU: 'Wrong Menu',
    PERMANENTLY_CLOSED: 'Permanently Closed',
    OTHER: 'Other',
  };

  const pendingCount = reports.filter((r) => r.status === 'PENDING').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Inaccuracy Reports</h1>
            <p className="text-gray-600 mt-1">
              {pendingCount > 0
                ? `${pendingCount} pending report${pendingCount !== 1 ? 's' : ''} to review`
                : 'All reports reviewed'}
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/applications"
              className="text-gray-600 hover:underline text-sm"
            >
              Applications
            </Link>
            <Link
              href="/"
              className="text-green-600 hover:underline text-sm"
            >
              &larr; Back to Home
            </Link>
          </div>
        </div>

        {reports.length > 0 ? (
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/dispensary/${report.dispensary.slug}`}
                        className="text-lg font-semibold text-gray-900 hover:text-green-600"
                      >
                        {report.dispensary.name}
                      </Link>
                      <span className={`px-2 py-1 text-xs rounded-full ${statusColors[report.status]}`}>
                        {report.status}
                      </span>
                      <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-700">
                        {categoryLabels[report.category] || report.category}
                      </span>
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <p>{new Date(report.createdAt).toLocaleDateString()}</p>
                    {report.resolvedAt && (
                      <p className="text-xs">
                        Resolved {new Date(report.resolvedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-3">
                  <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
                    {report.description}
                  </p>
                </div>

                <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                  {report.reporterEmail && (
                    <span>Reporter: {report.reporterEmail}</span>
                  )}
                  {report.userId && (
                    <span>User ID: {report.userId.slice(0, 8)}...</span>
                  )}
                  {!report.reporterEmail && !report.userId && (
                    <span>Anonymous report</span>
                  )}
                  {report.resolvedBy && (
                    <span>Handled by: {report.resolvedBy}</span>
                  )}
                </div>

                {report.adminNotes && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-700 bg-yellow-50 rounded-lg p-3">
                      <span className="font-medium">Admin notes:</span> {report.adminNotes}
                    </p>
                  </div>
                )}

                {(report.status === 'PENDING' || report.status === 'UNDER_REVIEW') && (
                  <ReportActions reportId={report.id} dispensaryName={report.dispensary.name} />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">&#9989;</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Reports</h2>
            <p className="text-gray-600">
              There are no inaccuracy reports to review at this time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
