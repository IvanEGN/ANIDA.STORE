"use client";

import React, { createContext, useContext, useState } from "react";
import { Product, HomeBannerData, OrderRecord, SizeRequestRecord } from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────────────────────────────────────
interface StoreDataContextType {
  products: Product[];
  banners: HomeBannerData[];
  orders: OrderRecord[];
  sizeRequests: SizeRequestRecord[];
  announcementText: string;
  isLoaded: boolean;
  isSyncing: boolean;
  addProduct: (product: Product) => Promise<{ success: boolean; error?: string }>;
  updateProduct: (product: Product) => Promise<{ success: boolean; error?: string }>;
  deleteProduct: (id: string) => Promise<{ success: boolean; error?: string }>;
  addBanner: (banner: HomeBannerData) => Promise<{ success: boolean; error?: string }>;
  updateBanner: (banner: HomeBannerData) => Promise<{ success: boolean; error?: string }>;
  deleteBanner: (id: string) => Promise<{ success: boolean; error?: string }>;
  setBannersList: (banners: HomeBannerData[]) => Promise<void>;
  updateAnnouncementText: (text: string) => Promise<{ success: boolean; error?: string }>;
  addOrder: (order: OrderRecord) => Promise<void>;
  updateOrderStatus: (orderId: string, status: any) => Promise<void>;
  addSizeRequest: (request: Omit<SizeRequestRecord, "id" | "createdAt" | "status">) => SizeRequestRecord;
  updateSizeRequestStatus: (requestId: string, status: "PENDING" | "CONTACTED" | "RESOLVED") => Promise<void>;
  deleteSizeRequest: (id: string) => Promise<void>;
  resetToEmptyStore: () => Promise<void>;
  refreshStoreData: () => Promise<void>;
  // syncLocalToRemoteMySQL ya no aplica — todo viene de MySQL via SSR
}

const StoreDataContext = createContext<StoreDataContextType | undefined>(undefined);

// ─────────────────────────────────────────────────────────────────────────────
// Provider — los datos iniciales vienen SIEMPRE del servidor (SSR en layout.tsx)
// ─────────────────────────────────────────────────────────────────────────────
interface StoreDataProviderProps {
  children: React.ReactNode;
  initialProducts?: Product[];
  initialBanners?: HomeBannerData[];
  initialAnnouncement?: string;
}

const DEFAULT_ANNOUNCEMENT =
  "Envío sin costo en compras mayores a $1,499 MXN • Diseñado para almas libres y audaces";

export const StoreDataProvider: React.FC<StoreDataProviderProps> = ({
  children,
  initialProducts = [],
  initialBanners = [],
  initialAnnouncement = DEFAULT_ANNOUNCEMENT,
}) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [banners, setBanners] = useState<HomeBannerData[]>(initialBanners);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [sizeRequests, setSizeRequests] = useState<SizeRequestRecord[]>([]);
  const [announcementText, setAnnouncementText] = useState<string>(initialAnnouncement);
  // Si vienen datos del SSR ya estamos cargados
  const [isLoaded] = useState<boolean>(true);
  const [isSyncing] = useState<boolean>(false);

  // ── Refresh desde la API (para actualizar después de mutaciones) ───────────
  const refreshStoreData = async () => {
    try {
      const [resProds, resBanners, resSettings] = await Promise.all([
        fetch("/api/products", { cache: "no-store" }).catch(() => null),
        fetch("/api/banners", { cache: "no-store" }).catch(() => null),
        fetch("/api/settings", { cache: "no-store" }).catch(() => null),
      ]);

      if (resProds?.ok) {
        const json = await resProds.json();
        if (json.success && Array.isArray(json.data)) setProducts(json.data);
      }
      if (resBanners?.ok) {
        const json = await resBanners.json();
        if (json.success && Array.isArray(json.data)) setBanners(json.data);
      }
      if (resSettings?.ok) {
        const json = await resSettings.json();
        if (json.success && json.announcementBar) setAnnouncementText(json.announcementBar);
      }
    } catch (e) {
      console.warn("[StoreDataContext] Error al refrescar:", e);
    }
  };

  // ── Products CRUD ──────────────────────────────────────────────────────────
  const addProduct = async (prod: Product) => {
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prod),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Error al guardar en MySQL");
      setProducts((prev) => [prod, ...prev]);
      return { success: true };
    } catch (e: any) {
      console.error("[StoreDataContext] addProduct:", e);
      return { success: false, error: e?.message || "Error al guardar" };
    }
  };

  const updateProduct = async (prod: Product) => {
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prod),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Error al actualizar en MySQL");
      setProducts((prev) => prev.map((p) => (p.id === prod.id ? prod : p)));
      return { success: true };
    } catch (e: any) {
      console.error("[StoreDataContext] updateProduct:", e);
      return { success: false, error: e?.message || "Error al actualizar" };
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/products?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Error al eliminar de MySQL");
      setProducts((prev) => prev.filter((p) => p.id !== id));
      return { success: true };
    } catch (e: any) {
      console.error("[StoreDataContext] deleteProduct:", e);
      return { success: false, error: e?.message || "Error al eliminar" };
    }
  };

  // ── Banners CRUD ───────────────────────────────────────────────────────────
  const addBanner = async (b: HomeBannerData) => {
    try {
      const res = await fetch("/api/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(b),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Error al guardar banner");
      setBanners((prev) => [...prev, b]);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || "Error al guardar banner" };
    }
  };

  const updateBanner = async (b: HomeBannerData) => {
    try {
      const res = await fetch("/api/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(b),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Error al actualizar banner");
      setBanners((prev) => prev.map((item) => (item.id === b.id ? b : item)));
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || "Error al actualizar banner" };
    }
  };

  const deleteBanner = async (id: string) => {
    try {
      const res = await fetch(`/api/banners?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Error al eliminar banner");
      setBanners((prev) => prev.filter((item) => item.id !== id));
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || "Error al eliminar banner" };
    }
  };

  const setBannersList = async (list: HomeBannerData[]) => {
    setBanners(list);
    list.forEach((b) => {
      fetch("/api/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(b),
      }).catch(console.error);
    });
  };

  // ── Announcement ───────────────────────────────────────────────────────────
  const updateAnnouncementText = async (text: string) => {
    setAnnouncementText(text);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ announcementBar: text }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Error al actualizar anuncio");
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || "Error al guardar anuncio" };
    }
  };

  // ── Orders ─────────────────────────────────────────────────────────────────
  const addOrder = async (order: OrderRecord) => {
    setOrders((prev) => [order, ...prev]);
  };

  const updateOrderStatus = async (orderId: string, status: any) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, orderStatus: status } : o)));
  };

  // ── Size Requests ──────────────────────────────────────────────────────────
  const addSizeRequest = (data: Omit<SizeRequestRecord, "id" | "createdAt" | "status">) => {
    const newRecord: SizeRequestRecord = {
      ...data,
      id: `req-${Date.now()}`,
      createdAt: new Date().toLocaleDateString("es-MX", {
        day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
      }),
      status: "PENDING",
    };
    setSizeRequests((prev) => [newRecord, ...prev]);
    return newRecord;
  };

  const updateSizeRequestStatus = async (requestId: string, status: "PENDING" | "CONTACTED" | "RESOLVED") => {
    setSizeRequests((prev) => prev.map((r) => (r.id === requestId ? { ...r, status } : r)));
  };

  const deleteSizeRequest = async (id: string) => {
    setSizeRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const resetToEmptyStore = async () => {
    setProducts([]);
    setBanners([]);
    setOrders([]);
    setSizeRequests([]);
    try {
      await fetch("/api/store/reset", { method: "POST" });
    } catch (e) {
      console.error("[StoreDataContext] Error reseteando:", e);
    }
  };

  return (
    <StoreDataContext.Provider
      value={{
        products,
        banners,
        orders,
        sizeRequests,
        announcementText,
        isLoaded,
        isSyncing,
        addProduct,
        updateProduct,
        deleteProduct,
        addBanner,
        updateBanner,
        deleteBanner,
        setBannersList,
        updateAnnouncementText,
        addOrder,
        updateOrderStatus,
        addSizeRequest,
        updateSizeRequestStatus,
        deleteSizeRequest,
        resetToEmptyStore,
        refreshStoreData,
      }}
    >
      {children}
    </StoreDataContext.Provider>
  );
};

export const useStoreData = () => {
  const context = useContext(StoreDataContext);
  if (!context) throw new Error("useStoreData must be used within a StoreDataProvider");
  return context;
};
