
"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CalendarIcon, FilterIcon, SearchIcon, XIcon } from "lucide-react";
import { format, parseISO, startOfMonth, endOfMonth } from 'date-fns';
import { useAppContext } from "@/contexts/AppContext";
import type { Transaction } from "@/lib/types";
import { cn } from '@/lib/utils';

export interface TransactionFilters {
  dateFrom?: Date;
  dateTo?: Date;
  type?: 'income' | 'expense' | 'all';
  categoryId?: string;
  searchTerm?: string;
}

interface TransactionFilterProps {
  onFilterChange: (filters: TransactionFilters) => void;
  initialFilters?: TransactionFilters;
}

const ALL_CATEGORIES_VALUE = "_all_"; 

export function TransactionFilterBar({ onFilterChange, initialFilters }: TransactionFilterProps) {
  const { categories } = useAppContext();
  const [filters, setFilters] = useState<TransactionFilters>(initialFilters || {
    type: 'all',
    dateFrom: startOfMonth(new Date()),
    dateTo: endOfMonth(new Date()),
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleInputChange = (name: keyof TransactionFilters, value: any) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name: 'dateFrom' | 'dateTo', date?: Date) => {
    handleInputChange(name, date);
  };
  
  const clearFilters = () => {
    const defaultFilters = {
      type: 'all' as const,
      dateFrom: startOfMonth(new Date()),
      dateTo: endOfMonth(new Date()),
      categoryId: undefined,
      searchTerm: undefined,
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const incomeCategories = categories.filter(c => c.type === 'income');
  const expenseCategories = categories.filter(c => c.type === 'expense');

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between pb-2 mb-4 border-b">
        <h3 className="text-lg font-semibold text-foreground">Filter Transactions</h3>
        <Button variant="ghost" size="icon" onClick={() => setShowFilters(!showFilters)} aria-expanded={showFilters} aria-controls="filter-controls">
          <FilterIcon className="h-5 w-5" />
          <span className="sr-only">{showFilters ? 'Hide filters' : 'Show filters'}</span>
        </Button>
      </div>
      {showFilters && (
        <div id="filter-controls" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Search Term */}
            <div className="space-y-1">
              <Label htmlFor="searchTerm">Search (Notes, Amount)</Label>
              <div className="relative">
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="searchTerm"
                  placeholder="Search..."
                  value={filters.searchTerm || ""}
                  onChange={(e) => handleInputChange('searchTerm', e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            {/* Type */}
            <div className="space-y-1">
              <Label>Type</Label>
              <RadioGroup
                value={filters.type}
                onValueChange={(value) => handleInputChange('type', value)}
                className="flex space-x-4 pt-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="type-all" />
                  <Label htmlFor="type-all" className="font-normal">All</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="income" id="type-income" />
                  <Label htmlFor="type-income" className="font-normal">Income</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="expense" id="type-expense" />
                  <Label htmlFor="type-expense" className="font-normal">Expense</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Category */}
             <div className="space-y-1">
              <Label htmlFor="categoryId">Category</Label>
              <Select
                value={filters.categoryId || ALL_CATEGORIES_VALUE}
                onValueChange={(value) => handleInputChange('categoryId', value === ALL_CATEGORIES_VALUE ? undefined : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_CATEGORIES_VALUE}>All Categories</SelectItem>
                  {incomeCategories.length > 0 && (
                    <SelectGroup>
                      <SelectLabel>Income</SelectLabel>
                      {incomeCategories.map(cat => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)}
                    </SelectGroup>
                  )}
                  {expenseCategories.length > 0 && (
                    <SelectGroup>
                      <SelectLabel>Expenses</SelectLabel>
                      {expenseCategories.map(cat => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)}
                    </SelectGroup>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Date From */}
            <div className="space-y-1">
              <Label htmlFor="dateFrom">Date From</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="dateFrom"
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !filters.dateFrom && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateFrom ? format(filters.dateFrom, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.dateFrom}
                    onSelect={(date) => handleDateChange('dateFrom', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Date To */}
            <div className="space-y-1">
              <Label htmlFor="dateTo">Date To</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="dateTo"
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !filters.dateTo && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateTo ? format(filters.dateTo, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.dateTo}
                    onSelect={(date) => handleDateChange('dateTo', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="flex justify-end">
            <Button variant="ghost" onClick={clearFilters} className="text-sm">
              <XIcon className="h-4 w-4 mr-1" /> Clear Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
