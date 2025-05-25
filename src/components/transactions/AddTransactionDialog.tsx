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
import { TransactionForm } from "./TransactionForm";
import { PlusCircle } from "lucide-react";
import type { Transaction } from "@/lib/types";

interface AddTransactionDialogProps {
  trigger?: React.ReactNode;
  transactionToEdit?: Transaction;
  onSuccess?: () => void;
}

export function AddTransactionDialog({ trigger, transactionToEdit, onSuccess }: AddTransactionDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSubmitSuccess = () => {
    setOpen(false);
    onSuccess?.();
  };

  const dialogTitle = transactionToEdit ? "Edit Transaction" : "Add New Transaction";
  const dialogDescription = transactionToEdit 
    ? "Update the details of your transaction."
    : "Record a new income or expense. Fill in the details below.";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="default" size="lg" className="fixed bottom-20 right-4 md:static md:bottom-auto md:right-auto rounded-full p-4 shadow-lg md:rounded-md md:p-2 md:shadow-none">
            <PlusCircle className="h-6 w-6 md:mr-2" />
            <span className="hidden md:inline">Add Transaction</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>
            {dialogDescription}
          </DialogDescription>
        </DialogHeader>
        <TransactionForm 
          transaction={transactionToEdit}
          onSubmitSuccess={handleSubmitSuccess}
          dialogFooter={
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" form="transaction-form-in-dialog"> {/* Connects to form inside TransactionForm */}
                {transactionToEdit ? "Save Changes" : "Add Transaction"}
              </Button>
            </DialogFooter>
          }
        />
         {/* This makes the TransactionForm's internal submit button work with the dialog footer */}
         <script dangerouslySetInnerHTML={{ __html: `
            setTimeout(() => {
              const form = document.querySelector('.sm\\:max-w-\\[425px\\].max-h-\\[90vh\\].overflow-y-auto form');
              if (form) {
                form.id = 'transaction-form-in-dialog';
              }
            }, 0);
          `}} />
      </DialogContent>
    </Dialog>
  );
}
