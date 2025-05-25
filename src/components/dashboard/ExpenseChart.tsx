
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useAppContext } from "@/contexts/AppContext";
import { useIsMobile } from "@/hooks/use-mobile";

interface ExpenseChartProps {
  currentMonth: Date;
}

export const ExpenseChart = React.memo(function ExpenseChart({ currentMonth }: ExpenseChartProps) {
  const { getMonthlyExpenseDistribution } = useAppContext();
  const data = getMonthlyExpenseDistribution(currentMonth);
  const isMobile = useIsMobile();

  if (data.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Expense Distribution</CardTitle>
          <CardDescription>Monthly expense breakdown by category.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px] text-muted-foreground">
          No expenses recorded for this month.
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Expense Distribution</CardTitle>
        <CardDescription>Monthly expense breakdown by category.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={isMobile ? 80 : 100}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => {
                const percentageValue = percent * 100;
                if (isMobile) {
                  // On mobile, only show label if percentage is >= 5% to avoid clutter
                  if (percentageValue < 5) {
                    return null; // Don't render label for very small slices on mobile
                  }
                  return `${percentageValue.toFixed(0)}%`;
                }
                // On desktop, show name and percentage
                return `${name} ${percentageValue.toFixed(0)}%`;
              }}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill || `hsl(var(--chart-${(index % 5) + 1}))`} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [`${value.toFixed(2)}`, 'Amount']}
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                borderColor: "hsl(var(--border))",
                borderRadius: "var(--radius)",
                color: "hsl(var(--foreground))", // Keep for wrapper, just in case
              }}
              itemStyle={{ // Styles each "name: value" item in the tooltip
                color: "hsl(var(--foreground))",
              }}
              labelStyle={{ // Styles the main label/title of the tooltip
                color: "hsl(var(--foreground))",
              }}
            />
            <Legend layout={isMobile ? "horizontal" : "vertical"} verticalAlign={isMobile ? "bottom" : "middle"} align={isMobile ? "center" : "right"} wrapperStyle={isMobile ? {paddingTop: '10px'} : {}}/>
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
});
