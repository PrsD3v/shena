"use client";

import { useState } from "react";
import { MapPinIcon, SearchIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { Rating } from "@/components/ui/rating";
import { SegmentedControl } from "@/components/ui/segmented-control";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { formatDuration, formatJalaliDate, formatToman } from "@/lib/format";

const cities = [
  { value: "tehran", label: "تهران" },
  { value: "karaj", label: "کرج" },
  { value: "isfahan", label: "اصفهان" },
  { value: "shiraz", label: "شیراز" },
  { value: "mashhad", label: "مشهد" },
];

const buttons = [
  { label: "اصلی", variant: "default" as const },
  { label: "خطی", variant: "outline" as const },
  { label: "ثانویه", variant: "secondary" as const },
  { label: "شبح", variant: "ghost" as const },
  { label: "خطر", variant: "destructive" as const },
  { label: "پیوند", variant: "link" as const },
];

const badges = [
  { label: "تأییدشده", variant: "default" as const },
  { label: "جدید", variant: "secondary" as const },
  { label: "شنای کودکان", variant: "accent-aqua" as const },
  { label: "بانوان", variant: "accent-sky" as const },
  { label: "مبتدی", variant: "accent-mint" as const },
  { label: "خصوصی", variant: "accent-sand" as const },
  { label: "ظرفیت آزاد", variant: "success" as const },
  { label: "ظرفیت محدود", variant: "warning" as const },
  { label: "لغو شده", variant: "destructive" as const },
  { label: "خطی", variant: "outline" as const },
];

const samples = [
  { label: "قیمت جلسه", value: formatToman(700000) },
  { label: "مدت جلسه", value: formatDuration(90) },
  { label: "تاریخ", value: formatJalaliDate("2026-03-21") },
];

const scopes = [
  { value: "all", label: "همه" },
  { value: "in-person", label: "حضوری" },
  { value: "online", label: "آنلاین" },
];

export default function Home() {
  const [scope, setScope] = useState("all");

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="border-b border-border pb-6">
        <p className="text-sm font-medium text-brand-blue">
          پیش‌نمایش اجزای رابط
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-brand-navy sm:text-5xl">
          لایه اجزای شنا
        </h1>
        <p className="mt-3 max-w-2xl text-base text-muted-foreground">
          این صفحه موقت همه اجزای پایه را کنار هم نشان می‌دهد تا شعاع گوشه،
          حاشیه، حالت فوکوس و رفتار راست‌به‌چپ بررسی شود. صفحه اصلی در گام ۵
          جایگزین آن می‌شود.
        </p>
      </header>

      <div className="space-y-10 pt-8">
        <section aria-labelledby="buttons-title" className="space-y-4">
          <h2
            id="buttons-title"
            className="text-xl font-semibold text-brand-navy"
          >
            دکمه‌ها
          </h2>
          <div className="flex flex-wrap items-center gap-3">
            {buttons.map((button) => (
              <Button key={button.variant} variant={button.variant}>
                {button.label}
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm">کوچک</Button>
            <Button>معمولی</Button>
            <Button size="lg">بزرگ</Button>
            <Button disabled>غیرفعال</Button>
          </div>
        </section>

        <section aria-labelledby="fields-title" className="space-y-4">
          <h2
            id="fields-title"
            className="text-xl font-semibold text-brand-navy"
          >
            ورودی‌ها
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="gallery-name" className="text-sm font-medium">
                نام مربی
              </label>
              <Input
                id="gallery-name"
                placeholder="مثلاً سارا محمدی"
                defaultValue="سارا محمدی"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="gallery-city" className="text-sm font-medium">
                شهر
              </label>
              <Select items={cities} defaultValue="tehran">
                <SelectTrigger id="gallery-city" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city.value} value={city.value}>
                      {city.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="gallery-invalid" className="text-sm font-medium">
                جست‌وجو
              </label>
              <Input
                id="gallery-invalid"
                aria-invalid="true"
                aria-describedby="gallery-invalid-error"
                defaultValue=""
                placeholder="نام یا تخصص"
              />
              <p id="gallery-invalid-error" className="text-sm text-destructive">
                عبارت جست‌وجو نمی‌تواند خالی باشد.
              </p>
            </div>
            <div className="space-y-2">
              <label htmlFor="gallery-disabled" className="text-sm font-medium">
                ورودی غیرفعال
              </label>
              <Input id="gallery-disabled" disabled defaultValue="۶۰۰٬۰۰۰" />
            </div>
          </div>
        </section>

        <section aria-labelledby="badges-title" className="space-y-4">
          <h2
            id="badges-title"
            className="text-xl font-semibold text-brand-navy"
          >
            برچسب‌ها
          </h2>
          <div className="flex flex-wrap gap-2">
            {badges.map((badge) => (
              <Badge key={badge.variant} variant={badge.variant}>
                {badge.label}
              </Badge>
            ))}
          </div>
        </section>

        <section aria-labelledby="cards-title" className="space-y-4">
          <h2
            id="cards-title"
            className="text-xl font-semibold text-brand-navy"
          >
            کارت‌ها
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>سارا محمدی</CardTitle>
                <CardDescription>مربی شنای کودکان، تهران</CardDescription>
                <CardAction>
                  <Badge>تأییدشده</Badge>
                </CardAction>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPinIcon className="size-4" />
                  استخر قائم، تهران
                </p>
                <p className="text-sm">۱۲ سال تجربه، جلسه ۹۰ دقیقه‌ای</p>
              </CardContent>
              <CardFooter className="justify-between">
                <span className="text-sm font-medium">
                  {formatToman(700000)}
                </span>
                <Button size="sm">انتخاب مربی</Button>
              </CardFooter>
            </Card>
            <Card className="bg-accent-mint">
              <CardHeader>
                <CardTitle>پکیج پنج جلسه‌ای</CardTitle>
                <CardDescription>
                  مناسب تمرین منظم هفتگی با تخفیف نسبت به جلسه تکی
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{formatToman(3200000)}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  هر جلسه {formatToman(640000)}
                </p>
              </CardContent>
              <CardFooter className="justify-end">
                <Button variant="outline" size="sm">
                  جزئیات پکیج
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        <section aria-labelledby="controls-title" className="space-y-4">
          <h2
            id="controls-title"
            className="text-xl font-semibold text-brand-navy"
          >
            کنترل و نمایش
          </h2>
          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">نوع جلسه</p>
              <SegmentedControl
                aria-label="نوع جلسه"
                items={scopes}
                value={scope}
                onValueChange={setScope}
              />
              <p className="text-sm text-muted-foreground">
                انتخاب فعلی:{" "}
                {scopes.find((item) => item.value === scope)?.label}
              </p>
            </div>
            <Rating value={4.8} count={24} />
            <Card>
              <CardContent className="pt-4">
                <EmptyState
                  icon={SearchIcon}
                  title="مربی‌ای پیدا نشد"
                  description="فیلترها را تغییر دهید یا شهر دیگری را انتخاب کنید."
                  action={
                    <Button variant="outline" size="sm">
                      پاک کردن فیلترها
                    </Button>
                  }
                />
              </CardContent>
            </Card>
          </div>
        </section>

        <section aria-labelledby="overlays-title" className="space-y-4">
          <h2
            id="overlays-title"
            className="text-xl font-semibold text-brand-navy"
          >
            پنجره و کشو
          </h2>
          <div className="flex flex-wrap gap-3">
            <Dialog>
              <DialogTrigger render={<Button variant="outline" />}>
                باز کردن پنجره
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>تأیید رزرو جلسه</DialogTitle>
                  <DialogDescription>
                    سارا محمدی، تهران، {formatJalaliDate("2026-03-21")} ساعت
                    ۰۹:۳۰
                  </DialogDescription>
                </DialogHeader>
                <div className="rounded-md bg-brand-water p-4 text-sm text-brand-navy">
                  پرداخت این نسخه آزمایشی است و مبلغی جابه‌جا نمی‌شود.
                </div>
                <DialogFooter showCloseButton>
                  <Button>ادامه</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Sheet>
              <SheetTrigger render={<Button variant="outline" />}>
                باز کردن کشو
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>فیلترها</SheetTitle>
                  <SheetDescription>
                    نمونه کشوی کنار صفحه برای فیلترهای جست‌وجو
                  </SheetDescription>
                </SheetHeader>
                <div className="flex-1 space-y-3 px-4">
                  <div className="space-y-2">
                    <label htmlFor="sheet-query" className="text-sm font-medium">
                      جست‌وجو
                    </label>
                    <div className="relative">
                      <SearchIcon className="pointer-events-none absolute inset-y-0 start-3 my-auto size-4 text-muted-foreground" />
                      <Input
                        id="sheet-query"
                        className="ps-9"
                        placeholder="نام مربی"
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">بانوان</Badge>
                    <Badge variant="outline">خصوصی</Badge>
                    <Badge variant="outline">کودکان</Badge>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </section>

        <section aria-labelledby="formats-title" className="space-y-4">
          <h2
            id="formats-title"
            className="text-xl font-semibold text-brand-navy"
          >
            قالب‌بندی
          </h2>
          <dl className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
            {samples.map((sample) => (
              <div
                key={sample.label}
                className="flex items-center justify-between gap-4 px-4 py-3"
              >
                <dt className="text-sm text-muted-foreground">{sample.label}</dt>
                <dd className="text-base font-medium text-foreground">
                  {sample.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </main>
  );
}
