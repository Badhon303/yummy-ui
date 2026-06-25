"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Clock, MapPin, Package, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import type { Order } from "@/lib/types";
import { formatTaka } from "@/lib/format";

export default function OrderConfirmationPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("yummy.lastOrder");
      if (raw) setOrder(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, []);

  if (loaded && !order) {
    return (
      <section className="flex min-h-[70vh] flex-col items-center justify-center gap-5 px-4 text-center">
        <h1 className="font-display text-3xl text-choco">No recent order</h1>
        <p className="text-choco/60">We couldn&apos;t find an order to show.</p>
        <Link href="/shop" className="btn-accent">
          Start an order
        </Link>
      </section>
    );
  }

  if (!order) return null;

  return (
    <section className="container-px mx-auto max-w-3xl px-4 pb-20 pt-32">
      <motion.div
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 14 }}
        className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-pistachio text-white"
      >
        <Check size={40} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6 text-center"
      >
        <h1 className="font-display text-3xl text-choco md:text-4xl">
          Thank you, {order.guest.fullName.split(" ")[0]}!
        </h1>
        <p className="mt-3 text-choco/65">
          Your order has been placed. We&apos;re getting it ready with love.
        </p>
        <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-cream-100 px-5 py-2.5">
          <Package size={16} className="text-caramel-dark" />
          <span className="text-sm text-choco/60">Order number</span>
          <span className="font-display text-lg text-choco">
            {order.orderNumber}
          </span>
        </div>
      </motion.div>

      <div className="mt-10 rounded-3xl bg-white p-6 shadow-card">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-start gap-3">
            {order.fulfilment === "delivery" ? (
              <Truck size={20} className="mt-0.5 text-caramel-dark" />
            ) : (
              <MapPin size={20} className="mt-0.5 text-caramel-dark" />
            )}
            <div>
              <p className="text-xs uppercase tracking-wider text-choco/50">
                {order.fulfilment === "delivery" ? "Delivery to" : "Pickup from"}
              </p>
              <p className="text-sm text-choco">
                {order.fulfilment === "delivery"
                  ? order.guest.address
                  : order.outletName}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock size={20} className="mt-0.5 text-caramel-dark" />
            <div>
              <p className="text-xs uppercase tracking-wider text-choco/50">
                Estimated time
              </p>
              <p className="text-sm text-choco">
                {order.fulfilment === "delivery" ? "45–60 minutes" : "20–30 minutes"}
              </p>
            </div>
          </div>
        </div>

        <ul className="mt-6 space-y-3 border-t border-choco/10 pt-5">
          {order.items.map((item) => (
            <li key={item.key} className="flex justify-between text-sm">
              <span className="text-choco/75">
                {item.quantity} × {item.name}
                {item.variantLabel && (
                  <span className="text-choco/40"> ({item.variantLabel})</span>
                )}
              </span>
              <span className="text-choco">
                {formatTaka(item.unitPrice * item.quantity)}
              </span>
            </li>
          ))}
        </ul>

        <dl className="mt-5 space-y-2 border-t border-choco/10 pt-5 text-sm">
          <div className="flex justify-between text-choco/70">
            <dt>Subtotal</dt>
            <dd>{formatTaka(order.subtotal)}</dd>
          </div>
          <div className="flex justify-between text-choco/70">
            <dt>Delivery</dt>
            <dd>
              {order.deliveryFee === 0 ? "Free" : formatTaka(order.deliveryFee)}
            </dd>
          </div>
          <div className="flex justify-between border-t border-choco/10 pt-2 font-display text-xl text-choco">
            <dt>Total</dt>
            <dd>{formatTaka(order.total)}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link href="/shop" className="btn-accent">
          Order again
        </Link>
        <Link href="/" className="btn-outline">
          Back to home
        </Link>
      </div>
    </section>
  );
}
