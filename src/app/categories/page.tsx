"use client";

import { PageWrapper } from '@/components/shared/PageWrapper';
import { PageHeader } from '@/components/shared/PageHeader';
import { CategoryList } from '@/components/categories/CategoryList';
import { AddCategoryDialog } from '@/components/categories/AddCategoryDialog';
import { useAppContext } from '@/contexts/AppContext';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';

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
    return <OnboardingFlow onComplete={markOnboardingComplete} />;
  }

  return (
    <PageWrapper>
      <PageHeader title="Manage Categories" actions={<AddCategoryDialog />} />
      <CategoryList />
    </PageWrapper>
  );
}
