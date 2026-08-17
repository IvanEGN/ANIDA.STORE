export interface ProductColor {
  name: string;
  hex: string;
}

export interface ProductVariant {
  id: string;
  sku: string;
  size: string;
  colorName: string;
  colorHex: string;
  stock: number;
  priceAdjustment?: number;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  materialsCare?: string;
  price: number;
  compareAtPrice?: number;
  category: "Tops" | "Bottoms" | "Jackets" | "Leotardos" | "Accesorios" | "Sales" | string;
  isNew?: boolean;
  featured?: boolean;
  images: {
    primary: string;
    hover: string;
    gallery: string[];
  };
  colors: ProductColor[];
  sizes: string[];
  variants: ProductVariant[];
}

export interface CartItem {
  id: string; // unique item key: productId-variantId
  productId: string;
  variantId: string;
  title: string;
  slug: string;
  price: number;
  size: string;
  colorName: string;
  colorHex: string;
  image: string;
  quantity: number;
}

export interface HomeBannerData {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  mediaType: "IMAGE" | "VIDEO";
  mediaUrl: string;
  mobileMediaUrl?: string;
  tagline?: string;
  isActive: boolean;
  displayOrder?: number;
}

export interface SizeRequestRecord {
  id: string;
  productId: string;
  productTitle: string;
  requestedSize: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes?: string;
  createdAt: string;
  status: "PENDING" | "CONTACTED" | "RESOLVED";
}

export interface OrderCustomerInfo {
  name: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export type PaymentMethodType = "CARD" | "STRIPE" | "SPEI";


export interface OrderRecord {
  id: string;
  orderNumber: string;
  date: string;
  customer: OrderCustomerInfo;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: PaymentMethodType;
  paymentStatus: "PENDING" | "PAID" | "FAILED";
  orderStatus: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  speiClabe?: string;
}

