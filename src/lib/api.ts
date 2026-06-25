import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { outlets, DELIVERY_FEE } from "@/data/outlets";
import { testimonials } from "@/data/testimonials";
import type {
  Product,
  Category,
  Outlet,
  Testimonial,
  Order,
  CartItem,
  FulfilmentType,
  GuestDetails,
} from "@/lib/types";
import { generateOrderNumber } from "@/lib/format";

/**
 * Thin mock API layer.
 * Every function is async so swapping these for real `fetch` calls to a
 * backend later requires NO changes in the UI components.
 */

const delay = (ms = 0) => new Promise((r) => setTimeout(r, ms));

export async function getProducts(): Promise<Product[]> {
  await delay();
  return products;
}

export async function getProductBySlug(
  slug: string
): Promise<Product | undefined> {
  await delay();
  return products.find((p) => p.slug === slug);
}

export async function getProductsByCategory(
  category: string
): Promise<Product[]> {
  await delay();
  return products.filter((p) => p.category === category);
}

export async function getBestsellers(): Promise<Product[]> {
  await delay();
  return products.filter((p) => p.isBestseller);
}

export async function getNewArrivals(): Promise<Product[]> {
  await delay();
  return products.filter((p) => p.isNew);
}

export async function getRelatedProducts(
  product: Product,
  limit = 4
): Promise<Product[]> {
  await delay();
  return products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, limit);
}

export async function getCategories(): Promise<Category[]> {
  await delay();
  return categories;
}

export async function getOutlets(): Promise<Outlet[]> {
  await delay();
  return outlets;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  await delay();
  return testimonials;
}

/** Resolve the effective price of a product for a given outlet. */
export function getProductPrice(product: Product, outletId?: string): number {
  if (outletId && product.priceByOutlet?.[outletId] != null) {
    return product.priceByOutlet[outletId];
  }
  return product.price;
}

/** Whether a product is available at a given outlet. */
export function isAvailableAt(product: Product, outletId?: string): boolean {
  if (!outletId) return true;
  return !product.unavailableAt?.includes(outletId);
}

export interface PlaceOrderInput {
  items: CartItem[];
  outletId: string;
  outletName: string;
  fulfilment: FulfilmentType;
  guest: GuestDetails;
  subtotal: number;
  deliveryFee: number;
  total: number;
}

/** Stubbed order placement. Replace with a POST to your backend later. */
export async function placeOrder(input: PlaceOrderInput): Promise<Order> {
  await delay(600);
  return {
    orderNumber: generateOrderNumber(),
    placedAt: new Date().toISOString(),
    ...input,
  };
}

export { DELIVERY_FEE };
