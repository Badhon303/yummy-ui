"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useOutlet } from "@/context/OutletContext";
import { formatTaka } from "@/lib/format";

export default function CartDrawer() {
  const {
    isOpen,
    closeCart,
    items,
    updateQuantity,
    removeItem,
    subtotal,
    totalItems,
  } = useCart();
  const { selectedOutlet } = useOutlet();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-[60] bg-choco/50 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-cream-50 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-choco/10 px-6 py-5">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-caramel-dark" />
                <h2 className="font-display text-xl text-choco">Your Basket</h2>
                <span className="text-sm text-choco/50">({totalItems})</span>
              </div>
              <button
                onClick={closeCart}
                aria-label="Close cart"
                className="rounded-full p-2 text-choco/60 transition-colors hover:bg-choco/10"
              >
                <X size={20} />
              </button>
            </div>

            {selectedOutlet && (
              <p className="bg-cream-100 px-6 py-2.5 text-xs text-choco/70">
                Ordering from{" "}
                <span className="font-semibold text-choco">
                  {selectedOutlet.name}
                </span>
              </p>
            )}

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-cream-100">
                  <ShoppingBag size={32} className="text-caramel" />
                </div>
                <p className="text-choco/60">Your basket is empty.</p>
                <Link href="/shop" onClick={closeCart} className="btn-accent">
                  Browse the bakery
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  <ul className="space-y-4">
                    <AnimatePresence initial={false}>
                      {items.map((item) => (
                        <motion.li
                          key={item.key}
                          layout
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, x: 40 }}
                          className="flex gap-4"
                        >
                          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="80px"
                              className="object-cover"
                            />
                          </div>
                          <div className="flex flex-1 flex-col">
                            <div className="flex justify-between gap-2">
                              <div>
                                <h3 className="text-sm font-semibold text-choco">
                                  {item.name}
                                </h3>
                                {item.variantLabel && (
                                  <p className="text-xs text-choco/50">
                                    {item.variantLabel}
                                  </p>
                                )}
                              </div>
                              <button
                                onClick={() => removeItem(item.key)}
                                aria-label="Remove item"
                                className="text-choco/40 transition-colors hover:text-berry"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                            <div className="mt-auto flex items-center justify-between pt-2">
                              <div className="flex items-center gap-2 rounded-full border border-choco/15 px-2 py-1">
                                <button
                                  onClick={() =>
                                    updateQuantity(item.key, item.quantity - 1)
                                  }
                                  aria-label="Decrease quantity"
                                  className="text-choco/70 hover:text-choco"
                                >
                                  <Minus size={14} />
                                </button>
                                <span className="w-5 text-center text-sm">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    updateQuantity(item.key, item.quantity + 1)
                                  }
                                  aria-label="Increase quantity"
                                  className="text-choco/70 hover:text-choco"
                                >
                                  <Plus size={14} />
                                </button>
                              </div>
                              <span className="font-semibold text-choco">
                                {formatTaka(item.unitPrice * item.quantity)}
                              </span>
                            </div>
                          </div>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                </div>

                <div className="border-t border-choco/10 bg-white px-6 py-5">
                  <div className="flex items-center justify-between text-choco">
                    <span className="text-choco/60">Subtotal</span>
                    <span className="font-display text-xl">
                      {formatTaka(subtotal)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-choco/50">
                    Delivery & taxes calculated at checkout.
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <Link
                      href="/cart"
                      onClick={closeCart}
                      className="btn-outline btn-sm justify-center"
                    >
                      View basket
                    </Link>
                    <Link
                      href="/checkout"
                      onClick={closeCart}
                      className="btn-accent btn-sm justify-center"
                    >
                      Checkout
                    </Link>
                  </div>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
