"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Dispensary {
  id: string;
  name: string;
  slug: string;
  address: string;
  address2: string | null;
  zipCode: string;
  phone: string | null;
  email: string | null;
  website: string | null;
  stateId: string;
  cityId: string;
  latitude: number;
  longitude: number;
  hasDelivery: boolean;
  hasStorefront: boolean;
  hasCurbside: boolean;
  isWheelchairAccessible: boolean;
  acceptsCreditCard: boolean;
  hasATM: boolean;
  licenseType: string;
  licenseNumber: string | null;
  isVerified: boolean;
  verificationDate: string | null;
  verificationMethod: string | null;
  verificationStatus: string;
  verifiedBy: string | null;
  menuAccuracyScore: number | null;
  isClaimed: boolean;
  claimedDate: string | null;
  claimingContactEmail: string | null;
  claimingContactPhone: string | null;
  description: string | null;
  logoUrl: string | null;
  imageUrl: string | null;
  isActive: boolean;
  isPremium: boolean;
  metaTitle: string | null;
  metaDescription: string | null;
}

interface State {
  id: string;
  name: string;
  cities: { id: string; name: string }[];
}

interface DispensaryFormProps {
  dispensary: Dispensary;
  states: State[];
}

export default function DispensaryForm({ dispensary, states }: DispensaryFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: dispensary.name,
    slug: dispensary.slug,
    address: dispensary.address,
    address2: dispensary.address2 || "",
    zipCode: dispensary.zipCode,
    phone: dispensary.phone || "",
    email: dispensary.email || "",
    website: dispensary.website || "",
    stateId: dispensary.stateId,
    cityId: dispensary.cityId,
    latitude: dispensary.latitude,
    longitude: dispensary.longitude,
    hasDelivery: dispensary.hasDelivery,
    hasStorefront: dispensary.hasStorefront,
    hasCurbside: dispensary.hasCurbside,
    isWheelchairAccessible: dispensary.isWheelchairAccessible,
    acceptsCreditCard: dispensary.acceptsCreditCard,
    hasATM: dispensary.hasATM,
    licenseType: dispensary.licenseType,
    licenseNumber: dispensary.licenseNumber || "",
    isVerified: dispensary.isVerified,
    verificationDate: dispensary.verificationDate || "",
    verificationMethod: dispensary.verificationMethod || "",
    verificationStatus: dispensary.verificationStatus || "UNVERIFIED",
    verifiedBy: dispensary.verifiedBy || "",
    menuAccuracyScore: dispensary.menuAccuracyScore ?? "",
    isClaimed: dispensary.isClaimed,
    claimedDate: dispensary.claimedDate || "",
    claimingContactEmail: dispensary.claimingContactEmail || "",
    claimingContactPhone: dispensary.claimingContactPhone || "",
    description: dispensary.description || "",
    logoUrl: dispensary.logoUrl || "",
    imageUrl: dispensary.imageUrl || "",
    isActive: dispensary.isActive,
    isPremium: dispensary.isPremium,
    metaTitle: dispensary.metaTitle || "",
    metaDescription: dispensary.metaDescription || "",
  });

  const selectedState = states.find((s) => s.id === formData.stateId);
  const cities = selectedState?.cities || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/dispensaries/${dispensary.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/dispensaries");
        router.refresh();
      } else {
        setError(data.error || "Failed to update dispensary");
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
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
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
                  rows={4}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stateId">State *</Label>
                  <select
                    id="stateId"
                    value={formData.stateId}
                    onChange={(e) => setFormData((prev) => ({ ...prev, stateId: e.target.value, cityId: "" }))}
                    className="w-full h-10 px-3 border rounded-md"
                    required
                  >
                    <option value="">Select State</option>
                    {states.map((state) => (
                      <option key={state.id} value={state.id}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cityId">City *</Label>
                  <select
                    id="cityId"
                    value={formData.cityId}
                    onChange={(e) => setFormData((prev) => ({ ...prev, cityId: e.target.value }))}
                    className="w-full h-10 px-3 border rounded-md"
                    required
                  >
                    <option value="">Select City</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address2">Address 2</Label>
                  <Input
                    id="address2"
                    value={formData.address2}
                    onChange={(e) => setFormData((prev) => ({ ...prev, address2: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">Zip Code *</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => setFormData((prev) => ({ ...prev, zipCode: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) => setFormData((prev) => ({ ...prev, latitude: parseFloat(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) => setFormData((prev) => ({ ...prev, longitude: parseFloat(e.target.value) }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { key: "hasStorefront", label: "Storefront" },
                  { key: "hasDelivery", label: "Delivery" },
                  { key: "hasCurbside", label: "Curbside Pickup" },
                  { key: "isWheelchairAccessible", label: "Wheelchair Accessible" },
                  { key: "acceptsCreditCard", label: "Accepts Credit Card" },
                  { key: "hasATM", label: "Has ATM" },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={(formData as any)[key]}
                      onChange={(e) => setFormData((prev) => ({ ...prev, [key]: e.target.checked }))}
                      className="h-4 w-4"
                    />
                    <span className="text-sm">{label}</span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData((prev) => ({ ...prev, metaTitle: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <textarea
                  id="metaDescription"
                  value={formData.metaDescription}
                  onChange={(e) => setFormData((prev) => ({ ...prev, metaDescription: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Verification & Trust</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="verificationDate">Last Verified Date</Label>
                  <Input
                    id="verificationDate"
                    type="datetime-local"
                    value={formData.verificationDate ? formData.verificationDate.slice(0, 16) : ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        verificationDate: e.target.value ? new Date(e.target.value).toISOString() : "",
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="verificationMethod">Verification Method</Label>
                  <select
                    id="verificationMethod"
                    value={formData.verificationMethod}
                    onChange={(e) => setFormData((prev) => ({ ...prev, verificationMethod: e.target.value }))}
                    className="w-full h-10 px-3 border rounded-md"
                  >
                    <option value="">Not Set</option>
                    <option value="PHONE_CALL">Phone Call</option>
                    <option value="EMAIL">Email</option>
                    <option value="IN_PERSON">In-Person Visit</option>
                    <option value="WEBSITE_CHECK">Website Check</option>
                    <option value="POS_SYNC">POS System Sync</option>
                    <option value="SELF_REPORTED">Self-Reported</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="verificationStatus">Verification Status</Label>
                  <select
                    id="verificationStatus"
                    value={formData.verificationStatus}
                    onChange={(e) => setFormData((prev) => ({ ...prev, verificationStatus: e.target.value }))}
                    className="w-full h-10 px-3 border rounded-md"
                  >
                    <option value="UNVERIFIED">Unverified</option>
                    <option value="VERIFIED_TODAY">Verified Today</option>
                    <option value="VERIFIED_THIS_WEEK">Verified This Week</option>
                    <option value="VERIFIED_THIS_MONTH">Verified This Month</option>
                    <option value="NEEDS_UPDATE">Needs Update</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="verifiedBy">Verified By</Label>
                  <Input
                    id="verifiedBy"
                    value={formData.verifiedBy}
                    onChange={(e) => setFormData((prev) => ({ ...prev, verifiedBy: e.target.value }))}
                    placeholder="e.g. Sam, Bot, Team"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="menuAccuracyScore">Menu Accuracy Score (0-100)</Label>
                <Input
                  id="menuAccuracyScore"
                  type="number"
                  min={0}
                  max={100}
                  value={formData.menuAccuracyScore}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      menuAccuracyScore: e.target.value === "" ? "" : parseInt(e.target.value, 10),
                    }))
                  }
                />
              </div>

              <div className="border-t pt-4 mt-4">
                <h4 className="text-sm font-semibold mb-3">Claim Status</h4>
                <div className="flex items-center justify-between mb-3">
                  <Label htmlFor="isClaimed">Claimed by Owner</Label>
                  <input
                    id="isClaimed"
                    type="checkbox"
                    checked={formData.isClaimed}
                    onChange={(e) => setFormData((prev) => ({ ...prev, isClaimed: e.target.checked }))}
                    className="h-4 w-4"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="claimingContactEmail">Claiming Contact Email</Label>
                    <Input
                      id="claimingContactEmail"
                      type="email"
                      value={formData.claimingContactEmail}
                      onChange={(e) => setFormData((prev) => ({ ...prev, claimingContactEmail: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="claimingContactPhone">Claiming Contact Phone</Label>
                    <Input
                      id="claimingContactPhone"
                      value={formData.claimingContactPhone}
                      onChange={(e) => setFormData((prev) => ({ ...prev, claimingContactPhone: e.target.value }))}
                    />
                  </div>
                </div>
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
                <Label htmlFor="isPremium">Premium</Label>
                <input
                  id="isPremium"
                  type="checkbox"
                  checked={formData.isPremium}
                  onChange={(e) => setFormData((prev) => ({ ...prev, isPremium: e.target.checked }))}
                  className="h-4 w-4"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="isVerified">Verified</Label>
                <input
                  id="isVerified"
                  type="checkbox"
                  checked={formData.isVerified}
                  onChange={(e) => setFormData((prev) => ({ ...prev, isVerified: e.target.checked }))}
                  className="h-4 w-4"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Saving..." : "Update Dispensary"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>License</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="licenseType">License Type</Label>
                <select
                  id="licenseType"
                  value={formData.licenseType}
                  onChange={(e) => setFormData((prev) => ({ ...prev, licenseType: e.target.value }))}
                  className="w-full h-10 px-3 border rounded-md"
                >
                  <option value="MEDICAL">Medical Only</option>
                  <option value="RECREATIONAL">Recreational Only</option>
                  <option value="BOTH">Medical & Recreational</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="licenseNumber">License Number</Label>
                <Input
                  id="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData((prev) => ({ ...prev, licenseNumber: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="logoUrl">Logo URL</Label>
                <Input
                  id="logoUrl"
                  value={formData.logoUrl}
                  onChange={(e) => setFormData((prev) => ({ ...prev, logoUrl: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))}
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
