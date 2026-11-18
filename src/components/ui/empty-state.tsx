import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "cn";

type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

/** Centered empty state with an optional icon and action slot. */
function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-card px-6 py-10 text-center",
        className
      )}
    >
      {Icon && (
        <span className="flex size-12 items-center justify-center rounded-full bg-brand-water text-brand-blue">
          <Icon className="size-6" aria-hidden="true" />
        </span>
      )}
      <div className="space-y-1">
        <p className="text-base font-semibold text-brand-navy">{title}</p>
        {description && (
          <p className="max-w-sm text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

export { EmptyState };
