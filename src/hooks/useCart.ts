"use client";

import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/context/toast-context";

const CART_KEY = "cart";

export interface CartItem {
  id: string;
  title: string;
  price: string | number;
  discountPrice?: string | number | null;
  images: string[];
  slug: string;
  qty: number;
}

function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(CART_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as CartItem[];
  } catch (e) {
    console.error("Failed to parse cart", e);
    return [];
  }
}

export function useCart() {
  const toast = useToast();
  const [cart, setCart] = useState<CartItem[]>(readCart);

  useEffect(() => {
    const handleStorageChange = () => setCart(readCart());
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const saveCart = useCallback((newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem(CART_KEY, JSON.stringify(newCart));
    window.dispatchEvent(new Event("storage"));
  }, []);

  const addItem = useCallback(
    (item: Omit<CartItem, "qty">, qty = 1) => {
      if (cart.some((i) => i.id === item.id)) {
        toast.error(`${item.title} is already in the cart`);
        return;
      }
      saveCart([...cart, { ...item, qty }]);
      toast.success(`${item.title} added to cart!`);
    },
    [cart, saveCart, toast],
  );

  const removeItem = useCallback(
    (id: string) => {
      saveCart(cart.filter((item) => item.id !== id));
      toast.info("Item removed from cart");
    },
    [cart, saveCart, toast],
  );

  const updateQty = useCallback(
    (id: string, qty: number) => {
      if (qty < 1) return;
      saveCart(cart.map((item) => (item.id === id ? { ...item, qty } : item)));
    },
    [cart, saveCart],
  );

  const clearCart = useCallback(() => {
    saveCart([]);
    toast.info("Cart cleared");
  }, [saveCart, toast]);

  const totalCount = cart.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = cart.reduce((acc, item) => acc + Number(item.discountPrice || item.price) * item.qty, 0);

  return { cart, addItem, removeItem, updateQty, clearCart, totalCount, totalPrice };
}