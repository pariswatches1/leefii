import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();

    const deal = await prisma.deal.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description || null,
        discountType: data.discountType || null,
        discountValue: data.discountValue || null,
        code: data.code || null,
        dispensaryName: data.dispensaryName || null,
        dispensarySlug: data.dispensarySlug || null,
        chainName: data.chainName || null,
        stateSlug: data.stateSlug || null,
        citySlug: data.citySlug || null,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        isOngoing: data.isOngoing ?? false,
        terms: data.terms || null,
        minPurchase: data.minPurchase || null,
        imageUrl: data.imageUrl || null,
        isActive: data.isActive ?? true,
        isFeatured: data.isFeatured ?? false,
      },
    });

    return NextResponse.json({ success: true, deal });
  } catch (error: any) {
    console.error("Create deal error:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { success: false, error: "A deal with this slug already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json({ success: false, error: "Failed to create deal" }, { status: 500 });
  }
}
