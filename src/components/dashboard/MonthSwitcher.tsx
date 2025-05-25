"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addMonths, subMonths, getMonth, getYear } from 'date-fns';
import { useAppContext } from "@/contexts/AppContext";

interface MonthSwitcherProps {
  currentMonth: Date;
  onMonthChange: (newMonth: Date) => void;
}

export function MonthSwitcher({ currentMonth, onMonthChange }: MonthSwitcherProps) {
  const { getUniqueMonthsWithTransactions } = useAppContext();
  const availableMonths = getUniqueMonthsWithTransactions();

  // Ensure currentMonth is always an option, even if no transactions
  const currentMonthStr = format(currentMonth, "yyyy-MM");
  const currentMonthOption = {
    value: currentMonthStr,
    label: format(currentMonth, "MMMM yyyy")
  };

  const monthOptions = [
    currentMonthOption,
    ...availableMonths
      .map(date => ({
        value: format(date, "yyyy-MM"),
        label: format(date, "MMMM yyyy")
      }))
      .filter(option => option.value !== currentMonthStr) // Remove duplicate if currentMonth had transactions
  ];
  
  // Sort unique month options to ensure correct order
  monthOptions.sort((a, b) => new Date(b.value).getTime() - new Date(a.value).getTime());


  const handlePreviousMonth = () => {
    onMonthChange(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    onMonthChange(addMonths(currentMonth, 1));
  };

  const handleSelectMonth = (value: string) => {
    const [year, month] = value.split('-').map(Number);
    onMonthChange(new Date(year, month -1, 1)); // month is 0-indexed in JS Date
  };

  return (
    <div className="flex items-center justify-between gap-2 p-2 rounded-md bg-card border">
      <Button variant="outline" size="icon" onClick={handlePreviousMonth} aria-label="Previous month">
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Select value={format(currentMonth, "yyyy-MM")} onValueChange={handleSelectMonth}>
        <SelectTrigger className="w-full md:w-[200px] text-center font-medium text-lg">
          <SelectValue placeholder="Select month" />
        </SelectTrigger>
        <SelectContent>
          {monthOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button variant="outline" size="icon" onClick={handleNextMonth} aria-label="Next month">
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
