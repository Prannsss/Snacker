
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import * as LucideIcons from "lucide-react"; // Import all icons
import type { ReactNode } from "react";

const iconNames = Object.keys(LucideIcons).filter(key => key !== 'createLucideIcon' && key !== 'icons' && typeof LucideIcons[key as keyof typeof LucideIcons] === 'object');


const formSchema = z.object({
  name: z.string().min(1, "Category name is required.").max(50, "Name too long"),
  type: z.enum(["income", "expense"], { required_error: "Type is required." }),
  icon: z.string().min(1, "Icon is required."),
});

type CategoryFormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
  category?: Category;
  onSubmitSuccess?: () => void;
  dialogFooter?: ReactNode;
  formId?: string; // Added formId prop
}

export function CategoryForm({ category, onSubmitSuccess, dialogFooter, formId }: CategoryFormProps) {
  const { addCategory, updateCategory } = useAppContext();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: category || {
      name: "",
      type: "expense",
      icon: "Tag", // Default icon
    },
  });

  function onSubmit(data: CategoryFormValues) {
    if (category) {
      updateCategory({ ...category, ...data });
    } else {
      addCategory(data);
    }
    onSubmitSuccess?.();
    if(!category) form.reset();
  }
  
  const IconComponent = ({ iconName }: {iconName: string}) => {
    if (!(iconName in LucideIcons)) return <LucideIcons.Tag className="mr-2 h-4 w-4" />; // Fallback
    // @ts-ignore next-line
    const Icon = LucideIcons[iconName as keyof typeof LucideIcons] as LucideIcons.LucideIcon;
    return <Icon className="mr-2 h-4 w-4" />;
  };


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

        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Icon</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an icon" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-60">
                  {iconNames.map((iconName) => (
                    <SelectItem key={iconName} value={iconName} className="flex items-center">
                      <IconComponent iconName={iconName} />
                       <span>{iconName}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {dialogFooter || <Button type="submit" className="w-full">{category ? "Update" : "Add"} Category</Button>}
      </form>
    </Form>
  );
}
