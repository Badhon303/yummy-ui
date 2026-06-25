"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function StorySection() {
  return (
    <section className="section container-px mx-auto max-w-7xl">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] shadow-card"
          >
            <Image
              src="/products/stuffed-bread.jpg"
              alt="Yummy baker at work"
              fill
              className="object-cover"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="absolute -bottom-8 -right-4 hidden h-44 w-44 overflow-hidden rounded-3xl border-8 border-cream-50 shadow-card sm:block lg:-right-10"
          >
            <Image
              src="/products/swiss-roll.jpg"
              alt=""
              fill
              className="object-cover"
            />
          </motion.div>
          <div className="absolute -left-4 top-8 hidden rounded-2xl bg-choco px-5 py-4 text-cream-50 shadow-card lg:block">
            <p className="font-display text-3xl">15+</p>
            <p className="text-xs text-cream-50/70">years of baking</p>
          </div>
        </div>

        <div>
          <span className="eyebrow">
            <span className="h-px w-6 bg-caramel" /> Our story
          </span>
          <h2 className="mt-3 font-display text-3xl leading-tight text-choco md:text-4xl lg:text-5xl">
            Baked with heart, since day one
          </h2>
          <p className="mt-5 text-base leading-relaxed text-choco/70">
            Yummy began as a small neighbourhood oven with one simple promise —
            happiness in every bite. Today, we bake fresh across the city every
            single morning, using the same family recipes and honest
            ingredients that started it all.
          </p>
          <ul className="mt-7 space-y-4">
            {[
              "Baked fresh every morning, never frozen",
              "Real butter, real cream, no shortcuts",
              "Loved across all our city outlets",
            ].map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-caramel text-xs text-white">
                  ✓
                </span>
                <span className="text-choco/80">{point}</span>
              </li>
            ))}
          </ul>
          <Link href="/about" className="btn-primary mt-8">
            More about us <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
