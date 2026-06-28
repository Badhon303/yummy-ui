import { notFound } from "next/navigation";
import { getProductBySlug, getProducts, getRelatedProducts } from "@/lib/api";
import ProductDetail from "@/components/product/ProductDetail";
import ProductCard from "@/components/ProductCard";
import SectionHeading from "@/components/ui/SectionHeading";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: "Not found — Yummy Bakery" };
  return {
    title: `${product.name} — Yummy Bakery`,
    description: product.shortDescription,
  };
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();
  const related = await getRelatedProducts(product);

  return (
    <div className="pt-20">
      <ProductDetail product={product} />

      {related.length > 0 && (
        <section className="section bg-cream-100">
          <div className="container-px mx-auto max-w-7xl">
            <SectionHeading align="left" eyebrow="You may also like" title="Pairs well with" />
            <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
