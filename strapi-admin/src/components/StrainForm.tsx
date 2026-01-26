"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { slugify } from "@/lib/utils";

interface Strain {
  id?: string;
  name: string;
  slug: string;
  type: string;
  thcMin: number | null;
  thcMax: number | null;
  cbdMin: number | null;
  cbdMax: number | null;
  effects: string[];
  flavors: string[];
  aromas: string[];
  conditions: string[];
  description: string | null;
  genetics: string | null;
  origin: string | null;
  breeder: string | null;
  imageUrl: string | null;
  isActive: boolean;
  metaTitle: string | null;
  metaDescription: string | null;
  terpMyrcene: number | null;
  terpLimonene: number | null;
  terpCaryophyllene: number | null;
  terpPinene: number | null;
  terpLinalool: number | null;
  terpHumulene: number | null;
  terpTerpinolene: number | null;
  terpOcimene: number | null;
}

interface StrainFormProps {
  strain?: Strain;
}

const EFFECTS = [
  "Relaxed", "Happy", "Euphoric", "Uplifted", "Sleepy", "Creative", "Hungry",
  "Focused", "Energetic", "Talkative", "Giggly", "Aroused", "Tingly", "Calm"
];

const FLAVORS = [
  "Sweet", "Citrus", "Berry", "Earthy", "Pine", "Diesel", "Skunky", "Spicy",
  "Tropical", "Grape", "Mint", "Vanilla", "Coffee", "Cheese", "Woody", "Herbal"
];

const CONDITIONS = [
  "Anxiety", "Stress", "Depression", "Pain", "Insomnia", "PTSD", "Inflammation",
  "Nausea", "Headaches", "Fatigue", "Appetite Loss", "Muscle Spasms", "Arthritis"
];

export default function StrainForm({ strain }: StrainFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<Strain>({
    name: strain?.name || "",
    slug: strain?.slug || "",
    type: strain?.type || "HYBRID",
    thcMin: strain?.thcMin || null,
    thcMax: strain?.thcMax || null,
    cbdMin: strain?.cbdMin || null,
    cbdMax: strain?.cbdMax || null,
    effects: strain?.effects || [],
    flavors: strain?.flavors || [],
    aromas: strain?.aromas || [],
    conditions: strain?.conditions || [],
    description: strain?.description || "",
    genetics: strain?.genetics || "",
    origin: strain?.origin || "",
    breeder: strain?.breeder || "",
    imageUrl: strain?.imageUrl || "",
    isActive: strain?.isActive ?? true,
    metaTitle: strain?.metaTitle || "",
    metaDescription: strain?.metaDescription || "",
    terpMyrcene: strain?.terpMyrcene || null,
    terpLimonene: strain?.terpLimonene || null,
    terpCaryophyllene: strain?.terpCaryophyllene || null,
    terpPinene: strain?.terpPinene || null,
    terpLinalool: strain?.terpLinalool || null,
    terpHumulene: strain?.terpHumulene || null,
    terpTerpinolene: strain?.terpTerpinolene || null,
    terpOcimene: strain?.terpOcimene || null,
  });

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: strain?.id ? prev.slug : slugify(name),
    }));
  };

  const toggleArrayItem = (field: "effects" | "flavors" | "conditions", item: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = strain?.id ? `/api/strains/${strain.id}` : "/api/strains";
      const method = strain?.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/strains");
        router.refresh();
      } else {
        setError(data.error || "Failed to save strain");
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
        <div className="p-4 text-red-600 bg-red-50 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
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
                    onChange={(e) => handleNameChange(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Type *</Label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full h-10 px-3 border rounded-md"
                  >
                    <option value="SATIVA">Sativa</option>
                    <option value="INDICA">Indica</option>
                    <option value="HYBRID">Hybrid</option>
                    <option value="CBD">CBD</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="genetics">Genetics</Label>
                  <Input
                    id="genetics"
                    value={formData.genetics || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, genetics: e.target.value }))}
                    placeholder="e.g., OG Kush x Durban Poison"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="thcMin">THC Min %</Label>
                  <Input
                    id="thcMin"
                    type="number"
                    step="0.1"
                    value={formData.thcMin || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, thcMin: e.target.value ? parseFloat(e.target.value) : null }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="thcMax">THC Max %</Label>
                  <Input
                    id="thcMax"
                    type="number"
                    step="0.1"
                    value={formData.thcMax || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, thcMax: e.target.value ? parseFloat(e.target.value) : null }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cbdMin">CBD Min %</Label>
                  <Input
                    id="cbdMin"
                    type="number"
                    step="0.1"
                    value={formData.cbdMin || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, cbdMin: e.target.value ? parseFloat(e.target.value) : null }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cbdMax">CBD Max %</Label>
                  <Input
                    id="cbdMax"
                    type="number"
                    step="0.1"
                    value={formData.cbdMax || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, cbdMax: e.target.value ? parseFloat(e.target.value) : null }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Terpenes */}
          <Card>
            <CardHeader>
              <CardTitle>Terpene Profile (%)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { key: "terpMyrcene", label: "Myrcene" },
                  { key: "terpLimonene", label: "Limonene" },
                  { key: "terpCaryophyllene", label: "Caryophyllene" },
                  { key: "terpPinene", label: "Pinene" },
                  { key: "terpLinalool", label: "Linalool" },
                  { key: "terpHumulene", label: "Humulene" },
                  { key: "terpTerpinolene", label: "Terpinolene" },
                  { key: "terpOcimene", label: "Ocimene" },
                ].map(({ key, label }) => (
                  <div key={key} className="space-y-2">
                    <Label htmlFor={key}>{label}</Label>
                    <Input
                      id={key}
                      type="number"
                      step="0.01"
                      value={(formData as any)[key] || ""}
                      onChange={(e) => setFormData(prev => ({ ...prev, [key]: e.target.value ? parseFloat(e.target.value) : null }))}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Effects */}
          <Card>
            <CardHeader>
              <CardTitle>Effects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {EFFECTS.map((effect) => (
                  <button
                    key={effect}
                    type="button"
                    onClick={() => toggleArrayItem("effects", effect)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      formData.effects.includes(effect)
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {effect}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Flavors */}
          <Card>
            <CardHeader>
              <CardTitle>Flavors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {FLAVORS.map((flavor) => (
                  <button
                    key={flavor}
                    type="button"
                    onClick={() => toggleArrayItem("flavors", flavor)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      formData.flavors.includes(flavor)
                        ? "bg-orange-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {flavor}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Conditions */}
          <Card>
            <CardHeader>
              <CardTitle>Medical Conditions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {CONDITIONS.map((condition) => (
                  <button
                    key={condition}
                    type="button"
                    onClick={() => toggleArrayItem("conditions", condition)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      formData.conditions.includes(condition)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {condition}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Publishing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="isActive">Active</Label>
                <input
                  id="isActive"
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="h-4 w-4"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Saving..." : strain?.id ? "Update Strain" : "Create Strain"}
              </Button>
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
                  value={formData.imageUrl || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                  placeholder="https://..."
                />
              </div>
              {formData.imageUrl && (
                <img
                  src={formData.imageUrl}
                  alt="Strain preview"
                  className="w-full h-40 object-cover rounded-lg"
                />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Additional Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="breeder">Breeder</Label>
                <Input
                  id="breeder"
                  value={formData.breeder || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, breeder: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="origin">Origin</Label>
                <Input
                  id="origin"
                  value={formData.origin || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, origin: e.target.value }))}
                />
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
                  value={formData.metaTitle || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <textarea
                  id="metaDescription"
                  value={formData.metaDescription || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
