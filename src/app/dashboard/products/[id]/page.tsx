'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  categoryId: string | null;
  brand: string | null;
  weight: string | null;
  thcContent: string | null;
  cbdContent: string | null;
  strain: string | null;
  strainType: string | null;
  images: string[];
  isAvailable: boolean;
  isFeatured: boolean;
  viewCount: number;
}

const strainTypes = [
  { value: '', label: 'Not applicable' },
  { value: 'INDICA', label: 'Indica' },
  { value: 'SATIVA', label: 'Sativa' },
  { value: 'HYBRID', label: 'Hybrid' },
  { value: 'CBD', label: 'CBD' },
];

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [uploading, setUploading] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    compareAtPrice: '',
    categoryId: '',
    brand: '',
    weight: '',
    thcContent: '',
    cbdContent: '',
    strain: '',
    strainType: '',
    images: [''] as string[],
    isAvailable: true,
  });

  useEffect(() => {
    Promise.all([
      fetch('/api/categories').then((res) => res.json()),
      fetch(`/api/dashboard/products/${params.id}`).then((res) => res.json()),
    ])
      .then(([cats, prod]) => {
        setCategories(cats);
        if (prod.id) {
          setProduct(prod);
          setFormData({
            name: prod.name || '',
            description: prod.description || '',
            price: prod.price?.toString() || '',
            compareAtPrice: prod.compareAtPrice?.toString() || '',
            categoryId: prod.categoryId || '',
            brand: prod.brand || '',
            weight: prod.weight || '',
            thcContent: prod.thcContent || '',
            cbdContent: prod.cbdContent || '',
            strain: prod.strain || '',
            strainType: prod.strainType || '',
            images: prod.images?.length ? prod.images : [''],
            isAvailable: prod.isAvailable ?? true,
          });
        } else {
          setError('Product not found');
        }
      })
      .catch(() => setError('Failed to load product'))
      .finally(() => setLoading(false));
  }, [params.id]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
    setError('');
    setSuccess('');
  }

  function handleImageChange(index: number, value: string) {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  }

  function addImageField() {
    if (formData.images.length < 5) {
      setFormData({ ...formData, images: [...formData.images, ''] });
    }
  }

  function removeImageField(index: number) {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages.length ? newImages : [''] });
  }

  async function handleFileUpload(index: number, file: File) {
    setUploading(index);
    setError('');
    try {
      const uploadData = new FormData();
      uploadData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to upload image');
        return;
      }

      handleImageChange(index, data.url);
    } catch {
      setError('Failed to upload image');
    } finally {
      setUploading(null);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const response = await fetch(`/api/dashboard/products/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : null,
          images: formData.images.filter((img) => img.trim()),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to update product');
        setSaving(false);
        return;
      }

      setSuccess('Product updated successfully!');
      setProduct(data);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    setError('');

    try {
      const response = await fetch(`/api/dashboard/products/${params.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to delete product');
        setDeleting(false);
        return;
      }

      router.push('/dashboard/products');
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">Product not found</p>
        <Link
          href="/dashboard/products"
          className="text-green-600 hover:underline"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link
            href="/dashboard/products"
            className="text-gray-600 hover:text-gray-900 text-sm flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Products
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">Edit Product</h1>
          <p className="text-sm text-gray-500 mt-1">
            {product.viewCount} views
          </p>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-100 transition disabled:opacity-50"
        >
          {deleting ? 'Deleting...' : 'Delete Product'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
            {success}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Product Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                required
                value={formData.description}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.price}
                    onChange={handleChange}
                    className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="compareAtPrice" className="block text-sm font-medium text-gray-700 mb-1">
                  Compare at Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    id="compareAtPrice"
                    name="compareAtPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.compareAtPrice}
                    onChange={handleChange}
                    className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
                Brand
              </label>
              <input
                id="brand"
                name="brand"
                type="text"
                value={formData.brand}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                id="isAvailable"
                name="isAvailable"
                type="checkbox"
                checked={formData.isAvailable}
                onChange={handleChange}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <label htmlFor="isAvailable" className="text-sm font-medium text-gray-700">
                Available for purchase
              </label>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Images
              </label>
              <p className="text-xs text-gray-500 mb-2">Max 5 images total</p>
              {formData.images.map((img, index) => (
                <div key={index} className="mb-3">
                  <div className="flex gap-2 mb-1">
                    <input
                      type="url"
                      value={img}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                    {formData.images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeImageField(index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer inline-flex items-center gap-1 text-sm text-green-600 hover:text-green-700">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(index, file);
                        }}
                        disabled={uploading !== null}
                      />
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {uploading === index ? 'Uploading...' : 'Upload from computer'}
                    </label>
                  </div>
                  {img && (
                    <div className="mt-2">
                      <img
                        src={img}
                        alt={`Preview ${index + 1}`}
                        className="h-16 w-16 object-cover rounded-lg border border-gray-200"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                    </div>
                  )}
                </div>
              ))}
              {formData.images.length < 5 && (
                <button
                  type="button"
                  onClick={addImageField}
                  className="text-green-600 text-sm hover:underline"
                >
                  + Add another image
                </button>
              )}
            </div>

            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                Weight / Size
              </label>
              <input
                id="weight"
                name="weight"
                type="text"
                value={formData.weight}
                onChange={handleChange}
                placeholder="e.g., 3.5g, 1oz"
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="thcContent" className="block text-sm font-medium text-gray-700 mb-1">
                  THC Content
                </label>
                <input
                  id="thcContent"
                  name="thcContent"
                  type="text"
                  value={formData.thcContent}
                  onChange={handleChange}
                  placeholder="e.g., 20-25%"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label htmlFor="cbdContent" className="block text-sm font-medium text-gray-700 mb-1">
                  CBD Content
                </label>
                <input
                  id="cbdContent"
                  name="cbdContent"
                  type="text"
                  value={formData.cbdContent}
                  onChange={handleChange}
                  placeholder="e.g., 0.5%"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="strain" className="block text-sm font-medium text-gray-700 mb-1">
                Strain Name
              </label>
              <input
                id="strain"
                name="strain"
                type="text"
                value={formData.strain}
                onChange={handleChange}
                placeholder="e.g., Blue Dream"
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label htmlFor="strainType" className="block text-sm font-medium text-gray-700 mb-1">
                Strain Type
              </label>
              <select
                id="strainType"
                name="strainType"
                value={formData.strainType}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
              >
                {strainTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <Link
            href="/dashboard/products"
            className="border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
