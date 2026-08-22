"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import type { Lap, Position } from "@/lib/types";
import SvgLineChart from "./SvgLineChart";

type Tab = "posicao" | "ritmo" | "velocidade";

export default function PerformanceCard({
  laps,
  positions,
  teamColour,
  failed,
}: {
  laps: Lap[];
  positions: Position[];
  teamColour: string;
  failed?: boolean;
}) {
  const [tab, setTab] = useState<Tab>("posicao");
  const color = `#${teamColour}`;

  const positionPoints = positions.map((p, i) => ({ x: i, y: p.position, label: `P${p.position}` }));
  const lapPoints = laps
    .filter((l) => l.lap_duration !== null && !l.is_pit_out_lap)
    .map((l) => ({ x: l.lap_number, y: l.lap_duration as number, label: `Volta ${l.lap_number}: ${l.lap_duration?.toFixed(3)}s` }));
  const speedPoints = laps
    .filter((l) => l.st_speed !== null)
    .map((l) => ({ x: l.lap_number, y: l.st_speed as number, label: `Volta ${l.lap_number}: ${l.st_speed} km/h` }));

  const tabs: { id: Tab; label: string }[] = [
    { id: "posicao", label: "Posição" },
    { id: "ritmo", label: "Ritmo" },
    { id: "velocidade", label: "Velocidade" },
  ];

  return (
    <div className="panel">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h2 className="font-display text-lg">Desempenho na corrida</h2>
        <div className="flex gap-1 bg-black/30 rounded-full p-1 border border-white/5">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide transition-all"
              style={
                tab === t.id
                  ? { backgroundColor: color, color: "#0a0a0d", boxShadow: `0 4px 12px -2px ${color}88` }
                  : { color: "#9a9aa6" }
              }
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {failed && (
        <p className="flex items-center gap-1.5 text-xs text-amber-500/80 mb-3">
          <AlertTriangle size={12} />
          Não foi possível carregar os dados de desempenho — recarregue a página.
        </p>
      )}

      {tab === "posicao" && (
        <SvgLineChart
          points={positionPoints}
          color={color}
          invertY
          yLabelTop="P1"
          yLabelBottom={`P${Math.max(...positions.map((p) => p.position), 1)}`}
          gradientId="chart-posicao"
        />
      )}
      {tab === "ritmo" && <SvgLineChart points={lapPoints} color={color} gradientId="chart-ritmo" />}
      {tab === "velocidade" && <SvgLineChart points={speedPoints} color={color} gradientId="chart-velocidade" />}
    </div>
  );
}
