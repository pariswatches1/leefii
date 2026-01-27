import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const doctor = await prisma.doctor.findUnique({
      where: { id: params.id },
    });

    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    await prisma.doctor.update({
      where: { id: params.id },
      data: { isFeatured: !doctor.isFeatured },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Toggle featured error:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
