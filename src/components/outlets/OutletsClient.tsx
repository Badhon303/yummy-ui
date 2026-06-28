"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock, MapPin, Phone, Truck, Store } from "lucide-react";
import { useOutlet } from "@/context/OutletContext";

export default function OutletsClient() {
  const { outlets, selectedOutlet, setOutlet } = useOutlet();

  return (
    <section className="section container-px mx-auto max-w-7xl">
      <div className="grid gap-8 lg:grid-cols-2">
        {outlets.map((o, i) => {
          const active = o.id === selectedOutlet?.id;
          return (
            <motion.div
              key={o.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: (i % 2) * 0.1 }}
              className={`overflow-hidden rounded-3xl border bg-white shadow-card ${
                active ? "border-caramel" : "border-transparent"
              }`}
            >
              <div className="grid sm:grid-cols-2">
                <div className="relative aspect-[4/3] sm:aspect-auto">
                  <Image
                    src={o.image}
                    alt={o.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-2xl text-choco">{o.name}</h2>
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
                  <p className="mt-2 flex items-center gap-2 text-sm text-choco/65">
                    <Phone size={15} className="text-caramel" /> {o.phone}
                  </p>
                  <div className="mt-3 flex gap-3 text-xs text-choco/60">
                    {o.supportsDelivery && (
                      <span className="flex items-center gap-1">
                        <Truck size={13} /> Delivery
                      </span>
                    )}
                    {o.supportsPickup && (
                      <span className="flex items-center gap-1">
                        <Store size={13} /> Pickup
                      </span>
                    )}
                  </div>
                  <div className="mt-auto flex flex-wrap gap-3 pt-5">
                    <button
                      onClick={() => setOutlet(o.id)}
                      className="btn-accent btn-sm"
                    >
                      {active ? "Selected" : "Order from here"}
                      <ArrowRight size={15} />
                    </button>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${o.lat},${o.lng}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-outline btn-sm"
                    >
                      View on map
                    </a>
                  </div>
                </div>
              </div>
              <div className="relative h-44 w-full bg-cream-100">
                <iframe
                  title={`Map of ${o.name}`}
                  className="h-full w-full border-0"
                  loading="lazy"
                  src={`https://www.google.com/maps?q=${o.lat},${o.lng}&z=14&output=embed`}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-12 text-center">
        <Link href="/shop" className="btn-primary">
          Start your order <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}
