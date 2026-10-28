"use client";

import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/context/toast-context";

export interface CartItem {
  id: string;
  title: string;
  price: string | number;
  discountPrice?: string | number;
  images: string[];
  slug: string;
  qty: number;
}

export function useCart() {
  const toast = useToast();
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        try {
          return JSON.parse(savedCart);
        } catch (e) {
          console.error("Failed to parse cart", e);
        }
      }
    }
    return [];
  });

  // Stay in sync with other instances/tabs
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedCart = localStorage.getItem("cart");
      if (updatedCart) {
        try {
          setCart(JSON.parse(updatedCart));
        } catch (e) {
          console.error("Failed to parse updated cart", e);
        }
      } else {
        setCart([]);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    // Trigger storage event for other instances/tabs
    window.dispatchEvent(new Event("storage"));
  };

  const addItem = useCallback(
    (item: any, qty: number = 1) => {
      const existingItem = cart.find((i) => i.id === item.id);

      if (existingItem) {
        toast.error(`${item.title} is already in the cart`);
        return;
      }

      const newItem: CartItem = {
        id: item.id,
        title: item.title,
        price: item.price,
        discountPrice: item.discountPrice,
        images: item.images,
        slug: item.slug,
        qty: qty,
      };

      const newCart = [...cart, newItem];
      setCart(newCart);
      localStorage.setItem("cart", JSON.stringify(newCart));
      window.dispatchEvent(new Event("storage"));
      toast.success(`${item.title} added to cart!`);
    },
    [cart, toast]
  );

  const removeItem = (id: string) => {
    const newCart = cart.filter((item) => item.id !== id);
    saveCart(newCart);
    toast.info("Item removed from cart");
  };

  const updateQty = (id: string, qty: number) => {
    if (qty < 1) return;
    const newCart = cart.map((item) => (item.id === id ? { ...item, qty } : item));
    saveCart(newCart);
  };

  const clearCart = () => {
    saveCart([]);
    toast.info("Cart cleared");
  };

  const totalCount = cart.reduce((acc, item) => acc + item.qty, 0);

  const totalPrice = cart.reduce((acc, item) => {
    const price = item.discountPrice || item.price;
    return acc + Number(price) * item.qty;
  }, 0);

  return {
    cart,
    addItem,
    removeItem,
    updateQty,
    clearCart,
    totalCount,
    totalPrice,
  };
}
