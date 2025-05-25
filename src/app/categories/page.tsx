
"use client";

import React, { Suspense, lazy } from 'react';
import { PageWrapper } from '@/components/shared/PageWrapper';
import { PageHeader } from '@/components/shared/PageHeader';
import { CategoryList } from '@/components/categories/CategoryList';
// import { AddCategoryDialog } from '@/components/categories/AddCategoryDialog'; // Lazy loaded
import { useAppContext } from '@/contexts/AppContext';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
// import OnboardingFlow from '@/components/onboarding/OnboardingFlow'; // Lazy loaded
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
      <PageHeader 
        title="Manage Categories" 
        actions={
          <Suspense fallback={
            <Button disabled>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Category
            </Button>
          }>
            <LazyAddCategoryDialog />
          </Suspense>
        } 
      />
      <CategoryList />
    </PageWrapper>
  );
}
