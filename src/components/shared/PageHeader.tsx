import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  actions?: ReactNode;
}

export function PageHeader({ title, actions }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-semibold md:text-3xl text-primary">{title}</h1>
      {actions && <div className="flex items-center space-x-2">{actions}</div>}
    </div>
  );
}
