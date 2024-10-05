import React from 'react';
import { useCart } from '@/context/CartContext';
import { useOrder } from '@/context/OrderContext';
import { useRouter } from 'next/navigation';
import { formatRupiah } from '@/utils/currencyUtils';
import { toast } from 'react-hot-toast';

const CheckoutSummary = () => {
  const { cart } = useCart();
  const { checkout } = useOrder();
  const router = useRouter();

  const subtotal =
    cart?.items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    ) || 0;

  const total = subtotal;

  const handleCheckout = async () => {
    try {
      router.push('/order/checkout');
    } catch (error) {
      console.error('Navigation to checkout failed', error);
      toast.error('Failed to proceed to checkout, please try again.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      <div className="flex justify-between mb-2">
        <span>Subtotal ({cart?.items.length} Items)</span>
        <span>{formatRupiah(subtotal)}</span>
      </div>
      <div className="border-t pt-4">
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>{formatRupiah(total)}</span>
        </div>
      </div>
      <button
        onClick={handleCheckout}
        className="w-full bg-teal-700 text-white py-3 rounded-lg mt-6 font-semibold hover:bg-teal-800 transition-colors"
      >
        PROCEED TO CHECKOUT
      </button>
    </div>
  );
};

export default CheckoutSummary;
