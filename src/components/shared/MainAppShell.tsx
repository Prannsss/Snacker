
"use client";

import type { ReactNode } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { BottomNavigation, DesktopSidebar } from '@/components/shared/BottomNavigation';
import { cn } from '@/lib/utils';

interface MainAppShellProps {
  children: ReactNode;
}

export function MainAppShell({ children }: MainAppShellProps) {
  const { userHasOnboarded, username, isLoadingData } = useAppContext();
  
  // Don't show navigation until data is loaded and user is fully onboarded
  const showNavigation = !isLoadingData && userHasOnboarded && !!username;

  return (
    <>
      <div className="flex flex-1">
        {showNavigation && <DesktopSidebar />}
        <main className={cn(
          "flex-1 flex flex-col",
          showNavigation ? "pb-16 md:pb-0" : "" // Conditional padding for mobile bottom nav
        )}>
          {children}
        </main>
      </div>
      {showNavigation && <BottomNavigation />}
    </>
  );
}
