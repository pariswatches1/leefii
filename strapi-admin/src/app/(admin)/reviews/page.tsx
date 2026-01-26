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
import { formatDate, truncate } from "@/lib/utils";
import { Check, X } from "lucide-react";

interface PageProps {
  searchParams: { page?: string; status?: string };
}

export default async function ReviewsPage({ searchParams }: PageProps) {
  const page = parseInt(searchParams.page || "1");
  const pageSize = 20;
  const statusFilter = searchParams.status || "";

  const where: any = {};
  if (statusFilter === "pending") {
    where.isApproved = false;
  } else if (statusFilter === "approved") {
    where.isApproved = true;
  }

  const [reviews, total, pendingCount] = await Promise.all([
    prisma.review.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        user: { select: { name: true, email: true } },
      },
    }),
    prisma.review.count({ where }),
    prisma.review.count({ where: { isApproved: false } }),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reviews</h1>
          <p className="text-gray-500 mt-1">
            {total} reviews total • {pendingCount} pending approval
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 bg-white p-4 rounded-lg shadow-sm">
        <Link href="/reviews">
          <Button variant={!statusFilter ? "default" : "outline"} size="sm">
            All
          </Button>
        </Link>
        <Link href="/reviews?status=pending">
          <Button variant={statusFilter === "pending" ? "default" : "outline"} size="sm">
            Pending ({pendingCount})
          </Button>
        </Link>
        <Link href="/reviews?status=approved">
          <Button variant={statusFilter === "approved" ? "default" : "outline"} size="sm">
            Approved
          </Button>
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rating</TableHead>
              <TableHead>Content</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.map((review) => (
              <TableRow key={review.id}>
                <TableCell>
                  <span className="text-yellow-500 text-lg">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </span>
                </TableCell>
                <TableCell className="max-w-md">
                  {review.title && <p className="font-medium">{review.title}</p>}
                  <p className="text-sm text-gray-500">{truncate(review.content, 100)}</p>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{review.user.name || "Anonymous"}</p>
                    <p className="text-sm text-gray-500">{review.user.email}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={review.isApproved ? "success" : "warning"}>
                    {review.isApproved ? "Approved" : "Pending"}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(review.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {!review.isApproved && (
                      <form action={`/api/reviews/${review.id}/approve`} method="POST">
                        <Button type="submit" variant="ghost" size="sm" className="text-green-600">
                          <Check className="h-4 w-4" />
                        </Button>
                      </form>
                    )}
                    <form action={`/api/reviews/${review.id}/delete`} method="POST">
                      <Button type="submit" variant="ghost" size="sm" className="text-red-600">
                        <X className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
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
            <Link href={`/reviews?page=${page - 1}&status=${statusFilter}`}>
              <Button variant="outline">Previous</Button>
            </Link>
          )}
          <span className="flex items-center px-4 py-2 text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link href={`/reviews?page=${page + 1}&status=${statusFilter}`}>
              <Button variant="outline">Next</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
