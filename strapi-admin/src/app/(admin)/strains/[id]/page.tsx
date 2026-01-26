import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import StrainForm from "@/components/StrainForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2 } from "lucide-react";

interface PageProps {
  params: { id: string };
}

export default async function EditStrainPage({ params }: PageProps) {
  const strain = await prisma.strain.findUnique({
    where: { id: params.id },
  });

  if (!strain) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/strains">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Strain</h1>
            <p className="text-gray-500 mt-1">{strain.name}</p>
          </div>
        </div>
        <form action={`/api/strains/${strain.id}/delete`} method="POST">
          <Button type="submit" variant="destructive" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </form>
      </div>

      <StrainForm strain={strain as any} />
    </div>
  );
}
