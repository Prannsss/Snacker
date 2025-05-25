
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
  const formId = "category-form-in-dialog"; // Define a consistent form ID

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
          <Button variant="default" size="lg" className="fixed bottom-20 right-4 md:static md:bottom-auto md:right-auto rounded-full p-4 shadow-lg md:rounded-md md:p-2 md:shadow-none">
            <PlusCircle className="h-6 w-6 md:mr-2" />
            <span className="hidden md:inline">Add Category</span>
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
          formId={formId} // Pass the formId to CategoryForm
          dialogFooter={
            <DialogFooter>
               <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" form={formId}> {/* Use the formId here */}
                {categoryToEdit ? "Save Changes" : "Add Category"}
              </Button>
            </DialogFooter>
          }
        />
      </DialogContent>
    </Dialog>
  );
}
