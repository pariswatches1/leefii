import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export default async function InquiriesPage() {
  const session = await auth();

  const sellerProfile = await prisma.sellerProfile.findUnique({
    where: { userId: session!.user!.id },
    include: {
      inquiries: {
        orderBy: { createdAt: 'desc' },
        include: {
          product: {
            select: { name: true, slug: true },
          },
        },
      },
    },
  });

  if (!sellerProfile) {
    return null;
  }

  const statusColors: Record<string, string> = {
    NEW: 'bg-green-100 text-green-700',
    CONTACTED: 'bg-blue-100 text-blue-700',
    CONVERTED: 'bg-purple-100 text-purple-700',
    CLOSED: 'bg-gray-100 text-gray-600',
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Inquiries</h1>
        <p className="text-gray-600 mt-1">
          {sellerProfile.inquiries.length} total inquiries
        </p>
      </div>

      {sellerProfile.inquiries.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-200">
          {sellerProfile.inquiries.map((inquiry) => (
            <div key={inquiry.id} className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{inquiry.name}</h3>
                  <p className="text-sm text-gray-600">{inquiry.email}</p>
                  {inquiry.phone && (
                    <p className="text-sm text-gray-600">{inquiry.phone}</p>
                  )}
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full ${statusColors[inquiry.status]}`}
                  >
                    {inquiry.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(inquiry.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>

              {inquiry.product && (
                <p className="text-sm text-gray-500 mb-2">
                  Product: <span className="text-gray-700">{inquiry.product.name}</span>
                </p>
              )}

              <div className="bg-gray-50 rounded-lg p-4 mt-3">
                <p className="text-gray-700 whitespace-pre-wrap">{inquiry.message}</p>
              </div>

              <div className="mt-4 flex gap-3">
                <a
                  href={`mailto:${inquiry.email}`}
                  className="text-green-600 text-sm font-medium hover:underline"
                >
                  Reply via Email
                </a>
                {inquiry.phone && (
                  <a
                    href={`tel:${inquiry.phone}`}
                    className="text-green-600 text-sm font-medium hover:underline"
                  >
                    Call
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <div className="text-6xl mb-4">💬</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No inquiries yet</h2>
          <p className="text-gray-600">
            When customers inquire about your products, they will appear here.
          </p>
        </div>
      )}
    </div>
  );
}
