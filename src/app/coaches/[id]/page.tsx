import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CoachProfile } from "@/components/coaches/coach-profile";
import { CERTIFICATES } from "@/data/certificates";
import { COACHES } from "@/data/coaches";
import { SEEDED_REVIEWS } from "@/data/reviews";
import { getCityLabel } from "@/lib/coaches/discovery";
import { getCoach, listPackagesForCoach } from "@/lib/repositories/coaches";
import type { Certificate } from "@/types/coach";

export const instant = false;

type CoachProfilePageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return COACHES.map((coach) => ({ id: coach.id }));
}

export async function generateMetadata({
  params,
}: CoachProfilePageProps): Promise<Metadata> {
  const { id } = await params;
  const coach = getCoach(id);
  if (!coach) return { title: "مربی پیدا نشد | شنا" };

  return {
    title: `${coach.name} | شنا`,
    description: `${coach.name}، مربی شنا در ${getCityLabel(
      coach.cityId,
    )} با ${coach.yearsExperience} سال تجربه. قیمت جلسه، پکیج‌ها و نظرها را ببینید.`,
  };
}

export default async function CoachProfilePage({
  params,
}: CoachProfilePageProps) {
  const { id } = await params;
  const coach = getCoach(id);
  if (!coach) notFound();

  const packages = listPackagesForCoach(coach.id);
  const certificates: Certificate[] = coach.certificateIds.flatMap(
    (certificateId) => {
      const certificate = CERTIFICATES.find(
        (entry) => entry.id === certificateId,
      );
      return certificate ? [certificate] : [];
    },
  );
  const reviews = SEEDED_REVIEWS.filter(
    (review) => review.coachId === coach.id,
  )
    .map((review) => ({ ...review }))
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <nav aria-label="مسیر صفحه" className="mb-6">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
          <li>
            <Link href="/" className="transition-colors hover:text-foreground">
              خانه
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link
              href="/coaches"
              className="transition-colors hover:text-foreground"
            >
              مربیان
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-foreground">
            {coach.name}
          </li>
        </ol>
      </nav>

      <CoachProfile
        coach={coach}
        packages={packages}
        certificates={certificates}
        reviews={reviews}
      />
    </main>
  );
}
