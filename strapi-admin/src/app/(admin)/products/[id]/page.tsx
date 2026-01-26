import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Package, ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface PageProps {
  params: { id: string };
}

export default async function ViewProductPage({ params }: PageProps) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      seller: {
        select: {
          id: true,
          businessName: true,
          slug: true,
          website: true,
        },
      },
      category: { select: { name: true } },
      _count: {
        select: {
          inquiries: true,
          leadReferrals: true,
        },
      },
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/products">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-gray-500 mt-1">by {product.seller.businessName}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Product Images */}
          {product.images.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Images</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {product.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${product.name} - Image ${index + 1}`}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm text-gray-500">Name</dt>
                  <dd className="font-medium">{product.name}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Slug</dt>
                  <dd className="font-mono text-sm">{product.slug}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Category</dt>
                  <dd>
                    <Badge variant="outline">
                      {product.category?.name || "Uncategorized"}
                    </Badge>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Brand</dt>
                  <dd className="font-medium">{product.brand || "N/A"}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Price</dt>
                  <dd className="font-medium text-lg">${Number(product.price).toFixed(2)}</dd>
                </div>
                {product.compareAtPrice && (
                  <div>
                    <dt className="text-sm text-gray-500">Compare At Price</dt>
                    <dd className="font-medium text-gray-400 line-through">
                      ${Number(product.compareAtPrice).toFixed(2)}
                    </dd>
                  </div>
                )}
                <div className="col-span-2">
                  <dt className="text-sm text-gray-500">Description</dt>
                  <dd className="mt-1 whitespace-pre-wrap">{product.description}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Cannabis Details */}
          {(product.thcContent || product.cbdContent || product.strain || product.strainType) && (
            <Card>
              <CardHeader>
                <CardTitle>Cannabis Information</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-2 gap-4">
                  {product.thcContent && (
                    <div>
                      <dt className="text-sm text-gray-500">THC Content</dt>
                      <dd className="font-medium">{product.thcContent}</dd>
                    </div>
                  )}
                  {product.cbdContent && (
                    <div>
                      <dt className="text-sm text-gray-500">CBD Content</dt>
                      <dd className="font-medium">{product.cbdContent}</dd>
                    </div>
                  )}
                  {product.strain && (
                    <div>
                      <dt className="text-sm text-gray-500">Strain</dt>
                      <dd className="font-medium">{product.strain}</dd>
                    </div>
                  )}
                  {product.strainType && (
                    <div>
                      <dt className="text-sm text-gray-500">Strain Type</dt>
                      <dd>
                        <Badge variant="secondary">{product.strainType}</Badge>
                      </dd>
                    </div>
                  )}
                  {product.weight && (
                    <div>
                      <dt className="text-sm text-gray-500">Weight</dt>
                      <dd className="font-medium">{product.weight}</dd>
                    </div>
                  )}
                </dl>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Availability</span>
                <Badge variant={product.isAvailable ? "success" : "secondary"}>
                  {product.isAvailable ? "Available" : "Unavailable"}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Featured</span>
                <Badge variant={product.isFeatured ? "default" : "outline"}>
                  {product.isFeatured ? "Yes" : "No"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Seller</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Business Name</p>
                <p className="font-medium">{product.seller.businessName}</p>
              </div>
              {product.seller.website && (
                <div>
                  <p className="text-sm text-gray-500">Website</p>
                  <a
                    href={product.seller.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    {product.seller.website}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
              <Link href={`/sellers/${product.seller.id}`}>
                <Button variant="outline" size="sm" className="w-full">
                  View Seller Profile
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Views</dt>
                  <dd className="font-medium">{product.viewCount.toLocaleString()}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Inquiries</dt>
                  <dd className="font-medium">{product._count.inquiries}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Lead Referrals</dt>
                  <dd className="font-medium">{product._count.leadReferrals}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dates</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Created</dt>
                  <dd className="font-medium">{formatDate(product.createdAt)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Updated</dt>
                  <dd className="font-medium">{formatDate(product.updatedAt)}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
