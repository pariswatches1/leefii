import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// One-time API to update the focus blog post image
// DELETE THIS FILE AFTER USE
export async function GET() {
  try {
    const result = await prisma.blogPost.update({
      where: {
        slug: 'cannabis-strains-focus-productivity-top-recommendations',
      },
      data: {
        imageUrl: 'https://cdn.midjourney.com/fa2478b7-0239-4a79-bf81-1191fb6ee78d/0_1.png',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Blog post image updated!',
      title: result.title,
      newImageUrl: result.imageUrl,
    });
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update blog post' },
      { status: 500 }
    );
  }
}
