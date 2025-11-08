"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User as UserIcon, Mail, Calendar, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { toast } from "sonner";
import { z } from "zod";

const profileFormSchema = z.object({
  firstName: z.string().min(2, "İsim en az 2 karakter olmalı").max(50).optional().or(z.literal("")),
  lastName: z.string().min(2, "Soyisim en az 2 karakter olmalı").max(50).optional().or(z.literal("")),
});

type ProfileFormInput = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const { user, refreshUser, isLoading: authLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormInput>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: ProfileFormInput) => api.patch("/users/me", data),
    onSuccess: async () => {
      toast.success("Profil başarıyla güncellendi!");
      await refreshUser();
      setIsEditing(false);
    },
    onError: (error: Error) => {
      toast.error(`Profil güncellenemedi: ${error.message}`);
    },
  });

  const onSubmit = (data: ProfileFormInput) => {
    updateProfileMutation.mutate(data);
  };

  const handleCancel = () => {
    reset({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
    });
    setIsEditing(false);
  };

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.username) {
      return user.username.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  const getDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.username || "Kullanıcı";
  };

  if (authLoading) {
    return (
      <div className="p-6">
        <Skeleton className="h-8 w-48 mb-6" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-24 w-24 rounded-full mx-auto" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">Kullanıcı bilgisi yüklenemedi.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Profil</h1>
        <p className="text-gray-500 mt-1">Profil bilgilerinizi görüntüleyin ve düzenleyin</p>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle>Profil Bilgileri</CardTitle>
            <CardDescription>
              Hesap bilgileriniz ve kişisel detaylarınız
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center justify-center pb-6 border-b">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="text-2xl bg-blue-600 text-white">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Username (Read-only) */}
              <div className="space-y-2">
                <Label htmlFor="username">Kullanıcı Adı</Label>
                <div className="flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-gray-500" />
                  <Input
                    id="username"
                    value={user.username}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
                <p className="text-sm text-gray-500">Kullanıcı adı değiştirilemez</p>
              </div>

              {/* Email (Read-only) */}
              <div className="space-y-2">
                <Label htmlFor="email">E-posta</Label>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <Input
                    id="email"
                    value={user.email}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
                <p className="text-sm text-gray-500">E-posta adresi değiştirilemez</p>
              </div>

              {/* First Name */}
              <div className="space-y-2">
                <Label htmlFor="firstName">İsim</Label>
                <Input
                  id="firstName"
                  placeholder="İsminizi girin"
                  {...register("firstName")}
                  disabled={!isEditing || updateProfileMutation.isPending}
                  className={!isEditing ? "bg-gray-50" : ""}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500">{errors.firstName.message}</p>
                )}
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <Label htmlFor="lastName">Soyisim</Label>
                <Input
                  id="lastName"
                  placeholder="Soyisminizi girin"
                  {...register("lastName")}
                  disabled={!isEditing || updateProfileMutation.isPending}
                  className={!isEditing ? "bg-gray-50" : ""}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500">{errors.lastName.message}</p>
                )}
              </div>

              {/* Created At */}
              <div className="space-y-2">
                <Label htmlFor="createdAt">Üye Olma Tarihi</Label>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <Input
                    id="createdAt"
                    value={format(new Date(user.createdAt), "d MMMM yyyy, HH:mm", {
                      locale: tr,
                    })}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                {!isEditing ? (
                  <Button type="button" onClick={() => setIsEditing(true)}>
                    Profili Düzenle
                  </Button>
                ) : (
                  <>
                    <Button type="submit" disabled={updateProfileMutation.isPending}>
                      {updateProfileMutation.isPending && (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      )}
                      Kaydet
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      disabled={updateProfileMutation.isPending}
                    >
                      İptal
                    </Button>
                  </>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Account Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle>Hesap İstatistikleri</CardTitle>
            <CardDescription>
              Platformdaki aktivite özetiniz
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Görünen Ad</p>
                <p className="text-lg font-semibold">{getDisplayName()}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Hesap Durumu</p>
                <p className="text-lg font-semibold text-green-600">Aktif</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Üyelik Süresi</p>
                <p className="text-lg font-semibold">
                  {Math.floor(
                    (Date.now() - new Date(user.createdAt).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}{" "}
                  gün
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
