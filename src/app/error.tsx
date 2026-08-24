"use client";

import { AlertTriangle } from "lucide-react";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="panel max-w-sm w-full flex flex-col items-center gap-3 text-center py-10">
        <AlertTriangle size={28} className="text-amber-500/90" />
        <h1 className="font-display text-xl">Não foi possível carregar agora</h1>
        <p className="text-sm text-neutral-400">
          A OpenF1 ou a Jolpica podem estar limitando requisições no momento. Tente de novo em alguns segundos.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-2 rounded-full px-5 py-2 text-sm font-semibold text-black bg-[var(--f1-red)] hover:scale-105 transition-transform"
        >
          Tentar de novo
        </button>
      </div>
    </div>
  );
}
