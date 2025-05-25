"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useAppContext } from "@/contexts/AppContext";
import { useIsMobile } from "@/hooks/use-mobile";

interface ExpenseChartProps {
  currentMonth: Date;
}

export function ExpenseChart({ currentMonth }: ExpenseChartProps) {
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
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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
              }}
            />
            <Legend layout={isMobile ? "horizontal" : "vertical"} verticalAlign={isMobile ? "bottom" : "middle"} align={isMobile ? "center" : "right"} wrapperStyle={isMobile ? {paddingTop: '10px'} : {}}/>
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
