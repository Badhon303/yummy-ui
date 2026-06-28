"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth, type AuthMode } from "@/context/AuthContext";

export default function AuthModal() {
  const { isAuthOpen, authMode, openAuth, closeAuth, login, register } =
    useAuth();

  const [mode, setMode] = useState<AuthMode>(authMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthOpen) {
      setMode(authMode);
      setError("");
    }
  }, [isAuthOpen, authMode]);

  const isRegister = mode === "register";

  const switchMode = (next: AuthMode) => {
    setMode(next);
    setError("");
    openAuth(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (isRegister) {
        await register({ name, email, phone, password });
      } else {
        await login(email, password);
      }
      closeAuth();
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : isRegister
          ? "Registration failed"
          : "Login failed"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isAuthOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAuth}
            className="fixed inset-0 z-[80] bg-choco/60 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 280, damping: 26 }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl bg-cream-50 shadow-2xl"
            >
              <div className="relative bg-choco px-7 py-6 text-cream-50">
                <button
                  onClick={closeAuth}
                  aria-label="Close"
                  className="absolute right-5 top-5 text-cream-50/70 hover:text-cream-50"
                >
                  <X size={22} />
                </button>
                <p className="eyebrow text-caramel-light">
                  {isRegister ? "Join Yummy" : "Welcome back"}
                </p>
                <h2 className="mt-2 font-display text-2xl md:text-3xl">
                  {isRegister ? "Create your account" : "Sign in"}
                </h2>
                <p className="mt-1 text-sm text-cream-50/70">
                  {isRegister
                    ? "One account for faster checkout, order tracking and saved addresses."
                    : "Order, track deliveries and save your addresses."}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-7">
                {error && (
                  <p className="mb-4 rounded-2xl bg-berry/10 px-4 py-3 text-sm text-berry">
                    {error}
                  </p>
                )}

                <div className="space-y-4">
                  {isRegister && (
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-choco">
                        Full name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full rounded-2xl border border-choco/15 bg-white px-4 py-3 text-sm focus:border-caramel focus:outline-none"
                      />
                    </div>
                  )}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-choco">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full rounded-2xl border border-choco/15 bg-white px-4 py-3 text-sm focus:border-caramel focus:outline-none"
                    />
                  </div>
                  {isRegister && (
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-choco">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        placeholder="01XXXXXXXXX"
                        className="w-full rounded-2xl border border-choco/15 bg-white px-4 py-3 text-sm focus:border-caramel focus:outline-none"
                      />
                    </div>
                  )}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-choco">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={isRegister ? 6 : undefined}
                      className="w-full rounded-2xl border border-choco/15 bg-white px-4 py-3 text-sm focus:border-caramel focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-accent mt-6 w-full justify-center"
                >
                  {submitting
                    ? isRegister
                      ? "Creating account…"
                      : "Signing in…"
                    : isRegister
                    ? "Create account"
                    : "Sign in"}
                </button>

                <p className="mt-6 text-center text-sm text-choco/60">
                  {isRegister ? (
                    <>
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => switchMode("login")}
                        className="font-medium text-caramel-dark hover:underline"
                      >
                        Sign in
                      </button>
                    </>
                  ) : (
                    <>
                      Don&apos;t have an account?{" "}
                      <button
                        type="button"
                        onClick={() => switchMode("register")}
                        className="font-medium text-caramel-dark hover:underline"
                      >
                        Create one
                      </button>
                    </>
                  )}
                </p>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
