import { useState, useEffect } from 'react';
import { apiClient } from '@infrastructure/http/api-client';
import { API_ROUTES } from '@shared/constants/api-routes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@presentation/components/ui/card';
import { Button } from '@presentation/components/ui/button';
import { Input } from '@presentation/components/ui/input';
import { Badge } from '@presentation/components/ui/badge';
import { toast } from 'sonner';
import {
  MdPerson,
  MdEmail,
  MdSearch,
  MdLink,
  MdLinkOff,
  MdEdit,
  MdSupervisorAccount
} from 'react-icons/md';
import { UpdateEmailDialog } from './components/UpdateEmailDialog';
import { LinkCoupleDialog } from './components/LinkCoupleDialog';
import { UnlinkCoupleDialog } from './components/UnlinkCoupleDialog';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  created_at: string;
  has_couple: boolean;
  couple_id?: string;
  partner_name?: string;
}

interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Dialog states
  const [updateEmailDialog, setUpdateEmailDialog] = useState<{ open: boolean; user: User | null }>({ open: false, user: null });
  const [linkCoupleDialog, setLinkCoupleDialog] = useState(false);
  const [unlinkCoupleDialog, setUnlinkCoupleDialog] = useState<{ open: boolean; coupleId: string; userNames: string }>({ open: false, coupleId: '', userNames: '' });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', '20');
      if (search) params.append('search', search);

      const response = await apiClient.get<UsersResponse>(
        `${API_ROUTES.ADMIN_LIST_USERS}?${params.toString()}`
      );

      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleSearch = () => {
    setPage(1);
    fetchUsers();
  };

  const handleUpdateEmail = async (newEmail: string, reason?: string) => {
    if (!updateEmailDialog.user) return;

    try {
      await apiClient.patch(API_ROUTES.ADMIN_UPDATE_USER_EMAIL(updateEmailDialog.user.id), {
        newEmail,
        reason,
      });
      toast.success('Email atualizado com sucesso!');
      fetchUsers();
    } catch (error: any) {
      throw error;
    }
  };

  const handleLinkCouple = async (userIdA: string, userIdB: string, reason?: string) => {
    try {
      await apiClient.post(API_ROUTES.ADMIN_LINK_COUPLE, {
        user_id_a: userIdA,
        user_id_b: userIdB,
        reason,
      });
      toast.success('Casal vinculado com sucesso!');
      fetchUsers();
    } catch (error: any) {
      throw error;
    }
  };

  const handleUnlinkCouple = async (reason?: string) => {
    try {
      await apiClient.delete(API_ROUTES.ADMIN_UNLINK_COUPLE(unlinkCoupleDialog.coupleId), {
        data: { reason },
      });
      toast.success('Casal desvinculado com sucesso!');
      fetchUsers();
    } catch (error: any) {
      throw error;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-white">
          <div className="flex items-center gap-3">
            <MdSupervisorAccount className="h-8 w-8" />
            <div>
              <CardTitle>Painel de Administração</CardTitle>
              <CardDescription className="text-white/80">
                Gerenciamento de usuários e casais
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch}>
              Buscar
            </Button>
            <Button onClick={() => setLinkCoupleDialog(true)} variant="outline">
              <MdLink className="h-4 w-4 mr-2" />
              Vincular Casal
            </Button>
          </div>

          {/* Users Table */}
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Carregando...
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum usuário encontrado
            </div>
          ) : (
            <div className="space-y-3">
              {users.map((user) => (
                <Card key={user.id} className="border-l-4 border-l-primary/50">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <MdPerson className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-semibold">{user.name}</p>
                            <div className="flex items-center gap-2">
                              <MdEmail className="h-4 w-4 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 items-center ml-8">
                          <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                            {user.role}
                          </Badge>
                          {user.has_couple ? (
                            <Badge variant="outline" className="bg-green-500/15 text-green-500 border-green-500/25">
                              Em casal com: {user.partner_name}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-gray-500/10">
                              Sem casal
                            </Badge>
                          )}
                        </div>

                        <p className="text-xs text-muted-foreground ml-8">
                          ID: {user.id} • Criado em: {new Date(user.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setUpdateEmailDialog({ open: true, user })}
                        >
                          <MdEdit className="h-4 w-4 mr-1" />
                          Email
                        </Button>
                        {user.has_couple && user.couple_id && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setUnlinkCoupleDialog({
                              open: true,
                              coupleId: user.couple_id!,
                              userNames: `${user.name} & ${user.partner_name}`
                            })}
                          >
                            <MdLinkOff className="h-4 w-4 mr-1" />
                            Desvincular
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Anterior
              </Button>
              <span className="flex items-center px-4 text-sm text-muted-foreground">
                Página {page} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Próxima
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <UpdateEmailDialog
        isOpen={updateEmailDialog.open}
        userId={updateEmailDialog.user?.id || ''}
        currentEmail={updateEmailDialog.user?.email || ''}
        userName={updateEmailDialog.user?.name || ''}
        onClose={() => setUpdateEmailDialog({ open: false, user: null })}
        onConfirm={handleUpdateEmail}
      />

      <LinkCoupleDialog
        isOpen={linkCoupleDialog}
        onClose={() => setLinkCoupleDialog(false)}
        onConfirm={handleLinkCouple}
      />

      <UnlinkCoupleDialog
        isOpen={unlinkCoupleDialog.open}
        coupleId={unlinkCoupleDialog.coupleId}
        userNames={unlinkCoupleDialog.userNames}
        onClose={() => setUnlinkCoupleDialog({ open: false, coupleId: '', userNames: '' })}
        onConfirm={handleUnlinkCouple}
      />
    </div>
  );
}
