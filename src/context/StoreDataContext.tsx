"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, HomeBannerData, OrderRecord } from "@/types";

interface StoreDataContextType {
  products: Product[];
  banners: HomeBannerData[];
  orders: OrderRecord[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  updateBanner: (banner: HomeBannerData) => void;
  addOrder: (order: OrderRecord) => void;
  updateOrderStatus: (orderId: string, status: any) => void;
}

const DEFAULT_BANNER: HomeBannerData = {
  id: "banner-hero-main",
  tagline: "ATELIER // NUEVA TEMPORADA",
  title: "SILUETAS PURAS & ESTRUCTURA MINIMAL",
  subtitle: "Prendas de alta confección y materiales de origen ético.",
  ctaText: "Descubrir Colección",
  ctaLink: "/shop",
  mediaType: "IMAGE",
  mediaUrl: "", // Inicialmente vacía para que el admin suba su foto WebP real
  isActive: true,
};

const StoreDataContext = createContext<StoreDataContextType | undefined>(undefined);

export const StoreDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<HomeBannerData[]>([DEFAULT_BANNER]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);

  // Cargar datos persistidos
  useEffect(() => {
    try {
      const savedProds = localStorage.getItem("anida_products_v2");
      if (savedProds) setProducts(JSON.parse(savedProds));

      const savedBanners = localStorage.getItem("anida_banners_v2");
      if (savedBanners) setBanners(JSON.parse(savedBanners));

      const savedOrders = localStorage.getItem("anida_orders_v2");
      if (savedOrders) setOrders(JSON.parse(savedOrders));
    } catch (e) {
      console.error("Error loading store data", e);
    }
  }, []);

  const addProduct = (prod: Product) => {
    setProducts((prev) => {
      const updated = [prod, ...prev];
      localStorage.setItem("anida_products_v2", JSON.stringify(updated));
      return updated;
    });
  };

  const updateProduct = (prod: Product) => {
    setProducts((prev) => {
      const updated = prev.map((p) => (p.id === prod.id ? prod : p));
      localStorage.setItem("anida_products_v2", JSON.stringify(updated));
      return updated;
    });
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      localStorage.setItem("anida_products_v2", JSON.stringify(updated));
      return updated;
    });
  };

  const updateBanner = (b: HomeBannerData) => {
    setBanners([b]);
    localStorage.setItem("anida_banners_v2", JSON.stringify([b]));
  };

  const addOrder = (order: OrderRecord) => {
    setOrders((prev) => {
      const updated = [order, ...prev];
      localStorage.setItem("anida_orders_v2", JSON.stringify(updated));
      return updated;
    });
  };

  const updateOrderStatus = (orderId: string, status: any) => {
    setOrders((prev) => {
      const updated = prev.map((o) => (o.id === orderId ? { ...o, orderStatus: status } : o));
      localStorage.setItem("anida_orders_v2", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <StoreDataContext.Provider
      value={{
        products,
        banners,
        orders,
        addProduct,
        updateProduct,
        deleteProduct,
        updateBanner,
        addOrder,
        updateOrderStatus,
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
