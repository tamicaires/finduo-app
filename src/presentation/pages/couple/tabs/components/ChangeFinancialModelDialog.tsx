import { useState } from "react";
import type { FinancialModel } from "@/core/entities/Couple";
import { Button } from "@/presentation/components/ui/button";
import { MdClose, MdHandshake, MdSwapHoriz, MdTune } from "react-icons/md";
import { cn } from "@/shared/utils";
import { FINANCIAL_MODEL_LABELS, FINANCIAL_MODEL_DESCRIPTIONS } from "@/shared/constants/financial-model";

interface ChangeFinancialModelDialogProps {
  isOpen: boolean;
  currentModel: FinancialModel;
  onClose: () => void;
  onConfirm: (newModel: FinancialModel, reason?: string) => Promise<void>;
}

const MODEL_ICONS: Record<FinancialModel, React.ComponentType<{ className?: string }>> = {
  TRANSPARENT: MdHandshake,
  AUTONOMOUS: MdSwapHoriz,
  CUSTOM: MdTune,
};

const MODEL_COLORS: Record<FinancialModel, string> = {
  TRANSPARENT: "border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20",
  AUTONOMOUS: "border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-950/20",
  CUSTOM: "border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/20",
};

export function ChangeFinancialModelDialog({
  isOpen,
  currentModel,
  onClose,
  onConfirm,
}: ChangeFinancialModelDialogProps) {
  const [selectedModel, setSelectedModel] = useState<FinancialModel>(currentModel);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm(selectedModel, reason);
      onClose();
    } catch (error) {
      console.error("Erro ao alterar modelo financeiro:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const models: FinancialModel[] = ["TRANSPARENT", "AUTONOMOUS", "CUSTOM"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/80 animate-in fade-in-0"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative z-50 w-full max-w-2xl bg-background border rounded-lg shadow-lg animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-lg font-semibold">Alterar Modelo Financeiro</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Escolha o modelo que melhor se adapta ao relacionamento de vocês
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <MdClose className="h-5 w-5" />
            <span className="sr-only">Fechar</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Model Options */}
          <div className="space-y-3">
            {models.map((model) => {
              const Icon = MODEL_ICONS[model];
              const isSelected = selectedModel === model;
              const isCurrent = currentModel === model;

              return (
                <button
                  key={model}
                  onClick={() => setSelectedModel(model)}
                  className={cn(
                    "w-full text-left p-4 rounded-lg border-2 transition-all",
                    isSelected
                      ? MODEL_COLORS[model] + " border-2"
                      : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700",
                    "focus:outline-none focus:ring-2 focus:ring-primary"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "p-2 rounded-lg",
                      isSelected ? "bg-primary/10" : "bg-muted"
                    )}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">
                          {FINANCIAL_MODEL_LABELS[model]}
                        </span>
                        {isCurrent && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                            Atual
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {FINANCIAL_MODEL_DESCRIPTIONS[model]}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Reason (optional) */}
          <div className="space-y-2">
            <label htmlFor="reason" className="text-sm font-medium">
              Motivo da mudança (opcional)
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ex: Queremos mais autonomia nas nossas finanças pessoais..."
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
              rows={3}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isSubmitting || selectedModel === currentModel}
          >
            {isSubmitting ? "Salvando..." : "Confirmar Mudança"}
          </Button>
        </div>
      </div>
    </div>
  );
}
