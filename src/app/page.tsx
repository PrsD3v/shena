import {
  formatDuration,
  formatJalaliDate,
  formatJalaliWeekday,
  formatNumber,
  formatTime,
  formatToman,
} from "@/lib/format";

const palette = [
  { token: "--background", label: "پس‌زمینه صفحه", className: "bg-background" },
  { token: "--card", label: "سطح کارت", className: "bg-card" },
  { token: "--primary", label: "سرمه‌ای اصلی", className: "bg-primary" },
  { token: "--brand-blue", label: "آبی پیوند", className: "bg-brand-blue" },
  { token: "--brand-aqua", label: "فیروزه‌ای", className: "bg-brand-aqua" },
  { token: "--brand-water", label: "آب روشن", className: "bg-brand-water" },
  { token: "--foreground", label: "متن اصلی", className: "bg-foreground" },
  {
    token: "--muted-foreground",
    label: "متن کمکی",
    className: "bg-muted-foreground",
  },
  { token: "--border", label: "خط و حاشیه", className: "bg-border" },
  { token: "--success", label: "تأیید", className: "bg-success" },
  { token: "--warning", label: "هشدار", className: "bg-warning" },
  { token: "--destructive", label: "خطا", className: "bg-destructive" },
];

const tints = [
  { token: "--accent-aqua", label: "فیروزه‌ای", className: "bg-accent-aqua" },
  { token: "--accent-sky", label: "آبی آسمانی", className: "bg-accent-sky" },
  { token: "--accent-mint", label: "نعنایی", className: "bg-accent-mint" },
  { token: "--accent-sand", label: "شنی", className: "bg-accent-sand" },
];

const radii = [
  { label: "کارت، ۱۶ پیکسل", className: "rounded-lg" },
  { label: "ورودی، ۱۲ پیکسل", className: "rounded-md" },
  { label: "دکمه قرصی", className: "rounded-full" },
];

const samples = [
  { label: "قیمت", value: formatToman(700000) },
  { label: "عدد", value: formatNumber(12500) },
  { label: "تاریخ", value: formatJalaliDate("2026-03-21") },
  { label: "روز هفته", value: formatJalaliWeekday("2026-03-21") },
  { label: "ساعت", value: formatTime("09:30") },
  { label: "مدت جلسه", value: formatDuration(90) },
];

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="border-b border-border pb-6">
        <p className="text-sm font-medium text-brand-blue">
          پیش‌نمایش پایه طراحی
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-brand-navy sm:text-5xl">
          شنا
        </h1>
        <p className="mt-3 max-w-2xl text-base text-muted-foreground">
          این صفحه موقت رنگ، تایپوگرافی فارسی و قالب راست‌به‌چپ را نشان می‌دهد و
          در گام بعدی با صفحه اصلی جایگزین می‌شود.
        </p>
      </header>

      <div className="space-y-10 pt-8">
        <section aria-labelledby="typography-title" className="space-y-4">
          <h2
            id="typography-title"
            className="text-xl font-semibold text-brand-navy"
          >
            تایپوگرافی
          </h2>
          <div className="rounded-lg border border-border bg-card p-6">
            <p className="text-4xl leading-tight font-bold text-brand-navy">
              تیتر نمایشی برای معرفی مربیان شنا
            </p>
            <p className="mt-5 text-2xl font-semibold text-foreground">
              تیتر بخش: پکیج‌های تمرین
            </p>
            <p className="mt-4 text-base text-foreground">
              متن اصلی با فاصله خط مناسب برای خواندن جمله‌های فارسی نوشته شده
              است. وزن و اندازه، سلسله‌مراتب را می‌سازند و رنگ تنها برای تأکید به
              کار می‌رود.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              متن کمکی و فراداده در اندازه کوچک‌تر و رنگ ملایم‌تر
            </p>
            <p
              dir="ltr"
              className="mt-4 font-mono text-xs text-muted-foreground text-left"
            >
              fa-IR / Asia/Tehran / 2026-03-21T09:30:00+03:30
            </p>
          </div>
        </section>

        <section aria-labelledby="palette-title" className="space-y-4">
          <h2 id="palette-title" className="text-xl font-semibold text-brand-navy">
            رنگ‌ها
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {palette.map((item) => (
              <div
                key={item.token}
                className="overflow-hidden rounded-md border border-border bg-card"
              >
                <div className={`h-12 ${item.className}`} />
                <div className="p-2">
                  <p className="text-xs text-foreground">{item.label}</p>
                  <p
                    dir="ltr"
                    className="font-mono text-[0.7rem] text-muted-foreground text-left"
                  >
                    {item.token}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="tints-title" className="space-y-4">
          <h2 id="tints-title" className="text-xl font-semibold text-brand-navy">
            رنگ‌های تأکیدی کارت
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {tints.map((tint) => (
              <div
                key={tint.token}
                className={`rounded-lg p-4 text-brand-navy ${tint.className}`}
              >
                <p className="text-sm font-semibold">{tint.label}</p>
                <p
                  dir="ltr"
                  className="mt-1 font-mono text-[0.7rem] opacity-80 text-right"
                >
                  {tint.token}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="shape-title" className="space-y-4">
          <h2 id="shape-title" className="text-xl font-semibold text-brand-navy">
            گوشه‌ها
          </h2>
          <div className="flex flex-wrap items-center gap-4">
            {radii.map((radius) => (
              <div
                key={radius.label}
                className={`flex h-20 w-40 items-center justify-center border border-border bg-secondary px-4 text-center text-sm font-medium text-brand-navy ${radius.className}`}
              >
                {radius.label}
              </div>
            ))}
            <span className="rounded-full bg-brand-aqua px-4 py-1.5 text-sm font-medium text-brand-navy">
              برچسب قرصی
            </span>
          </div>
        </section>

        <section aria-labelledby="format-title" className="space-y-4">
          <h2 id="format-title" className="text-xl font-semibold text-brand-navy">
            قالب‌بندی عدد و تاریخ
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
            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <dt className="text-sm text-muted-foreground">
                مقدار لاتین ذخیره‌شده
              </dt>
              <dd dir="ltr" className="font-mono text-sm text-foreground">
                2026-03-21 09:30
              </dd>
            </div>
          </dl>
        </section>
      </div>

      <p className="mt-10 border-t border-border pt-6 text-sm text-muted-foreground">
        این صفحه فقط برای بررسی پایه طراحی است و در آیتم ۵ نقشه ساخت با صفحه اصلی
        جایگزین می‌شود.
      </p>
    </main>
  );
}
