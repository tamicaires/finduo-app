import { create } from 'zustand'

interface DeleteAccountDialogState {
  isOpen: boolean
  accountId: string | null
  accountName: string | null
  openDialog: (accountId: string, accountName: string) => void
  closeDialog: () => void
}

export const useDeleteAccountDialogStore = create<DeleteAccountDialogState>((set) => ({
  isOpen: false,
  accountId: null,
  accountName: null,
  openDialog: (accountId, accountName) => set({ isOpen: true, accountId, accountName }),
  closeDialog: () => set({ isOpen: false, accountId: null, accountName: null }),
}))
