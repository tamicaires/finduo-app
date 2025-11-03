import { useState } from 'react';
import { Button } from '@presentation/components/ui/button';
import { Label } from '@presentation/components/ui/label';
import { MdClose, MdLinkOff, MdWarning, MdDelete } from 'react-icons/md';

interface UnlinkCoupleDialogProps {
  isOpen: boolean;
  coupleId: string;
  userNames: string;
  onClose: () => void;
  onConfirm: (reason?: string) => Promise<void>;
}

export function UnlinkCoupleDialog({
  isOpen,
  coupleId,
  userNames,
  onClose,
  onConfirm,
}: UnlinkCoupleDialogProps) {
  const [reason, setReason] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const CONFIRM_PHRASE = 'DESVINCULAR';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (confirmText !== CONFIRM_PHRASE) {
      setError(`Digite "${CONFIRM_PHRASE}" para confirmar`);
      return;
    }

    setIsSubmitting(true);
    try {
      await onConfirm(reason || undefined);
      handleClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erro ao desvincular casal');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setReason('');
    setConfirmText('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in-0"
        onClick={handleClose}
      />

      {/* Dialog */}
      <div className="relative z-50 w-full max-w-3xl bg-background border-2 border-red-200 dark:border-red-900 rounded-xl shadow-2xl animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-red-200 dark:border-red-900 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <MdLinkOff className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-red-900 dark:text-red-100">Desvincular Casal</h2>
              <p className="text-sm text-red-700 dark:text-red-300">Ação irreversível</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-2 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
            disabled={isSubmitting}
          >
            <MdClose className="h-5 w-5 text-red-600 dark:text-red-400" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Warning */}
          <div className="p-4 bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-900 rounded-lg space-y-3">
            <div className="flex items-start gap-3">
              <MdWarning className="h-6 w-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="font-semibold text-red-900 dark:text-red-100">
                  Esta ação não pode ser desfeita!
                </p>
                <p className="text-sm text-red-700 dark:text-red-300">
                  Ao desvincular este casal, <strong>TODOS os dados relacionados</strong> serão permanentemente deletados:
                </p>
              </div>
            </div>
            <ul className="space-y-1.5 ml-9 text-sm text-red-700 dark:text-red-300">
              <li className="flex items-center gap-2">
                <MdDelete className="h-4 w-4" />
                Todas as contas bancárias
              </li>
              <li className="flex items-center gap-2">
                <MdDelete className="h-4 w-4" />
                Todas as transações
              </li>
              <li className="flex items-center gap-2">
                <MdDelete className="h-4 w-4" />
                Todas as categorias personalizadas
              </li>
              <li className="flex items-center gap-2">
                <MdDelete className="h-4 w-4" />
                Configurações do casal
              </li>
              <li className="flex items-center gap-2">
                <MdDelete className="h-4 w-4" />
                Assinatura (se houver)
              </li>
            </ul>
          </div>

          {/* Couple Info */}
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <p className="text-sm font-medium">Casal a ser desvinculado:</p>
            <p className="font-semibold text-lg">{userNames}</p>
            <p className="text-xs text-muted-foreground font-mono">ID: {coupleId}</p>
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason" className="text-sm font-medium">
              Motivo da desvinculação (opcional)
            </Label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ex: Solicitação dos usuários, fim do relacionamento, duplicação de conta..."
              disabled={isSubmitting}
              className="flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:cursor-not-allowed disabled:opacity-50"
              rows={3}
            />
          </div>

          {/* Confirmation */}
          <div className="space-y-2">
            <Label htmlFor="confirm" className="text-sm font-medium">
              Digite "<span className="font-bold text-red-600">{CONFIRM_PHRASE}</span>" para confirmar *
            </Label>
            <input
              id="confirm"
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
              placeholder={CONFIRM_PHRASE}
              disabled={isSubmitting}
              className="flex h-11 w-full rounded-lg border-2 border-red-300 dark:border-red-800 bg-background px-3 py-2 text-sm font-semibold uppercase placeholder:text-muted-foreground placeholder:normal-case placeholder:font-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:cursor-not-allowed disabled:opacity-50"
              autoComplete="off"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 pt-0 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || confirmText !== CONFIRM_PHRASE}
            variant="destructive"
            className="bg-red-600 hover:bg-red-700"
          >
            {isSubmitting ? 'Desvinculando...' : 'Confirmar Desvinculação'}
          </Button>
        </div>
      </div>
    </div>
  );
}
