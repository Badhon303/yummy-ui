"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, MapPin } from "lucide-react";
import { useLayoutEffect, useRef } from "react";
import { useOutlet } from "@/context/OutletContext";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Hero() {
  const root = useRef<HTMLDivElement>(null);
  const { openPicker, selectedOutlet } = useOutlet();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".hero-bg", {
        yPercent: 18,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.to(".hero-float-1", {
        y: 60,
        rotate: 8,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.to(".hero-float-2", {
        y: -50,
        rotate: -6,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-choco"
    >
      <div className="hero-bg absolute inset-0 scale-110">
        <Image
          src="/products/pizza-bread.jpg"
          alt="Freshly baked goods at Yummy"
          fill
          priority
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-choco via-choco/70 to-choco/40" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="hero-float-1 absolute right-[8%] top-[18%] hidden h-32 w-32 overflow-hidden rounded-full border-4 border-cream-50/20 shadow-2xl md:block"
      >
        <Image src="/products/cream-bun.jpg" alt="" fill className="object-cover" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.15 }}
        className="hero-float-2 absolute bottom-[14%] right-[20%] hidden h-24 w-24 overflow-hidden rounded-full border-4 border-cream-50/20 shadow-2xl lg:block"
      >
        <Image src="/products/chicken-puff.jpg" alt="" fill className="object-cover" />
      </motion.div>

      <div className="container-px relative z-10 mx-auto max-w-7xl pt-24">
        <motion.button
          onClick={openPicker}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-cream-50/20 bg-white/10 px-4 py-2 text-sm text-cream-50 backdrop-blur-sm transition-colors hover:bg-white/20"
        >
          <MapPin size={15} className="text-caramel-light" />
          {selectedOutlet
            ? `Ordering from ${selectedOutlet.name}`
            : "Choose your nearest outlet"}
        </motion.button>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="max-w-3xl font-display text-5xl font-bold leading-[1.05] text-cream-50 sm:text-6xl lg:text-7xl"
        >
          Happiness, freshly{" "}
          <span className="text-caramel-light">baked</span> every morning.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-6 max-w-xl text-lg text-cream-50/80"
        >
          From soft dinner rolls to flaky chicken puffs and cream-filled buns —
          Yummy brings warm, artisan bakes to your doorstep across the city.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-9 flex flex-wrap gap-4 pb-16"
        >
          <Link href="/shop" className="btn-accent">
            Order now <ArrowRight size={18} />
          </Link>
          <Link href="/about" className="btn-outline border-cream-50/40 text-cream-50 hover:bg-cream-50 hover:text-choco">
            Our story
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
