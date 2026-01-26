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
  searchParams: { page?: string; search?: string; type?: string };
}

export default async function StrainsPage({ searchParams }: PageProps) {
  const page = parseInt(searchParams.page || "1");
  const pageSize = 20;
  const search = searchParams.search || "";
  const typeFilter = searchParams.type || "";

  const where: any = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { genetics: { contains: search, mode: "insensitive" } },
    ];
  }
  if (typeFilter) {
    where.type = typeFilter;
  }

  const [strains, total] = await Promise.all([
    prisma.strain.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.strain.count({ where }),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  const typeColors: Record<string, string> = {
    SATIVA: "bg-orange-100 text-orange-800",
    INDICA: "bg-purple-100 text-purple-800",
    HYBRID: "bg-green-100 text-green-800",
    CBD: "bg-blue-100 text-blue-800",
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Strains</h1>
          <p className="text-gray-500 mt-1">{total} strains in database</p>
        </div>
        <Link href="/strains/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Strain
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-4 bg-white p-4 rounded-lg shadow-sm">
        <form className="flex gap-4 flex-1">
          <input
            type="text"
            name="search"
            placeholder="Search strains..."
            defaultValue={search}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <select
            name="type"
            defaultValue={typeFilter}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">All Types</option>
            <option value="SATIVA">Sativa</option>
            <option value="INDICA">Indica</option>
            <option value="HYBRID">Hybrid</option>
            <option value="CBD">CBD</option>
          </select>
          <Button type="submit" variant="secondary">
            Filter
          </Button>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>THC</TableHead>
              <TableHead>CBD</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {strains.map((strain) => (
              <TableRow key={strain.id}>
                <TableCell className="font-medium">{strain.name}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[strain.type] || "bg-gray-100"}`}>
                    {strain.type}
                  </span>
                </TableCell>
                <TableCell>
                  {strain.thcMin && strain.thcMax
                    ? `${strain.thcMin}-${strain.thcMax}%`
                    : strain.thcMax
                    ? `${strain.thcMax}%`
                    : "-"}
                </TableCell>
                <TableCell>
                  {strain.cbdMin && strain.cbdMax
                    ? `${strain.cbdMin}-${strain.cbdMax}%`
                    : strain.cbdMax
                    ? `${strain.cbdMax}%`
                    : "-"}
                </TableCell>
                <TableCell>
                  {strain.rating ? (
                    <span className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      {strain.rating.toFixed(1)}
                    </span>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={strain.isActive ? "success" : "secondary"}>
                    {strain.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(strain.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/strains/${strain.id}`}>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <a
                      href={`https://leefii.com/strains/${strain.slug}`}
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
            <Link href={`/strains?page=${page - 1}&search=${search}&type=${typeFilter}`}>
              <Button variant="outline">Previous</Button>
            </Link>
          )}
          <span className="flex items-center px-4 py-2 text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link href={`/strains?page=${page + 1}&search=${search}&type=${typeFilter}`}>
              <Button variant="outline">Next</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
