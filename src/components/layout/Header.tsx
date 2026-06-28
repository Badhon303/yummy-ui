"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  ClipboardList,
  Heart,
  LifeBuoy,
  LogOut,
  MapPin,
  Menu,
  ShoppingBag,
  User,
  UserCircle,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useOutlet } from "@/context/OutletContext";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";

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
  const { user, logout, openAuth } = useAuth();
  const { count: wishlistCount } = useWishlist();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const isHome = pathname === "/";
  const solid = scrolled || !isHome || mobileOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [pathname]);
  useEffect(() => setUserMenuOpen(false), [pathname]);

  useEffect(() => {
    if (!userMenuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [userMenuOpen]);

  const userMenuLinks = [
    { href: "/account", label: "My Account", icon: User },
    { href: "/account?tab=orders", label: "My Orders", icon: ClipboardList },
    { href: "/account?tab=wishlists", label: "Wishlist", icon: Heart },
  ];

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

          <Link
            href="/wishlist"
            aria-label="Open wishlist"
            className="relative rounded-full p-2.5 text-choco transition-colors hover:bg-choco/10"
          >
            <Heart size={20} />
            {wishlistCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-berry px-1 text-[10px] font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </Link>

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

          {user ? (
            <div ref={userMenuRef} className="relative hidden sm:block">
              <button
                onClick={() => setUserMenuOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={userMenuOpen}
                className="flex items-center gap-2 rounded-full border border-choco/15 py-1.5 pl-1.5 pr-3 text-sm font-medium text-choco transition-colors hover:border-caramel"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-caramel/15 text-caramel">
                  <User size={16} />
                </span>
                <span className="max-w-[120px] truncate">{user.name}</span>
                <ChevronDown
                  size={14}
                  className={`text-choco/60 transition-transform ${
                    userMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.16 }}
                    role="menu"
                    className="absolute right-0 top-[calc(100%+0.75rem)] w-64 overflow-hidden rounded-2xl border border-choco/10 bg-cream-50 shadow-soft"
                  >
                    <div className="flex items-center gap-3 px-4 py-4">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-caramel/15 text-caramel">
                        <UserCircle size={26} />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-display text-sm font-semibold text-choco">
                          {user.name}
                        </p>
                        <p className="truncate text-xs text-choco/60">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <div className="h-px bg-choco/10" />

                    <div className="py-1.5">
                      {userMenuLinks.map(({ href, label, icon: Icon }) => (
                        <Link
                          key={href}
                          href={href}
                          role="menuitem"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-choco transition-colors hover:bg-choco/5"
                        >
                          <Icon size={18} className="text-choco/60" />
                          {label}
                        </Link>
                      ))}
                    </div>

                    <div className="h-px bg-choco/10" />

                    <div className="py-1.5">
                      <Link
                        href="/contact"
                        role="menuitem"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-choco transition-colors hover:bg-choco/5"
                      >
                        <LifeBuoy size={18} className="text-choco/60" />
                        Help
                      </Link>
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          logout();
                        }}
                        role="menuitem"
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-berry transition-colors hover:bg-berry/5"
                      >
                        <LogOut size={18} />
                        Log out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={() => openAuth("login")}
              className="hidden items-center gap-1.5 rounded-full border border-choco/15 px-3.5 py-2 text-xs font-medium text-choco transition-colors hover:border-caramel sm:flex"
            >
              <User size={14} />
              Login
            </button>
          )}

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

              <div className="my-2 h-px bg-choco/10" />

              {user ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-caramel/15 text-caramel">
                      <UserCircle size={24} />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-display text-sm font-semibold text-choco">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-choco/60">{user.email}</p>
                    </div>
                  </div>
                  {userMenuLinks.map(({ href, label, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-base font-medium text-choco hover:bg-cream-100"
                    >
                      <Icon size={18} className="text-choco/60" />
                      {label}
                    </Link>
                  ))}
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      logout();
                    }}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-left text-base font-medium text-berry hover:bg-berry/5"
                  >
                    <LogOut size={18} />
                    Log out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    openAuth("login");
                    setMobileOpen(false);
                  }}
                  className="flex items-center gap-2 rounded-xl px-3 py-3 text-left text-base font-medium text-choco hover:bg-cream-100"
                >
                  <User size={18} className="text-choco/60" />
                  Login
                </button>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
