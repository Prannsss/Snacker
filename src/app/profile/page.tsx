
"use client";

import React, { useState, useMemo, useCallback, Suspense, lazy, useEffect } from 'react';
import { PageWrapper } from '@/components/shared/PageWrapper';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TransactionFilterBar, type TransactionFilters } from '@/components/transactions/TransactionFilter';
import { useAppContext } from '@/contexts/AppContext';
import type { Transaction } from '@/lib/types';
import { format, parseISO, startOfMonth, endOfMonth } from 'date-fns';
import { Download, Edit3, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { LOCAL_STORAGE_KEY } from '@/lib/constants';
import Image from 'next/image';

const LazyOnboardingFlow = lazy(() => import('@/components/onboarding/OnboardingFlow'));
const LazyUsernamePrompt = lazy(() => import('@/components/onboarding/UsernamePrompt'));


export default function ProfilePage() {
  const { 
    transactions, 
    getCategoryById, 
    userHasOnboarded, 
    markOnboardingComplete, 
    isLoadingData,
    username, 
    setUsername 
  } = useAppContext();
  
  const [profileName, setProfileName] = useState(username || ""); 
  const { toast } = useToast();
  
  useEffect(() => {
    // Initialize profileName from context or keep local changes if any
    if (username && profileName !== username) {
        // This ensures that if username changes in context (e.g. after clearing data),
        // the input field reflects it, unless user is actively editing.
        // For now, let's keep it simple: if username exists and profileName is empty, set it.
        if(profileName === "") setProfileName(username);
    } else if (!username && profileName === "") {
        setProfileName("Guest User");
    }
  }, [username, profileName]);

  const [reportFilters, setReportFilters] = useState<TransactionFilters>({ 
    type: 'expense', 
    dateFrom: startOfMonth(new Date()), 
    dateTo: endOfMonth(new Date()),
  });


  const handleUsernameSet = (name: string) => {
    setUsername(name);
    setProfileName(name); 
  };

  const handleSaveName = () => {
    if (profileName.trim().length < 3) {
      toast({
        title: "Validation Error",
        description: "Name must be at least 3 characters long.",
        variant: "destructive",
      });
      return;
    }
    setUsername(profileName.trim());
    toast({
      title: "Profile Updated",
      description: "Your name has been saved successfully.",
    });
  };

  const filteredExpenses = useMemo(() => {
    return transactions.filter(transaction => {
      if (transaction.type !== 'expense') return false; 

      if (reportFilters.type && reportFilters.type !== 'all' && transaction.type !== reportFilters.type) {
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
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
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
        const notes = tx.notes ? `"${tx.notes.replace(/"/g, '""')}"` : "";
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
    if (window.confirm("Are you sure you want to clear all your app data (transactions, categories, username, and onboarding status)? This action cannot be undone.")) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      toast({
        title: "Data Cleared",
        description: "All application data has been removed. The app will now reload.",
      });
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };

  if (isLoadingData) {
    return (
      <div className="flex flex-col items-center justify-center flex-grow min-h-screen">
        <LoadingSpinner size={48} />
        <p className="mt-4 text-lg text-foreground">Loading profile...</p>
      </div>
    );
  }

  if (!userHasOnboarded) {
    return (
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center flex-grow min-h-screen">
          <LoadingSpinner size={48} />
        </div>
      }>
        <LazyOnboardingFlow onComplete={markOnboardingComplete} />
      </Suspense>
    );
  }

  if (userHasOnboarded && !username) { // Check username from context directly
     return (
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center flex-grow min-h-screen">
          <LoadingSpinner size={48} />
        </div>
      }>
        <LazyUsernamePrompt onUsernameSet={handleUsernameSet} />
      </Suspense>
    );
  }


  return (
    <PageWrapper>
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-md shadow-sm -mx-4 md:-mx-6 pl-6 pr-4 md:pl-8 md:pr-6 py-3 mb-4">
        <PageHeader title="Profile & Settings" />
      </div>
      
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
            <div className="relative group">
              <Avatar className="h-24 w-24">
                <AvatarImage src="https://placehold.co/96x96.png" alt={profileName} data-ai-hint="profile avatar" />
                <AvatarFallback>{profileName.substring(0, 2).toUpperCase() || 'SN'}</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="icon" className="absolute bottom-0 right-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => toast({ title: "Feature Coming Soon", description: "Profile picture uploads will be available in a future update."})}>
                <Edit3 className="h-4 w-4" />
                <span className="sr-only">Upload Picture</span>
              </Button>
            </div>
            <div className="flex-grow w-full sm:w-auto">
              <Label htmlFor="profileName">Name</Label>
              <Input 
                id="profileName" 
                value={profileName} 
                onChange={(e) => setProfileName(e.target.value)} 
                className="mt-1"
              />
              <Button onClick={handleSaveName} className="mt-3 w-full sm:w-auto">
                <Save className="mr-2 h-4 w-4" /> Save Name
              </Button>
            </div>
          </div>
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

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Manage Data</CardTitle>
          <CardDescription>Manage your application data stored in your browser.</CardDescription>
        </CardHeader>
        <CardContent>
           <Button variant="destructive" onClick={handleManageData}>Clear All App Data</Button>
           <p className="text-sm text-muted-foreground mt-2">
             Warning: This will remove all your transactions, categories, username, and onboarding status permanently.
           </p>
        </CardContent>
      </Card>
    </PageWrapper>
  );
}

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


    