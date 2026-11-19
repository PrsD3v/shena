import Link from "next/link";
import { MapPinOffIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col items-center px-4 py-20 text-center sm:px-6">
      <span className="flex size-14 items-center justify-center rounded-full bg-brand-water text-brand-blue">
        <MapPinOffIcon className="size-7" aria-hidden="true" />
      </span>
      <h1 className="mt-5 text-2xl font-bold tracking-tight text-brand-navy sm:text-3xl">
        این صفحه پیدا نشد
      </h1>
      <p className="mt-2 max-w-md text-base leading-relaxed text-muted-foreground">
        نشانی ممکن است اشتباه باشد یا این مربی در نمونه شنا وجود نداشته باشد.
      </p>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
        <Link href="/coaches" className={buttonVariants()}>
          دیدن مربیان
        </Link>
        <Link
          href="/"
          className={buttonVariants({ variant: "outline" })}
        >
          صفحه اصلی
        </Link>
      </div>
    </main>
  );
}
