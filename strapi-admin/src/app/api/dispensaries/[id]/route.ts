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

  const dispensary = await prisma.dispensary.findUnique({
    where: { id: params.id },
    include: { city: true, state: true },
  });

  if (!dispensary) {
    return NextResponse.json({ error: "Dispensary not found" }, { status: 404 });
  }

  return NextResponse.json(dispensary);
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

    const dispensary = await prisma.dispensary.update({
      where: { id: params.id },
      data: {
        name: data.name,
        slug: data.slug,
        address: data.address,
        address2: data.address2 || null,
        zipCode: data.zipCode,
        phone: data.phone || null,
        email: data.email || null,
        website: data.website || null,
        stateId: data.stateId,
        cityId: data.cityId,
        latitude: data.latitude,
        longitude: data.longitude,
        hasDelivery: data.hasDelivery,
        hasStorefront: data.hasStorefront,
        hasCurbside: data.hasCurbside,
        isWheelchairAccessible: data.isWheelchairAccessible,
        acceptsCreditCard: data.acceptsCreditCard,
        hasATM: data.hasATM,
        licenseType: data.licenseType,
        licenseNumber: data.licenseNumber || null,
        isVerified: data.isVerified,
        verificationDate: data.verificationDate ? new Date(data.verificationDate) : null,
        verificationMethod: data.verificationMethod || null,
        verificationStatus: data.verificationStatus || "UNVERIFIED",
        verifiedBy: data.verifiedBy || null,
        menuAccuracyScore: data.menuAccuracyScore !== "" && data.menuAccuracyScore != null ? parseInt(data.menuAccuracyScore, 10) : null,
        isClaimed: data.isClaimed ?? false,
        claimedDate: data.isClaimed && !data.claimedDate ? new Date() : data.claimedDate ? new Date(data.claimedDate) : null,
        claimingContactEmail: data.claimingContactEmail || null,
        claimingContactPhone: data.claimingContactPhone || null,
        description: data.description || null,
        logoUrl: data.logoUrl || null,
        imageUrl: data.imageUrl || null,
        isActive: data.isActive,
        isPremium: data.isPremium,
        metaTitle: data.metaTitle || null,
        metaDescription: data.metaDescription || null,
      },
    });

    return NextResponse.json({ success: true, dispensary });
  } catch (error: any) {
    console.error("Update dispensary error:", error);
    return NextResponse.json({ success: false, error: "Failed to update dispensary" }, { status: 500 });
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
    await prisma.dispensary.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete dispensary error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete dispensary" }, { status: 500 });
  }
}
