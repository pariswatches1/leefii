import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const strains = await prisma.strain.findMany({
    orderBy: { name: "asc" },
  });

  return NextResponse.json(strains);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();

    const strain = await prisma.strain.create({
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
    console.error("Create strain error:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { success: false, error: "A strain with this name or slug already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json({ success: false, error: "Failed to create strain" }, { status: 500 });
  }
}
