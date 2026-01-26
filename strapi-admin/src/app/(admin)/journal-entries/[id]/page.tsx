import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface PageProps {
  params: { id: string };
}

export default async function ViewJournalEntryPage({ params }: PageProps) {
  const entry = await prisma.journalEntry.findUnique({
    where: { id: params.id },
    include: {
      user: { select: { name: true, email: true } },
    },
  });

  if (!entry) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/journal-entries">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Journal Entry</h1>
          <p className="text-gray-500 mt-1">
            {entry.strainName} - {formatDate(entry.consumedAt)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Consumption Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm text-gray-500">Strain</dt>
                  <dd className="font-medium">{entry.strainName}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Strain Type</dt>
                  <dd>
                    {entry.strainType ? (
                      <Badge variant="secondary">{entry.strainType}</Badge>
                    ) : (
                      "N/A"
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Product Type</dt>
                  <dd>
                    <Badge variant="outline">{entry.productType.replace("_", " ")}</Badge>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Method</dt>
                  <dd>
                    <Badge variant="outline">{entry.method.replace("_", " ")}</Badge>
                  </dd>
                </div>
                {entry.amount && (
                  <div>
                    <dt className="text-sm text-gray-500">Amount</dt>
                    <dd className="font-medium">{entry.amount}</dd>
                  </div>
                )}
                {entry.duration && (
                  <div>
                    <dt className="text-sm text-gray-500">Duration</dt>
                    <dd className="font-medium">{entry.duration} minutes</dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Before & After State</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Before Consumption</h4>
                  <dl className="space-y-2">
                    {entry.moodBefore && (
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Mood</dt>
                        <dd>{entry.moodBefore}/5</dd>
                      </div>
                    )}
                    {entry.energyBefore && (
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Energy</dt>
                        <dd>{entry.energyBefore}/5</dd>
                      </div>
                    )}
                    {entry.symptomsBefore.length > 0 && (
                      <div>
                        <dt className="text-gray-500 mb-1">Symptoms</dt>
                        <dd className="flex flex-wrap gap-1">
                          {entry.symptomsBefore.map((s) => (
                            <Badge key={s} variant="outline" className="text-xs">
                              {s}
                            </Badge>
                          ))}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
                <div>
                  <h4 className="font-medium mb-3">After Consumption</h4>
                  <dl className="space-y-2">
                    {entry.moodAfter && (
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Mood</dt>
                        <dd>{entry.moodAfter}/5</dd>
                      </div>
                    )}
                    {entry.energyAfter && (
                      <div className="flex justify-between">
                        <dt className="text-gray-500">Energy</dt>
                        <dd>{entry.energyAfter}/5</dd>
                      </div>
                    )}
                    {entry.symptomsAfter.length > 0 && (
                      <div>
                        <dt className="text-gray-500 mb-1">Symptoms</dt>
                        <dd className="flex flex-wrap gap-1">
                          {entry.symptomsAfter.map((s) => (
                            <Badge key={s} variant="outline" className="text-xs">
                              {s}
                            </Badge>
                          ))}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Effects Experienced</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3 text-green-600">Positive Effects</h4>
                  <div className="flex flex-wrap gap-2">
                    {entry.effectsPositive.map((e) => (
                      <Badge key={e} variant="success">
                        {e}
                      </Badge>
                    ))}
                    {entry.effectsPositive.length === 0 && (
                      <p className="text-sm text-gray-400">None recorded</p>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3 text-red-600">Negative Effects</h4>
                  <div className="flex flex-wrap gap-2">
                    {entry.effectsNegative.map((e) => (
                      <Badge key={e} variant="destructive">
                        {e}
                      </Badge>
                    ))}
                    {entry.effectsNegative.length === 0 && (
                      <p className="text-sm text-gray-400">None recorded</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {entry.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{entry.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Overall Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-4xl text-yellow-500">
                  {"★".repeat(entry.overallRating)}
                  {"☆".repeat(5 - entry.overallRating)}
                </p>
                <p className="text-gray-500 mt-2">{entry.overallRating}/5 stars</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{entry.user.name || "Not set"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{entry.user.email}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Context</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {entry.setting && (
                <div>
                  <p className="text-sm text-gray-500">Setting</p>
                  <p className="font-medium">{entry.setting}</p>
                </div>
              )}
              {entry.activities.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Activities</p>
                  <div className="flex flex-wrap gap-1">
                    {entry.activities.map((a) => (
                      <Badge key={a} variant="outline" className="text-xs">
                        {a}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Privacy</span>
                <Badge variant={entry.isPrivate ? "secondary" : "success"}>
                  {entry.isPrivate ? "Private" : "Public"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dates</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Consumed</dt>
                  <dd className="font-medium">{formatDate(entry.consumedAt)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Created</dt>
                  <dd className="font-medium">{formatDate(entry.createdAt)}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
