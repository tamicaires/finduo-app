import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  Repeat,
  Settings,
  Moon,
  Sun,
  Monitor,
  Users,
  Trophy,
  CreditCard,
  LogOut,
  User,
  Plus,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '@application/hooks/use-auth'
import { useTheme } from '@application/hooks/use-theme'
import { useHaptics } from '@presentation/hooks/use-haptics'
import { Button } from '@presentation/components/ui/button'
import { cn } from '@shared/utils'
import { Logo } from '@presentation/components/ui/logo'
import { LogoIcon } from '@presentation/components/ui/logo-icon'

const navItems = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    path: '/accounts',
    label: 'Contas',
    icon: Wallet,
  },
  {
    path: '/transactions',
    label: 'Transações',
    icon: ArrowLeftRight,
  },
  {
    path: '/recurring',
    label: 'Recorrências',
    icon: Repeat,
  },
  {
    path: '/couple',
    label: 'Casal',
    icon: Users,
  },
  {
    path: '/achievements',
    label: 'Conquistas',
    icon: Trophy,
  },
  {
    path: '/billing',
    label: 'Assinatura',
    icon: CreditCard,
  },
  {
    path: '/settings',
    label: 'Configurações',
    icon: Settings,
  },
]

export function Sidebar() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [showTransactionMenu, setShowTransactionMenu] = useState(false)
  const haptics = useHaptics()

  const ThemeIcon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor

  return (
    <>
      {/* Header - Mobile Only */}
      <header className="sticky top-0 z-50 border-b bg-card lg:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <Logo width={120} />
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9"
            >
              <ThemeIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Sidebar - Desktop (Collapsible with hover) */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-16 border-r bg-card transition-all duration-300 hover:w-64 lg:block group">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-20 items-center justify-center px-3 border-b group-hover:justify-start group-hover:px-6">
            <div className="flex items-center gap-3">
              {/* Logo icon when collapsed */}
              <div className="block group-hover:hidden">
                <LogoIcon size={40} />
              </div>
              {/* Full logo when expanded */}
              <div className="hidden group-hover:block">
                <Logo width={140} />
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  title={item.label}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="hidden truncate group-hover:inline-block">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* User Section */}
          <div className="border-t p-3 space-y-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className={cn(
                'w-full justify-center group-hover:justify-start',
                'transition-all'
              )}
              title="Alternar tema"
            >
              <ThemeIcon className="h-4 w-4 group-hover:mr-3" />
              <span className="hidden group-hover:inline">
                Modo {theme === 'light' ? 'Claro' : theme === 'dark' ? 'Escuro' : 'Sistema'}
              </span>
            </Button>

            <div className="hidden px-3 py-2 text-xs text-muted-foreground truncate border-t group-hover:block">
              {user?.name}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className={cn(
                'w-full justify-center group-hover:justify-start',
                'text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950',
                'transition-all'
              )}
              title="Sair"
            >
              <LogOut className="h-4 w-4 group-hover:mr-3" />
              <span className="hidden group-hover:inline">Sair</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Bottom Navigation - Mobile Only (Enhanced with FAB) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
        {/* Overlay quando perfil menu aberto */}
        {(isProfileMenuOpen || showTransactionMenu) && (
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => {
              setIsProfileMenuOpen(false)
              setShowTransactionMenu(false)
            }}
          />
        )}

        {/* Barra de navegação */}
        <div className="bg-card border-t pb-safe">
          <div className="relative flex items-center justify-around px-2 py-2">
            {/* Item 1: Dashboard */}
            <Link
              to="/dashboard"
              onClick={() => haptics.light()}
              className={cn(
                'flex flex-col items-center gap-1 rounded-lg px-4 py-2 transition-all min-w-[64px] active:scale-95',
                location.pathname === '/dashboard'
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )}
            >
              <LayoutDashboard className={cn('h-5 w-5', location.pathname === '/dashboard' && 'fill-primary/20')} />
              <span className="text-[10px] font-medium">Início</span>
            </Link>

            {/* Item 2: Contas */}
            <Link
              to="/accounts"
              onClick={() => haptics.light()}
              className={cn(
                'flex flex-col items-center gap-1 rounded-lg px-4 py-2 transition-all min-w-[64px] active:scale-95',
                location.pathname === '/accounts'
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )}
            >
              <Wallet className={cn('h-5 w-5', location.pathname === '/accounts' && 'fill-primary/20')} />
              <span className="text-[10px] font-medium">Contas</span>
            </Link>

            {/* FAB Central - Botão Destacado para Nova Transação */}
            <div className="relative -mt-8 flex items-center justify-center min-w-[64px]">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  haptics.medium()
                  setShowTransactionMenu(!showTransactionMenu)
                }}
                className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg shadow-primary/50 active:shadow-primary/30 transition-shadow"
              >
                <motion.div
                  animate={{ rotate: showTransactionMenu ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Plus className="h-7 w-7" strokeWidth={2.5} />
                </motion.div>
              </motion.button>

              {/* Badge de indicador */}
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
            </div>

            {/* Item 3: Transações */}
            <Link
              to="/transactions"
              onClick={() => haptics.light()}
              className={cn(
                'flex flex-col items-center gap-1 rounded-lg px-4 py-2 transition-all min-w-[64px] active:scale-95',
                location.pathname === '/transactions'
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )}
            >
              <ArrowLeftRight className={cn('h-5 w-5', location.pathname === '/transactions' && 'fill-primary/20')} />
              <span className="text-[10px] font-medium">Histórico</span>
            </Link>

            {/* Item 4: Perfil */}
            <button
              onClick={() => {
                haptics.light()
                setIsProfileMenuOpen(!isProfileMenuOpen)
              }}
              className={cn(
                'flex flex-col items-center gap-1 rounded-lg px-4 py-2 transition-all min-w-[64px] active:scale-95',
                isProfileMenuOpen ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <User className={cn('h-5 w-5', isProfileMenuOpen && 'fill-primary/20')} />
              <span className="text-[10px] font-medium">Perfil</span>
            </button>
          </div>
        </div>

        {/* Menu rápido de transações (slide up) */}
        {showTransactionMenu && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="absolute bottom-20 left-4 right-4 bg-card border rounded-2xl shadow-2xl z-50 p-4"
          >
            <p className="text-sm font-semibold mb-3 text-center">Nova Transação</p>
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/transactions?new=expense"
                onClick={() => {
                  haptics.medium()
                  setShowTransactionMenu(false)
                }}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 active:scale-95 transition-transform"
              >
                <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center">
                  <ArrowLeftRight className="h-6 w-6 text-white rotate-90" />
                </div>
                <span className="text-sm font-medium text-red-700 dark:text-red-400">Despesa</span>
              </Link>
              <Link
                to="/transactions?new=income"
                onClick={() => {
                  haptics.medium()
                  setShowTransactionMenu(false)
                }}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 active:scale-95 transition-transform"
              >
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                  <ArrowLeftRight className="h-6 w-6 text-white -rotate-90" />
                </div>
                <span className="text-sm font-medium text-green-700 dark:text-green-400">Receita</span>
              </Link>
            </div>
          </motion.div>
        )}

        {/* Profile Menu Overlay */}
        {isProfileMenuOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/20 z-40"
              onClick={() => setIsProfileMenuOpen(false)}
            />
            <div className="absolute bottom-full left-0 right-0 mb-2 mx-4 bg-card border rounded-lg shadow-lg z-50 p-3">
              <div className="mb-2 px-2 text-sm font-medium">
                {user?.name}
              </div>
              <div className="space-y-2 mb-3">
                <Link
                  to="/achievements"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="flex items-center gap-2 px-2 py-2 text-sm hover:bg-accent rounded-lg"
                >
                  <Trophy className="h-4 w-4" />
                  Conquistas
                </Link>
                <Link
                  to="/billing"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="flex items-center gap-2 px-2 py-2 text-sm hover:bg-accent rounded-lg"
                >
                  <CreditCard className="h-4 w-4" />
                  Assinatura
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="flex items-center gap-2 px-2 py-2 text-sm hover:bg-accent rounded-lg"
                >
                  <Settings className="h-4 w-4" />
                  Configurações
                </Link>
              </div>
              <div className="flex items-center gap-2 mb-3 px-2 border-t pt-3">
                <span className="text-sm text-muted-foreground">Tema:</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleTheme}
                  className="flex items-center gap-2"
                >
                  <ThemeIcon className="h-4 w-4" />
                  <span className="text-xs">{theme === 'light' ? 'Claro' : theme === 'dark' ? 'Escuro' : 'Sistema'}</span>
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsProfileMenuOpen(false)
                  logout()
                }}
                className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
            </div>
          </>
        )}
      </nav>
    </>
  )
}
