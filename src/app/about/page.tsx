import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, Leaf, Sparkles, Wheat } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

export const metadata = {
  title: "Our Story — Yummy Bakery",
  description: "The story behind Yummy Bakery — happiness in every bite.",
};

const values = [
  { icon: Wheat, title: "Honest ingredients", text: "Real butter, real cream, quality flour — and never any shortcuts." },
  { icon: Heart, title: "Baked with care", text: "Every item is handcrafted by bakers who love what they do." },
  { icon: Leaf, title: "Fresh daily", text: "We bake fresh every morning so you only get the best." },
  { icon: Sparkles, title: "Made for sharing", text: "From family breakfasts to celebrations, we bake for your moments." },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our story"
        title="Baked with heart, since day one"
        description="Yummy started small, with one oven and one promise — happiness in every bite."
        crumbs={[{ label: "Our Story" }]}
      />

      <section className="section container-px mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2.5rem] shadow-card">
              <Image src="/products/stuffed-bread.jpg" alt="Yummy bakery" fill className="object-cover" />
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <span className="eyebrow"><span className="h-px w-6 bg-caramel" /> Where it began</span>
            <h2 className="mt-3 font-display text-3xl text-choco md:text-4xl">
              A neighbourhood oven that grew with love
            </h2>
            <p className="mt-5 leading-relaxed text-choco/70">
              What began as a single small bakery quickly became a local
              favourite. Word spread about our soft dinner rolls, flaky chicken
              puffs and cream-filled buns — and before long, families across the
              city were asking for Yummy by name.
            </p>
            <p className="mt-4 leading-relaxed text-choco/70">
              Today we bake fresh at multiple outlets every single morning,
              holding on to the same recipes, the same care, and the same
              promise we started with.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section bg-cream-100">
        <div className="container-px mx-auto max-w-7xl">
          <SectionHeading eyebrow="What we stand for" title="Our little promises" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={(i % 4) * 0.08}>
                <div className="h-full rounded-3xl bg-white p-6 shadow-card">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-caramel/15 text-caramel-dark">
                    <v.icon size={22} />
                  </span>
                  <h3 className="mt-4 font-display text-lg text-choco">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-choco/65">{v.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section container-px mx-auto max-w-3xl text-center">
        <h2 className="font-display text-3xl text-choco md:text-4xl">
          Come taste the happiness
        </h2>
        <p className="mt-4 text-choco/65">
          Order online for delivery or pickup from your nearest Yummy outlet.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-4">
          <Link href="/shop" className="btn-accent">
            Order now <ArrowRight size={18} />
          </Link>
          <Link href="/outlets" className="btn-outline">
            Find an outlet
          </Link>
        </div>
      </section>
    </>
  );
}
