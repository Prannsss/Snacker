import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageWrapperProps {
  children: ReactNode;
  className?: string;
}

export function PageWrapper({ children, className }: PageWrapperProps) {
  return (
    <div className={cn('flex flex-col flex-grow p-4 md:p-6 space-y-4 md:space-y-6', className)}>
      {children}
    </div>
  );
}
