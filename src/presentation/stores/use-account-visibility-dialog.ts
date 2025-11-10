import { create } from "zustand";

interface AccountVisibilityDialogState {
  isOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
}

export const useAccountVisibilityDialogStore = create<AccountVisibilityDialogState>((set) => ({
  isOpen: false,
  openDialog: () => set({ isOpen: true }),
  closeDialog: () => set({ isOpen: false }),
}));
