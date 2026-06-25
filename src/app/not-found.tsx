import Link from "next/link";
import { ArrowLeft, Croissant } from "lucide-react";

export default function NotFound() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center gap-6 bg-cream-50 px-4 text-center">
      <span className="flex h-20 w-20 items-center justify-center rounded-full bg-caramel/15 text-caramel-dark">
        <Croissant size={40} />
      </span>
      <p className="font-display text-7xl text-choco">404</p>
      <h1 className="font-display text-2xl text-choco">
        This page is out of the oven
      </h1>
      <p className="max-w-sm text-choco/60">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
        Let&apos;s get you back to something delicious.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link href="/" className="btn-accent">
          <ArrowLeft size={18} /> Back home
        </Link>
        <Link href="/shop" className="btn-outline">
          Browse the bakery
        </Link>
      </div>
    </section>
  );
}
