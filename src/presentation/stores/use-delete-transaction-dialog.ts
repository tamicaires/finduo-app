import { create } from 'zustand'

interface DeleteTransactionDialogState {
  isOpen: boolean
  transactionId: string | null
  openDialog: (transactionId: string) => void
  closeDialog: () => void
}

export const useDeleteTransactionDialogStore = create<DeleteTransactionDialogState>((set) => ({
  isOpen: false,
  transactionId: null,
  openDialog: (transactionId) => set({ isOpen: true, transactionId }),
  closeDialog: () => set({ isOpen: false, transactionId: null }),
}))
