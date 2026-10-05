import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import type { CustomSpendingItem } from '../lib/budget-calculator'
import { formatNumber } from '../lib/format'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'

// Predefined categories with typical spending ranges
const PREDEFINED_CATEGORIES = [
  {
    value: 'haircut-salon',
    label: 'Haircut/Salon/Barbershop',
    typical: '100-500 AED',
  },
  { value: 'house-cleaning', label: 'House Cleaning', typical: '200-400 AED' },
  { value: 'car-wash', label: 'Car Wash', typical: '80-150 AED' },
  { value: 'pet-care', label: 'Pet Care', typical: '300-800 AED' },
  {
    value: 'personal-shopping',
    label: 'Personal Shopping',
    typical: 'Variable',
  },
  {
    value: 'weekend-activities',
    label: 'Weekend Activities',
    typical: '200-1000+ AED',
  },
  {
    value: 'travel-savings',
    label: 'Travel/Vacation Savings',
    typical: '500-2000 AED',
  },
  { value: 'other', label: 'Other (Custom)', typical: 'Variable' },
]

interface CustomSpendingTableProps {
  items: CustomSpendingItem[]
  onChange: (items: CustomSpendingItem[]) => void
}

export function CustomSpendingTable({ items, onChange }: CustomSpendingTableProps) {
  const [newItemCategory, setNewItemCategory] = useState('')
  const [newItemAmount, setNewItemAmount] = useState('')
  const [customCategoryName, setCustomCategoryName] = useState('')

  function addItem() {
    if (!newItemCategory || !newItemAmount) return

    const categoryLabel =
      newItemCategory === 'other'
        ? customCategoryName.trim()
        : PREDEFINED_CATEGORIES.find((cat) => cat.value === newItemCategory)?.label || newItemCategory

    if (newItemCategory === 'other' && !categoryLabel) return

    const newItem: CustomSpendingItem = {
      id: Date.now().toString(),
      category: categoryLabel,
      monthlyAmount: Number(newItemAmount),
      isCustom: newItemCategory === 'other',
    }

    onChange([...items, newItem])
    setNewItemCategory('')
    setNewItemAmount('')
    setCustomCategoryName('')
  }

  function removeItem(id: string) {
    onChange(items.filter((item) => item.id !== id))
  }

  function updateItemAmount(id: string, amount: number) {
    onChange(items.map((item) => (item.id === id ? { ...item, monthlyAmount: amount } : item)))
  }

  const selectedCategory = PREDEFINED_CATEGORIES.find((cat) => cat.value === newItemCategory)

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <h4 className="text-base font-medium">
          Add additional monthly expenses that aren&apos;t covered in other sections.
        </h4>
      </div>

      {/* Add New Item Form */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="category-select">Category</Label>
            <Select value={newItemCategory} onValueChange={setNewItemCategory}>
              <SelectTrigger id="category-select">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {PREDEFINED_CATEGORIES.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedCategory && <p className="text-muted-foreground text-xs">Typical: {selectedCategory.typical}</p>}
          </div>

          {newItemCategory === 'other' && (
            <div className="space-y-2">
              <Label htmlFor="custom-name">Custom Category Name</Label>
              <Input
                id="custom-name"
                placeholder="e.g., Massage therapy"
                value={customCategoryName}
                onChange={(e) => setCustomCategoryName(e.target.value)}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="amount">Monthly Amount (AED)</Label>
            <div className="flex gap-2">
              <Input
                id="amount"
                type="number"
                placeholder="0"
                value={newItemAmount}
                onChange={(e) => setNewItemAmount(e.target.value)}
              />
              <Button
                onClick={addItem}
                disabled={
                  !newItemCategory || !newItemAmount || (newItemCategory === 'other' && !customCategoryName.trim())
                }
                size="sm"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      {items.length > 0 && (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead className="w-32">Monthly Amount</TableHead>
                <TableHead className="w-16 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {item.category}
                    {item.isCustom && (
                      <span className="ml-2 rounded bg-blue-100 px-2 py-1 text-xs text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                        Custom
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={item.monthlyAmount || ''}
                      onChange={(e) => updateItemAmount(item.id, Number(e.target.value))}
                      className="w-24"
                    />
                  </TableCell>
                  <TableCell className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Summary */}
      {items.length > 0 && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-blue-900 dark:text-blue-100">Total Custom Spending:</span>
            <span className="font-semibold text-blue-900 dark:text-blue-100">
              AED {formatNumber(items.reduce((total, item) => total + item.monthlyAmount, 0))}
              /month
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
