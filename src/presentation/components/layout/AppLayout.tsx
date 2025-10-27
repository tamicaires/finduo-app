import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Wallet, ArrowLeftRight, Users, User, LogOut, Sun, Moon, Monitor } from 'lucide-react'
import { useAuth } from '@application/hooks/use-auth'
import { useTheme } from '@application/hooks/use-theme'
import { Button } from '@presentation/components/ui/button'
import { cn } from '@shared/utils'

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
    path: '/couple',
    label: 'Casal',
    icon: Users,
  },
]

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)

  const ThemeIcon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Mobile Only */}
      <header className="sticky top-0 z-50 border-b bg-card lg:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <h1 className="text-lg font-bold text-primary">FINDUO</h1>
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
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm flex-shrink-0">
                FD
              </div>
              <div className="hidden group-hover:block">
                <h1 className="text-xl font-bold text-primary">FINDUO</h1>
                <p className="text-[10px] text-muted-foreground">Gestão Financeira</p>
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

      {/* Bottom Navigation - Mobile Only (App Style) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card lg:hidden">
        <div className="flex items-center justify-around px-2 py-2 safe-area-bottom">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex flex-col items-center gap-1 rounded-lg px-4 py-2 transition-colors min-w-[64px]',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground'
                )}
              >
                <Icon className={cn('h-5 w-5', isActive && 'fill-primary/20')} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            )
          })}

          {/* Profile Button */}
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className={cn(
              'flex flex-col items-center gap-1 rounded-lg px-4 py-2 transition-colors min-w-[64px]',
              isProfileMenuOpen ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            <User className={cn('h-5 w-5', isProfileMenuOpen && 'fill-primary/20')} />
            <span className="text-[10px] font-medium">Perfil</span>
          </button>
        </div>

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
              <div className="flex items-center gap-2 mb-3 px-2">
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

      {/* Main Content */}
      <main className="lg:pl-16 pb-16 lg:pb-0">
        {children}
      </main>
    </div>
  )
}
