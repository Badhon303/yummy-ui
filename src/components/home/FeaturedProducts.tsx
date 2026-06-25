import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getBestsellers } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import SectionHeading from "@/components/ui/SectionHeading";

export default async function FeaturedProducts() {
  const bestsellers = await getBestsellers();

  return (
    <section className="section bg-cream-100">
      <div className="container-px mx-auto max-w-7xl">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            align="left"
            eyebrow="Most loved"
            title="Our bestsellers"
            description="The bakes our customers keep coming back for."
          />
          <Link
            href="/shop"
            className="hidden items-center gap-1.5 text-sm font-semibold text-caramel-dark hover:gap-2.5 transition-all md:inline-flex"
          >
            View all products <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {bestsellers.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        <div className="mt-10 text-center md:hidden">
          <Link href="/shop" className="btn-outline">
            View all products <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
