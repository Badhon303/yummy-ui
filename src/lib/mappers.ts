import type {
  Category,
  CategorySlug,
  Product,
  ProductVariant,
  Outlet,
  Testimonial,
} from "@/lib/types";
import { getAssetUrl } from "@/lib/api-client";

const FRONTEND_CATEGORIES: CategorySlug[] = [
  "breads",
  "buns-rolls",
  "savory",
  "cakes",
  "sandwiches",
  "snacks",
];

export function resolveImageUrl(
  value: unknown,
  fallback: string = "/products/placeholder.jpg"
): string {
  if (!value) return fallback;

  if (typeof value === "string") {
    return makeAbsoluteUrl(value);
  }

  // Payload upload relation: { url: string, ... }
  if (typeof value === "object" && value !== null && "url" in value) {
    const url = (value as { url?: string }).url;
    if (url) return makeAbsoluteUrl(url);
  }

  return fallback;
}

function makeAbsoluteUrl(url: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/")) {
    return getAssetUrl(url);
  }
  return getAssetUrl(`/${url}`);
}

export function mapBackendCategory(doc: any): Category {
  const slug =
    (doc.slug as string) || (doc.name as string).toLowerCase().replace(/\s+/g, "-");
  return {
    slug: slug as CategorySlug,
    name: doc.name as string,
    tagline: (doc.description as string) || "",
    image: resolveImageUrl(doc.image, "/products/placeholder.jpg"),
  };
}

export function mapBackendProduct(doc: any): Product {
  const category = doc.category;
  const categorySlug =
    typeof category === "object" && category !== null
      ? (category.slug as string)
      : ((doc.categorySlug as string) || "breads");

  const rawImage = doc.image?.localImage || doc.image?.externalImage || doc.image;
  const rawGallery =
    doc.gallery?.localImage || doc.gallery?.externalImages || doc.gallery || [];

  const gallery: string[] = Array.isArray(rawGallery)
    ? rawGallery.map((item: any) =>
        resolveImageUrl(item?.url || item, "/products/placeholder.jpg")
      )
    : [];

  const variants: ProductVariant[] | undefined = Array.isArray(doc.variants)
    ? doc.variants.map((v: any, i: number) => ({
        id: String(i),
        label: v.variant as string,
        priceDelta: (v.price as number) - (doc.basePrice as number),
      }))
    : undefined;

  return {
    id: String(doc.id),
    slug: doc.slug as string,
    name: doc.name as string,
    category: categorySlug as CategorySlug,
    price: (doc.basePrice as number) ?? 0,
    shortDescription: (doc.shortDescription as string) || "",
    description: (doc.description as string) || "",
    image: resolveImageUrl(rawImage, "/products/placeholder.jpg"),
    gallery,
    tags: Array.isArray(doc.tags)
      ? doc.tags.map((t: any) => t.tag || t)
      : [],
    allergens: Array.isArray(doc.ingredients)
      ? doc.ingredients.map((i: any) => i.ingredient || i)
      : [],
    variants,
    rating: (doc.averageRating as number) ?? 0,
    reviewCount: (doc.reviewCount as number) ?? 0,
    isBestseller: doc.isBestseller === true,
    isNew: doc.isNew === true,
  };
}

export function mapBackendOutlet(doc: any): Outlet {
  const hours = doc.openingHours || {};
  return {
    id: String(doc.id),
    name: doc.name as string,
    area: (doc.area as string) || "",
    city: (doc.city as string) || "",
    address: (doc.address as string) || "",
    phone: (doc.phone as string) || "",
    hours:
      hours.open && hours.close
        ? `${hours.open} - ${hours.close}`
        : "8:00 AM - 11:00 PM",
    lat: (doc.lat as number) ?? 0,
    lng: (doc.lng as number) ?? 0,
    image: resolveImageUrl(
      doc.image?.localImage || doc.image?.externalImage || doc.image,
      "/products/placeholder.jpg"
    ),
    supportsDelivery: doc.supportsDelivery !== false,
    supportsPickup: doc.supportsPickup !== false,
  };
}

export function mapBackendTestimonial(doc: any): Testimonial {
  const user =
    typeof doc.user === "object" && doc.user !== null ? doc.user : null;
  const name = (user?.name as string) || (doc.guestName as string) || "Customer";
  return {
    id: String(doc.id),
    name,
    location: (user?.city as string) || "",
    quote: (doc.comment as string) || "",
    rating: (doc.rating as number) ?? 5,
  };
}

export { FRONTEND_CATEGORIES };
