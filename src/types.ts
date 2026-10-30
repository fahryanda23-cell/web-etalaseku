export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  stock: number;
  sku: string;
  imageUrl: string;
  description: string;
  features?: string[];
  isFeatured?: boolean;
  unit?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface StoreProfile {
  name: string;
  tagline: string;
  whatsapp: string; // e.g. "6281234567890"
  location: string;
  workingHours: string;
  announcement?: string;
  bankInfo?: string;
  adminPin?: string;
}

export interface OrderForm {
  customerName: string;
  phone: string;
  address: string;
  paymentMethod: 'Transfer Bank' | 'QRIS' | 'COD (Bayar di Tempat)';
  notes: string;
}
