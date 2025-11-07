// Types
export * from './types';

// Individual hooks (new recommended way)
export { useAdminUsers } from './use-admin-users';
export { useCreateUser } from './use-create-user';
export { useUpdateUserEmail } from './use-update-user-email';
export { useLinkCouple } from './use-link-couple';
export { useUnlinkCouple } from './use-unlink-couple';
export { useAssignPlan } from './use-assign-plan';
export { useAdminCouples } from './use-admin-couples';

// Legacy hook (backwards compatibility) - combines all hooks
export function useAdmin() {
  const adminUsers = useAdminUsers();
  const createUser = useCreateUser();
  const updateUserEmail = useUpdateUserEmail();
  const linkCouple = useLinkCouple();
  const unlinkCouple = useUnlinkCouple();
  const assignPlan = useAssignPlan();

  return {
    // Users query
    ...adminUsers,

    // Mutations
    createUser: createUser.createUser,
    updateEmail: updateUserEmail.updateEmail,
    linkCouple: linkCouple.linkCouple,
    unlinkCouple: unlinkCouple.unlinkCouple,
    assignPlan: assignPlan.assignPlan,

    // Loading states
    isCreatingUser: createUser.isCreatingUser,
    isUpdatingEmail: updateUserEmail.isUpdatingEmail,
    isLinkingCouple: linkCouple.isLinkingCouple,
    isUnlinkingCouple: unlinkCouple.isUnlinkingCouple,
    isAssigningPlan: assignPlan.isAssigningPlan,
  };
}
