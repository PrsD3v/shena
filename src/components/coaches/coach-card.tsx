import Image from "next/image";
import Link from "next/link";
import { BadgeCheckIcon, MapPinIcon } from "lucide-react";

import { FavoriteButton } from "@/components/coaches/favorite-button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Rating } from "@/components/ui/rating";
import {
  getCityLabel,
  getSpecialtyLabel,
} from "@/lib/coaches/discovery";
import { formatNumber, formatToman } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Coach } from "@/types/coach";

const ACCENT_BACKGROUNDS: Record<Coach["accent"], string> = {
  aqua: "bg-accent-aqua",
  sky: "bg-accent-sky",
  mint: "bg-accent-mint",
  sand: "bg-accent-sand",
};

export function CoachCard({ coach }: { coach: Coach }) {
  return (
    <Card className="group relative gap-0 overflow-hidden py-0 transition-shadow duration-150 hover:shadow-md">
      <div
        className={cn(
          "flex items-start gap-4 p-4",
          ACCENT_BACKGROUNDS[coach.accent],
        )}
      >
        <div className="relative size-20 shrink-0 overflow-hidden rounded-lg border border-white/70 bg-white">
          <Image
            src={coach.portrait.src}
            alt={coach.portrait.alt}
            fill
            sizes="80px"
            className="object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-brand-navy">
            <Link
              href={`/coaches/${coach.id}`}
              className="outline-none after:absolute after:inset-0 after:content-[''] focus-visible:underline"
            >
              {coach.name}
            </Link>
          </h3>
          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-sm text-brand-navy/70">
            <span className="flex items-center gap-1">
              <MapPinIcon className="size-3.5" aria-hidden="true" />
              {getCityLabel(coach.cityId)}
            </span>
            {coach.verified && (
              <Badge className="h-5 px-2 text-[0.65rem]">
                <BadgeCheckIcon aria-hidden="true" />
                تأییدشده
              </Badge>
            )}
          </div>

          <div className="mt-2 flex flex-wrap gap-1.5">
            {coach.specialtyIds.slice(0, 2).map((specialtyId) => (
              <Badge
                key={specialtyId}
                variant="secondary"
                className="bg-white/70 text-brand-navy"
              >
                {getSpecialtyLabel(specialtyId)}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Rating value={coach.rating} count={coach.reviewCount} />
          <p className="text-sm text-muted-foreground">
            {formatNumber(coach.yearsExperience)} سال تجربه
          </p>
        </div>

        <div className="mt-auto flex items-end justify-between gap-2 border-t border-border pt-3">
          <div>
            <p className="text-sm text-muted-foreground">شروع از</p>
            <p className="text-base font-semibold text-brand-navy">
              {formatToman(coach.sessionPriceToman)}
              <span className="text-xs font-normal text-muted-foreground">
                {" "}
                / جلسه
              </span>
            </p>
          </div>
          <FavoriteButton coachId={coach.id} coachName={coach.name} />
        </div>
      </div>
    </Card>
  );
}
