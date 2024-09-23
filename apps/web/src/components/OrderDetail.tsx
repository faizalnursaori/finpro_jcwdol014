import React from 'react';
import { Cart } from '@/types/cart';
import { formatRupiah } from '@/utils/currencyUtils';
interface OrderDetailsProps {
  cart: Cart;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ cart }) => {
  const subtotal = cart.items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );
  const shippingCost = 15000; // You might want to calculate this dynamically
  const total = subtotal + shippingCost;

  return (
    <div className="bg-white p-4 rounded shadow-md mb-4">
      <h2 className="text-xl font-semibold mb-2">Order Details</h2>
      <div className="mb-4">
        {cart.items.map((item) => (
          <div key={item.id} className="flex justify-between mb-2">
            <span>
              {item.product.name} x {item.quantity}
            </span>
            <span>{formatRupiah(item.product.price * item.quantity)}</span>
          </div>
        ))}
      </div>
      <div className="border-t pt-2">
        <div className="flex justify-between mb-2">
          <span>Subtotal</span>
          <span>{formatRupiah(subtotal)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Shipping</span>
          <span>{formatRupiah(shippingCost)}</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>{formatRupiah(total)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
