"use client";

import type { ReactNode } from 'react';
import { AppProvider } from '@/contexts/AppContext';
import { TooltipProvider } from "@/components/ui/tooltip";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider>
      <AppProvider>
        {children}
      </AppProvider>
    </TooltipProvider>
  );
}
