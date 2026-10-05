import { Baby, Heart, type LucideIcon, User, Users } from 'lucide-react'
import { clamp } from './utils'

// Types for budget calculation
export interface IncomeData {
  monthlyAmount: number
  currency: 'AED' | 'USD'
  exchangeRate: number
}

export interface RentData {
  annualRent: number
  rentStartDate: string
  numberOfCheques: number
  securityDeposit: {
    type: 'percentage' | 'fixed'
    value: number
  }
  ejari: {
    type: 'online' | 'centres' | 'offline'
  }
  area: string
  building: string
}

export interface BrokerData {
  type: 'percentage' | 'fixed'
  percentage: number
  fixedAmount: number
}

export interface UtilitiesData {
  dewa: {
    enabled: boolean
    deposit: number
    monthlyUsage: number
  }
  districtCooling: {
    enabled: boolean
    deposit: number
    monthlyAmount: number
  }
  internet: {
    enabled: boolean
    provider: string
    monthlyAmount: number
  }
  gas: {
    enabled: boolean
    deposit: number
    monthlyAmount: number
  }
}

export interface HouseholdData {
  adults: number
  children: number
  childrenAges: number[]
  nursery: boolean
}

export interface TransportData {
  type: 'none' | 'car' | 'public' | 'both'
  carRental: {
    category: string
    monthlyAmount: number
    salikCrossings: number
    fuelKmPerMonth: number
  }
  publicTransport: {
    zones: number
    monthlyAmount: number
  }
}

export interface FoodData {
  monthlyAmount: number
}

export interface CustomSpendingItem {
  id: string
  category: string
  monthlyAmount: number
  isCustom: boolean
}

export interface ExtrasData {
  mobilePhone: number
  gym: number
  streaming: number
  customSpending: CustomSpendingItem[]
}

export interface ApplianceItem {
  id: string
  name: string
  enabled: boolean
  price: number
  defaultPrice: number
  category: 'kitchen' | 'laundry' | 'bedroom' | 'living' | 'other'
  priceRange: {
    min: number
    max: number
    notes: string
  }
}

export interface AppliancesData {
  items: ApplianceItem[]
  totalAmount: number
}

export interface MovingServicesData {
  amount: number
}

export interface RelocationServicesData {
  planeTickets: {
    enabled: boolean
    adults: number
    adultCost: number
    children: number
    childrenCost: number
  }
  temporaryStay: {
    enabled: boolean
    nights: number
    costPerNight: number
  }
  airportTransfer: {
    enabled: boolean
    trips: number
    costPerTrip: number
  }
  visaMedicals: {
    enabled: boolean
    adults: number
    adultCost: number
    children: number
    childrenCost: number
  }
  pets: {
    enabled: boolean
    count: number
    costPerPet: number
  }
}

export interface PreferencesData {
  displayCurrency: 'AED' | 'USD'
  exchangeRate: number
  ignoreEmptyValues: boolean
  visibleSections: {
    household: boolean
    food: boolean
    extras: boolean
    moving: boolean
  }
}

// Simplified Sponsorship types
export interface SplitRule {
  type: 'percentage' | 'fixed'
  value: number // percentage 0-100, or fixed amount in AED
}

export interface SponsorshipConfig {
  enabled: boolean
  rentChequesFromSponsor?: number // how many cheques sponsor pays
  broker?: SplitRule
  securityDeposit?: SplitRule
  dewaDeposit?: SplitRule
  relocation?: SplitRule
}

export interface BudgetData {
  preferences: PreferencesData
  income: IncomeData
  rent: RentData
  broker: BrokerData
  appliances: AppliancesData
  utilities: UtilitiesData
  household: HouseholdData
  transport: TransportData
  food: FoodData
  extras: ExtrasData
  movingServices: MovingServicesData
  relocationServices: RelocationServicesData
  sponsorship?: SponsorshipConfig
}

export interface BudgetResults {
  upfront: {
    rentFirstCheque: number
    brokerFee: number
    dewaDeposit: number
    coolingDeposit: number
    gasDeposit: number
    ejari: number
    securityDeposit: number
    appliances: number
    movingServices: number
    relocationServices: number
    total: number
    youPay?: number
    sponsorPay?: number
  }
  monthly: {
    rent: number
    utilities: number
    schooling: number
    transport: number
    food: number
    extras: number
    total: number
    youPay?: number
    sponsorPay?: number
  }
  savings: {
    monthlyAmount: number
    savingsRate: number
  }
}

// Constants based on 2026 Dubai documentation
const ASSUMPTIONS = {
  dewa: {
    depositFlat: 2000,
    depositVilla: 4000,
    activationSmall: 100,
    activationLarge: 300,
    registrationFee: 10,
    knowledgeFee: 10,
    innovationFee: 10,
  },
  ejari: {
    // Dubai REST App/Website - Most cost-effective option
    online: 120, // AED 100 + 10 knowledge + 10 innovation
    // Real Estate Services Trustee Centers - In-person service
    centres: 215, // AED 120 + 95 service partner fees (no VAT on govt fees)
    // Typing Centers/Service Providers - Convenience option
    offline: 290, // AED 220-320 typical range for typing centers
  },
  gas: {
    deposit: 750,
    connectionFee: 350,
    monthlyFixed: 20,
  },
  districtCooling: {
    demandChargePerRT: 750,
    consumptionPerRTHour: 0.568,
    meterMaintenance: 30,
  },
  fuelPricePerL: 2.6,
  salikPerCrossing: 6,
  movingServices: {
    studio: [700, 1200],
    oneBedroom: [1100, 1500],
    twoBedroom: [1600, 2500],
    threeBedroom: [3500, 6000],
    fourBedroom: 6000,
  },
  schoolingBands: {
    nursery: { min: 1500, max: 3000 },
    primary: { min: 2000, max: 4500 },
    secondary: { min: 3000, max: 6000 },
  },
}

// Predefined budget templates for common scenarios
// Leases usually start on the first of a month, so default to the first day of the next one
export function defaultRentStartDate(now: Date = new Date()): string {
  const start = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  return `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}-01`
}

export interface BudgetTemplate {
  id: string
  name: string
  description: string
  icon: LucideIcon
  data: Partial<BudgetData>
}

export const BUDGET_TEMPLATES: BudgetTemplate[] = [
  {
    id: 'solo-unfurnished',
    name: 'Solo Professional',
    description: 'Single person, unfurnished apartment',
    icon: User,
    data: {
      income: {
        monthlyAmount: 12000,
        currency: 'AED',
        exchangeRate: 3.67,
      },
      rent: {
        annualRent: 60000,
        rentStartDate: defaultRentStartDate(),
        numberOfCheques: 4,
        securityDeposit: {
          type: 'percentage',
          value: 5,
        },
        ejari: {
          type: 'online',
        },
        area: '',
        building: '',
      },
      household: {
        adults: 1,
        children: 0,
        childrenAges: [],
        nursery: false,
      },
      transport: {
        type: 'car',
        carRental: {
          category: 'sedan',
          monthlyAmount: 2200,
          salikCrossings: 15,
          fuelKmPerMonth: 1200,
        },
        publicTransport: {
          zones: 1,
          monthlyAmount: 140,
        },
      },
      food: {
        monthlyAmount: 1200,
      },
      extras: {
        mobilePhone: 150,
        gym: 200,
        streaming: 100,
        customSpending: [],
      },
      appliances: {
        items: [
          {
            id: 'fridge',
            name: 'Refrigerator',
            enabled: true,
            price: 2500,
            defaultPrice: 2500,
            category: 'kitchen',
            priceRange: {
              min: 1000,
              max: 9000,
              notes:
                'Mid-range models typically AED 1,500-4,000. Price varies by size, brand, and features (side-by-side, smart features).',
            },
          },
          {
            id: 'washing-machine',
            name: 'Washing Machine',
            enabled: true,
            price: 1800,
            defaultPrice: 1800,
            category: 'laundry',
            priceRange: {
              min: 500,
              max: 3500,
              notes: 'Semi-automatic models start from AED 500, automatic models AED 800-3,500.',
            },
          },
          {
            id: 'bed-double',
            name: 'Double Bed with Mattress',
            enabled: true,
            price: 1800,
            defaultPrice: 1800,
            category: 'bedroom',
            priceRange: {
              min: 600,
              max: 3000,
              notes: 'Basic to mid-range options. Luxury beds can cost AED 10,000 or more.',
            },
          },
          {
            id: 'tv',
            name: 'Smart TV (55")',
            enabled: true,
            price: 2500,
            defaultPrice: 2500,
            category: 'living',
            priceRange: {
              min: 900,
              max: 5000,
              notes: 'Price depends on brand, resolution (4K UHD), and features (OLED, QLED, refresh rate).',
            },
          },
          {
            id: 'microwave',
            name: 'Microwave Oven',
            enabled: true,
            price: 350,
            defaultPrice: 350,
            category: 'kitchen',
            priceRange: {
              min: 150,
              max: 1000,
              notes: 'Basic solo microwaves at lower end; convection or grill models can cost up to AED 4,500+.',
            },
          },
        ],
        totalAmount: 0,
      },
    },
  },
  {
    id: 'couple-unfurnished',
    name: 'Couple',
    description: 'Two adults, unfurnished apartment',
    icon: Heart,
    data: {
      income: {
        monthlyAmount: 20000,
        currency: 'AED',
        exchangeRate: 3.67,
      },
      rent: {
        annualRent: 85000,
        rentStartDate: defaultRentStartDate(),
        numberOfCheques: 4,
        securityDeposit: {
          type: 'percentage',
          value: 5,
        },
        ejari: {
          type: 'online',
        },
        area: '',
        building: '',
      },
      household: {
        adults: 2,
        children: 0,
        childrenAges: [],
        nursery: false,
      },
      transport: {
        type: 'car',
        carRental: {
          category: 'suv',
          monthlyAmount: 2800,
          salikCrossings: 25,
          fuelKmPerMonth: 1800,
        },
        publicTransport: {
          zones: 1,
          monthlyAmount: 140,
        },
      },
      food: {
        monthlyAmount: 2200,
      },
      extras: {
        mobilePhone: 300,
        gym: 400,
        streaming: 150,
        customSpending: [],
      },
      appliances: {
        items: [
          {
            id: 'fridge',
            name: 'Refrigerator',
            enabled: true,
            price: 2500,
            defaultPrice: 2500,
            category: 'kitchen',
            priceRange: {
              min: 1000,
              max: 9000,
              notes:
                'Mid-range models typically AED 1,500-4,000. Price varies by size, brand, and features (side-by-side, smart features).',
            },
          },
          {
            id: 'washing-machine',
            name: 'Washing Machine',
            enabled: true,
            price: 1800,
            defaultPrice: 1800,
            category: 'laundry',
            priceRange: {
              min: 500,
              max: 3500,
              notes: 'Semi-automatic models start from AED 500, automatic models AED 800-3,500.',
            },
          },
          {
            id: 'dishwasher',
            name: 'Dishwasher',
            enabled: true,
            price: 2000,
            defaultPrice: 2000,
            category: 'kitchen',
            priceRange: {
              min: 800,
              max: 3500,
              notes: 'Standard models in this range; high-end or integrated models can exceed AED 10,000.',
            },
          },
          {
            id: 'bed-double',
            name: 'Double Bed with Mattress',
            enabled: true,
            price: 1800,
            defaultPrice: 1800,
            category: 'bedroom',
            priceRange: {
              min: 600,
              max: 3000,
              notes: 'Basic to mid-range options. Luxury beds can cost AED 10,000 or more.',
            },
          },
          {
            id: 'sofa',
            name: 'Sofa Set (3+2)',
            enabled: true,
            price: 3200,
            defaultPrice: 3200,
            category: 'living',
            priceRange: {
              min: 1500,
              max: 5000,
              notes: 'Basic to mid-range sofa sets. Luxury and designer options can be significantly higher.',
            },
          },
          {
            id: 'dining-table',
            name: 'Dining Table Set (6 chairs)',
            enabled: true,
            price: 2500,
            defaultPrice: 2500,
            category: 'living',
            priceRange: {
              min: 900,
              max: 4000,
              notes: 'Basic to mid-range sets. Materials and design greatly influence the price.',
            },
          },
          {
            id: 'tv',
            name: 'Smart TV (55")',
            enabled: true,
            price: 2500,
            defaultPrice: 2500,
            category: 'living',
            priceRange: {
              min: 900,
              max: 5000,
              notes: 'Price depends on brand, resolution (4K UHD), and features (OLED, QLED, refresh rate).',
            },
          },
          {
            id: 'wardrobe',
            name: 'Wardrobe',
            enabled: true,
            price: 1200,
            defaultPrice: 1200,
            category: 'bedroom',
            priceRange: {
              min: 250,
              max: 3000,
              notes: 'Basic 2-door to 4-door wardrobes. Custom-built or high-end designs will be more expensive.',
            },
          },
          {
            id: 'microwave',
            name: 'Microwave Oven',
            enabled: true,
            price: 350,
            defaultPrice: 350,
            category: 'kitchen',
            priceRange: {
              min: 150,
              max: 1000,
              notes: 'Basic solo microwaves at lower end; convection or grill models can cost up to AED 4,500+.',
            },
          },
        ],
        totalAmount: 0,
      },
    },
  },
  {
    id: 'family-2children',
    name: 'Family of 4',
    description: 'Two adults, 2 children, furnished apartment',
    icon: Users,
    data: {
      income: {
        monthlyAmount: 30000,
        currency: 'AED',
        exchangeRate: 3.67,
      },
      rent: {
        annualRent: 120000,
        rentStartDate: defaultRentStartDate(),
        numberOfCheques: 4,
        securityDeposit: {
          type: 'percentage',
          value: 5,
        },
        ejari: {
          type: 'online',
        },
        area: '',
        building: '',
      },
      household: {
        adults: 2,
        children: 2,
        childrenAges: [5, 8],
        nursery: false,
      },
      transport: {
        type: 'car',
        carRental: {
          category: 'suv',
          monthlyAmount: 3200,
          salikCrossings: 40,
          fuelKmPerMonth: 2500,
        },
        publicTransport: {
          zones: 2,
          monthlyAmount: 280,
        },
      },
      food: {
        monthlyAmount: 3500,
      },
      extras: {
        mobilePhone: 300,
        gym: 400,
        streaming: 200,
        customSpending: [
          {
            id: 'school-activities',
            category: 'School Activities',
            monthlyAmount: 800,
            isCustom: true,
          },
          {
            id: 'family-entertainment',
            category: 'Family Entertainment',
            monthlyAmount: 600,
            isCustom: true,
          },
        ],
      },
      appliances: {
        items: [
          {
            id: 'fridge',
            name: 'Refrigerator',
            enabled: false,
            price: 2500,
            defaultPrice: 2500,
            category: 'kitchen',
            priceRange: {
              min: 1000,
              max: 9000,
              notes:
                'Mid-range models typically AED 1,500-4,000. Price varies by size, brand, and features (side-by-side, smart features).',
            },
          },
          {
            id: 'washing-machine',
            name: 'Washing Machine',
            enabled: false,
            price: 1800,
            defaultPrice: 1800,
            category: 'laundry',
            priceRange: {
              min: 500,
              max: 3500,
              notes: 'Semi-automatic models start from AED 500, automatic models AED 800-3,500.',
            },
          },
          {
            id: 'dishwasher',
            name: 'Dishwasher',
            enabled: false,
            price: 2000,
            defaultPrice: 2000,
            category: 'kitchen',
            priceRange: {
              min: 800,
              max: 3500,
              notes: 'Standard models in this range; high-end or integrated models can exceed AED 10,000.',
            },
          },
          {
            id: 'bed-double',
            name: 'Double Bed with Mattress',
            enabled: false,
            price: 1800,
            defaultPrice: 1800,
            category: 'bedroom',
            priceRange: {
              min: 600,
              max: 3000,
              notes: 'Basic to mid-range options. Luxury beds can cost AED 10,000 or more.',
            },
          },
          {
            id: 'sofa',
            name: 'Sofa Set (3+2)',
            enabled: false,
            price: 3200,
            defaultPrice: 3200,
            category: 'living',
            priceRange: {
              min: 1500,
              max: 5000,
              notes: 'Basic to mid-range sofa sets. Luxury and designer options can be significantly higher.',
            },
          },
          {
            id: 'dining-table',
            name: 'Dining Table Set (6 chairs)',
            enabled: false,
            price: 2500,
            defaultPrice: 2500,
            category: 'living',
            priceRange: {
              min: 900,
              max: 4000,
              notes: 'Basic to mid-range sets. Materials and design greatly influence the price.',
            },
          },
          {
            id: 'tv',
            name: 'Smart TV (55")',
            enabled: false,
            price: 2500,
            defaultPrice: 2500,
            category: 'living',
            priceRange: {
              min: 900,
              max: 5000,
              notes: 'Price depends on brand, resolution (4K UHD), and features (OLED, QLED, refresh rate).',
            },
          },
          {
            id: 'wardrobe',
            name: 'Wardrobe',
            enabled: false,
            price: 1200,
            defaultPrice: 1200,
            category: 'bedroom',
            priceRange: {
              min: 250,
              max: 3000,
              notes: 'Basic 2-door to 4-door wardrobes. Custom-built or high-end designs will be more expensive.',
            },
          },
          {
            id: 'ac-unit',
            name: 'Additional AC Unit',
            enabled: false,
            price: 1650,
            defaultPrice: 1650,
            category: 'other',
            priceRange: {
              min: 800,
              max: 2500,
              notes: 'Larger capacity units will be more expensive. Installation costs AED 150-2,500 additional.',
            },
          },
          {
            id: 'microwave',
            name: 'Microwave Oven',
            enabled: false,
            price: 350,
            defaultPrice: 350,
            category: 'kitchen',
            priceRange: {
              min: 150,
              max: 1000,
              notes: 'Basic solo microwaves at lower end; convection or grill models can cost up to AED 4,500+.',
            },
          },
        ],
        totalAmount: 0,
      },
    },
  },
  {
    id: 'family-young-children',
    name: 'Young Family',
    description: 'Two adults, 1 toddler in nursery',
    icon: Baby,
    data: {
      income: {
        monthlyAmount: 25000,
        currency: 'AED',
        exchangeRate: 3.67,
      },
      rent: {
        annualRent: 95000,
        rentStartDate: defaultRentStartDate(),
        numberOfCheques: 4,
        securityDeposit: {
          type: 'percentage',
          value: 5,
        },
        ejari: {
          type: 'online',
        },
        area: '',
        building: '',
      },
      household: {
        adults: 2,
        children: 1,
        childrenAges: [2],
        nursery: true,
      },
      transport: {
        type: 'car',
        carRental: {
          category: 'suv',
          monthlyAmount: 2900,
          salikCrossings: 30,
          fuelKmPerMonth: 2000,
        },
        publicTransport: {
          zones: 1,
          monthlyAmount: 140,
        },
      },
      food: {
        monthlyAmount: 2800,
      },
      extras: {
        mobilePhone: 300,
        gym: 200,
        streaming: 150,
        customSpending: [
          {
            id: 'baby-supplies',
            category: 'Baby Supplies',
            monthlyAmount: 500,
            isCustom: true,
          },
          {
            id: 'family-activities',
            category: 'Family Activities',
            monthlyAmount: 400,
            isCustom: true,
          },
        ],
      },
      appliances: {
        items: [
          {
            id: 'fridge',
            name: 'Refrigerator',
            enabled: true,
            price: 2500,
            defaultPrice: 2500,
            category: 'kitchen',
            priceRange: {
              min: 1000,
              max: 9000,
              notes:
                'Mid-range models typically AED 1,500-4,000. Price varies by size, brand, and features (side-by-side, smart features).',
            },
          },
          {
            id: 'washing-machine',
            name: 'Washing Machine',
            enabled: true,
            price: 1800,
            defaultPrice: 1800,
            category: 'laundry',
            priceRange: {
              min: 500,
              max: 3500,
              notes: 'Semi-automatic models start from AED 500, automatic models AED 800-3,500.',
            },
          },
          {
            id: 'dishwasher',
            name: 'Dishwasher',
            enabled: true,
            price: 2000,
            defaultPrice: 2000,
            category: 'kitchen',
            priceRange: {
              min: 800,
              max: 3500,
              notes: 'Standard models in this range; high-end or integrated models can exceed AED 10,000.',
            },
          },
          {
            id: 'bed-double',
            name: 'Double Bed with Mattress',
            enabled: true,
            price: 1800,
            defaultPrice: 1800,
            category: 'bedroom',
            priceRange: {
              min: 600,
              max: 3000,
              notes: 'Basic to mid-range options. Luxury beds can cost AED 10,000 or more.',
            },
          },
          {
            id: 'sofa',
            name: 'Sofa Set (3+2)',
            enabled: true,
            price: 3200,
            defaultPrice: 3200,
            category: 'living',
            priceRange: {
              min: 1500,
              max: 5000,
              notes: 'Basic to mid-range sofa sets. Luxury and designer options can be significantly higher.',
            },
          },
          {
            id: 'dining-table',
            name: 'Dining Table Set (6 chairs)',
            enabled: true,
            price: 2500,
            defaultPrice: 2500,
            category: 'living',
            priceRange: {
              min: 900,
              max: 4000,
              notes: 'Basic to mid-range sets. Materials and design greatly influence the price.',
            },
          },
          {
            id: 'tv',
            name: 'Smart TV (55")',
            enabled: true,
            price: 2500,
            defaultPrice: 2500,
            category: 'living',
            priceRange: {
              min: 900,
              max: 5000,
              notes: 'Price depends on brand, resolution (4K UHD), and features (OLED, QLED, refresh rate).',
            },
          },
          {
            id: 'wardrobe',
            name: 'Wardrobe',
            enabled: true,
            price: 1200,
            defaultPrice: 1200,
            category: 'bedroom',
            priceRange: {
              min: 250,
              max: 3000,
              notes: 'Basic 2-door to 4-door wardrobes. Custom-built or high-end designs will be more expensive.',
            },
          },
          {
            id: 'microwave',
            name: 'Microwave Oven',
            enabled: true,
            price: 350,
            defaultPrice: 350,
            category: 'kitchen',
            priceRange: {
              min: 150,
              max: 1000,
              notes: 'Basic solo microwaves at lower end; convection or grill models can cost up to AED 4,500+.',
            },
          },
        ],
        totalAmount: 0,
      },
    },
  },
]

// Simplified sponsorship helper function
function applySplitRule(amount: number, rule: SplitRule | undefined): { youPay: number; sponsorPay: number } {
  if (!rule || amount === 0) {
    return { youPay: amount, sponsorPay: 0 }
  }

  let sponsorPay = 0
  if (rule.type === 'percentage') {
    sponsorPay = Math.round((amount * clamp(rule.value, 0, 100)) / 100)
  } else {
    // fixed amount
    sponsorPay = clamp(rule.value, 0, amount) // can't pay more than total
  }

  const youPay = amount - sponsorPay

  return { youPay, sponsorPay }
}

export function calculateBudget(data: BudgetData): BudgetResults {
  // Convert income to AED if needed
  const monthlyIncomeAED =
    data.income.currency === 'USD' ? data.income.monthlyAmount * data.income.exchangeRate : data.income.monthlyAmount

  const sponsorshipEnabled = data.sponsorship?.enabled || false

  // Calculate upfront costs
  const rentFirstCheque = Math.round(data.rent.annualRent / data.rent.numberOfCheques)
  const brokerFee = Math.round(
    data.broker.type === 'percentage'
      ? data.rent.annualRent * (clamp(data.broker.percentage, 0, 100) / 100)
      : data.broker.fixedAmount,
  )
  const dewaDeposit = data.utilities.dewa.enabled ? Math.round(data.utilities.dewa.deposit) : 0
  const coolingDeposit = data.utilities.districtCooling.enabled ? Math.round(data.utilities.districtCooling.deposit) : 0
  const gasDeposit = data.utilities.gas.enabled ? Math.round(data.utilities.gas.deposit) : 0
  const ejari = Math.round(ASSUMPTIONS.ejari[data.rent.ejari.type])
  const securityDeposit = Math.round(
    data.rent.securityDeposit.type === 'percentage'
      ? data.rent.annualRent * (clamp(data.rent.securityDeposit.value, 0, 100) / 100)
      : data.rent.securityDeposit.value,
  )
  const appliances = Math.round(data.appliances.totalAmount)
  const movingServices = Math.round(data.movingServices.amount)

  // Calculate individual relocation service items
  const planeTickets = data.relocationServices.planeTickets.enabled
    ? Math.round(
        data.relocationServices.planeTickets.adults * data.relocationServices.planeTickets.adultCost +
          data.relocationServices.planeTickets.children * data.relocationServices.planeTickets.childrenCost,
      )
    : 0
  const hotelStay = data.relocationServices.temporaryStay.enabled
    ? Math.round(data.relocationServices.temporaryStay.nights * data.relocationServices.temporaryStay.costPerNight)
    : 0
  const airportTaxi = data.relocationServices.airportTransfer.enabled
    ? Math.round(data.relocationServices.airportTransfer.trips * data.relocationServices.airportTransfer.costPerTrip)
    : 0
  const visaMedicals = data.relocationServices.visaMedicals.enabled
    ? Math.round(
        data.relocationServices.visaMedicals.adults * data.relocationServices.visaMedicals.adultCost +
          data.relocationServices.visaMedicals.children * data.relocationServices.visaMedicals.childrenCost,
      )
    : 0
  const petTransport = data.relocationServices.pets.enabled
    ? Math.round(data.relocationServices.pets.count * data.relocationServices.pets.costPerPet)
    : 0

  const relocationServices = planeTickets + hotelStay + airportTaxi + visaMedicals + petTransport

  // Apply simplified sponsorship splits
  const brokerSplit = sponsorshipEnabled
    ? applySplitRule(brokerFee, data.sponsorship?.broker)
    : { youPay: brokerFee, sponsorPay: 0 }
  const securitySplit = sponsorshipEnabled
    ? applySplitRule(securityDeposit, data.sponsorship?.securityDeposit)
    : { youPay: securityDeposit, sponsorPay: 0 }
  const dewaSplit = sponsorshipEnabled
    ? applySplitRule(dewaDeposit, data.sponsorship?.dewaDeposit)
    : { youPay: dewaDeposit, sponsorPay: 0 }
  const relocationSplit = sponsorshipEnabled
    ? applySplitRule(relocationServices, data.sponsorship?.relocation)
    : { youPay: relocationServices, sponsorPay: 0 }

  // Handle rent cheques sponsorship
  const chequesFromSponsor = sponsorshipEnabled
    ? clamp(data.sponsorship?.rentChequesFromSponsor || 0, 0, data.rent.numberOfCheques)
    : 0
  const firstPaymentSplit = {
    youPay: chequesFromSponsor > 0 ? 0 : rentFirstCheque,
    sponsorPay: chequesFromSponsor > 0 ? rentFirstCheque : 0,
  }

  // Calculate upfront totals
  const upfrontTotal =
    rentFirstCheque +
    brokerFee +
    dewaDeposit +
    coolingDeposit +
    gasDeposit +
    ejari +
    securityDeposit +
    appliances +
    movingServices +
    relocationServices

  const upfrontYouPay = sponsorshipEnabled
    ? firstPaymentSplit.youPay +
      brokerSplit.youPay +
      securitySplit.youPay +
      dewaSplit.youPay +
      relocationSplit.youPay +
      coolingDeposit +
      gasDeposit +
      ejari +
      appliances +
      movingServices
    : upfrontTotal

  const upfrontSponsorPay = sponsorshipEnabled
    ? firstPaymentSplit.sponsorPay +
      brokerSplit.sponsorPay +
      securitySplit.sponsorPay +
      dewaSplit.sponsorPay +
      relocationSplit.sponsorPay
    : 0

  // Calculate monthly costs
  const monthlyRent = Math.round(data.rent.annualRent / 12)

  // Calculate monthly rent split based on cheques from sponsor
  // If sponsor pays X cheques out of N, they cover X/N of the year
  const rentSponsorPortion =
    sponsorshipEnabled && chequesFromSponsor > 0 ? chequesFromSponsor / data.rent.numberOfCheques : 0

  const monthlyRentSponsorPay = Math.round(monthlyRent * rentSponsorPortion)
  const monthlyRentYouPay = monthlyRent - monthlyRentSponsorPay

  // Utilities
  let monthlyUtilities = 0
  if (data.utilities.dewa.enabled) {
    monthlyUtilities += data.utilities.dewa.monthlyUsage
  }
  if (data.utilities.districtCooling.enabled) {
    monthlyUtilities += data.utilities.districtCooling.monthlyAmount
  }
  if (data.utilities.internet.enabled) {
    monthlyUtilities += data.utilities.internet.monthlyAmount
  }
  if (data.utilities.gas.enabled) {
    monthlyUtilities += data.utilities.gas.monthlyAmount
  }
  monthlyUtilities = Math.round(monthlyUtilities)

  // Schooling
  let monthlySchooling = 0
  if (data.household.nursery) {
    monthlySchooling += ASSUMPTIONS.schoolingBands.nursery.min
  }
  data.household.childrenAges.forEach((age) => {
    if (age <= 4) {
      monthlySchooling += ASSUMPTIONS.schoolingBands.nursery.min
    } else if (age <= 11) {
      monthlySchooling += ASSUMPTIONS.schoolingBands.primary.min
    } else if (age <= 17) {
      monthlySchooling += ASSUMPTIONS.schoolingBands.secondary.min
    }
  })
  monthlySchooling = Math.round(monthlySchooling)

  // Transport
  let monthlyTransport = 0
  if (data.transport.type === 'car' || data.transport.type === 'both') {
    monthlyTransport += data.transport.carRental.monthlyAmount
    // Add fuel costs
    const fuelCost = (data.transport.carRental.fuelKmPerMonth / 15) * ASSUMPTIONS.fuelPricePerL
    monthlyTransport += fuelCost
    // Add Salik
    const salikCost = data.transport.carRental.salikCrossings * ASSUMPTIONS.salikPerCrossing
    monthlyTransport += salikCost
  }
  if (data.transport.type === 'public' || data.transport.type === 'both') {
    monthlyTransport += data.transport.publicTransport.monthlyAmount
  }
  monthlyTransport = Math.round(monthlyTransport)

  // Food and extras
  const monthlyFood = Math.round(data.food.monthlyAmount)
  const customSpendingTotal = data.extras.customSpending.reduce((total, item) => total + item.monthlyAmount, 0)
  const mobilePhone = Math.round(data.extras.mobilePhone)
  const monthlyExtras = Math.round(mobilePhone + data.extras.gym + data.extras.streaming + customSpendingTotal)

  // No sponsorship tracking for mobile phone in simplified version

  const monthlyTotal =
    monthlyRent + monthlyUtilities + monthlySchooling + monthlyTransport + monthlyFood + monthlyExtras

  const monthlyYouPay = sponsorshipEnabled
    ? monthlyRentYouPay + monthlyUtilities + monthlySchooling + monthlyTransport + monthlyFood + monthlyExtras
    : monthlyTotal

  const monthlySponsorPay = sponsorshipEnabled ? monthlyRentSponsorPay : 0

  // Calculate savings
  const effectiveMonthlyTotal = sponsorshipEnabled ? monthlyYouPay : monthlyTotal
  const monthlySavings = monthlyIncomeAED - effectiveMonthlyTotal
  const savingsRate = monthlyIncomeAED > 0 ? (monthlySavings / monthlyIncomeAED) * 100 : 0

  return {
    upfront: {
      rentFirstCheque,
      brokerFee,
      dewaDeposit,
      coolingDeposit,
      gasDeposit,
      ejari,
      securityDeposit,
      appliances,
      movingServices,
      relocationServices,
      total: Math.round(upfrontTotal),
      youPay: sponsorshipEnabled ? Math.round(upfrontYouPay) : undefined,
      sponsorPay: sponsorshipEnabled ? Math.round(upfrontSponsorPay) : undefined,
    },
    monthly: {
      rent: monthlyRent,
      utilities: monthlyUtilities,
      schooling: monthlySchooling,
      transport: monthlyTransport,
      food: monthlyFood,
      extras: monthlyExtras,
      total: Math.round(monthlyTotal),
      youPay: sponsorshipEnabled ? Math.round(monthlyYouPay) : undefined,
      sponsorPay: sponsorshipEnabled ? Math.round(monthlySponsorPay) : undefined,
    },
    savings: {
      monthlyAmount: Math.round(monthlySavings),
      savingsRate,
    },
  }
}

// Helper functions for form defaults
export function calculateFoodSuggestion(adults: number, children: number): number {
  const FOOD_PER_ADULT = 1800
  const FOOD_PER_CHILD = 1200
  return adults * FOOD_PER_ADULT + children * FOOD_PER_CHILD
}

export function getPublicTransportCost(zones: number): number {
  const costs = { 1: 140, 2: 230, 3: 350 }
  return costs[zones as keyof typeof costs] || 140
}

// Sponsorship presets removed in simplified version
