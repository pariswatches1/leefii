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

  const article = await prisma.newsArticle.findUnique({
    where: { id: params.id },
  });

  if (!article) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  return NextResponse.json(article);
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

    const article = await prisma.newsArticle.update({
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
        sourceName: data.sourceName || null,
        sourceUrl: data.sourceUrl || null,
      },
    });

    return NextResponse.json({ success: true, article });
  } catch (error: any) {
    console.error("Update news error:", error);
    return NextResponse.json({ success: false, error: "Failed to update article" }, { status: 500 });
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
    await prisma.newsArticle.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete news error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete article" }, { status: 500 });
  }
}
