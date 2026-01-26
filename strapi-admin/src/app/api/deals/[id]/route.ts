import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const deal = await prisma.deal.findUnique({
    where: { id: params.id },
  });

  if (!deal) {
    return NextResponse.json({ error: "Deal not found" }, { status: 404 });
  }

  return NextResponse.json(deal);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();

    const deal = await prisma.deal.update({
      where: { id: params.id },
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
    console.error("Update deal error:", error);
    return NextResponse.json({ success: false, error: "Failed to update deal" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.deal.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete deal error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete deal" }, { status: 500 });
  }
}
