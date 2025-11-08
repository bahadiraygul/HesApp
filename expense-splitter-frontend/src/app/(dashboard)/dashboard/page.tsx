"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { Group, Expense, GroupBalance } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Receipt, TrendingUp, TrendingDown, Plus, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export default function DashboardPage() {
  const { user } = useAuth();

  // Fetch groups
  const { data: groups, isLoading: groupsLoading } = useQuery({
    queryKey: ["groups"],
    queryFn: () => api.get<Group[]>("/groups"),
  });

  // Fetch expenses
  const { data: expenses, isLoading: expensesLoading } = useQuery({
    queryKey: ["expenses"],
    queryFn: () => api.get<Expense[]>("/expenses"),
  });

  // Fetch balances
  const { data: balances, isLoading: balancesLoading } = useQuery({
    queryKey: ["all-balances", groups?.map((g) => g.id)],
    queryFn: async () => {
      if (!groups || groups.length === 0) return [];
      const balances = await Promise.all(
        groups.map((group) =>
          api.get<GroupBalance>(`/expenses/groups/${group.id}/balance`).catch(() => null)
        )
      );
      return balances.filter((b): b is GroupBalance => b !== null);
    },
    enabled: !!groups && groups.length > 0,
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Günaydın";
    if (hour < 18) return "İyi günler";
    return "İyi akşamlar";
  };

  // Calculate stats
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const thisMonthExpenses = expenses?.filter((exp) => {
    const expDate = new Date(exp.date);
    return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
  }) || [];

  const thisMonthTotal = thisMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Calculate overall balance
  const calculateOverallBalance = () => {
    if (!balances || !user) return 0;
    let total = 0;
    balances.forEach((balance) => {
      const userBalance = balance.userBalances.find((ub) => ub.userId === user.id);
      if (userBalance) {
        total += userBalance.balance;
      }
    });
    return total;
  };

  const overallBalance = calculateOverallBalance();

  // Get recent expenses (last 5)
  const recentExpenses = expenses?.slice(0, 5) || [];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {getGreeting()}, {user?.firstName || user?.username}!
        </h1>
        <p className="text-gray-500 mt-1">
          Masraflarınızı ve grup bakiyelerinizi buradan yönetebilirsiniz
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Grup</CardTitle>
            <Users className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            {groupsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{groups?.length || 0}</div>
                <p className="text-xs text-gray-500">Aktif gruplarınız</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bu Ay Masraf</CardTitle>
            <Receipt className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            {expensesLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {thisMonthTotal.toLocaleString("tr-TR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })} TRY
                </div>
                <p className="text-xs text-gray-500">{thisMonthExpenses.length} masraf</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Bakiye</CardTitle>
            {overallBalance > 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : overallBalance < 0 ? (
              <TrendingDown className="h-4 w-4 text-red-600" />
            ) : (
              <TrendingUp className="h-4 w-4 text-gray-600" />
            )}
          </CardHeader>
          <CardContent>
            {balancesLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <>
                <div className={`text-2xl font-bold ${
                  overallBalance > 0 ? "text-green-600" :
                  overallBalance < 0 ? "text-red-600" :
                  "text-gray-900"
                }`}>
                  {overallBalance > 0 && "+"}
                  {overallBalance.toLocaleString("tr-TR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })} TRY
                </div>
                <p className="text-xs text-gray-500">
                  {overallBalance > 0 ? "Size borçlu" : overallBalance < 0 ? "Borcunuz var" : "Borç yok"}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Hızlı İşlemler</CardTitle>
          <CardDescription>Sık kullanılan işlemleriniz</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Link href="/groups">
            <Button variant="outline" className="w-full justify-start" size="lg">
              <Users className="mr-2 h-5 w-5" />
              Yeni Grup Oluştur
            </Button>
          </Link>
          <Link href="/expenses">
            <Button variant="outline" className="w-full justify-start" size="lg">
              <Plus className="mr-2 h-5 w-5" />
              Masraf Ekle
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Son Masraflar</CardTitle>
          <CardDescription>Gruplarınızdaki son eklenen masraflar</CardDescription>
        </CardHeader>
        <CardContent>
          {expensesLoading ? (
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
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{expense.description}</p>
                      {expense.category && (
                        <Badge variant="secondary" className="text-xs">
                          {expense.category}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <span>{expense.group?.name || "Grup"}</span>
                      <span>•</span>
                      <Calendar className="w-3 h-3" />
                      <span>
                        {format(new Date(expense.date), "d MMM", { locale: tr })}
                      </span>
                      <span>•</span>
                      <span>{expense.paidBy?.username || "Bilinmeyen"}</span>
                    </div>
                  </div>
                  <div className="text-right ml-4">
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
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Receipt className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">Henüz masraf yok</p>
              <p className="text-sm text-gray-400 mt-1">
                Bir gruba katılıp masraf eklemeye başlayın
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
