"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { Group, Expense } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Receipt, Calendar, User, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { CreateExpenseDialog } from "@/components/expenses/CreateExpenseDialog";
import { EditExpenseDialog } from "@/components/expenses/EditExpenseDialog";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface GroupExpensesTabProps {
  group: Group;
  onUpdate: () => void;
}

export function GroupExpensesTab({ group, onUpdate }: GroupExpensesTabProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isCreateExpenseDialogOpen, setIsCreateExpenseDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deletingExpense, setDeletingExpense] = useState<Expense | null>(null);

  // Fetch group expenses
  const { data: expenses, isLoading, refetch } = useQuery({
    queryKey: ["group-expenses", group.id],
    queryFn: () => api.get<Expense[]>(`/expenses?groupId=${group.id}`),
  });

  // Delete expense mutation
  const deleteExpenseMutation = useMutation({
    mutationFn: (expenseId: string) => api.delete(`/expenses/${expenseId}`),
    onSuccess: () => {
      toast.success("Masraf başarıyla silindi!");
      queryClient.invalidateQueries({ queryKey: ["expenses"] }); // Invalidate all expenses for the main expenses page
      queryClient.invalidateQueries({ queryKey: ["group-expenses", group.id] });
      setDeletingExpense(null);
      refetch();
      onUpdate();
    },
    onError: (error: Error) => {
      toast.error(`Masraf silinemedi: ${error.message}`);
    },
  });

  const handleExpenseCreated = () => {
    refetch();
    onUpdate();
  };

  const isUserPayer = (expense: Expense) => {
    return user && expense.paidById === user.id;
  };

  const handleDeleteClick = (expense: Expense) => {
    if (!isUserPayer(expense)) {
      toast.error("Sadece masrafı ödeyen kişi silebilir!");
      return;
    }
    setDeletingExpense(expense);
  };

  const handleEditClick = (expense: Expense) => {
    if (!isUserPayer(expense)) {
      toast.error("Sadece masrafı ödeyen kişi düzenleyebilir!");
      return;
    }
    setEditingExpense(expense);
  };

  const confirmDelete = () => {
    if (deletingExpense) {
      deleteExpenseMutation.mutate(deletingExpense.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Grup Masrafları</CardTitle>
              <CardDescription>
                Toplam {expenses?.length || 0} masraf
              </CardDescription>
            </div>
            <Button onClick={() => setIsCreateExpenseDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Masraf Ekle
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-64" />
                  </div>
                  <Skeleton className="h-6 w-24" />
                </div>
              ))}
            </div>
          ) : expenses && expenses.length > 0 ? (
            <div className="space-y-3">
              {expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">{expense.description}</h4>
                      {expense.category && (
                        <Badge variant="secondary" className="text-xs">
                          {expense.category}
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-col gap-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>
                          Ödeyen: {expense.paidBy?.username || "Bilinmeyen"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {format(new Date(expense.date), "d MMMM yyyy, HH:mm", {
                            locale: tr,
                          })}
                        </span>
                      </div>
                      {expense.splits && expense.splits.length > 0 && (
                        <div className="flex items-center gap-2">
                          <Receipt className="w-4 h-4" />
                          <span>{expense.splits.length} kişi arasında bölündü</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <div className="text-right">
                      <p className="text-xl font-bold">
                        {expense.amount.toLocaleString("tr-TR", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{" "}
                        {expense.currency}
                      </p>
                      {expense.splits && expense.splits.length > 0 && (
                        <p className="text-sm text-gray-500 mt-1">
                          Kişi başı:{" "}
                          {(expense.amount / expense.splits.length).toLocaleString("tr-TR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}{" "}
                          {expense.currency}
                        </p>
                      )}
                    </div>
                    {isUserPayer(expense) && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditClick(expense)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClick(expense)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Receipt className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Henüz masraf yok</h3>
              <p className="mb-4">Bu grupta henüz hiç masraf eklenmemiş.</p>
              <Button onClick={() => setIsCreateExpenseDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                İlk Masrafı Ekle
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Expense Dialog */}
      <CreateExpenseDialog
        group={group}
        open={isCreateExpenseDialogOpen}
        onOpenChange={setIsCreateExpenseDialogOpen}
        onSuccess={handleExpenseCreated}
      />

      {/* Edit Expense Dialog */}
      {editingExpense && (
        <EditExpenseDialog
          expense={editingExpense}
          open={!!editingExpense}
          onOpenChange={(open) => !open && setEditingExpense(null)}
          onSuccess={() => {
            refetch();
            onUpdate();
            setEditingExpense(null);
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingExpense} onOpenChange={(open) => !open && setDeletingExpense(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Masrafı Sil</AlertDialogTitle>
            <AlertDialogDescription>
              Bu masrafı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
