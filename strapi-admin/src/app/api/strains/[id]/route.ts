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

  const strain = await prisma.strain.findUnique({
    where: { id: params.id },
  });

  if (!strain) {
    return NextResponse.json({ error: "Strain not found" }, { status: 404 });
  }

  return NextResponse.json(strain);
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

    const strain = await prisma.strain.update({
      where: { id: params.id },
      data: {
        name: data.name,
        slug: data.slug,
        type: data.type,
        thcMin: data.thcMin,
        thcMax: data.thcMax,
        cbdMin: data.cbdMin,
        cbdMax: data.cbdMax,
        effects: data.effects || [],
        flavors: data.flavors || [],
        aromas: data.aromas || [],
        conditions: data.conditions || [],
        description: data.description,
        genetics: data.genetics,
        origin: data.origin,
        breeder: data.breeder,
        imageUrl: data.imageUrl,
        isActive: data.isActive ?? true,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        terpMyrcene: data.terpMyrcene,
        terpLimonene: data.terpLimonene,
        terpCaryophyllene: data.terpCaryophyllene,
        terpPinene: data.terpPinene,
        terpLinalool: data.terpLinalool,
        terpHumulene: data.terpHumulene,
        terpTerpinolene: data.terpTerpinolene,
        terpOcimene: data.terpOcimene,
      },
    });

    return NextResponse.json({ success: true, strain });
  } catch (error: any) {
    console.error("Update strain error:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { success: false, error: "A strain with this name or slug already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json({ success: false, error: "Failed to update strain" }, { status: 500 });
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
    await prisma.strain.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete strain error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete strain" }, { status: 500 });
  }
}
