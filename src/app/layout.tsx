
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AppProviders } from '@/components/shared/AppProviders';
import { Toaster } from '@/components/ui/toaster';
import { MainAppShell } from '@/components/shared/MainAppShell';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/shared/ThemeProvider';

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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppProviders>
            <MainAppShell>{children}</MainAppShell>
            <Toaster />
          </AppProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
