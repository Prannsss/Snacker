
"use client";

import React, { useState, useEffect, Suspense, lazy } from 'react';
import { PageWrapper } from '@/components/shared/PageWrapper';
import { PageHeader } from '@/components/shared/PageHeader';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { ExpenseChart } from '@/components/dashboard/ExpenseChart';
import { MonthSwitcher } from '@/components/dashboard/MonthSwitcher';
// import { AddTransactionDialog } from '@/components/transactions/AddTransactionDialog'; // Lazy loaded
import { TransactionList } from '@/components/transactions/TransactionList';
import { useAppContext } from '@/contexts/AppContext';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
// import OnboardingFlow from '@/components/onboarding/OnboardingFlow'; // Lazy loaded
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const LazyAddTransactionDialog = lazy(() => import('@/components/transactions/AddTransactionDialog'));
const LazyOnboardingFlow = lazy(() => import('@/components/onboarding/OnboardingFlow'));


export default function DashboardPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { transactions, getTransactionsForMonth, isLoadingData, userHasOnboarded, markOnboardingComplete } = useAppContext();

  const monthlyTransactions = getTransactionsForMonth(currentMonth);
  
  // Sort transactions by date, most recent first
  const sortedTransactions = [...monthlyTransactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());


  if (isLoadingData) {
    return (
      <div className="flex flex-col items-center justify-center flex-grow">
        <LoadingSpinner size={48} />
        <p className="mt-4 text-lg text-foreground">Loading dashboard...</p>
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
        title="Dashboard" 
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
      <MonthSwitcher currentMonth={currentMonth} onMonthChange={setCurrentMonth} />
      <SummaryCards currentMonth={currentMonth} />
      <div className="grid md:grid-cols-2 gap-6">
        <ExpenseChart currentMonth={currentMonth} />
        <TransactionList 
          transactions={sortedTransactions.slice(0, 5)} // Show recent 5 for dashboard
          title="Recent Transactions"
          description="Latest income and expenses for this month."
          emptyStateMessage="No transactions this month."
        />
      </div>
    </PageWrapper>
  );
}
