import { create } from "zustand";

interface PermanentDeleteAccountDialogState {
  isOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
}

export const usePermanentDeleteAccountDialogStore = create<PermanentDeleteAccountDialogState>((set) => ({
  isOpen: false,
  openDialog: () => set({ isOpen: true }),
  closeDialog: () => set({ isOpen: false }),
}));
