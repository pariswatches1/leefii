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
  searchParams: { page?: string; tier?: string };
}

export default async function DoctorsPage({ searchParams }: PageProps) {
  const page = parseInt(searchParams.page || "1");
  const pageSize = 20;
  const tierFilter = searchParams.tier;

  const whereClause = tierFilter ? { subscriptionTier: tierFilter as any } : {};

  const [doctors, total, tierCounts] = await Promise.all([
    prisma.doctor.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        _count: { select: { leads: true } },
      },
    }),
    prisma.doctor.count({ where: whereClause }),
    prisma.doctor.groupBy({
      by: ["subscriptionTier"],
      _count: true,
    }),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  const tierColors: Record<string, string> = {
    FREE: "bg-gray-100 text-gray-800",
    BASIC: "bg-blue-100 text-blue-800",
    PREMIUM: "bg-purple-100 text-purple-800",
  };

  const statusColors: Record<string, string> = {
    ACTIVE: "bg-green-100 text-green-800",
    PAST_DUE: "bg-yellow-100 text-yellow-800",
    CANCELLED: "bg-red-100 text-red-800",
    PAUSED: "bg-gray-100 text-gray-800",
  };

  const counts = {
    FREE: tierCounts.find((t) => t.subscriptionTier === "FREE")?._count || 0,
    BASIC: tierCounts.find((t) => t.subscriptionTier === "BASIC")?._count || 0,
    PREMIUM: tierCounts.find((t) => t.subscriptionTier === "PREMIUM")?._count || 0,
  };

  const totalDoctors = counts.FREE + counts.BASIC + counts.PREMIUM;
  const monthlyRevenue = counts.BASIC * 20 + counts.PREMIUM * 50;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Doctors</h1>
        <p className="text-gray-500 mt-1">
          {totalDoctors} registered doctors • ${monthlyRevenue}/mo revenue
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-500">Total Doctors</p>
          <p className="text-2xl font-bold text-gray-900">{totalDoctors}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-500">Basic ($20/mo)</p>
          <p className="text-2xl font-bold text-blue-600">{counts.BASIC}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-500">Premium ($50/mo)</p>
          <p className="text-2xl font-bold text-purple-600">{counts.PREMIUM}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-sm text-gray-500">Monthly Revenue</p>
          <p className="text-2xl font-bold text-green-600">${monthlyRevenue}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 bg-white p-4 rounded-lg shadow-sm">
        <Link href="/doctors">
          <Button variant={!tierFilter ? "default" : "outline"} size="sm">
            All ({totalDoctors})
          </Button>
        </Link>
        <Link href="/doctors?tier=PREMIUM">
          <Button variant={tierFilter === "PREMIUM" ? "default" : "outline"} size="sm">
            Premium ({counts.PREMIUM})
          </Button>
        </Link>
        <Link href="/doctors?tier=BASIC">
          <Button variant={tierFilter === "BASIC" ? "default" : "outline"} size="sm">
            Basic ({counts.BASIC})
          </Button>
        </Link>
        <Link href="/doctors?tier=FREE">
          <Button variant={tierFilter === "FREE" ? "default" : "outline"} size="sm">
            Free ({counts.FREE})
          </Button>
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Doctor/Clinic</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Leads</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {doctors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  No doctors found
                </TableCell>
              </TableRow>
            ) : (
              doctors.map((doctor) => (
                <TableRow key={doctor.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{doctor.name}</p>
                      {doctor.businessName && (
                        <p className="text-sm text-gray-500">{doctor.businessName}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{doctor.city}, {doctor.state}</p>
                      {doctor.zipCode && <p className="text-gray-500">{doctor.zipCode}</p>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{doctor.email}</p>
                      {doctor.phone && <p className="text-gray-500">{doctor.phone}</p>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${tierColors[doctor.subscriptionTier]}`}>
                      {doctor.subscriptionTier}
                      {doctor.subscriptionTier !== "FREE" && ` $${doctor.monthlyRate}/mo`}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[doctor.subscriptionStatus]}`}>
                      {doctor.subscriptionStatus}
                    </span>
                  </TableCell>
                  <TableCell>{doctor._count.leads}</TableCell>
                  <TableCell>{formatDate(doctor.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/doctors/${doctor.id}`}>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {page > 1 && (
            <Link href={`/doctors?${tierFilter ? `tier=${tierFilter}&` : ""}page=${page - 1}`}>
              <Button variant="outline">Previous</Button>
            </Link>
          )}
          <span className="flex items-center px-4 py-2 text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link href={`/doctors?${tierFilter ? `tier=${tierFilter}&` : ""}page=${page + 1}`}>
              <Button variant="outline">Next</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
