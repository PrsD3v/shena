import type { ReactNode } from "react";
import Image from "next/image";
import {
  BadgeCheckIcon,
  BriefcaseIcon,
  MapPinIcon,
  UserIcon,
} from "lucide-react";

import { CopyLinkButton } from "@/components/coaches/copy-link-button";
import { FavoriteButton } from "@/components/coaches/favorite-button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Rating } from "@/components/ui/rating";
import {
  getCityLabel,
  getGenderLabel,
  getSpecialtyLabel,
} from "@/lib/coaches/discovery";
import {
  formatDuration,
  formatJalaliDate,
  formatNumber,
  formatToman,
  toPersianDigits,
} from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Certificate, Coach, Package } from "@/types/coach";
import type { Review } from "@/types/review";

const ACCENT_BACKGROUNDS: Record<Coach["accent"], string> = {
  aqua: "bg-accent-aqua",
  sky: "bg-accent-sky",
  mint: "bg-accent-mint",
  sand: "bg-accent-sand",
};

const PACKAGE_TINTS = ["bg-accent-aqua", "bg-accent-sky", "bg-accent-mint"];

type CoachProfileProps = {
  coach: Coach;
  packages: Package[];
  certificates: Certificate[];
  reviews: Review[];
};

export function CoachProfile({
  coach,
  packages,
  certificates,
  reviews,
}: CoachProfileProps) {
  return (
    <div className="space-y-6">
      <Card className="gap-0 overflow-hidden py-0">
        <div
          className={cn(
            "flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:p-8",
            ACCENT_BACKGROUNDS[coach.accent],
          )}
        >
          <div className="relative mx-auto size-28 shrink-0 overflow-hidden rounded-full border-4 border-white bg-white shadow-sm sm:mx-0 sm:size-32">
            <Image
              src={coach.portrait.src}
              alt={coach.portrait.alt}
              fill
              sizes="128px"
              className="object-cover"
              priority
            />
          </div>

          <div className="min-w-0 flex-1 text-center sm:text-start">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <h1 className="text-2xl font-bold tracking-tight text-brand-navy sm:text-3xl">
                {coach.name}
              </h1>
              {coach.verified && (
                <Badge>
                  <BadgeCheckIcon aria-hidden="true" />
                  تأییدشده
                </Badge>
              )}
            </div>

            <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-brand-navy/75 sm:justify-start">
              <span className="flex items-center gap-1">
                <MapPinIcon className="size-4" aria-hidden="true" />
                {getCityLabel(coach.cityId)}
              </span>
              <span className="flex items-center gap-1">
                <UserIcon className="size-4" aria-hidden="true" />
                {getGenderLabel(coach.gender)}
              </span>
              <span className="flex items-center gap-1">
                <BriefcaseIcon className="size-4" aria-hidden="true" />
                {formatNumber(coach.yearsExperience)} سال تجربه
              </span>
            </div>

            <Rating
              value={coach.rating}
              count={coach.reviewCount}
              className="mt-3 justify-center sm:justify-start"
            />

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <FavoriteButton
                coachId={coach.id}
                coachName={coach.name}
                withLabel
                className="border border-border bg-card"
              />
              <CopyLinkButton />
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <div className="space-y-6">
          <Section id="about" title="درباره مربی">
            <p className="text-base leading-relaxed text-muted-foreground">
              {coach.bio}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {coach.specialtyIds.map((specialtyId) => (
                <Badge key={specialtyId} variant="secondary">
                  {getSpecialtyLabel(specialtyId)}
                </Badge>
              ))}
            </div>
          </Section>

          <Section id="certificates" title="گواهی‌ها">
            {certificates.length > 0 ? (
              <ul className="grid gap-3 sm:grid-cols-2">
                {certificates.map((certificate) => (
                  <li
                    key={certificate.id}
                    className="rounded-md border border-border bg-background p-3"
                  >
                    <p className="text-sm font-medium text-foreground">
                      {certificate.label}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {[
                        certificate.issuer,
                        certificate.year === undefined
                          ? null
                          : toPersianDigits(certificate.year),
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                گواهی‌ای برای این مربی ثبت نشده است.
              </p>
            )}
          </Section>

          <Section id="locations" title="محل‌های تمرین">
            <ul className="grid gap-3 sm:grid-cols-2">
              {coach.trainingLocations.map((location) => (
                <li
                  key={location.id}
                  className="flex items-start gap-3 rounded-md border border-border bg-background p-3"
                >
                  <MapPinIcon
                    className="mt-0.5 size-4 shrink-0 text-brand-blue"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {location.label}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {location.kind === "coach-pool"
                        ? "استخر مربی"
                        : "استخر شما"}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Section>

          <Section id="packages" title="پکیج‌ها">
            <div className="grid gap-4 sm:grid-cols-3">
              {packages.map((pkg, index) => (
                <div
                  key={pkg.id}
                  className={cn(
                    "rounded-lg p-4",
                    PACKAGE_TINTS[index % PACKAGE_TINTS.length],
                  )}
                >
                  <p className="text-sm font-semibold text-brand-navy">
                    {pkg.label}
                  </p>
                  <p className="mt-2 text-xl font-bold text-brand-navy">
                    {formatToman(pkg.totalPriceToman)}
                  </p>
                  <p className="mt-1 text-sm text-brand-navy/70">
                    هر جلسه {formatToman(pkg.perSessionToman)}
                  </p>
                </div>
              ))}
            </div>
          </Section>

          <Section
            id="reviews"
            title="نظرها"
            meta={`${formatNumber(reviews.length)} نظر نمایش داده شده از ${formatNumber(
              coach.reviewCount,
            )} نظر`}
          >
            {reviews.length > 0 ? (
              <div className="space-y-3">
                {reviews.map((review) => (
                  <article
                    key={review.id}
                    className="rounded-md border border-border bg-background p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {review.authorName}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {formatJalaliDate(review.createdAt)}
                        </p>
                      </div>
                      <Rating value={review.rating} />
                    </div>
                    {review.text && (
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {review.text}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                هنوز نظری برای این مربی ثبت نشده است.
              </p>
            )}
          </Section>
        </div>

        <aside className="lg:sticky lg:top-24">
          <Card>
            <CardHeader>
              <CardTitle>در یک نگاه</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3 text-sm">
                <SummaryRow
                  label="مدت جلسه"
                  value={formatDuration(coach.sessionDurationMinutes)}
                />
                <SummaryRow
                  label="قیمت یک جلسه"
                  value={formatToman(coach.sessionPriceToman)}
                />
                <SummaryRow
                  label="پکیج‌ها"
                  value={`${formatNumber(packages.length)} پکیج`}
                />
                <SummaryRow
                  label="محل‌های تمرین"
                  value={`${formatNumber(coach.trainingLocations.length)} محل`}
                />
              </dl>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

type SectionProps = {
  id: string;
  title: string;
  meta?: string;
  children: ReactNode;
};

function Section({ id, title, meta, children }: SectionProps) {
  return (
    <section
      aria-labelledby={`${id}-title`}
      className="rounded-lg border border-border bg-card p-5"
    >
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h2
          id={`${id}-title`}
          className="text-lg font-semibold text-brand-navy"
        >
          {title}
        </h2>
        {meta && <p className="text-sm text-muted-foreground">{meta}</p>}
      </div>
      {children}
    </section>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-end font-medium text-foreground">{value}</dd>
    </div>
  );
}
