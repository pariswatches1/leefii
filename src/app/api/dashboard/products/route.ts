import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function GET() {
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

    const products = await prisma.product.findMany({
      where: { sellerId: sellerProfile.id },
      orderBy: { createdAt: 'desc' },
      include: {
        category: { select: { name: true } },
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId: session.user.id },
      include: { products: { select: { id: true } } },
    });

    if (!sellerProfile) {
      return NextResponse.json({ error: 'Not a seller' }, { status: 403 });
    }

    // Check product limits
    const tierLimits: Record<string, number> = {
      BASIC: 10,
      STANDARD: 50,
      PREMIUM: Infinity,
    };
    const limit = tierLimits[sellerProfile.subscriptionTier] || 10;

    if (sellerProfile.products.length >= limit) {
      return NextResponse.json(
        { error: 'Product limit reached. Please upgrade your plan.' },
        { status: 403 }
      );
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
    } = body;

    if (!name || !description || !price) {
      return NextResponse.json(
        { error: 'Name, description, and price are required' },
        { status: 400 }
      );
    }

    // Generate unique slug
    let slug = slugify(name);
    const existingProduct = await prisma.product.findUnique({
      where: {
        sellerId_slug: {
          sellerId: sellerProfile.id,
          slug,
        },
      },
    });

    if (existingProduct) {
      slug = `${slug}-${Date.now()}`;
    }

    const product = await prisma.product.create({
      data: {
        sellerId: sellerProfile.id,
        name,
        slug,
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
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
