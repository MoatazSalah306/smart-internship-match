import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { AuthApi } from "@/lib/api/services";
import { tokenStore, type Role } from "@/lib/api/client";
import type { Company, Student, User } from "@/lib/api/types";

type Profile = Student | Company | null | undefined;

type AuthContextValue = {
  user: User | null;
  profile: Profile;
  role: Role | null;
  loading: boolean;
  login: (role: Role, email: string, password: string) => Promise<User>;
  registerStudent: (data: { name: string; email: string; password: string; password_confirmation: string }) => Promise<User>;
  registerCompany: (data: { name: string; email: string; password: string; password_confirmation: string; industry?: string; website?: string }) => Promise<User>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  setProfile: (p: Profile) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile>(null);
  const [loading, setLoading] = useState<boolean>(!!tokenStore.get());

  const refresh = useCallback(async () => {
    if (!tokenStore.get()) {
      setUser(null);
      setProfile(null);
      setLoading(false);
      return;
    }
    try {
      const res = await AuthApi.me();
      setUser(res.user);
      setProfile(res.profile ?? null);
      tokenStore.setRole(res.user.role);
    } catch {
      tokenStore.clear();
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const handleAuthResponse = useCallback((res: { token: string; user: User; profile?: Profile }) => {
    tokenStore.set(res.token);
    tokenStore.setRole(res.user.role);
    setUser(res.user);
    setProfile(res.profile ?? null);
    return res.user;
  }, []);

  const login = useCallback<AuthContextValue["login"]>(async (role, email, password) => {
    const res = await AuthApi.login(role, { email, password });
    return handleAuthResponse(res);
  }, [handleAuthResponse]);

  const registerStudent = useCallback<AuthContextValue["registerStudent"]>(async (data) => {
    const res = await AuthApi.registerStudent(data);
    return handleAuthResponse(res);
  }, [handleAuthResponse]);

  const registerCompany = useCallback<AuthContextValue["registerCompany"]>(async (data) => {
    const res = await AuthApi.registerCompany(data);
    return handleAuthResponse(res);
  }, [handleAuthResponse]);

  const logout = useCallback(async () => {
    try { await AuthApi.logout(); } catch { /* ignore */ }
    tokenStore.clear();
    setUser(null);
    setProfile(null);
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    profile,
    role: user?.role ?? null,
    loading,
    login,
    registerStudent,
    registerCompany,
    logout,
    refresh,
    setProfile,
  }), [user, profile, loading, login, registerStudent, registerCompany, logout, refresh]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
