"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { Expense, Group } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { Plus, Receipt, Calendar, User, Search, Filter, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { EditExpenseDialog } from "@/components/expenses/EditExpenseDialog";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function ExpensesPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deletingExpense, setDeletingExpense] = useState<Expense | null>(null);

  // Fetch all expenses
  const { data: expenses, isLoading: expensesLoading, refetch } = useQuery({
    queryKey: ["expenses"],
    queryFn: () => api.get<Expense[]>("/expenses"),
  });

  // Fetch all groups for filter
  const { data: groups } = useQuery({
    queryKey: ["groups"],
    queryFn: () => api.get<Group[]>("/groups"),
  });

  // Delete expense mutation
  const deleteExpenseMutation = useMutation({
    mutationFn: (expenseId: string) => api.delete(`/expenses/${expenseId}`),
    onSuccess: () => {
      toast.success("Masraf başarıyla silindi!");
      queryClient.invalidateQueries({ queryKey: ["expenses"] }); // Invalidate all expenses queries
      setDeletingExpense(null);
    },
    onError: (error: Error) => {
      toast.error(`Masraf silinemedi: ${error.message}`);
    },
  });

  // Filter expenses
  const filteredExpenses = expenses?.filter((expense) => {
    const matchesSearch = expense.description
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesGroup = selectedGroup === "all" || expense.groupId === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  // Calculate total
  const totalAmount = filteredExpenses?.reduce((sum, exp) => sum + exp.amount, 0) || 0;

  // Check if user is the payer of an expense
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
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Masraflar</h1>
          <p className="text-gray-500 mt-1">Tüm masraflarınızı görüntüleyin ve yönetin</p>
        </div>
      </div>

      {/* Stats Card */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Toplam Masraf</p>
              <p className="text-2xl font-bold">{filteredExpenses?.length || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Toplam Tutar</p>
              <p className="text-2xl font-bold">
                {totalAmount.toLocaleString("tr-TR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })} TRY
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Aktif Grup</p>
              <p className="text-2xl font-bold">{groups?.length || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Masraf ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-64">
              <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Grup seç" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Gruplar</SelectItem>
                  {groups?.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expenses List */}
      <Card>
        <CardHeader>
          <CardTitle>Masraf Listesi</CardTitle>
          <CardDescription>
            {filteredExpenses?.length || 0} masraf gösteriliyor
          </CardDescription>
        </CardHeader>
        <CardContent>
          {expensesLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-64" />
                  </div>
                  <Skeleton className="h-6 w-24" />
                </div>
              ))}
            </div>
          ) : filteredExpenses && filteredExpenses.length > 0 ? (
            <div className="space-y-3">
              {filteredExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex flex-col md:flex-row md:items-center md:justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors gap-3"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h4 className="font-semibold text-lg">{expense.description}</h4>
                      {expense.category && (
                        <Badge variant="secondary" className="text-xs">
                          {expense.category}
                        </Badge>
                      )}
                      {expense.group && (
                        <Badge variant="outline" className="text-xs">
                          {expense.group.name}
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-sm text-gray-600">
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
                  <div className="flex items-center gap-3">
                    <div className="text-left md:text-right">
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
              <h3 className="text-lg font-semibold mb-2">
                {searchQuery || selectedGroup !== "all"
                  ? "Masraf bulunamadı"
                  : "Henüz masraf yok"}
              </h3>
              <p className="mb-4">
                {searchQuery || selectedGroup !== "all"
                  ? "Arama kriterlerinize uygun masraf bulunamadı."
                  : "Henüz hiç masraf eklenmemiş. Bir gruba giderek masraf ekleyebilirsiniz."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Expense Dialog */}
      {editingExpense && (
        <EditExpenseDialog
          expense={editingExpense}
          open={!!editingExpense}
          onOpenChange={(open) => !open && setEditingExpense(null)}
          onSuccess={() => {
            refetch();
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
