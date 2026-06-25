"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Minus,
  Plus,
  ShieldAlert,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import { useOutlet } from "@/context/OutletContext";
import { getProductPrice, isAvailableAt } from "@/lib/api";
import { formatTaka } from "@/lib/format";
import StarRating from "@/components/ui/StarRating";

export default function ProductDetail({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { selectedOutlet } = useOutlet();
  const outletId = selectedOutlet?.id;

  const [activeImage, setActiveImage] = useState(product.image);
  const [variant, setVariant] = useState(product.variants?.[0]);
  const [qty, setQty] = useState(1);

  const basePrice = getProductPrice(product, outletId);
  const unitPrice = basePrice + (variant?.priceDelta ?? 0);
  const available = isAvailableAt(product, outletId);

  const handleAdd = () => {
    addItem({
      productId: product.id,
      name: product.name,
      image: product.image,
      slug: product.slug,
      unitPrice,
      quantity: qty,
      variantLabel: variant?.label,
    });
  };

  return (
    <section className="container-px mx-auto max-w-7xl py-12 lg:py-16">
      <nav className="mb-8 flex items-center gap-1.5 text-xs text-choco/50">
        <Link href="/" className="hover:text-caramel-dark">Home</Link>
        <ChevronRight size={12} />
        <Link href="/shop" className="hover:text-caramel-dark">Shop</Link>
        <ChevronRight size={12} />
        <span className="text-choco">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <motion.div
            key={activeImage}
            initial={{ opacity: 0.4, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="relative aspect-square overflow-hidden rounded-3xl shadow-card"
          >
            <Image
              src={activeImage}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </motion.div>
          {product.gallery.length > 1 && (
            <div className="mt-4 flex gap-3">
              {product.gallery.map((src) => (
                <button
                  key={src}
                  onClick={() => setActiveImage(src)}
                  className={`relative h-20 w-20 overflow-hidden rounded-2xl border-2 transition-colors ${
                    activeImage === src ? "border-caramel" : "border-transparent"
                  }`}
                >
                  <Image src={src} alt="" fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <span className="text-xs uppercase tracking-wider text-caramel-dark">
            {product.category.replace("-", " & ")}
          </span>
          <h1 className="mt-2 font-display text-3xl text-choco md:text-4xl">
            {product.name}
          </h1>
          <div className="mt-3 flex items-center gap-2 text-sm text-choco/60">
            <StarRating rating={product.rating} />
            <span>{product.rating.toFixed(1)}</span>
            <span className="text-choco/40">· {product.reviewCount} reviews</span>
          </div>

          <p className="mt-5 leading-relaxed text-choco/75">
            {product.description}
          </p>

          <div className="mt-6 font-display text-4xl text-choco">
            {formatTaka(unitPrice)}
          </div>
          {selectedOutlet && (
            <p className="mt-1 text-xs text-choco/50">
              Price at {selectedOutlet.name}
            </p>
          )}

          {product.variants && (
            <div className="mt-6">
              <p className="text-sm font-medium text-choco">Choose an option</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setVariant(v)}
                    className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                      variant?.id === v.id
                        ? "border-caramel bg-cream-100 text-choco"
                        : "border-choco/15 text-choco/70 hover:border-caramel"
                    }`}
                  >
                    {v.label}
                    {v.priceDelta > 0 && ` (+${formatTaka(v.priceDelta)})`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!available ? (
            <div className="mt-7 flex items-center gap-2 rounded-2xl bg-berry/10 px-4 py-3 text-sm text-berry">
              <ShieldAlert size={18} />
              Sorry, this item is unavailable at {selectedOutlet?.name}. Try
              another outlet.
            </div>
          ) : (
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3 rounded-full border border-choco/15 px-3 py-2.5">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="text-choco/70 hover:text-choco"
                >
                  <Minus size={16} />
                </button>
                <span className="w-6 text-center font-medium">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  aria-label="Increase quantity"
                  className="text-choco/70 hover:text-choco"
                >
                  <Plus size={16} />
                </button>
              </div>
              <button onClick={handleAdd} className="btn-accent flex-1 sm:flex-none">
                <ShoppingBag size={18} /> Add to basket — {formatTaka(unitPrice * qty)}
              </button>
            </div>
          )}

          <div className="mt-6 flex items-center gap-2 text-sm text-choco/60">
            <Truck size={16} className="text-caramel" />
            Delivery & pickup available from your selected outlet.
          </div>

          <div className="mt-8 grid gap-4 border-t border-choco/10 pt-6 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-choco/50">
                Allergens
              </p>
              <p className="mt-1 text-sm capitalize text-choco/75">
                {product.allergens.join(", ")}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-choco/50">
                Tags
              </p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {product.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-cream-100 px-2.5 py-1 text-xs text-choco/70"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
