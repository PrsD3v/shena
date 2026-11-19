"use client";

import { HeartIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/use-favorites";
import { cn } from "@/lib/utils";

type FavoriteButtonProps = {
  coachId: string;
  coachName: string;
  className?: string;
  withLabel?: boolean;
};

export function FavoriteButton({
  coachId,
  coachName,
  className,
  withLabel = false,
}: FavoriteButtonProps) {
  const { isFavorite, toggle } = useFavorites();
  const favorite = isFavorite(coachId);

  return (
    <Button
      type="button"
      variant="ghost"
      size={withLabel ? "sm" : "icon-sm"}
      aria-pressed={favorite}
      aria-label={
        favorite
          ? `حذف ${coachName} از علاقه‌مندی‌ها`
          : `افزودن ${coachName} به علاقه‌مندی‌ها`
      }
      onClick={() => toggle(coachId)}
      className={cn(
        "relative z-10 rounded-full bg-card/80 text-brand-navy hover:bg-card",
        className,
      )}
    >
      <HeartIcon
        aria-hidden="true"
        className={favorite ? "fill-brand-blue text-brand-blue" : undefined}
      />
      {withLabel && (
        <span>
          {favorite ? "در علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
        </span>
      )}
    </Button>
  );
}
