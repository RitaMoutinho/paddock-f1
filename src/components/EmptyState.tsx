import { AlertTriangle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export default function EmptyState({
  failed,
  message,
  icon: Icon,
}: {
  failed?: boolean;
  message: string;
  icon?: LucideIcon;
}) {
  if (failed) {
    return (
      <div className="flex flex-col items-center gap-2 py-8 text-center text-amber-500/90">
        <AlertTriangle size={20} className="opacity-80" />
        <p className="text-sm">Não foi possível carregar agora.</p>
        <p className="text-xs text-amber-500/60">A OpenF1 pode estar limitando requisições — recarregue a página.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2 py-8 text-center text-neutral-500">
      {Icon && <Icon size={20} className="opacity-40" />}
      <p className="text-sm">{message}</p>
    </div>
  );
}
