import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();

    const post = await prisma.blogPost.create({
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt || null,
        content: data.content,
        imageUrl: data.imageUrl || null,
        category: data.category || null,
        tags: data.tags || [],
        isPublished: data.isPublished ?? false,
        publishedAt: data.isPublished ? new Date() : null,
        metaTitle: data.metaTitle || null,
        metaDescription: data.metaDescription || null,
        authorName: data.authorName || null,
      },
    });

    return NextResponse.json({ success: true, post });
  } catch (error: any) {
    console.error("Create blog error:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { success: false, error: "A post with this slug already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json({ success: false, error: "Failed to create post" }, { status: 500 });
  }
}
