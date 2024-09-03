import React from 'react';
// import { useCart } from '@/lib/CartContext';
import { useCart } from '@/context/CartContext';
import { formatRupiah } from '@/utils/currencyUtils';

const CheckoutSummary = () => {
  const { cart } = useCart();

  const subtotal =
    cart?.items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    ) || 0;
  const shippingCosts = 3.99;
  const total = subtotal + shippingCosts;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      <div className="flex justify-between mb-2">
        <span>Subtotal ({cart?.items.length} Items)</span>
        <span>{formatRupiah(subtotal)}</span>
      </div>
      <div className="flex justify-between mb-4">
        <span>Shipping Costs</span>
        <span>+{formatRupiah(shippingCosts)}</span>
      </div>
      <div className="border-t pt-4">
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>{formatRupiah(total)}</span>
        </div>
      </div>
      <button className="w-full bg-teal-700 text-white py-3 rounded-lg mt-6 font-semibold hover:bg-teal-800 transition-colors">
        SECURE CHECKOUT
      </button>
    </div>
  );
};

export default CheckoutSummary;
