import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AppProviders } from '@/components/shared/AppProviders';
import { Toaster } from '@/components/ui/toaster';
import { BottomNavigation, DesktopSidebar } from '@/components/shared/BottomNavigation';
import { cn } from '@/lib/utils';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Snacker - Expense Tracker',
  description: 'Track your income and expenses with Snacker.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          `${geistSans.variable} ${geistMono.variable} antialiased font-sans`,
          'flex flex-col min-h-screen'
        )}
      >
        <AppProviders>
          <div className="flex flex-1">
            <DesktopSidebar />
            <main className="flex-1 flex flex-col pb-16 md:pb-0"> {/* Padding bottom for mobile nav */}
              {children}
            </main>
          </div>
          <BottomNavigation />
          <Toaster />
        </AppProviders>
      </body>
    </html>
  );
}
