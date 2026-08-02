"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { getProductsForOutlet, isAvailableAt } from "@/lib/api";
import { useOutlet } from "@/context/OutletContext";
import ProductCard from "@/components/ProductCard";
import SectionHeading from "@/components/ui/SectionHeading";
import type { Product } from "@/lib/types";

export default function FeaturedProducts() {
  const { selectedOutlet } = useOutlet();
  const [bestsellers, setBestsellers] = useState<Product[]>([]);

  useEffect(() => {
    let mounted = true;

    if (!selectedOutlet) {
      setBestsellers([]);
      return () => {
        mounted = false;
      };
    }

    getProductsForOutlet(selectedOutlet.id).then((products) => {
      if (!mounted) return;
      setBestsellers(
        products.filter(
          (product) =>
            product.isBestseller && isAvailableAt(product, selectedOutlet.id)
        )
      );
    });

    return () => {
      mounted = false;
    };
  }, [selectedOutlet]);

  return (
    <section className="section bg-cream-100">
      <div className="container-px mx-auto max-w-7xl">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            align="left"
            eyebrow="Most loved"
            title="Our bestsellers"
            description="The bakes our customers keep coming back for."
          />
          <Link
            href="/shop"
            className="hidden items-center gap-1.5 text-sm font-semibold text-caramel-dark transition-all hover:gap-2.5 md:inline-flex"
          >
            View all products <ArrowRight size={16} />
          </Link>
        </div>

        {bestsellers.length > 0 && (
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {bestsellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="mt-10 text-center md:hidden">
          <Link href="/shop" className="btn-outline">
            View all products <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
