
export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  categoryId: string;
  date: string; // ISO string, e.g., "2023-10-26"
  notes?: string;
  isFavorite?: boolean; // For expenses
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  icon: string; // Lucide icon name
}

export interface StoredData {
  transactions: Transaction[];
  categories: Category[];
  userHasOnboarded?: boolean;
}
