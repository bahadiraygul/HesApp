"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { GroupBalance, Group } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, TrendingDown, TrendingUp, Scale, Wallet } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function BalancePage() {
  const { user } = useAuth();

  // Fetch all groups
  const { data: groups, isLoading: groupsLoading } = useQuery({
    queryKey: ["groups"],
    queryFn: () => api.get<Group[]>("/groups"),
  });

  // Fetch balance for all groups
  const groupBalances = useQuery({
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

  const getInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  };

  // Calculate overall balance
  const calculateOverallBalance = () => {
    if (!groupBalances.data || !user) return 0;

    let total = 0;
    groupBalances.data.forEach((balance) => {
      const userBalance = balance.userBalances.find((ub) => ub.userId === user.id);
      if (userBalance) {
        total += userBalance.balance;
      }
    });
    return total;
  };

  const overallBalance = calculateOverallBalance();

  if (groupsLoading || groupBalances.isLoading) {
    return (
      <div className="p-6">
        <Skeleton className="h-10 w-48 mb-6" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!groups || groups.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Bakiye</h1>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Scale className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Henüz grup yok
            </h3>
            <p className="text-gray-500">
              Bakiye görmek için önce bir gruba katılın veya grup oluşturun.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Bakiye</h1>
        <p className="text-gray-500 mt-1">Tüm gruplarınızdaki bakiyenizi görüntüleyin</p>
      </div>

      {/* Overall Balance Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Toplam Bakiye
          </CardTitle>
          <CardDescription>Tüm gruplardaki net bakiyeniz</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            {overallBalance > 0 ? (
              <>
                <TrendingUp className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-3xl font-bold text-green-600">
                    +{overallBalance.toLocaleString("tr-TR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })} TRY
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Size toplam bu kadar borçlu
                  </p>
                </div>
              </>
            ) : overallBalance < 0 ? (
              <>
                <TrendingDown className="w-8 h-8 text-red-600" />
                <div>
                  <p className="text-3xl font-bold text-red-600">
                    {overallBalance.toLocaleString("tr-TR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })} TRY
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Toplam bu kadar borcunuz var
                  </p>
                </div>
              </>
            ) : (
              <>
                <Scale className="w-8 h-8 text-gray-600" />
                <div>
                  <p className="text-3xl font-bold text-gray-600">0.00 TRY</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Tüm borçlarınız ödendi!
                  </p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Group Balances */}
      <Tabs defaultValue={groups[0]?.id} className="space-y-6">
        <TabsList className="w-full justify-start overflow-x-auto">
          {groups.map((group) => (
            <TabsTrigger key={group.id} value={group.id}>
              {group.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {groups.map((group) => {
          const balance = groupBalances.data?.find((b) => b.groupId === group.id);

          return (
            <TabsContent key={group.id} value={group.id} className="space-y-6">
              {balance ? (
                <>
                  {/* User Balances */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Kullanıcı Bakiyeleri</CardTitle>
                      <CardDescription>
                        {group.name} grubundaki her kullanıcının bakiyesi
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {balance.userBalances && balance.userBalances.length > 0 ? (
                        <div className="space-y-3">
                          {balance.userBalances.map((userBalance) => {
                            const isCurrentUser = userBalance.userId === user?.id;
                            return (
                              <div
                                key={userBalance.userId}
                                className={`flex items-center justify-between p-4 border rounded-lg ${
                                  isCurrentUser ? "bg-blue-50 border-blue-200" : ""
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <Avatar>
                                    <AvatarFallback>
                                      {getInitials(
                                        userBalance.fullName || userBalance.username
                                      )}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">
                                      {userBalance.fullName}
                                      {isCurrentUser && (
                                        <span className="text-sm text-blue-600 ml-2">
                                          (Siz)
                                        </span>
                                      )}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      @{userBalance.username}
                                    </p>
                                  </div>
                                </div>

                                <div className="text-right">
                                  <div className="flex items-center gap-4">
                                    <div>
                                      <p className="text-xs text-gray-500">Ödedi</p>
                                      <p className="font-medium text-green-600">
                                        {userBalance.totalPaid.toLocaleString("tr-TR", {
                                          minimumFractionDigits: 2,
                                        })}{" "}
                                        {balance.currency}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500">Borçlu</p>
                                      <p className="font-medium text-orange-600">
                                        {userBalance.totalOwed.toLocaleString("tr-TR", {
                                          minimumFractionDigits: 2,
                                        })}{" "}
                                        {balance.currency}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500">Bakiye</p>
                                      <div className="flex items-center gap-2">
                                        {userBalance.balance > 0 ? (
                                          <>
                                            <TrendingUp className="w-4 h-4 text-green-600" />
                                            <p className="font-bold text-green-600">
                                              +
                                              {userBalance.balance.toLocaleString("tr-TR", {
                                                minimumFractionDigits: 2,
                                              })}{" "}
                                              {balance.currency}
                                            </p>
                                          </>
                                        ) : userBalance.balance < 0 ? (
                                          <>
                                            <TrendingDown className="w-4 h-4 text-red-600" />
                                            <p className="font-bold text-red-600">
                                              {userBalance.balance.toLocaleString("tr-TR", {
                                                minimumFractionDigits: 2,
                                              })}{" "}
                                              {balance.currency}
                                            </p>
                                          </>
                                        ) : (
                                          <p className="font-bold text-gray-600">
                                            0.00 {balance.currency}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-center text-gray-500 py-8">
                          Henüz bakiye bilgisi yok
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Simplified Debts */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Önerilen Ödemeler</CardTitle>
                      <CardDescription>
                        Minimum transfer sayısı ile dengeyi sağlayın
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {balance.simplifiedDebts && balance.simplifiedDebts.length > 0 ? (
                        <div className="space-y-3">
                          {balance.simplifiedDebts.map((debt, index) => {
                            const isFromCurrentUser = debt.fromUserId === user?.id;
                            const isToCurrentUser = debt.toUserId === user?.id;
                            const isRelevant = isFromCurrentUser || isToCurrentUser;

                            return (
                              <div
                                key={index}
                                className={`flex flex-col md:flex-row md:items-center md:justify-between p-4 border rounded-lg gap-4 ${
                                  isRelevant ? "bg-yellow-50 border-yellow-200" : "bg-gray-50"
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <Avatar>
                                    <AvatarFallback>
                                      {getInitials(debt.fromUsername)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">
                                      @{debt.fromUsername}
                                      {isFromCurrentUser && (
                                        <span className="text-sm text-blue-600 ml-2">
                                          (Siz)
                                        </span>
                                      )}
                                    </p>
                                    <p className="text-sm text-gray-500">borçlu</p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-4 justify-center">
                                  <Badge variant="outline" className="text-base px-4 py-2">
                                    {debt.amount.toLocaleString("tr-TR", {
                                      minimumFractionDigits: 2,
                                    })}{" "}
                                    {balance.currency}
                                  </Badge>
                                  <ArrowRight className="w-5 h-5 text-gray-400" />
                                </div>

                                <div className="flex items-center gap-3 md:justify-end">
                                  <div className="text-right">
                                    <p className="font-medium">
                                      @{debt.toUsername}
                                      {isToCurrentUser && (
                                        <span className="text-sm text-blue-600 ml-2">
                                          (Siz)
                                        </span>
                                      )}
                                    </p>
                                    <p className="text-sm text-gray-500">alacaklı</p>
                                  </div>
                                  <Avatar>
                                    <AvatarFallback>
                                      {getInitials(debt.toUsername)}
                                    </AvatarFallback>
                                  </Avatar>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-12 text-gray-500">
                          <Scale className="w-16 h-16 mx-auto mb-4 opacity-50" />
                          <h3 className="text-lg font-semibold mb-2">
                            Tüm borçlar ödendi!
                          </h3>
                          <p>Bu grupta bekleyen borç bulunmuyor.</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center text-gray-500">
                    <Scale className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Bakiye bilgisi yüklenemedi</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
