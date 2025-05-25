
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAppContext } from "@/contexts/AppContext";
import type { Category } from "@/lib/types";
import type { ReactNode } from "react";

const formSchema = z.object({
  name: z.string().min(1, "Category name is required.").max(50, "Name too long"),
  type: z.enum(["income", "expense"], { required_error: "Type is required." }),
  // Icon field removed from schema
});

type CategoryFormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
  category?: Category;
  onSubmitSuccess?: () => void;
  dialogFooter?: ReactNode;
  formId?: string;
}

export function CategoryForm({ category, onSubmitSuccess, dialogFooter, formId }: CategoryFormProps) {
  const { addCategory, updateCategory } = useAppContext();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: category ? { name: category.name, type: category.type } : {
      name: "",
      type: "expense",
    },
  });

  function onSubmit(data: CategoryFormValues) {
    if (category) {
      // When updating, ensure existing icon is preserved if not part of form data
      updateCategory({ ...category, ...data });
    } else {
      // addCategory in context will assign a default icon if not provided
      addCategory(data);
    }
    onSubmitSuccess?.();
    if(!category) form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" id={formId}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Groceries, Salary" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

        {/* Icon Selection Field Removed */}
        
        {dialogFooter || <Button type="submit" className="w-full">{category ? "Update" : "Add"} Category</Button>}
      </form>
    </Form>
  );
}
