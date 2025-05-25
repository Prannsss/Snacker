import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  const formatter = new Intl.NumberFormat('en-PH', { // Philippines locale
    style: 'currency',
    currency: 'PHP', // Philippine Peso
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  // Intl.NumberFormat will handle negative signs appropriately (e.g., -₱100.00)
  // For positive values, it will just be ₱100.00.
  // Income and expenses from AppContext are positive values.
  return formatter.format(amount);
}

export function parseCurrency(value: string): number {
  // Remove non-numeric characters except for decimal point and minus sign
  const numericString = value.replace(/[^0-9.-]+/g, "");
  return parseFloat(numericString);
}
