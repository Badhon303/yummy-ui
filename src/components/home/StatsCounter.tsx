"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const stats = [
  { value: 50000, suffix: "+", label: "Happy customers" },
  { value: 120, suffix: "+", label: "Bakery items" },
  { value: 5, suffix: "", label: "City outlets" },
  { value: 15, suffix: "+", label: "Years of baking" },
];

export default function StatsCounter() {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const nums = gsap.utils.toArray<HTMLElement>(".stat-num");
      nums.forEach((el) => {
        const target = Number(el.dataset.value || "0");
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          onUpdate: () => {
            el.textContent = Math.floor(obj.val).toLocaleString("en-US");
          },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="bg-choco py-16 text-cream-50">
      <div className="container-px mx-auto grid max-w-7xl grid-cols-2 gap-8 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <p className="font-display text-4xl text-caramel-light md:text-5xl">
              <span className="stat-num" data-value={s.value}>
                0
              </span>
              {s.suffix}
            </p>
            <p className="mt-2 text-sm text-cream-50/70">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
