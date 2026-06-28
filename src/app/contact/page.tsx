"use client";

import { motion } from "framer-motion";
import { Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";
import { useOutlet } from "@/context/OutletContext";
import PageHeader from "@/components/PageHeader";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const { outlets } = useOutlet();

  return (
    <>
      <PageHeader
        eyebrow="Say hello"
        title="Get in touch"
        description="Questions, bulk orders or feedback — we'd love to hear from you."
        crumbs={[{ label: "Contact" }]}
      />

      <section className="section container-px mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
          <div>
            <h2 className="font-display text-2xl text-choco">Reach us</h2>
            <div className="mt-6 space-y-4">
              <InfoRow icon={Phone} label="Phone" value="+880 1700-100200" />
              <InfoRow icon={Mail} label="Email" value="hello@yummy.com" />
              <InfoRow icon={Clock} label="Hours" value="Every day, 8:00 AM – 11:00 PM" />
            </div>

            <h3 className="mt-10 font-display text-xl text-choco">Our outlets</h3>
            <ul className="mt-4 space-y-3">
              {outlets.map((o) => (
                <li key={o.id} className="flex items-start gap-2 text-sm text-choco/70">
                  <MapPin size={15} className="mt-0.5 shrink-0 text-caramel" />
                  <span>
                    <span className="font-medium text-choco">{o.name}</span> — {o.address}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex h-full flex-col items-center justify-center gap-4 py-10 text-center"
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-pistachio text-white">
                  <Send size={26} />
                </span>
                <h3 className="font-display text-2xl text-choco">Message sent!</h3>
                <p className="text-choco/60">
                  Thanks {form.name.split(" ")[0] || "there"} — we&apos;ll get back to you soon.
                </p>
              </motion.div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
                className="space-y-4"
              >
                <h2 className="font-display text-2xl text-choco">Send a message</h2>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-choco">Name</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-2xl border border-choco/15 bg-cream-50 px-4 py-3 text-sm focus:border-caramel focus:outline-none"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-choco">Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-2xl border border-choco/15 bg-cream-50 px-4 py-3 text-sm focus:border-caramel focus:outline-none"
                    placeholder="you@email.com"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-choco">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full rounded-2xl border border-choco/15 bg-cream-50 px-4 py-3 text-sm focus:border-caramel focus:outline-none"
                    placeholder="How can we help?"
                  />
                </div>
                <button type="submit" className="btn-accent w-full justify-center">
                  Send message <Send size={16} />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Phone;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-cream-100 px-4 py-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-caramel-dark">
        <Icon size={18} />
      </span>
      <div>
        <p className="text-xs uppercase tracking-wider text-choco/50">{label}</p>
        <p className="text-sm font-medium text-choco">{value}</p>
      </div>
    </div>
  );
}
