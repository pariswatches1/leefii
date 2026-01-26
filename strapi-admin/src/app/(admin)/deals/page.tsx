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
import { Plus, Edit } from "lucide-react";
import { formatDate, truncate } from "@/lib/utils";

interface PageProps {
  searchParams: { page?: string };
}

export default async function DealsPage({ searchParams }: PageProps) {
  const page = parseInt(searchParams.page || "1");
  const pageSize = 20;

  const [deals, total] = await Promise.all([
    prisma.deal.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.deal.count(),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Deals</h1>
          <p className="text-gray-500 mt-1">{total} deals in database</p>
        </div>
        <Link href="/deals/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Deal
          </Button>
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Dispensary</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deals.map((deal) => (
              <TableRow key={deal.id}>
                <TableCell className="font-medium max-w-md">
                  {truncate(deal.title, 50)}
                </TableCell>
                <TableCell>{deal.dispensaryName || deal.chainName || "-"}</TableCell>
                <TableCell>
                  {deal.discountType === "PERCENT" && deal.discountValue
                    ? `${deal.discountValue}% off`
                    : deal.discountType === "DOLLAR" && deal.discountValue
                    ? `$${deal.discountValue} off`
                    : deal.code || "-"}
                </TableCell>
                <TableCell>{deal.viewCount.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant={deal.isActive ? "success" : "secondary"}>
                    {deal.isActive ? "Active" : "Inactive"}
                  </Badge>
                  {deal.isFeatured && (
                    <Badge variant="warning" className="ml-1">Featured</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {deal.endDate ? formatDate(deal.endDate) : deal.isOngoing ? "Ongoing" : "-"}
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/deals/${deal.id}`}>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
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
            <Link href={`/deals?page=${page - 1}`}>
              <Button variant="outline">Previous</Button>
            </Link>
          )}
          <span className="flex items-center px-4 py-2 text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link href={`/deals?page=${page + 1}`}>
              <Button variant="outline">Next</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
