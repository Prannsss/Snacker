
"use client";

import React, { Suspense, lazy } from 'react';
import { useAppContext } from "@/contexts/AppContext";
import type { Category } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import * as LucideIcons from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
// import { AddCategoryDialog } from "./AddCategoryDialog"; // Lazy loaded
import { Badge } from "@/components/ui/badge";

const LazyAddCategoryDialog = lazy(() => import('./AddCategoryDialog'));

export function CategoryList() {
  const { categories, deleteCategory } = useAppContext();

  const incomeCategories = categories.filter(c => c.type === 'income');
  const expenseCategories = categories.filter(c => c.type === 'expense');

  const handleDeleteCategory = (id: string) => {
    // Consider warning about transactions linked to this category
    deleteCategory(id);
  };
  
  const IconComponent = ({ iconName }: {iconName: string}) => {
    if (!(iconName in LucideIcons)) return <LucideIcons.Tag className="mr-2 h-4 w-4 text-muted-foreground" />; // Fallback
    // @ts-ignore next-line
    const Icon = LucideIcons[iconName as keyof typeof LucideIcons] as LucideIcons.LucideIcon;
    return <Icon className="mr-2 h-4 w-4 text-muted-foreground" />;
  };


  const renderCategoryList = (list: Category[], title: string) => (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {list.length === 0 ? (
          <p className="text-muted-foreground">No categories found.</p>
        ) : (
          <ul className="space-y-2">
            {list.map(cat => (
              <li key={cat.id} className="flex items-center justify-between p-2 border rounded-md hover:bg-muted/50">
                <div className="flex items-center">
                  <IconComponent iconName={cat.icon} />
                  <span>{cat.name}</span>
                </div>
                <div className="space-x-2">
                  <Suspense fallback={
                    <Button variant="ghost" size="icon" className="h-8 w-8" disabled>
                      <LucideIcons.Edit2 className="h-4 w-4" />
                    </Button>
                  }>
                    <LazyAddCategoryDialog 
                      categoryToEdit={cat}
                      trigger={
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <LucideIcons.Edit2 className="h-4 w-4" />
                        </Button>
                      }
                    />
                  </Suspense>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                       <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                        <LucideIcons.Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Deleting this category will not affect existing transactions linked to it, but you won't be able to assign it to new ones. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteCategory(cat.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {renderCategoryList(incomeCategories, "Income Categories")}
      {renderCategoryList(expenseCategories, "Expense Categories")}
    </div>
  );
}
