import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, showPlusSignForPositive = true): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD', // This can be made dynamic if needed
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  if (showPlusSignForPositive && amount > 0) {
    return `+${formatter.format(amount)}`;
  }
  return formatter.format(amount);
}

export function parseCurrency(value: string): number {
  // Remove non-numeric characters except for decimal point and minus sign
  const numericString = value.replace(/[^0-9.-]+/g, "");
  return parseFloat(numericString);
}
