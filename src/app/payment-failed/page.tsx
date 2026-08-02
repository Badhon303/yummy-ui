"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const REASON_MESSAGES: Record<string, string> = {
  failed: "Your payment could not be completed. Please try again or choose cash on delivery.",
  cancelled: "You cancelled the payment before it was completed.",
  validation_failed: "We couldn't verify your payment. If money was deducted, it will be refunded automatically.",
};

function PaymentFailedContent() {
  const params = useSearchParams();
  const reason = params.get("reason") || "failed";
  const message = REASON_MESSAGES[reason] || REASON_MESSAGES.failed;

  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center gap-5 px-4 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 14 }}
        className="flex h-20 w-20 items-center justify-center rounded-full bg-berry/10 text-berry"
      >
        <AlertTriangle size={36} />
      </motion.div>
      <h1 className="font-display text-3xl text-choco">Payment not completed</h1>
      <p className="max-w-md text-choco/60">{message}</p>
      <div className="mt-4 flex flex-wrap justify-center gap-4">
        <Link href="/checkout" className="btn-accent inline-flex items-center gap-2">
          <RefreshCcw size={18} />
          Try again
        </Link>
        <Link href="/cart" className="btn-outline">
          Back to basket
        </Link>
      </div>
    </section>
  );
}

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={null}>
      <PaymentFailedContent />
    </Suspense>
  );
}
