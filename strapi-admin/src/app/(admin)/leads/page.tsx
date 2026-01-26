import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { DollarSign, MousePointer, TrendingUp, Users, ExternalLink, Eye, Store } from "lucide-react";

export default async function LeadReferralsPage() {
  // Get dispensary IDs from leads first to fetch names
  const allLeads = await prisma.leadReferral.findMany({
    orderBy: { clickedAt: "desc" },
    take: 100,
    include: {
      seller: {
        select: {
          id: true,
          businessName: true,
          email: true,
          phone: true,
        }
      },
      product: { select: { name: true } },
      user: { select: { email: true } },
    },
  });

  // Get dispensary names for leads that have dispensaryId
  const leadDispensaryIds = allLeads.map((l) => l.dispensaryId).filter(Boolean) as string[];
  const leadDispensaries = await prisma.dispensary.findMany({
    where: { id: { in: leadDispensaryIds } },
    select: { id: true, name: true },
  });

  // Map dispensary names to leads
  const leads = allLeads.map((lead) => ({
    ...lead,
    dispensaryName: lead.dispensaryId
      ? leadDispensaries.find((d) => d.id === lead.dispensaryId)?.name || "Unknown Dispensary"
      : null,
  }));

  // Calculate stats
  const totalLeads = await prisma.leadReferral.count();
  const clickedLeads = await prisma.leadReferral.count({
    where: { status: "CLICKED" },
  });
  const convertedLeads = await prisma.leadReferral.count({
    where: { status: "CONVERTED" },
  });

  const totalRevenue = await prisma.leadReferral.aggregate({
    where: { conversionValue: { not: null } },
    _sum: { conversionValue: true },
  });

  const conversionRate = totalLeads > 0
    ? ((convertedLeads / totalLeads) * 100).toFixed(1)
    : "0";

  // Group leads by seller for billing summary
  const leadsBySeller = await prisma.leadReferral.groupBy({
    by: ["sellerId"],
    _count: true,
    where: { sellerId: { not: null } },
  });

  // Group leads by dispensary for billing summary
  const leadsByDispensary = await prisma.leadReferral.groupBy({
    by: ["dispensaryId"],
    _count: true,
    where: { dispensaryId: { not: null } },
  });

  // Get seller details for the summary
  const sellerIds = leadsBySeller.map((l) => l.sellerId).filter(Boolean) as string[];
  const sellers = await prisma.sellerProfile.findMany({
    where: { id: { in: sellerIds } },
    select: {
      id: true,
      businessName: true,
      email: true,
      phone: true,
      payoutSettings: {
        select: {
          commissionRate: true,
          commissionType: true,
        },
      },
    },
  });

  // Get dispensary details for the summary
  const dispensaryIds = leadsByDispensary.map((l) => l.dispensaryId).filter(Boolean) as string[];
  const dispensaries = await prisma.dispensary.findMany({
    where: { id: { in: dispensaryIds } },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
    },
  });

  // Create billing summary for sellers
  const sellerBillingSummary = leadsBySeller.map((item) => {
    const seller = sellers.find((s) => s.id === item.sellerId);
    const rate = seller?.payoutSettings?.commissionRate
      ? Number(seller.payoutSettings.commissionRate)
      : 2.00; // Default $2 per lead
    return {
      id: item.sellerId,
      type: "Seller" as const,
      businessName: seller?.businessName || "Unknown Seller",
      email: seller?.email || "N/A",
      phone: seller?.phone || "N/A",
      leadCount: item._count,
      rate: rate,
      totalDue: item._count * rate,
    };
  });

  // Create billing summary for dispensaries
  const dispensaryBillingSummary = leadsByDispensary.map((item) => {
    const dispensary = dispensaries.find((d) => d.id === item.dispensaryId);
    const rate = 2.00; // Default $2 per lead for dispensaries
    return {
      id: item.dispensaryId,
      type: "Dispensary" as const,
      businessName: dispensary?.name || "Unknown Dispensary",
      email: dispensary?.email || "N/A",
      phone: dispensary?.phone || "N/A",
      leadCount: item._count,
      rate: rate,
      totalDue: item._count * rate,
    };
  });

  // Combine and sort by lead count
  const billingSummary = [...sellerBillingSummary, ...dispensaryBillingSummary]
    .sort((a, b) => b.leadCount - a.leadCount);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Lead Referrals</h1>
        <p className="text-gray-500 mt-1">
          Track and manage lead referrals and conversions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Leads</p>
                <p className="text-2xl font-bold">{totalLeads.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Clicks</p>
                <p className="text-2xl font-bold">{clickedLeads.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <MousePointer className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Conversions</p>
                <p className="text-2xl font-bold">{convertedLeads.toLocaleString()}</p>
                <p className="text-xs text-gray-400">{conversionRate}% rate</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold">
                  ${Number(totalRevenue._sum.conversionValue || 0).toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Billing Summary by Client */}
      {billingSummary.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Billing Summary by Client
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Client Name</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Contact</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700"># Leads</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Rate</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Amount Due</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {billingSummary.map((item) => (
                    <tr key={`${item.type}-${item.id}`} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <p className="font-medium">{item.businessName}</p>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={item.type === "Seller" ? "secondary" : "outline"}>
                          {item.type === "Seller" ? "Seller" : "Dispensary"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm">{item.email}</p>
                        {item.phone !== "N/A" && (
                          <p className="text-xs text-gray-500">{item.phone}</p>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant="default" className="text-lg px-3 py-1">{item.leadCount}</Badge>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-sm text-gray-600">${item.rate.toFixed(2)}/lead</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="font-bold text-green-600 text-lg">${item.totalDue.toFixed(2)}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {item.id && (
                          <Link href={item.type === "Seller" ? `/sellers/${item.id}` : `/dispensaries/${item.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-green-50 font-semibold">
                    <td className="py-4 px-4" colSpan={3}>
                      <span className="text-lg">TOTAL TO COLLECT</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-lg">{billingSummary.reduce((sum, item) => sum + item.leadCount, 0)} leads</span>
                    </td>
                    <td className="py-4 px-4"></td>
                    <td className="py-4 px-4 text-right text-green-700">
                      <span className="text-xl">${billingSummary.reduce((sum, item) => sum + item.totalDue, 0).toFixed(2)}</span>
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No leads message */}
      {billingSummary.length === 0 && totalLeads > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-4">
              <p className="text-gray-500">
                You have {totalLeads} lead(s), but they are not associated with any seller or dispensary.
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Leads need a sellerId or dispensaryId to appear in the billing summary.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Leads Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Lead Referrals (Detailed)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-3 px-4 text-sm text-gray-500">Date</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-500">Seller / Client</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-500">Product</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-500">Destination</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-500">Source</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-500">Status</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-500">Tracking</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <p className="text-sm">{formatDate(lead.clickedAt)}</p>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        {lead.seller ? (
                          <>
                            <p className="font-medium text-sm">{lead.seller.businessName}</p>
                            <Badge variant="secondary" className="text-xs">Seller</Badge>
                          </>
                        ) : lead.dispensaryName ? (
                          <>
                            <p className="font-medium text-sm">{lead.dispensaryName}</p>
                            <Badge variant="outline" className="text-xs">Dispensary</Badge>
                          </>
                        ) : (
                          <p className="text-sm text-gray-400">Unassigned</p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-gray-600">
                        {lead.product?.name || "Direct Visit"}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      {lead.destinationUrl ? (
                        <a
                          href={lead.destinationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline flex items-center gap-1 max-w-[200px] truncate"
                        >
                          {lead.destinationUrl.replace(/^https?:\/\//, "").slice(0, 30)}...
                          <ExternalLink className="h-3 w-3 flex-shrink-0" />
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-xs">
                        {lead.utmSource && (
                          <Badge variant="outline" className="mr-1 mb-1">{lead.utmSource}</Badge>
                        )}
                        {lead.utmMedium && (
                          <Badge variant="outline" className="mr-1 mb-1">{lead.utmMedium}</Badge>
                        )}
                        {!lead.utmSource && !lead.utmMedium && (
                          <span className="text-gray-400">Direct</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          lead.status === "CONVERTED"
                            ? "success"
                            : lead.status === "LANDED"
                            ? "secondary"
                            : lead.status === "EXPIRED"
                            ? "outline"
                            : "default"
                        }
                      >
                        {lead.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded block max-w-[100px] truncate">
                        {lead.trackingCode}
                      </code>
                    </td>
                  </tr>
                ))}
                {leads.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-500">
                      No lead referrals yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
