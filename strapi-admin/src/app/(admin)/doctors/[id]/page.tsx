import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import DoctorActions from "./DoctorActions";

interface PageProps {
  params: { id: string };
}

export default async function DoctorDetailPage({ params }: PageProps) {
  const doctor = await prisma.doctor.findUnique({
    where: { id: params.id },
    include: {
      leads: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      businessHours: true,
      _count: { select: { leads: true } },
    },
  });

  if (!doctor) {
    notFound();
  }

  const tierColors: Record<string, string> = {
    FREE: "bg-gray-100 text-gray-800",
    BASIC: "bg-blue-100 text-blue-800",
    PREMIUM: "bg-purple-100 text-purple-800",
  };

  const statusColors: Record<string, string> = {
    ACTIVE: "bg-green-100 text-green-800",
    PAST_DUE: "bg-yellow-100 text-yellow-800",
    CANCELLED: "bg-red-100 text-red-800",
    PAUSED: "bg-gray-100 text-gray-800",
  };

  const leadTypeLabels: Record<string, string> = {
    WEBSITE_CLICK: "Website Click",
    PHONE_CLICK: "Phone Click",
    DIRECTIONS_CLICK: "Directions Click",
    FORM_SUBMIT: "Form Submit",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/doctors" className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-block">
            ← Back to Doctors
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{doctor.name}</h1>
          {doctor.businessName && (
            <p className="text-gray-500 mt-1">{doctor.businessName}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${tierColors[doctor.subscriptionTier]}`}>
            {doctor.subscriptionTier}
            {doctor.subscriptionTier !== "FREE" && ` - $${doctor.monthlyRate}/mo`}
          </span>
          <Badge variant={doctor.isActive ? "success" : "secondary"}>
            {doctor.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Info */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm text-gray-500">Email</dt>
                <dd className="text-gray-900">{doctor.email}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Phone</dt>
                <dd className="text-gray-900">{doctor.phone || "Not provided"}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Website</dt>
                <dd className="text-gray-900">
                  {doctor.website ? (
                    <a href={doctor.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {doctor.website}
                    </a>
                  ) : (
                    "Not provided"
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Location</dt>
                <dd className="text-gray-900">
                  {doctor.address && <p>{doctor.address}</p>}
                  <p>{doctor.city}, {doctor.state} {doctor.zipCode}</p>
                </dd>
              </div>
            </dl>
          </div>

          {/* Services */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Services</h2>
            {doctor.services.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {doctor.services.map((service) => (
                  <span key={service} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                    {service}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No services listed</p>
            )}
            <div className="mt-4 flex gap-4">
              {doctor.telemedicine && (
                <span className="text-sm text-green-600">✓ Telemedicine Available</span>
              )}
              {doctor.walkInsWelcome && (
                <span className="text-sm text-green-600">✓ Walk-ins Welcome</span>
              )}
              {doctor.acceptsInsurance && (
                <span className="text-sm text-green-600">✓ Accepts Insurance</span>
              )}
            </div>
          </div>

          {/* Credentials */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Credentials</h2>
            <dl className="grid grid-cols-3 gap-4">
              <div>
                <dt className="text-sm text-gray-500">License Number</dt>
                <dd className="text-gray-900">{doctor.licenseNumber || "Not provided"}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">License State</dt>
                <dd className="text-gray-900">{doctor.licenseState || "Not provided"}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">NPI Number</dt>
                <dd className="text-gray-900">{doctor.npiNumber || "Not provided"}</dd>
              </div>
            </dl>
          </div>

          {/* Recent Leads */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Leads ({doctor._count.leads} total)
            </h2>
            {doctor.leads.length > 0 ? (
              <div className="space-y-3">
                {doctor.leads.map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {leadTypeLabels[lead.type] || lead.type}
                      </p>
                      {lead.referrerUrl && (
                        <p className="text-xs text-gray-500">From: {lead.referrerUrl}</p>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{formatDate(lead.createdAt)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No leads yet</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <DoctorActions doctor={doctor} />

          {/* Subscription Details */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Subscription</h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm text-gray-500">Tier</dt>
                <dd>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${tierColors[doctor.subscriptionTier]}`}>
                    {doctor.subscriptionTier}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Status</dt>
                <dd>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[doctor.subscriptionStatus]}`}>
                    {doctor.subscriptionStatus}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Monthly Rate</dt>
                <dd className="text-gray-900 font-medium">${Number(doctor.monthlyRate)}/mo</dd>
              </div>
              {doctor.stripeCustomerId && (
                <div>
                  <dt className="text-sm text-gray-500">Stripe Customer</dt>
                  <dd className="text-gray-900 text-sm font-mono">{doctor.stripeCustomerId}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Timestamps */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Activity</h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm text-gray-500">Registered</dt>
                <dd className="text-gray-900">{formatDate(doctor.createdAt)}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Last Updated</dt>
                <dd className="text-gray-900">{formatDate(doctor.updatedAt)}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Total Leads</dt>
                <dd className="text-gray-900">{doctor._count.leads}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
