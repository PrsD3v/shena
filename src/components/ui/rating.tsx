import { StarIcon } from "lucide-react";
import { cn } from "cn";
import { formatNumber, formatRating } from "@/lib/format";

const STARS = [1, 2, 3, 4, 5];

type RatingProps = {
  value: number;
  count?: number;
  className?: string;
};

/** Displays a 1 to 5 star rating with its Persian value and optional count. */
function Rating({ value, count, className }: RatingProps) {
  const filledStars = Math.round(value);
  const countLabel = count === undefined ? "" : `، ${formatNumber(count)} نظر`;

  return (
    <div
      role="img"
      aria-label={`امتیاز ${formatRating(value)} از ۵${countLabel}`}
      className={cn("flex items-center gap-2", className)}
    >
      <span aria-hidden="true" className="flex items-center gap-0.5">
        {STARS.map((star) => (
          <StarIcon
            key={star}
            className={cn(
              "size-4",
              star <= filledStars
                ? "fill-warning text-warning"
                : "text-border"
            )}
          />
        ))}
      </span>
      <span className="text-sm font-medium text-foreground">
        {formatRating(value)}
      </span>
      {count !== undefined && (
        <span className="text-sm text-muted-foreground">
          ({formatNumber(count)} نظر)
        </span>
      )}
    </div>
  );
}

export { Rating };
