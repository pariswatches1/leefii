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

  const review = await prisma.review.findUnique({
    where: { id: params.id },
    include: { user: { select: { name: true, email: true } } },
  });

  if (!review) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  return NextResponse.json(review);
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

    const review = await prisma.review.update({
      where: { id: params.id },
      data: {
        isApproved: data.isApproved,
        isVerified: data.isVerified,
      },
    });

    return NextResponse.json({ success: true, review });
  } catch (error: any) {
    console.error("Update review error:", error);
    return NextResponse.json({ success: false, error: "Failed to update review" }, { status: 500 });
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
    await prisma.review.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete review error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete review" }, { status: 500 });
  }
}
