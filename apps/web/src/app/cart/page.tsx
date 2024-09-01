'use client';

import { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import Link from 'next/link';
import EmptyCart from '@/components/EmptyCart';
import { ArrowLeft, Trash2 } from 'lucide-react';
import CheckoutSummary from '@/components/CheckOutSummary';
import WithAuth from '@/components/WithAuth';
import { formatRupiah } from '@/utils/currencyUtils';

const CartPage = () => {
  const { cart, fetchCart, updateItemQuantity, removeItem } = useCart();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    fetchCart()
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    try {
      await updateItemQuantity(itemId, newQuantity);
    } catch (err) {
      setError('Failed to update item. Please try again.');
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      await removeItem(itemId);
    } catch (err) {
      setError('Failed to remove item. Please try again.');
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!cart || cart.items.length === 0) return <EmptyCart />;

  const totalPrice = cart.items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  return (
    <div className="container mx-6 p-4">
      <div className="-my-4 mb-10">
        <h1 className="text-2xl font-semibold mb-4">YOUR SHOPPING CART</h1>
        <div className="mb-8 w-fit">
          <Link
            href="/"
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return to shop
          </Link>
        </div>
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 text-xs">PRODUCT</th>
            <th className="text-left py-2 text-xs">PRICE</th>
            <th className="text-left py-2 text-xs">QUANTITY</th>
            <th className="text-left py-2 text-xs">TOTAL</th>
            <th className="text-left py-2 text-xs"></th>
          </tr>
        </thead>
        <tbody>
          {cart.items.map((item) => (
            <tr key={item.id} className="border-b">
              <td className="py-4">
                <div className="flex items-center">
                  <span>{item.product.name}</span>
                </div>
              </td>
              <td className="py-4">{formatRupiah(item.product.price)}</td>
              <td className="py-4">
                <div className="flex items-center">
                  <button
                    onClick={() =>
                      handleUpdateQuantity(
                        item.id,
                        Math.max(1, item.quantity - 1),
                      )
                    }
                    className="px-[11px] py-1 bg-gray-200 rounded-full"
                  >
                    -
                  </button>
                  <span className="mx-2">{item.quantity}</span>
                  <button
                    onClick={() =>
                      handleUpdateQuantity(item.id, item.quantity + 1)
                    }
                    className="px-[10px] py-1 bg-gray-200 rounded-full"
                  >
                    +
                  </button>
                </div>
              </td>
              <td className="py-4">
                {formatRupiah(item.product.price * item.quantity)}
              </td>
              <td className="py-4">
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-red-500"
                >
                  <Trash2 size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="md:w-1/3 ml-auto">
        <CheckoutSummary />
      </div>
    </div>
  );
};

export default WithAuth(CartPage);
