import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ContentForm from "@/components/ContentForm";

export default function NewNewsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/news">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">New News Article</h1>
          <p className="text-gray-500 mt-1">Create a new article</p>
        </div>
      </div>

      <ContentForm type="news" />
    </div>
  );
}
