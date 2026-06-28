"use client";

import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react";
import { useState } from "react";
import { useOutlet } from "@/context/OutletContext";
import Image from "next/image";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const { outlets } = useOutlet();

  return (
    <footer className="bg-choco text-cream-50/80">
      <div className="container-px mx-auto max-w-7xl py-16">
        <div className="grid gap-12 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-caramel font-display text-xl font-bold text-white">
                  <Link href="/" className="relative flex items-center">
          <Image
            src="/logo/yummy-black-logo.png"
            alt="Yummy Bakery"
            width={140}
            height={40}
            className="h-9 w-auto"
            priority
          />
        </Link>
              </span>
              <span className="font-display text-2xl font-bold text-cream-50">
                Yummy
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed">
              Happiness in every bite. Freshly baked breads, buns, cakes and
              savoury treats across our outlets.
            </p>
            <div className="mt-5 flex gap-3">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-caramel"
                  aria-label="social link"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display text-lg text-cream-50">Explore</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link href="/shop" className="hover:text-caramel-light">Shop all</Link></li>
              <li><Link href="/outlets" className="hover:text-caramel-light">Our outlets</Link></li>
              <li><Link href="/about" className="hover:text-caramel-light">Our story</Link></li>
              <li><Link href="/contact" className="hover:text-caramel-light">Contact us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg text-cream-50">Outlets</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {outlets.slice(0, 4).map((o) => (
                <li key={o.id} className="flex items-start gap-1.5">
                  <MapPin size={13} className="mt-1 shrink-0 text-caramel-light" />
                  <span>{o.name}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 flex items-center gap-1.5 text-sm">
              <Phone size={13} className="text-caramel-light" /> +880 1700-100200
            </p>
          </div>

          <div>
            <h4 className="font-display text-lg text-cream-50">Fresh updates</h4>
            <p className="mt-4 text-sm">
              Sign up for seasonal specials and new bakes.
            </p>
            {done ? (
              <p className="mt-4 rounded-xl bg-white/10 px-4 py-3 text-sm text-cream-50">
                Thanks! You&apos;re on the list.
              </p>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email.trim()) setDone(true);
                }}
                className="mt-4 flex overflow-hidden rounded-full bg-white/10 p-1"
              >
                <span className="flex items-center pl-3 text-cream-50/60">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="w-full bg-transparent px-3 py-2 text-sm text-cream-50 placeholder:text-cream-50/50 focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-full bg-caramel px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-caramel-dark"
                >
                  Join
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-cream-50/50 sm:flex-row">
          <p>© {new Date().getFullYear()} Yummy Bakery. All rights reserved.</p>
          <p>Happiness in every bite.</p>
        </div>
      </div>
    </footer>
  );
}
