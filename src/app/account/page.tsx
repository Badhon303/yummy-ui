"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Heart,
  Mail,
  Phone,
  ShoppingBag,
  Trash2,
  User as UserIcon,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { getMyOrders } from "@/lib/api";
import { formatTaka } from "@/lib/format";
import type { OrderSummary } from "@/lib/types";
import PageHeader from "@/components/PageHeader";

type Tab = "settings" | "wishlists" | "orders" | "password" | "billing";

const tabs: { id: Tab; label: string }[] = [
  { id: "settings", label: "Settings" },
  { id: "wishlists", label: "Wishlists" },
  { id: "orders", label: "Orders history" },
  { id: "password", label: "Change password" },
  { id: "billing", label: "Billing" },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const inputClass =
  "w-full rounded-full border border-choco/15 bg-white px-4 py-3 text-sm text-choco focus:border-caramel focus:outline-none";
const labelClass = "mb-1.5 block text-sm font-semibold text-choco";

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <>
          <PageHeader title="Account" crumbs={[{ label: "Account" }]} />
          <section className="section container-px mx-auto max-w-7xl">
            <p className="text-choco/60">Loading your account…</p>
          </section>
        </>
      }
    >
      <AccountPageContent />
    </Suspense>
  );
}

function AccountPageContent() {
  const { user, isLoading, openAuth } = useAuth();
  const searchParams = useSearchParams();
  const validTabs = tabs.map((t) => t.id);
  const queryTab = searchParams.get("tab") as Tab | null;
  const initialTab =
    queryTab && validTabs.includes(queryTab) ? queryTab : "settings";
  const [tab, setTab] = useState<Tab>(initialTab);

  useEffect(() => {
    const queryTab = searchParams.get("tab") as Tab | null;
    if (queryTab && validTabs.includes(queryTab)) setTab(queryTab);
  }, [searchParams, validTabs]);

  if (isLoading) {
    return (
      <>
        <PageHeader title="Account" crumbs={[{ label: "Account" }]} />
        <section className="section container-px mx-auto max-w-7xl">
          <p className="text-choco/60">Loading your account…</p>
        </section>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <PageHeader title="Account" crumbs={[{ label: "Account" }]} />
        <section className="section container-px mx-auto max-w-2xl text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-cream-100">
            <UserIcon size={34} className="text-caramel" />
          </div>
          <h2 className="mt-5 font-display text-2xl text-choco">
            Sign in to your account
          </h2>
          <p className="mt-2 text-choco/60">
            Manage your profile, wishlist and order history in one place.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button onClick={() => openAuth("login")} className="btn-accent">
              Sign in
            </button>
            <button
              onClick={() => openAuth("register")}
              className="btn-outline border-choco/15"
            >
              Create account
            </button>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Account" crumbs={[{ label: "Account" }]} />
      <section className="section container-px mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="font-display text-lg text-choco">{user.name}</span>
          <span className="text-choco/50">{user.email}</span>
          {user.addresses?.[0]?.addressLine1 && (
            <span className="text-choco/50">· {user.addresses[0].addressLine1}</span>
          )}
        </div>

        <div className="mt-6 flex gap-6 overflow-x-auto border-b border-choco/15">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`relative whitespace-nowrap pb-3 text-sm font-medium transition-colors ${
                tab === t.id
                  ? "text-choco"
                  : "text-choco/50 hover:text-choco/80"
              }`}
            >
              {t.label}
              {tab === t.id && (
                <motion.span
                  layoutId="account-tab-underline"
                  className="absolute -bottom-px left-0 h-0.5 w-full bg-caramel"
                />
              )}
            </button>
          ))}
        </div>

        <div className="mt-10">
          {tab === "settings" && <SettingsTab />}
          {tab === "wishlists" && <WishlistTab />}
          {tab === "orders" && <OrdersTab userId={user.id} />}
          {tab === "password" && <PasswordTab />}
          {tab === "billing" && <BillingTab />}
        </div>
      </section>
    </>
  );
}

function SettingsTab() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [addresses, setAddresses] = useState(user?.addresses ?? []);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("saving");
    setError("");
    try {
      await updateProfile({ name, phone, addresses });
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2500);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Could not save changes.");
    }
  };

  const addAddress = () => {
    setAddresses((prev) => [
      ...prev,
      {
        recipientName: name || "",
        phone: phone || "",
        addressLine1: "",
        city: "",
        isDefault: prev.length === 0,
      },
    ]);
  };

  const updateAddress = (idx: number, field: string, value: string | boolean) => {
    setAddresses((prev) =>
      prev.map((a, i) => (i === idx ? { ...a, [field]: value } : a))
    );
  };

  const removeAddress = (idx: number) => {
    setAddresses((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div>
      <h2 className="font-display text-2xl text-choco">Account information</h2>
      <form
        onSubmit={handleSubmit}
        className="mt-8 grid gap-10 md:grid-cols-[120px_1fr]"
      >
        <div className="flex flex-col items-center">
          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-choco font-display text-3xl text-cream-50">
            {initials(user?.name || "U")}
          </div>
        </div>

        <div className="space-y-5">
          {status === "saved" && (
            <p className="rounded-2xl bg-pistachio/15 px-4 py-3 text-sm text-pistachio">
              Your account has been updated.
            </p>
          )}
          {status === "error" && (
            <p className="rounded-2xl bg-berry/10 px-4 py-3 text-sm text-berry">
              {error}
            </p>
          )}

          <div>
            <label className={labelClass}>Full name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Email</label>
            <div className="relative">
              <Mail
                size={16}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-choco/40"
              />
              <input
                value={user?.email ?? ""}
                readOnly
                className={`${inputClass} cursor-not-allowed pl-10 text-choco/50`}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Phone number</label>
            <div className="relative">
              <Phone
                size={16}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-choco/40"
              />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01XXXXXXXXX"
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>

          {/* Saved addresses */}
          <div>
            <div className="flex items-center justify-between">
              <label className={labelClass}>Saved addresses</label>
              <button
                type="button"
                onClick={addAddress}
                className="text-sm font-medium text-caramel-dark hover:underline"
              >
                + Add address
              </button>
            </div>
            <div className="space-y-4">
              {addresses.length === 0 && (
                <p className="rounded-2xl bg-cream-100 px-4 py-3 text-sm text-choco/50">
                  No saved addresses yet.
                </p>
              )}
              {addresses.map((addr, idx) => (
                <div
                  key={idx}
                  className="rounded-3xl border border-choco/10 bg-white p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-caramel-dark">
                      Address {idx + 1}
                      {addr.isDefault && (
                        <span className="ml-2 rounded-full bg-pistachio/15 px-2 py-0.5 text-[10px] text-pistachio">
                          Default
                        </span>
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeAddress(idx)}
                      className="text-choco/40 hover:text-berry"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input
                      value={addr.recipientName}
                      onChange={(e) =>
                        updateAddress(idx, "recipientName", e.target.value)
                      }
                      placeholder="Recipient name"
                      className={inputClass}
                    />
                    <input
                      value={addr.phone}
                      onChange={(e) =>
                        updateAddress(idx, "phone", e.target.value)
                      }
                      placeholder="Phone"
                      className={inputClass}
                    />
                    <input
                      value={addr.addressLine1}
                      onChange={(e) =>
                        updateAddress(idx, "addressLine1", e.target.value)
                      }
                      placeholder="Address line 1"
                      className={`${inputClass} sm:col-span-2`}
                    />
                    <input
                      value={addr.addressLine2 ?? ""}
                      onChange={(e) =>
                        updateAddress(idx, "addressLine2", e.target.value)
                      }
                      placeholder="Address line 2 (optional)"
                      className={`${inputClass} sm:col-span-2`}
                    />
                    <input
                      value={addr.city}
                      onChange={(e) =>
                        updateAddress(idx, "city", e.target.value)
                      }
                      placeholder="City"
                      className={inputClass}
                    />
                    <input
                      value={addr.area ?? ""}
                      onChange={(e) =>
                        updateAddress(idx, "area", e.target.value)
                      }
                      placeholder="Area"
                      className={inputClass}
                    />
                    <input
                      value={addr.postalCode ?? ""}
                      onChange={(e) =>
                        updateAddress(idx, "postalCode", e.target.value)
                      }
                      placeholder="Postal code"
                      className={inputClass}
                    />
                    <label className="flex items-center gap-2 text-sm text-choco/70">
                      <input
                        type="checkbox"
                        checked={addr.isDefault ?? false}
                        onChange={(e) =>
                          updateAddress(idx, "isDefault", e.target.checked)
                        }
                        className="h-4 w-4 rounded border-choco/20 text-caramel focus:ring-caramel"
                      />
                      Set as default
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={status === "saving"}
            className="btn-primary"
          >
            {status === "saving" ? "Updating…" : "Update account"}
          </button>
        </div>
      </form>
    </div>
  );
}

function WishlistTab() {
  const { items, remove } = useWishlist();
  const { addItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cream-100">
          <Heart size={28} className="text-berry" />
        </div>
        <p className="text-choco/60">
          You haven&apos;t saved anything yet. Tap the heart on a product to add
          it here.
        </p>
        <Link href="/shop" className="btn-accent btn-sm">
          Browse the bakery <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <li
          key={item.productId}
          className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-card"
        >
          <Link
            href={`/product/${item.slug}`}
            className="relative block aspect-[4/3] overflow-hidden"
          >
            <Image
              src={item.image}
              alt={item.name}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </Link>
          <div className="flex flex-1 flex-col p-4">
            <Link href={`/product/${item.slug}`}>
              <h3 className="font-display text-lg leading-snug text-choco transition-colors group-hover:text-caramel-dark">
                {item.name}
              </h3>
            </Link>
            <div className="mt-auto flex items-center justify-between pt-4">
              <span className="font-display text-xl text-choco">
                {formatTaka(item.price)}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => remove(item.productId)}
                  aria-label="Remove from wishlist"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-choco/15 text-choco/50 transition-colors hover:border-berry hover:text-berry"
                >
                  <Trash2 size={17} />
                </button>
                <button
                  onClick={() =>
                    addItem({
                      productId: item.productId,
                      name: item.name,
                      image: item.image,
                      slug: item.slug,
                      unitPrice: item.price,
                    })
                  }
                  aria-label={`Add ${item.name} to cart`}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-choco text-cream-50 transition-all hover:scale-105 hover:bg-caramel-dark"
                >
                  <ShoppingBag size={17} />
                </button>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

const statusStyles: Record<string, string> = {
  pending: "bg-caramel/15 text-caramel-dark",
  confirmed: "bg-caramel/15 text-caramel-dark",
  preparing: "bg-caramel/15 text-caramel-dark",
  out_for_delivery: "bg-pistachio/15 text-pistachio",
  ready_for_pickup: "bg-pistachio/15 text-pistachio",
  delivered: "bg-pistachio/15 text-pistachio",
  cancelled: "bg-berry/10 text-berry",
};

function OrdersTab({ userId }: { userId: string }) {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getMyOrders(userId)
      .then((data) => mounted && setOrders(data))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [userId]);

  if (loading) return <p className="text-choco/60">Loading your orders…</p>;

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cream-100">
          <ShoppingBag size={28} className="text-caramel" />
        </div>
        <p className="text-choco/60">You haven&apos;t placed any orders yet.</p>
        <Link href="/shop" className="btn-accent btn-sm">
          Start shopping <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {orders.map((o) => (
        <li
          key={o.id}
          className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-white p-5 shadow-card"
        >
          <div>
            <p className="font-display text-lg text-choco">{o.orderNumber}</p>
            <p className="text-sm text-choco/50">
              {new Date(o.placedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}{" "}
              · {o.itemCount} {o.itemCount === 1 ? "item" : "items"} · {o.type}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                statusStyles[o.status] ?? "bg-choco/10 text-choco/70"
              }`}
            >
              {o.status.replace(/_/g, " ")}
            </span>
            <span className="font-display text-lg text-choco">
              {formatTaka(o.total)}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}

function PasswordTab() {
  const { changePassword } = useAuth();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (next !== confirm) {
      setStatus("error");
      setError("New passwords do not match.");
      return;
    }
    setStatus("saving");
    try {
      await changePassword(current, next);
      setStatus("saved");
      setCurrent("");
      setNext("");
      setConfirm("");
      setTimeout(() => setStatus("idle"), 2500);
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error ? err.message : "Could not change password."
      );
    }
  };

  return (
    <div className="max-w-md">
      <h2 className="font-display text-2xl text-choco">Change password</h2>
      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        {status === "saved" && (
          <p className="rounded-2xl bg-pistachio/15 px-4 py-3 text-sm text-pistachio">
            Your password has been updated.
          </p>
        )}
        {status === "error" && (
          <p className="rounded-2xl bg-berry/10 px-4 py-3 text-sm text-berry">
            {error}
          </p>
        )}
        <div>
          <label className={labelClass}>Current password</label>
          <input
            type="password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>New password</label>
          <input
            type="password"
            value={next}
            onChange={(e) => setNext(e.target.value)}
            required
            minLength={6}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Confirm new password</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            minLength={6}
            className={inputClass}
          />
        </div>
        <button
          type="submit"
          disabled={status === "saving"}
          className="btn-primary"
        >
          {status === "saving" ? "Updating…" : "Update password"}
        </button>
      </form>
    </div>
  );
}

function BillingTab() {
  return (
    <div className="rounded-3xl bg-cream-100 p-8 text-center">
      <h2 className="font-display text-2xl text-choco">Billing</h2>
      <p className="mx-auto mt-2 max-w-md text-choco/60">
        We currently accept Cash on Delivery, bKash, Nagad and card payments at
        checkout. Saved payment methods are coming soon.
      </p>
      <Link href="/shop" className="btn-accent mt-6">
        Continue shopping <ArrowRight size={18} />
      </Link>
    </div>
  );
}
