"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, HomeBannerData, OrderRecord, SizeRequestRecord } from "@/types";
import { INITIAL_BANNERS, INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_SIZE_REQUESTS } from "@/data/initialData";
import { getStorageItem, setStorageItem, clearAllStoreData } from "@/lib/storage";

const PRODUCTS_KEY = "anida_products_v6";
const BANNERS_KEY = "anida_banners_v6";
const ORDERS_KEY = "anida_orders_v6";
const REQUESTS_KEY = "anida_size_requests_v6";
const ANNOUNCEMENT_KEY = "anida_announcement_v6";

const DEFAULT_ANNOUNCEMENT =
  "Envío sin costo en compras mayores a $1,499 MXN • Diseñado para almas libres y audaces";

interface StoreDataContextType {
  products: Product[];
  banners: HomeBannerData[];
  orders: OrderRecord[];
  sizeRequests: SizeRequestRecord[];
  announcementText: string;
  isLoaded: boolean;
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
}

const StoreDataContext = createContext<StoreDataContextType | undefined>(undefined);

export const StoreDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [banners, setBanners] = useState<HomeBannerData[]>(INITIAL_BANNERS);
  const [orders, setOrders] = useState<OrderRecord[]>(INITIAL_ORDERS);
  const [sizeRequests, setSizeRequests] = useState<SizeRequestRecord[]>(INITIAL_SIZE_REQUESTS);
  const [announcementText, setAnnouncementText] = useState<string>(DEFAULT_ANNOUNCEMENT);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Cargar datos directamente desde MySQL en Hostinger
  const refreshStoreData = async () => {
    try {
      const [resProds, resBanners, resSettings] = await Promise.all([
        fetch("/api/products", { cache: "no-store", headers: { "Cache-Control": "no-cache" } }).catch(() => null),
        fetch("/api/banners", { cache: "no-store", headers: { "Cache-Control": "no-cache" } }).catch(() => null),
        fetch("/api/settings", { cache: "no-store", headers: { "Cache-Control": "no-cache" } }).catch(() => null),
      ]);

      if (resProds && resProds.ok) {
        const json = await resProds.json();
        if (json.success && Array.isArray(json.data)) {
          setProducts(json.data);
          setStorageItem(PRODUCTS_KEY, json.data);
        }
      }

      if (resBanners && resBanners.ok) {
        const json = await resBanners.json();
        if (json.success && Array.isArray(json.data)) {
          setBanners(json.data);
          setStorageItem(BANNERS_KEY, json.data);
        }
      }

      if (resSettings && resSettings.ok) {
        const json = await resSettings.json();
        if (json.success && json.announcementBar) {
          setAnnouncementText(json.announcementBar);
          setStorageItem(ANNOUNCEMENT_KEY, json.announcementBar);
        }
      }

      const [savedOrders, savedRequests] = await Promise.all([
        getStorageItem<OrderRecord[]>(ORDERS_KEY, INITIAL_ORDERS),
        getStorageItem<SizeRequestRecord[]>(REQUESTS_KEY, INITIAL_SIZE_REQUESTS),
      ]);

      if (Array.isArray(savedOrders)) setOrders(savedOrders);
      if (Array.isArray(savedRequests)) setSizeRequests(savedRequests);
    } catch (e) {
      console.warn("[StoreDataContext] Error al consultar MySQL:", e);
    } finally {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    refreshStoreData();
  }, []);

  // Products
  const addProduct = async (prod: Product) => {
    const updated = [prod, ...products];
    setProducts(updated);
    await setStorageItem(PRODUCTS_KEY, updated);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prod),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Error al guardar en MySQL");
      }
      return { success: true };
    } catch (e: any) {
      console.error("[StoreDataContext] Error guardando producto en MySQL:", e);
      return { success: false, error: e?.message || "Error al guardar en base de datos" };
    }
  };

  const updateProduct = async (prod: Product) => {
    const updated = products.map((p) => (p.id === prod.id ? prod : p));
    setProducts(updated);
    await setStorageItem(PRODUCTS_KEY, updated);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prod),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Error al actualizar en MySQL");
      }
      return { success: true };
    } catch (e: any) {
      console.error("[StoreDataContext] Error actualizando producto en MySQL:", e);
      return { success: false, error: e?.message || "Error al actualizar en base de datos" };
    }
  };

  const deleteProduct = async (id: string) => {
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    await setStorageItem(PRODUCTS_KEY, updated);

    try {
      const res = await fetch(`/api/products?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Error al eliminar de MySQL");
      }
      return { success: true };
    } catch (e: any) {
      console.error("[StoreDataContext] Error eliminando producto en MySQL:", e);
      return { success: false, error: e?.message || "Error al eliminar de base de datos" };
    }
  };

  // Banners
  const addBanner = async (b: HomeBannerData) => {
    const updated = [...banners, b];
    setBanners(updated);
    await setStorageItem(BANNERS_KEY, updated);

    try {
      const res = await fetch("/api/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(b),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Error al guardar banner en MySQL");
      }
      return { success: true };
    } catch (e: any) {
      console.error("[StoreDataContext] Error guardando banner en MySQL:", e);
      return { success: false, error: e?.message || "Error al guardar banner en base de datos" };
    }
  };

  const updateBanner = async (b: HomeBannerData) => {
    const updated = banners.map((item) => (item.id === b.id ? b : item));
    setBanners(updated);
    await setStorageItem(BANNERS_KEY, updated);

    try {
      const res = await fetch("/api/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(b),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Error al actualizar banner en MySQL");
      }
      return { success: true };
    } catch (e: any) {
      console.error("[StoreDataContext] Error actualizando banner en MySQL:", e);
      return { success: false, error: e?.message || "Error al actualizar banner en base de datos" };
    }
  };

  const deleteBanner = async (id: string) => {
    const updated = banners.filter((item) => item.id !== id);
    setBanners(updated);
    await setStorageItem(BANNERS_KEY, updated);

    try {
      const res = await fetch(`/api/banners?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Error al eliminar banner de MySQL");
      }
      return { success: true };
    } catch (e: any) {
      console.error("[StoreDataContext] Error eliminando banner en MySQL:", e);
      return { success: false, error: e?.message || "Error al eliminar banner de base de datos" };
    }
  };

  const setBannersList = async (list: HomeBannerData[]) => {
    setBanners(list);
    await setStorageItem(BANNERS_KEY, list);
    list.forEach((b) => {
      fetch("/api/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(b),
      }).catch(console.error);
    });
  };

  // Barra de Anuncios Superior
  const updateAnnouncementText = async (text: string) => {
    setAnnouncementText(text);
    await setStorageItem(ANNOUNCEMENT_KEY, text);

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ announcementBar: text }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Error al actualizar anuncio en MySQL");
      }
      return { success: true };
    } catch (e: any) {
      console.error("[StoreDataContext] Error guardando anuncio en MySQL:", e);
      return { success: false, error: e?.message || "Error al guardar anuncio en base de datos" };
    }
  };

  // Orders
  const addOrder = async (order: OrderRecord) => {
    const updated = [order, ...orders];
    setOrders(updated);
    await setStorageItem(ORDERS_KEY, updated);
  };

  const updateOrderStatus = async (orderId: string, status: any) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, orderStatus: status } : o));
    setOrders(updated);
    await setStorageItem(ORDERS_KEY, updated);
  };

  // Size Requests
  const addSizeRequest = (data: Omit<SizeRequestRecord, "id" | "createdAt" | "status">) => {
    const newRecord: SizeRequestRecord = {
      ...data,
      id: `req-${Date.now()}`,
      createdAt: new Date().toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
      status: "PENDING",
    };

    const updated = [newRecord, ...sizeRequests];
    setSizeRequests(updated);
    setStorageItem(REQUESTS_KEY, updated);
    return newRecord;
  };

  const updateSizeRequestStatus = async (requestId: string, status: "PENDING" | "CONTACTED" | "RESOLVED") => {
    const updated = sizeRequests.map((r) => (r.id === requestId ? { ...r, status } : r));
    setSizeRequests(updated);
    await setStorageItem(REQUESTS_KEY, updated);
  };

  const deleteSizeRequest = async (id: string) => {
    const updated = sizeRequests.filter((r) => r.id !== id);
    setSizeRequests(updated);
    await setStorageItem(REQUESTS_KEY, updated);
  };

  const resetToEmptyStore = async () => {
    await clearAllStoreData();
    setProducts([]);
    setOrders([]);
    setSizeRequests([]);
    setBanners([]);
    await setStorageItem(PRODUCTS_KEY, []);
    await setStorageItem(BANNERS_KEY, []);
    await setStorageItem(ORDERS_KEY, []);
    await setStorageItem(REQUESTS_KEY, []);

    try {
      await fetch("/api/store/reset", { method: "POST" });
    } catch (e) {
      console.error("[StoreDataContext] Error reseteando base de datos:", e);
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
  if (!context) {
    throw new Error("useStoreData must be used within a StoreDataProvider");
  }
  return context;
};
