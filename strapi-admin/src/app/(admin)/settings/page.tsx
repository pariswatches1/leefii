import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  Settings,
  Database,
  Users,
  Leaf,
  Store,
  FileText,
  Star,
  BookOpen,
  TrendingUp,
  Package,
} from "lucide-react";

export default async function SettingsPage() {
  const session = await getSession();
  if (!session || (session.role !== "SUPER_ADMIN" && session.role !== "ADMIN")) {
    redirect("/dashboard");
  }

  // Get database stats
  const [
    userCount,
    strainCount,
    dispensaryCount,
    blogCount,
    newsCount,
    dealCount,
    reviewCount,
    journalCount,
    productCount,
    leadCount,
    sellerCount,
    applicationCount,
    adminCount,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.strain.count(),
    prisma.dispensary.count(),
    prisma.blogPost.count(),
    prisma.newsArticle.count(),
    prisma.deal.count(),
    prisma.review.count(),
    prisma.journalEntry.count(),
    prisma.product.count(),
    prisma.leadReferral.count(),
    prisma.sellerProfile.count(),
    prisma.sellerApplication.count(),
    prisma.adminUser.count(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">System configuration and database overview</p>
      </div>

      {/* Current User */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Current Session
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <dt className="text-sm text-gray-500">Email</dt>
              <dd className="font-medium">{session.email}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Name</dt>
              <dd className="font-medium">{session.name || "Not set"}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Role</dt>
              <dd>
                <Badge
                  variant={
                    session.role === "SUPER_ADMIN"
                      ? "destructive"
                      : session.role === "ADMIN"
                      ? "default"
                      : "secondary"
                  }
                >
                  {session.role}
                </Badge>
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Database Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <Users className="h-6 w-6 mx-auto text-blue-600 mb-2" />
              <p className="text-2xl font-bold">{userCount.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Users</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <Leaf className="h-6 w-6 mx-auto text-green-600 mb-2" />
              <p className="text-2xl font-bold">{strainCount.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Strains</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <Store className="h-6 w-6 mx-auto text-purple-600 mb-2" />
              <p className="text-2xl font-bold">{dispensaryCount.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Dispensaries</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <FileText className="h-6 w-6 mx-auto text-orange-600 mb-2" />
              <p className="text-2xl font-bold">{blogCount}</p>
              <p className="text-sm text-gray-500">Blog Posts</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <FileText className="h-6 w-6 mx-auto text-red-600 mb-2" />
              <p className="text-2xl font-bold">{newsCount}</p>
              <p className="text-sm text-gray-500">News Articles</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <Star className="h-6 w-6 mx-auto text-yellow-600 mb-2" />
              <p className="text-2xl font-bold">{reviewCount}</p>
              <p className="text-sm text-gray-500">Reviews</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <BookOpen className="h-6 w-6 mx-auto text-indigo-600 mb-2" />
              <p className="text-2xl font-bold">{journalCount}</p>
              <p className="text-sm text-gray-500">Journal Entries</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <Package className="h-6 w-6 mx-auto text-teal-600 mb-2" />
              <p className="text-2xl font-bold">{productCount}</p>
              <p className="text-sm text-gray-500">Products</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <TrendingUp className="h-6 w-6 mx-auto text-pink-600 mb-2" />
              <p className="text-2xl font-bold">{leadCount}</p>
              <p className="text-sm text-gray-500">Lead Referrals</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <Settings className="h-6 w-6 mx-auto text-gray-600 mb-2" />
              <p className="text-2xl font-bold">{dealCount}</p>
              <p className="text-sm text-gray-500">Deals</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seller Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Seller & Admin Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-gray-500">Active Sellers</p>
              <p className="text-2xl font-bold">{sellerCount}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-gray-500">Seller Applications</p>
              <p className="text-2xl font-bold">{applicationCount}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-gray-500">Admin Users</p>
              <p className="text-2xl font-bold">{adminCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Info */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm text-gray-500">Admin Panel Version</dt>
              <dd className="font-medium">1.0.0</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Framework</dt>
              <dd className="font-medium">Next.js 14 + Prisma</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Database</dt>
              <dd className="font-medium">PostgreSQL (Neon)</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Deployment</dt>
              <dd className="font-medium">Vercel</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Note about Doctors */}
      <Card>
        <CardHeader>
          <CardTitle>External Data Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="font-medium text-blue-800">Doctors / MMJ Card Services</p>
            <p className="text-sm text-blue-600 mt-1">
              Doctor listings are fetched dynamically from Google Places API based on user location.
              They are not stored in the database and cannot be managed through this admin panel.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
