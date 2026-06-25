import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import ShopClient from "@/components/shop/ShopClient";

export const metadata = {
  title: "Shop — Yummy Bakery",
  description: "Browse all freshly baked breads, buns, cakes and savoury treats.",
};

export default function ShopPage() {
  return (
    <>
      <PageHeader
        eyebrow="The bakery"
        title="Shop fresh bakes"
        description="Everything is baked fresh daily. Add your favourites to the basket and order as a guest in minutes."
        crumbs={[{ label: "Shop" }]}
      />
      <Suspense fallback={<div className="section text-center text-choco/50">Loading bakes…</div>}>
        <ShopClient />
      </Suspense>
    </>
  );
}
