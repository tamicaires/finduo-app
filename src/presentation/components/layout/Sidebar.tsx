import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  Settings,
  Shield,
  HelpCircle,
  Moon,
  Sun,
} from 'lucide-react'
import { useUIStore } from '@application/stores/ui.store'
import { cn } from '@shared/utils'

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Wallet, label: 'Contas', path: '/accounts' },
  { icon: ArrowLeftRight, label: 'Transações', path: '/transactions' },
  { icon: Settings, label: 'Configurações', path: '/settings' },
]

const bottomItems = [
  { icon: Shield, label: 'Segurança', path: '/security' },
  { icon: HelpCircle, label: 'Ajuda', path: '/help' },
]

export function Sidebar() {
  const location = useLocation()
  const { theme, toggleTheme } = useUIStore()
  const isDarkMode = theme === 'dark'

  return (
    <aside className="w-64 h-screen bg-card border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary">FINDUO</h1>
        <p className="text-xs text-muted-foreground">Gestão Financeira</p>
      </div>

      {/* Menu Principal */}
      <nav className="flex-1 px-3">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Menu Inferior */}
      <div className="p-3 space-y-1 border-t border-border">
        {bottomItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground w-full transition-colors"
        >
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          Modo {isDarkMode ? 'Claro' : 'Escuro'}
        </button>
      </div>
    </aside>
  )
}
