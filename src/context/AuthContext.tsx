"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export const ADMIN_EMAILS = [
  "anidabyad@gmail.com",
  "anida.store.mid@gmail.com",
];

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "CUSTOMER";
  avatarUrl?: string;
  createdAt: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAdmin: boolean;
  login: (email: string, password?: string, name?: string) => { success: boolean; error?: string };
  signInWithSocial: (provider: "google" | "facebook") => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sincronizar usuario local y de Supabase
  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      try {
        // 1. Verificar si hay sesión activa en Supabase (ej. regreso de Google OAuth)
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData?.session?.user) {
          const sbUser = sessionData.session.user;
          const userEmail = sbUser.email || "";
          const isAdministrator = ADMIN_EMAILS.some((adm) => adm.toLowerCase() === userEmail.toLowerCase());

          const profile: UserProfile = {
            id: sbUser.id,
            name: sbUser.user_metadata?.full_name || sbUser.user_metadata?.name || userEmail.split("@")[0],
            email: userEmail,
            role: isAdministrator ? "ADMIN" : "CUSTOMER",
            avatarUrl: sbUser.user_metadata?.avatar_url,
            createdAt: sbUser.created_at || new Date().toISOString(),
          };

          if (isMounted) {
            setUser(profile);
            localStorage.setItem("anida_auth_user", JSON.stringify(profile));
          }
          return;
        }

        // 2. Si no hay sesión en Supabase, cargar usuario guardado localmente
        const savedUser = localStorage.getItem("anida_auth_user");
        if (savedUser && isMounted) {
          setUser(JSON.parse(savedUser));
        }
      } catch (e) {
        console.error("Error al inicializar sesión de autenticación:", e);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    initAuth();

    // Escuchar cambios de autenticación en vivo de Supabase (Login con Google / Facebook)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const sbUser = session.user;
        const userEmail = sbUser.email || "";
        const isAdministrator = ADMIN_EMAILS.some((adm) => adm.toLowerCase() === userEmail.toLowerCase());

        const profile: UserProfile = {
          id: sbUser.id,
          name: sbUser.user_metadata?.full_name || sbUser.user_metadata?.name || userEmail.split("@")[0],
          email: userEmail,
          role: isAdministrator ? "ADMIN" : "CUSTOMER",
          avatarUrl: sbUser.user_metadata?.avatar_url,
          createdAt: sbUser.created_at || new Date().toISOString(),
        };

        setUser(profile);
        localStorage.setItem("anida_auth_user", JSON.stringify(profile));
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        localStorage.removeItem("anida_auth_user");
      }
    });

    return () => {
      isMounted = false;
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const login = (email: string, password?: string, name?: string) => {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes("@")) {
      return { success: false, error: "Ingresa un correo electrónico válido." };
    }

    const isAdministrator = ADMIN_EMAILS.some((adm) => adm.toLowerCase() === cleanEmail);

    const loggedUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: name || (isAdministrator ? "Administrador ANIDA" : cleanEmail.split("@")[0]),
      email: cleanEmail,
      role: isAdministrator ? "ADMIN" : "CUSTOMER",
      createdAt: new Date().toISOString(),
    };

    setUser(loggedUser);
    localStorage.setItem("anida_auth_user", JSON.stringify(loggedUser));
    return { success: true };
  };

  // Inicio de sesión rápido con Google o Facebook vía Supabase OAuth
  const signInWithSocial = async (provider: "google" | "facebook") => {
    try {
      const siteUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${siteUrl}/login`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        console.error(`[Social Auth] Error con ${provider}:`, error.message);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (e: any) {
      console.error(`[Social Auth] Excepción con ${provider}:`, e);
      return { success: false, error: e?.message || "Error al conectar con el proveedor social" };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (_) {}
    setUser(null);
    localStorage.removeItem("anida_auth_user");
  };

  const isAdmin =
    !!user &&
    user.role === "ADMIN" &&
    ADMIN_EMAILS.some((adm) => adm.toLowerCase() === user.email.toLowerCase());

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        login,
        signInWithSocial,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
