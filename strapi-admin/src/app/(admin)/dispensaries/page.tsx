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
import { Plus, Edit, Eye } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface PageProps {
  searchParams: { page?: string; search?: string };
}

export default async function DispensariesPage({ searchParams }: PageProps) {
  const page = parseInt(searchParams.page || "1");
  const pageSize = 20;
  const search = searchParams.search || "";

  const where: any = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { address: { contains: search, mode: "insensitive" } },
    ];
  }

  const [dispensaries, total] = await Promise.all([
    prisma.dispensary.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        city: { select: { name: true } },
        state: { select: { name: true, abbreviation: true } },
      },
    }),
    prisma.dispensary.count({ where }),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dispensaries</h1>
          <p className="text-gray-500 mt-1">{total} dispensaries in database</p>
        </div>
        <Link href="/dispensaries/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Dispensary
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-4 bg-white p-4 rounded-lg shadow-sm">
        <form className="flex gap-4 flex-1">
          <input
            type="text"
            name="search"
            placeholder="Search dispensaries..."
            defaultValue={search}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <Button type="submit" variant="secondary">
            Search
          </Button>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>License</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dispensaries.map((dispensary) => (
              <TableRow key={dispensary.id}>
                <TableCell className="font-medium">{dispensary.name}</TableCell>
                <TableCell>
                  {dispensary.city.name}, {dispensary.state.abbreviation}
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    dispensary.licenseType === "BOTH"
                      ? "bg-green-100 text-green-800"
                      : dispensary.licenseType === "RECREATIONAL"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-purple-100 text-purple-800"
                  }`}>
                    {dispensary.licenseType}
                  </span>
                </TableCell>
                <TableCell>
                  {dispensary.rating ? (
                    <span className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      {dispensary.rating.toFixed(1)}
                      <span className="text-gray-400 text-xs">({dispensary.reviewsCount})</span>
                    </span>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={dispensary.isActive ? "success" : "secondary"}>
                    {dispensary.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(dispensary.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/dispensaries/${dispensary.id}`}>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <a
                      href={`https://leefii.com/dispensaries/${dispensary.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </a>
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
            <Link href={`/dispensaries?page=${page - 1}&search=${search}`}>
              <Button variant="outline">Previous</Button>
            </Link>
          )}
          <span className="flex items-center px-4 py-2 text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link href={`/dispensaries?page=${page + 1}&search=${search}`}>
              <Button variant="outline">Next</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
