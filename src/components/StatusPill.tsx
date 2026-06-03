import { Badge } from "@/components/ui/badge";

export function StatusPill({ value }: { value: string }) {
  const normalized = value.toLowerCase();
  const tone =
    normalized.includes("paid") || normalized.includes("active") || normalized.includes("sent")
      ? "success"
      : normalized.includes("overdue") || normalized.includes("pending") || normalized.includes("medium")
        ? "warning"
        : normalized.includes("critical") || normalized.includes("failed") || normalized.includes("high")
          ? "error"
          : "info";

  return <Badge tone={tone}>{value.replaceAll("_", " ")}</Badge>;
}
