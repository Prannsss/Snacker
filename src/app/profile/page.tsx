
"use client";

import React, { useState, useMemo, useCallback, Suspense, lazy, useEffect, useRef } from 'react';
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
import Image from 'next/image'; // Keep for NextImage if used elsewhere, not for AvatarImage src
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency } from '@/lib/utils';


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
    setUsername,
    profilePictureDataUri,
    setProfilePicture
  } = useAppContext();
  
  const [profileName, setProfileName] = useState(username || ""); 
  const [isEditingName, setIsEditingName] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (username && !isEditingName) {
      setProfileName(username);
    } else if (!username && !isEditingName) {
      setProfileName(""); 
    }
  }, [username, isEditingName, setProfileName]);


  const [reportFilters, setReportFilters] = useState<TransactionFilters>({ 
    type: 'expense', 
    dateFrom: startOfMonth(new Date()), 
    dateTo: endOfMonth(new Date()),
  });


  const handleUsernameSet = (name: string) => {
    setUsername(name);
    setProfileName(name); 
    setIsEditingName(false); 
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
    setIsEditingName(false);
    toast({
      title: "Profile Updated",
      description: "Your name has been saved successfully.",
    });
  };

  const handleCancelEditName = () => {
    setIsEditingName(false);
    setProfileName(username || ""); 
  };

  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Upload Error",
          description: "Please select an image file.",
          variant: "destructive",
        });
        return;
      }
      // Basic size check (e.g., 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "Upload Error",
          description: "Image size should not exceed 2MB.",
          variant: "destructive",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
        toast({
          title: "Profile Picture Updated",
          description: "Your new profile picture has been saved.",
        });
      };
      reader.onerror = () => {
        toast({
          title: "Upload Error",
          description: "Could not read the selected file.",
          variant: "destructive",
        });
      };
      reader.readAsDataURL(file);
    }
    // Reset file input value to allow re-uploading the same file
    if (event.target) {
      event.target.value = "";
    }
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

    const doc = new jsPDF();
    const reportDate = format(new Date(), "MMMM d, yyyy");
    const filterDateFromString = reportFilters.dateFrom ? format(reportFilters.dateFrom, "MMM d, yyyy") : 'Start';
    const filterDateToString = reportFilters.dateTo ? format(reportFilters.dateTo, "MMM d, yyyy") : 'End';

    doc.setFontSize(18);
    doc.text("Snacker Expense Report", 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${reportDate}`, 14, 29);
    doc.text(`Filters Applied: ${filterDateFromString} to ${filterDateToString}`, 14, 36);
    if (reportFilters.categoryId) {
      const cat = getCategoryById(reportFilters.categoryId);
      doc.text(`Category: ${cat ? cat.name : 'Unknown'}`, 14, 43)
    }


    const tableColumn = ["Date", "Category", "Amount", "Notes"];
    const tableRows: (string | number)[][] = [];

    filteredExpenses.forEach(tx => {
      const categoryName = getCategoryById(tx.categoryId)?.name || "N/A";
      const notes = tx.notes || "";
      const transactionData = [
        format(parseISO(tx.date), "yyyy-MM-dd"),
        categoryName,
        formatCurrency(tx.amount), 
        notes
      ];
      tableRows.push(transactionData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: reportFilters.categoryId ? 50 : 43, // Adjust startY based on whether category filter text is present
      headStyles: { fillColor: [30, 105, 30] }, // Deep Green color for header
      styles: { font: "helvetica", fontSize: 10 },
      alternateRowStyles: { fillColor: [241, 248, 233] }, // Light green for alternate rows
    });
    
    doc.save(`snacker_expense_report_${format(new Date(), "yyyyMMdd_HHmmss")}.pdf`);

    toast({
      title: "Report Downloaded",
      description: "Your expense report has been successfully downloaded as a PDF.",
    });

  }, [filteredExpenses, getCategoryById, toast, reportFilters.dateFrom, reportFilters.dateTo, reportFilters.categoryId]);
  
  const handleManageData = () => {
    if (window.confirm("Are you sure you want to clear all your app data (transactions, categories, username, profile picture, and onboarding status)? This action cannot be undone.")) {
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

  if (userHasOnboarded && !username) { 
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
          <div className="flex items-center justify-between">
            <CardTitle>Your Profile</CardTitle>
            {!isEditingName && username && (
              <Button variant="outline" size="icon" onClick={() => setIsEditingName(true)}>
                <Edit3 className="h-4 w-4" />
                <span className="sr-only">Edit Name</span>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profilePictureDataUri || "https://placehold.co/100x100.png"} alt={profileName || 'User'} data-ai-hint="profile avatar" />
                <AvatarFallback>{profileName?.substring(0, 2).toUpperCase() || 'SN'}</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="icon" className="absolute bottom-0 right-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" onClick={handleImageUploadClick}>
                <Edit3 className="h-4 w-4" />
                <span className="sr-only">Upload Picture</span>
              </Button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
            </div>

            <div className="w-full max-w-xs text-center">
              {isEditingName ? (
                <div className="space-y-3">
                  <Label htmlFor="profileNameInput" className="font-medium text-sm text-muted-foreground">Edit Your Name</Label>
                  <Input
                    id="profileNameInput"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="mt-1 text-lg"
                    placeholder="Enter your name"
                  />
                  <div className="flex gap-2 mt-3 justify-center">
                    <Button onClick={handleSaveName}>
                      <Save className="mr-2 h-4 w-4" /> Save Name
                    </Button>
                    <Button variant="outline" onClick={handleCancelEditName}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-xl font-semibold">
                  {profileName || (
                    <span 
                      className="text-muted-foreground italic text-base font-normal cursor-pointer hover:underline"
                      onClick={() => setIsEditingName(true)}
                    >
                      Set your name
                    </span>
                  )}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Download Expense Report</CardTitle>
          <CardDescription>Filter and download your expense transactions as a PDF file.</CardDescription>
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
            <Download className="mr-2 h-4 w-4" /> Download PDF Report
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
             Warning: This will remove all your transactions, categories, username, profile picture, and onboarding status permanently.
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


    