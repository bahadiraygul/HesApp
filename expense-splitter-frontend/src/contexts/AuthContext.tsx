"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, AuthResponse } from "@/types";
import { auth as authUtils } from "@/lib/auth";
import { api } from "@/services/api";
import { LoginInput, RegisterInput } from "@/lib/validators";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginInput) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = authUtils.getToken();
      const savedUser = authUtils.getUser();

      if (token && savedUser) {
        setUser(savedUser);
        // Optionally verify token is still valid
        try {
          const currentUser = await api.get<User>("/auth/profile");
          setUser(currentUser);
          authUtils.setUser(currentUser);
        } catch {
          // Token invalid, clear auth
          authUtils.clearAuth();
          setUser(null);
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (data: LoginInput) => {
    try {
      const response = await api.post<AuthResponse>("/auth/login", {
        emailOrUsername: data.emailOrUsername,
        password: data.password,
      });

      authUtils.setToken(response.access_token);
      authUtils.setUser(response.user);
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  const register = async (data: RegisterInput) => {
    try {
      const response = await api.post<AuthResponse>("/auth/register", data);

      authUtils.setToken(response.access_token);
      authUtils.setUser(response.user);
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authUtils.clearAuth();
    setUser(null);
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  };

  const refreshUser = async () => {
    try {
      const currentUser = await api.get<User>("/auth/profile");
      setUser(currentUser);
      authUtils.setUser(currentUser);
    } catch (error) {
      console.error("Failed to refresh user:", error);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
