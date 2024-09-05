import { CancellationSource } from '@prisma/client';

// Define PaymentStatus as a string union type instead of using the Prisma enum
export type PaymentStatus = 'PENDING' | 'PAID' | 'CANCELLED' | 'EXPIRED';

export interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  total: number;
  orderId: number;
  productId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Warehouse {
  id: number;
  name: string;
  address: string;
  provinceId: number;
  cityId: number;
  postalCode: string;
  latitude: number;
  longitude: number;
  storeRadius: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Cart {
  id: number;
  isActive: boolean;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: number;
  name: string;
  address: string;
  provinceId: number;
  cityId: number;
  postalCode: string;
  isPrimary: boolean;
  userId: number;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: number;
  name: string;
  paymentStatus: PaymentStatus;
  shippingCost: number;
  total: number;
  paymentMethod: string;
  paymentProof: string | null;
  expirePayment: string;
  warehouseId: number;
  cartId: number;
  addressId: number;
  voucherId: number | null;
  shippedAt: string | null;
  cancellationSource: CancellationSource | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  warehouse: Warehouse;
  cart: Cart;
  address: Address;
  voucher: any | null; // Replace 'any' with a proper Voucher type if available
}
