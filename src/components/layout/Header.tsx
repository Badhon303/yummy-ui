"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, MapPin, Menu, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useOutlet } from "@/context/OutletContext";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/outlets", label: "Outlets" },
  { href: "/about", label: "Our Story" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const { totalItems, openCart } = useCart();
  const { selectedOutlet, openPicker } = useOutlet();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isHome = pathname === "/";
  const solid = scrolled || !isHome || mobileOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid
          ? "bg-cream-50/95 shadow-soft backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="container-px mx-auto flex max-w-7xl items-center justify-between gap-4 py-4">
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

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-sm font-medium text-choco/80 transition-colors hover:text-caramel-dark"
              >
                {link.label}
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-1.5 left-0 h-0.5 w-full bg-caramel"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={openPicker}
            className="hidden items-center gap-1.5 rounded-full border border-choco/15 px-3.5 py-2 text-xs font-medium text-choco transition-colors hover:border-caramel sm:flex"
          >
            <MapPin size={14} className="text-caramel" />
            {selectedOutlet ? selectedOutlet.area : "Select outlet"}
            <ChevronDown size={13} />
          </button>

          <button
            onClick={openCart}
            aria-label="Open cart"
            className="relative rounded-full p-2.5 text-choco transition-colors hover:bg-choco/10"
          >
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-berry px-1 text-[10px] font-bold text-white">
                {totalItems}
              </span>
            )}
          </button>

          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            className="rounded-full p-2.5 text-choco transition-colors hover:bg-choco/10 lg:hidden"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-choco/10 bg-cream-50 lg:hidden"
          >
            <nav className="container-px mx-auto flex max-w-7xl flex-col py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-xl px-3 py-3 text-base font-medium text-choco hover:bg-cream-100"
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={() => {
                  openPicker();
                  setMobileOpen(false);
                }}
                className="mt-2 flex items-center gap-2 rounded-xl bg-cream-100 px-3 py-3 text-left text-sm font-medium text-choco"
              >
                <MapPin size={16} className="text-caramel" />
                {selectedOutlet ? `Outlet: ${selectedOutlet.name}` : "Select an outlet"}
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
