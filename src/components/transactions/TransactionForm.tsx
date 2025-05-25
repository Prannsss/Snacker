
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CalendarIcon } from "lucide-react"; // Keep specific import if only one is needed
import { cn, formatCurrency, parseCurrency } from "@/lib/utils";
import { format, parseISO } from 'date-fns';
import { useAppContext } from "@/contexts/AppContext";
import type { Transaction, Category } from "@/lib/types";
import { Switch } from "@/components/ui/switch";
import type { ReactNode } from "react";
import * as LucideIcons from 'lucide-react';


const formSchema = z.object({
  type: z.enum(["income", "expense"], { required_error: "Type is required." }),
  amount: z.string().min(1, "Amount is required.").refine(value => !isNaN(parseCurrency(value)) && parseCurrency(value) > 0, "Amount must be a positive number."),
  categoryId: z.string().min(1, "Category is required."),
  date: z.date({ required_error: "Date is required." }),
  notes: z.string().optional(),
  isFavorite: z.boolean().optional(),
});

type TransactionFormValues = z.infer<typeof formSchema>;

interface TransactionFormProps {
  transaction?: Transaction;
  onSubmitSuccess?: () => void;
  dialogFooter?: ReactNode;
}

export function TransactionForm({ transaction, onSubmitSuccess, dialogFooter }: TransactionFormProps) {
  const { categories, addTransaction, updateTransaction, getCategoryById } = useAppContext();

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: transaction
      ? {
          type: transaction.type,
          amount: formatCurrency(transaction.amount, false),
          categoryId: transaction.categoryId,
          date: parseISO(transaction.date),
          notes: transaction.notes || "",
          isFavorite: transaction.isFavorite || false,
        }
      : {
          type: "expense",
          amount: "",
          categoryId: "",
          date: new Date(),
          notes: "",
          isFavorite: false,
        },
  });

  const transactionType = form.watch("type");

  const availableCategories = categories.filter(c => c.type === transactionType);

  function onSubmit(data: TransactionFormValues) {
    const numericAmount = parseCurrency(data.amount);
    if (isNaN(numericAmount)) {
      form.setError("amount", { type: "manual", message: "Invalid amount" });
      return;
    }

    const transactionData = {
      ...data,
      amount: numericAmount,
      date: format(data.date, "yyyy-MM-dd"),
    };

    if (transaction) {
      updateTransaction({ ...transaction, ...transactionData });
    } else {
      addTransaction(transactionData);
    }
    onSubmitSuccess?.();
    if (!transaction) form.reset(); // Reset only for new transactions
  }

  const IconComponent = ({ iconName }: {iconName?: string}) => {
    if (!iconName) {
      return <LucideIcons.Tag className="mr-2 h-4 w-4 text-muted-foreground" />;
    }
    const IconCandidate = LucideIcons[iconName as keyof typeof LucideIcons];

    if (typeof IconCandidate === 'function') {
      const Icon = IconCandidate as LucideIcons.LucideIcon;
      return <Icon className="mr-2 h-4 w-4" />;
    }
    // Fallback if not a function or not found
    return <LucideIcons.Tag className="mr-2 h-4 w-4 text-muted-foreground" />;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="income" />
                    </FormControl>
                    <FormLabel className="font-normal">Income</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="expense" />
                    </FormControl>
                    <FormLabel className="font-normal">Expense</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input 
                  placeholder="0.00" 
                  {...field} 
                  onChange={(e) => {
                    const value = e.target.value;
                    // Allow only numbers and one decimal point
                    if (/^\d*\.?\d*$/.test(value)) {
                       field.onChange(value);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableCategories.map((category: Category) => (
                    <SelectItem key={category.id} value={category.id} className="flex items-center">
                      <IconComponent iconName={category.icon} />
                      <span>{category.name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Add any notes here..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {transactionType === "expense" && (
           <FormField
            control={form.control}
            name="isFavorite"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Mark as Favorite</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )}
        
        {dialogFooter || <Button type="submit" className="w-full">{transaction ? "Update" : "Add"} Transaction</Button>}
      </form>
    </Form>
  );
}
