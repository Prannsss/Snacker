import type { Category } from './types';

export const LOCAL_STORAGE_KEY = 'snacker-app-data';

export const DEFAULT_INCOME_CATEGORIES: Category[] = [
  { id: 'salary', name: 'Salary', type: 'income', icon: 'Briefcase' },
  { id: 'freelance', name: 'Freelance', type: 'income', icon: 'Laptop' },
  { id: 'investment', name: 'Investment', type: 'income', icon: 'TrendingUp' },
  { id: 'gift_income', name: 'Gift', type: 'income', icon: 'Gift' },
  { id: 'other_income', name: 'Other', type: 'income', icon: 'PlusCircle' },
];

export const DEFAULT_EXPENSE_CATEGORIES: Category[] = [
  { id: 'food', name: 'Food & Drinks', type: 'expense', icon: 'Utensils' },
  { id: 'housing', name: 'Housing', type: 'expense', icon: 'Home' },
  { id: 'transport', name: 'Transport', type: 'expense', icon: 'Car' },
  { id: 'utilities', name: 'Utilities', type: 'expense', icon: 'Lightbulb' },
  { id: 'health', name: 'Health', type: 'expense', icon: 'HeartPulse' },
  { id: 'entertainment', name: 'Entertainment', type: 'expense', icon: 'Ticket' },
  { id: 'shopping', name: 'Shopping', type: 'expense', icon: 'ShoppingCart' },
  { id: 'education', name: 'Education', type: 'expense', icon: 'BookOpen' },
  { id: 'travel_expense', name: 'Travel', type: 'expense', icon: 'Plane' },
  { id: 'gift_expense', name: 'Gift', type: 'expense', icon: 'Gift' },
  { id: 'other_expense', name: 'Other', type: 'expense', icon: 'PlusCircle' },
];

export const ALL_DEFAULT_CATEGORIES: Category[] = [
  ...DEFAULT_INCOME_CATEGORIES,
  ...DEFAULT_EXPENSE_CATEGORIES,
];
