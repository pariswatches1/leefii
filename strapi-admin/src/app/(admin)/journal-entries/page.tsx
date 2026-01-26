import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Eye, BookOpen, Leaf } from "lucide-react";

export default async function JournalEntriesPage() {
  const entries = await prisma.journalEntry.findMany({
    orderBy: { consumedAt: "desc" },
    take: 100,
    include: {
      user: { select: { name: true, email: true } },
    },
  });

  const totalEntries = await prisma.journalEntry.count();
  const privateEntries = await prisma.journalEntry.count({
    where: { isPrivate: true },
  });

  // Get stats by product type
  const byProductType = await prisma.journalEntry.groupBy({
    by: ["productType"],
    _count: true,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Journal Entries</h1>
          <p className="text-gray-500 mt-1">
            User cannabis journal entries (read-only view)
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="default" className="text-sm px-3 py-1">
            {totalEntries} Total
          </Badge>
          <Badge variant="secondary" className="text-sm px-3 py-1">
            {privateEntries} Private
          </Badge>
        </div>
      </div>

      {/* Stats by Product Type */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {byProductType.map((item) => (
          <Card key={item.productType}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{item.productType}</p>
                  <p className="text-2xl font-bold">{item._count}</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Leaf className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Recent Journal Entries
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm text-gray-500">User</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-500">Strain</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-500">Type</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-500">Method</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-500">Rating</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-500">Privacy</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-500">Date</th>
                  <th className="text-right py-3 px-4 text-sm text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <p className="font-medium text-sm">
                        {entry.user.name || entry.user.email}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{entry.strainName}</p>
                        {entry.strainType && (
                          <Badge variant="outline" className="text-xs">
                            {entry.strainType}
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="secondary">
                        {entry.productType.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline">
                        {entry.method.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-yellow-500">
                        {"★".repeat(entry.overallRating)}
                        {"☆".repeat(5 - entry.overallRating)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={entry.isPrivate ? "secondary" : "success"}>
                        {entry.isPrivate ? "Private" : "Public"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {formatDate(entry.consumedAt)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link href={`/journal-entries/${entry.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
                {entries.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-gray-500">
                      No journal entries yet.
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
