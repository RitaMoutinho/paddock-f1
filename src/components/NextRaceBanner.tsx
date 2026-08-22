import { CalendarClock } from "lucide-react";
import type { NextRace } from "@/lib/types";
import EmptyState from "@/components/EmptyState";

function formatSessionTime(date: string, time: string): string {
  const dt = new Date(`${date}T${time}`);
  return dt.toLocaleString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function NextRaceBanner({ race, failed }: { race: NextRace | null; failed?: boolean }) {
  if (!race) {
    return (
      <section className="panel relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-1 bg-[var(--f1-red)]" />
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--f1-red)] mb-4">Próximo GP</p>
        <EmptyState failed={failed} message="Nenhuma corrida agendada no momento." />
      </section>
    );
  }

  const sessions = [
    { label: "Treino 1", session: race.FirstPractice },
    { label: "Sprint", session: race.Sprint },
    { label: "Classificação Sprint", session: race.SprintQualifying },
    { label: "Classificação", session: race.Qualifying },
    { label: "Corrida", session: { date: race.date, time: race.time } },
  ].filter((s) => s.session);

  return (
    <section className="panel relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-1 bg-[var(--f1-red)]" />
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--f1-red)] flex items-center gap-2">
            <CalendarClock size={14} />
            Próximo GP · Rodada {race.round}
          </p>
          <h2 className="font-display text-3xl sm:text-5xl mt-2">{race.raceName}</h2>
          <p className="text-neutral-400 mt-1">
            {race.Circuit.circuitName} · {race.Circuit.Location.locality}, {race.Circuit.Location.country}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {sessions.map(({ label, session }) => (
            <div key={label} className="bg-black/30 rounded-lg px-3 py-2 text-center min-w-[7rem]">
              <p className="text-[10px] text-neutral-400 uppercase tracking-wide">{label}</p>
              <p className="font-mono text-sm tabular-nums mt-0.5">{formatSessionTime(session!.date, session!.time)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
