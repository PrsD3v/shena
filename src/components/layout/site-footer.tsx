import Link from "next/link";
import { WavesIcon } from "lucide-react";

import { CITIES } from "@/data/cities";
import { SPECIALTIES } from "@/data/specialties";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-card">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="space-y-3">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <span className="flex size-9 items-center justify-center rounded-full bg-brand-water text-brand-blue">
              <WavesIcon className="size-5" aria-hidden="true" />
            </span>
            <span className="text-lg font-bold text-brand-navy">شنا</span>
          </Link>
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            مقایسه مربیان شنا و رزرو جلسه تمرین، با قیمت، سابقه و نظرهای روشن.
          </p>
        </div>

        <nav aria-label="دسترسی سریع">
          <p className="mb-3 text-sm font-semibold text-brand-navy">
            دسترسی سریع
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                صفحه اصلی
              </Link>
            </li>
            <li>
              <Link
                href="/coaches"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                همه مربیان
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="شهرها">
          <p className="mb-3 text-sm font-semibold text-brand-navy">شهرها</p>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            {CITIES.map((city) => (
              <li key={city.id}>
                <Link
                  href={`/coaches?city=${city.id}`}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {city.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="تخصص‌ها">
          <p className="mb-3 text-sm font-semibold text-brand-navy">تخصص‌ها</p>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            {SPECIALTIES.map((specialty) => (
              <li key={specialty.id}>
                <Link
                  href={`/coaches?specialty=${specialty.id}`}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {specialty.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-border">
        <p className="mx-auto w-full max-w-6xl px-4 py-4 text-xs text-muted-foreground sm:px-6 lg:px-8">
          این یک نمونه آزمایشی است. داده‌ها فقط در همین مرورگر ذخیره می‌شوند و
          هیچ اطلاعاتی ارسال نمی‌شود.
        </p>
      </div>
    </footer>
  );
}
