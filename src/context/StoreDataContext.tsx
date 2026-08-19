"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, HomeBannerData, OrderRecord, SizeRequestRecord } from "@/types";
import { INITIAL_BANNERS, INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_SIZE_REQUESTS } from "@/data/initialData";
import { getStorageItem, setStorageItem, clearAllStoreData } from "@/lib/storage";

const PRODUCTS_KEY = "anida_products_v4";
const BANNERS_KEY = "anida_banners_v4";
const ORDERS_KEY = "anida_orders_v4";
const REQUESTS_KEY = "anida_size_requests_v4";

interface StoreDataContextType {
  products: Product[];
  banners: HomeBannerData[];
  orders: OrderRecord[];
  sizeRequests: SizeRequestRecord[];
  isLoaded: boolean;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addBanner: (banner: HomeBannerData) => Promise<void>;
  updateBanner: (banner: HomeBannerData) => Promise<void>;
  deleteBanner: (id: string) => Promise<void>;
  setBannersList: (banners: HomeBannerData[]) => Promise<void>;
  addOrder: (order: OrderRecord) => Promise<void>;
  updateOrderStatus: (orderId: string, status: any) => Promise<void>;
  addSizeRequest: (request: Omit<SizeRequestRecord, "id" | "createdAt" | "status">) => SizeRequestRecord;
  updateSizeRequestStatus: (requestId: string, status: "PENDING" | "CONTACTED" | "RESOLVED") => Promise<void>;
  deleteSizeRequest: (id: string) => Promise<void>;
  resetToEmptyStore: () => Promise<void>;
}

const StoreDataContext = createContext<StoreDataContextType | undefined>(undefined);

export const StoreDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [banners, setBanners] = useState<HomeBannerData[]>(INITIAL_BANNERS);
  const [orders, setOrders] = useState<OrderRecord[]>(INITIAL_ORDERS);
  const [sizeRequests, setSizeRequests] = useState<SizeRequestRecord[]>(INITIAL_SIZE_REQUESTS);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Cargar datos persistidos desde IndexedDB (con soporte para imágenes de alta resolución)
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [savedProds, savedBanners, savedOrders, savedRequests] = await Promise.all([
          getStorageItem<Product[]>(PRODUCTS_KEY, INITIAL_PRODUCTS),
          getStorageItem<HomeBannerData[]>(BANNERS_KEY, INITIAL_BANNERS),
          getStorageItem<OrderRecord[]>(ORDERS_KEY, INITIAL_ORDERS),
          getStorageItem<SizeRequestRecord[]>(REQUESTS_KEY, INITIAL_SIZE_REQUESTS),
        ]);

        if (isMounted) {
          if (Array.isArray(savedProds)) setProducts(savedProds);
          if (Array.isArray(savedBanners) && savedBanners.length > 0) setBanners(savedBanners);
          if (Array.isArray(savedOrders)) setOrders(savedOrders);
          if (Array.isArray(savedRequests)) setSizeRequests(savedRequests);
          setIsLoaded(true);
        }
      } catch (e) {
        console.error("[StoreDataContext] Error al cargar los datos persistidos:", e);
        if (isMounted) setIsLoaded(true);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Products
  const addProduct = async (prod: Product) => {
    const updated = [prod, ...products];
    setProducts(updated);
    await setStorageItem(PRODUCTS_KEY, updated);
  };

  const updateProduct = async (prod: Product) => {
    const updated = products.map((p) => (p.id === prod.id ? prod : p));
    setProducts(updated);
    await setStorageItem(PRODUCTS_KEY, updated);
  };

  const deleteProduct = async (id: string) => {
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    await setStorageItem(PRODUCTS_KEY, updated);
  };

  // Banners
  const addBanner = async (b: HomeBannerData) => {
    const updated = [...banners, b];
    setBanners(updated);
    await setStorageItem(BANNERS_KEY, updated);
  };

  const updateBanner = async (b: HomeBannerData) => {
    const updated = banners.map((item) => (item.id === b.id ? b : item));
    setBanners(updated);
    await setStorageItem(BANNERS_KEY, updated);
  };

  const deleteBanner = async (id: string) => {
    const updated = banners.filter((item) => item.id !== id);
    setBanners(updated);
    await setStorageItem(BANNERS_KEY, updated);
  };

  const setBannersList = async (list: HomeBannerData[]) => {
    setBanners(list);
    await setStorageItem(BANNERS_KEY, list);
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

  // Reiniciar todo a tienda limpia / vacía
  const resetToEmptyStore = async () => {
    await clearAllStoreData();
    setProducts([]);
    setOrders([]);
    setSizeRequests([]);
    setBanners(INITIAL_BANNERS);
    await setStorageItem(PRODUCTS_KEY, []);
    await setStorageItem(BANNERS_KEY, INITIAL_BANNERS);
    await setStorageItem(ORDERS_KEY, []);
    await setStorageItem(REQUESTS_KEY, []);
  };

  return (
    <StoreDataContext.Provider
      value={{
        products,
        banners,
        orders,
        sizeRequests,
        isLoaded,
        addProduct,
        updateProduct,
        deleteProduct,
        addBanner,
        updateBanner,
        deleteBanner,
        setBannersList,
        addOrder,
        updateOrderStatus,
        addSizeRequest,
        updateSizeRequestStatus,
        deleteSizeRequest,
        resetToEmptyStore,
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
