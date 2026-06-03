import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy text-mint">
        <Sparkles className="h-5 w-5" aria-hidden="true" />
      </div>
      {!compact && (
        <div>
          <p className="text-lg font-extrabold leading-none text-navy">Settlie AI</p>
          <p className="text-xs font-medium text-muted">Recovery automation</p>
        </div>
      )}
    </div>
  );
}
