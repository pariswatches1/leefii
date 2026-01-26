import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Eye, CheckCircle, XCircle } from "lucide-react";

export default async function SellerApplicationsPage() {
  const applications = await prisma.sellerApplication.findMany({
    orderBy: { submittedAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
    },
  });

  const pending = applications.filter((a) => a.status === "PENDING").length;
  const underReview = applications.filter((a) => a.status === "UNDER_REVIEW").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Seller Applications</h1>
          <p className="text-gray-500 mt-1">
            Review and manage seller applications
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="warning" className="text-sm px-3 py-1">
            {pending} Pending
          </Badge>
          <Badge variant="secondary" className="text-sm px-3 py-1">
            {underReview} Under Review
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm text-gray-500">Business</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-500">Applicant</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-500">Type</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-500">Status</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-500">Submitted</th>
                  <th className="text-right py-3 px-4 text-sm text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{app.businessName}</p>
                        {app.website && (
                          <p className="text-xs text-gray-400">{app.website}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm">{app.user.name || app.user.email}</p>
                      <p className="text-xs text-gray-400">{app.phone}</p>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline">{app.businessType.replace("_", " ")}</Badge>
                    </td>
                    <td className="py-3 px-4">
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
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {formatDate(app.submittedAt)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link href={`/seller-applications/${app.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Review
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
                {applications.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500">
                      No seller applications yet.
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
