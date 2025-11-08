"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/services/api";
import { updateGroupSchema, type UpdateGroupInput } from "@/lib/validators";
import { Group } from "@/types";
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
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface EditGroupDialogProps {
  group: Group;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const CURRENCIES = [
  { value: "TRY", label: "₺ Türk Lirası (TRY)" },
  { value: "USD", label: "$ Amerikan Doları (USD)" },
  { value: "EUR", label: "€ Euro (EUR)" },
  { value: "GBP", label: "£ İngiliz Sterlini (GBP)" },
];

export function EditGroupDialog({
  group,
  open,
  onOpenChange,
  onSuccess,
}: EditGroupDialogProps) {
  const [currency, setCurrency] = useState(group.currency);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateGroupInput>({
    resolver: zodResolver(updateGroupSchema),
    defaultValues: {
      name: group.name,
      description: group.description || "",
      currency: group.currency,
    },
  });

  // Update form when group changes
  useEffect(() => {
    reset({
      name: group.name,
      description: group.description || "",
      currency: group.currency,
    });
    setCurrency(group.currency);
  }, [group, reset]);

  const updateGroupMutation = useMutation({
    mutationFn: (data: UpdateGroupInput) =>
      api.patch<Group>(`/groups/${group.id}`, { ...data, currency }),
    onSuccess: () => {
      toast.success("Grup başarıyla güncellendi!");
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(`Grup güncellenemedi: ${error.message}`);
    },
  });

  const onSubmit = (data: UpdateGroupInput) => {
    updateGroupMutation.mutate(data);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!updateGroupMutation.isPending) {
      onOpenChange(newOpen);
      if (!newOpen) {
        reset();
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Grup Düzenle</DialogTitle>
          <DialogDescription>
            Grup bilgilerini güncelleyin.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Grup Adı *</Label>
            <Input
              id="name"
              placeholder="Grup adı"
              {...register("name")}
              disabled={updateGroupMutation.isPending}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Açıklama</Label>
            <Input
              id="description"
              placeholder="Açıklama"
              {...register("description")}
              disabled={updateGroupMutation.isPending}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Para Birimi *</Label>
            <Select
              value={currency}
              onValueChange={setCurrency}
              disabled={updateGroupMutation.isPending}
            >
              <SelectTrigger id="currency">
                <SelectValue placeholder="Para birimi seçin" />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((curr) => (
                  <SelectItem key={curr.value} value={curr.value}>
                    {curr.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={updateGroupMutation.isPending}
            >
              İptal
            </Button>
            <Button type="submit" disabled={updateGroupMutation.isPending}>
              {updateGroupMutation.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Güncelle
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
