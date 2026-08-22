"use client";

import { useRef, useState } from "react";
import { Play, Square, Radio as RadioIcon } from "lucide-react";
import type { TeamRadio } from "@/lib/types";
import { formatClock } from "@/lib/format";
import EmptyState from "@/components/EmptyState";

export default function RadioList({
  radios,
  teamColour,
  failed,
}: {
  radios: TeamRadio[];
  teamColour: string;
  failed?: boolean;
}) {
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([]);
  const [playingAll, setPlayingAll] = useState(false);

  if (radios.length === 0) {
    return (
      <EmptyState failed={failed} message="Nenhum rádio disponível para esta sessão ainda." icon={RadioIcon} />
    );
  }

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
    if (next < radios.length) {
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
    <div className="flex flex-col gap-4">
      <button
        type="button"
        onClick={() => (playingAll ? stopSequence() : playSequenceFrom(0))}
        className="self-start flex items-center gap-2 rounded-full pl-3 pr-4 py-2 text-sm font-semibold text-black transition-transform hover:scale-105"
        style={{ backgroundColor: `#${teamColour}` }}
      >
        {playingAll ? <Square size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
        {playingAll ? "Parar sequência" : "Tocar todos em sequência"}
      </button>

      <ul className="flex flex-col gap-3">
        {radios.map((radio, i) => (
          <li
            key={i}
            className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 bg-black/25 border border-white/5 rounded-lg p-3.5 overflow-hidden"
          >
            <span className="text-xs text-neutral-400 sm:w-16 shrink-0 font-mono">{formatClock(radio.date)}</span>
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
        ))}
      </ul>
    </div>
  );
}
