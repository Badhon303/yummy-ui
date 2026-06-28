"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock, MapPin } from "lucide-react";
import { useOutlet } from "@/context/OutletContext";
import SectionHeading from "@/components/ui/SectionHeading";

export default function OutletsTeaser() {
  const { outlets, setOutlet, selectedOutlet } = useOutlet();

  return (
    <section className="section container-px mx-auto max-w-7xl">
      <SectionHeading
        eyebrow="Find us"
        title="Order from your nearest outlet"
        description="We bake fresh at every location. Pick an outlet for pickup or doorstep delivery."
      />

      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {outlets.map((o, i) => {
          const active = o.id === selectedOutlet?.id;
          return (
            <motion.div
              key={o.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className={`flex flex-col rounded-3xl border bg-white p-6 shadow-card transition-colors ${
                active ? "border-caramel" : "border-transparent"
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl text-choco">{o.name}</h3>
                {active && (
                  <span className="rounded-full bg-caramel/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-caramel-dark">
                    Selected
                  </span>
                )}
              </div>
              <p className="mt-3 flex items-start gap-2 text-sm text-choco/65">
                <MapPin size={15} className="mt-0.5 shrink-0 text-caramel" />
                {o.address}
              </p>
              <p className="mt-2 flex items-center gap-2 text-sm text-choco/65">
                <Clock size={15} className="text-caramel" /> {o.hours}
              </p>
              <button
                onClick={() => setOutlet(o.id)}
                className="btn-outline btn-sm mt-5 self-start"
              >
                {active ? "Currently selected" : "Order from here"}
                <ArrowRight size={15} />
              </button>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-10 text-center">
        <Link href="/outlets" className="btn-primary">
          See all outlets <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}
