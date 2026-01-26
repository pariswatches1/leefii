"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { slugify } from "@/lib/utils";

interface Deal {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  discountType: string | null;
  discountValue: number | null;
  code: string | null;
  dispensaryName: string | null;
  dispensarySlug: string | null;
  chainName: string | null;
  stateSlug: string | null;
  citySlug: string | null;
  startDate: Date | null;
  endDate: Date | null;
  isOngoing: boolean;
  terms: string | null;
  minPurchase: number | null;
  imageUrl: string | null;
  isActive: boolean;
  isFeatured: boolean;
}

interface DealFormProps {
  deal?: Deal;
}

export default function DealForm({ deal }: DealFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: deal?.title || "",
    slug: deal?.slug || "",
    description: deal?.description || "",
    discountType: deal?.discountType || "PERCENT",
    discountValue: deal?.discountValue || "",
    code: deal?.code || "",
    dispensaryName: deal?.dispensaryName || "",
    dispensarySlug: deal?.dispensarySlug || "",
    chainName: deal?.chainName || "",
    stateSlug: deal?.stateSlug || "",
    citySlug: deal?.citySlug || "",
    startDate: deal?.startDate ? new Date(deal.startDate).toISOString().split("T")[0] : "",
    endDate: deal?.endDate ? new Date(deal.endDate).toISOString().split("T")[0] : "",
    isOngoing: deal?.isOngoing ?? false,
    terms: deal?.terms || "",
    minPurchase: deal?.minPurchase || "",
    imageUrl: deal?.imageUrl || "",
    isActive: deal?.isActive ?? true,
    isFeatured: deal?.isFeatured ?? false,
  });

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: deal?.id ? prev.slug : slugify(title),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = deal?.id ? `/api/deals/${deal.id}` : "/api/deals";
      const method = deal?.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          discountValue: formData.discountValue ? parseFloat(formData.discountValue as string) : null,
          minPurchase: formData.minPurchase ? parseFloat(formData.minPurchase as string) : null,
          startDate: formData.startDate || null,
          endDate: formData.endDate || null,
        }),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/deals");
        router.refresh();
      } else {
        setError(data.error || "Failed to save deal");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 text-red-600 bg-red-50 rounded-lg">{error}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Deal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g., 20% Off All Edibles"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discountType">Discount Type</Label>
                  <select
                    id="discountType"
                    value={formData.discountType}
                    onChange={(e) => setFormData((prev) => ({ ...prev, discountType: e.target.value }))}
                    className="w-full h-10 px-3 border rounded-md"
                  >
                    <option value="PERCENT">Percentage Off</option>
                    <option value="DOLLAR">Dollar Amount Off</option>
                    <option value="BOGO">Buy One Get One</option>
                    <option value="FREE_ITEM">Free Item</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discountValue">Discount Value</Label>
                  <Input
                    id="discountValue"
                    type="number"
                    step="0.01"
                    value={formData.discountValue}
                    onChange={(e) => setFormData((prev) => ({ ...prev, discountValue: e.target.value }))}
                    placeholder={formData.discountType === "PERCENT" ? "20" : "10.00"}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Promo Code</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))}
                    placeholder="SAVE20"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dispensary Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dispensaryName">Dispensary Name</Label>
                  <Input
                    id="dispensaryName"
                    value={formData.dispensaryName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, dispensaryName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="chainName">Chain Name</Label>
                  <Input
                    id="chainName"
                    value={formData.chainName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, chainName: e.target.value }))}
                    placeholder="For multi-location chains"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stateSlug">State (slug)</Label>
                  <Input
                    id="stateSlug"
                    value={formData.stateSlug}
                    onChange={(e) => setFormData((prev) => ({ ...prev, stateSlug: e.target.value }))}
                    placeholder="california"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="citySlug">City (slug)</Label>
                  <Input
                    id="citySlug"
                    value={formData.citySlug}
                    onChange={(e) => setFormData((prev) => ({ ...prev, citySlug: e.target.value }))}
                    placeholder="los-angeles"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Terms & Conditions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minPurchase">Minimum Purchase ($)</Label>
                  <Input
                    id="minPurchase"
                    type="number"
                    step="0.01"
                    value={formData.minPurchase}
                    onChange={(e) => setFormData((prev) => ({ ...prev, minPurchase: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="terms">Terms</Label>
                <textarea
                  id="terms"
                  value={formData.terms}
                  onChange={(e) => setFormData((prev) => ({ ...prev, terms: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                  placeholder="Restrictions, exclusions, etc."
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="isActive">Active</Label>
                <input
                  id="isActive"
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                  className="h-4 w-4"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="isFeatured">Featured</Label>
                <input
                  id="isFeatured"
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData((prev) => ({ ...prev, isFeatured: e.target.checked }))}
                  className="h-4 w-4"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="isOngoing">Ongoing (no end date)</Label>
                <input
                  id="isOngoing"
                  type="checkbox"
                  checked={formData.isOngoing}
                  onChange={(e) => setFormData((prev) => ({ ...prev, isOngoing: e.target.checked }))}
                  className="h-4 w-4"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Saving..." : deal?.id ? "Update Deal" : "Create Deal"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Duration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              {!formData.isOngoing && (
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))}
                  placeholder="https://..."
                />
              </div>
              {formData.imageUrl && (
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-lg"
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
