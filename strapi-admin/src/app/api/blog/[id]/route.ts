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

  const post = await prisma.blogPost.findUnique({
    where: { id: params.id },
  });

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json(post);
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

    const post = await prisma.blogPost.update({
      where: { id: params.id },
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt || null,
        content: data.content,
        imageUrl: data.imageUrl || null,
        category: data.category || null,
        tags: data.tags || [],
        isPublished: data.isPublished ?? false,
        publishedAt: data.isPublished ? (data.publishedAt || new Date()) : null,
        metaTitle: data.metaTitle || null,
        metaDescription: data.metaDescription || null,
        authorName: data.authorName || null,
      },
    });

    return NextResponse.json({ success: true, post });
  } catch (error: any) {
    console.error("Update blog error:", error);
    return NextResponse.json({ success: false, error: "Failed to update post" }, { status: 500 });
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
    await prisma.blogPost.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete blog error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete post" }, { status: 500 });
  }
}
