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
import { formatDate, truncate } from "@/lib/utils";

interface PageProps {
  searchParams: { page?: string; search?: string };
}

export default async function NewsPage({ searchParams }: PageProps) {
  const page = parseInt(searchParams.page || "1");
  const pageSize = 20;
  const search = searchParams.search || "";

  const where: any = {};
  if (search) {
    where.title = { contains: search, mode: "insensitive" };
  }

  const [articles, total] = await Promise.all([
    prisma.newsArticle.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.newsArticle.count({ where }),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">News</h1>
          <p className="text-gray-500 mt-1">{total} articles in database</p>
        </div>
        <Link href="/news/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Article
          </Button>
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Published</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {articles.map((article) => (
              <TableRow key={article.id}>
                <TableCell className="font-medium max-w-md">
                  {truncate(article.title, 60)}
                </TableCell>
                <TableCell>{article.category || "-"}</TableCell>
                <TableCell>{article.viewCount.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant={article.isPublished ? "success" : "secondary"}>
                    {article.isPublished ? "Published" : "Draft"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {article.publishedAt ? formatDate(article.publishedAt) : "-"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/news/${article.id}`}>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    {article.isPublished && (
                      <a
                        href={`https://leefii.com/news/${article.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </a>
                    )}
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
            <Link href={`/news?page=${page - 1}`}>
              <Button variant="outline">Previous</Button>
            </Link>
          )}
          <span className="flex items-center px-4 py-2 text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link href={`/news?page=${page + 1}`}>
              <Button variant="outline">Next</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
