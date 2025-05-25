
"use client";

import React, { Suspense, lazy } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Transaction } from "@/lib/types";
import { useAppContext } from "@/contexts/AppContext";
import { formatCurrency, cn } from "@/lib/utils";
import { format, parseISO } from 'date-fns';
import * as LucideIcons from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
// import { AddTransactionDialog } from "./AddTransactionDialog"; // Lazy loaded
import { Star } from 'lucide-react';

const LazyAddTransactionDialog = lazy(() => import('./AddTransactionDialog'));


export function TransactionItem({ transaction }: { transaction: Transaction }) {
  const { getCategoryById, deleteTransaction } = useAppContext();
  const category = getCategoryById(transaction.categoryId);

  const IconComponent = category?.icon && (LucideIcons[category.icon as keyof typeof LucideIcons] as LucideIcons.LucideIcon);
  const displayIcon = IconComponent ? <IconComponent className="h-6 w-6 mr-3 text-muted-foreground" /> : <LucideIcons.Tag className="h-6 w-6 mr-3 text-muted-foreground" />;

  const handleDelete = () => {
    deleteTransaction(transaction.id);
  };

  return (
    <Card className="mb-2 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-3 flex items-center justify-between">
        <div className="flex items-center">
          {displayIcon}
          <div>
            <p className="font-medium">{category?.name || 'Uncategorized'}</p>
            <p className="text-xs text-muted-foreground">
              {transaction.notes || format(parseISO(transaction.date), "MMM d, yyyy")}
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <div className="text-right mr-3">
            <p className={cn("font-semibold", transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400')}>
              {transaction.type === 'income' ? '+' : '-'}
              {formatCurrency(transaction.amount)}
            </p>
            {transaction.isFavorite && transaction.type === 'expense' && (
              <Star className="h-3 w-3 text-yellow-500 fill-yellow-400 inline-block" />
            )}
          </div>
          
          <Suspense fallback={
            <Button variant="ghost" size="icon" className="h-8 w-8" disabled>
              <LucideIcons.Edit2 className="h-4 w-4" />
            </Button>
          }>
            <LazyAddTransactionDialog 
              transactionToEdit={transaction}
              trigger={
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <LucideIcons.Edit2 className="h-4 w-4" />
                </Button>
              }
            />
          </Suspense>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                <LucideIcons.Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete this transaction.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className={buttonVariants({variant: "destructive"})}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

        </div>
      </CardContent>
    </Card>
  );
}

// Helper, as it's not in shadcn by default
const buttonVariants = ({variant}: {variant: string}) => {
  if(variant === "destructive") return "bg-destructive text-destructive-foreground hover:bg-destructive/90"
  return ""
}
