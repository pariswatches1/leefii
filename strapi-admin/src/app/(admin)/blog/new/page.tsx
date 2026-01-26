import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ContentForm from "@/components/ContentForm";

export default function NewBlogPage() {
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
          <h1 className="text-3xl font-bold text-gray-900">New Blog Post</h1>
          <p className="text-gray-500 mt-1">Create a new blog post</p>
        </div>
      </div>

      <ContentForm type="blog" />
    </div>
  );
}
