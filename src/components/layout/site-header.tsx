import Link from "next/link";
import { SearchIcon, WavesIcon } from "lucide-react";

import { MobileNav } from "@/components/layout/mobile-nav";
import { Input } from "@/components/ui/input";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-2 px-4 sm:px-6 lg:px-8">
        <MobileNav />

        <Link
          href="/"
          className="flex items-center gap-2 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <span className="flex size-9 items-center justify-center rounded-full bg-brand-water text-brand-blue">
            <WavesIcon className="size-5" aria-hidden="true" />
          </span>
          <span className="text-lg font-bold text-brand-navy">شنا</span>
        </Link>

        <nav aria-label="ناوبری اصلی" className="hidden items-center gap-1 md:flex">
          <Link
            href="/"
            className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            خانه
          </Link>
          <Link
            href="/coaches"
            className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            مربیان
          </Link>
        </nav>

        <form
          action="/coaches"
          method="get"
          role="search"
          aria-label="جست‌وجوی مربی"
          className="relative ms-auto hidden w-full max-w-xs md:block"
        >
          <label htmlFor="site-search" className="sr-only">
            جست‌وجوی مربی
          </label>
          <SearchIcon
            className="pointer-events-none absolute inset-y-0 start-3 my-auto size-4 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="site-search"
            name="q"
            type="search"
            enterKeyHint="search"
            placeholder="نام مربی یا تخصص"
            maxLength={60}
            className="ps-9"
          />
          <button type="submit" className="sr-only">
            جست‌وجو
          </button>
        </form>
      </div>
    </header>
  );
}
