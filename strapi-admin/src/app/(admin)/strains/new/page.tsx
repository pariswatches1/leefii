import StrainForm from "@/components/StrainForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NewStrainPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/strains">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">New Strain</h1>
          <p className="text-gray-500 mt-1">Add a new cannabis strain to the database</p>
        </div>
      </div>

      <StrainForm />
    </div>
  );
}
