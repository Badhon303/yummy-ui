import { Quote } from "lucide-react";
import { testimonials } from "@/data/testimonials";
import SectionHeading from "@/components/ui/SectionHeading";
import StarRating from "@/components/ui/StarRating";
import Reveal from "@/components/ui/Reveal";

export default function Testimonials() {
  return (
    <section className="section bg-cream-100">
      <div className="container-px mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Kind words"
          title="Loved by our community"
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t, i) => (
            <Reveal key={t.id} delay={(i % 4) * 0.08}>
              <figure className="flex h-full flex-col rounded-3xl bg-white p-6 shadow-card">
                <Quote className="text-caramel" size={28} />
                <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-choco/75">
                  “{t.quote}”
                </blockquote>
                <div className="mt-4">
                  <StarRating rating={t.rating} />
                </div>
                <figcaption className="mt-3 border-t border-choco/10 pt-3">
                  <p className="font-semibold text-choco">{t.name}</p>
                  <p className="text-xs text-choco/50">{t.location}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
