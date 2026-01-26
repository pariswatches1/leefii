"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { slugify } from "@/lib/utils";

interface ContentFormProps {
  type: "news" | "blog";
  content?: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    imageUrl: string | null;
    category: string | null;
    tags: string[];
    isPublished: boolean;
    publishedAt: Date | null;
    metaTitle: string | null;
    metaDescription: string | null;
    authorName?: string | null;
    sourceName?: string | null;
    sourceUrl?: string | null;
  };
}

const NEWS_CATEGORIES = ["Industry", "Legislation", "Business", "Science", "Culture", "Health"];
const BLOG_CATEGORIES = ["Guides", "Reviews", "Education", "Lifestyle", "Recipes", "Growing"];

export default function ContentForm({ type, content }: ContentFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const categories = type === "news" ? NEWS_CATEGORIES : BLOG_CATEGORIES;

  const [formData, setFormData] = useState({
    title: content?.title || "",
    slug: content?.slug || "",
    excerpt: content?.excerpt || "",
    content: content?.content || "",
    imageUrl: content?.imageUrl || "",
    category: content?.category || "",
    tags: content?.tags?.join(", ") || "",
    isPublished: content?.isPublished ?? false,
    metaTitle: content?.metaTitle || "",
    metaDescription: content?.metaDescription || "",
    authorName: (content as any)?.authorName || "",
    sourceName: (content as any)?.sourceName || "",
    sourceUrl: (content as any)?.sourceUrl || "",
  });

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: content?.id ? prev.slug : slugify(title),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = content?.id ? `/api/${type}/${content.id}` : `/api/${type}`;
      const method = content?.id ? "PUT" : "POST";

      const payload = {
        ...formData,
        tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
        publishedAt: formData.isPublished ? new Date().toISOString() : null,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        router.push(`/${type}`);
        router.refresh();
      } else {
        setError(data.error || `Failed to save ${type}`);
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
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
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
                <Label htmlFor="excerpt">Excerpt</Label>
                <textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Brief summary of the content..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                  rows={15}
                  className="w-full px-3 py-2 border rounded-md font-mono text-sm"
                  required
                  placeholder="Write your content here... (Supports Markdown)"
                />
              </div>
            </CardContent>
          </Card>

          {type === "news" && (
            <Card>
              <CardHeader>
                <CardTitle>Source</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sourceName">Source Name</Label>
                    <Input
                      id="sourceName"
                      value={formData.sourceName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, sourceName: e.target.value }))}
                      placeholder="e.g., Marijuana Moment"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sourceUrl">Source URL</Label>
                    <Input
                      id="sourceUrl"
                      value={formData.sourceUrl}
                      onChange={(e) => setFormData((prev) => ({ ...prev, sourceUrl: e.target.value }))}
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

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
                  placeholder="SEO title (max 60 characters)"
                />
                <p className="text-xs text-gray-500">{formData.metaTitle.length}/60 characters</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <textarea
                  id="metaDescription"
                  value={formData.metaDescription}
                  onChange={(e) => setFormData((prev) => ({ ...prev, metaDescription: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                  placeholder="SEO description (max 160 characters)"
                />
                <p className="text-xs text-gray-500">{formData.metaDescription.length}/160 characters</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Publishing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="isPublished">Published</Label>
                <input
                  id="isPublished"
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData((prev) => ({ ...prev, isPublished: e.target.checked }))}
                  className="h-4 w-4"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Saving..." : content?.id ? "Update" : "Create"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                  className="w-full h-10 px-3 border rounded-md"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))}
                  placeholder="cannabis, legalization, health"
                />
                <p className="text-xs text-gray-500">Comma separated</p>
              </div>
              {type === "blog" && (
                <div className="space-y-2">
                  <Label htmlFor="authorName">Author Name</Label>
                  <Input
                    id="authorName"
                    value={formData.authorName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, authorName: e.target.value }))}
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
                <Label htmlFor="imageUrl">Featured Image URL</Label>
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
                  className="w-full h-40 object-cover rounded-lg"
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
