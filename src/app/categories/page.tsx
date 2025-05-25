
"use client";

import React, { Suspense, lazy } from 'react';
import { PageWrapper } from '@/components/shared/PageWrapper';
import { PageHeader } from '@/components/shared/PageHeader';
import { CategoryList } from '@/components/categories/CategoryList';
import { useAppContext } from '@/contexts/AppContext';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const LazyAddCategoryDialog = lazy(() => import('@/components/categories/AddCategoryDialog'));
const LazyOnboardingFlow = lazy(() => import('@/components/onboarding/OnboardingFlow'));

export default function CategoriesPage() {
  const { isLoadingData, userHasOnboarded, markOnboardingComplete } = useAppContext();

  if (isLoadingData) {
    return (
      <div className="flex flex-col items-center justify-center flex-grow">
        <LoadingSpinner size={48} />
        <p className="mt-4 text-lg text-foreground">Loading categories...</p>
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
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-md shadow-sm -mx-4 md:-mx-6 pl-6 pr-4 md:pl-8 md:pr-6 py-3 mb-4">
        <PageHeader 
          title="Manage Categories" 
          // Actions prop removed, button moved below
        />
      </div>
      
      {/* Add Category Button Container - for mobile FAB and desktop static placement */}
      <div className="flex justify-end mb-4 md:hidden"> {/* Hidden on md and up to avoid double button if not placed in header for desktop */}
        {/* This div is primarily for the FAB on mobile. Desktop version is part of PageHeader actions. */}
        {/* Re-evaluating: the button itself has md:static, so it should be fine. */}
      </div>
      {/* The actual button, its own classes handle fixed vs static */}
      <div className="flex justify-end mb-4">
         <Suspense fallback={
            <Button variant="default" size="lg" className="fixed bottom-20 right-4 md:static md:bottom-auto md:right-auto rounded-full p-4 shadow-lg md:rounded-md md:p-2 md:shadow-none" disabled>
              <PlusCircle className="h-6 w-6 md:mr-2" />
              <span className="hidden md:inline">Add Category</span>
            </Button>
          }>
            <LazyAddCategoryDialog /> {/* Default trigger in dialog has the FAB classes */}
          </Suspense>
      </div>

      <CategoryList />
    </PageWrapper>
  );
}

