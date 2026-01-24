import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await auth();
    const { productId, sellerId, name, email, phone, message } = await request.json();

    if (!sellerId || !name || !email || !message) {
      return NextResponse.json(
        { error: 'Please fill in all required fields' },
        { status: 400 }
      );
    }

    // Validate seller exists
    const seller = await prisma.sellerProfile.findUnique({
      where: { id: sellerId, isActive: true },
    });

    if (!seller) {
      return NextResponse.json(
        { error: 'Seller not found' },
        { status: 404 }
      );
    }

    // Validate product if provided
    if (productId) {
      const product = await prisma.product.findUnique({
        where: { id: productId, sellerId, isAvailable: true },
      });

      if (!product) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }
    }

    // Create the inquiry
    await prisma.inquiry.create({
      data: {
        productId: productId || null,
        sellerId,
        userId: session?.user?.id || null,
        name,
        email,
        phone: phone || null,
        message,
      },
    });

    return NextResponse.json(
      { message: 'Inquiry submitted successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Inquiry error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
