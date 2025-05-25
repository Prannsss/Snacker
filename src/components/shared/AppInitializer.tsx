
"use client";

import { useState, useEffect, type ReactNode } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils'; 

interface AppInitializerProps {
  children: ReactNode;
}

export function AppInitializer({ children }: AppInitializerProps) {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppReady(true);
    }, 2000); // 2 seconds

    // Cleanup timer if the component unmounts before the timeout
    return () => clearTimeout(timer);
  }, []);

  if (!isAppReady) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <Image
          src="/logo/Snaker.png" // Updated path
          alt="Snacker App Logo"
          width={150}
          height={150}
          priority 
        />
        <p className="mt-6 text-xl font-semibold text-primary animate-pulse">
          Loading Snacker...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
