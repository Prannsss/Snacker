
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { formatCurrency } from "@/lib/utils";

interface SummaryCardsProps {
  currentMonth: Date;
}

export function SummaryCards({ currentMonth }: SummaryCardsProps) {
  const { getMonthlySummary } = useAppContext();
  const { income, expenses, balance } = getMonthlySummary(currentMonth);

  return (
    <div className="space-y-4">
      {/* Top Row: Combined Balance Card */}
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Balance</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 pb-4">
          <div className="text-3xl font-bold mb-4">{formatCurrency(balance)}</div>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-muted-foreground">Income</p>
              <p className="text-lg font-semibold text-green-500 dark:text-green-400">{formatCurrency(income)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Expenses</p>
              <p className="text-lg font-semibold text-red-500 dark:text-red-400">{formatCurrency(expenses)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Row: Income and Expense Cards in a grid */}
      <div className="grid grid-cols-2 gap-4"> {/* Changed from grid-cols-1 md:grid-cols-2 */}
        {/* Income Card */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="pt-4 pb-4 text-center">
            <TrendingUp className="h-8 w-8 text-green-500 dark:text-green-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-muted-foreground mb-1">This Month</p>
            <div className="text-2xl font-bold text-green-500 dark:text-green-400">{formatCurrency(income)}</div>
          </CardContent>
        </Card>

        {/* Expense Card */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="pt-4 pb-4 text-center">
            <TrendingDown className="h-8 w-8 text-red-500 dark:text-red-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-muted-foreground mb-1">This Month</p>
            <div className="text-2xl font-bold text-red-500 dark:text-red-400">{formatCurrency(expenses)}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
