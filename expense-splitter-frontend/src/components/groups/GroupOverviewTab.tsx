"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { Group, Expense } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Receipt, Wallet, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface GroupOverviewTabProps {
  group: Group;
}

export function GroupOverviewTab({ group }: GroupOverviewTabProps) {
  // Fetch group expenses
  const { data: expenses, isLoading } = useQuery({
    queryKey: ["group-expenses", group.id],
    queryFn: () => api.get<Expense[]>(`/groups/${group.id}/expenses`),
  });

  // Calculate stats
  const totalExpenses = expenses?.length || 0;
  const totalAmount = expenses?.reduce((sum, exp) => sum + exp.amount, 0) || 0;
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const thisMonthExpenses = expenses?.filter((exp) => {
    const expDate = new Date(exp.date);
    return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
  }) || [];
  const thisMonthAmount = thisMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Get recent expenses (last 5)
  const recentExpenses = expenses?.slice(0, 5) || [];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Toplam Üye
            </CardTitle>
            <Users className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{group.members?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Toplam Masraf
            </CardTitle>
            <Receipt className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalExpenses}</div>
            <p className="text-xs text-gray-500 mt-1">
              {totalAmount.toLocaleString("tr-TR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              {group.currency}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Bu Ay
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{thisMonthExpenses.length}</div>
            <p className="text-xs text-gray-500 mt-1">
              {thisMonthAmount.toLocaleString("tr-TR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              {group.currency}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Expenses */}
      <Card>
        <CardHeader>
          <CardTitle>Son Masraflar</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-5 w-20" />
                </div>
              ))}
            </div>
          ) : recentExpenses.length > 0 ? (
            <div className="space-y-4">
              {recentExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between border-b last:border-0 pb-3 last:pb-0"
                >
                  <div>
                    <p className="font-medium">{expense.description}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <span>
                        {expense.paidBy?.username || "Bilinmeyen"}
                      </span>
                      <span>•</span>
                      <span>
                        {format(new Date(expense.date), "d MMM yyyy", {
                          locale: tr,
                        })}
                      </span>
                      {expense.category && (
                        <>
                          <span>•</span>
                          <span className="capitalize">{expense.category}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {expense.amount.toLocaleString("tr-TR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      {expense.currency}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Receipt className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Henüz masraf eklenmemiş</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
