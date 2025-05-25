"use client";

import type { Transaction } from "@/lib/types";
import { TransactionItem } from "./TransactionItem";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

interface TransactionListProps {
  transactions: Transaction[];
  title?: string;
  description?: string;
  emptyStateMessage?: string;
}

export function TransactionList({ 
  transactions, 
  title = "Recent Transactions",
  description,
  emptyStateMessage = "No transactions found."
}: TransactionListProps) {

  if (transactions.length === 0) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">{emptyStateMessage}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
       <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      <CardContent className="pt-0 md:pt-2">
        {transactions.map((transaction) => (
          <TransactionItem key={transaction.id} transaction={transaction} />
        ))}
      </CardContent>
    </Card>
  );
}
