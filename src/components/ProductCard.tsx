"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, Star } from "lucide-react";
import type { Product } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import { useOutlet } from "@/context/OutletContext";
import { getProductPrice, isAvailableAt } from "@/lib/api";
import { formatTaka } from "@/lib/format";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { selectedOutlet } = useOutlet();
  const outletId = selectedOutlet?.id;
  const price = getProductPrice(product, outletId);
  const available = isAvailableAt(product, outletId);

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="group relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-card"
    >
      <Link
        href={`/product/${product.slug}`}
        className="relative block aspect-[4/3] overflow-hidden"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.isBestseller && (
            <span className="rounded-full bg-berry px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
              Bestseller
            </span>
          )}
          {product.isNew && (
            <span className="rounded-full bg-pistachio px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
              New
            </span>
          )}
        </div>
        {!available && (
          <div className="absolute inset-0 flex items-center justify-center bg-choco/55 backdrop-blur-[1px]">
            <span className="rounded-full bg-white/90 px-4 py-1.5 text-xs font-semibold text-choco">
              Unavailable at this outlet
            </span>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <span className="text-[11px] uppercase tracking-wider text-caramel-dark">
          {product.category.replace("-", " & ")}
        </span>
        <Link href={`/product/${product.slug}`}>
          <h3 className="mt-1 font-display text-lg leading-snug text-choco transition-colors group-hover:text-caramel-dark">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 line-clamp-2 text-sm text-choco/60">
          {product.shortDescription}
        </p>

        <div className="mt-3 flex items-center gap-1 text-xs text-choco/60">
          <Star size={13} className="fill-caramel text-caramel" />
          {product.rating.toFixed(1)}
          <span className="text-choco/40">({product.reviewCount})</span>
        </div>

        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="font-display text-xl text-choco">
            {formatTaka(price)}
          </span>
          <button
            type="button"
            disabled={!available}
            onClick={() =>
              addItem({
                productId: product.id,
                name: product.name,
                image: product.image,
                slug: product.slug,
                unitPrice: price,
              })
            }
            aria-label={`Add ${product.name} to cart`}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-choco text-cream-50 transition-all hover:scale-105 hover:bg-caramel-dark disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
