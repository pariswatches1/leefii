import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface PageProps {
  params: { id: string };
}

export default async function ViewUserPage({ params }: PageProps) {
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      sellerProfile: true,
      sellerApplication: true,
      _count: {
        select: {
          reviews: true,
          favorites: true,
          journalEntries: true,
          inquiries: true,
        },
      },
    },
  });

  if (!user) {
    notFound();
  }

  const recentReviews = await prisma.review.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const recentJournalEntries = await prisma.journalEntry.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/users">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Details</h1>
          <p className="text-gray-500 mt-1">{user.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm text-gray-500">Name</dt>
                  <dd className="font-medium">{user.name || "Not set"}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Email</dt>
                  <dd className="font-medium">{user.email}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Role</dt>
                  <dd>
                    <Badge variant={user.role === "ADMIN" ? "default" : user.role === "SELLER" ? "secondary" : "outline"}>
                      {user.role}
                    </Badge>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Email Verified</dt>
                  <dd>
                    {user.emailVerified ? (
                      <Badge variant="success">Verified</Badge>
                    ) : (
                      <Badge variant="secondary">Not Verified</Badge>
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Joined</dt>
                  <dd className="font-medium">{formatDate(user.createdAt)}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Last Updated</dt>
                  <dd className="font-medium">{formatDate(user.updatedAt)}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {recentReviews.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Reviews ({user._count.reviews} total)</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {recentReviews.map((review) => (
                    <li key={review.id} className="border-b pb-3 last:border-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-yellow-500">
                            {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                          </span>
                          {review.title && (
                            <p className="font-medium mt-1">{review.title}</p>
                          )}
                          <p className="text-sm text-gray-500 line-clamp-2">{review.content}</p>
                        </div>
                        <span className="text-xs text-gray-400">{formatDate(review.createdAt)}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {recentJournalEntries.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Journal Entries ({user._count.journalEntries} total)</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {recentJournalEntries.map((entry) => (
                    <li key={entry.id} className="border-b pb-3 last:border-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{entry.strainName}</p>
                          <p className="text-sm text-gray-500">
                            {entry.productType} • Rating: {"★".repeat(entry.overallRating)}
                          </p>
                          {entry.notes && (
                            <p className="text-sm text-gray-400 line-clamp-1 mt-1">{entry.notes}</p>
                          )}
                        </div>
                        <span className="text-xs text-gray-400">{formatDate(entry.consumedAt)}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Reviews</dt>
                  <dd className="font-medium">{user._count.reviews}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Favorites</dt>
                  <dd className="font-medium">{user._count.favorites}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Journal Entries</dt>
                  <dd className="font-medium">{user._count.journalEntries}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Inquiries</dt>
                  <dd className="font-medium">{user._count.inquiries}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {user.sellerProfile && (
            <Card>
              <CardHeader>
                <CardTitle>Seller Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm text-gray-500">Business Name</dt>
                    <dd className="font-medium">{user.sellerProfile.businessName}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Subscription</dt>
                    <dd>
                      <Badge>{user.sellerProfile.subscriptionTier}</Badge>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Status</dt>
                    <dd>
                      <Badge variant={user.sellerProfile.isActive ? "success" : "secondary"}>
                        {user.sellerProfile.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </dd>
                  </div>
                </dl>
                <Link href={`/sellers/${user.sellerProfile.id}`}>
                  <Button variant="outline" size="sm" className="mt-4 w-full">
                    View Seller Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {user.sellerApplication && !user.sellerProfile && (
            <Card>
              <CardHeader>
                <CardTitle>Seller Application</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm text-gray-500">Business Name</dt>
                    <dd className="font-medium">{user.sellerApplication.businessName}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Status</dt>
                    <dd>
                      <Badge variant={
                        user.sellerApplication.status === "APPROVED" ? "success" :
                        user.sellerApplication.status === "REJECTED" ? "destructive" :
                        "warning"
                      }>
                        {user.sellerApplication.status}
                      </Badge>
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          )}

          {user.image && (
            <Card>
              <CardHeader>
                <CardTitle>Profile Image</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src={user.image}
                  alt={user.name || "User"}
                  className="w-full h-32 object-cover rounded-lg"
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
