"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface WishlistItem {
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  category: string;
  addedAt: string;
}

export type WishlistInput = Omit<WishlistItem, "addedAt">;

interface WishlistContextValue {
  items: WishlistItem[];
  count: number;
  has: (productId: string) => boolean;
  add: (input: WishlistInput) => void;
  remove: (productId: string) => void;
  toggle: (input: WishlistInput) => void;
  clear: () => void;
  lastToast: { id: number; message: string } | null;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);
const STORAGE_KEY = "yummy.wishlist";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
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

  const has = useCallback(
    (productId: string) => items.some((i) => i.productId === productId),
    [items]
  );

  const add = useCallback((input: WishlistInput) => {
    setItems((prev) => {
      if (prev.some((i) => i.productId === input.productId)) return prev;
      return [{ ...input, addedAt: new Date().toISOString() }, ...prev];
    });
    setLastToast({ id: Date.now(), message: `${input.name} added to wishlist` });
  }, []);

  const remove = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const toggle = useCallback((input: WishlistInput) => {
    setItems((prev) => {
      if (prev.some((i) => i.productId === input.productId)) {
        return prev.filter((i) => i.productId !== input.productId);
      }
      setLastToast({
        id: Date.now(),
        message: `${input.name} added to wishlist`,
      });
      return [{ ...input, addedAt: new Date().toISOString() }, ...prev];
    });
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<WishlistContextValue>(
    () => ({
      items,
      count: items.length,
      has,
      add,
      remove,
      toggle,
      clear,
      lastToast,
    }),
    [items, has, add, remove, toggle, clear, lastToast]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
