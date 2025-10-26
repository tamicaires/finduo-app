import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from '@infrastructure/http/query-client'
import { useAuthStore } from '@application/stores/auth.store'
import { ThemeProvider } from '@presentation/components/providers/ThemeProvider'
import './index.css'
import App from './App.tsx'

// Initialize auth store from localStorage
useAuthStore.getState().initialize()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <App />
        <ReactQueryDevtools initialIsOpen={false} />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
)
