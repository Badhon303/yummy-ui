"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { categories } from "@/data/categories";
import SectionHeading from "@/components/ui/SectionHeading";

export default function CategoryGrid() {
  return (
    <section className="section container-px mx-auto max-w-7xl">
      <SectionHeading
        eyebrow="Explore the bakery"
        title="Something for every craving"
        description="Browse our handcrafted selection — from everyday breads to celebration sweets."
      />

      <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:gap-6">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.slug}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
          >
            <Link
              href={`/shop?category=${cat.slug}`}
              className="group relative block aspect-[4/5] overflow-hidden rounded-3xl"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-choco/90 via-choco/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <h3 className="font-display text-xl text-cream-50 md:text-2xl">
                  {cat.name}
                </h3>
                <p className="mt-1 text-sm text-cream-50/70">{cat.tagline}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-caramel-light opacity-0 transition-opacity group-hover:opacity-100">
                  Shop now <ArrowUpRight size={15} />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
