"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { Group, GroupBalance } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowRight, TrendingDown, TrendingUp, Scale } from "lucide-react";

interface GroupBalanceTabProps {
  group: Group;
}

export function GroupBalanceTab({ group }: GroupBalanceTabProps) {
  // Fetch group balance
  const { data: balance, isLoading } = useQuery({
    queryKey: ["group-balance", group.id],
    queryFn: () => api.get<GroupBalance>(`/expenses/groups/${group.id}/balance`),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
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

  if (!balance) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-gray-500">
          <Scale className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>Bakiye bilgisi bulunamadı</p>
        </CardContent>
      </Card>
    );
  }

  const getInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* User Balances */}
      <Card>
        <CardHeader>
          <CardTitle>Kullanıcı Bakiyeleri</CardTitle>
          <CardDescription>
            Her kullanıcının ödediği ve borçlandığı tutarlar
          </CardDescription>
        </CardHeader>
        <CardContent>
          {balance.userBalances && balance.userBalances.length > 0 ? (
            <div className="space-y-4">
              {balance.userBalances.map((userBalance) => (
                <div
                  key={userBalance.userId}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {getInitials(userBalance.fullName || userBalance.username)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{userBalance.fullName}</p>
                      <p className="text-sm text-gray-500">@{userBalance.username}</p>
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
                          {group.currency}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Borçlu</p>
                        <p className="font-medium text-orange-600">
                          {userBalance.totalOwed.toLocaleString("tr-TR", {
                            minimumFractionDigits: 2,
                          })}{" "}
                          {group.currency}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Bakiye</p>
                        <div className="flex items-center gap-2">
                          {userBalance.balance > 0 ? (
                            <>
                              <TrendingUp className="w-4 h-4 text-green-600" />
                              <p className="font-bold text-green-600">
                                +{userBalance.balance.toLocaleString("tr-TR", {
                                  minimumFractionDigits: 2,
                                })}{" "}
                                {group.currency}
                              </p>
                            </>
                          ) : userBalance.balance < 0 ? (
                            <>
                              <TrendingDown className="w-4 h-4 text-red-600" />
                              <p className="font-bold text-red-600">
                                {userBalance.balance.toLocaleString("tr-TR", {
                                  minimumFractionDigits: 2,
                                })}{" "}
                                {group.currency}
                              </p>
                            </>
                          ) : (
                            <p className="font-bold text-gray-600">
                              0.00 {group.currency}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">Henüz bakiye bilgisi yok</p>
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
              {balance.simplifiedDebts.map((debt, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {getInitials(debt.fromUsername)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">@{debt.fromUsername}</p>
                      <p className="text-sm text-gray-500">borçlu</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="text-lg px-4 py-2">
                      {debt.amount.toLocaleString("tr-TR", {
                        minimumFractionDigits: 2,
                      })}{" "}
                      {group.currency}
                    </Badge>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-medium">@{debt.toUsername}</p>
                      <p className="text-sm text-gray-500">alacaklı</p>
                    </div>
                    <Avatar>
                      <AvatarFallback>
                        {getInitials(debt.toUsername)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Scale className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Tüm borçlar ödendi!</h3>
              <p>Grupta bekleyen borç bulunmuyor.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
