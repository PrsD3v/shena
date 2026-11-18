"use client";

import { Radio } from "@base-ui/react/radio";
import { RadioGroup } from "@base-ui/react/radio-group";
import { cn } from "cn";

type SegmentedControlItem = {
  value: string;
  label: string;
};

type SegmentedControlProps = {
  items: readonly SegmentedControlItem[];
  value: string;
  onValueChange: (value: string) => void;
  "aria-label": string;
  className?: string;
};

/**
 * Single-select segmented control with radio semantics, so arrow keys move and
 * select the same way a native radio group does.
 */
function SegmentedControl({
  items,
  value,
  onValueChange,
  "aria-label": ariaLabel,
  className,
}: SegmentedControlProps) {
  return (
    <RadioGroup
      aria-label={ariaLabel}
      value={value}
      onValueChange={(nextValue) => {
        if (typeof nextValue === "string") {
          onValueChange(nextValue);
        }
      }}
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-secondary p-1",
        className
      )}
    >
      {items.map((item) => (
        <Radio.Root
          key={item.value}
          value={item.value}
          className="cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors duration-150 outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 aria-checked:bg-card aria-checked:text-brand-navy aria-checked:shadow-sm motion-reduce:transition-none"
        >
          {item.label}
        </Radio.Root>
      ))}
    </RadioGroup>
  );
}

export { SegmentedControl };
export type { SegmentedControlItem };
