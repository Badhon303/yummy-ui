"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Clock, MapPin, Phone, X } from "lucide-react";
import { useOutlet } from "@/context/OutletContext";

export default function OutletPicker() {
  const { isPickerOpen, closePicker, outlets, selectedOutlet, setOutlet } =
    useOutlet();

  return (
    <AnimatePresence>
      {isPickerOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={selectedOutlet ? closePicker : undefined}
            className="fixed inset-0 z-[80] bg-choco/60 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 280, damping: 26 }}
              className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-cream-50 shadow-2xl"
            >
              <div className="relative bg-choco px-7 py-6 text-cream-50">
                {selectedOutlet && (
                  <button
                    onClick={closePicker}
                    aria-label="Close"
                    className="absolute right-5 top-5 text-cream-50/70 hover:text-cream-50"
                  >
                    <X size={22} />
                  </button>
                )}
                <p className="eyebrow text-caramel-light">Welcome to Yummy</p>
                <h2 className="mt-2 font-display text-2xl md:text-3xl">
                  Choose your nearest outlet
                </h2>
                <p className="mt-1 text-sm text-cream-50/70">
                  Prices & availability may vary by location.
                </p>
              </div>

              <div className="max-h-[55vh] overflow-y-auto p-5">
                <div className="grid gap-3 sm:grid-cols-2">
                  {outlets.map((o) => {
                    const active = o.id === selectedOutlet?.id;
                    return (
                      <button
                        key={o.id}
                        onClick={() => setOutlet(o.id)}
                        className={`rounded-2xl border p-4 text-left transition-all hover:border-caramel hover:shadow-soft ${
                          active
                            ? "border-caramel bg-cream-100"
                            : "border-choco/10 bg-white"
                        }`}
                      >
                        <h3 className="font-display text-lg text-choco">
                          {o.name}
                        </h3>
                        <p className="mt-1 flex items-start gap-1.5 text-xs text-choco/60">
                          <MapPin size={13} className="mt-0.5 shrink-0" />
                          {o.address}
                        </p>
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-choco/60">
                          <Clock size={13} /> {o.hours}
                        </p>
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-choco/60">
                          <Phone size={13} /> {o.phone}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
