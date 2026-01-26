import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Check, X, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { getSession } from "@/lib/auth";

interface PageProps {
  params: { id: string };
}

async function approveReview(id: string) {
  "use server";
  const session = await getSession();
  if (!session) return;

  await prisma.review.update({
    where: { id },
    data: { isApproved: true },
  });

  redirect("/reviews");
}

async function deleteReview(id: string) {
  "use server";
  const session = await getSession();
  if (!session) return;

  await prisma.review.delete({
    where: { id },
  });

  redirect("/reviews");
}

export default async function ViewReviewPage({ params }: PageProps) {
  const review = await prisma.review.findUnique({
    where: { id: params.id },
    include: {
      user: { select: { name: true, email: true, image: true } },
    },
  });

  if (!review) {
    notFound();
  }

  // Try to get related entity names
  let entityName = "Unknown";
  let entityType = "Unknown";

  if (review.strainId) {
    const strain = await prisma.strain.findUnique({
      where: { id: review.strainId },
      select: { name: true },
    });
    entityName = strain?.name || "Unknown Strain";
    entityType = "Strain";
  } else if (review.dispensaryId) {
    const dispensary = await prisma.dispensary.findUnique({
      where: { id: review.dispensaryId },
      select: { name: true },
    });
    entityName = dispensary?.name || "Unknown Dispensary";
    entityType = "Dispensary";
  } else if (review.productId) {
    const product = await prisma.product.findUnique({
      where: { id: review.productId },
      select: { name: true },
    });
    entityName = product?.name || "Unknown Product";
    entityType = "Product";
  } else if (review.sellerId) {
    const seller = await prisma.sellerProfile.findUnique({
      where: { id: review.sellerId },
      select: { businessName: true },
    });
    entityName = seller?.businessName || "Unknown Seller";
    entityType = "Seller";
  }

  const approveAction = approveReview.bind(null, review.id);
  const deleteAction = deleteReview.bind(null, review.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/reviews">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Review Details</h1>
            <p className="text-gray-500 mt-1">Review for {entityName}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {!review.isApproved && (
            <form action={approveAction}>
              <Button type="submit" variant="default" size="sm">
                <Check className="h-4 w-4 mr-2" />
                Approve
              </Button>
            </form>
          )}
          <form action={deleteAction}>
            <Button type="submit" variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Review Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Rating</p>
                <p className="text-2xl text-yellow-500">
                  {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                </p>
              </div>

              {review.title && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Title</p>
                  <p className="font-medium text-lg">{review.title}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-500 mb-1">Content</p>
                <p className="whitespace-pre-wrap">{review.content}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Author</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                {review.user.image && (
                  <img
                    src={review.user.image}
                    alt={review.user.name || "User"}
                    className="w-12 h-12 rounded-full"
                  />
                )}
                <div>
                  <p className="font-medium">{review.user.name || "Anonymous"}</p>
                  <p className="text-sm text-gray-500">{review.user.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Approved</span>
                <Badge variant={review.isApproved ? "success" : "warning"}>
                  {review.isApproved ? "Yes" : "Pending"}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Verified Purchase</span>
                <Badge variant={review.isVerified ? "success" : "secondary"}>
                  {review.isVerified ? "Yes" : "No"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Review For</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Type</dt>
                  <dd className="font-medium">{entityType}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Name</dt>
                  <dd className="font-medium">{entityName}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Helpful Votes</dt>
                  <dd className="font-medium">{review.helpfulCount}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Reports</dt>
                  <dd className="font-medium">{review.reportCount}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dates</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Created</dt>
                  <dd className="font-medium">{formatDate(review.createdAt)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Updated</dt>
                  <dd className="font-medium">{formatDate(review.updatedAt)}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
