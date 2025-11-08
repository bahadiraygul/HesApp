"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { Group, Expense, GroupMember } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Loader2, Calculator } from "lucide-react";
import { z } from "zod";

interface CreateExpenseDialogProps {
  group: Group;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

// Simplified schema for the form
const expenseFormSchema = z.object({
  description: z.string().min(3, "Açıklama en az 3 karakter olmalı").max(200),
  amount: z.string().min(1, "Tutar gerekli"),
  category: z.string().optional(),
  date: z.string().min(1, "Tarih gerekli"),
});

type ExpenseFormInput = z.infer<typeof expenseFormSchema>;

type SplitType = "equal" | "custom" | "percentage";

interface SplitData {
  userId: string;
  amount: number;
}

export function CreateExpenseDialog({
  group,
  open,
  onOpenChange,
  onSuccess,
}: CreateExpenseDialogProps) {
  const queryClient = useQueryClient();
  const [splitType, setSplitType] = useState<SplitType>("equal");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [customSplits, setCustomSplits] = useState<Record<string, string>>({});
  const [percentageSplits, setPercentageSplits] = useState<Record<string, string>>({});

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ExpenseFormInput>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      date: new Date().toISOString().slice(0, 16),
      category: "",
    },
  });

  const amount = watch("amount");
  const amountNum = parseFloat(amount) || 0;

  // Initialize selected members with all members when dialog opens
  useEffect(() => {
    if (open && group.members) {
      setSelectedMembers(group.members.map((m) => m.userId));
    }
  }, [open, group.members]);

  // Calculate splits based on type
  const calculateSplits = (): SplitData[] => {
    if (selectedMembers.length === 0) return [];

    switch (splitType) {
      case "equal": {
        const splitAmount = amountNum / selectedMembers.length;
        return selectedMembers.map((userId) => ({
          userId,
          amount: Math.round(splitAmount * 100) / 100,
        }));
      }
      case "custom": {
        return selectedMembers
          .map((userId) => ({
            userId,
            amount: parseFloat(customSplits[userId] || "0"),
          }))
          .filter((split) => split.amount > 0);
      }
      case "percentage": {
        return selectedMembers
          .map((userId) => {
            const percentage = parseFloat(percentageSplits[userId] || "0");
            return {
              userId,
              amount: Math.round((amountNum * percentage) / 100 * 100) / 100,
            };
          })
          .filter((split) => split.amount > 0);
      }
      default:
        return [];
    }
  };

  const splits = calculateSplits();
  const totalSplit = splits.reduce((sum, split) => sum + split.amount, 0);
  const splitDifference = Math.abs(amountNum - totalSplit);
  const isSplitValid = splitDifference < 0.01;

  // Calculate total percentage
  const totalPercentage = selectedMembers.reduce((sum, userId) => {
    return sum + (parseFloat(percentageSplits[userId] || "0"));
  }, 0);

  const createExpenseMutation = useMutation({
    mutationFn: (data: {
      description: string;
      amount: number;
      currency: string;
      category?: string;
      date: string;
      groupId: string;
      splits: SplitData[];
    }) => api.post<Expense>("/expenses", data),
    onSuccess: (data, variables) => {
      toast.success("Masraf başarıyla eklendi!");
      resetForm();
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(`Masraf eklenemedi: ${error.message}`);
    },
  });

  const onSubmit = (data: ExpenseFormInput) => {
    if (!isSplitValid) {
      toast.error("Bölüşüm tutarları toplam tutara eşit değil!");
      return;
    }

    if (splits.length === 0) {
      toast.error("En az bir kişi seçilmeli!");
      return;
    }

    createExpenseMutation.mutate({
      description: data.description,
      amount: parseFloat(data.amount),
      currency: group.currency,
      category: data.category || undefined,
      date: new Date(data.date).toISOString(),
      groupId: group.id,
      splits,
    });
  };

  const resetForm = () => {
    reset();
    setSplitType("equal");
    setSelectedMembers(group.members?.map((m) => m.userId) || []);
    setCustomSplits({});
    setPercentageSplits({});
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!createExpenseMutation.isPending) {
      onOpenChange(newOpen);
      if (!newOpen) {
        resetForm();
      }
    }
  };

  const toggleMember = (userId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const getMemberName = (userId: string) => {
    const member = group.members?.find((m) => m.userId === userId);
    if (!member?.user) return "Bilinmeyen";
    return member.user.firstName && member.user.lastName
      ? `${member.user.firstName} ${member.user.lastName}`
      : member.user.username;
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Yeni Masraf Ekle</DialogTitle>
          <DialogDescription>
            {group.name} grubuna masraf ekleyin ve bölüşümü ayarlayın.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Açıklama *</Label>
              <Input
                id="description"
                placeholder="Örn: Market alışverişi, Restoran"
                {...register("description")}
                disabled={createExpenseMutation.isPending}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Tutar ({group.currency}) *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register("amount")}
                  disabled={createExpenseMutation.isPending}
                />
                {errors.amount && (
                  <p className="text-sm text-red-500">{errors.amount.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Kategori</Label>
                <Input
                  id="category"
                  placeholder="Yemek, Ulaşım, vb."
                  {...register("category")}
                  disabled={createExpenseMutation.isPending}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Tarih *</Label>
                <Input
                  id="date"
                  type="datetime-local"
                  {...register("date")}
                  disabled={createExpenseMutation.isPending}
                />
                {errors.date && (
                  <p className="text-sm text-red-500">{errors.date.message}</p>
                )}
              </div>

            </div>
          </div>

          {/* Split Calculator */}
          <div className="border-t pt-4">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="w-5 h-5" />
              <h3 className="font-semibold">Masrafı Böl</h3>
            </div>

            <Tabs value={splitType} onValueChange={(v) => setSplitType(v as SplitType)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="equal">Eşit</TabsTrigger>
                <TabsTrigger value="custom">Özel Tutar</TabsTrigger>
                <TabsTrigger value="percentage">Yüzde</TabsTrigger>
              </TabsList>

              {/* Member Selection */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <Label className="mb-3 block">Masrafı Paylaşacak Kişiler</Label>
                <div className="space-y-2">
                  {group.members?.map((member) => (
                    <div key={member.userId} className="flex items-center gap-2">
                      <Checkbox
                        checked={selectedMembers.includes(member.userId)}
                        onCheckedChange={() => toggleMember(member.userId)}
                      />
                      <span className="text-sm">{getMemberName(member.userId)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Equal Split */}
              <TabsContent value="equal" className="space-y-3 mt-4">
                {selectedMembers.length > 0 ? (
                  <div className="space-y-2">
                    {selectedMembers.map((userId) => {
                      const splitAmount = amountNum / selectedMembers.length;
                      return (
                        <div
                          key={userId}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded"
                        >
                          <span className="text-sm font-medium">
                            {getMemberName(userId)}
                          </span>
                          <span className="font-semibold">
                            {splitAmount.toLocaleString("tr-TR", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}{" "}
                            {group.currency}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Lütfen en az bir kişi seçin
                  </p>
                )}
              </TabsContent>

              {/* Custom Split */}
              <TabsContent value="custom" className="space-y-3 mt-4">
                {selectedMembers.length > 0 ? (
                  <div className="space-y-3">
                    {selectedMembers.map((userId) => (
                      <div key={userId} className="flex items-center gap-3">
                        <Label className="flex-1 text-sm">
                          {getMemberName(userId)}
                        </Label>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={customSplits[userId] || ""}
                          onChange={(e) =>
                            setCustomSplits((prev) => ({
                              ...prev,
                              [userId]: e.target.value,
                            }))
                          }
                          className="w-32"
                        />
                        <span className="text-sm text-gray-500 w-12">
                          {group.currency}
                        </span>
                      </div>
                    ))}
                    <div className="border-t pt-3 flex items-center justify-between font-semibold">
                      <span>Toplam:</span>
                      <span className={totalSplit !== amountNum ? "text-red-600" : "text-green-600"}>
                        {totalSplit.toLocaleString("tr-TR", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{" "}
                        / {amountNum.toLocaleString("tr-TR", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{" "}
                        {group.currency}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Lütfen en az bir kişi seçin
                  </p>
                )}
              </TabsContent>

              {/* Percentage Split */}
              <TabsContent value="percentage" className="space-y-3 mt-4">
                {selectedMembers.length > 0 ? (
                  <div className="space-y-3">
                    {selectedMembers.map((userId) => {
                      const percentage = parseFloat(percentageSplits[userId] || "0");
                      const calculatedAmount = (amountNum * percentage) / 100;
                      return (
                        <div key={userId} className="flex items-center gap-3">
                          <Label className="flex-1 text-sm">
                            {getMemberName(userId)}
                          </Label>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            max="100"
                            placeholder="0"
                            value={percentageSplits[userId] || ""}
                            onChange={(e) =>
                              setPercentageSplits((prev) => ({
                                ...prev,
                                [userId]: e.target.value,
                              }))
                            }
                            className="w-24"
                          />
                          <span className="text-sm text-gray-500 w-12">%</span>
                          <span className="text-sm font-medium w-24 text-right">
                            {calculatedAmount.toLocaleString("tr-TR", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}{" "}
                            {group.currency}
                          </span>
                        </div>
                      );
                    })}
                    <div className="border-t pt-3 flex items-center justify-between font-semibold">
                      <span>Toplam:</span>
                      <span className={totalPercentage !== 100 ? "text-red-600" : "text-green-600"}>
                        {totalPercentage.toFixed(2)}% (
                        {totalSplit.toLocaleString("tr-TR", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{" "}
                        {group.currency})
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Lütfen en az bir kişi seçin
                  </p>
                )}
              </TabsContent>
            </Tabs>

            {/* Validation Message */}
            {!isSplitValid && amountNum > 0 && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                Bölüşüm tutarları toplam masraf tutarına eşit olmalı!
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={createExpenseMutation.isPending}
            >
              İptal
            </Button>
            <Button type="submit" disabled={createExpenseMutation.isPending || !isSplitValid}>
              {createExpenseMutation.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Masraf Ekle
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
