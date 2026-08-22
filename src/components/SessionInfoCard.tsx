import { Route, Thermometer, Flame, Droplets, Wind, CloudRain, AlertTriangle } from "lucide-react";
import type { Weather } from "@/lib/types";

export default function SessionInfoCard({
  weather,
  lapCount,
  teamColour,
  failed,
}: {
  weather: Weather | null;
  lapCount: number;
  teamColour: string;
  failed?: boolean;
}) {
  const color = `#${teamColour}`;

  const items = [
    { icon: Route, label: "Voltas na sessão", value: lapCount > 0 ? String(lapCount) : "—" },
    { icon: Thermometer, label: "Temp. do ar", value: weather ? `${weather.air_temperature.toFixed(1)}°C` : "—" },
    { icon: Flame, label: "Temp. da pista", value: weather ? `${weather.track_temperature.toFixed(1)}°C` : "—" },
    { icon: Droplets, label: "Umidade", value: weather ? `${weather.humidity.toFixed(0)}%` : "—" },
    { icon: Wind, label: "Vento", value: weather ? `${weather.wind_speed.toFixed(1)} m/s` : "—" },
    { icon: CloudRain, label: "Chuva", value: weather ? (weather.rainfall > 0 ? "Sim" : "Não") : "—" },
  ];

  return (
    <section className="panel">
      <h2 className="font-display text-lg mb-1 text-center">Pista e condições</h2>
      {failed && (
        <p className="flex items-center justify-center gap-1.5 text-xs text-amber-500/80 mb-3">
          <AlertTriangle size={12} />
          Alguns dados não carregaram — recarregue a página.
        </p>
      )}
      <div className="grid grid-cols-2 gap-4 mt-3">
        {items.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-start gap-2.5">
            <Icon size={18} className="mt-0.5 shrink-0" style={{ color }} />
            <div>
              <p className="font-mono font-semibold tabular-nums">{value}</p>
              <p className="text-[11px] text-neutral-400 uppercase tracking-wide mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
