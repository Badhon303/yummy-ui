"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export default function Toast() {
  const { lastToast: cartToast } = useCart();
  const { lastToast: wishlistToast } = useWishlist();
  const [visible, setVisible] = useState(false);

  const lastToast = useMemo(() => {
    if (!cartToast) return wishlistToast;
    if (!wishlistToast) return cartToast;
    return cartToast.id >= wishlistToast.id ? cartToast : wishlistToast;
  }, [cartToast, wishlistToast]);

  useEffect(() => {
    if (!lastToast) return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 2600);
    return () => clearTimeout(t);
  }, [lastToast]);

  return (
    <AnimatePresence>
      {visible && lastToast && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.95 }}
          className="fixed bottom-6 left-1/2 z-[100] -translate-x-1/2"
        >
          <div className="flex items-center gap-3 rounded-full bg-choco px-5 py-3 text-cream-50 shadow-2xl">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-pistachio">
              <Check size={15} />
            </span>
            <span className="text-sm font-medium">{lastToast.message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
