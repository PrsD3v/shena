import { SearchXIcon } from "lucide-react";

import { CoachCard } from "@/components/coaches/coach-card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import type { Coach } from "@/types/coach";

type CoachResultsProps = {
  coaches: readonly Coach[];
  onReset: () => void;
};

export function CoachResults({ coaches, onReset }: CoachResultsProps) {
  if (coaches.length === 0) {
    return (
      <EmptyState
        icon={SearchXIcon}
        title="مربی‌ای با این مشخصات پیدا نشد"
        description="یکی از فیلترها را بردارید یا با شرایط ساده‌تری دوباره جست‌وجو کنید."
        action={
          <Button type="button" variant="outline" onClick={onReset}>
            پاک کردن فیلترها
          </Button>
        }
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {coaches.map((coach) => (
        <CoachCard key={coach.id} coach={coach} />
      ))}
    </div>
  );
}
