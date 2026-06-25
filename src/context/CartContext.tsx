"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CartItem } from "@/lib/types";

interface AddItemInput {
  productId: string;
  name: string;
  image: string;
  slug: string;
  unitPrice: number;
  quantity?: number;
  variantLabel?: string;
}

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (input: AddItemInput) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  lastToast: { id: number; message: string } | null;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "yummy.cart";

function makeKey(productId: string, variantLabel?: string) {
  return variantLabel ? `${productId}::${variantLabel}` : productId;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [lastToast, setLastToast] = useState<{
    id: number;
    message: string;
  } | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = useCallback((input: AddItemInput) => {
    const key = makeKey(input.productId, input.variantLabel);
    const qty = input.quantity ?? 1;
    setItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) =>
          i.key === key ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [
        ...prev,
        {
          key,
          productId: input.productId,
          name: input.name,
          image: input.image,
          slug: input.slug,
          unitPrice: input.unitPrice,
          quantity: qty,
          variantLabel: input.variantLabel,
        },
      ];
    });
    setLastToast({ id: Date.now(), message: `${input.name} added to cart` });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const updateQuantity = useCallback((key: string, quantity: number) => {
    setItems((prev) =>
      prev
        .map((i) => (i.key === key ? { ...i, quantity } : i))
        .filter((i) => i.quantity > 0)
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const { totalItems, subtotal } = useMemo(() => {
    return items.reduce(
      (acc, i) => {
        acc.totalItems += i.quantity;
        acc.subtotal += i.quantity * i.unitPrice;
        return acc;
      },
      { totalItems: 0, subtotal: 0 }
    );
  }, [items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
      subtotal,
      lastToast,
    }),
    [
      items,
      isOpen,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
      subtotal,
      lastToast,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
