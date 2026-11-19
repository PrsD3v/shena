"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MenuIcon, SearchIcon, WavesIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const NAV_LINKS = [
  { href: "/", label: "خانه" },
  { href: "/coaches", label: "مربیان" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={<Button variant="ghost" size="icon" className="md:hidden" />}
      >
        <MenuIcon aria-hidden="true" />
        <span className="sr-only">باز کردن منو</span>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <span className="flex items-center gap-2 text-brand-navy">
            <span className="flex size-8 items-center justify-center rounded-full bg-brand-water text-brand-blue">
              <WavesIcon className="size-4" aria-hidden="true" />
            </span>
            <SheetTitle>منوی شنا</SheetTitle>
          </span>
          <SheetDescription>
            جست‌وجوی مربی و رفتن به بخش‌های اصلی
          </SheetDescription>
        </SheetHeader>

        <form
          action="/coaches"
          method="get"
          role="search"
          aria-label="جست‌وجوی مربی"
          className="relative px-4"
        >
          <label htmlFor="mobile-search" className="sr-only">
            جست‌وجوی مربی
          </label>
          <SearchIcon
            className="pointer-events-none absolute inset-y-0 start-7 my-auto size-4 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="mobile-search"
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

        <nav aria-label="ناوبری موبایل" className="flex flex-col gap-1 px-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={(event) => {
                if (
                  event.metaKey ||
                  event.ctrlKey ||
                  event.shiftKey ||
                  event.altKey
                ) {
                  return;
                }
                event.preventDefault();
                setOpen(false);
                router.push(link.href);
              }}
              className="rounded-md px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
