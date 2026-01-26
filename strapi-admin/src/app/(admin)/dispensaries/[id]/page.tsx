import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { formatDate } from "@/lib/utils";
import DispensaryForm from "@/components/DispensaryForm";

interface PageProps {
  params: { id: string };
}

export default async function EditDispensaryPage({ params }: PageProps) {
  const dispensary = await prisma.dispensary.findUnique({
    where: { id: params.id },
    include: {
      city: true,
      state: true,
    },
  });

  if (!dispensary) {
    notFound();
  }

  const states = await prisma.state.findMany({
    orderBy: { name: "asc" },
    include: { cities: { orderBy: { name: "asc" } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dispensaries">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Dispensary</h1>
          <p className="text-gray-500 mt-1">{dispensary.name}</p>
        </div>
      </div>

      <DispensaryForm dispensary={dispensary} states={states} />
    </div>
  );
}
