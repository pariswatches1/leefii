import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, hashPassword } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const adminUsers = await prisma.adminUser.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      lastLogin: true,
      createdAt: true,
    },
  });

  return NextResponse.json(adminUsers);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();

    // Validate required fields
    if (!data.email || !data.password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existing = await prisma.adminUser.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "Email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(data.password);

    // Create admin user
    const adminUser = await prisma.adminUser.create({
      data: {
        email: data.email,
        passwordHash,
        name: data.name || null,
        role: data.role || "EDITOR",
      },
    });

    return NextResponse.json({
      success: true,
      adminUser: {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role,
      },
    });
  } catch (error: any) {
    console.error("Create admin user error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create admin user" },
      { status: 500 }
    );
  }
}
