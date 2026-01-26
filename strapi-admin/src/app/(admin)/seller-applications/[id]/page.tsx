import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle, XCircle, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { getSession } from "@/lib/auth";

interface PageProps {
  params: { id: string };
}

function generateSlug(businessName: string): string {
  return businessName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function approveApplication(id: string) {
  "use server";
  const session = await getSession();
  if (!session) return;

  const application = await prisma.sellerApplication.findUnique({
    where: { id },
    include: { user: true },
  });

  if (!application) return;

  // Create seller profile
  await prisma.$transaction([
    // Update application status
    prisma.sellerApplication.update({
      where: { id },
      data: {
        status: "APPROVED",
        reviewedAt: new Date(),
        reviewedBy: session.id,
      },
    }),
    // Update user role
    prisma.user.update({
      where: { id: application.userId },
      data: { role: "SELLER" },
    }),
    // Create seller profile
    prisma.sellerProfile.create({
      data: {
        userId: application.userId,
        businessName: application.businessName,
        slug: generateSlug(application.businessName),
        phone: application.phone,
        website: application.website,
        description: application.description,
        licenseNumber: application.licenseNumber,
      },
    }),
  ]);

  redirect("/seller-applications");
}

async function rejectApplication(id: string) {
  "use server";
  const session = await getSession();
  if (!session) return;

  await prisma.sellerApplication.update({
    where: { id },
    data: {
      status: "REJECTED",
      reviewedAt: new Date(),
      reviewedBy: session.id,
    },
  });

  redirect("/seller-applications");
}

async function markUnderReview(id: string) {
  "use server";
  const session = await getSession();
  if (!session) return;

  await prisma.sellerApplication.update({
    where: { id },
    data: {
      status: "UNDER_REVIEW",
    },
  });

  redirect(`/seller-applications/${id}`);
}

export default async function ReviewApplicationPage({ params }: PageProps) {
  const application = await prisma.sellerApplication.findUnique({
    where: { id: params.id },
    include: {
      user: { select: { name: true, email: true, createdAt: true } },
    },
  });

  if (!application) {
    notFound();
  }

  const approveAction = approveApplication.bind(null, application.id);
  const rejectAction = rejectApplication.bind(null, application.id);
  const reviewAction = markUnderReview.bind(null, application.id);

  const isPending = application.status === "PENDING" || application.status === "UNDER_REVIEW";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/seller-applications">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Review Application</h1>
            <p className="text-gray-500 mt-1">{application.businessName}</p>
          </div>
        </div>
        {isPending && (
          <div className="flex gap-2">
            {application.status === "PENDING" && (
              <form action={reviewAction}>
                <Button type="submit" variant="outline" size="sm">
                  <Clock className="h-4 w-4 mr-2" />
                  Mark Under Review
                </Button>
              </form>
            )}
            <form action={approveAction}>
              <Button type="submit" variant="default" size="sm" className="bg-green-600 hover:bg-green-700">
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
            </form>
            <form action={rejectAction}>
              <Button type="submit" variant="destructive" size="sm">
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
            </form>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm text-gray-500">Business Name</dt>
                  <dd className="font-medium">{application.businessName}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Business Type</dt>
                  <dd>
                    <Badge variant="outline">
                      {application.businessType.replace("_", " ")}
                    </Badge>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">License Number</dt>
                  <dd className="font-mono text-sm">
                    {application.licenseNumber || "Not provided"}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">License State</dt>
                  <dd className="font-medium">
                    {application.licenseState || "Not provided"}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">EIN</dt>
                  <dd className="font-mono text-sm">
                    {application.ein || "Not provided"}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Website</dt>
                  <dd>
                    {application.website ? (
                      <a
                        href={application.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {application.website}
                      </a>
                    ) : (
                      "Not provided"
                    )}
                  </dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-sm text-gray-500">Description</dt>
                  <dd className="mt-1 whitespace-pre-wrap">{application.description}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm text-gray-500">Phone</dt>
                  <dd className="font-medium">{application.phone}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Email</dt>
                  <dd className="font-medium">{application.user.email}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {application.adminNotes && (
            <Card>
              <CardHeader>
                <CardTitle>Admin Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{application.adminNotes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Application Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Status</span>
                <Badge
                  variant={
                    application.status === "APPROVED"
                      ? "success"
                      : application.status === "REJECTED"
                      ? "destructive"
                      : application.status === "UNDER_REVIEW"
                      ? "secondary"
                      : "warning"
                  }
                >
                  {application.status.replace("_", " ")}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Submitted</span>
                <span className="text-sm">{formatDate(application.submittedAt)}</span>
              </div>
              {application.reviewedAt && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Reviewed</span>
                  <span className="text-sm">{formatDate(application.reviewedAt)}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Applicant</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{application.user.name || "Not set"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{application.user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="font-medium">{formatDate(application.user.createdAt)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
