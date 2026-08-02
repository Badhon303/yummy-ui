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
  OrderSummary,
  CartItem,
  FulfilmentType,
  GuestDetails,
  User,
  PaymentMethod,
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
      "/api/products?limit=200&depth=2"
    );
    return data.docs.map(mapBackendProduct);
  }, mockProducts);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return tryApi(async () => {
    const data = await apiFetch<PaginatedDocs<unknown>>(
      `/api/products?depth=2&where[slug][equals]=${encodeURIComponent(slug)}`
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
      `/api/products?limit=200&depth=2&where[category][equals]=${encodeURIComponent(
        categoryId
      )}`
    );
    return data.docs.map(mapBackendProduct);
  }, mockProducts.filter((p) => p.category === category));
}

export async function getBestsellers(): Promise<Product[]> {
  return tryApi(async () => {
    const data = await apiFetch<PaginatedDocs<unknown>>(
      "/api/products?limit=20&depth=2&where[isBestseller][equals]=true"
    );
    return data.docs.map(mapBackendProduct);
  }, mockProducts.filter((p) => p.isBestseller));
}

export async function getNewArrivals(): Promise<Product[]> {
  return tryApi(async () => {
    const data = await apiFetch<PaginatedDocs<unknown>>(
      "/api/products?limit=20&depth=2&where[isNew][equals]=true"
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
      `/api/products?limit=${limit}&depth=2&where[and][0][category][equals]=${encodeURIComponent(
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

export interface BranchProduct {
  id: string;
  branch: string | { id: string };
  product: string | { id: string };
  stockQuantity: number;
  isAvailable: boolean;
}

/** Fetch branch-product overrides for a specific outlet. */
export async function getBranchProductsForOutlet(outletId: string): Promise<BranchProduct[]> {
  return tryApi(async () => {
    const data = await apiFetch<PaginatedDocs<unknown>>(
      `/api/branch-products?limit=500&depth=0&where[branch][equals]=${encodeURIComponent(
        outletId
      )}`
    );
    return data.docs as BranchProduct[];
  }, []);
}

/** Merge per-outlet availability from branch-products into product list. */
export function applyBranchAvailability(
  products: Product[],
  branchProducts: BranchProduct[],
  outletId: string
): Product[] {
  const unavailable = new Set(
    branchProducts
      .filter((bp) => !bp.isAvailable)
      .map((bp) =>
        typeof bp.product === "object" && bp.product !== null
          ? String(bp.product.id)
          : String(bp.product)
      )
  );
  if (!unavailable.size) return products;
  return products.map((p) => {
    if (!unavailable.has(p.id)) return p;
    const set = new Set(p.unavailableAt ?? []);
    set.add(outletId);
    return { ...p, unavailableAt: Array.from(set) };
  });
}

/**
 * Fetch products for a specific outlet directly from the branch-products
 * collection. Only products linked to the outlet are returned, with their
 * per-outlet availability applied.
 */
export async function getProductsForOutlet(outletId: string): Promise<Product[]> {
  return tryApi(async () => {
    const data = await apiFetch<PaginatedDocs<unknown>>(
      `/api/branch-products?limit=500&depth=2&where[branch][equals]=${encodeURIComponent(
        outletId
      )}`
    );
    return data.docs.map((doc: any) => {
      const productDoc =
        typeof doc.product === "object" && doc.product !== null
          ? doc.product
          : doc;
      const product = mapBackendProduct(productDoc);
      if (doc.isAvailable === false || Number(doc.stockQuantity) <= 0) {
        product.unavailableAt = [
          ...(product.unavailableAt ?? []),
          outletId,
        ];
      }
      return product;
    });
  }, mockProducts);
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

/**
 * Payload's Postgres adapter uses numeric serial IDs by default. Frontend
 * IDs are always stringified (see mapBackendProduct/mapBackendOutlet), so
 * relationship fields must be coerced back to numbers before submitting to
 * the API, otherwise Payload's relationship validation rejects them.
 */
function toBackendId(id: string): string | number {
  const n = Number(id);
  return Number.isNaN(n) ? id : n;
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
  user?: User;
  paymentMethod: PaymentMethod;
}

/** Create an order in the backend for a signed-in customer or guest. */
export async function placeOrder(input: PlaceOrderInput): Promise<Order> {
  if (!API_ENABLED) {
    await delay(600);
    return {
      id: `mock-${Date.now()}`,
      orderNumber: generateOrderNumber(),
      placedAt: new Date().toISOString(),
      ...input,
    };
  }

  const order = await apiFetch<{
    id: string;
    orderNumber: string;
    createdAt: string;
  }>("/api/orders", {
    method: "POST",
    body: JSON.stringify({
      ...(input.user ? { user: toBackendId(input.user.id) } : {}),
      guestEmail: input.guest.email,
      guestName: input.guest.fullName,
      branch: toBackendId(input.outletId),
      shippingAddress: {
        recipientName: input.guest.fullName,
        phone: input.guest.phone,
        addressLine1: input.guest.address || "N/A",
        city: input.guest.area || "Dhaka",
        area: input.guest.area || "",
      },
      orderType: input.fulfilment,
      paymentMethod: input.paymentMethod,
      paymentStatus: input.paymentMethod === "cod" ? "unpaid" : "pending_verification",
      items: input.items.map((item) => ({
        product: toBackendId(item.productId),
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
    id: order.id,
    orderNumber: order.orderNumber,
    items: input.items,
    outletId: input.outletId,
    outletName: input.outletName,
    fulfilment: input.fulfilment,
    guest: input.guest,
    subtotal: input.subtotal,
    deliveryFee: input.deliveryFee,
    total: input.total,
    paymentMethod: input.paymentMethod,
    placedAt: order.createdAt || new Date().toISOString(),
  };
}

/**
 * Record a manual Bangla QR payment submitted by the customer. Staff verify
 * the transaction against the bank statement and mark it Success/Failed in
 * the admin panel, which then updates the order automatically.
 */
export async function submitBanglaQrPayment(
  order: Order,
  transactionId: string
): Promise<void> {
  await apiFetch("/api/payments", {
    method: "POST",
    body: JSON.stringify({
      order: toBackendId(order.id),
      paymentMethod: "bangla_qr",
      status: "pending",
      amount: order.total,
      transactionId,
    }),
  });
}

interface BackendOrder {
  id: string;
  orderNumber: string;
  orderStatus: string;
  orderType: string;
  totalAmount: number;
  items?: { quantity: number }[];
  createdAt: string;
}

/** Fetch the signed-in user's orders. Returns [] when the API is disabled. */
export async function getMyOrders(userId: string): Promise<OrderSummary[]> {
  return tryApi(async () => {
    const data = await apiFetch<PaginatedDocs<BackendOrder>>(
      `/api/orders?limit=50&depth=0&sort=-createdAt&where[user][equals]=${encodeURIComponent(
        userId
      )}`
    );
    return data.docs.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      status: o.orderStatus,
      type: o.orderType,
      total: o.totalAmount,
      itemCount: (o.items ?? []).reduce((n, i) => n + (i.quantity || 0), 0),
      placedAt: o.createdAt,
    }));
  }, []);
}

export { DELIVERY_FEE };
