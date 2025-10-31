import { useState } from "react";
import type { FinancialModel } from "@/core/entities/Couple";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import { Button } from "@/presentation/components/ui/button";
import { MdSwapHoriz, MdInfo, MdHandshake, MdTune } from "react-icons/md";
import { cn } from "@/shared/utils";
import { FeatureItem } from "./FeatureItem";
import { ChangeFinancialModelDialog } from "./ChangeFinancialModelDialog";
import { FINANCIAL_MODEL_LABELS, FINANCIAL_MODEL_DESCRIPTIONS } from "@/shared/constants/financial-model";

interface FinancialModelSectionProps {
  currentModel: FinancialModel;
  allowPersonalAccounts: boolean;
  allowPrivateTransactions: boolean;
  onUpdateModel: (newModel: FinancialModel, reason?: string) => Promise<void>;
}

const MODEL_ICONS: Record<FinancialModel, React.ComponentType<{ className?: string }>> = {
  TRANSPARENT: MdHandshake,
  AUTONOMOUS: MdSwapHoriz,
  CUSTOM: MdTune,
};

const MODEL_COLORS: Record<FinancialModel, string> = {
  TRANSPARENT: "from-primary to-primary/80",
  AUTONOMOUS: "from-primary to-primary/80",
  CUSTOM: "from-primary to-primary/80",
};

export function FinancialModelSection({
  currentModel,
  allowPersonalAccounts,
  allowPrivateTransactions,
  onUpdateModel,
}: FinancialModelSectionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const CurrentIcon = MODEL_ICONS[currentModel];

  return (
    <>
    <Card className="overflow-hidden">
      <CardHeader className={cn("bg-gradient-to-r text-white", MODEL_COLORS[currentModel])}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <CurrentIcon className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-white">Modelo Financeiro</CardTitle>
              <CardDescription className="text-white/80">
                {FINANCIAL_MODEL_LABELS[currentModel]}
              </CardDescription>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsDialogOpen(true)}
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
          >
            <MdSwapHoriz className="h-4 w-4 mr-2" />
            Alterar
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
          <MdInfo className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            {FINANCIAL_MODEL_DESCRIPTIONS[currentModel]}
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <span>Recursos Disponíveis</span>
          </h4>
          <div className="grid gap-3">
            <FeatureItem
              label="Contas Pessoais"
              description="Cada parceiro pode ter contas individuais"
              enabled={allowPersonalAccounts}
            />
            <FeatureItem
              label="Transações Privadas"
              description="Gastos que apenas você pode visualizar"
              enabled={allowPrivateTransactions}
            />
          </div>
        </div>

        {/* Info sobre mudança de modelo */}
        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground text-center">
            Para alterar o modelo financeiro, clique no botão "Alterar" acima
          </p>
        </div>
      </CardContent>
    </Card>

    <ChangeFinancialModelDialog
      isOpen={isDialogOpen}
      currentModel={currentModel}
      onClose={() => setIsDialogOpen(false)}
      onConfirm={onUpdateModel}
    />
    </>
  );
}
