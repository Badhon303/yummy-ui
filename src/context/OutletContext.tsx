"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { outlets } from "@/data/outlets";
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
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isPickerOpen, setPickerOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored =
      typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (stored && outlets.some((o) => o.id === stored)) {
      setSelectedId(stored);
    } else {
      // First visit: prompt for an outlet
      setPickerOpen(true);
    }
    setHydrated(true);
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
