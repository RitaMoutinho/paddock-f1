import type { Stint } from "@/lib/types";
import EmptyState from "@/components/EmptyState";

const COMPOUND_COLOURS: Record<string, string> = {
  SOFT: "#e10600",
  MEDIUM: "#f5c518",
  HARD: "#e6e6e6",
  INTERMEDIATE: "#43b02a",
  WET: "#0067ad",
};

export default function TireStints({ stints, failed }: { stints: Stint[]; failed?: boolean }) {
  if (stints.length === 0) {
    return <EmptyState failed={failed} message="Sem dados de pneus ainda." />;
  }

  const totalLaps = Math.max(...stints.map((s) => s.lap_end));

  return (
    <div className="flex flex-col gap-2">
      <div className="flex w-full h-6 rounded overflow-hidden border border-neutral-800">
        {stints.map((s, i) => {
          const widthPct = ((s.lap_end - s.lap_start + 1) / totalLaps) * 100;
          return (
            <div
              key={i}
              style={{ width: `${widthPct}%`, backgroundColor: COMPOUND_COLOURS[s.compound] ?? "#888" }}
              title={`${s.compound} · voltas ${s.lap_start}-${s.lap_end}`}
            />
          );
        })}
      </div>
      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-neutral-400">
        {stints.map((s, i) => (
          <li key={i} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{ backgroundColor: COMPOUND_COLOURS[s.compound] ?? "#888" }}
            />
            {s.compound} · voltas {s.lap_start}–{s.lap_end} ({s.tyre_age_at_start} voltas de uso ao entrar)
          </li>
        ))}
      </ul>
    </div>
  );
}
