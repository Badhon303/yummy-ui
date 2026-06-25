"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useOutlet } from "@/context/OutletContext";
import { DELIVERY_FEE } from "@/data/outlets";
import { formatTaka } from "@/lib/format";
import PageHeader from "@/components/PageHeader";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal, totalItems } = useCart();
  const { selectedOutlet } = useOutlet();

  return (
    <>
      <PageHeader title="Your basket" crumbs={[{ label: "Basket" }]} />
      <section className="section container-px mx-auto max-w-7xl">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-5 py-16 text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-cream-100">
              <ShoppingBag size={40} className="text-caramel" />
            </div>
            <h2 className="font-display text-2xl text-choco">
              Your basket is empty
            </h2>
            <p className="max-w-sm text-choco/60">
              Looks like you haven&apos;t added anything yet. Let&apos;s fix that.
            </p>
            <Link href="/shop" className="btn-accent">
              Browse the bakery <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
            <div>
              <ul className="space-y-4">
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.li
                      key={item.key}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 40 }}
                      className="flex gap-4 rounded-3xl bg-white p-4 shadow-card"
                    >
                      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="96px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <Link
                              href={`/product/${item.slug}`}
                              className="font-display text-lg text-choco hover:text-caramel-dark"
                            >
                              {item.name}
                            </Link>
                            {item.variantLabel && (
                              <p className="text-xs text-choco/50">
                                {item.variantLabel}
                              </p>
                            )}
                            <p className="mt-1 text-sm text-choco/60">
                              {formatTaka(item.unitPrice)} each
                            </p>
                          </div>
                          <button
                            onClick={() => removeItem(item.key)}
                            aria-label="Remove"
                            className="text-choco/40 hover:text-berry"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                        <div className="mt-auto flex items-center justify-between pt-3">
                          <div className="flex items-center gap-3 rounded-full border border-choco/15 px-3 py-1.5">
                            <button
                              onClick={() =>
                                updateQuantity(item.key, item.quantity - 1)
                              }
                              aria-label="Decrease"
                              className="text-choco/70 hover:text-choco"
                            >
                              <Minus size={15} />
                            </button>
                            <span className="w-5 text-center text-sm">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.key, item.quantity + 1)
                              }
                              aria-label="Increase"
                              className="text-choco/70 hover:text-choco"
                            >
                              <Plus size={15} />
                            </button>
                          </div>
                          <span className="font-display text-lg text-choco">
                            {formatTaka(item.unitPrice * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
              <Link
                href="/shop"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-caramel-dark hover:gap-2.5"
              >
                Continue shopping
              </Link>
            </div>

            <aside className="h-fit rounded-3xl bg-cream-100 p-6 lg:sticky lg:top-28">
              <h2 className="font-display text-xl text-choco">Order summary</h2>
              {selectedOutlet && (
                <p className="mt-1 text-xs text-choco/60">
                  From {selectedOutlet.name}
                </p>
              )}
              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between text-choco/70">
                  <dt>Items ({totalItems})</dt>
                  <dd>{formatTaka(subtotal)}</dd>
                </div>
                <div className="flex justify-between text-choco/70">
                  <dt>Delivery (est.)</dt>
                  <dd>{formatTaka(DELIVERY_FEE)}</dd>
                </div>
                <div className="flex justify-between border-t border-choco/15 pt-3 font-display text-xl text-choco">
                  <dt>Total</dt>
                  <dd>{formatTaka(subtotal + DELIVERY_FEE)}</dd>
                </div>
              </dl>
              <Link href="/checkout" className="btn-accent mt-6 w-full justify-center">
                Proceed to checkout <ArrowRight size={18} />
              </Link>
              <p className="mt-3 text-center text-xs text-choco/50">
                No account needed — checkout as a guest.
              </p>
            </aside>
          </div>
        )}
      </section>
    </>
  );
}
