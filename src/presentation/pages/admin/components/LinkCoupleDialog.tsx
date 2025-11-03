import { useState, useEffect } from 'react';
import { Button } from '@presentation/components/ui/button';
import { Input } from '@presentation/components/ui/input';
import { Label } from '@presentation/components/ui/label';
import { MdClose, MdLink, MdPerson, MdSearch } from 'react-icons/md';
import { apiClient } from '@infrastructure/http/api-client';
import { API_ROUTES } from '@shared/constants/api-routes';

interface LinkCoupleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (userIdA: string, userIdB: string, reason?: string) => Promise<void>;
}

interface UserSearchResult {
  id: string;
  name: string;
  email: string;
  has_couple: boolean;
}

export function LinkCoupleDialog({ isOpen, onClose, onConfirm }: LinkCoupleDialogProps) {
  const [userAId, setUserAId] = useState('');
  const [userBId, setUserBId] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [searchA, setSearchA] = useState('');
  const [searchB, setSearchB] = useState('');
  const [usersA, setUsersA] = useState<UserSearchResult[]>([]);
  const [usersB, setUsersB] = useState<UserSearchResult[]>([]);
  const [loadingA, setLoadingA] = useState(false);
  const [loadingB, setLoadingB] = useState(false);

  if (!isOpen) return null;

  const searchUsers = async (query: string, setUsers: (users: UserSearchResult[]) => void, setLoading: (loading: boolean) => void) => {
    if (query.length < 2) {
      setUsers([]);
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.get<any>(
        `${API_ROUTES.ADMIN_LIST_USERS}?search=${encodeURIComponent(query)}&limit=5`
      );
      setUsers(response.data.users.filter((u: UserSearchResult) => !u.has_couple));
    } catch (err) {
      console.error('Error searching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      searchUsers(searchA, setUsersA, setLoadingA);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchA]);

  useEffect(() => {
    const timer = setTimeout(() => {
      searchUsers(searchB, setUsersB, setLoadingB);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchB]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!userAId || !userBId) {
      setError('Selecione ambos os usuários');
      return;
    }

    if (userAId === userBId) {
      setError('Os usuários devem ser diferentes');
      return;
    }

    setIsSubmitting(true);
    try {
      await onConfirm(userAId, userBId, reason || undefined);
      handleClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erro ao vincular casal');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setUserAId('');
    setUserBId('');
    setReason('');
    setError('');
    setSearchA('');
    setSearchB('');
    setUsersA([]);
    setUsersB([]);
    onClose();
  };

  const selectUser = (userId: string, userName: string, isUserA: boolean) => {
    if (isUserA) {
      setUserAId(userId);
      setSearchA(userName);
      setUsersA([]);
    } else {
      setUserBId(userId);
      setSearchB(userName);
      setUsersB([]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in-0"
        onClick={handleClose}
      />

      {/* Dialog */}
      <div className="relative z-50 w-full max-w-2xl bg-background border rounded-xl shadow-2xl animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-t-xl sticky top-0 z-10 bg-opacity-95 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <MdLink className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Vincular Casal</h2>
              <p className="text-sm text-muted-foreground">Conecte dois usuários como casal</p>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* User A Search */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <MdPerson className="h-4 w-4" />
              Primeiro Usuário *
            </Label>
            <div className="relative">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                value={searchA}
                onChange={(e) => setSearchA(e.target.value)}
                placeholder="Buscar por nome ou email..."
                disabled={isSubmitting}
                className="h-11 pl-10"
              />
              {loadingA && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            {usersA.length > 0 && (
              <div className="border rounded-lg divide-y max-h-48 overflow-y-auto">
                {usersA.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => selectUser(user.id, user.name, true)}
                    className="w-full p-3 hover:bg-muted/50 transition-colors text-left"
                  >
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </button>
                ))}
              </div>
            )}
            {userAId && (
              <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg flex items-center justify-between">
                <span className="text-sm text-green-700 dark:text-green-400">✓ Usuário selecionado</span>
                <button
                  type="button"
                  onClick={() => {
                    setUserAId('');
                    setSearchA('');
                  }}
                  className="text-sm text-green-700 dark:text-green-400 hover:underline"
                >
                  Limpar
                </button>
              </div>
            )}
          </div>

          {/* User B Search */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <MdPerson className="h-4 w-4" />
              Segundo Usuário *
            </Label>
            <div className="relative">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                value={searchB}
                onChange={(e) => setSearchB(e.target.value)}
                placeholder="Buscar por nome ou email..."
                disabled={isSubmitting}
                className="h-11 pl-10"
              />
              {loadingB && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            {usersB.length > 0 && (
              <div className="border rounded-lg divide-y max-h-48 overflow-y-auto">
                {usersB.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => selectUser(user.id, user.name, false)}
                    className="w-full p-3 hover:bg-muted/50 transition-colors text-left"
                    disabled={user.id === userAId}
                  >
                    <p className={`font-medium ${user.id === userAId ? 'opacity-50' : ''}`}>
                      {user.name}
                    </p>
                    <p className={`text-sm text-muted-foreground ${user.id === userAId ? 'opacity-50' : ''}`}>
                      {user.email}
                    </p>
                  </button>
                ))}
              </div>
            )}
            {userBId && (
              <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg flex items-center justify-between">
                <span className="text-sm text-green-700 dark:text-green-400">✓ Usuário selecionado</span>
                <button
                  type="button"
                  onClick={() => {
                    setUserBId('');
                    setSearchB('');
                  }}
                  className="text-sm text-green-700 dark:text-green-400 hover:underline"
                >
                  Limpar
                </button>
              </div>
            )}
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason" className="text-sm font-medium">
              Motivo (opcional)
            </Label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ex: Solicitação dos usuários para vinculação de casal"
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
            disabled={isSubmitting || !userAId || !userBId}
          >
            {isSubmitting ? 'Vinculando...' : 'Vincular Casal'}
          </Button>
        </div>
      </div>
    </div>
  );
}
