export type CategorySlug =
  | "breads"
  | "buns-rolls"
  | "savory"
  | "cakes"
  | "sandwiches"
  | "snacks";

export interface Category {
  slug: CategorySlug;
  name: string;
  tagline: string;
  image: string;
}

export interface ProductVariant {
  id: string;
  label: string;
  /** price delta in BDT added to the base price */
  priceDelta: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  /** base price in BDT (taka) */
  price: number;
  shortDescription: string;
  description: string;
  image: string;
  gallery: string[];
  tags: string[];
  allergens: string[];
  variants?: ProductVariant[];
  rating: number;
  reviewCount: number;
  isBestseller?: boolean;
  isNew?: boolean;
  /** outlet ids where this product is sold out */
  unavailableAt?: string[];
  /** per-outlet price overrides (outletId -> price) */
  priceByOutlet?: Record<string, number>;
}

export interface Outlet {
  id: string;
  name: string;
  area: string;
  city: string;
  address: string;
  phone: string;
  hours: string;
  lat: number;
  lng: number;
  image: string;
  supportsDelivery: boolean;
  supportsPickup: boolean;
}

export interface CartItem {
  key: string;
  productId: string;
  name: string;
  image: string;
  slug: string;
  unitPrice: number;
  quantity: number;
  variantLabel?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  quote: string;
  rating: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
}

export type FulfilmentType = "delivery" | "pickup";

export interface GuestDetails {
  fullName: string;
  phone: string;
  email: string;
  address?: string;
  area?: string;
  notes?: string;
}

export interface Order {
  orderNumber: string;
  items: CartItem[];
  outletId: string;
  outletName: string;
  fulfilment: FulfilmentType;
  guest: GuestDetails;
  subtotal: number;
  deliveryFee: number;
  total: number;
  placedAt: string;
}
