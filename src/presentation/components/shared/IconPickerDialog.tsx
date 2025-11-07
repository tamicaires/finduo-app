import { useState, useMemo } from 'react'
import {
  MdSearch,
  MdShoppingCart,
  MdFastfood,
  MdLocalCafe,
  MdRestaurant,
  MdHome,
  MdDirectionsCar,
  MdLocalGasStation,
  MdMovie,
  MdSportsSoccer,
  MdFitnessCenter,
  MdSchool,
  MdWork,
  MdHealthAndSafety,
  MdMedicalServices,
  MdFavorite,
  MdPets,
  MdChildCare,
  MdElderly,
  MdCelebration,
  MdCardGiftcard,
  MdShoppingBag,
  MdLocalMall,
  MdStorefront,
  MdAttachMoney,
  MdSavings,
  MdAccountBalance,
  MdCreditCard,
  MdWallet,
  MdMonetizationOn,
  MdTrendingUp,
  MdBusinessCenter,
  MdLaptop,
  MdPhoneIphone,
  MdDevices,
  MdTv,
  MdHeadphones,
  MdVideogameAsset,
  MdCamera,
  MdMusicNote,
  MdTheaters,
  MdLocalLibrary,
  MdMenuBook,
  MdFlight,
  MdHotel,
  MdBeachAccess,
  MdLandscape,
  MdHiking,
  MdPool,
  MdSpa,
  MdLocalLaundryService,
  MdWaterDrop,
  MdElectricBolt,
  MdWifi,
  MdPhone,
  MdSmartphone,
  MdComputer,
  MdPrint,
  MdBuild,
  MdConstruction,
  MdPlumbing,
  MdElectricalServices,
  MdCarpenter,
  MdFormatPaint,
  MdGrass,
  MdYard,
  MdLocalFlorist,
  MdNature,
  MdPark,
  MdForest,
  MdWbSunny,
  MdCloud,
  MdUmbrella,
  MdAcUnit,
  MdLocalFireDepartment,
  MdWaves,
  MdStar,
  MdGrade,
  MdDiamond,
  MdCake,
  MdIcecream,
  MdLocalBar,
  MdLocalPizza,
  MdLunchDining,
  MdDinnerDining,
  MdBreakfastDining,
  MdBakeryDining,
  MdRamenDining,
  MdTakeoutDining,
  MdDeliveryDining,
  MdCategory,
  MdLabel,
  MdOutlineFastfood,
} from 'react-icons/md'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@presentation/components/ui/dialog'
import { Input } from '@presentation/components/ui/input'
import { ScrollArea } from '@presentation/components/ui/scroll-area'
import { Button } from '@presentation/components/ui/button'
import { cn } from '@shared/utils'

const ICON_MAP = {
  // Compras & Shopping
  MdShoppingCart,
  MdShoppingBag,
  MdLocalMall,
  MdStorefront,

  // Alimentação
  MdFastfood,
  MdLocalCafe,
  MdRestaurant,
  MdLocalPizza,
  MdLunchDining,
  MdDinnerDining,
  MdBreakfastDining,
  MdBakeryDining,
  MdRamenDining,
  MdTakeoutDining,
  MdDeliveryDining,
  MdOutlineFastfood,
  MdLocalBar,
  MdCake,
  MdIcecream,

  // Casa & Moradia
  MdHome,
  MdLocalLaundryService,
  MdWaterDrop,
  MdElectricBolt,
  MdWifi,
  MdBuild,
  MdConstruction,
  MdPlumbing,
  MdElectricalServices,
  MdCarpenter,
  MdFormatPaint,

  // Transporte
  MdDirectionsCar,
  MdLocalGasStation,
  MdFlight,

  // Entretenimento
  MdMovie,
  MdTheaters,
  MdSportsSoccer,
  MdFitnessCenter,
  MdVideogameAsset,
  MdMusicNote,
  MdHeadphones,
  MdCamera,

  // Educação & Trabalho
  MdSchool,
  MdWork,
  MdBusinessCenter,
  MdLocalLibrary,
  MdMenuBook,

  // Saúde
  MdHealthAndSafety,
  MdMedicalServices,
  MdFavorite,
  MdSpa,

  // Família & Pessoas
  MdPets,
  MdChildCare,
  MdElderly,

  // Presentes & Celebrações
  MdCelebration,
  MdCardGiftcard,

  // Finanças
  MdAttachMoney,
  MdSavings,
  MdAccountBalance,
  MdCreditCard,
  MdWallet,
  MdMonetizationOn,
  MdTrendingUp,

  // Tecnologia
  MdLaptop,
  MdPhoneIphone,
  MdDevices,
  MdTv,
  MdComputer,
  MdSmartphone,
  MdPrint,
  MdPhone,

  // Viagem & Lazer
  MdHotel,
  MdBeachAccess,
  MdLandscape,
  MdHiking,
  MdPool,

  // Natureza & Jardim
  MdGrass,
  MdYard,
  MdLocalFlorist,
  MdNature,
  MdPark,
  MdForest,

  // Clima
  MdWbSunny,
  MdCloud,
  MdUmbrella,
  MdAcUnit,
  MdLocalFireDepartment,
  MdWaves,

  // Outros
  MdStar,
  MdGrade,
  MdDiamond,
  MdCategory,
  MdLabel,
}

const ICON_CATEGORIES = {
  'Alimentação': [
    'MdFastfood', 'MdLocalCafe', 'MdRestaurant', 'MdLocalPizza',
    'MdLunchDining', 'MdDinnerDining', 'MdBreakfastDining', 'MdBakeryDining',
    'MdRamenDining', 'MdTakeoutDining', 'MdLocalBar', 'MdCake', 'MdIcecream'
  ],
  'Compras': [
    'MdShoppingCart', 'MdShoppingBag', 'MdLocalMall', 'MdStorefront'
  ],
  'Casa': [
    'MdHome', 'MdLocalLaundryService', 'MdWaterDrop', 'MdElectricBolt',
    'MdWifi', 'MdBuild', 'MdPlumbing', 'MdFormatPaint'
  ],
  'Transporte': [
    'MdDirectionsCar', 'MdLocalGasStation', 'MdFlight'
  ],
  'Lazer': [
    'MdMovie', 'MdTheaters', 'MdSportsSoccer', 'MdFitnessCenter',
    'MdVideogameAsset', 'MdMusicNote', 'MdCamera'
  ],
  'Saúde': [
    'MdHealthAndSafety', 'MdMedicalServices', 'MdFavorite', 'MdSpa'
  ],
  'Educação': [
    'MdSchool', 'MdLocalLibrary', 'MdMenuBook'
  ],
  'Trabalho': [
    'MdWork', 'MdBusinessCenter', 'MdLaptop'
  ],
  'Finanças': [
    'MdAttachMoney', 'MdSavings', 'MdAccountBalance', 'MdCreditCard',
    'MdWallet', 'MdMonetizationOn', 'MdTrendingUp'
  ],
  'Tecnologia': [
    'MdPhoneIphone', 'MdDevices', 'MdTv', 'MdComputer', 'MdHeadphones'
  ],
  'Viagem': [
    'MdHotel', 'MdBeachAccess', 'MdLandscape', 'MdHiking', 'MdPool'
  ],
  'Família': [
    'MdPets', 'MdChildCare', 'MdElderly', 'MdCelebration', 'MdCardGiftcard'
  ],
  'Outros': [
    'MdStar', 'MdGrade', 'MdDiamond', 'MdCategory', 'MdLabel'
  ],
}

interface IconPickerDialogProps {
  isOpen: boolean
  onClose: () => void
  selectedIcon: string
  onSelectIcon: (icon: string) => void
}

export function IconPickerDialog({
  isOpen,
  onClose,
  selectedIcon,
  onSelectIcon,
}: IconPickerDialogProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredIcons = useMemo(() => {
    let icons = Object.keys(ICON_MAP)

    if (selectedCategory) {
      icons = ICON_CATEGORIES[selectedCategory as keyof typeof ICON_CATEGORIES] || []
    }

    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      icons = icons.filter((name) =>
        name.toLowerCase().includes(search)
      )
    }

    return icons
  }, [searchTerm, selectedCategory])

  const handleSelectIcon = (iconName: string) => {
    onSelectIcon(iconName)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Escolher Ícone</DialogTitle>
          <DialogDescription>
            Selecione um ícone para representar sua categoria
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar ícone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant={selectedCategory === null ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(null)}
              className="text-xs"
            >
              Todos
            </Button>
            {Object.keys(ICON_CATEGORIES).map((category) => (
              <Button
                key={category}
                type="button"
                size="sm"
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className="text-xs"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Icon Grid */}
          <ScrollArea className="h-[400px] pr-4">
            <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
              {filteredIcons.map((iconName) => {
                const IconComponent = ICON_MAP[iconName as keyof typeof ICON_MAP]
                const isSelected = iconName === selectedIcon

                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => handleSelectIcon(iconName)}
                    className={cn(
                      'flex flex-col items-center justify-center p-3 rounded-lg',
                      'border-2 transition-all hover:scale-105 hover:shadow-md',
                      isSelected
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    )}
                    title={iconName}
                  >
                    <IconComponent className={cn(
                      'h-6 w-6',
                      isSelected ? 'text-primary' : 'text-muted-foreground'
                    )} />
                  </button>
                )
              })}
            </div>

            {filteredIcons.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <MdSearch className="h-12 w-12 mb-2" />
                <p>Nenhum ícone encontrado</p>
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
