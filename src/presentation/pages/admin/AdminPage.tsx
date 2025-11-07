import { useState } from 'react';
import {
  useAdminUsers,
  useCreateUser,
  useUpdateUserEmail,
  useLinkCouple,
  useUnlinkCouple
} from '@application/hooks/admin';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@presentation/components/ui/card';
import { Button } from '@presentation/components/ui/button';
import { Input } from '@presentation/components/ui/input';
import { Badge } from '@presentation/components/ui/badge';
import {
  MdPerson,
  MdEmail,
  MdSearch,
  MdLink,
  MdLinkOff,
  MdEdit,
  MdSupervisorAccount,
  MdAdd
} from 'react-icons/md';
import { CreateUserDialog } from './components/CreateUserDialog';
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

export function AdminPage() {
  // Individual hooks for better performance
  const { users, totalPages, page, search, isLoading, setPage, setSearch } = useAdminUsers();
  const { createUser } = useCreateUser();
  const { updateEmail } = useUpdateUserEmail();
  const { linkCouple } = useLinkCouple();
  const { unlinkCouple } = useUnlinkCouple();

  // Dialog states
  const [createUserDialog, setCreateUserDialog] = useState(false);
  const [updateEmailDialog, setUpdateEmailDialog] = useState<{ open: boolean; user: User | null }>({
    open: false,
    user: null,
  });
  const [linkCoupleDialog, setLinkCoupleDialog] = useState(false);
  const [unlinkCoupleDialog, setUnlinkCoupleDialog] = useState<{
    open: boolean;
    coupleId: string;
    userNames: string;
  }>({ open: false, coupleId: '', userNames: '' });

  const handleSearch = () => {
    setPage(1);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
          <div className="flex items-center gap-3">
            <MdSupervisorAccount className="h-8 w-8" />
            <div>
              <CardTitle className="text-2xl">Painel de Administração</CardTitle>
              <CardDescription className="text-primary-foreground/80">
                Gerenciar usuários, casais e configurações do sistema
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {/* Search and Actions */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Buscar por nome ou email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleSearch} variant="secondary">
                <MdSearch className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => setCreateUserDialog(true)}
              >
                <MdAdd className="h-5 w-5 mr-2" />
                Criar Usuário
              </Button>
              <Button
                onClick={() => setLinkCoupleDialog(true)}
                variant="secondary"
              >
                <MdLink className="h-5 w-5 mr-2" />
                Vincular Casal
              </Button>
            </div>
          </div>

          {/* Users List */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Carregando usuários...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <MdPerson className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum usuário encontrado</p>
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <Card key={user.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="p-3 bg-primary/10 rounded-full">
                          <MdPerson className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg truncate">{user.name}</h3>
                            {user.role === 'ADMIN' && (
                              <Badge variant="destructive">Admin</Badge>
                            )}
                            {user.has_couple && (
                              <Badge variant="secondary">Em Casal</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MdEmail className="h-4 w-4" />
                            <span className="truncate">{user.email}</span>
                          </div>
                          {user.partner_name && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                              <MdLink className="h-4 w-4" />
                              <span>Parceiro(a): {user.partner_name}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setUpdateEmailDialog({ open: true, user })
                          }
                        >
                          <MdEdit className="h-4 w-4" />
                        </Button>

                        {user.has_couple && user.couple_id && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() =>
                              setUnlinkCoupleDialog({
                                open: true,
                                coupleId: user.couple_id!,
                                userNames: `${user.name} e ${user.partner_name}`,
                              })
                            }
                          >
                            <MdLinkOff className="h-4 w-4" />
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
            <div className="flex justify-center items-center gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
              >
                Anterior
              </Button>
              <span className="text-sm text-muted-foreground">
                Página {page} de {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
              >
                Próxima
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <CreateUserDialog
        isOpen={createUserDialog}
        onClose={() => setCreateUserDialog(false)}
        onConfirm={createUser}
      />

      {updateEmailDialog.user && (
        <UpdateEmailDialog
          isOpen={updateEmailDialog.open}
          userId={updateEmailDialog.user.id}
          currentEmail={updateEmailDialog.user.email}
          userName={updateEmailDialog.user.name}
          onClose={() => setUpdateEmailDialog({ open: false, user: null })}
          onConfirm={async (newEmail, reason) => {
            await updateEmail({
              userId: updateEmailDialog.user!.id,
              newEmail,
              reason,
            });
            setUpdateEmailDialog({ open: false, user: null });
          }}
        />
      )}

      <LinkCoupleDialog
        isOpen={linkCoupleDialog}
        onClose={() => setLinkCoupleDialog(false)}
        onConfirm={async (userIdA, userIdB, reason) => {
          await linkCouple({ user_id_a: userIdA, user_id_b: userIdB, reason });
          setLinkCoupleDialog(false);
        }}
      />

      <UnlinkCoupleDialog
        isOpen={unlinkCoupleDialog.open}
        coupleId={unlinkCoupleDialog.coupleId}
        userNames={unlinkCoupleDialog.userNames}
        onClose={() =>
          setUnlinkCoupleDialog({ open: false, coupleId: '', userNames: '' })
        }
        onConfirm={async (reason) => {
          await unlinkCouple({ coupleId: unlinkCoupleDialog.coupleId, reason });
          setUnlinkCoupleDialog({ open: false, coupleId: '', userNames: '' });
        }}
      />
    </div>
  );
}
