"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Store, Truck } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useOutlet } from "@/context/OutletContext";
import { DELIVERY_FEE } from "@/data/outlets";
import { formatTaka } from "@/lib/format";
import { placeOrder } from "@/lib/api";
import type { FulfilmentType, GuestDetails } from "@/lib/types";
import PageHeader from "@/components/PageHeader";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, totalItems, clearCart } = useCart();
  const { selectedOutlet, outlets, setOutlet, openPicker } = useOutlet();

  const [fulfilment, setFulfilment] = useState<FulfilmentType>("delivery");
  const [submitting, setSubmitting] = useState(false);
  const [guest, setGuest] = useState<GuestDetails>({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    area: "",
    notes: "",
  });

  const deliveryFee = fulfilment === "delivery" ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;

  const update = (key: keyof GuestDetails, value: string) =>
    setGuest((g) => ({ ...g, [key]: value }));

  const canSubmit =
    items.length > 0 &&
    selectedOutlet &&
    guest.fullName.trim() &&
    guest.phone.trim() &&
    (fulfilment === "pickup" || guest.address?.trim());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || !selectedOutlet) return;
    setSubmitting(true);
    const order = await placeOrder({
      items,
      outletId: selectedOutlet.id,
      outletName: selectedOutlet.name,
      fulfilment,
      guest,
      subtotal,
      deliveryFee,
      total,
    });
    sessionStorage.setItem("yummy.lastOrder", JSON.stringify(order));
    clearCart();
    router.push("/order-confirmation");
  };

  if (items.length === 0) {
    return (
      <>
        <PageHeader title="Checkout" crumbs={[{ label: "Checkout" }]} />
        <section className="section container-px mx-auto max-w-3xl text-center">
          <p className="text-choco/60">Your basket is empty.</p>
          <Link href="/shop" className="btn-accent mt-6">
            Browse the bakery <ArrowRight size={18} />
          </Link>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Guest checkout"
        description="No account required. Just a few details and your order is on its way."
        crumbs={[{ label: "Basket", href: "/cart" }, { label: "Checkout" }]}
      />

      <form
        onSubmit={handleSubmit}
        className="section container-px mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_380px]"
      >
        <div className="space-y-8">
          {/* Fulfilment */}
          <div className="rounded-3xl bg-white p-6 shadow-card">
            <h2 className="font-display text-xl text-choco">How would you like it?</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {(
                [
                  { key: "delivery", label: "Delivery", icon: Truck, sub: "To your doorstep" },
                  { key: "pickup", label: "Pickup", icon: Store, sub: "From the outlet" },
                ] as const
              ).map((opt) => (
                <button
                  type="button"
                  key={opt.key}
                  onClick={() => setFulfilment(opt.key)}
                  className={`flex flex-col items-start gap-1 rounded-2xl border p-4 text-left transition-colors ${
                    fulfilment === opt.key
                      ? "border-caramel bg-cream-100"
                      : "border-choco/15 hover:border-caramel"
                  }`}
                >
                  <opt.icon size={20} className="text-caramel-dark" />
                  <span className="font-medium text-choco">{opt.label}</span>
                  <span className="text-xs text-choco/55">{opt.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Outlet */}
          <div className="rounded-3xl bg-white p-6 shadow-card">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl text-choco">
                {fulfilment === "pickup" ? "Pickup outlet" : "Serving outlet"}
              </h2>
              <button
                type="button"
                onClick={openPicker}
                className="text-sm font-medium text-caramel-dark hover:underline"
              >
                Change
              </button>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {outlets.map((o) => (
                <button
                  type="button"
                  key={o.id}
                  onClick={() => setOutlet(o.id)}
                  className={`rounded-2xl border p-4 text-left transition-colors ${
                    selectedOutlet?.id === o.id
                      ? "border-caramel bg-cream-100"
                      : "border-choco/15 hover:border-caramel"
                  }`}
                >
                  <p className="font-medium text-choco">{o.name}</p>
                  <p className="mt-1 flex items-start gap-1 text-xs text-choco/55">
                    <MapPin size={12} className="mt-0.5 shrink-0" />
                    {o.address}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="rounded-3xl bg-white p-6 shadow-card">
            <h2 className="font-display text-xl text-choco">Your details</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Full name *" value={guest.fullName} onChange={(v) => update("fullName", v)} placeholder="e.g. Rahim Uddin" />
              <Field label="Phone *" value={guest.phone} onChange={(v) => update("phone", v)} placeholder="01XXXXXXXXX" type="tel" />
              <Field label="Email" value={guest.email} onChange={(v) => update("email", v)} placeholder="you@email.com" type="email" className="sm:col-span-2" />
              {fulfilment === "delivery" && (
                <>
                  <Field label="Delivery address *" value={guest.address || ""} onChange={(v) => update("address", v)} placeholder="House, road, area" className="sm:col-span-2" />
                  <Field label="Area / landmark" value={guest.area || ""} onChange={(v) => update("area", v)} placeholder="e.g. Near Gulshan circle" className="sm:col-span-2" />
                </>
              )}
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-choco">
                  Order notes
                </label>
                <textarea
                  value={guest.notes}
                  onChange={(e) => update("notes", e.target.value)}
                  rows={3}
                  placeholder="Any special instructions?"
                  className="w-full rounded-2xl border border-choco/15 bg-cream-50 px-4 py-3 text-sm focus:border-caramel focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Payment (stub) */}
          <div className="rounded-3xl bg-white p-6 shadow-card">
            <h2 className="font-display text-xl text-choco">Payment</h2>
            <p className="mt-2 text-sm text-choco/60">
              Cash on delivery / pay at pickup. Online payment coming soon.
            </p>
            <div className="mt-4 rounded-2xl border border-dashed border-choco/20 bg-cream-50 px-4 py-3 text-sm text-choco/60">
              Cash on {fulfilment === "pickup" ? "pickup" : "delivery"} selected.
            </div>
          </div>
        </div>

        {/* Summary */}
        <aside className="h-fit rounded-3xl bg-cream-100 p-6 lg:sticky lg:top-28">
          <h2 className="font-display text-xl text-choco">Order summary</h2>
          <ul className="mt-4 space-y-3">
            {items.map((item) => (
              <li key={item.key} className="flex items-center gap-3">
                <div className="relative h-12 w-12 overflow-hidden rounded-xl">
                  <Image src={item.image} alt={item.name} fill sizes="48px" className="object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-choco">{item.name}</p>
                  <p className="text-xs text-choco/55">Qty {item.quantity}</p>
                </div>
                <span className="text-sm text-choco">
                  {formatTaka(item.unitPrice * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <dl className="mt-5 space-y-2.5 border-t border-choco/15 pt-4 text-sm">
            <div className="flex justify-between text-choco/70">
              <dt>Subtotal ({totalItems})</dt>
              <dd>{formatTaka(subtotal)}</dd>
            </div>
            <div className="flex justify-between text-choco/70">
              <dt>Delivery</dt>
              <dd>{fulfilment === "pickup" ? "Free" : formatTaka(deliveryFee)}</dd>
            </div>
            <div className="flex justify-between border-t border-choco/15 pt-3 font-display text-xl text-choco">
              <dt>Total</dt>
              <dd>{formatTaka(total)}</dd>
            </div>
          </dl>

          <motion.button
            type="submit"
            disabled={!canSubmit || submitting}
            whileTap={{ scale: 0.98 }}
            className="btn-accent mt-6 w-full justify-center"
          >
            {submitting ? "Placing order…" : "Place order"}
            {!submitting && <ArrowRight size={18} />}
          </motion.button>
          {!selectedOutlet && (
            <p className="mt-3 text-center text-xs text-berry">
              Please select an outlet to continue.
            </p>
          )}
          <p className="mt-3 text-center text-xs text-choco/50">
            By placing your order you agree to our terms.
          </p>
        </aside>
      </form>
    </>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-sm font-medium text-choco">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-choco/15 bg-cream-50 px-4 py-3 text-sm focus:border-caramel focus:outline-none"
      />
    </div>
  );
}
