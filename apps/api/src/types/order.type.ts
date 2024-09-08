import { PaymentStatus } from '@prisma/client';

export type CheckoutBody = {
  name: string;
  paymentStatus: PaymentStatus;
  shippingCost: number;
  total: number;
  paymentMethod: string;
  warehouseId: number;
  cartId: number;
  addressId: number;
  orderItems: OrderItemsBody[];
  latitude: number;
  longitude: number;
  userId: number;
};

export type OrderItemsBody = {
  productId: number;
  quantity: number;
  price: number;
  total: number;
};

export type OrderQuery = {
  page?: number;
  limit?: number;
  filter?: string;
  sortBy?: string;
  orderBy?: string;
};

export type CancellationSource = CancellationStatus;

export enum CancellationStatus {
  USER = 'USER',
  SYSTEM = 'SYSTEM',
}
