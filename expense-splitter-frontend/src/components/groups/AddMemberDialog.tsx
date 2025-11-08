"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/services/api";
import { User } from "@/types";
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
import { toast } from "sonner";
import { Loader2, Search } from "lucide-react";

interface AddMemberDialogProps {
  groupId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddMemberDialog({
  groupId,
  open,
  onOpenChange,
  onSuccess,
}: AddMemberDialogProps) {
  const [email, setEmail] = useState("");
  const [searchedUser, setSearchedUser] = useState<User | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Search user by email
  const searchUser = async () => {
    if (!email.trim()) {
      toast.error("Lütfen bir email adresi girin");
      return;
    }

    setIsSearching(true);
    try {
      const user = await api.get<User>(`/users/search?email=${encodeURIComponent(email)}`);
      setSearchedUser(user);
      toast.success("Kullanıcı bulundu!");
    } catch (error) {
      toast.error("Kullanıcı bulunamadı");
      setSearchedUser(null);
    } finally {
      setIsSearching(false);
    }
  };

  // Add member mutation
  const addMemberMutation = useMutation({
    mutationFn: (userId: string) =>
      api.post(`/groups/${groupId}/members`, { userId }),
    onSuccess: () => {
      toast.success("Üye başarıyla eklendi!");
      setEmail("");
      setSearchedUser(null);
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast.error(`Üye eklenemedi: ${error.message}`);
    },
  });

  const handleAddMember = () => {
    if (searchedUser) {
      addMemberMutation.mutate(searchedUser.id);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!addMemberMutation.isPending && !isSearching) {
      onOpenChange(newOpen);
      if (!newOpen) {
        setEmail("");
        setSearchedUser(null);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Üye Ekle</DialogTitle>
          <DialogDescription>
            Email adresi ile kullanıcı arayın ve gruba ekleyin.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Adresi</Label>
            <div className="flex gap-2">
              <Input
                id="email"
                type="email"
                placeholder="ornek@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    searchUser();
                  }
                }}
                disabled={isSearching || addMemberMutation.isPending}
              />
              <Button
                type="button"
                onClick={searchUser}
                disabled={isSearching || addMemberMutation.isPending}
              >
                {isSearching ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {searchedUser && (
            <div className="p-4 border rounded-lg bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    {searchedUser.firstName && searchedUser.lastName
                      ? `${searchedUser.firstName} ${searchedUser.lastName}`
                      : searchedUser.username}
                  </p>
                  <p className="text-sm text-gray-500">@{searchedUser.username}</p>
                  <p className="text-sm text-gray-500">{searchedUser.email}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={addMemberMutation.isPending || isSearching}
          >
            İptal
          </Button>
          <Button
            onClick={handleAddMember}
            disabled={!searchedUser || addMemberMutation.isPending || isSearching}
          >
            {addMemberMutation.isPending && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}
            Ekle
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
