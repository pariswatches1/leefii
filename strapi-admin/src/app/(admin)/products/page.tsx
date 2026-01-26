import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Eye, Package } from "lucide-react";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      seller: { select: { businessName: true, slug: true } },
      category: { select: { name: true } },
    },
  });

  const totalProducts = await prisma.product.count();
  const availableProducts = await prisma.product.count({
    where: { isAvailable: true },
  });
  const featuredProducts = await prisma.product.count({
    where: { isFeatured: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 mt-1">
            Marketplace products from sellers
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="default" className="text-sm px-3 py-1">
            {totalProducts} Total
          </Badge>
          <Badge variant="success" className="text-sm px-3 py-1">
            {availableProducts} Available
          </Badge>
          <Badge variant="secondary" className="text-sm px-3 py-1">
            {featuredProducts} Featured
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            All Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm text-gray-500">Product</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-500">Seller</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-500">Category</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-500">Price</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-500">Status</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-500">Views</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-500">Created</th>
                  <th className="text-right py-3 px-4 text-sm text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {product.images[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                            <Package className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{product.name}</p>
                          {product.brand && (
                            <p className="text-xs text-gray-400">{product.brand}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Link
                        href={`/sellers/${product.seller.slug}`}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {product.seller.businessName}
                      </Link>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline">
                        {product.category?.name || "Uncategorized"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">${Number(product.price).toFixed(2)}</p>
                        {product.compareAtPrice && (
                          <p className="text-xs text-gray-400 line-through">
                            ${Number(product.compareAtPrice).toFixed(2)}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1">
                        <Badge variant={product.isAvailable ? "success" : "secondary"}>
                          {product.isAvailable ? "Available" : "Unavailable"}
                        </Badge>
                        {product.isFeatured && (
                          <Badge variant="default">Featured</Badge>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {product.viewCount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {formatDate(product.createdAt)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link href={`/products/${product.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-gray-500">
                      No products yet.
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
