import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import ApplicationActions from './ApplicationActions';

export default async function AdminApplicationsPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  const applications = await prisma.sellerApplication.findMany({
    orderBy: { submittedAt: 'desc' },
    include: {
      user: {
        select: { email: true, name: true },
      },
    },
  });

  const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    UNDER_REVIEW: 'bg-blue-100 text-blue-700',
    APPROVED: 'bg-green-100 text-green-700',
    REJECTED: 'bg-red-100 text-red-700',
  };

  const businessTypeLabels: Record<string, string> = {
    DISPENSARY: 'Dispensary',
    DELIVERY: 'Delivery Service',
    BRAND: 'Cannabis Brand',
    MANUFACTURER: 'Manufacturer',
    DISTRIBUTOR: 'Distributor',
    CBD_RETAILER: 'CBD Retailer',
    ACCESSORIES: 'Accessories',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Seller Applications</h1>
            <p className="text-gray-600 mt-1">
              Review and manage seller applications
            </p>
          </div>
          <Link
            href="/admin/sellers"
            className="text-green-600 hover:underline"
          >
            View Active Sellers →
          </Link>
        </div>

        {applications.length > 0 ? (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-lg font-semibold text-gray-900">
                        {app.businessName}
                      </h2>
                      <span className={`px-2 py-1 text-xs rounded-full ${statusColors[app.status]}`}>
                        {app.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {businessTypeLabels[app.businessType] || app.businessType}
                    </p>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <p>Submitted {new Date(app.submittedAt).toLocaleDateString()}</p>
                    {app.reviewedAt && (
                      <p>Reviewed {new Date(app.reviewedAt).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Contact</h3>
                    <dl className="space-y-1 text-sm">
                      <div className="flex">
                        <dt className="text-gray-500 w-20">User:</dt>
                        <dd className="text-gray-900">{app.user.name || app.user.email}</dd>
                      </div>
                      <div className="flex">
                        <dt className="text-gray-500 w-20">Email:</dt>
                        <dd className="text-gray-900">{app.user.email}</dd>
                      </div>
                      <div className="flex">
                        <dt className="text-gray-500 w-20">Phone:</dt>
                        <dd className="text-gray-900">{app.phone}</dd>
                      </div>
                      {app.website && (
                        <div className="flex">
                          <dt className="text-gray-500 w-20">Website:</dt>
                          <dd className="text-gray-900">
                            <a href={app.website} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
                              {app.website}
                            </a>
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">License Info</h3>
                    <dl className="space-y-1 text-sm">
                      {app.licenseNumber ? (
                        <>
                          <div className="flex">
                            <dt className="text-gray-500 w-20">License:</dt>
                            <dd className="text-gray-900">{app.licenseNumber}</dd>
                          </div>
                          <div className="flex">
                            <dt className="text-gray-500 w-20">State:</dt>
                            <dd className="text-gray-900">{app.licenseState || '-'}</dd>
                          </div>
                        </>
                      ) : (
                        <p className="text-gray-500">No license provided</p>
                      )}
                      {app.ein && (
                        <div className="flex">
                          <dt className="text-gray-500 w-20">EIN:</dt>
                          <dd className="text-gray-900">{app.ein}</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                  <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
                    {app.description}
                  </p>
                </div>

                {app.adminNotes && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Admin Notes</h3>
                    <p className="text-sm text-gray-700 bg-yellow-50 rounded-lg p-3">
                      {app.adminNotes}
                    </p>
                  </div>
                )}

                {app.status === 'PENDING' || app.status === 'UNDER_REVIEW' ? (
                  <ApplicationActions applicationId={app.id} userId={app.userId} businessName={app.businessName} />
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Applications</h2>
            <p className="text-gray-600">
              There are no seller applications to review at this time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
