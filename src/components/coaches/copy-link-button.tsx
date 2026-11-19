"use client";

import { useEffect, useRef, useState } from "react";
import { CheckIcon, LinkIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

type CopyState = "idle" | "copied" | "error";

export function CopyLinkButton({ label = "کپی نشانی صفحه" }: { label?: string }) {
  const [state, setState] = useState<CopyState>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  async function copyLink() {
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard is unavailable");
      }
      await navigator.clipboard.writeText(window.location.href);
      setState("copied");
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setState("idle"), 2000);
    } catch {
      setState("error");
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={copyLink}
        className="border-border bg-card"
      >
        {state === "copied" ? (
          <CheckIcon aria-hidden="true" />
        ) : (
          <LinkIcon aria-hidden="true" />
        )}
        {state === "copied" ? "کپی شد" : label}
      </Button>
      <span
        aria-live="polite"
        className={
          state === "error" ? "text-sm text-destructive" : "sr-only"
        }
      >
        {state === "error"
          ? "کپی نشد. نشانی را از نوار آدرس مرورگر بردارید."
          : state === "copied"
            ? "نشانی صفحه کپی شد."
            : ""}
      </span>
    </div>
  );
}
