import type { Metadata } from "next";
import { Suspense } from "react";

import { CoachDirectory } from "@/components/coaches/coach-directory";
import {
  buildCoachQuery,
  parseCoachFilters,
} from "@/lib/coaches/discovery";
import { listCoaches } from "@/lib/repositories/coaches";

export const metadata: Metadata = {
  title: "مربیان شنا | شنا",
  description:
    "جست‌وجو و مقایسه مربیان شنا بر اساس شهر، تخصص، سطح، گروه سنی، جنسیت و قیمت جلسه.",
};

type CoachesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default function CoachesPage({ searchParams }: CoachesPageProps) {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <header className="mb-8 max-w-2xl">
        <p className="text-sm font-medium text-brand-blue">مربیان شنا</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
          مربی مناسب خودت را پیدا کن
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          سابقه، گواهی‌ها، محل تمرین و قیمت هر مربی را کنار هم ببین و با
          شرایط خودت مقایسه کن.
        </p>
      </header>

      <Suspense fallback={<DirectoryFallback />}>
        <CoachDirectorySection searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function CoachDirectorySection({ searchParams }: CoachesPageProps) {
  const filters = parseCoachFilters(await searchParams);

  return (
    <CoachDirectory
      key={buildCoachQuery(filters)}
      coaches={listCoaches()}
      initialFilters={filters}
    />
  );
}

function DirectoryFallback() {
  return (
    <div role="status" className="space-y-4">
      <span className="sr-only">در حال بارگذاری مربیان</span>
      <div className="h-5 w-16 rounded-full bg-muted" />
      <div className="grid gap-4 sm:grid-cols-2">
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <div
            key={index}
            className="h-56 rounded-lg border border-border bg-card"
          />
        ))}
      </div>
    </div>
  );
}
