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
    const body = await request.json();
    const { tier } = body;

    if (!["FREE", "BASIC", "PREMIUM"].includes(tier)) {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
    }

    const monthlyRate = tier === "PREMIUM" ? 50 : tier === "BASIC" ? 20 : 0;

    await prisma.doctor.update({
      where: { id: params.id },
      data: {
        subscriptionTier: tier,
        monthlyRate,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Change tier error:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
