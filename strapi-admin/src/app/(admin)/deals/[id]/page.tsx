import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import DealForm from "@/components/DealForm";

interface PageProps {
  params: { id: string };
}

export default async function EditDealPage({ params }: PageProps) {
  const deal = await prisma.deal.findUnique({
    where: { id: params.id },
  });

  if (!deal) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/deals">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Deal</h1>
          <p className="text-gray-500 mt-1">{deal.title}</p>
        </div>
      </div>

      <DealForm deal={deal} />
    </div>
  );
}
