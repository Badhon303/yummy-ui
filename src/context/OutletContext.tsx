"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getOutlets } from "@/lib/api";
import { findNearestOutlet, getCurrentPosition } from "@/lib/geo";
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

    const resolveOutlet = (data: Outlet[]) => {
      if (!mounted) return;
      setOutlets(data);
      const stored =
        typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      if (stored && data.some((o) => o.id === stored)) {
        setSelectedId(stored);
        setHydrated(true);
        return;
      }
      if (data.length === 0) {
        setHydrated(true);
        return;
      }
      // First visit: try to auto-select the nearest outlet by geolocation.
      getCurrentPosition()
        .then((position) => {
          if (!mounted) return;
          const nearest = findNearestOutlet(
            position.coords.latitude,
            position.coords.longitude,
            data
          );
          if (nearest) {
            setSelectedId(nearest.id);
            localStorage.setItem(STORAGE_KEY, nearest.id);
          } else {
            setPickerOpen(true);
          }
          setHydrated(true);
        })
        .catch(() => {
          if (!mounted) return;
          // Geolocation denied/unavailable: let the user pick manually.
          setPickerOpen(true);
          setHydrated(true);
        });
    };

    getOutlets()
      .then(resolveOutlet)
      .catch(() => {
        resolveOutlet(mockOutlets);
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
