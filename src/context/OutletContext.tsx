"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getOutlets } from "@/lib/api";
import { outlets as mockOutlets } from "@/data/outlets";
import type { Outlet } from "@/lib/types";

interface OutletContextValue {
  outlets: Outlet[];
  selectedOutlet: Outlet | null;
  setOutlet: (id: string) => void;
  isPickerOpen: boolean;
  openPicker: () => void;
  closePicker: () => void;
  hydrated: boolean;
}

const OutletContext = createContext<OutletContextValue | null>(null);
const STORAGE_KEY = "yummy.outlet";

export function OutletProvider({ children }: { children: React.ReactNode }) {
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isPickerOpen, setPickerOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let mounted = true;
    getOutlets()
      .then((data) => {
        if (!mounted) return;
        setOutlets(data);
        const stored =
          typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
        if (stored && data.some((o) => o.id === stored)) {
          setSelectedId(stored);
        } else if (data.length > 0) {
          // First visit: prompt for an outlet
          setPickerOpen(true);
        }
        setHydrated(true);
      })
      .catch(() => {
        setOutlets(mockOutlets);
        const stored =
          typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
        if (stored && mockOutlets.some((o) => o.id === stored)) {
          setSelectedId(stored);
        } else if (mockOutlets.length > 0) {
          setPickerOpen(true);
        }
        setHydrated(true);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const setOutlet = (id: string) => {
    setSelectedId(id);
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, id);
    setPickerOpen(false);
  };

  const value = useMemo<OutletContextValue>(
    () => ({
      outlets,
      selectedOutlet: outlets.find((o) => o.id === selectedId) ?? null,
      setOutlet,
      isPickerOpen,
      openPicker: () => setPickerOpen(true),
      closePicker: () => setPickerOpen(false),
      hydrated,
    }),
    [selectedId, isPickerOpen, hydrated]
  );

  return (
    <OutletContext.Provider value={value}>{children}</OutletContext.Provider>
  );
}

export function useOutlet() {
  const ctx = useContext(OutletContext);
  if (!ctx) throw new Error("useOutlet must be used within OutletProvider");
  return ctx;
}
