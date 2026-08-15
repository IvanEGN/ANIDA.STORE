"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem } from "@/types";

interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (item: Omit<CartItem, "id">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  shippingThreshold: number;
  shippingCost: number;
  freeShippingProgress: number;
  discountCode: string;
  discountAmount: number;
  applyDiscount: (code: string) => { success: boolean; message: string };
  removeDiscount: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD = 1499;
const STANDARD_SHIPPING_COST = 180;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);

  // Load from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("anida_cart_v1");
      if (saved) {
        setCart(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load cart from storage", e);
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    try {
      localStorage.setItem("anida_cart_v1", JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to save cart to storage", e);
    }
  }, [cart]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = (newItem: Omit<CartItem, "id">) => {
    const id = `${newItem.productId}-${newItem.variantId}`;
    setCart((prev) => {
      const existing = prev.find((item) => item.id === id);
      if (existing) {
        return prev.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + newItem.quantity } : item
        );
      }
      return [...prev, { ...newItem, id }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    setDiscountCode("");
    setDiscountAmount(0);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : STANDARD_SHIPPING_COST;
  const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const applyDiscount = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === "ANIDA10") {
      const discount = subtotal * 0.1;
      setDiscountCode("ANIDA10 (10% OFF)");
      setDiscountAmount(discount);
      return { success: true, message: "Cupón del 10% aplicado correctamente" };
    }
    if (cleanCode === "WELCOME20") {
      const discount = subtotal * 0.2;
      setDiscountCode("WELCOME20 (20% OFF)");
      setDiscountAmount(discount);
      return { success: true, message: "Cupón de bienvenida 20% aplicado" };
    }
    return { success: false, message: "Cupón no válido o expirado" };
  };

  const removeDiscount = () => {
    setDiscountCode("");
    setDiscountAmount(0);
  };

  const total = Math.max(0, subtotal - discountAmount + shippingCost);

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        subtotal,
        shippingThreshold: FREE_SHIPPING_THRESHOLD,
        shippingCost,
        freeShippingProgress,
        discountCode,
        discountAmount,
        applyDiscount,
        removeDiscount,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
