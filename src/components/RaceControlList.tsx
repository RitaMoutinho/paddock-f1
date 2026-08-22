import { AlertTriangle } from "lucide-react";
import type { RaceControlMessage } from "@/lib/types";
import { formatClock } from "@/lib/format";
import EmptyState from "@/components/EmptyState";

export default function RaceControlList({
  messages,
  failed,
  color,
}: {
  messages: RaceControlMessage[];
  failed?: boolean;
  color?: string;
}) {
  return (
    <section className="panel">
      <h2 className="font-display text-lg mb-4 flex items-center gap-2">
        <AlertTriangle size={18} style={color ? { color } : undefined} />
        Direção de prova
      </h2>
      {messages.length > 0 ? (
        <ul className="flex flex-col gap-2 text-sm">
          {messages.map((m, i) => (
            <li key={i} className="bg-black/25 rounded-lg px-4 py-2.5">
              <span className="text-neutral-500 mr-2 font-mono text-xs">{formatClock(m.date)}</span>
              {m.message}
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState failed={failed} message="Nenhuma mensagem da direção de prova nesta sessão." />
      )}
    </section>
  );
}
