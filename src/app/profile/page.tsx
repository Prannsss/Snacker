
"use client";

import React, { useState, useMemo, useCallback, Suspense, lazy } from 'react';
import { PageWrapper } from '@/components/shared/PageWrapper';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TransactionFilterBar, type TransactionFilters } from '@/components/transactions/TransactionFilter';
import { useAppContext } from '@/contexts/AppContext';
import type { Transaction } from '@/lib/types';
import { format, parseISO, startOfMonth, endOfMonth } from 'date-fns';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { LOCAL_STORAGE_KEY } from '@/lib/constants';

const LazyOnboardingFlow = lazy(() => import('@/components/onboarding/OnboardingFlow'));

export default function ProfilePage() {
  const { 
    transactions, 
    getCategoryById, 
    userHasOnboarded, 
    markOnboardingComplete, 
    isLoadingData 
  } = useAppContext();
  const [profileName, setProfileName] = useState("Guest User"); 
  const [reportFilters, setReportFilters] = useState<TransactionFilters>({ 
    type: 'expense', // Default to expense
    dateFrom: startOfMonth(new Date()), // Default date range
    dateTo: endOfMonth(new Date()),
  });
  const { toast } = useToast();

  const filteredExpenses = useMemo(() => {
    return transactions.filter(transaction => {
      if (transaction.type !== 'expense') return false; 

      if (reportFilters.type && reportFilters.type !== 'all' && transaction.type !== reportFilters.type) {
        // Even if filter allows 'all' or 'income', we only want expenses for this report.
        // This ensures if user changes filter type, report remains expenses.
        if (reportFilters.type !== 'expense') return false;
      }
      
      if (reportFilters.categoryId && transaction.categoryId !== reportFilters.categoryId) return false;
      
      const transactionDate = parseISO(transaction.date);
      if (reportFilters.dateFrom && transactionDate < startOfDay(reportFilters.dateFrom)) return false;
      if (reportFilters.dateTo && transactionDate > endOfDay(reportFilters.dateTo)) return false;

      if (reportFilters.searchTerm) {
        const searchTermLower = reportFilters.searchTerm.toLowerCase();
        const notesMatch = transaction.notes?.toLowerCase().includes(searchTermLower);
        const amountMatch = transaction.amount.toString().includes(searchTermLower);
        const category = getCategoryById(transaction.categoryId);
        const categoryNameMatch = category?.name.toLowerCase().includes(searchTermLower);
        if (!notesMatch && !amountMatch && !categoryNameMatch) return false;
      }
      return true;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Sort by date ascending for report
  }, [transactions, reportFilters, getCategoryById]);

  const handleDownloadReport = useCallback(() => {
    if (filteredExpenses.length === 0) {
      toast({
        title: "No Data",
        description: "There are no expenses matching your filters to download.",
        variant: "destructive",
      });
      return;
    }

    const headers = ["Date", "Category", "Amount", "Notes"];
    const csvRows = [
      headers.join(','),
      ...filteredExpenses.map(tx => {
        const categoryName = getCategoryById(tx.categoryId)?.name || "N/A";
        const notes = tx.notes ? `"${tx.notes.replace(/"/g, '""')}"` : ""; // Escape quotes and wrap in quotes
        return [
          format(parseISO(tx.date), "yyyy-MM-dd"),
          categoryName,
          tx.amount.toFixed(2),
          notes
        ].join(',');
      })
    ];
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `snacker_expense_report_${format(new Date(), "yyyyMMdd_HHmmss")}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast({
        title: "Report Downloaded",
        description: "Your expense report has been successfully downloaded.",
      });
    }
  }, [filteredExpenses, getCategoryById, toast]);
  
  const handleManageData = () => {
    if (window.confirm("Are you sure you want to clear all your app data (transactions and categories)? This action cannot be undone.")) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      toast({
        title: "Data Cleared",
        description: "All application data has been removed. The app will now reload.",
      });
      // Wait for toast to be visible before reloading
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };

  if (isLoadingData) {
    return (
      <div className="flex flex-col items-center justify-center flex-grow">
        <LoadingSpinner size={48} />
        <p className="mt-4 text-lg text-foreground">Loading profile...</p>
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
      <PageHeader title="Profile & Settings" />
      
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="profileName">Name</Label>
            <Input id="profileName" value={profileName} onChange={(e) => setProfileName(e.target.value)} disabled />
            <p className="text-sm text-muted-foreground mt-1">Profile editing is not yet available.</p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Manage Data</CardTitle>
          <CardDescription>Manage your application data stored in your browser.</CardDescription>
        </CardHeader>
        <CardContent>
           <Button variant="destructive" onClick={handleManageData}>Clear All App Data</Button>
           <p className="text-sm text-muted-foreground mt-2">
             Warning: This will remove all your transactions, categories, and onboarding status permanently.
           </p>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Download Expense Report</CardTitle>
          <CardDescription>Filter and download your expense transactions as a CSV file.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <TransactionFilterBar 
            onFilterChange={setReportFilters} 
            initialFilters={reportFilters} 
          />
          <p className="text-sm text-muted-foreground">
            {filteredExpenses.length} expense(s) match your current filters.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={handleDownloadReport} disabled={filteredExpenses.length === 0}>
            <Download className="mr-2 h-4 w-4" /> Download Report
          </Button>
        </CardFooter>
      </Card>
    </PageWrapper>
  );
}

// Helper for date range consistency
const startOfDay = (date: Date) => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

const endOfDay = (date: Date) => {
  const newDate = new Date(date);
  newDate.setHours(23, 59, 59, 999);
  return newDate;
};
