import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";

interface PageProps {
  searchParams: { page?: string; tab?: string };
}

export default async function SellersPage({ searchParams }: PageProps) {
  const page = parseInt(searchParams.page || "1");
  const pageSize = 20;
  const tab = searchParams.tab || "sellers";

  if (tab === "applications") {
    const [applications, total, pendingCount] = await Promise.all([
      prisma.sellerApplication.findMany({
        orderBy: { submittedAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          user: { select: { name: true, email: true } },
        },
      }),
      prisma.sellerApplication.count(),
      prisma.sellerApplication.count({ where: { status: "PENDING" } }),
    ]);

    const totalPages = Math.ceil(total / pageSize);

    const statusColors: Record<string, string> = {
      PENDING: "bg-yellow-100 text-yellow-800",
      UNDER_REVIEW: "bg-blue-100 text-blue-800",
      APPROVED: "bg-green-100 text-green-800",
      REJECTED: "bg-red-100 text-red-800",
    };

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Seller Applications</h1>
          <p className="text-gray-500 mt-1">{pendingCount} pending applications</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 bg-white p-4 rounded-lg shadow-sm">
          <Link href="/sellers">
            <Button variant={tab !== "applications" ? "default" : "outline"}>
              Active Sellers
            </Button>
          </Link>
          <Link href="/sellers?tab=applications">
            <Button variant={tab === "applications" ? "default" : "outline"}>
              Applications ({pendingCount})
            </Button>
          </Link>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Business</TableHead>
                <TableHead>Applicant</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">{app.businessName}</TableCell>
                  <TableCell>
                    <div>
                      <p>{app.user.name || "No name"}</p>
                      <p className="text-sm text-gray-500">{app.user.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{app.businessType}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[app.status]}`}>
                      {app.status}
                    </span>
                  </TableCell>
                  <TableCell>{formatDate(app.submittedAt)}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/sellers/applications/${app.id}`}>
                      <Button variant="ghost" size="sm">
                        Review
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            {page > 1 && (
              <Link href={`/sellers?tab=applications&page=${page - 1}`}>
                <Button variant="outline">Previous</Button>
              </Link>
            )}
            <span className="flex items-center px-4 py-2 text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
            {page < totalPages && (
              <Link href={`/sellers?tab=applications&page=${page + 1}`}>
                <Button variant="outline">Next</Button>
              </Link>
            )}
          </div>
        )}
      </div>
    );
  }

  // Active Sellers tab
  const [sellers, total] = await Promise.all([
    prisma.sellerProfile.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        user: { select: { name: true, email: true } },
        _count: { select: { products: true } },
      },
    }),
    prisma.sellerProfile.count(),
  ]);

  const totalPages = Math.ceil(total / pageSize);
  const pendingCount = await prisma.sellerApplication.count({ where: { status: "PENDING" } });

  const tierColors: Record<string, string> = {
    BASIC: "bg-gray-100 text-gray-800",
    STANDARD: "bg-blue-100 text-blue-800",
    PREMIUM: "bg-purple-100 text-purple-800",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Sellers</h1>
        <p className="text-gray-500 mt-1">{total} active sellers</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 bg-white p-4 rounded-lg shadow-sm">
        <Link href="/sellers">
          <Button variant={tab !== "applications" ? "default" : "outline"}>
            Active Sellers
          </Button>
        </Link>
        <Link href="/sellers?tab=applications">
          <Button variant={tab === "applications" ? "default" : "outline"}>
            Applications ({pendingCount})
          </Button>
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Business</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sellers.map((seller) => (
              <TableRow key={seller.id}>
                <TableCell className="font-medium">{seller.businessName}</TableCell>
                <TableCell>
                  <div>
                    <p>{seller.user.name || "No name"}</p>
                    <p className="text-sm text-gray-500">{seller.user.email}</p>
                  </div>
                </TableCell>
                <TableCell>{seller._count.products}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${tierColors[seller.subscriptionTier]}`}>
                    {seller.subscriptionTier}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={seller.isActive ? "success" : "secondary"}>
                    {seller.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(seller.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <Link href={`/sellers/${seller.id}`}>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {page > 1 && (
            <Link href={`/sellers?page=${page - 1}`}>
              <Button variant="outline">Previous</Button>
            </Link>
          )}
          <span className="flex items-center px-4 py-2 text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link href={`/sellers?page=${page + 1}`}>
              <Button variant="outline">Next</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
