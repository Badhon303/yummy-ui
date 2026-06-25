import PageHeader from "@/components/PageHeader";
import OutletsClient from "@/components/outlets/OutletsClient";

export const metadata = {
  title: "Outlets — Yummy Bakery",
  description: "Find your nearest Yummy Bakery outlet for delivery or pickup.",
};

export default function OutletsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Find us"
        title="Our outlets"
        description="Freshly baked at every location. Choose an outlet to order for delivery or pickup."
        crumbs={[{ label: "Outlets" }]}
      />
      <OutletsClient />
    </>
  );
}
