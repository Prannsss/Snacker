
"use client";

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { Transaction, Category, StoredData } from '@/lib/types';
import { LOCAL_STORAGE_KEY, ALL_DEFAULT_CATEGORIES } from '@/lib/constants';
import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval, getMonth, getYear } from 'date-fns';

interface AppContextType {
  transactions: Transaction[];
  categories: Category[];
  isLoadingData: boolean;
  userHasOnboarded: boolean;
  username?: string;
  profilePictureDataUri?: string; // Added
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  addCategory: (category: Omit<Category, 'id' | 'icon'> & { icon?: string }) => Category;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  getCategoryById: (id: string) => Category | undefined;
  getTransactionsByDate: (date: Date) => Transaction[];
  getMonthlySummary: (date: Date) => { income: number; expenses: number; balance: number };
  getMonthlyExpenseDistribution: (date: Date) => { name: string; value: number; fill: string }[];
  getTransactionsForMonth: (date: Date) => Transaction[];
  getUniqueMonthsWithTransactions: () => Date[];
  markOnboardingComplete: () => void;
  setUsername: (name: string) => void;
  setProfilePicture: (dataUri: string) => void; // Added
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialStoredData: StoredData = {
  transactions: [],
  categories: ALL_DEFAULT_CATEGORIES,
  userHasOnboarded: false,
  username: undefined,
  profilePictureDataUri: undefined, // Initialize
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [storedData, setStoredData, isLoadingInitialData] = useLocalStorage<StoredData>(
    LOCAL_STORAGE_KEY,
    initialStoredData
  );
  const [isInitialized, setIsInitialized] = useState(false);

  // Ensure default categories are set if not present
  useEffect(() => {
    if (!isLoadingInitialData && !isInitialized) {
      setStoredData(prevData => {
        let categoriesUpdated = false;
        let currentCategories = prevData.categories || [];
        
        const existingCategoryIds = new Set(currentCategories.map(c => c.id));
        const categoriesToAdd = ALL_DEFAULT_CATEGORIES.filter(dc => !existingCategoryIds.has(dc.id));

        if (categoriesToAdd.length > 0) {
          currentCategories = [...currentCategories, ...categoriesToAdd];
          categoriesUpdated = true;
        }
        
        currentCategories = currentCategories.map(cat => {
          const defaultCat = ALL_DEFAULT_CATEGORIES.find(dc => dc.id === cat.id);
          if (defaultCat && !cat.icon) {
            categoriesUpdated = true;
            return { ...cat, icon: defaultCat.icon };
          }
          return cat;
        });

        if (categoriesUpdated) {
          return { ...prevData, categories: currentCategories };
        }
        return prevData;
      });
      setIsInitialized(true);
    }
  }, [isLoadingInitialData, setStoredData, isInitialized]);


  const transactions = storedData.transactions;
  const categories = storedData.categories;
  const userHasOnboarded = storedData.userHasOnboarded || false;
  const username = storedData.username;
  const profilePictureDataUri = storedData.profilePictureDataUri; // Get profile picture

  const isLoadingData = isLoadingInitialData || !isInitialized;

  const markOnboardingComplete = useCallback(() => {
    setStoredData(prev => ({ ...prev, userHasOnboarded: true }));
  }, [setStoredData]);

  const setUsername = useCallback((name: string) => {
    setStoredData(prev => ({ ...prev, username: name }));
  }, [setStoredData]);

  const setProfilePicture = useCallback((dataUri: string) => {
    setStoredData(prev => ({ ...prev, profilePictureDataUri: dataUri }));
  }, [setStoredData]);

  const addTransaction = useCallback((transaction: Omit<Transaction, 'id'>) => {
    setStoredData(prev => ({
      ...prev,
      transactions: [...prev.transactions, { ...transaction, id: crypto.randomUUID() }],
    }));
  }, [setStoredData]);

  const updateTransaction = useCallback((updatedTransaction: Transaction) => {
    setStoredData(prev => ({
      ...prev,
      transactions: prev.transactions.map(t => t.id === updatedTransaction.id ? updatedTransaction : t),
    }));
  }, [setStoredData]);

  const deleteTransaction = useCallback((id: string) => {
    setStoredData(prev => ({
      ...prev,
      transactions: prev.transactions.filter(t => t.id !== id),
    }));
  }, [setStoredData]);

  const addCategory = useCallback((categoryData: Omit<Category, 'id' | 'icon'> & { icon?: string }): Category => {
    const newCategory: Category = { 
      ...categoryData, 
      id: crypto.randomUUID(), 
      icon: categoryData.icon || 'Tag'
    };
    setStoredData(prev => ({
      ...prev,
      categories: [...prev.categories, newCategory],
    }));
    return newCategory;
  }, [setStoredData]);

  const updateCategory = useCallback((updatedCategory: Category) => {
    setStoredData(prev => ({
      ...prev,
      categories: prev.categories.map(c => c.id === updatedCategory.id ? updatedCategory : c),
    }));
  }, [setStoredData]);

  const deleteCategory = useCallback((id: string) => {
    setStoredData(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c.id !== id),
    }));
  }, [setStoredData]);

  const getCategoryById = useCallback((id: string) => {
    return categories.find(c => c.id === id);
  }, [categories]);

  const getTransactionsByDate = useCallback((date: Date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    return transactions.filter(t => t.date === formattedDate);
  }, [transactions]);

  const getTransactionsForMonth = useCallback((date: Date) => {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    return transactions.filter(t => {
      const transactionDate = parseISO(t.date);
      return isWithinInterval(transactionDate, { start: monthStart, end: monthEnd });
    });
  }, [transactions]);
  
  const getMonthlySummary = useCallback((date: Date) => {
    const monthlyTransactions = getTransactionsForMonth(date);
    const income = monthlyTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = monthlyTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    return { income, expenses, balance: income - expenses };
  }, [getTransactionsForMonth]);

  const getMonthlyExpenseDistribution = useCallback((date: Date) => {
    const monthlyExpenses = getTransactionsForMonth(date).filter(t => t.type === 'expense');
    const distribution: { [categoryId: string]: number } = {};
    monthlyExpenses.forEach(expense => {
      distribution[expense.categoryId] = (distribution[expense.categoryId] || 0) + expense.amount;
    });
    
    const baseHue = 90; 
    const baseSaturation = 39;
    const baseLightness = 31;

    return Object.entries(distribution).map(([categoryId, amount], index) => {
      const category = getCategoryById(categoryId);
      const fillHue = (baseHue + index * 30) % 360; 
      const fillLightness = baseLightness + (index % 2 === 0 ? 5 : -5); 
      const fillSaturation = baseSaturation + (index % 3 === 0 ? 5 : -5);
      return {
        name: category?.name || 'Unknown',
        value: amount,
        fill: `hsl(${fillHue}, ${fillSaturation}%, ${fillLightness}%)`
      };
    });
  }, [getTransactionsForMonth, getCategoryById]);

  const getUniqueMonthsWithTransactions = useCallback(() => {
    const uniqueMonthYears = new Set<string>();
    transactions.forEach(t => {
      const date = parseISO(t.date);
      uniqueMonthYears.add(`${getYear(date)}-${getMonth(date)}`);
    });
    return Array.from(uniqueMonthYears)
      .map(myStr => {
        const [year, month] = myStr.split('-').map(Number);
        return new Date(year, month, 1);
      })
      .sort((a, b) => b.getTime() - a.getTime());
  }, [transactions]);


  return (
    <AppContext.Provider value={{ 
      transactions, 
      categories, 
      isLoadingData,
      userHasOnboarded,
      username,
      profilePictureDataUri, // Provide profile picture
      addTransaction, 
      updateTransaction, 
      deleteTransaction, 
      addCategory, 
      updateCategory, 
      deleteCategory,
      getCategoryById,
      getTransactionsByDate,
      getMonthlySummary,
      getMonthlyExpenseDistribution,
      getTransactionsForMonth,
      getUniqueMonthsWithTransactions,
      markOnboardingComplete,
      setUsername,
      setProfilePicture // Provide setProfilePicture
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
