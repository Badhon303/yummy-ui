"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { formatTaka } from "@/lib/format";
import PageHeader from "@/components/PageHeader";

export default function WishlistPage() {
  const { items, remove, clear } = useWishlist();
  const { addItem } = useCart();

  return (
    <>
      <PageHeader
        title="Your wishlist"
        description="The treats you've saved for later — add them to your basket whenever you're ready."
        crumbs={[{ label: "Wishlist" }]}
      />
      <section className="section container-px mx-auto max-w-7xl">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-5 py-16 text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-cream-100">
              <Heart size={40} className="text-berry" />
            </div>
            <h2 className="font-display text-2xl text-choco">
              Your wishlist is empty
            </h2>
            <p className="max-w-sm text-choco/60">
              Tap the heart on any product to save it here for later.
            </p>
            <Link href="/shop" className="btn-accent">
              Browse the bakery <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-choco/60">
                {items.length} {items.length === 1 ? "item" : "items"} saved
              </p>
              <button
                onClick={clear}
                className="text-sm font-medium text-choco/50 transition-colors hover:text-berry"
              >
                Clear all
              </button>
            </div>
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.li
                    key={item.productId}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-card"
                  >
                    <Link
                      href={`/product/${item.slug}`}
                      className="relative block aspect-[4/3] overflow-hidden"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </Link>
                    <div className="flex flex-1 flex-col p-4">
                      <span className="text-[11px] uppercase tracking-wider text-caramel-dark">
                        {item.category.replace("-", " & ")}
                      </span>
                      <Link href={`/product/${item.slug}`}>
                        <h3 className="mt-1 font-display text-lg leading-snug text-choco transition-colors group-hover:text-caramel-dark">
                          {item.name}
                        </h3>
                      </Link>
                      <div className="mt-auto flex items-center justify-between pt-4">
                        <span className="font-display text-xl text-choco">
                          {formatTaka(item.price)}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => remove(item.productId)}
                            aria-label="Remove from wishlist"
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-choco/15 text-choco/50 transition-colors hover:border-berry hover:text-berry"
                          >
                            <Trash2 size={17} />
                          </button>
                          <button
                            onClick={() =>
                              addItem({
                                productId: item.productId,
                                name: item.name,
                                image: item.image,
                                slug: item.slug,
                                unitPrice: item.price,
                              })
                            }
                            aria-label={`Add ${item.name} to cart`}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-choco text-cream-50 transition-all hover:scale-105 hover:bg-caramel-dark"
                          >
                            <ShoppingBag size={17} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </>
        )}
      </section>
    </>
  );
}
