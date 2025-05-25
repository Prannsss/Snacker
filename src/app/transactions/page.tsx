
"use client";

import React, { useState, useMemo, useEffect, Suspense, lazy } from 'react';
import { PageWrapper } from '@/components/shared/PageWrapper';
import { PageHeader } from '@/components/shared/PageHeader';
// import { TransactionCalendar } from '@/components/transactions/TransactionCalendar'; // Lazy loaded
import { TransactionList } from '@/components/transactions/TransactionList';
import { TransactionFilterBar, type TransactionFilters } from '@/components/transactions/TransactionFilter';
import { useAppContext } from '@/contexts/AppContext';
import { parseISO, startOfDay, endOfDay } from 'date-fns';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const LazyAddTransactionDialog = lazy(() => import('@/components/transactions/AddTransactionDialog'));
const LazyOnboardingFlow = lazy(() => import('@/components/onboarding/OnboardingFlow'));
const LazyTransactionCalendar = lazy(() => 
  import('@/components/transactions/TransactionCalendar').then(module => ({ default: module.TransactionCalendar }))
);

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
      <Suspense fallback={
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="shadow-lg">
            <CardHeader><Skeleton className="h-6 w-1/2 mb-2" /></CardHeader>
            <CardContent className="flex justify-center h-[350px] items-center"><LoadingSpinner size={36} /></CardContent>
          </Card>
          <Card className="shadow-sm h-full flex items-center justify-center">
            <CardContent><Skeleton className="h-4 w-3/4" /></CardContent>
          </Card>
        </div>
      }>
        <LazyTransactionCalendar />
      </Suspense>
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
