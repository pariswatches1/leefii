import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createAdminUser } from "@/lib/auth";

// This endpoint creates the first admin user
// It should be disabled in production after initial setup
export async function POST(request: Request) {
  try {
    // Check if any admin users exist
    const existingAdmin = await prisma.adminUser.findFirst();

    if (existingAdmin) {
      return NextResponse.json(
        { success: false, error: "Admin user already exists. Use forgot password instead." },
        { status: 400 }
      );
    }

    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    await createAdminUser(email, password, name);

    return NextResponse.json({ success: true, message: "Admin user created successfully" });
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json({ success: false, error: "Failed to create admin user" }, { status: 500 });
  }
}
