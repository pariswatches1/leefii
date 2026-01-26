import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!sellerProfile) {
      return NextResponse.json({ error: 'Not a seller' }, { status: 403 });
    }

    const product = await prisma.product.findFirst({
      where: {
        id: params.id,
        sellerId: sellerProfile.id,
      },
      include: {
        category: { select: { name: true, slug: true } },
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!sellerProfile) {
      return NextResponse.json({ error: 'Not a seller' }, { status: 403 });
    }

    // Check if product belongs to this seller
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: params.id,
        sellerId: sellerProfile.id,
      },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const body = await request.json();
    const {
      name,
      description,
      price,
      compareAtPrice,
      categoryId,
      brand,
      weight,
      thcContent,
      cbdContent,
      strain,
      strainType,
      images,
      isAvailable,
    } = body;

    if (!name || !description || price === undefined) {
      return NextResponse.json(
        { error: 'Name, description, and price are required' },
        { status: 400 }
      );
    }

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        name,
        description,
        price,
        compareAtPrice: compareAtPrice || null,
        categoryId: categoryId || null,
        brand: brand || null,
        weight: weight || null,
        thcContent: thcContent || null,
        cbdContent: cbdContent || null,
        strain: strain || null,
        strainType: strainType || null,
        images: images || [],
        isAvailable: isAvailable ?? true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!sellerProfile) {
      return NextResponse.json({ error: 'Not a seller' }, { status: 403 });
    }

    // Check if product belongs to this seller
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: params.id,
        sellerId: sellerProfile.id,
      },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
