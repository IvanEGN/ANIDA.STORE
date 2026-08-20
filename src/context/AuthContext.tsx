"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export const ADMIN_EMAILS = [
  "anida.store.mid@gmail.com",
  "anidabyad@gmail.com",
];

export const ADMIN_PASSWORD = "Hermanos_2001";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "CUSTOMER";
  createdAt: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAdmin: boolean;
  login: (email: string, password?: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("anida_auth_user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error("Error al cargar sesión de autenticación:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password?: string, name?: string) => {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes("@")) {
      return { success: false, error: "Ingresa un correo electrónico válido." };
    }

    const isAdministrator = ADMIN_EMAILS.some((adm) => adm.toLowerCase() === cleanEmail);

    if (isAdministrator && password && password !== ADMIN_PASSWORD) {
      return { success: false, error: "Contraseña de administrador incorrecta." };
    }

    const loggedUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: name || (isAdministrator ? "Administrador ANIDA" : cleanEmail.split("@")[0]),
      email: cleanEmail,
      role: isAdministrator ? "ADMIN" : "CUSTOMER",
      createdAt: new Date().toISOString(),
    };

    setUser(loggedUser);
    localStorage.setItem("anida_auth_user", JSON.stringify(loggedUser));

    // Registrar en MySQL
    try {
      await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: loggedUser.name, email: cleanEmail }),
      });
    } catch (_) {}

    return { success: true };
  };

  const logout = () => {
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
