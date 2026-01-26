import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Store, Users, FileText, Star, Tag, Newspaper, ShoppingBag } from "lucide-react";
import Link from "next/link";

async function getStats() {
  const [
    strainCount,
    dispensaryCount,
    userCount,
    blogCount,
    newsCount,
    dealCount,
    reviewCount,
    sellerCount,
  ] = await Promise.all([
    prisma.strain.count(),
    prisma.dispensary.count(),
    prisma.user.count(),
    prisma.blogPost.count(),
    prisma.newsArticle.count(),
    prisma.deal.count(),
    prisma.review.count(),
    prisma.sellerProfile.count(),
  ]);

  return {
    strainCount,
    dispensaryCount,
    userCount,
    blogCount,
    newsCount,
    dealCount,
    reviewCount,
    sellerCount,
  };
}

async function getRecentActivity() {
  const [recentStrains, recentReviews, recentUsers] = await Promise.all([
    prisma.strain.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, name: true, type: true, createdAt: true },
    }),
    prisma.review.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, rating: true, content: true, createdAt: true, user: { select: { name: true, email: true } } },
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    }),
  ]);

  return { recentStrains, recentReviews, recentUsers };
}

export default async function DashboardPage() {
  const stats = await getStats();
  const { recentStrains, recentReviews, recentUsers } = await getRecentActivity();

  const statCards = [
    { label: "Strains", value: stats.strainCount, icon: Leaf, href: "/strains", color: "text-green-600" },
    { label: "Dispensaries", value: stats.dispensaryCount, icon: Store, href: "/dispensaries", color: "text-blue-600" },
    { label: "Users", value: stats.userCount, icon: Users, href: "/users", color: "text-purple-600" },
    { label: "Blog Posts", value: stats.blogCount, icon: FileText, href: "/blog", color: "text-orange-600" },
    { label: "News", value: stats.newsCount, icon: Newspaper, href: "/news", color: "text-red-600" },
    { label: "Deals", value: stats.dealCount, icon: Tag, href: "/deals", color: "text-yellow-600" },
    { label: "Reviews", value: stats.reviewCount, icon: Star, href: "/reviews", color: "text-pink-600" },
    { label: "Sellers", value: stats.sellerCount, icon: ShoppingBag, href: "/sellers", color: "text-indigo-600" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome to the Leefii Admin Panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} href={stat.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    {stat.label}
                  </CardTitle>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value.toLocaleString()}</div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Strains */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Leaf className="h-5 w-5 text-green-600" />
              Recent Strains
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {recentStrains.map((strain) => (
                <li key={strain.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-sm">{strain.name}</p>
                    <p className="text-xs text-gray-500">{strain.type}</p>
                  </div>
                  <Link
                    href={`/strains/${strain.id}`}
                    className="text-xs text-green-600 hover:underline"
                  >
                    Edit
                  </Link>
                </li>
              ))}
              {recentStrains.length === 0 && (
                <p className="text-sm text-gray-500">No strains yet</p>
              )}
            </ul>
          </CardContent>
        </Card>

        {/* Recent Reviews */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-600" />
              Recent Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {recentReviews.map((review) => (
                <li key={review.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-sm">
                      {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                    </p>
                    <p className="text-xs text-gray-500 truncate max-w-[150px]">
                      {review.user?.name || review.user?.email || "Anonymous"}
                    </p>
                  </div>
                  <Link
                    href={`/reviews/${review.id}`}
                    className="text-xs text-green-600 hover:underline"
                  >
                    View
                  </Link>
                </li>
              ))}
              {recentReviews.length === 0 && (
                <p className="text-sm text-gray-500">No reviews yet</p>
              )}
            </ul>
          </CardContent>
        </Card>

        {/* Recent Users */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              Recent Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {recentUsers.map((user) => (
                <li key={user.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-sm">{user.name || "No name"}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                    {user.role}
                  </span>
                </li>
              ))}
              {recentUsers.length === 0 && (
                <p className="text-sm text-gray-500">No users yet</p>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
