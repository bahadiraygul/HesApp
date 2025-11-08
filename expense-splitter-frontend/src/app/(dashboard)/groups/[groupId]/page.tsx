"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { Group } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
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
import { ArrowLeft, Edit, Users, Wallet, Trash2 } from "lucide-react";
import Link from "next/link";
import { GroupOverviewTab } from "@/components/groups/GroupOverviewTab";
import { GroupMembersTab } from "@/components/groups/GroupMembersTab";
import { GroupExpensesTab } from "@/components/groups/GroupExpensesTab";
import { GroupBalanceTab } from "@/components/groups/GroupBalanceTab";
import { EditGroupDialog } from "@/components/groups/EditGroupDialog";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function GroupDetailPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const groupId = params.groupId as string;
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch group details
  const { data: group, isLoading, error, refetch } = useQuery({
    queryKey: ["group", groupId],
    queryFn: () => api.get<Group>(`/groups/${groupId}`),
    enabled: !!groupId,
  });

  // Delete group mutation
  const deleteGroupMutation = useMutation({
    mutationFn: () => api.delete(`/groups/${groupId}`),
    onSuccess: () => {
      toast.success("Grup başarıyla silindi!");
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      router.push("/groups");
    },
    onError: (error: Error) => {
      toast.error(`Grup silinemedi: ${error.message}`);
    },
  });

  const isCreator = user && group && group.creatorId === user.id;

  const handleDeleteClick = () => {
    if (!isCreator) {
      toast.error("Sadece grup oluşturucusu grubu silebilir!");
      return;
    }
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    deleteGroupMutation.mutate();
  };

  // Listen for refetch events
  useEffect(() => {
    const handleRefetch = () => refetch();
    window.addEventListener("refetch-group", handleRefetch);
    return () => window.removeEventListener("refetch-group", handleRefetch);
  }, [refetch]);

  if (error) {
    return (
      <div className="p-6">
        <Button variant="ghost" onClick={() => router.push("/groups")} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Gruplara Dön
        </Button>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Grup yüklenirken bir hata oluştu: {error.message}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <Skeleton className="h-10 w-32 mb-4" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-full mt-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-96" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="p-6">
        <Button variant="ghost" onClick={() => router.push("/groups")} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Gruplara Dön
        </Button>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-500">Grup bulunamadı</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => router.push("/groups")} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Gruplara Dön
      </Button>

      {/* Group Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-3xl mb-2">{group.name}</CardTitle>
              {group.description && (
                <CardDescription className="text-base">
                  {group.description}
                </CardDescription>
              )}
              <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {group.members?.length || 0} üye
                </div>
                <div className="flex items-center">
                  <Wallet className="w-4 h-4 mr-1" />
                  {group.currency}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setIsEditDialogOpen(true)} variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Düzenle
              </Button>
              {isCreator && (
                <Button onClick={handleDeleteClick} variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Sil
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
          <TabsTrigger value="members">Üyeler</TabsTrigger>
          <TabsTrigger value="expenses">Masraflar</TabsTrigger>
          <TabsTrigger value="balance">Bakiye</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <GroupOverviewTab group={group} />
        </TabsContent>

        <TabsContent value="members" className="mt-6">
          <GroupMembersTab group={group} onUpdate={refetch} />
        </TabsContent>

        <TabsContent value="expenses" className="mt-6">
          <GroupExpensesTab group={group} onUpdate={refetch} />
        </TabsContent>

        <TabsContent value="balance" className="mt-6">
          <GroupBalanceTab group={group} />
        </TabsContent>
      </Tabs>

      {/* Edit Group Dialog */}
      <EditGroupDialog
        group={group}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSuccess={() => refetch()}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Grubu Sil</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-semibold">{group?.name}</span> grubunu silmek istediğinizden emin misiniz?
              Bu işlem geri alınamaz ve gruptaki tüm masraflar silinecektir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteGroupMutation.isPending}
            >
              {deleteGroupMutation.isPending ? "Siliniyor..." : "Grubu Sil"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
