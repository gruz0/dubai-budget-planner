import { type ApplianceItem, type BudgetData, defaultRentStartDate } from './budget-calculator'

const DEFAULT_APPLIANCES: ApplianceItem[] = [
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
      notes: 'Mid-range models typically AED 1,500-4,000. Price varies by size, brand, and features.',
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
]

export const initialBudgetData: BudgetData = {
  preferences: {
    displayCurrency: 'AED',
    exchangeRate: 3.67,
    ignoreEmptyValues: true,
    visibleSections: {
      household: false,
      food: false,
      extras: false,
      moving: false,
    },
  },
  income: {
    monthlyAmount: 15000,
    currency: 'AED',
    exchangeRate: 3.67,
  },
  sponsorship: {
    enabled: false,
  },
  rent: {
    annualRent: 80000,
    rentStartDate: defaultRentStartDate(),
    numberOfCheques: 4,
    securityDeposit: {
      type: 'percentage',
      value: 5,
    },
    ejari: {
      type: 'online',
    },
    // TODO: Add area and building
    area: '',
    building: '',
  },
  broker: {
    type: 'percentage',
    percentage: 5,
    fixedAmount: 0,
  },
  appliances: {
    items: DEFAULT_APPLIANCES,
    totalAmount: 0,
  },
  utilities: {
    dewa: {
      enabled: true,
      deposit: 2000,
      monthlyUsage: 600,
    },
    districtCooling: {
      enabled: false,
      deposit: 2000,
      monthlyAmount: 400,
    },
    internet: {
      enabled: false,
      provider: 'du',
      monthlyAmount: 320,
    },
    gas: {
      enabled: false,
      deposit: 750,
      monthlyAmount: 30,
    },
  },
  household: {
    adults: 1,
    children: 0,
    childrenAges: [],
    nursery: false,
  },
  transport: {
    type: 'none',
    carRental: {
      category: 'sedan',
      monthlyAmount: 2600,
      salikCrossings: 20,
      fuelKmPerMonth: 1500,
    },
    publicTransport: {
      zones: 1,
      monthlyAmount: 140,
    },
  },
  food: {
    monthlyAmount: 0,
  },
  extras: {
    mobilePhone: 0,
    gym: 0,
    streaming: 0,
    customSpending: [],
  },
  movingServices: {
    amount: 0,
  },
  relocationServices: {
    planeTickets: {
      enabled: false,
      adults: 2,
      adultCost: 2500,
      children: 0,
      childrenCost: 2000,
    },
    temporaryStay: {
      enabled: false,
      nights: 7,
      costPerNight: 400,
    },
    airportTransfer: {
      enabled: false,
      trips: 2,
      costPerTrip: 100,
    },
    visaMedicals: {
      enabled: false,
      adults: 2,
      adultCost: 4500,
      children: 0,
      childrenCost: 3000,
    },
    pets: {
      enabled: false,
      count: 0,
      costPerPet: 10000,
    },
  },
}
