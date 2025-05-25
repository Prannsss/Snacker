
"use client";

import React, { useState, useMemo, useEffect, Suspense, lazy } from 'react';
import { PageWrapper } from '@/components/shared/PageWrapper';
import { PageHeader } from '@/components/shared/PageHeader';
import { TransactionCalendar } from '@/components/transactions/TransactionCalendar';
import { TransactionList } from '@/components/transactions/TransactionList';
// import { AddTransactionDialog } from '@/components/transactions/AddTransactionDialog'; // Lazy loaded
import { TransactionFilterBar, type TransactionFilters } from '@/components/transactions/TransactionFilter';
import { useAppContext } from '@/contexts/AppContext';
import type { Transaction } from '@/lib/types';
import { parseISO, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
// import OnboardingFlow from '@/components/onboarding/OnboardingFlow'; // Lazy loaded
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const LazyAddTransactionDialog = lazy(() => import('@/components/transactions/AddTransactionDialog'));
const LazyOnboardingFlow = lazy(() => import('@/components/onboarding/OnboardingFlow'));

export default function TransactionsPage() {
  const { transactions: allTransactions, isLoadingData, userHasOnboarded, markOnboardingComplete } = useAppContext();
  const [filters, setFilters] = useState<TransactionFilters>({});

  const filteredTransactions = useMemo(() => {
    return allTransactions.filter(transaction => {
      if (filters.type && filters.type !== 'all' && transaction.type !== filters.type) return false;
      if (filters.categoryId && transaction.categoryId !== filters.categoryId) return false;
      
      const transactionDate = startOfDay(parseISO(transaction.date));
      if (filters.dateFrom && transactionDate < startOfDay(filters.dateFrom)) return false;
      if (filters.dateTo && transactionDate > endOfDay(filters.dateTo)) return false;

      if (filters.searchTerm) {
        const searchTermLower = filters.searchTerm.toLowerCase();
        const notesMatch = transaction.notes?.toLowerCase().includes(searchTermLower);
        const amountMatch = transaction.amount.toString().includes(searchTermLower);
        // Add category name search if needed
        if (!notesMatch && !amountMatch) return false;
      }
      return true;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort by date desc
  }, [allTransactions, filters]);


  if (isLoadingData) {
    return (
      <div className="flex flex-col items-center justify-center flex-grow">
        <LoadingSpinner size={48} />
        <p className="mt-4 text-lg text-foreground">Loading transactions...</p>
      </div>
    );
  }

  if (!userHasOnboarded) {
    return (
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center flex-grow">
          <LoadingSpinner size={48} />
        </div>
      }>
        <LazyOnboardingFlow onComplete={markOnboardingComplete} />
      </Suspense>
    );
  }

  return (
    <PageWrapper>
      <PageHeader 
        title="Transactions" 
        actions={
          <Suspense fallback={
            <Button variant="default" size="lg" className="fixed bottom-20 right-4 md:static md:bottom-auto md:right-auto rounded-full p-4 shadow-lg md:rounded-md md:p-2 md:shadow-none" disabled>
              <PlusCircle className="h-6 w-6 md:mr-2" />
              <span className="hidden md:inline">Add Transaction</span>
            </Button>
          }>
            <LazyAddTransactionDialog />
          </Suspense>
        } 
      />
      <TransactionFilterBar onFilterChange={setFilters} initialFilters={filters} />
      <TransactionCalendar />
      <div className="mt-6">
        <TransactionList 
          transactions={filteredTransactions} 
          title="Filtered Transactions"
          description={filteredTransactions.length > 0 ? `Showing ${filteredTransactions.length} transaction(s).` : ""}
          emptyStateMessage="No transactions match your current filters."
        />
      </div>
    </PageWrapper>
  );
}
