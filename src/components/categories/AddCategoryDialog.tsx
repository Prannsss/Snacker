
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { CategoryForm } from "./CategoryForm";
import type { Category } from "@/lib/types";
import { PlusCircle } from "lucide-react";

interface AddCategoryDialogProps {
  categoryToEdit?: Category;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export default function AddCategoryDialog({ categoryToEdit, trigger, onSuccess }: AddCategoryDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSubmitSuccess = () => {
    setOpen(false);
    onSuccess?.();
  };
  
  const dialogTitle = categoryToEdit ? "Edit Category" : "Add New Category";
  const dialogDescription = categoryToEdit 
    ? "Update the details of your category."
    : "Create a new category for your income or expenses.";


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Category
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>
            {dialogDescription}
          </DialogDescription>
        </DialogHeader>
        <CategoryForm
          category={categoryToEdit}
          onSubmitSuccess={handleSubmitSuccess}
          dialogFooter={
            <DialogFooter>
               <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" form="category-form-in-dialog">
                {categoryToEdit ? "Save Changes" : "Add Category"}
              </Button>
            </DialogFooter>
          }
        />
        {/* This makes the CategoryForm's internal submit button work with the dialog footer */}
        <script dangerouslySetInnerHTML={{ __html: `
            setTimeout(() => {
              const form = document.querySelector('.sm\\:max-w-\\[425px\\] form');
              if (form) {
                form.id = 'category-form-in-dialog';
              }
            }, 0);
          `}} />
      </DialogContent>
    </Dialog>
  );
}
