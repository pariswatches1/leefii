import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ContentForm from "@/components/ContentForm";

interface PageProps {
  params: { id: string };
}

export default async function EditBlogPage({ params }: PageProps) {
  const post = await prisma.blogPost.findUnique({
    where: { id: params.id },
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/blog">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Blog Post</h1>
          <p className="text-gray-500 mt-1">{post.title}</p>
        </div>
      </div>

      <ContentForm type="blog" content={post} />
    </div>
  );
}
