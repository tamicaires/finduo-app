import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdClose,
  MdPayment,
  MdCalendarToday,
  MdAttachMoney,
} from "react-icons/md";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@presentation/components/ui/dialog";
import { Button } from "@presentation/components/ui/button";
import { Input } from "@presentation/components/ui/input";
import { Label } from "@presentation/components/ui/label";
import { formatCurrency } from "@shared/utils/format-currency";
import { cn } from "@shared/utils";
import { DialogWrapper } from "./DialogWrapper";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (transactionDate?: string) => void;
  title: string;
  description: string;
  amount: number;
  dueDate: string;
  isPaying?: boolean;
}

export function PaymentModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  amount,
  dueDate,
  isPaying = false,
}: PaymentModalProps) {
  const [useCustomDate, setUseCustomDate] = useState(false);
  const [transactionDate, setTransactionDate] = useState("");

  const handleConfirm = () => {
    if (useCustomDate && transactionDate) {
      onConfirm(transactionDate);
    } else {
      onConfirm();
    }
  };

  const handleClose = () => {
    if (!isPaying) {
      setUseCustomDate(false);
      setTransactionDate("");
      onClose();
    }
  };

  const today = new Date().toISOString().split("T")[0];
  const formattedDueDate = new Date(dueDate).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogWrapper icon={MdPayment}>
          <DialogTitle className="flex items-center gap-2">{title}</DialogTitle>
          <DialogDescription>Confirme os dados e prossiga com o pagamento</DialogDescription>
        </DialogWrapper>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-4 py-4"
        >
          {/* Amount Display */}
          <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-lg border border-primary/10">
            <div className="p-2 bg-primary/10 rounded-lg">
              <MdAttachMoney className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Valor a pagar</p>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(amount)}
              </p>
            </div>
          </div>

          {/* Due Date Display */}
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <MdCalendarToday className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">
                Data de vencimento
              </p>
              <p className="text-sm font-medium">{formattedDueDate}</p>
            </div>
          </div>

          {/* Custom Date Toggle */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="custom-date"
                checked={useCustomDate}
                onChange={(e) => setUseCustomDate(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                disabled={isPaying}
              />
              <Label
                htmlFor="custom-date"
                className={cn(
                  "text-sm font-medium cursor-pointer",
                  isPaying && "opacity-50 cursor-not-allowed"
                )}
              >
                Usar data personalizada
              </Label>
            </div>

            <AnimatePresence>
              {useCustomDate && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="space-y-2">
                    <Label
                      htmlFor="transaction-date"
                      className="text-xs text-muted-foreground"
                    >
                      Data da transação
                    </Label>
                    <Input
                      id="transaction-date"
                      type="date"
                      value={transactionDate}
                      onChange={(e) => setTransactionDate(e.target.value)}
                      max={today}
                      disabled={isPaying}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      Escolha a data em que o pagamento foi realizado
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Info Box */}
          <div className="p-3 bg-blue-500/10 border border-blue-500/25 rounded-lg">
            <p className="text-xs text-blue-500">
              {useCustomDate
                ? "A transação será registrada com a data que você escolher."
                : "A transação será registrada com a data de hoje."}
            </p>
          </div>
        </motion.div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isPaying}
            className="w-full sm:w-auto"
          >
            <MdClose className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isPaying || (useCustomDate && !transactionDate)}
            className="w-full sm:w-auto"
          >
            <MdPayment className="h-4 w-4 mr-2" />
            {isPaying ? "Processando..." : "Confirmar Pagamento"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
