"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/services/api";
import { Group } from "@/types";
import { z } from "zod";
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

interface CreateGroupDialogProps {
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

// Local form schema without default on currency
const formSchema = z.object({
  name: z.string().min(3, "Grup adı en az 3 karakter olmalı").max(100),
  description: z.string().max(500, "Açıklama en fazla 500 karakter olabilir").optional(),
});

type FormInput = z.infer<typeof formSchema>;

export function CreateGroupDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateGroupDialogProps) {
  const [currency, setCurrency] = useState("TRY");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const createGroupMutation = useMutation({
    mutationFn: (data: { name: string; description?: string; currency: string }) =>
      api.post<Group>("/groups", data),
    onSuccess: () => {
      toast.success("Grup başarıyla oluşturuldu!");
      reset();
      setCurrency("TRY");
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(`Grup oluşturulamadı: ${error.message}`);
    },
  });

  const onSubmit = (data: FormInput) => {
    createGroupMutation.mutate({ ...data, currency });
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!createGroupMutation.isPending) {
      onOpenChange(newOpen);
      if (!newOpen) {
        reset();
        setCurrency("TRY");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Yeni Grup Oluştur</DialogTitle>
          <DialogDescription>
            Masraflarınızı paylaşmak için yeni bir grup oluşturun. Grubunuza daha
            sonra üye ekleyebilirsiniz.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Grup Adı *</Label>
            <Input
              id="name"
              placeholder="Örn: Tatil, Ev Arkadaşları, Proje"
              {...register("name")}
              disabled={createGroupMutation.isPending}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Açıklama (Opsiyonel)</Label>
            <Input
              id="description"
              placeholder="Grubunuz hakkında kısa bir açıklama"
              {...register("description")}
              disabled={createGroupMutation.isPending}
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
              disabled={createGroupMutation.isPending}
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
              disabled={createGroupMutation.isPending}
            >
              İptal
            </Button>
            <Button type="submit" disabled={createGroupMutation.isPending}>
              {createGroupMutation.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Oluştur
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
