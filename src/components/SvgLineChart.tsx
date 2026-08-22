"use client";

import { useState } from "react";

export interface ChartPoint {
  x: number;
  y: number;
  label: string;
}

export default function SvgLineChart({
  points,
  color,
  invertY = false,
  yLabelTop,
  yLabelBottom,
  gradientId,
}: {
  points: ChartPoint[];
  color: string;
  invertY?: boolean;
  yLabelTop?: string;
  yLabelBottom?: string;
  gradientId?: string;
}) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  if (points.length < 2) {
    return <p className="text-sm text-neutral-500 text-center py-10">Dados insuficientes ainda.</p>;
  }

  const width = 640;
  const height = 240;
  const padding = 36;
  const baseline = height - padding;
  const id = gradientId ?? "chart-fill";

  const ys = points.map((p) => p.y);
  const min = Math.min(...ys);
  const max = Math.max(...ys);
  const range = max - min || 1;

  const plotted = points.map((p, i) => {
    const x = padding + (i / (points.length - 1)) * (width - padding * 2);
    const norm = (p.y - min) / range;
    const y = invertY ? padding + norm * (height - padding * 2) : baseline - norm * (height - padding * 2);
    return { x, y, label: p.label };
  });

  // Straight segments between the real data points — a smoothed curve looks nicer but
  // pulls the line away from the points it's supposed to represent, so the dots stop
  // lining up with it. This keeps every dot exactly on the line.
  const linePath = plotted.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L${plotted[plotted.length - 1].x.toFixed(1)},${baseline} L${plotted[0].x.toFixed(1)},${baseline} Z`;

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = ((e.clientX - rect.left) / rect.width) * width;
    const clamped = Math.min(Math.max(relX, padding), width - padding);
    const idx = Math.round(((clamped - padding) / (width - padding * 2)) * (plotted.length - 1));
    setHoverIndex(Math.min(Math.max(idx, 0), plotted.length - 1));
  }

  const hovered = hoverIndex !== null ? plotted[hoverIndex] : null;

  return (
    <div className="relative" onMouseMove={handleMove} onMouseLeave={() => setHoverIndex(null)}>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>

        <line x1={padding} y1={baseline} x2={width - padding} y2={baseline} stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
        <line x1={padding} y1={padding} x2={padding} y2={baseline} stroke="rgba(255,255,255,0.08)" strokeWidth={1} />

        <path d={areaPath} fill={`url(#${id})`} stroke="none" />
        <path d={linePath} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

        {hovered && (
          <line x1={hovered.x} x2={hovered.x} y1={padding} y2={baseline} stroke="rgba(255,255,255,0.25)" strokeDasharray="4 4" />
        )}

        {plotted.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={hoverIndex === i ? 4.5 : 2.5} fill={color} stroke={hoverIndex === i ? "#fff" : "none"} strokeWidth={1.5} />
        ))}

        <text x={padding} y={16} fontSize={11} fill="#8a8a92" fontFamily="var(--font-mono)">
          {yLabelTop ?? max.toFixed(2)}
        </text>
        <text x={padding} y={height - 8} fontSize={11} fill="#8a8a92" fontFamily="var(--font-mono)">
          {yLabelBottom ?? min.toFixed(2)}
        </text>
      </svg>

      {hovered && (
        <div
          className="absolute pointer-events-none px-2.5 py-1.5 rounded-md bg-neutral-900 border border-white/10 text-xs font-mono whitespace-nowrap shadow-lg z-10"
          style={{
            left: `${(hovered.x / width) * 100}%`,
            top: `${(hovered.y / height) * 100}%`,
            transform: "translate(-50%, -130%)",
          }}
        >
          {hovered.label}
        </div>
      )}
    </div>
  );
}
