"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Instagram } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

const shots = [
  "/products/sugar-donuts.jpg",
  "/products/cinnamon-roll.jpg",
  "/products/slider-buns.jpg",
  "/products/coconut-bun.jpg",
  "/products/spring-rolls.jpg",
  "/products/laddu.jpg",
];

export default function GallerySection() {
  return (
    <section className="section container-px mx-auto max-w-7xl">
      <SectionHeading
        eyebrow="@yummy.bakery"
        title="Fresh from our kitchen"
        description="Follow along for daily bakes, seasonal specials and behind-the-scenes moments."
      />

      <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {shots.map((src, i) => (
          <motion.a
            key={src}
            href="#"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: (i % 6) * 0.06 }}
            className="group relative aspect-square overflow-hidden rounded-2xl"
          >
            <Image
              src={src}
              alt="Yummy bakery"
              fill
              sizes="(max-width: 768px) 50vw, 16vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-choco/0 transition-colors group-hover:bg-choco/50">
              <Instagram
                size={24}
                className="text-cream-50 opacity-0 transition-opacity group-hover:opacity-100"
              />
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
