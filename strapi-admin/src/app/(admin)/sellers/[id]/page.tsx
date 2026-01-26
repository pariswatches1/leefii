import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface PageProps {
  params: { id: string };
}

export default async function ViewSellerPage({ params }: PageProps) {
  const seller = await prisma.sellerProfile.findUnique({
    where: { id: params.id },
    include: {
      user: { select: { name: true, email: true } },
      products: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      _count: {
        select: {
          products: true,
          inquiries: true,
          leadReferrals: true,
        },
      },
    },
  });

  if (!seller) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/sellers">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{seller.businessName}</h1>
          <p className="text-gray-500 mt-1">Seller Profile</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm text-gray-500">Business Name</dt>
                  <dd className="font-medium">{seller.businessName}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Slug</dt>
                  <dd className="font-mono text-sm">{seller.slug}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Owner</dt>
                  <dd className="font-medium">{seller.user.name || seller.user.email}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Email</dt>
                  <dd className="font-medium">{seller.email || seller.user.email}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Phone</dt>
                  <dd className="font-medium">{seller.phone || "Not set"}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Website</dt>
                  <dd className="font-medium">
                    {seller.website ? (
                      <a href={seller.website} target="_blank" className="text-blue-600 hover:underline">
                        {seller.website}
                      </a>
                    ) : (
                      "Not set"
                    )}
                  </dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-sm text-gray-500">Address</dt>
                  <dd className="font-medium">
                    {[seller.address, seller.city, seller.state, seller.zipCode].filter(Boolean).join(", ") || "Not set"}
                  </dd>
                </div>
                {seller.description && (
                  <div className="col-span-2">
                    <dt className="text-sm text-gray-500">Description</dt>
                    <dd className="text-sm">{seller.description}</dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>

          {seller.products.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Products ({seller._count.products} total)</CardTitle>
              </CardHeader>
              <CardContent>
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 text-sm text-gray-500">Name</th>
                      <th className="text-left py-2 text-sm text-gray-500">Price</th>
                      <th className="text-left py-2 text-sm text-gray-500">Status</th>
                      <th className="text-left py-2 text-sm text-gray-500">Views</th>
                    </tr>
                  </thead>
                  <tbody>
                    {seller.products.map((product) => (
                      <tr key={product.id} className="border-b last:border-0">
                        <td className="py-2 font-medium">{product.name}</td>
                        <td className="py-2">${Number(product.price).toFixed(2)}</td>
                        <td className="py-2">
                          <Badge variant={product.isAvailable ? "success" : "secondary"}>
                            {product.isAvailable ? "Available" : "Unavailable"}
                          </Badge>
                        </td>
                        <td className="py-2">{product.viewCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                <span className="text-gray-500">Active</span>
                <Badge variant={seller.isActive ? "success" : "secondary"}>
                  {seller.isActive ? "Yes" : "No"}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Subscription</span>
                <Badge variant={
                  seller.subscriptionTier === "PREMIUM" ? "default" :
                  seller.subscriptionTier === "STANDARD" ? "secondary" :
                  "outline"
                }>
                  {seller.subscriptionTier}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">License #</span>
                <span className="font-mono text-sm">{seller.licenseNumber || "N/A"}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Products</dt>
                  <dd className="font-medium">{seller._count.products}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Inquiries</dt>
                  <dd className="font-medium">{seller._count.inquiries}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Lead Referrals</dt>
                  <dd className="font-medium">{seller._count.leadReferrals}</dd>
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
                  <dd className="font-medium">{formatDate(seller.createdAt)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Updated</dt>
                  <dd className="font-medium">{formatDate(seller.updatedAt)}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {(seller.logo || seller.banner) && (
            <Card>
              <CardHeader>
                <CardTitle>Media</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {seller.banner && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Banner</p>
                    <img
                      src={seller.banner}
                      alt="Banner"
                      className="w-full h-20 object-cover rounded-lg"
                    />
                  </div>
                )}
                {seller.logo && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Logo</p>
                    <img
                      src={seller.logo}
                      alt="Logo"
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
