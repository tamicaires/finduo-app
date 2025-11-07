import { useState } from 'react';
import { Button } from '@presentation/components/ui/button';
import { Input } from '@presentation/components/ui/input';
import { Label } from '@presentation/components/ui/label';
import { MdClose, MdEmail, MdEdit } from 'react-icons/md';

interface UpdateEmailDialogProps {
  isOpen: boolean;
  userId: string;
  currentEmail: string;
  userName: string;
  onClose: () => void;
  onConfirm: (newEmail: string, reason?: string) => Promise<void>;
}

export function UpdateEmailDialog({
  isOpen,
  userId,
  currentEmail,
  userName,
  onClose,
  onConfirm,
}: UpdateEmailDialogProps) {
  const [newEmail, setNewEmail] = useState(currentEmail);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!newEmail || !newEmail.includes('@')) {
      setError('Email inválido');
      return;
    }

    if (newEmail === currentEmail) {
      setError('O novo email deve ser diferente do atual');
      return;
    }

    setIsSubmitting(true);
    try {
      await onConfirm(newEmail, reason || undefined);
      handleClose();
    } catch {
      setError('Erro ao atualizar email');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setNewEmail(currentEmail);
    setReason('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in-0"
        onClick={handleClose}
      />

      {/* Dialog */}
      <div className="relative z-50 w-full max-w-md bg-background border rounded-xl shadow-2xl animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <MdEdit className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Alterar Email</h2>
              <p className="text-sm text-muted-foreground">{userName}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-2 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            disabled={isSubmitting}
          >
            <MdClose className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Current Email */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Email Atual</Label>
            <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
              <MdEmail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{currentEmail}</span>
            </div>
          </div>

          {/* New Email */}
          <div className="space-y-2">
            <Label htmlFor="newEmail" className="text-sm font-medium">
              Novo Email *
            </Label>
            <Input
              id="newEmail"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="novo@email.com"
              required
              disabled={isSubmitting}
              className="h-11"
            />
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason" className="text-sm font-medium">
              Motivo da alteração (opcional)
            </Label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ex: Solicitação do usuário por email incorreto no cadastro"
              disabled={isSubmitting}
              className="flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
              rows={3}
            />
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* User ID Info */}
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground">
              ID do usuário: <span className="font-mono">{userId}</span>
            </p>
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 pt-0">
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
            disabled={isSubmitting || !newEmail || newEmail === currentEmail}
          >
            {isSubmitting ? 'Salvando...' : 'Confirmar Alteração'}
          </Button>
        </div>
      </div>
    </div>
  );
}
