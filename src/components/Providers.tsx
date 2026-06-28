"use client";

import type { ReactNode } from "react";
import { OutletProvider } from "@/context/OutletContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/layout/CartDrawer";
import OutletPicker from "@/components/layout/OutletPicker";
import AuthModal from "@/components/layout/AuthModal";
import Toast from "@/components/layout/Toast";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <OutletProvider>
      <CartProvider>
        <WishlistProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <CartDrawer />
          <OutletPicker />
          <AuthModal />
          <Toast />
        </WishlistProvider>
      </CartProvider>
    </OutletProvider>
  );
}
