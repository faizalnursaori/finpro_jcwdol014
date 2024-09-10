import { CancellationSource } from '@prisma/client';

// Define PaymentStatus as a string union type instead of using the Prisma enum
export type PaymentStatus =
  | 'PENDING'
  | 'PAID'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'FAILED'
  | 'CANCELED';

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
  createdAt: string;
  total: number;
  shippingCost: number;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  paymentProof?: string;
  expirePayment: string;
  address: {
    address: string;
    city: {
      name: string;
    };
    province: {
      name: string;
    };
    postalCode: string;
  };
  items: Array<{
    id: number;
    product: {
      name: string;
    };
    quantity: number;
    price: number;
  }>;
  voucher?: {
    code: string;
    discountType: 'PERCENTAGE' | 'FIXED';
    discountValue: number;
  };
}
