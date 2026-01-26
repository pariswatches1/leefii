import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, hashPassword } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const adminUser = await prisma.adminUser.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      lastLogin: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!adminUser) {
    return NextResponse.json({ error: "Admin user not found" }, { status: 404 });
  }

  return NextResponse.json(adminUser);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();

    // Build update data
    const updateData: any = {
      name: data.name || null,
      role: data.role,
      isActive: data.isActive,
    };

    // If new password provided, hash it
    if (data.newPassword && data.newPassword.length >= 8) {
      updateData.passwordHash = await hashPassword(data.newPassword);
    }

    const adminUser = await prisma.adminUser.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, adminUser });
  } catch (error: any) {
    console.error("Update admin user error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update admin user" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  // Don't allow deleting yourself
  if (params.id === session.id) {
    return NextResponse.json(
      { success: false, error: "Cannot delete your own account" },
      { status: 400 }
    );
  }

  try {
    await prisma.adminUser.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete admin user error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete admin user" },
      { status: 500 }
    );
  }
}
