import {
  // Category icons
  MdRestaurant,
  MdDirectionsCar,
  MdTheaterComedy,
  MdHome,
  MdLocalHospital,
  MdSchool,
  MdShoppingCart,
  MdReceipt,
  MdAccountBalance,
  MdWork,
  MdTrendingUp,
  MdAttachMoney,
  MdMoreHoriz,

  // Achievement icons - Transactions
  MdCheckCircle,
  MdBarChart,
  MdBusinessCenter,
  MdEmojiEvents,

  // Achievement icons - Streak
  MdLocalFireDepartment,
  MdFitnessCenter,
  MdFlashOn,
  MdMilitaryTech,
  MdStars,

  // Achievement icons - Budget
  MdGpsFixed,
  MdAutoAwesome,
  MdDiamond,
  MdSavings,

  // Achievement icons - Level
  MdArrowUpward,
  MdRocket,
  MdWorkspacePremium,
  MdStarRate,

  // Achievement icons - Savings
  MdAccountBalanceWallet,
  MdMonetizationOn,
} from 'react-icons/md'
import type { IconType } from 'react-icons'

// Mapeamento de nomes de ícones para componentes React Icons
const iconMap: Record<string, IconType> = {
  // Category icons - Expense
  MdRestaurant,
  MdDirectionsCar,
  MdTheaterComedy,
  MdHome,
  MdLocalHospital,
  MdSchool,
  MdShoppingCart,
  MdReceipt,

  // Category icons - Income
  MdAccountBalance,
  MdWork,
  MdTrendingUp,
  MdAttachMoney,

  // Category icons - Other
  MdMoreHoriz,

  // Achievement icons - Transactions
  MdCheckCircle,
  MdBarChart,
  MdBusinessCenter,
  MdEmojiEvents,

  // Achievement icons - Streak
  MdLocalFireDepartment,
  MdFitnessCenter,
  MdFlashOn,
  MdMilitaryTech,
  MdStars,

  // Achievement icons - Budget
  MdGpsFixed,
  MdAutoAwesome,
  MdDiamond,
  MdSavings,

  // Achievement icons - Level
  MdArrowUpward,
  MdRocket,
  MdWorkspacePremium,
  MdStarRate,

  // Achievement icons - Savings
  MdAccountBalanceWallet,
  MdMonetizationOn,
}

/**
 * Converte o nome de um ícone (string) para o componente React Icon
 * @param iconName Nome do ícone (ex: 'MdRestaurant')
 * @returns Componente do ícone ou null se não encontrado
 */
export function getIconComponent(iconName: string): IconType | null {
  return iconMap[iconName] || null
}

/**
 * Verifica se um ícone existe no mapeamento
 * @param iconName Nome do ícone
 * @returns true se o ícone existe
 */
export function hasIcon(iconName: string): boolean {
  return iconName in iconMap
}
