
"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addMonths, subMonths } from 'date-fns';

interface MonthSwitcherProps {
  currentMonth: Date;
  onMonthChange: (newMonth: Date) => void;
}

export const MonthSwitcher = React.memo(function MonthSwitcher({ currentMonth, onMonthChange }: MonthSwitcherProps) {
  const handlePreviousMonth = () => {
    onMonthChange(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    onMonthChange(addMonths(currentMonth, 1));
  };

  return (
    <div className="flex items-center justify-center gap-4 py-2 my-4">
      <Button variant="ghost" size="icon" onClick={handlePreviousMonth} aria-label="Previous month">
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <span className="text-lg font-medium text-foreground select-none">
        {format(currentMonth, "MMMM yyyy")}
      </span>
      <Button variant="ghost" size="icon" onClick={handleNextMonth} aria-label="Next month">
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
});

