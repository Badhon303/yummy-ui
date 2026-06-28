"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { apiFetch, ApiError } from "@/lib/api-client";
import type { User } from "@/lib/types";

export type AuthMode = "login" | "register";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  isAuthOpen: boolean;
  authMode: AuthMode;
  openAuth: (mode?: AuthMode) => void;
  closeAuth: () => void;
}

export interface RegisterInput {
  name: string;
  email: string;
  phone: string;
  password: string;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");

  const openAuth = useCallback((mode: AuthMode = "login") => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  }, []);

  const closeAuth = useCallback(() => setIsAuthOpen(false), []);

  const refresh = useCallback(async () => {
    try {
      const data = (await apiFetch("/api/users/me")) as { user?: User };
      setUser(data.user ?? null);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setUser(null);
      } else {
        // leave existing user if the request fails for a non-auth reason
      }
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    refresh()
      .catch(() => {})
      .finally(() => {
        if (mounted) setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [refresh]);

  const login = useCallback(async (email: string, password: string) => {
    await apiFetch("/api/users/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    await refresh();
  }, [refresh]);

  const register = useCallback(async (input: RegisterInput) => {
    await apiFetch("/api/users", {
      method: "POST",
      body: JSON.stringify({
        name: input.name,
        email: input.email,
        phone: input.phone,
        password: input.password,
      }),
    });
    await login(input.email, input.password);
  }, [login]);

  const logout = useCallback(async () => {
    await apiFetch("/api/users/logout", { method: "POST" });
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        refresh,
        isAuthOpen,
        authMode,
        openAuth,
        closeAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
