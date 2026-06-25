import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Crumb {
  label: string;
  href?: string;
}

export default function PageHeader({
  eyebrow,
  title,
  description,
  crumbs = [],
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  crumbs?: Crumb[];
}) {
  return (
    <section className="bg-choco pb-14 pt-32 text-cream-50">
      <div className="container-px mx-auto max-w-7xl">
        <nav className="flex items-center gap-1.5 text-xs text-cream-50/60">
          <Link href="/" className="hover:text-caramel-light">
            Home
          </Link>
          {crumbs.map((c) => (
            <span key={c.label} className="flex items-center gap-1.5">
              <ChevronRight size={12} />
              {c.href ? (
                <Link href={c.href} className="hover:text-caramel-light">
                  {c.label}
                </Link>
              ) : (
                <span className="text-cream-50">{c.label}</span>
              )}
            </span>
          ))}
        </nav>
        {eyebrow && (
          <p className="mt-6 eyebrow text-caramel-light">{eyebrow}</p>
        )}
        <h1 className="mt-2 font-display text-4xl leading-tight md:text-5xl lg:text-6xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-cream-50/70">{description}</p>
        )}
      </div>
    </section>
  );
}
