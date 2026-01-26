"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Trash2 } from "lucide-react";

interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
  isActive: boolean;
}

export default function EditAdminUserPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [admin, setAdmin] = useState<AdminUser | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    role: "EDITOR",
    isActive: true,
    newPassword: "",
  });

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const response = await fetch(`/api/admin-users/${params.id}`);
        const data = await response.json();

        if (data.id) {
          setAdmin(data);
          setFormData({
            name: data.name || "",
            role: data.role,
            isActive: data.isActive,
            newPassword: "",
          });
        }
      } catch (err) {
        setError("Failed to load admin user");
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/admin-users/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        router.push("/admin-users");
      } else {
        setError(data.error || "Failed to update admin user");
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this admin user?")) return;

    try {
      const response = await fetch(`/api/admin-users/${params.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        router.push("/admin-users");
      } else {
        setError(data.error || "Failed to delete admin user");
      }
    } catch (err) {
      setError("An error occurred");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Admin user not found</p>
        <Link href="/admin-users">
          <Button variant="outline" className="mt-4">
            Back to Admin Users
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin-users">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Admin User</h1>
            <p className="text-gray-500 mt-1">{admin.email}</p>
          </div>
        </div>
        <Button variant="destructive" size="sm" onClick={handleDelete}>
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>User Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input type="email" value={admin.email} disabled />
                <p className="text-xs text-gray-500 mt-1">
                  Email cannot be changed
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="EDITOR">Editor</option>
                  <option value="ADMIN">Admin</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.isActive ? "active" : "inactive"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isActive: e.target.value === "active",
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <Input
                  type="password"
                  value={formData.newPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, newPassword: e.target.value })
                  }
                  placeholder="Leave blank to keep current password"
                  minLength={8}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Minimum 8 characters. Leave blank to keep current password.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Link href="/admin-users">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
