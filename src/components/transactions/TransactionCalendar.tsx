"use client";

import { useState, useMemo } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { useAppContext } from "@/contexts/AppContext";
import type { Transaction } from "@/lib/types";
import { format, parseISO, isSameDay, startOfDay } from 'date-fns';
import { TransactionList } from './TransactionList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function TransactionCalendar() {
  const { transactions, getTransactionsByDate } = useAppContext();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const transactionDates = useMemo(() => {
    const dates = new Set<string>();
    transactions.forEach(t => dates.add(format(parseISO(t.date), 'yyyy-MM-dd')));
    return dates;
  }, [transactions]);

  const dailyTransactions: Transaction[] = selectedDate
    ? getTransactionsByDate(selectedDate)
    : [];

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date ? startOfDay(date) : undefined);
  };
  
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Calendar View</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            className="rounded-md"
            modifiers={{
              hasTransaction: (date) => transactionDates.has(format(date, 'yyyy-MM-dd'))
            }}
            modifiersStyles={{
              hasTransaction: { 
                fontWeight: 'bold', 
                textDecoration: 'underline',
                textDecorationColor: 'hsl(var(--primary))', // Use primary color for underline
                textDecorationThickness: '2px',
              }
            }}
          />
        </CardContent>
      </Card>
      
      <div>
        {selectedDate ? (
          <TransactionList
            transactions={dailyTransactions}
            title={`Transactions for ${format(selectedDate, "MMMM d, yyyy")}`}
            emptyStateMessage="No transactions for this day."
          />
        ) : (
          <Card className="shadow-sm h-full flex items-center justify-center">
            <CardContent>
              <p className="text-muted-foreground">Select a date to view transactions.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
