import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const toneClass = {
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  error: "bg-error/10 text-error",
  info: "bg-mint/10 text-mint",
  neutral: "bg-surface text-secondary"
};

export function Badge({
  className,
  tone = "neutral",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: keyof typeof toneClass }) {
  return (
    <span
      className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold", toneClass[tone], className)}
      {...props}
    />
  );
}
