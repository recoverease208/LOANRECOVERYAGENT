import { Wifi } from "lucide-react";

export function RealtimeStatus() {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-mint/10 px-3 py-1 text-xs font-bold text-mint">
      <Wifi className="h-3.5 w-3.5" />
      Realtime ready
    </span>
  );
}
