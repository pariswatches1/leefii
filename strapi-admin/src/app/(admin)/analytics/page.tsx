import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  MousePointer,
  Globe,
  Leaf,
  Store,
} from "lucide-react";

export default async function AnalyticsPage() {
  // Get date ranges
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Overall stats
  const [
    totalUsers,
    newUsersThisMonth,
    totalStrains,
    totalDispensaries,
    totalReviews,
    totalJournalEntries,
    totalLeads,
    totalProducts,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.strain.count({ where: { isActive: true } }),
    prisma.dispensary.count({ where: { isActive: true } }),
    prisma.review.count(),
    prisma.journalEntry.count(),
    prisma.leadReferral.count(),
    prisma.product.count({ where: { isAvailable: true } }),
  ]);

  // Analytics events by type
  const eventsByType = await prisma.analyticsEvent.groupBy({
    by: ["eventType"],
    _count: true,
    where: { createdAt: { gte: thirtyDaysAgo } },
  });

  // Top pages (last 30 days)
  const topPages = await prisma.pageView.groupBy({
    by: ["path"],
    _sum: { viewCount: true },
    where: { date: { gte: thirtyDaysAgo } },
    orderBy: { _sum: { viewCount: "desc" } },
    take: 10,
  });

  // Reviews by status
  const reviewsByStatus = await prisma.review.groupBy({
    by: ["isApproved"],
    _count: true,
  });

  // Seller applications by status
  const applicationsByStatus = await prisma.sellerApplication.groupBy({
    by: ["status"],
    _count: true,
  });

  // Journal entries by product type
  const journalByType = await prisma.journalEntry.groupBy({
    by: ["productType"],
    _count: true,
    orderBy: { _count: { productType: "desc" } },
    take: 5,
  });

  // Recent growth stats
  const usersLastWeek = await prisma.user.count({
    where: { createdAt: { gte: sevenDaysAgo } },
  });
  const reviewsLastWeek = await prisma.review.count({
    where: { createdAt: { gte: sevenDaysAgo } },
  });
  const journalLastWeek = await prisma.journalEntry.count({
    where: { createdAt: { gte: sevenDaysAgo } },
  });
  const leadsLastWeek = await prisma.leadReferral.count({
    where: { clickedAt: { gte: sevenDaysAgo } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-500 mt-1">Platform overview and key metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Users</p>
                <p className="text-2xl font-bold">{totalUsers.toLocaleString()}</p>
                <p className="text-xs text-green-600">+{newUsersThisMonth} this month</p>
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
                <p className="text-sm text-gray-500">Strains</p>
                <p className="text-2xl font-bold">{totalStrains.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Leaf className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Dispensaries</p>
                <p className="text-2xl font-bold">{totalDispensaries.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Store className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Lead Referrals</p>
                <p className="text-2xl font-bold">{totalLeads.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Growth */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Weekly Growth (Last 7 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-500">New Users</p>
              <p className="text-2xl font-bold text-blue-600">+{usersLastWeek}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-500">New Reviews</p>
              <p className="text-2xl font-bold text-green-600">+{reviewsLastWeek}</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-500">Journal Entries</p>
              <p className="text-2xl font-bold text-purple-600">+{journalLastWeek}</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-gray-500">Lead Clicks</p>
              <p className="text-2xl font-bold text-yellow-600">+{leadsLastWeek}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Analytics Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MousePointer className="h-5 w-5" />
              Event Types (Last 30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {eventsByType.map((event) => (
                <div
                  key={event.eventType || "unknown"}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{event.eventType || "Unknown"}</Badge>
                  </div>
                  <span className="font-medium">{event._count.toLocaleString()}</span>
                </div>
              ))}
              {eventsByType.length === 0 && (
                <p className="text-gray-500 text-center py-4">No events recorded</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Top Pages (Last 30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topPages.map((page, index) => (
                <div
                  key={page.path}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-400">
                      #{index + 1}
                    </span>
                    <span className="text-sm truncate max-w-[200px]">{page.path}</span>
                  </div>
                  <span className="font-medium">
                    {(page._sum.viewCount || 0).toLocaleString()}
                  </span>
                </div>
              ))}
              {topPages.length === 0 && (
                <p className="text-gray-500 text-center py-4">No page views recorded</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Reviews Status */}
        <Card>
          <CardHeader>
            <CardTitle>Reviews by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {reviewsByStatus.map((status) => (
                <div
                  key={String(status.isApproved)}
                  className="p-4 bg-gray-50 rounded-lg text-center"
                >
                  <Badge variant={status.isApproved ? "success" : "warning"}>
                    {status.isApproved ? "Approved" : "Pending"}
                  </Badge>
                  <p className="text-2xl font-bold mt-2">{status._count}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Total Reviews</span>
                <span className="font-bold">{totalReviews}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seller Applications */}
        <Card>
          <CardHeader>
            <CardTitle>Seller Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {applicationsByStatus.map((app) => (
                <div
                  key={app.status}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <Badge
                    variant={
                      app.status === "APPROVED"
                        ? "success"
                        : app.status === "REJECTED"
                        ? "destructive"
                        : app.status === "UNDER_REVIEW"
                        ? "secondary"
                        : "warning"
                    }
                  >
                    {app.status.replace("_", " ")}
                  </Badge>
                  <span className="font-medium">{app._count}</span>
                </div>
              ))}
              {applicationsByStatus.length === 0 && (
                <p className="text-gray-500 text-center py-4">No applications</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Journal by Product Type */}
        <Card>
          <CardHeader>
            <CardTitle>Journal Entries by Product Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {journalByType.map((item) => (
                <div
                  key={item.productType}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <Badge variant="secondary">{item.productType.replace("_", " ")}</Badge>
                  <span className="font-medium">{item._count}</span>
                </div>
              ))}
              {journalByType.length === 0 && (
                <p className="text-gray-500 text-center py-4">No journal entries</p>
              )}
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Total Entries</span>
                <span className="font-bold">{totalJournalEntries}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Marketplace Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Marketplace Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-lg text-center">
                <p className="text-sm text-gray-500">Available Products</p>
                <p className="text-2xl font-bold text-green-600">{totalProducts}</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg text-center">
                <p className="text-sm text-gray-500">Total Leads</p>
                <p className="text-2xl font-bold text-blue-600">{totalLeads}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
