# Admin Hooks

Hooks modulares para funcionalidades administrativas.

## Estrutura

```
admin/
├── types.ts                    # TypeScript interfaces
├── use-admin-users.ts          # Query de usuários com paginação
├── use-create-user.ts          # Mutation para criar usuário
├── use-update-user-email.ts    # Mutation para atualizar email
├── use-link-couple.ts          # Mutation para vincular casal
├── use-unlink-couple.ts        # Mutation para desvincular casal
├── use-assign-plan.ts          # Mutation para atribuir plano
├── use-admin-couples.ts        # Query de casais
└── index.ts                    # Exports e hook legado
```

## Uso Recomendado (Novo)

Use hooks individuais para melhor separação de responsabilidades:

```tsx
import {
  useAdminUsers,
  useCreateUser,
  useAssignPlan
} from '@application/hooks/admin'

function AdminPage() {
  // Query
  const { users, isLoading, page, setPage } = useAdminUsers()

  // Mutations individuais
  const { createUser, isCreatingUser } = useCreateUser()
  const { assignPlan, isAssigningPlan } = useAssignPlan()

  // ...
}
```

## Uso Legado (Backwards Compatible)

O hook `useAdmin()` ainda funciona para compatibilidade:

```tsx
import { useAdmin } from '@application/hooks/use-admin'

function AdminPage() {
  const {
    users,
    isLoading,
    createUser,
    updateEmail,
    linkCouple,
    unlinkCouple,
    assignPlan,
    // ...
  } = useAdmin()
}
```

## Benefícios da Nova Estrutura

1. **Responsabilidade Única**: Cada hook faz apenas uma coisa
2. **Tree Shaking**: Importa apenas o que precisa
3. **Testabilidade**: Hooks menores são mais fáceis de testar
4. **Manutenibilidade**: Código organizado e fácil de encontrar
5. **Performance**: Menos re-renders desnecessários
