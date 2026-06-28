import { products as mockProducts } from "@/data/products";
import { categories as mockCategories } from "@/data/categories";
import { outlets as mockOutlets, DELIVERY_FEE } from "@/data/outlets";
import { testimonials as mockTestimonials } from "@/data/testimonials";
import type {
  Product,
  Category,
  Outlet,
  Testimonial,
  Order,
  CartItem,
  FulfilmentType,
  GuestDetails,
  User,
} from "@/lib/types";
import { apiFetch, PaginatedDocs } from "@/lib/api-client";
import {
  mapBackendProduct,
  mapBackendCategory,
  mapBackendOutlet,
  mapBackendTestimonial,
} from "@/lib/mappers";
import { generateOrderNumber } from "@/lib/format";

const API_ENABLED = Boolean(process.env.NEXT_PUBLIC_API_URL);

const delay = (ms = 0) => new Promise((r) => setTimeout(r, ms));

async function tryApi<T>(fetcher: () => Promise<T>, fallback: T): Promise<T> {
  if (!API_ENABLED) return fallback;
  try {
    return await fetcher();
  } catch (err) {
    console.warn("API call failed, falling back to mock data.", err);
    return fallback;
  }
}

export async function getProducts(): Promise<Product[]> {
  return tryApi(async () => {
    const data = await apiFetch<PaginatedDocs<unknown>>(
      "/api/products?limit=200&depth=1"
    );
    return data.docs.map(mapBackendProduct);
  }, mockProducts);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return tryApi(async () => {
    const data = await apiFetch<PaginatedDocs<unknown>>(
      `/api/products?depth=1&where[slug][equals]=${encodeURIComponent(slug)}`
    );
    const doc = data.docs[0];
    return doc ? mapBackendProduct(doc) : undefined;
  }, mockProducts.find((p) => p.slug === slug));
}

async function getCategoryIdBySlug(slug: string): Promise<string | undefined> {
  const data = await apiFetch<PaginatedDocs<{ id: string }>>(
    `/api/categories?where[slug][equals]=${encodeURIComponent(slug)}`
  );
  return data.docs[0]?.id;
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  return tryApi(async () => {
    const categoryId = await getCategoryIdBySlug(category);
    if (!categoryId) return [];
    const data = await apiFetch<PaginatedDocs<unknown>>(
      `/api/products?limit=200&depth=1&where[category][equals]=${encodeURIComponent(
        categoryId
      )}`
    );
    return data.docs.map(mapBackendProduct);
  }, mockProducts.filter((p) => p.category === category));
}

export async function getBestsellers(): Promise<Product[]> {
  return tryApi(async () => {
    const data = await apiFetch<PaginatedDocs<unknown>>(
      "/api/products?limit=20&depth=1&where[isBestseller][equals]=true"
    );
    return data.docs.map(mapBackendProduct);
  }, mockProducts.filter((p) => p.isBestseller));
}

export async function getNewArrivals(): Promise<Product[]> {
  return tryApi(async () => {
    const data = await apiFetch<PaginatedDocs<unknown>>(
      "/api/products?limit=20&depth=1&where[isNew][equals]=true"
    );
    return data.docs.map(mapBackendProduct);
  }, mockProducts.filter((p) => p.isNew));
}

export async function getRelatedProducts(
  product: Product,
  limit = 4
): Promise<Product[]> {
  return tryApi(async () => {
    const categoryId = await getCategoryIdBySlug(product.category);
    if (!categoryId) return [];
    const data = await apiFetch<PaginatedDocs<unknown>>(
      `/api/products?limit=${limit}&depth=1&where[and][0][category][equals]=${encodeURIComponent(
        categoryId
      )}&where[and][1][id][not_equals]=${encodeURIComponent(product.id)}`
    );
    return data.docs.map(mapBackendProduct);
  }, mockProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, limit));
}

export async function getCategories(): Promise<Category[]> {
  return tryApi(async () => {
    const data = await apiFetch<PaginatedDocs<unknown>>(
      "/api/categories?limit=100&depth=1"
    );
    return data.docs.map(mapBackendCategory);
  }, mockCategories);
}

export async function getOutlets(): Promise<Outlet[]> {
  return tryApi(async () => {
    const data = await apiFetch<PaginatedDocs<unknown>>(
      "/api/outlets?limit=100&depth=1"
    );
    return data.docs.map(mapBackendOutlet);
  }, mockOutlets);
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return tryApi(async () => {
    const data = await apiFetch<PaginatedDocs<unknown>>(
      "/api/reviews?limit=20&depth=1&where[isApproved][equals]=true"
    );
    return data.docs.map(mapBackendTestimonial);
  }, mockTestimonials);
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
  user: User;
}

/** Create an order in the backend. Requires the customer to be logged in. */
export async function placeOrder(input: PlaceOrderInput): Promise<Order> {
  if (!API_ENABLED) {
    await delay(600);
    return {
      orderNumber: generateOrderNumber(),
      placedAt: new Date().toISOString(),
      ...input,
    };
  }

  const address = await apiFetch<{ id: string }>("/api/addresses", {
    method: "POST",
    body: JSON.stringify({
      user: input.user.id,
      recipientName: input.guest.fullName,
      phone: input.guest.phone,
      addressLine1: input.guest.address || "N/A",
      city: input.guest.area || "Dhaka",
      area: input.guest.area || "",
    }),
  });

  const order = await apiFetch<{
    id: string;
    orderNumber: string;
    createdAt: string;
  }>("/api/orders", {
    method: "POST",
    body: JSON.stringify({
      user: input.user.id,
      guestEmail: input.guest.email,
      guestName: input.guest.fullName,
      branch: input.outletId,
      shippingAddress: address.id,
      orderType: input.fulfilment,
      paymentMethod: "cod",
      paymentStatus: "unpaid",
      items: input.items.map((item) => ({
        product: item.productId,
        productName: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.unitPrice * item.quantity,
      })),
      subtotal: input.subtotal,
      deliveryFee: input.deliveryFee,
      totalAmount: input.total,
      notes: input.guest.notes || "",
    }),
  });

  return {
    orderNumber: order.orderNumber,
    items: input.items,
    outletId: input.outletId,
    outletName: input.outletName,
    fulfilment: input.fulfilment,
    guest: input.guest,
    subtotal: input.subtotal,
    deliveryFee: input.deliveryFee,
    total: input.total,
    placedAt: order.createdAt || new Date().toISOString(),
  };
}

export { DELIVERY_FEE };
