
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ListChecks, Settings, Wallet, User } from 'lucide-react'; // Added User
import { cn } from '@/lib/utils';
import { LogoIcon } from '@/components/icons/LogoIcon';

const navItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/transactions', label: 'Transactions', icon: ListChecks },
  { href: '/categories', label: 'Categories', icon: Settings },
  { href: '/profile', label: 'Profile', icon: User }, // Added Profile item
];

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur-sm md:hidden">
      <div className="flex justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center flex-1 p-2 text-sm transition-colors',
                isActive ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <item.icon className={cn('h-6 w-6 mb-0.5', isActive ? 'stroke-[2.5px]' : '')} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function DesktopSidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden md:flex md:flex-col md:w-64 border-r bg-card">
      <div className="flex items-center h-16 px-6 border-b">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-primary">
          <Wallet className="w-7 h-7" />
          <span>Snacker</span>
        </Link>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-base transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground font-medium'
                  : 'text-foreground hover:bg-muted hover:text-accent-foreground'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
