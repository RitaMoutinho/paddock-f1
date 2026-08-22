"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Play, Square, Radio as RadioIcon } from "lucide-react";
import type { TeamRadio, Driver } from "@/lib/types";
import { formatClock } from "@/lib/format";
import CountryFlag from "@/components/CountryFlag";
import EmptyState from "@/components/EmptyState";

const MAX_SHOWN = 20;

export default function LiveRadioFeed({
  radios,
  drivers,
  sessionKey,
  failed,
}: {
  radios: TeamRadio[];
  drivers: Driver[];
  sessionKey: number;
  failed?: boolean;
}) {
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([]);
  const [playingAll, setPlayingAll] = useState(false);

  const driverByNumber = new Map(drivers.map((d) => [d.driver_number, d]));
  const sorted = [...radios].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, MAX_SHOWN);

  function playSequenceFrom(index: number) {
    const audio = audioRefs.current[index];
    if (!audio) {
      setPlayingAll(false);
      return;
    }
    setPlayingAll(true);
    audio.currentTime = 0;
    audio.play().catch(() => setPlayingAll(false));
  }

  function handleEnded(index: number) {
    if (!playingAll) return;
    const next = index + 1;
    if (next < sorted.length) {
      playSequenceFrom(next);
    } else {
      setPlayingAll(false);
    }
  }

  function stopSequence() {
    setPlayingAll(false);
    audioRefs.current.forEach((a) => a?.pause());
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--f1-red)] mb-1">Ao vivo</p>
          <h2 className="font-display text-2xl">Rádio da equipe</h2>
        </div>
      </div>

      <div className="panel">
        {sorted.length === 0 ? (
          <EmptyState failed={failed} message="Nenhum rádio disponível para esta sessão ainda." icon={RadioIcon} />
        ) : (
          <div className="flex flex-col gap-4">
            <button
              type="button"
              onClick={() => (playingAll ? stopSequence() : playSequenceFrom(0))}
              className="self-start flex items-center gap-2 rounded-full pl-3 pr-4 py-2 text-sm font-semibold text-black transition-transform hover:scale-105 bg-[var(--f1-red)]"
            >
              {playingAll ? <Square size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
              {playingAll ? "Parar sequência" : "Tocar mais recentes"}
            </button>

            <ul className="flex flex-col gap-3">
              {sorted.map((radio, i) => {
                const driver = driverByNumber.get(radio.driver_number);
                const color = driver ? `#${driver.team_colour}` : "#888";
                return (
                  <li
                    key={i}
                    className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 bg-black/25 border border-white/5 rounded-lg p-3.5 overflow-hidden"
                  >
                    <div className="flex items-center gap-2 sm:w-44 shrink-0">
                      <span className="w-1 h-6 rounded-full shrink-0" style={{ backgroundColor: color }} />
                      {driver && <CountryFlag code={driver.country_code} className="w-5 h-auto rounded-[2px] shrink-0" />}
                      {driver ? (
                        <Link
                          href={`/piloto/${driver.driver_number}?session=${sessionKey}`}
                          className="text-sm font-semibold truncate hover:underline"
                        >
                          {driver.full_name}
                        </Link>
                      ) : (
                        <span className="text-sm text-neutral-400">#{radio.driver_number}</span>
                      )}
                      <span className="text-xs text-neutral-500 font-mono ml-auto sm:ml-0 shrink-0">
                        {formatClock(radio.date)}
                      </span>
                    </div>
                    <audio
                      ref={(el) => {
                        audioRefs.current[i] = el;
                      }}
                      controls
                      preload="none"
                      src={radio.recording_url}
                      onEnded={() => handleEnded(i)}
                      className="w-full min-w-0 h-9"
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
