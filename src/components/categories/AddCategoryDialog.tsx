
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
