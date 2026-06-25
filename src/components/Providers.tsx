"use client";

import type { ReactNode } from "react";
import { OutletProvider } from "@/context/OutletContext";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/layout/CartDrawer";
import OutletPicker from "@/components/layout/OutletPicker";
import Toast from "@/components/layout/Toast";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <OutletProvider>
      <CartProvider>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <CartDrawer />
        <OutletPicker />
        <Toast />
      </CartProvider>
    </OutletProvider>
  );
}
