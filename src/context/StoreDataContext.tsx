"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, HomeBannerData, OrderRecord, SizeRequestRecord } from "@/types";
import { INITIAL_BANNERS, INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_SIZE_REQUESTS } from "@/data/initialData";

interface StoreDataContextType {
  products: Product[];
  banners: HomeBannerData[];
  orders: OrderRecord[];
  sizeRequests: SizeRequestRecord[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  addBanner: (banner: HomeBannerData) => void;
  updateBanner: (banner: HomeBannerData) => void;
  deleteBanner: (id: string) => void;
  setBannersList: (banners: HomeBannerData[]) => void;
  addOrder: (order: OrderRecord) => void;
  updateOrderStatus: (orderId: string, status: any) => void;
  addSizeRequest: (request: Omit<SizeRequestRecord, "id" | "createdAt" | "status">) => SizeRequestRecord;
  updateSizeRequestStatus: (requestId: string, status: "PENDING" | "CONTACTED" | "RESOLVED") => void;
  deleteSizeRequest: (id: string) => void;
}

const StoreDataContext = createContext<StoreDataContextType | undefined>(undefined);

export const StoreDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [banners, setBanners] = useState<HomeBannerData[]>(INITIAL_BANNERS);
  const [orders, setOrders] = useState<OrderRecord[]>(INITIAL_ORDERS);
  const [sizeRequests, setSizeRequests] = useState<SizeRequestRecord[]>(INITIAL_SIZE_REQUESTS);

  // Cargar datos persistidos
  useEffect(() => {
    try {
      const savedProds = localStorage.getItem("anida_products_v3");
      if (savedProds) {
        const parsed = JSON.parse(savedProds);
        if (Array.isArray(parsed) && parsed.length > 0) setProducts(parsed);
      }

      const savedBanners = localStorage.getItem("anida_banners_v3");
      if (savedBanners) {
        const parsed = JSON.parse(savedBanners);
        if (Array.isArray(parsed) && parsed.length > 0) setBanners(parsed);
      }

      const savedOrders = localStorage.getItem("anida_orders_v3");
      if (savedOrders) setOrders(JSON.parse(savedOrders));

      const savedRequests = localStorage.getItem("anida_size_requests_v3");
      if (savedRequests) setSizeRequests(JSON.parse(savedRequests));
    } catch (e) {
      console.error("Error loading store data", e);
    }
  }, []);

  const addProduct = (prod: Product) => {
    setProducts((prev) => {
      const updated = [prod, ...prev];
      localStorage.setItem("anida_products_v3", JSON.stringify(updated));
      return updated;
    });
  };

  const updateProduct = (prod: Product) => {
    setProducts((prev) => {
      const updated = prev.map((p) => (p.id === prod.id ? prod : p));
      localStorage.setItem("anida_products_v3", JSON.stringify(updated));
      return updated;
    });
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      localStorage.setItem("anida_products_v3", JSON.stringify(updated));
      return updated;
    });
  };

  // Carousel Banners Multi-Slide
  const addBanner = (b: HomeBannerData) => {
    setBanners((prev) => {
      const updated = [...prev, b];
      localStorage.setItem("anida_banners_v3", JSON.stringify(updated));
      return updated;
    });
  };

  const updateBanner = (b: HomeBannerData) => {
    setBanners((prev) => {
      const updated = prev.map((item) => (item.id === b.id ? b : item));
      localStorage.setItem("anida_banners_v3", JSON.stringify(updated));
      return updated;
    });
  };

  const deleteBanner = (id: string) => {
    setBanners((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      localStorage.setItem("anida_banners_v3", JSON.stringify(updated));
      return updated;
    });
  };

  const setBannersList = (list: HomeBannerData[]) => {
    setBanners(list);
    localStorage.setItem("anida_banners_v3", JSON.stringify(list));
  };

  // Orders
  const addOrder = (order: OrderRecord) => {
    setOrders((prev) => {
      const updated = [order, ...prev];
      localStorage.setItem("anida_orders_v3", JSON.stringify(updated));
      return updated;
    });
  };

  const updateOrderStatus = (orderId: string, status: any) => {
    setOrders((prev) => {
      const updated = prev.map((o) => (o.id === orderId ? { ...o, orderStatus: status } : o));
      localStorage.setItem("anida_orders_v3", JSON.stringify(updated));
      return updated;
    });
  };

  // Size Requests (Waitlist de tallas para futuras prendas)
  const addSizeRequest = (data: Omit<SizeRequestRecord, "id" | "createdAt" | "status">) => {
    const newRecord: SizeRequestRecord = {
      ...data,
      id: `req-${Date.now()}`,
      createdAt: new Date().toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
      status: "PENDING",
    };

    setSizeRequests((prev) => {
      const updated = [newRecord, ...prev];
      localStorage.setItem("anida_size_requests_v3", JSON.stringify(updated));
      return updated;
    });

    return newRecord;
  };

  const updateSizeRequestStatus = (requestId: string, status: "PENDING" | "CONTACTED" | "RESOLVED") => {
    setSizeRequests((prev) => {
      const updated = prev.map((r) => (r.id === requestId ? { ...r, status } : r));
      localStorage.setItem("anida_size_requests_v3", JSON.stringify(updated));
      return updated;
    });
  };

  const deleteSizeRequest = (id: string) => {
    setSizeRequests((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      localStorage.setItem("anida_size_requests_v3", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <StoreDataContext.Provider
      value={{
        products,
        banners,
        orders,
        sizeRequests,
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

