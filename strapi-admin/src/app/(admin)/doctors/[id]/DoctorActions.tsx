"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface Doctor {
  id: string;
  name: string;
  isActive: boolean;
  isFeatured: boolean;
  subscriptionTier: string;
  subscriptionStatus: string;
}

export default function DoctorActions({ doctor }: { doctor: Doctor }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleToggleActive = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/doctors/${doctor.id}/toggle-active`, {
        method: "POST",
      });
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFeatured = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/doctors/${doctor.id}/toggle-featured`, {
        method: "POST",
      });
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChangeTier = async (tier: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/doctors/${doctor.id}/change-tier`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
      <div className="space-y-3">
        <Button
          onClick={handleToggleActive}
          disabled={loading}
          variant={doctor.isActive ? "destructive" : "default"}
          className="w-full"
        >
          {doctor.isActive ? "Deactivate Listing" : "Activate Listing"}
        </Button>

        <Button
          onClick={handleToggleFeatured}
          disabled={loading}
          variant={doctor.isFeatured ? "outline" : "secondary"}
          className="w-full"
        >
          {doctor.isFeatured ? "Remove Featured" : "Mark as Featured"}
        </Button>

        <div className="pt-3 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-2">Change Subscription Tier</p>
          <div className="flex gap-2">
            <Button
              onClick={() => handleChangeTier("FREE")}
              disabled={loading || doctor.subscriptionTier === "FREE"}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              Free
            </Button>
            <Button
              onClick={() => handleChangeTier("BASIC")}
              disabled={loading || doctor.subscriptionTier === "BASIC"}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              Basic
            </Button>
            <Button
              onClick={() => handleChangeTier("PREMIUM")}
              disabled={loading || doctor.subscriptionTier === "PREMIUM"}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              Premium
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
