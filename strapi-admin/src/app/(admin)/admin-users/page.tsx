import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Plus, Shield, Edit } from "lucide-react";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminUsersPage() {
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }

  const adminUsers = await prisma.adminUser.findMany({
    orderBy: { createdAt: "desc" },
  });

  const roleColors = {
    SUPER_ADMIN: "destructive",
    ADMIN: "default",
    EDITOR: "secondary",
  } as const;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Users</h1>
          <p className="text-gray-500 mt-1">
            Manage admin accounts and permissions
          </p>
        </div>
        <Link href="/admin-users/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Admin User
          </Button>
        </Link>
      </div>

      {/* Role Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Role Permissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <Badge variant="destructive" className="mb-2">SUPER_ADMIN</Badge>
              <p className="text-sm text-gray-600">
                Full access to all features including admin user management,
                settings, and all content operations.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <Badge variant="default" className="mb-2">ADMIN</Badge>
              <p className="text-sm text-gray-600">
                Full content management, user management (read/update),
                seller application approval, analytics view.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <Badge variant="secondary" className="mb-2">EDITOR</Badge>
              <p className="text-sm text-gray-600">
                Content creation and editing (strains, news, blog, deals).
                Limited access to user data, no delete permissions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Admin Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm text-gray-500">Name</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-500">Email</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-500">Role</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-500">Status</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-500">Last Login</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-500">Created</th>
                  <th className="text-right py-3 px-4 text-sm text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {adminUsers.map((admin) => (
                  <tr key={admin.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">
                      {admin.name || "Not set"}
                    </td>
                    <td className="py-3 px-4">{admin.email}</td>
                    <td className="py-3 px-4">
                      <Badge variant={roleColors[admin.role]}>
                        {admin.role}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={admin.isActive ? "success" : "secondary"}>
                        {admin.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {admin.lastLogin ? formatDate(admin.lastLogin) : "Never"}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {formatDate(admin.createdAt)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link href={`/admin-users/${admin.id}`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
                {adminUsers.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-500">
                      No admin users yet.
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
