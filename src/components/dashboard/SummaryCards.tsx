"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Scale } from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";
import { formatCurrency } from "@/lib/utils"; // Assuming you'll create this utility

interface SummaryCardsProps {
  currentMonth: Date;
}

export function SummaryCards({ currentMonth }: SummaryCardsProps) {
  const { getMonthlySummary } = useAppContext();
  const { income, expenses, balance } = getMonthlySummary(currentMonth);

  const summaryItems = [
    { title: "Total Income", value: income, icon: TrendingUp, color: "text-green-500", bgColor: "bg-green-100 dark:bg-green-900" },
    { title: "Total Expenses", value: expenses, icon: TrendingDown, color: "text-red-500", bgColor: "bg-red-100 dark:bg-red-900" },
    { title: "Balance", value: balance, icon: Scale, color: "text-blue-500", bgColor: "bg-blue-100 dark:bg-blue-900" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {summaryItems.map((item) => (
        <Card key={item.title} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{item.title}</CardTitle>
            <item.icon className={`h-5 w-5 ${item.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(item.value)}</div>
            {/* <p className="text-xs text-muted-foreground">+20.1% from last month</p> */}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
