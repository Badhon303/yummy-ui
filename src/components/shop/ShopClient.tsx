"use client";

import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import ProductCard from "@/components/ProductCard";
import type { CategorySlug } from "@/lib/types";

type SortKey = "popular" | "price-asc" | "price-desc" | "name";

const sortOptions: { key: SortKey; label: string }[] = [
  { key: "popular", label: "Most popular" },
  { key: "price-asc", label: "Price: Low to High" },
  { key: "price-desc", label: "Price: High to Low" },
  { key: "name", label: "Name: A to Z" },
];

export default function ShopClient() {
  const params = useSearchParams();
  const initialCategory = (params.get("category") as CategorySlug) || "all";

  const [category, setCategory] = useState<CategorySlug | "all">(
    initialCategory
  );
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("popular");

  const filtered = useMemo(() => {
    let list = [...products];
    if (category !== "all") list = list.filter((p) => p.category === category);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "name":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        list.sort((a, b) => b.reviewCount - a.reviewCount);
    }
    return list;
  }, [category, query, sort]);

  const filters: { key: CategorySlug | "all"; label: string }[] = [
    { key: "all", label: "All" },
    ...categories.map((c) => ({ key: c.slug, label: c.name })),
  ];

  return (
    <section className="section container-px mx-auto max-w-7xl">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setCategory(f.key)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                category === f.key
                  ? "bg-choco text-cream-50"
                  : "bg-cream-100 text-choco/70 hover:bg-cream-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex items-center gap-2 rounded-full border border-choco/15 bg-white px-4 py-2.5">
            <Search size={16} className="text-choco/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search bakes..."
              className="w-full bg-transparent text-sm placeholder:text-choco/40 focus:outline-none sm:w-44"
            />
          </div>
          <div className="flex items-center gap-2 rounded-full border border-choco/15 bg-white px-4 py-2.5">
            <SlidersHorizontal size={16} className="text-choco/40" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="bg-transparent text-sm focus:outline-none"
            >
              {sortOptions.map((o) => (
                <option key={o.key} value={o.key}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <p className="mt-6 text-sm text-choco/50">
        Showing {filtered.length} item{filtered.length !== 1 && "s"}
      </p>

      {filtered.length === 0 ? (
        <div className="mt-16 text-center text-choco/60">
          No bakes match your search. Try a different filter.
        </div>
      ) : (
        <motion.div
          layout
          className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6"
        >
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </motion.div>
      )}
    </section>
  );
}
