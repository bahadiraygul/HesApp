"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/services/api";
import { Group, GroupRole, GroupMember } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { MoreVertical, Plus, Shield, User, UserMinus, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AddMemberDialog } from "./AddMemberDialog";
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

interface GroupMembersTabProps {
  group: Group;
  onUpdate: () => void;
}

export function GroupMembersTab({ group }: GroupMembersTabProps & { onUpdate: () => void }) {
  const { user: currentUser } = useAuth();
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<GroupMember | null>(null);

  // Check if current user is admin
  const currentUserMember = group.members?.find(
    (m) => m.userId === currentUser?.id
  );
  const isAdmin = currentUserMember?.role === GroupRole.ADMIN;

  // Remove member mutation
  const removeMemberMutation = useMutation({
    mutationFn: (memberId: string) =>
      api.delete(`/groups/${group.id}/members/${memberId}`),
    onSuccess: () => {
      toast.success("Üye gruptan çıkarıldı");
      setMemberToRemove(null);
      // Trigger refetch in parent
      window.dispatchEvent(new CustomEvent("refetch-group"));
    },
    onError: (error: Error) => {
      toast.error(`Üye çıkarılamadı: ${error.message}`);
    },
  });

  // Change role mutation
  const changeRoleMutation = useMutation({
    mutationFn: ({ memberId, role }: { memberId: string; role: GroupRole }) =>
      api.patch(`/groups/${group.id}/members/${memberId}/role`, { role }),
    onSuccess: () => {
      toast.success("Üye rolü güncellendi");
      window.dispatchEvent(new CustomEvent("refetch-group"));
    },
    onError: (error: Error) => {
      toast.error(`Rol güncellenemedi: ${error.message}`);
    },
  });

  const getInitials = (member: GroupMember) => {
    const user = member.user;
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return user?.username?.substring(0, 2).toUpperCase() || "??";
  };

  const getFullName = (member: GroupMember) => {
    const user = member.user;
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.username || "Bilinmeyen Kullanıcı";
  };

  const handleRemoveMember = (member: GroupMember) => {
    setMemberToRemove(member);
  };

  const confirmRemoveMember = () => {
    if (memberToRemove) {
      removeMemberMutation.mutate(memberToRemove.id);
    }
  };

  const handleChangeRole = (memberId: string, newRole: GroupRole) => {
    changeRoleMutation.mutate({ memberId, role: newRole });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Grup Üyeleri</CardTitle>
              <CardDescription>
                Grupta {group.members?.length || 0} üye bulunuyor
              </CardDescription>
            </div>
            {isAdmin && (
              <Button onClick={() => setIsAddMemberDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Üye Ekle
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {group.members && group.members.length > 0 ? (
            <div className="space-y-4">
              {group.members.map((member) => {
                const isCurrentUser = member.userId === currentUser?.id;
                const canManage = isAdmin && !isCurrentUser;

                return (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{getInitials(member)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {getFullName(member)}
                          {isCurrentUser && (
                            <span className="text-sm text-gray-500 ml-2">(Siz)</span>
                          )}
                        </p>
                        <p className="text-sm text-gray-500">
                          @{member.user?.username || "bilinmeyen"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge
                        variant={member.role === GroupRole.ADMIN ? "default" : "secondary"}
                      >
                        {member.role === GroupRole.ADMIN ? (
                          <>
                            <Shield className="w-3 h-3 mr-1" />
                            Admin
                          </>
                        ) : (
                          <>
                            <User className="w-3 h-3 mr-1" />
                            Üye
                          </>
                        )}
                      </Badge>

                      {canManage && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {member.role === GroupRole.MEMBER ? (
                              <DropdownMenuItem
                                onClick={() => handleChangeRole(member.id, GroupRole.ADMIN)}
                              >
                                <Shield className="w-4 h-4 mr-2" />
                                Admin Yap
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() => handleChangeRole(member.id, GroupRole.MEMBER)}
                              >
                                <User className="w-4 h-4 mr-2" />
                                Üye Yap
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => handleRemoveMember(member)}
                              className="text-red-600"
                            >
                              <UserMinus className="w-4 h-4 mr-2" />
                              Gruptan Çıkar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Grupta henüz üye yok</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Member Dialog */}
      <AddMemberDialog
        groupId={group.id}
        open={isAddMemberDialogOpen}
        onOpenChange={setIsAddMemberDialogOpen}
        onSuccess={() => {
          window.dispatchEvent(new CustomEvent("refetch-group"));
        }}
      />

      {/* Remove Member Confirmation Dialog */}
      <AlertDialog
        open={!!memberToRemove}
        onOpenChange={(open) => !open && setMemberToRemove(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Üyeyi Gruptan Çıkar</AlertDialogTitle>
            <AlertDialogDescription>
              {memberToRemove && (
                <>
                  <strong>{getFullName(memberToRemove)}</strong> kullanıcısını gruptan
                  çıkarmak istediğinize emin misiniz? Bu işlem geri alınamaz.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRemoveMember}
              className="bg-red-600 hover:bg-red-700"
            >
              Çıkar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
