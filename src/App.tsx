import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from '@presentation/routes'
import { Toaster } from '@presentation/components/ui/sonner'
import { useAuthStore } from '@application/stores/auth.store'

export default function App() {
  const initialize = useAuthStore((state) => state.initialize)

  // Inicializa o estado de autenticação ao carregar o app
  useEffect(() => {
    initialize()
  }, [initialize])

  return (
    <>
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" />
    </>
  )
}
